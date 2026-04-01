import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Check, Sparkles, Bug } from 'lucide-react'

function ZizMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 36 28" fill="none">
      <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
        stroke="#2e7dff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
    </svg>
  )
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <ZizMark size={28} />
          <span className="text-xl font-bold text-gray-900 tracking-tight">ZIZ</span>
        </Link>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
          ← Back to home
        </Link>
      </div>
    </header>
  )
}

export default function ChangelogPage() {
  const changelogEntries = [
    {
      date: 'March 20, 2026',
      version: 'v2.3.0',
      type: 'feature',
      title: 'AI Agent Improvements',
      items: [
        'Added advanced web browsing capabilities for AI agents',
        'Improved email parsing and summarization accuracy',
        'New database query builder for AI steps',
        'Support for multi-step decision trees',
      ],
    },
    {
      date: 'March 15, 2026',
      version: 'v2.2.5',
      type: 'fix',
      title: 'Bug Fixes & Performance',
      items: [
        'Fixed workflow timeout issues on long-running automations',
        'Improved error message clarity for failed runs',
        'Optimized API response times by 35%',
        'Fixed credential refresh for OAuth-based integrations',
      ],
    },
    {
      date: 'March 10, 2026',
      version: 'v2.2.0',
      type: 'feature',
      title: 'New Integrations & Connectors',
      items: [
        'Added support for Microsoft Teams messaging',
        'Integrated with Zapier (can now trigger Zap workflows)',
        'Added direct Shopify inventory management',
        'New Jira custom field mapping',
        'Support for Twilio SMS automation',
      ],
    },
    {
      date: 'March 5, 2026',
      version: 'v2.1.8',
      type: 'fix',
      title: 'UI/UX Improvements',
      items: [
        'Redesigned workflow builder for better clarity',
        'Added dark mode support',
        'Improved mobile responsiveness',
        'Faster search across workflows',
      ],
    },
    {
      date: 'February 28, 2026',
      version: 'v2.1.0',
      type: 'feature',
      title: 'Workflow Versioning & Rollback',
      items: [
        'Added version history for all workflows',
        'One-click rollback to previous versions',
        'Compare workflow versions side-by-side',
        'Automatic backups every hour',
      ],
    },
    {
      date: 'February 20, 2026',
      version: 'v2.0.0',
      type: 'feature',
      title: 'Team Collaboration Features',
      items: [
        'Added team member roles and permissions',
        'Real-time workflow editing with multiple users',
        'Workflow approval workflow for admins',
        'Activity logs for all team changes',
        'Shared workflow libraries',
      ],
    },
    {
      date: 'February 15, 2026',
      version: 'v1.9.5',
      type: 'fix',
      title: 'Stability & Reliability',
      items: [
        'Improved 99.95% uptime to 99.99%',
        'Enhanced error recovery mechanisms',
        'Better handling of rate-limited APIs',
        'Automatic retry logic improvements',
      ],
    },
    {
      date: 'February 10, 2026',
      version: 'v1.9.0',
      type: 'feature',
      title: 'Advanced Scheduling',
      items: [
        'Added cron-based scheduling for workflows',
        'Timezone support for global teams',
        'Run frequency analytics and insights',
        'Cost estimation for scheduled workflows',
      ],
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Sparkles className="w-5 h-5 text-brand-500" />
      case 'fix':
        return <Bug className="w-5 h-5 text-amber-500" />
      default:
        return <Check className="w-5 h-5 text-green-500" />
    }
  }

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              What's new in Ziz
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              We ship new updates every week. Here's what changed recently.
            </p>
          </div>
        </section>

        {/* Changelog */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {changelogEntries.map((entry, index) => (
                <div key={index} className="card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {getTypeIcon(entry.type)}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase">{entry.date}</div>
                      <div className="text-lg font-bold text-gray-900">{entry.title} · {entry.version}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {entry.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-500 text-sm">
                        <Check className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-12 text-white text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to experience the latest?</h2>
              <p className="text-brand-100 text-lg mb-8">Join us and get access to cutting-edge automation features.</p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
                Get started free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400">
          <p>© 2026 Ziz. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
