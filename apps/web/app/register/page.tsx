'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft, Check } from 'lucide-react'
import { MobileRestriction } from '@/components/app/MobileRestriction'

function ZizMark() {
  return (
    <svg width="32" height="25" viewBox="0 0 36 28" fill="none">
      <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
        stroke="#2e7dff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
    </svg>
  )
}

function RegisterForm() {
  const router  = useRouter()
  const params  = useSearchParams()
  const plan    = params.get('plan') || 'free'

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const planInfo: Record<string, { label: string; price: string; perks: string[] }> = {
    free:     { label: 'Free',     price: '$0/mo',  perks: ['100 runs/month', '3 workflows', '5 connectors'] },
    pro:      { label: 'Pro',      price: '$29/mo', perks: ['10,000 runs/month', 'Unlimited workflows', 'All 35+ connectors'] },
    business: { label: 'Business', price: '$99/mo', perks: ['Unlimited runs', 'Team seats', 'Priority support'] },
  }
  const selectedPlan = planInfo[plan] || planInfo.free

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), email: email.toLowerCase().trim(), password, plan }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json.error || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      // Redirect to email verification
      router.push(`/verify-email?email=${encodeURIComponent(email.toLowerCase().trim())}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <MobileRestriction>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <div className="flex items-center gap-2">
          <ZizMark />
          <span className="font-bold text-gray-900">ZIZ</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Start automating your business today</p>
          </div>

          {/* Plan badge */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-brand-700">{selectedPlan.label} Plan</span>
              <span className="text-sm font-bold text-brand-700">{selectedPlan.price}</span>
            </div>
            <div className="space-y-1">
              {selectedPlan.perks.map(p => (
                <div key={p} className="flex items-center gap-2 text-xs text-brand-600">
                  <Check className="w-3 h-3" /> {p}
                </div>
              ))}
            </div>
            {plan !== 'free' && (
              <p className="text-[11px] text-brand-500 mt-2">14-day free trial · No credit card required</p>
            )}
          </div>

          <div className="card p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text" autoComplete="name"
                  className="input" placeholder="Jane Smith"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Work email</label>
                <input
                  type="email" required autoComplete="email"
                  className="input" placeholder="you@company.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password" required autoComplete="new-password"
                  className="input" placeholder="8+ characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full justify-center mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline">Terms</Link> and{' '}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
    </MobileRestriction>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
