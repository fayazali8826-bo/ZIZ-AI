import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: any
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 })
  }

  const planMap: Record<string, 'PRO' | 'BUSINESS'> = {
    [process.env.STRIPE_PRO_PRICE_ID!]:      'PRO',
    [process.env.STRIPE_BUSINESS_PRICE_ID!]: 'BUSINESS',
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub      = event.data.object
      const userId   = sub.metadata?.userId
      const priceId  = sub.items?.data[0]?.price?.id
      const newPlan  = planMap[priceId] || 'FREE'

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan:                newPlan,
            stripeSubscriptionId: sub.id,
            planExpiresAt:        new Date(sub.current_period_end * 1000),
          },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub    = event.data.object
      const userId = sub.metadata?.userId
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'FREE', stripeSubscriptionId: null, planExpiresAt: null },
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const custId  = invoice.customer as string
      const user    = await prisma.user.findFirst({ where: { stripeCustomerId: custId } })
      if (user) {
        // Could send email notification here via Resend
        console.warn(`Payment failed for user ${user.id}`)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
