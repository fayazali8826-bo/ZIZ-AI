import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@ziz/db'
import { PLAN_LIMITS } from '@ziz/shared/src/types'

export async function requireAuth() {
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

  // Reset monthly counter if needed
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
