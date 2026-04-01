import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, checkUsageLimit, incrementUsage } from '@/lib/auth'
import { prisma } from '@ziz/db'
import { randomBytes } from 'crypto'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const wf = await prisma.workflow.findFirst({
    where: { id: params.id, userId },
    include: {
      executions: {
        orderBy: { startedAt: 'desc' },
        take: 10,
        select: { id: true, status: true, startedAt: true, finishedAt: true, durationMs: true, errorMessage: true, suggestedFix: true },
      },
    },
  })

  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: wf })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const wf = await prisma.workflow.findFirst({ where: { id: params.id, userId } })
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.workflow.update({
    where: { id: params.id },
    data: {
      ...(body.definition ? {
        definition:  body.definition,
        name:        body.definition.name || wf.name,
        description: body.definition.description || wf.description,
        triggerType: body.definition.trigger?.type || wf.triggerType,
      } : {}),
      ...(body.status ? { status: body.status } : {}),
    },
  })

  return NextResponse.json({ data: updated })
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const wf = await prisma.workflow.findFirst({ where: { id: params.id, userId } })
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.workflow.delete({ where: { id: params.id } })
  return NextResponse.json({ data: { deleted: true } })
}

// POST /api/workflows/[id]/activate
export async function POST(req: NextRequest, { params }: Params) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const url = new URL(req.url)
  const action = url.pathname.split('/').pop()

  const wf = await prisma.workflow.findFirst({ where: { id: params.id, userId } })
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'activate') {
    const webhookPath = wf.triggerType?.includes('webhook') || wf.triggerType?.includes('stripe')
      ? (wf.webhookPath || '/api/webhooks/' + randomBytes(10).toString('hex'))
      : null

    const updated = await prisma.workflow.update({
      where: { id: params.id },
      data: { status: 'ACTIVE', webhookPath: webhookPath || undefined },
    })

    return NextResponse.json({
      data: {
        ...updated,
        webhookUrl: webhookPath ? `${process.env.NEXTAUTH_URL}${webhookPath}` : null,
      },
    })
  }

  if (action === 'pause') {
    const updated = await prisma.workflow.update({
      where: { id: params.id },
      data: { status: 'PAUSED' },
    })
    return NextResponse.json({ data: updated })
  }

  if (action === 'run') {
    // Check usage limits
    const usage = await checkUsageLimit(userId)
    if (!usage.allowed) {
      return NextResponse.json({ error: usage.reason }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}))

    const execution = await prisma.execution.create({
      data: {
        workflowId:  params.id,
        userId,
        status:      'PENDING',
        triggerType: 'manual',
        triggerData: { ...body.testData, _manual: true, _triggeredAt: new Date().toISOString() },
        stepResults: [],
      },
    })

    // Increment usage counter
    await incrementUsage(userId)

    return NextResponse.json({ data: { executionId: execution.id, status: 'pending' } })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
