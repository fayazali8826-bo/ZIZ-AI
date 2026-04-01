import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'

export async function POST(_: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })

    const session = await stripe.billingPortal.sessions.create({
      customer:   user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/app/settings?tab=billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
