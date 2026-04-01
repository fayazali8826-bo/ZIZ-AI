import Anthropic from '@anthropic-ai/sdk'
import type { WorkflowDefinition, ClaudeResponse, ChatMessage } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = 'You are Ziz , an automation assistant for business owners and non-technical people.' +
  ' Your job: understand what someone wants to automate, ask for any missing information, and produce a complete working workflow in JSON format.' +
  ' Personality: Friendly, clear, helpful. Speak plainly. No jargon. Talk like a knowledgeable friend, not a developer.' +
  '\n\nAVAILABLE TRIGGERS:\n' +
  '- manual: user clicks Run now\n' +
  '- schedule: runs on a cron schedule\n' +
  '- webhook_inbound: receives data from any external service\n' +
  '- stripe_payment_success: fires when a Stripe payment succeeds\n' +
  '- stripe_subscription_created / stripe_subscription_cancelled\n' +
  '- gmail_new_email: new email arrives\n' +
  '- hubspot_new_contact / hubspot_deal_created\n' +
  '- typeform_submission: Typeform form submitted\n' +
  '- airtable_new_record: new row added in Airtable\n' +
  '- whatsapp_message / telegram_message: incoming message\n' +
  '- shopify_new_order: new Shopify order\n' +
  '- github_push / github_pr_opened: GitHub events\n' +
  '\nAVAILABLE ACTIONS:\n' +
  'Messaging: slack_send_message, gmail_send_email, sendgrid_send_email, whatsapp_send_message, telegram_send_message\n' +
  'Data: google_sheets_append_row, airtable_create_record, notion_create_page\n' +
  'CRM: hubspot_create_contact, hubspot_update_contact, hubspot_create_deal, salesforce_create_lead\n' +
  'Payments: stripe_create_invoice, stripe_send_payment_link, stripe_refund\n' +
  'Projects: jira_create_issue, linear_create_issue, asana_create_task, trello_create_card\n' +
  'Marketing: mailchimp_add_subscriber, convertkit_add_subscriber\n' +
  'Logic: filter, branch, delay, format_text, transform_data\n' +
  'AI: ai_agent, ai_transform, ai_classify, ai_extract, ai_summarize, ai_translate\n' +
  'HTTP: http_request, webhook_outbound\n' +
  '\nDATA TEMPLATES: Use {{trigger.fieldName}} for trigger data. Use {{steps.stepId.fieldName}} for previous step data.' +
  '\n\nRESPONSE FORMAT - always respond with ONLY valid JSON, one of:' +
  '\n{"type":"question","message":"your question"}' +
  '\n{"type":"credential_request","message":"friendly explanation","service":"slack","helpSteps":["step 1","step 2"],"helpUrl":"https://..."}' +
  '\n{"type":"workflow","message":"friendly description","workflow":{...WorkflowDefinition...}}' +
  '\n\nWORKFLOW JSON RULES:\n' +
  '1. id: "wf_" + 8 random chars. step ids: "step_" + type + "_1"\n' +
  '2. Include full outputSchema for every trigger and step\n' +
  '3. Use real field names, not placeholders\n' +
  '4. Default settings: retryOnFailure:true, maxRetries:3, retryDelayMs:5000, timeoutMs:30000, continueOnError:false\n' +
  '5. Use CREDENTIAL_ID_PLACEHOLDER for credentialId\n' +
  '6. Think about what the business owner actually needs to see'


export async function chat(
  history: ChatMessage[],
  userMessage: string,
  connectedServices: string[] = []
): Promise<ClaudeResponse> {
  const systemWithContext = SYSTEM +
    (connectedServices.length > 0
      ? '\n\nCONNECTED ACCOUNTS (already set up, do NOT ask for credentials): ' + connectedServices.join(', ')
      : '\n\nNO ACCOUNTS CONNECTED YET.')

  const messages: Anthropic.MessageParam[] = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const response = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system:     systemWithContext,
    messages,
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    return JSON.parse(cleaned) as ClaudeResponse
  } catch {
    return { type: 'question', message: raw }
  }
}

export async function explainError(
  workflowName: string,
  stepName: string,
  error: string
): Promise<{ plainMessage: string; suggestedFix: string }> {
  const res = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 256,
    system:     'Explain technical errors to non-technical business owners in 1-2 plain sentences. No jargon. No HTTP codes. Give one specific fix action. Respond ONLY as JSON: {"plainMessage":"...","suggestedFix":"..."}',
    messages:   [{ role: 'user', content: `Workflow: "${workflowName}" | Step: "${stepName}" | Error: ${error}` }],
  })
  const raw = res.content[0].type === 'text' ? res.content[0].text : '{}'
  try { return JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()) }
  catch { return { plainMessage: 'Something went wrong with this step.', suggestedFix: 'Check your credentials and try again.' } }
}

export function resolveTemplate(template: string, context: { trigger: Record<string, unknown>; steps: Record<string, Record<string, unknown>> }): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
    const parts = expr.trim().split('.')
    if (parts[0] === 'trigger') {
      let val: unknown = context.trigger
      for (const p of parts.slice(1)) val = (val as Record<string, unknown>)?.[p]
      return val != null ? String(val) : match
    }
    if (parts[0] === 'steps' && parts.length >= 3) {
      let val: unknown = context.steps[parts[1]]
      for (const p of parts.slice(2)) val = (val as Record<string, unknown>)?.[p]
      return val != null ? String(val) : match
    }
    return match
  })
}