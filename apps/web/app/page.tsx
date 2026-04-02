import Link from 'next/link'
import { Check, ArrowRight, Zap, Shield, Clock, Star, MapPin } from 'lucide-react'
import { CONNECTORS, POPULAR_CONNECTORS } from '@ziz/shared/src/connectors'
import { ChatBot } from '@/components/app/ChatBot'
import AutomationBackground from '@/components/app/AutomationBackground'
import NavBar from '@/components/app/NavBar'

// ── ZIZ LOGO MARK ────────────────────────────────────────────────────
function ZizMark({ size = 32 }: { size?: number }) {
  const s = size / 28
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 36 28" fill="none">
      <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
        stroke="#2e7dff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
    </svg>
  )
}

// ── NAV ───────────────────────────────────────────────────────────────
// function Nav() {
//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
//         <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5">
//           <ZizMark size={24} />
//           <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">ZIZ</span>
//         </Link>
//         <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm text-gray-600">
//           <Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link>
//           <Link href="#connectors" className="hover:text-gray-900 transition-colors">Connectors</Link>
//           <Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
//           <Link href="#faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
//         </nav>
//         <div className="flex items-center gap-2 sm:gap-3">
//           <Link href="/login" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
//             Sign in
//           </Link>
//           <Link href="/register" className="button-glow hidden sm:flex text-xs font-medium px-3 py-1.5 rounded-lg gap-2">
//             Start free <ArrowRight className="w-3 h-3" />
//           </Link>
//           <Link href="/register" className="button-glow sm:hidden text-xs font-medium px-3 py-1.5 rounded-lg">
//             Start
//           </Link>
//         </div>
//       </div>
//     </header>
//   )
// }

// ── HERO ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 hero-grid relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          <span>35+ apps connected · No code required</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-6">
          Automate & Scale
          <br className="hidden sm:block" />
          <span className="gradient-text">Everything</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Describe what you want to automate. Ziz AI builds it for you connects your apps, sets up triggers, handles errors. No engineers, no code, no complexity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <Link href="/register" className="button-glow w-full sm:w-auto flex items-center justify-center gap-2">
            Start automating free
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
          <Link href="/login" className="btn btn-outline btn-xl w-full sm:w-auto">
            Sign in to your account
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 px-2">
          Free plan includes 100 automation runs/month. No credit card required.
        </p>

        {/* Demo Video */}
        <div className="mt-10 sm:mt-16 rounded-xl sm:rounded-2xl border border-navy-700 shadow-xl sm:shadow-2xl shadow-black/20 overflow-hidden mx-auto max-w-full">
          <video
            className="w-full h-auto"
            autoPlay
            muted
            loop
          >
            <source src="/realvid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  )
}

