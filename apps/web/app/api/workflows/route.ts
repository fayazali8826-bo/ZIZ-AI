import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'

export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const workflows = await prisma.workflow.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, name: true, description: true, status: true,
      triggerType: true, webhookPath: true,
      runCount: true, errorCount: true, lastRunAt: true,
      createdAt: true, updatedAt: true, definition: true,
    },
  })

  return NextResponse.json({ data: workflows })
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const { definition } = body

  if (!definition?.name) {
    return NextResponse.json({ error: 'Workflow name is required' }, { status: 400 })
  }

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      name:        definition.name,
      description: definition.description || '',
      status:      'DRAFT',
      definition:  definition,
      triggerType: definition.trigger?.type || null,
    },
  })

  return NextResponse.json({ data: workflow }, { status: 201 })
}
