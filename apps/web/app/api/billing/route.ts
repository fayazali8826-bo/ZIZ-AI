import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'

// POST /api/billing/checkout — create Stripe checkout session
export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { plan } = await req.json()
  if (!plan || !['PRO', 'BUSINESS'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })

    const priceId = plan === 'PRO'
      ? process.env.STRIPE_PRO_PRICE_ID!
      : process.env.STRIPE_BUSINESS_PRICE_ID!

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  user.name || undefined,
        metadata: { userId },
      })
      customerId = customer.id
      await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } })
    }

    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/app/settings?tab=billing&success=1`,
      cancel_url:  `${process.env.NEXTAUTH_URL}/app/settings?tab=billing`,
      metadata:    { userId, plan },
      subscription_data: {
        trial_period_days: 14,
        metadata: { userId, plan },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