// ── SOCIAL PROOF ─────────────────────────────────────────────────────
function SocialProof() {
  const stats = [
    { value: '35+', label: 'Apps connected' },
    { value: '2 min', label: 'To first automation' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '0', label: 'Lines of code needed' },
  ]
  return (
    <section className="py-12 sm:py-16 border-y border-gray-100 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map(s => (
            <div key={s.value} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
              <div className="text-xs sm:text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FEATURES ─────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: '🤖',
      title: 'AI builds it for you',
      description: 'Just describe what you want in plain English. Ziz AI understands your business goal, picks the right apps, maps the data, and builds the complete workflow — in seconds.',
    },
    {
      icon: '⚡',
      title: 'Runs instantly, 24/7',
      description: 'Once activated, your workflows run automatically. Stripe payment comes in at 3am? Slack message sent. New lead fills your form? CRM updated. You sleep, Ziz works.',
    },
    {
      icon: '🔗',
      title: '35+ apps, one platform',
      description: 'Slack, Gmail, HubSpot, Stripe, Notion, Airtable, WhatsApp, Shopify, Jira, and more. Connect your existing tools without switching platforms or learning APIs.',
    },
    {
      icon: '🧠',
      title: 'AI agent inside workflows',
      description: 'Add an AI step that browses the web, reads emails, queries your data, makes decisions, and acts autonomously — like having a smart assistant inside every automation.',
    },
    {
      icon: '🛡️',
      title: 'Enterprise-grade reliability',
      description: 'Automatic retries, error notifications in plain English, suggested fixes, and a full audit log of every run. Know exactly what happened and why.',
    },
    {
      icon: '🚀',
      title: 'From idea to live in 2 minutes',
      description: 'No nodes to drag. No JSON to write. No documentation to read. Type what you want, connect your accounts, click Activate. That\'s the entire process.',
    },
  ]

  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto px-2">
            Built for business owners, not developers. Every feature is designed to save you time, not create more work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map(f => (
            <div key={f.title} className="card p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── HOW IT WORKS ─────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '1', title: 'Describe your automation', description: 'Type what you want to automate in plain English. "When a customer pays, send them a welcome email and add them to my spreadsheet."' },
    { num: '2', title: 'Ziz AI builds it', description: 'Our AI understands your goal, selects the right connectors, maps the data fields, and generates a complete working workflow in seconds.' },
    { num: '3', title: 'Connect your accounts', description: 'We guide you step-by-step to connect each app. Simple forms, plain-English instructions, no developer knowledge needed.' },
    { num: '4', title: 'Activate and relax', description: 'Click Activate. Your automation runs 24/7 automatically. Monitor runs in real time, get plain-English error explanations if anything goes wrong.' },
  ]

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How it works</h2>
          <p className="text-base sm:text-xl text-gray-500 px-2">From idea to running automation in under 4 minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              <div className="card p-4 sm:p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold text-lg flex items-center justify-center mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{s.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{s.description}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-12 -right-3 z-10">
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CONNECTORS ────────────────────────────────────────────────────────
function ConnectorsSection() {
  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Messaging', value: 'messaging' },
    { label: 'CRM', value: 'crm' },
    { label: 'Payments', value: 'payments' },
    { label: 'Data', value: 'data' },
    { label: 'Project Management', value: 'project_management' },
  ]

  return (
    <section id="connectors" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Connect every tool you use
          </h2>
          <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto px-2">
            35+ integrations and growing. If your tool has an API, we can connect it.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-8 sm:mb-10">
          {CONNECTORS.map(c => (
            <div key={c.id} className="card card-hover p-3 sm:p-4 text-center group cursor-default">
              <div
                className="connector-icon mx-auto mb-2 sm:mb-2.5 text-xs sm:text-sm"
                style={{ backgroundColor: c.color + '22', color: c.color }}
              >
                {c.icon}
              </div>
              <div className="text-xs font-medium text-gray-700 group-hover:text-brand-600 transition-colors">
                {c.name}
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 capitalize">
                {c.category.replace('_', ' ')}
              </div>
            </div>
          ))}

          {/* More coming */}
          <div className="card p-3 sm:p-4 text-center border-dashed">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-2 sm:mb-2.5 text-gray-400 text-lg">
              +
            </div>
            <div className="text-xs font-medium text-gray-400">More coming</div>
            <div className="text-[10px] sm:text-[11px] text-gray-300 mt-0.5">Request one</div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 px-2">
            Don't see your app?{' '}
            <a href="mailto:hello@ziz.app" className="text-brand-600 font-medium hover:underline">
              Request a connector →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

// ── PRICING ───────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for trying Ziz and small personal automations',
      runs: '100 runs / month',
      features: [
        '100 automation runs per month',
        'Up to 3 active workflows',
        '5 app connectors',
        'Basic AI workflow builder',
        'Email support',
      ],
      cta: 'Start free',
      href: '/register',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 29,
      description: 'For small businesses and growing teams',
      runs: '10,000 runs / month',
      features: [
        '10,000 automation runs per month',
        'Unlimited workflows',
        'All 35+ app connectors',
        'Advanced AI agent steps',
        'Webhook triggers',
        'Run history & logs',
        'Priority email support',
        'Custom branding on notifications',
      ],
      cta: 'Start Pro free trial',
      href: '/register?plan=pro',
      highlight: true,
      badge: 'Most popular',
    },
    {
      name: 'Business',
      price: 99,
      description: 'For teams that need unlimited automation power',
      runs: 'Unlimited runs',
      features: [
        'Unlimited automation runs',
        'Unlimited workflows',
        'All connectors + priority new ones',
        'Full AI agent capabilities',
        'API access',
        'Team members (5 seats)',
        'Dedicated Slack support',
        'Custom connectors on request',
        'SLA guarantee',
      ],
      cta: 'Start Business trial',
      href: '/register?plan=business',
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-base sm:text-xl text-gray-500 px-2">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`card p-6 sm:p-8 relative flex flex-col ${plan.highlight ? 'border-brand-300 shadow-lg shadow-brand-500/10 ring-1 ring-brand-200' : ''}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-blue text-xs font-semibold">
                    ⭐ {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price > 0 && <span className="text-xs sm:text-sm text-gray-400">/month</span>}
                </div>
                <div className="text-xs sm:text-sm font-medium text-brand-600 mb-2">{plan.runs}</div>
                <p className="text-xs sm:text-sm text-gray-500">{plan.description}</p>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600">
                    <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-accent-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full justify-center flex items-center font-medium text-sm rounded-lg px-6 py-3 transition-colors ${plan.highlight ? 'button-glow' : 'btn-outline'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-xs sm:text-sm text-gray-500 px-2">
            All plans include a 14-day free trial on paid features. No credit card required to start.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ─────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "I replaced my Zapier subscription and saved $80/month. Ziz does the same thing but I can actually describe what I want in plain English instead of trying to configure nodes.",
      name: "Sarah K.", role: "E-commerce founder", avatar: "SK",
    },
    {
      quote: "We automated our entire client onboarding — from Stripe payment to HubSpot, welcome email, and Slack notification — in about 10 minutes. Previously this took a developer 2 days.",
      name: "Marcus T.", role: "Agency owner", avatar: "MT",
    },
    {
      quote: "The AI agent step is incredible. It reads incoming emails, looks up the customer in our CRM, and drafts a personalized reply automatically. It's like having an extra team member.",
      name: "Priya M.", role: "Customer success manager", avatar: "PM",
    },
  ]

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Loved by business owners</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card p-4 sm:p-6">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────
function FAQ() {
  const faqs = [
    {
      q: "Do I need to know how to code?",
      a: "No. Ziz is built for non-technical people. You describe what you want in plain English and the AI builds the automation for you. The only thing you need is your app credentials (API keys), which we guide you through step by step.",
    },
    {
      q: "How is Ziz different from Zapier or n8n?",
      a: "Zapier is expensive and limited. n8n requires technical knowledge to set up and maintain. Ziz uses AI to build workflows from plain English descriptions — no nodes to configure, no JSON to write, no developers needed.",
    },
    {
      q: "What counts as a 'run'?",
      a: "Each time one of your automations executes counts as one run. If your Stripe-to-Slack automation fires 50 times in a month because you had 50 payments, that's 50 runs.",
    },
    {
      q: "What happens if I hit my monthly run limit?",
      a: "Your automations pause until the next month or you upgrade. We'll email you when you're getting close to your limit so you're never surprised.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. All API credentials are encrypted with AES-256 before storage. We never store plaintext secrets. Workflow data is processed in memory and not logged. We're SOC 2 compliant.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel from your account settings anytime. No questions asked, no cancellation fees. Your free plan features remain available after cancelling paid.",
    },
  ]

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Frequently asked questions</h2>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map(faq => (
            <div key={faq.q} className="card p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white">
          <ZizMark size={40} />
          <h2 className="text-2xl sm:text-4xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4">
            Start automating today
          </h2>
          <p className="text-xs sm:text-base text-brand-100 sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
            Free plan includes 100 runs per month. No credit card required. Your first automation in under 5 minutes.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-brand-50 transition-colors">
            Create free account <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── FOOTER ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ZizMark size={18} />
              <span className="font-bold text-gray-900 text-sm sm:text-base">ZIZ</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3">
              Automate everything in English. No code required.
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Skopje, Macedonia</span>
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Product</div>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-500">
              <div><Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link></div>
              <div><Link href="#connectors" className="hover:text-gray-900 transition-colors">Connectors</Link></div>
              <div><Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></div>
              <div><Link href="/changelog" className="hover:text-gray-900 transition-colors">Changelog</Link></div>
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Company</div>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-500">
              <div><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></div>
              <div><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></div>
              <div><a href="mailto:hello@ziz.app" className="hover:text-gray-900 transition-colors">Contact</a></div>
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Legal</div>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-500">
              <div><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></div>
              <div><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></div>
              <div><Link href="/security" className="hover:text-gray-900 transition-colors">Security</Link></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 sm:pt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm text-gray-400">© 2026 Ziz. All rights reserved.</p>
          <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5">
            <Shield className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-500" />
            <span>AES-256 encrypted · SOC 2 compliant · 99.9% uptime</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="relative w-full">
      <AutomationBackground opacity={0.6} intensity="medium" hideOnMobile={false} />
      <div className="relative z-10">
        <NavBar />
        <main>
          <Hero />
          <SocialProof />
          <Features />
          <HowItWorks />
          <ConnectorsSection />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
      <ChatBot />
    </div>
  )
}
