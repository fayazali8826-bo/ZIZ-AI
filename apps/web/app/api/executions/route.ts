import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'

export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const url    = new URL(req.url)
  const limit  = parseInt(url.searchParams.get('limit')  || '50')
  const status = url.searchParams.get('status')
  const wfId   = url.searchParams.get('workflowId')

  const executions = await prisma.execution.findMany({
    where: {
      userId,
      ...(status ? { status: status.toUpperCase() as any } : {}),
      ...(wfId   ? { workflowId: wfId }                   : {}),
    },
    orderBy: { startedAt: 'desc' },
    take: Math.min(limit, 200),
    select: {
      id: true, workflowId: true, status: true, triggerType: true,
      startedAt: true, finishedAt: true, durationMs: true,
      errorMessage: true, suggestedFix: true, retryCount: true,
      workflow: { select: { id: true, name: true, triggerType: true } },
    },
  })

  return NextResponse.json({ data: executions })
}
