import Link from 'next/link'
import { ArrowRight, Zap, Users, Target, Heart } from 'lucide-react'

// ── ZIZ LOGO MARK ────────────────────────────────────────────────────
function ZizMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 36 28" fill="none">
      <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
        stroke="#2e7dff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
    </svg>
  )
}

// ── NAV ───────────────────────────────────────────────────────────────
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

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              About Ziz
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Ziz was born from a simple frustration: automation shouldn't require engineers, complex workflows, or weeks of setup. We built Ziz to make automation accessible to everyone.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Our story</h2>
            <div className="space-y-8 text-gray-600 leading-relaxed">
              <p>
                In 2026, I was working with small business owners who desperately wanted to automate their repetitive tasks. But existing solutions like Zapier were expensive, n8n required technical expertise, and custom developers took months and cost tens of thousands.
              </p>
              <p>
                I realized the problem: automation tools were built for developers, not business owners. They required configuration, mapping, and complex workflows. Nobody was building for plain English instructions.
              </p>
              <p>
                So I did. We built Ziz to be the fastest, most intuitive automation platform on the planet. Using AI, we let you describe your automation in plain English, and Ziz builds it for you in seconds. No nodes, no JSON, no developers needed.
              </p>
              <p>
                Today, thousands of entrepreneurs, freelancers, and small business owners are willing to use Ziz to automate everything from customer onboarding to content distribution to data management. And we're just getting started.
              </p>
            </div>
          </div>
        </section>
         <section className="py-16 px-6 border-t border-gray-100">
          <div className="max-w-4xl mx-auto flex items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {/* Replace the src below with your photo URL or import */}
                <img
                  src="/fayaz.png"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-500 uppercase tracking-widest mb-1">Founder</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fayaz Ali</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-xl">
                Software Engineer
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our mission</h2>
                <p className="text-gray-500 leading-relaxed">
                  To make automation accessible to every business owner, regardless of technical skill. We believe that repetitive work should be automated, not tolerated.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our values</h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Zap className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Simplicity</div>
                      <div className="text-sm text-gray-500">Complexity is the enemy of adoption</div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Users className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">User-first</div>
                      <div className="text-sm text-gray-500">Every feature should solve a real problem</div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Target className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Reliability</div>
                      <div className="text-sm text-gray-500">Your automations should work 24/7</div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Heart className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Community</div>
                      <div className="text-sm text-gray-500">We listen and build with our users</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-12 text-white text-center">
              <h2 className="text-4xl font-bold mb-4">
                Ready to automate your business?
              </h2>
              <p className="text-brand-100 text-lg mb-8 max-w-md mx-auto">
                Join thousands of business owners who've eliminated repetitive work and gained back hours every week.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
                Start for free <ArrowRight className="w-5 h-5" />
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

