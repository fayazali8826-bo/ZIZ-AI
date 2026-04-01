'use client'
import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
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

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/app'
  const message = params.get('message')

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (message === 'password-reset') {
      setSuccessMessage('Your password has been reset successfully. Please sign in with your new password.')
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <MobileRestriction>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top bar */}
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

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
              <p className="text-gray-500 text-sm">Sign in to your Ziz account</p>
            </div>

            <div className="card p-8">
              {params.get('registered') && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 mb-5">
                  Account created! Sign in below.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3 mb-5">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email" required autoComplete="email"
                    className="input" placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot?</Link>
                  </div>
                  <input
                    type="password" required autoComplete="current-password"
                    className="input" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full justify-center mt-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="text-brand-600 font-medium hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MobileRestriction>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

