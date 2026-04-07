import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@ziz/db'
import { PLAN_LIMITS } from '@ziz/shared/src/types'
import { createHash } from 'crypto'

function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export async function requireAuth(req?: NextRequest) {
  // 1. Try API key first (for SDK users)
  if (req) {
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ziz_')) {
      const rawKey = authHeader.split(' ')[1]
      const keyHash = hashApiKey(rawKey)

      const apiKey = await prisma.apiKey.findUnique({
        where: { keyHash },
        include: { user: { select: { id: true, plan: true } } },
      })

      if (!apiKey) {
        return { userId: null, plan: null, error: NextResponse.json({ error: 'Invalid API key' }, { status: 401 }) }
      }

      // Update last used timestamp
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsed: new Date() },
      })

      return { userId: apiKey.user.id, plan: apiKey.user.plan, error: null }
    }
  }

  // 2. Fall back to existing session auth (for web UI users)
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { userId: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { userId: session.user.id, plan: session.user.plan, error: null }
}

export async function checkUsageLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, runsThisMonth: true, runsResetAt: true },
  })
  if (!user) return { allowed: false, reason: 'User not found' }

  const now = new Date()
  const resetAt = new Date(user.runsResetAt)
  const needsReset = now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()
  if (needsReset) {
    await prisma.user.update({
      where: { id: userId },
      data: { runsThisMonth: 0, runsResetAt: now },
    })
    return { allowed: true }
  }

  const limit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]
  if (user.runsThisMonth >= limit.runsPerMonth) {
    return {
      allowed: false,
      reason: `You've used all ${limit.runsPerMonth} automation runs this month on the ${limit.label} plan. Upgrade to run more.`,
    }
  }
  return { allowed: true }
}

export async function incrementUsage(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { runsThisMonth: { increment: 1 } },
  })
}