import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, checkUsageLimit, incrementUsage } from '@/lib/auth'
import { prisma } from '@ziz/db'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const wf = await prisma.workflow.findFirst({ where: { id: params.id, userId } })
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const webhookPath = (wf.triggerType?.includes('webhook') || wf.triggerType?.includes('stripe') || wf.triggerType?.includes('typeform'))
    ? (wf.webhookPath || '/api/webhooks/' + randomBytes(10).toString('hex'))
    : null

  const updated = await prisma.workflow.update({
    where: { id: params.id },
    data:  { status: 'ACTIVE', ...(webhookPath ? { webhookPath } : {}) },
  })

  return NextResponse.json({
    data: {
      ...updated,
      webhookUrl: webhookPath ? `${process.env.NEXTAUTH_URL}${webhookPath}` : null,
    },
  })
}
