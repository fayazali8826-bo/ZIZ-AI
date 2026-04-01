import * as fs from 'fs'
import * as path from 'path'

// Load .env from engine folder or root
for (const p of ['.env', '../../.env']) {
  const full = path.resolve(process.cwd(), p)
  if (fs.existsSync(full)) {
    const lines = fs.readFileSync(full, 'utf8').split('\n')
    for (const line of lines) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const key = t.slice(0, eq).trim()
      let val = t.slice(eq + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (!process.env[key]) process.env[key] = val
    }
    break
  }
}

console.log('[Ziz Worker] Starting...')
console.log('[Ziz Worker] Node ' + process.version)
console.log('[Ziz Worker] DB:        ' + (process.env.DATABASE_URL    ? 'configured' : 'NOT SET'))
console.log('[Ziz Worker] Anthropic: ' + (process.env.ANTHROPIC_API_KEY ? 'configured' : 'NOT SET'))
console.log('[Ziz Worker] Encryption:' + (process.env.ENCRYPTION_KEY  ? 'configured' : 'NOT SET'))

import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import Anthropic from '@anthropic-ai/sdk'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── TEMPLATE RESOLVER ─────────────────────────────────────────────────
function resolveTemplate(template: string, context: { trigger: any; steps: Record<string, any> }): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
    const parts = expr.trim().split('.')
    if (parts[0] === 'trigger') {
      let val: any = context.trigger
      for (const p of parts.slice(1)) val = val?.[p]
      return val != null ? String(val) : match
    }
    if (parts[0] === 'steps' && parts.length >= 3) {
      let val: any = context.steps[parts[1]]
      for (const p of parts.slice(2)) val = val?.[p]
      return val != null ? String(val) : match
    }
    return match
  })
}

function resolveConfig(config: any, context: any): any {
  return JSON.parse(resolveTemplate(JSON.stringify(config), context))
}

// ── DECRYPT CREDENTIALS ──────────────────────────────────────────────
function decryptCredential(encryptedData: string, iv: string): Record<string, string> {
  const { createDecipheriv, scryptSync } = require('crypto')
  const key      = scryptSync(process.env.ENCRYPTION_KEY!, 'ziz-credential-salt-v1', 32)
  const ivBuf    = Buffer.from(iv, 'base64')
  const combined = Buffer.from(encryptedData, 'base64')
  const TAG_LEN  = 16
  const encrypted = combined.slice(0, combined.length - TAG_LEN)
  const tag       = combined.slice(combined.length - TAG_LEN)
  const decipher  = createDecipheriv('aes-256-gcm', key, ivBuf)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return JSON.parse(dec.toString('utf8'))
}

// ── LOAD CREDENTIALS ─────────────────────────────────────────────────
async function loadCreds(credentialId: string, userId: string): Promise<Record<string, string>> {
  if (!credentialId || credentialId === 'CREDENTIAL_ID_PLACEHOLDER') return {}
  const cred = await prisma.credential.findFirst({ where: { id: credentialId, userId } })
  if (!cred) throw new Error(`Credential ${credentialId} not found. Go to Credentials and connect this service.`)
  return decryptCredential(cred.encryptedData, cred.iv)
}

// ── STEP EXECUTORS ────────────────────────────────────────────────────

async function execSlack(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.botToken) throw new Error('Slack Bot Token is missing. Go to Credentials and connect Slack.')
  const channel = cfg.channel.startsWith('#') || cfg.channel.startsWith('C') ? cfg.channel : '#' + cfg.channel
  const res = await axios.post('https://slack.com/api/chat.postMessage',
    { channel, text: cfg.message, username: cfg.username || 'Ziz', icon_emoji: ':zap:', mrkdwn: true },
    { headers: { Authorization: `Bearer ${creds.botToken}` }, timeout: 10000 }
  )
  if (!res.data.ok) throw new Error(`Slack error: ${res.data.error}`)
  return { messageTs: res.data.ts, channel: res.data.channel }
}

