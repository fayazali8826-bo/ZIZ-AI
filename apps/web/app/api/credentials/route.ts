import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'
import { encryptCredential } from '@ziz/shared/src/encryption'

export async function GET(_: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const credentials = await prisma.credential.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, service: true, authType: true,
      isVerified: true, lastTestedAt: true, lastTestError: true, createdAt: true,
    },
  })

  return NextResponse.json({ data: credentials })
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const { name, service, authType, data } = body

  if (!service || !data) {
    return NextResponse.json({ error: 'service and data are required' }, { status: 400 })
  }

  const { encryptedData, iv } = encryptCredential(data)

  const credential = await prisma.credential.create({
    data: {
      userId,
      name:          name || `My ${service}`,
      service:       service.toLowerCase(),
      authType:      authType || 'api_key',
      encryptedData,
      iv,
      isVerified:    false,
    },
    select: {
      id: true, name: true, service: true, authType: true,
      isVerified: true, createdAt: true,
    },
  })

  return NextResponse.json({ data: credential }, { status: 201 })
}
