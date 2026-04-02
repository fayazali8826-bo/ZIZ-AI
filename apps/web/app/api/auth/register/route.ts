import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'
import { createHash } from 'crypto'
import { z } from 'zod'

const Schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name:     z.string().optional(),
  plan:     z.enum(['free', 'pro', 'business']).optional(),
})

function hashPassword(p: string): string {
  return createHash('sha256').update(p + process.env.NEXTAUTH_SECRET).digest('hex')
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Schema>
  try {
    body = Schema.parse(await req.json())
  } catch (e: any) {
    return NextResponse.json({ error: e.errors?.[0]?.message || 'Invalid input' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists. Try signing in.' }, { status: 409 })
  }

  const planMap: Record<string, 'FREE' | 'PRO' | 'BUSINESS'> = {
    free: 'FREE', pro: 'PRO', business: 'BUSINESS',
  }

  await prisma.user.create({
    data: {
      email:          body.email.toLowerCase(),
      name:           body.name || null,
      hashedPassword: hashPassword(body.password),
      plan:           planMap[body.plan || 'free'] || 'FREE',
      runsResetAt:    new Date(),
      emailVerified:  new Date(), // auto-verify
    },
  })

  return NextResponse.json({ message: 'Account created successfully' })
}