async function execGmailSend(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.serviceAccountJson) throw new Error('Gmail service account JSON is missing.')
  const { google } = await import('googleapis')
  const serviceAccount = JSON.parse(creds.serviceAccountJson)
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    clientOptions: { subject: creds.delegatedEmail },
  })
  const gmail = google.gmail({ version: 'v1', auth })
  const raw = [
    `To: ${cfg.to}`,
    `Subject: ${cfg.subject}`,
    cfg.cc  ? `Cc: ${cfg.cc}`   : null,
    'MIME-Version: 1.0',
    `Content-Type: ${cfg.isHtml !== false ? 'text/html' : 'text/plain'}; charset=utf-8`,
    '', cfg.body,
  ].filter(Boolean).join('\r\n')
  const result = await gmail.users.messages.send({
    userId: 'me', requestBody: { raw: Buffer.from(raw).toString('base64url') }
  })
  return { messageId: result.data.id, to: cfg.to }
}

async function execSheets(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.serviceAccountJson) throw new Error('Google Sheets service account JSON is missing.')
  const { google } = await import('googleapis')
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(creds.serviceAccountJson),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  const values = Object.values(cfg.rowData || {})
  await sheets.spreadsheets.values.append({
    spreadsheetId: cfg.spreadsheetId,
    range: `${cfg.sheetName || 'Sheet1'}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
  return { appended: true, rows: 1, spreadsheetId: cfg.spreadsheetId }
}

async function execHubSpotContact(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.accessToken) throw new Error('HubSpot access token is missing.')
  const headers = { Authorization: `Bearer ${creds.accessToken}`, 'Content-Type': 'application/json' }
  // Upsert by email
  const email = cfg.properties?.email
  if (email) {
    try {
      const search = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts/search',
        { filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }] },
        { headers, timeout: 10000 }
      )
      if (search.data.results?.length > 0) {
        const id = search.data.results[0].id
        await axios.patch(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, { properties: cfg.properties }, { headers, timeout: 10000 })
        return { contactId: id, action: 'updated' }
      }
    } catch {}
  }
  const res = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', { properties: cfg.properties }, { headers, timeout: 10000 })
  return { contactId: res.data.id, action: 'created' }
}

async function execNotion(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.apiKey) throw new Error('Notion API key is missing.')
  const headers = { Authorization: `Bearer ${creds.apiKey}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' }
  const properties: any = {}
  for (const [key, value] of Object.entries(cfg.properties || {})) {
    if (key.toLowerCase() === 'title' || key.toLowerCase() === 'name') {
      properties[key] = { title: [{ text: { content: String(value) } }] }
    } else {
      properties[key] = { rich_text: [{ text: { content: String(value) } }] }
    }
  }
  const body: any = { parent: { database_id: cfg.databaseId }, properties }
  if (cfg.content) body.children = [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: cfg.content } }] } }]
  const res = await axios.post('https://api.notion.com/v1/pages', body, { headers, timeout: 15000 })
  return { pageId: res.data.id, pageUrl: res.data.url }
}

async function execAirtable(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.apiKey) throw new Error('Airtable Personal Access Token is missing.')
  const headers = { Authorization: `Bearer ${creds.apiKey}`, 'Content-Type': 'application/json' }
  const tableRef = cfg.tableId || encodeURIComponent(cfg.tableName)
  const res = await axios.post(
    `https://api.airtable.com/v0/${cfg.baseId}/${tableRef}`,
    { fields: cfg.fields || cfg.rowData || {} },
    { headers, timeout: 15000 }
  )
  return { recordId: res.data.id, fields: res.data.fields }
}

