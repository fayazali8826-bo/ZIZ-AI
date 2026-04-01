import Link from 'next/link'

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          ZIZ
        </Link>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          ← Back to home
        </Link>
      </div>
    </header>
  )
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Last updated: March 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
              <p className="text-gray-500 leading-relaxed">
                By accessing Ziz, you agree to be bound by these terms. If you don't agree, please don't use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Use License</h2>
              <p className="text-gray-500 mb-3 leading-relaxed">You may not:</p>
              <ul className="space-y-2 text-gray-500 ml-4">
                <li>• Modify or copy materials</li>
                <li>• Use for commercial purposes without permission</li>
                <li>• Reverse engineer or decompile</li>
                <li>• Create automated scripts to harvest data</li>
                <li>• Attempt unauthorized access</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Disclaimer</h2>
              <p className="text-gray-500 leading-relaxed">
                Materials are provided 'as is'. Ziz makes no warranties, express or implied, regarding service quality or availability.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Billing & Subscription</h2>
              <p className="text-gray-500 leading-relaxed">
                Paid plans auto-renew unless cancelled. You can cancel anytime from your account. We may change pricing with 30 days' notice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Termination</h2>
              <p className="text-gray-500 leading-relaxed">
                We may terminate accounts that violate these terms. Data may be deleted 30 days after termination.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact</h2>
              <p className="text-gray-500 leading-relaxed">
                Questions? Email us at <a href="mailto:legal@ziz.app" className="text-brand-600 hover:underline">legal@ziz.app</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
