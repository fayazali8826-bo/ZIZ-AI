import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'
import { PLAN_LIMITS } from '@ziz/shared/src/types'

export async function GET(_: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, runsThisMonth: true, runsResetAt: true, stripeSubscriptionId: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const limit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]

  return NextResponse.json({
    data: {
      plan:          user.plan,
      planLabel:     limit.label,
      planPrice:     limit.price,
      runsThisMonth: user.runsThisMonth,
      runsLimit:     limit.runsPerMonth,
      runsRemaining: limit.runsPerMonth === Infinity ? null : limit.runsPerMonth - user.runsThisMonth,
      resetAt:       user.runsResetAt,
      hasSubscription: !!user.stripeSubscriptionId,
    },
  })
}
