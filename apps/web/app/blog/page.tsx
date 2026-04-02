import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

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

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'How We Reduced Our Client Onboarding Time by 90%',
      excerpt: 'See how one agency used Ziz to automate their entire client onboarding process, from payment to welcome email to CRM setup.',
      date: 'March 15, 2026',
      author: 'Fayaz Ali.',
      category: 'Case Study',
    },
    {
      id: 2,
      title: 'The AI Revolution in Automation: What Changed in 2026',
      excerpt: 'We explore how AI is transforming automation from configuration-heavy to description-based. What this means for business owners.',
      date: 'March 10, 2026',
      author: 'Fayaz Ali.',
      category: 'Insights',
    },
    {
      id: 3,
      title: '5 Automations Every E-commerce Store Should Have',
      excerpt: 'From abandoned cart recovery to inventory management, we break down the top automations that drive revenue and save time.',
      date: 'March 5, 2026',
      author: 'Fayaz Ali.',
      category: 'Guide',
    },
    {
      id: 4,
      title: 'Zapier vs Ziz vs n8n: Which Tool Should You Use?',
      excerpt: 'A detailed comparison of the three biggest automation platforms. We break down pricing, ease of use, and capabilities.',
      date: 'February 28, 2026',
      author: 'Team Ziz',
      category: 'Comparison',
    },
    {
      id: 5,
      title: 'Building Your First Workflow: A Step-by-Step Tutorial',
      excerpt: 'New to Ziz? Follow along as we build a complete automation from scratch, from describing it in English to going live.',
      date: 'February 20, 2026',
      author: 'Fayaz Ali',
      category: 'Tutorial',
    },
    {
      id: 6,
      title: 'Why Automation is No Longer a Luxury, But a Necessity',
      excerpt: 'In 2026, business owners who don\'t automate are falling behind. Here\'s why automation is now essential for growth.',
      date: 'February 15, 2026',
      author: 'Team ziz',
      category: 'Opinion',
    },
  ]

  const categories = [
    'Case Study',
    'Insights',
    'Guide',
    'Comparison',
    'Tutorial',
    'Opinion',
  ]

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
              Blog & Updates
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Stories, tips, and insights about automation and building better workflows.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-brand-600 transition-colors">{post.title}</h2>
                  <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span><Calendar className="w-3 h-3 inline mr-1" />{post.date} • {post.author}</span>
                    <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded">{post.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-12 text-white text-center">
              <h2 className="text-4xl font-bold mb-4">Stop wasting time</h2>
              <p className="text-brand-100 text-lg mb-8">Automate your workflows. Start free, no credit card required.</p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
                Start automating <ArrowRight className="w-5 h-5" />
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