async function execStripeInvoice(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.secretKey) throw new Error('Stripe Secret Key is missing.')
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(creds.secretKey, { apiVersion: '2024-06-20' as any })
  let customerId = cfg.customerId
  if (!customerId && cfg.customerEmail) {
    const existing = await stripe.customers.list({ email: cfg.customerEmail, limit: 1 })
    if (existing.data.length > 0) {
      customerId = existing.data[0].id
    } else {
      const cust = await stripe.customers.create({ email: cfg.customerEmail, name: cfg.customerName })
      customerId = cust.id
    }
  }
  const invoice = await stripe.invoices.create({ customer: customerId, auto_advance: false, collection_method: 'send_invoice', days_until_due: cfg.daysUntilDue || 30 })
  if (cfg.amount) {
    await stripe.invoiceItems.create({ customer: customerId, invoice: invoice.id, amount: Math.round(Number(cfg.amount) * 100), currency: cfg.currency || 'usd', description: cfg.description || '' })
  }
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id)
  if (cfg.sendEmail !== false) await stripe.invoices.sendInvoice(invoice.id)
  return { invoiceId: finalized.id, invoiceUrl: finalized.hosted_invoice_url, amount: (finalized.amount_due || 0) / 100 }
}

async function execWhatsApp(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.accessToken || !creds.phoneNumberId) throw new Error('WhatsApp credentials are missing.')
  let to = String(cfg.to).replace(/\s+/g, '').replace(/[^\d]/g, '')
  const res = await axios.post(
    `https://graph.facebook.com/v18.0/${creds.phoneNumberId}/messages`,
    { messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'text', text: { body: cfg.message } },
    { headers: { Authorization: `Bearer ${creds.accessToken}`, 'Content-Type': 'application/json' }, timeout: 15000 }
  )
  return { messageId: res.data.messages?.[0]?.id, to }
}

async function execTelegram(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  if (!creds.botToken) throw new Error('Telegram Bot Token is missing.')
  const chatId = cfg.chatId || creds.defaultChatId
  if (!chatId) throw new Error('Telegram Chat ID is required.')
  const res = await axios.post(`https://api.telegram.org/bot${creds.botToken}/sendMessage`,
    { chat_id: chatId, text: cfg.message, parse_mode: 'Markdown' }, { timeout: 10000 }
  )
  if (!res.data.ok) throw new Error(res.data.description)
  return { messageId: res.data.result?.message_id, chatId }
}

async function execHttp(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  const headers: Record<string, string> = { ...cfg.headers }
  if (creds.apiKey && creds.authHeader) headers[creds.authHeader] = creds.apiKey
  else if (creds.apiKey) headers['Authorization'] = `Bearer ${creds.apiKey}`
  const res = await axios({
    method: (cfg.method || 'GET').toLowerCase(),
    url: cfg.url,
    headers, data: cfg.body, timeout: 20000,
  })
  return { status: res.status, data: res.data }
}

async function execFilter(step: any, context: any) {
  const cfg = step.config
  const results = (cfg.conditions || []).map((c: any) => {
    const val = resolveTemplate(c.field, context)
    switch (c.operator) {
      case 'equals':       return String(val) === c.value
      case 'not_equals':   return String(val) !== c.value
      case 'contains':     return String(val).toLowerCase().includes(c.value.toLowerCase())
      case 'not_contains': return !String(val).toLowerCase().includes(c.value.toLowerCase())
      case 'greater_than': return Number(val) > Number(c.value)
      case 'less_than':    return Number(val) < Number(c.value)
      case 'exists':       return val !== undefined && val !== null && val !== ''
      case 'is_empty':     return !val || val === ''
      default:             return false
    }
  })
  const passed = cfg.logic === 'OR' ? results.some(Boolean) : results.every(Boolean)
  return { _skipped: !passed, passed }
}

async function execFormatText(step: any, context: any) {
  const cfg = resolveConfig(step.config, context)
  const text = cfg.template ? resolveTemplate(cfg.template, context) : ''
  return { text, formatted: text }
}

async function execAiTransform(step: any, context: any) {
  const cfg = resolveConfig(step.config, context)
  const prompt = resolveTemplate(cfg.prompt || '', context)
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514', max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })
  const result = res.content[0].type === 'text' ? res.content[0].text : ''
  return { [cfg.outputField || 'result']: result, aiResult: result }
}

