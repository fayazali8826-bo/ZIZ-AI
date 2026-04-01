import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'
import { createHash } from 'crypto'
import { z } from 'zod'

const Schema = z.object({
  token:    z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

  const user = await prisma.user.findFirst({
    where: {
      resetToken: body.token,
      resetExpires: { gt: new Date() },
    },
    select: { id: true, email: true, name: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
  }

  // Update password and clear reset fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      hashedPassword: hashPassword(body.password),
      resetToken: null,
      resetExpires: null,
    },
  })

  return NextResponse.json({ message: 'Password reset successfully' })
}