import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'
import { z } from 'zod'
import { sendEmail, generatePasswordResetEmailHtml } from '@/lib/email'
import { randomBytes } from 'crypto'

const Schema = z.object({
  email: z.string().email('Invalid email address'),
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
    select: { id: true, email: true, name: true, emailVerified: true },
  })

  // Always return success to prevent email enumeration
  if (!user || !user.emailVerified) {
    return NextResponse.json({ message: 'If an account with this email exists, a password reset link has been sent.' })
  }

  // Generate reset token
  const resetToken = randomBytes(32).toString('hex')
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetExpires,
    },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

  const emailResult = await sendEmail({
    to: user.email,
    subject: 'Reset Your Password - Ziz',
    html: generatePasswordResetEmailHtml(resetUrl, user.name || undefined),
  })

  if (!emailResult.success) {
    return NextResponse.json({ error: 'Failed to send password reset email' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Password reset link sent to your email' })
}