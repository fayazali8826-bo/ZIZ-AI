import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'
import { createHash, randomBytes } from 'crypto'

function generateApiKey(): string {
  return 'ziz_' + randomBytes(32).toString('hex')
}

function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

// GET /api/keys — list all API keys for the user
export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      lastUsed: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: keys })
}

// POST /api/keys — create a new API key
export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json().catch(() => ({}))
  const name = body.name || 'My API Key'

  const rawKey = generateApiKey()
  const keyHash = hashApiKey(rawKey)

  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      name,
      keyHash,
    },
  })

  // Return the raw key ONCE — we never store it plain
  return NextResponse.json({
    data: {
      id: apiKey.id,
      name: apiKey.name,
      key: rawKey, // shown only once!
      createdAt: apiKey.createdAt,
    },
  })
}

// DELETE /api/keys — revoke a key by id
export async function DELETE(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json().catch(() => ({}))
  if (!body.id) return NextResponse.json({ error: 'Key ID required' }, { status: 400 })

  const key = await prisma.apiKey.findFirst({
    where: { id: body.id, userId },
  })

  if (!key) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.apiKey.delete({ where: { id: body.id } })

  return NextResponse.json({ data: { deleted: true } })
}