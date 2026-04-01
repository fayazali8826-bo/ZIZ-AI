import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'
import { incrementUsage, checkUsageLimit } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { path: string } }) {
  const webhookPath = '/api/webhooks/' + params.path
  const rawBody     = await req.text()

  const workflow = await prisma.workflow.findFirst({
    where: { webhookPath, status: 'ACTIVE' },
  })

  // Always return 200 immediately (don't let external services retry)
  if (!workflow) return NextResponse.json({ received: true })

  // Check usage limit
  const usage = await checkUsageLimit(workflow.userId)
  if (!usage.allowed) {
    // Log it but still return 200 to avoid retries
    console.warn(`Usage limit hit for user ${workflow.userId}`)
    return NextResponse.json({ received: true, limited: true })
  }

  let triggerData: Record<string, unknown>
  try   { triggerData = JSON.parse(rawBody) }
  catch { triggerData = { rawBody, contentType: req.headers.get('content-type') } }

  // Enrich Stripe data
  if (workflow.triggerType?.startsWith('stripe_')) {
    const event = triggerData as any
    if (event.data?.object) {
      const obj = event.data.object
      triggerData = {
        ...obj,
        event_type:          event.type,
        amount_dollars:      obj.amount ? (obj.amount / 100).toFixed(2) : undefined,
        amount_formatted:    obj.amount ? `$${(obj.amount / 100).toFixed(2)}` : undefined,
        customer_email:      obj.customer_email || obj.receipt_email,
        customer_name:       obj.billing_details?.name || obj.customer_name,
      }
    }
  }

  const execution = await prisma.execution.create({
    data: {
      workflowId:  workflow.id,
      userId:      workflow.userId,
      status:      'PENDING',
      triggerType: workflow.triggerType || 'webhook_inbound',
      triggerData: { ...triggerData, _webhookPath: webhookPath, _receivedAt: new Date().toISOString() },
      stepResults: [],
    },
  })

  await incrementUsage(workflow.userId)

  return NextResponse.json({ received: true, executionId: execution.id })
}

// Also handle GET for webhook verification (Stripe, etc.)
export async function GET(req: NextRequest, { params }: { params: { path: string } }) {
  const url = new URL(req.url)
  const challenge = url.searchParams.get('hub.challenge')
  if (challenge) return new Response(challenge, { status: 200 })
  return NextResponse.json({ status: 'ok' })
}
