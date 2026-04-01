import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'
import { createHash } from 'crypto'
import { z } from 'zod'

const Schema = z.object({
  email: z.string().email('Invalid email address'),
  code:  z.string().length(6, 'Verification code must be 6 characters'),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Schema>
  try {
    body = Schema.parse(await req.json())
  } catch (e: any) {
    return NextResponse.json({ error: e.errors?.[0]?.message || 'Invalid input' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      verificationToken: true,
      verificationExpires: true,
      emailVerified: true
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (user.emailVerified) {
    return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
  }

  if (!user.verificationToken || !user.verificationExpires) {
    return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 })
  }

  if (user.verificationExpires < new Date()) {
    return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 })
  }

  const expectedToken = createHash('sha256').update(body.code + process.env.NEXTAUTH_SECRET).digest('hex')

  if (user.verificationToken !== expectedToken) {
    return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
  }

  // Mark email as verified and clear verification fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationExpires: null,
    },
  })

  return NextResponse.json({
    message: 'Email verified successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: true,
    },
  })
}