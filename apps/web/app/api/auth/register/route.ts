import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'
import { createHash } from 'crypto'
import { z } from 'zod'
import { sendEmail, generateVerificationEmailHtml } from '@/lib/email'
import { randomBytes } from 'crypto'

const Schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name:     z.string().optional(),
  plan:     z.enum(['free', 'pro', 'business']).optional(),
})

function hashPassword(p: string): string {
  return createHash('sha256').update(p + process.env.NEXTAUTH_SECRET).digest('hex')
}

function generateVerificationCode(): string {
  return randomBytes(3).toString('hex').toUpperCase() // 6-character code
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
    if (existing.emailVerified) {
      return NextResponse.json({ error: 'An account with this email already exists. Try signing in.' }, { status: 409 })
    } else {
      // Resend verification code for unverified account
      const verificationCode = generateVerificationCode()
      const verificationToken = createHash('sha256').update(verificationCode + process.env.NEXTAUTH_SECRET).digest('hex')
      const verificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      await prisma.user.update({
        where: { email: body.email.toLowerCase() },
        data: {
          verificationToken,
          verificationExpires,
          hashedPassword: hashPassword(body.password), // Update password if changed
          name: body.name || existing.name,
        },
      })

      const emailResult = await sendEmail({
        to: body.email,
        subject: 'Verify Your Email - Ziz',
        html: generateVerificationEmailHtml(verificationCode, body.name),
      })

      if (!emailResult.success) {
        return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Verification code sent to your email',
        email: body.email
      })
    }
  }

  const verificationCode = generateVerificationCode()
  const verificationToken = createHash('sha256').update(verificationCode + process.env.NEXTAUTH_SECRET).digest('hex')
  const verificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  const planMap: Record<string, 'FREE' | 'PRO' | 'BUSINESS'> = {
    free: 'FREE', pro: 'PRO', business: 'BUSINESS',
  }

  const user = await prisma.user.create({
    data: {
      email:              body.email.toLowerCase(),
      name:               body.name || null,
      hashedPassword:     hashPassword(body.password),
      plan:               planMap[body.plan || 'free'] || 'FREE',
      runsResetAt:        new Date(),
      verificationToken,
      verificationExpires,
    },
    select: { id: true, email: true, name: true },
  })

  const emailResult = await sendEmail({
    to: body.email,
    subject: 'Verify Your Email - Ziz',
    html: generateVerificationEmailHtml(verificationCode, body.name),
  })

  if (!emailResult.success) {
    // Clean up the user if email failed
    await prisma.user.delete({ where: { id: user.id } })
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }

  return NextResponse.json({
    message: 'Verification code sent to your email',
    email: body.email
  })
}
