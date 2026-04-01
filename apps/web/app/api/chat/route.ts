import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'
import { chat } from '@ziz/shared/src/claude'
import type { ChatMessage } from '@ziz/shared/src/types'

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { message, sessionId, workflowId } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  // Load or create chat session
  let session = sessionId
    ? await prisma.chatSession.findFirst({ where: { id: sessionId, userId } })
    : null

  if (!session) {
    session = await prisma.chatSession.create({
      data: { userId, workflowId: workflowId || null, messages: [] },
    })
  }

  const history: ChatMessage[] = Array.isArray(session.messages) ? (session.messages as unknown as ChatMessage[]) : []

  // Get connected services for context
  const credentials = await prisma.credential.findMany({
    where: { userId, isVerified: true },
    select: { id: true, service: true },
  })
  const connectedServices = credentials.map(c => c.service)
  const credentialMap = Object.fromEntries(credentials.map(c => [c.service, c.id]))

  // Call Claude
  const response = await chat(history, message, connectedServices)

  // Save workflow if AI built one
  let savedWorkflowId = workflowId
  if (response.type === 'workflow' && response.workflow) {
    // Replace credential placeholders with actual IDs
    const workflowDef = { ...response.workflow }
    if (workflowDef.steps) {
      workflowDef.steps = workflowDef.steps.map(step => ({
        ...step,
        credentialId: step.credentialId === 'CREDENTIAL_ID_PLACEHOLDER' 
          ? credentialMap[step.type.split('_')[0]] || step.credentialId 
          : step.credentialId
      }))
    }

    const workflowJson = JSON.parse(JSON.stringify(workflowDef)) as any

    if (workflowId) {
      // Update existing
      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          definition:  workflowJson,
          name:        workflowDef.name,
          description: workflowDef.description,
          triggerType: workflowDef.trigger?.type,
        },
      })
    } else {
      // Create new
      const wf = await prisma.workflow.create({
        data: {
          userId,
          name:        workflowDef.name,
          description: workflowDef.description || '',
          status:      'DRAFT',
          definition:  workflowJson,
          triggerType: workflowDef.trigger?.type,
        },
      })
      savedWorkflowId = wf.id
    }
  }

  // Update chat history
  const newHistory: ChatMessage[] = [
    ...history,
    { role: 'user',      content: message,          timestamp: new Date().toISOString() },
    { role: 'assistant', content: response.message, timestamp: new Date().toISOString() },
  ]

  await prisma.chatSession.update({
    where:  { id: session.id },
    data:   { messages: newHistory as any, workflowId: savedWorkflowId || null },
  })

  return NextResponse.json({
    response,
    sessionId:  session.id,
    workflowId: savedWorkflowId,
  })
}