async function execAiAgent(step: any, context: any, creds: any) {
  const cfg = resolveConfig(step.config, context)
  const goal = resolveTemplate(cfg.goal || '', context)
  const tools: Anthropic.Tool[] = [
    {
      name: 'search_web', description: 'Search the internet',
      input_schema: { type: 'object' as const, properties: { query: { type: 'string' } }, required: ['query'] },
    },
    {
      name: 'send_slack', description: 'Send a Slack message',
      input_schema: { type: 'object' as const, properties: { channel: { type: 'string' }, message: { type: 'string' } }, required: ['channel', 'message'] },
    },
  ]
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: `Complete this goal: ${goal}` }]
  let result = ''
  for (let i = 0; i < (cfg.maxIterations || 5); i++) {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 2048,
      system: 'You are an autonomous AI agent inside a business workflow. Complete the goal efficiently.',
      tools, messages,
    })
    const textBlock = res.content.find(b => b.type === 'text')
    if (textBlock?.type === 'text') result = textBlock.text
    if (res.stop_reason === 'end_turn') break
    if (res.stop_reason !== 'tool_use') break
    messages.push({ role: 'assistant', content: res.content })
    const toolResults: Anthropic.ToolResultBlockParam[] = res.content
      .filter(b => b.type === 'tool_use')
      .map(b => ({
        type: 'tool_result' as const,
        tool_use_id: (b as Anthropic.ToolUseBlock).id,
        content: `Tool ${(b as Anthropic.ToolUseBlock).name} called successfully`,
      }))
    messages.push({ role: 'user', content: toolResults })
  }
  return { [cfg.outputField || 'result']: result, aiResult: result }
}

// ── ROUTE STEP TO EXECUTOR ────────────────────────────────────────────
async function executeStep(step: any, context: any, userId: string): Promise<any> {
  const startedAt = new Date()
  let output: any
  let skipped = false

  const creds = await loadCreds(step.credentialId, userId)

  switch (step.type) {
    case 'slack_send_message':
    case 'slack_create_channel':
      output = await execSlack(step, context, creds); break

    case 'gmail_send_email':
    case 'gmail_reply':
      output = await execGmailSend(step, context, creds); break

    case 'google_sheets_append_row':
    case 'google_sheets_update_row':
      output = await execSheets(step, context, creds); break

    case 'hubspot_create_contact':
    case 'hubspot_update_contact':
      output = await execHubSpotContact(step, context, creds); break

    case 'notion_create_page':
    case 'notion_update_page':
      output = await execNotion(step, context, creds); break

    case 'airtable_create_record':
    case 'airtable_update_record':
      output = await execAirtable(step, context, creds); break

    case 'stripe_create_invoice':
      output = await execStripeInvoice(step, context, creds); break

    case 'whatsapp_send_message':
      output = await execWhatsApp(step, context, creds); break

    case 'telegram_send_message':
      output = await execTelegram(step, context, creds); break

    case 'http_request':
    case 'webhook_outbound':
    case 'graphql_request':
      output = await execHttp(step, context, creds); break

    case 'filter':
      output = await execFilter(step, context)
      skipped = output._skipped
      break

    case 'format_text':
    case 'transform_data':
      output = await execFormatText(step, context); break

    case 'delay':
      await new Promise(r => setTimeout(r, Math.min(step.config?.durationMs || 1000, 300000)))
      output = { waited: true }; break

    case 'ai_transform':
    case 'ai_summarize':
    case 'ai_translate':
    case 'ai_classify':
    case 'ai_extract':
      output = await execAiTransform(step, context); break

    case 'ai_agent':
      output = await execAiAgent(step, context, creds); break

    default:
      console.warn(`[Worker] Unknown step type: ${step.type}, skipping`)
      output = {}
  }

  const finishedAt = new Date()
  return {
    stepId:     step.id,
    stepName:   step.name,
    status:     skipped ? 'skipped' : 'success',
    startedAt, finishedAt,
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    output,
    retryCount: 0,
  }
}

