import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'

// GET /api/v1/executions — list executions
export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth(req)
  if (error) return error

  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const workflowId = url.searchParams.get('workflowId')

  const executions = await prisma.execution.findMany({
    where: {
      userId,
      ...(workflowId ? { workflowId } : {}),
    },
    select: {
      id: true,
      workflowId: true,
      status: true,
      triggerType: true,
      startedAt: true,
      finishedAt: true,
      durationMs: true,
      errorMessage: true,
    },
    orderBy: { startedAt: 'desc' },
    take: Math.min(limit, 100),
  })

  return NextResponse.json({ data: executions })
}