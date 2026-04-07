import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'

// GET /api/v1/workflows — list workflows
export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth(req)
  if (error) return error

  const workflows = await prisma.workflow.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      runCount: true,
      lastRunAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: workflows })
}