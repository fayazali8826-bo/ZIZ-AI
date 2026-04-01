import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, checkUsageLimit, incrementUsage } from '@/lib/auth'
import { prisma } from '@ziz/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const wf = await prisma.workflow.findFirst({ where: { id: params.id, userId } })
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const usage = await checkUsageLimit(userId)
  if (!usage.allowed) return NextResponse.json({ error: usage.reason }, { status: 429 })

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

  await incrementUsage(userId)

  return NextResponse.json({ data: { executionId: execution.id, status: 'pending' } })
}