// ── EXPLAIN ERROR WITH CLAUDE ─────────────────────────────────────────
async function explainError(workflowName: string, stepName: string, error: string) {
  try {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 200,
      system: 'Explain technical errors to non-technical business owners in 1 plain sentence. No jargon. Give ONE fix action. Respond ONLY as JSON: {"plainMessage":"...","suggestedFix":"..."}',
      messages: [{ role: 'user', content: `Workflow: "${workflowName}" | Step: "${stepName}" | Error: ${error}` }],
    })
    const raw = res.content[0].type === 'text' ? res.content[0].text : '{}'
    return JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim())
  } catch {
    return { plainMessage: 'Something went wrong with this step.', suggestedFix: 'Check your credentials and try running again.' }
  }
}

// ── MAIN EXECUTION LOOP ───────────────────────────────────────────────
async function processExecution(execution: any) {
  const workflow = execution.workflow
  const def      = workflow.definition as any
  const context  = { trigger: execution.triggerData as any, steps: {} as Record<string, any> }
  const results: any[] = []

  await prisma.execution.update({ where: { id: execution.id }, data: { status: 'RUNNING' } })

  let failed = false
  let errorMsg = null
  let suggestedFix = null

  for (const step of (def.steps || [])) {
    console.log(`  [Step] ${step.name} (${step.type})`)
    try {
      const result = await executeStep(step, context, execution.userId)
      results.push(result)
      if (result.status === 'success' && result.output) {
        context.steps[step.id] = result.output
      }
      if (result.status === 'skipped') {
        console.log(`  [Step] Skipped — filter condition not met`)
        break
      }
    } catch (e: any) {
      console.error(`  [Step] FAILED: ${e.message}`)
      const explanation = await explainError(workflow.name, step.name, e.message)
      results.push({
        stepId: step.id, stepName: step.name, status: 'failed',
        startedAt: new Date(), finishedAt: new Date(), durationMs: 0,
        error: { message: explanation.plainMessage, technicalMessage: e.message }, retryCount: 0,
      })
      failed = true
      errorMsg    = explanation.plainMessage
      suggestedFix = explanation.suggestedFix
      if (!def.settings?.continueOnError && !step.continueOnError) break
    }
  }

  const finishedAt = new Date()
  const durationMs = finishedAt.getTime() - new Date(execution.startedAt).getTime()

  await prisma.execution.update({
    where: { id: execution.id },
    data: {
      status:       failed ? 'FAILED' : 'SUCCESS',
      stepResults:  results,
      finishedAt,
      durationMs,
      errorMessage: errorMsg,
      suggestedFix,
    },
  })

  await prisma.workflow.update({
    where: { id: execution.workflowId },
    data: {
      lastRunAt:  finishedAt,
      runCount:   { increment: 1 },
      ...(failed ? { errorCount: { increment: 1 } } : {}),
    },
  })

  console.log(`[Worker] Execution ${execution.id} — ${failed ? 'FAILED' : 'SUCCESS'} (${durationMs}ms)`)
}

// ── POLLING LOOP ──────────────────────────────────────────────────────
async function poll() {
  try {
    const pending = await prisma.execution.findMany({
      where: { status: 'PENDING' },
      orderBy: { startedAt: 'asc' },
      take: 5,
      include: { workflow: true },
    })

    for (const execution of pending) {
      console.log(`\n[Worker] Processing: ${execution.workflow.name}`)
      await processExecution(execution).catch(async (e) => {
        console.error(`[Worker] Unhandled error: ${e.message}`)
        await prisma.execution.update({
          where: { id: execution.id },
          data: { status: 'FAILED', errorMessage: e.message, finishedAt: new Date() },
        }).catch(() => {})
      })
    }
  } catch (e: any) {
    console.error(`[Worker] Poll error: ${e.message}`)
  }
}

// Start
console.log('[Ziz Worker] Ready — polling every 2 seconds')
setInterval(poll, 2000)
poll()

process.on('SIGINT',  async () => { await prisma.$disconnect(); process.exit(0) })
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0) })
process.on('uncaughtException', (e) => console.error('[Worker] Uncaught:', e.message))
