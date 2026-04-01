# Ziz — AI Automation Platform

Automate your business in plain English. No code required.

## Stack

- **Frontend + API**: Next.js 14, TailwindCSS, NextAuth
- **Database**: PostgreSQL (Railway)
- **AI**: Claude (Anthropic)
- **Billing**: Stripe
- **Worker**: Node.js polling worker
- **Deployment**: Vercel (web) + Railway (worker + DB)

## Local Development

### 1. Prerequisites

- Node.js 18+
- A Railway account (free) — railway.app
- An Anthropic API key — console.anthropic.com

### 2. Setup Railway Database

1. Go to railway.app → New Project → Add PostgreSQL
2. Click PostgreSQL → Connect tab → copy DATABASE_URL

### 3. Environment Variables

```bash
cp .env.example .env
```

Fill in `.env`:
```
DATABASE_URL=postgresql://...    # from Railway
ANTHROPIC_API_KEY=sk-ant-...    # from console.anthropic.com
NEXTAUTH_SECRET=...              # generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
ENCRYPTION_KEY=...               # generate: openssl rand -base64 32
```

Stripe (optional for local dev):
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Install & Setup

```bash
npm install
npm run db:generate
npm run db:push
```

### 5. Run

**Terminal 1 — Web app:**
```bash
cd apps/web && npm run dev
```

**Terminal 2 — Worker:**
```bash
# Copy .env to engine folder
cp .env packages/engine/.env
cd packages/engine && npm run worker
```

Open http://localhost:3000

## Production Deployment

### Vercel (Web App)

1. Push to GitHub
2. Import repo in Vercel
3. Set framework: Next.js
4. Set root directory: `apps/web`
5. Add all environment variables from `.env`
6. Change `NEXTAUTH_URL` to your production domain
7. Deploy

### Railway (Worker)

1. In Railway, click New → GitHub Repo
2. Select your repo
3. Set start command: `cd packages/engine && npm run worker`
4. Add all environment variables
5. Deploy

### Stripe Webhook Setup

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy signing secret → add as `STRIPE_WEBHOOK_SECRET`

### Stripe Products Setup

1. Stripe Dashboard → Products → Add product
2. Create "Ziz Pro" — $29/month recurring → copy price ID
3. Create "Ziz Business" — $99/month recurring → copy price ID
4. Add both price IDs to environment variables

## Architecture

```
User → Next.js (Vercel)
         ↓ creates execution record
     PostgreSQL (Railway)
         ↑ polls every 2s
      Worker (Railway)
         ↓ executes steps
      35+ APIs (Slack, Gmail, etc.)
```

## Adding New Connectors

1. Add connector definition to `packages/shared/src/connectors.ts`
2. Add step types to `packages/shared/src/types.ts`
3. Add executor in `packages/engine/src/worker.ts` switch statement
4. Add credential fields to the credentials page

## License

MIT
