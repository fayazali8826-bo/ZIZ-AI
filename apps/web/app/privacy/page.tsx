import Link from 'next/link'

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

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: March 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-500 leading-relaxed">
                Ziz operates ziz.app. This page informs you of our policies regarding data collection, use, and disclosure when you use our Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Collection</h2>
              <p className="text-gray-500 mb-4 leading-relaxed">We collect personal data like email, name, and phone number. We also collect service data (workflows, logs) and usage data (browser, IP, pages visited).</p>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">We encrypt and protect:</h3>
              <ul className="space-y-2 text-gray-500">
                <li>• AES-256 encryption for API credentials</li>
                <li>• TLS/SSL encryption for data in transit</li>
                <li>• SOC 2 Type II compliance</li>
                <li>• 24/7 monitoring and threat detection</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <ul className="space-y-2 text-gray-500">
                <li>• Access your personal data anytime</li>
                <li>• Request correction of inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing emails</li>
                <li>• Data portability rights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-500 leading-relaxed">
                If you have questions, reach out to us at{' '}
                <a href="mailto:privacy@ziz.app" className="text-brand-600 hover:underline">privacy@ziz.app</a>
              </p>
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
