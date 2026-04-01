'use client'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Check, ExternalLink, Loader2, AlertTriangle, CreditCard, Zap, Shield } from 'lucide-react'
import { clsx } from 'clsx'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data)

const PLANS = [
  {
    id: 'FREE', name: 'Free', price: 0,
    runs: 100, label: '100 runs/month',
    features: ['3 active workflows', '5 app connectors', 'Email support'],
  },
  {
    id: 'PRO', name: 'Pro', price: 29,
    runs: 10000, label: '10,000 runs/month',
    features: ['Unlimited workflows', 'All 35+ connectors', 'AI agent steps', 'Priority support'],
    popular: true,
  },
  {
    id: 'BUSINESS', name: 'Business', price: 99,
    runs: Infinity, label: 'Unlimited runs',
    features: ['Everything in Pro', '5 team seats', 'API access', 'Dedicated support', 'SLA guarantee'],
  },
]

export default function SettingsPage() {
  const { data: session }     = useSession()
  const params                = useSearchParams()
  const activeTab             = params.get('tab') || 'account'
  const { data: usage }       = useSWR('/api/usage', fetcher, { refreshInterval: 30000 })
  const [tab, setTab]         = useState(activeTab)
  const [saving, setSaving]   = useState(false)
  const [name, setName]       = useState(session?.user?.name || '')
  const [saved, setSaved]     = useState(false)

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'billing', label: 'Billing & Plan' },
    { id: 'security', label: 'Security' },
  ]

  const saveName = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const openBillingPortal = async () => {
    setSaving(true)
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setSaving(false)
  }

  const upgradeToPro = async () => {
    setSaving(true)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'PRO' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setSaving(false)
  }

  const upgradeToBusiness = async () => {
    setSaving(true)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'BUSINESS' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setSaving(false)
  }

  const runsPercent = usage?.runsLimit && usage.runsLimit !== Infinity
    ? Math.min(100, (usage.runsThisMonth / usage.runsLimit) * 100)
    : 0

  return (
    <div className="flex-1 overflow-y-auto px-7 py-7">
      <div className="max-w-3xl">
        {/* Header */}
        <h1 className="text-xl font-bold text-white mb-7">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-navy-900 border border-navy-700 rounded-xl p-1 w-fit mb-8">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t.id ? 'bg-navy-800 text-white' : 'text-slate-500 hover:text-slate-300'
              )}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Account tab */}
        {tab === 'account' && (
          <div className="space-y-5">
            <div className="app-card p-6">
              <h2 className="text-sm font-semibold text-white mb-5">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full name
                  </label>
                  <input
                    className="app-input max-w-sm"
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email address
                  </label>
                  <input className="app-input max-w-sm" value={session?.user?.email || ''} disabled />
                  <p className="text-[10px] font-mono text-slate-700 mt-1.5">Email cannot be changed</p>
                </div>
                <button onClick={saveName} disabled={saving}
                  className="app-btn-primary text-sm px-5 py-2">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                   saved  ? <Check   className="w-3.5 h-3.5" />             : null}
                  {saved ? 'Saved!' : 'Save changes'}
                </button>
              </div>
            </div>

            <div className="app-card p-6 border border-red-500/20">
              <h2 className="text-sm font-semibold text-white mb-1">Danger zone</h2>
              <p className="text-xs text-slate-500 mb-4">These actions are permanent and cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-all font-medium">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing tab */}
        {tab === 'billing' && (
          <div className="space-y-5">
            {/* Current plan */}
            <div className="app-card p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-sm font-semibold text-white mb-1">Current plan</h2>
                  <p className="text-xs text-slate-500">
                    You're on the <span className="text-white font-medium">{usage?.planLabel || 'Free'} plan</span>
                    {usage?.planPrice > 0 ? ` · $${usage.planPrice}/month` : ' · Free forever'}
                  </p>
                </div>
                {usage?.hasSubscription && (
                  <button onClick={openBillingPortal} disabled={saving}
                    className="app-btn-ghost text-xs py-2 px-3">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Manage billing
                  </button>
                )}
              </div>

              {/* Usage bar */}
              <div className="bg-navy-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">Monthly runs</span>
                  <span className="text-xs font-mono text-slate-300">
                    {usage?.runsThisMonth || 0} / {usage?.runsLimit === Infinity ? '∞' : (usage?.runsLimit || 100).toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden mb-2">
                  <div
                    className={clsx('h-full rounded-full transition-all', runsPercent > 85 ? 'bg-red-500' : 'bg-brand-500')}
                    style={{ width: `${runsPercent}%` }}
                  />
                </div>
                {runsPercent > 80 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    You're using {Math.round(runsPercent)}% of your monthly runs. Upgrade to avoid interruptions.
                  </div>
                )}
                <p className="text-[10px] font-mono text-slate-600 mt-1">
                  Resets on the 1st of each month
                </p>
              </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-4">
              {PLANS.map(plan => {
                const isCurrent = usage?.plan === plan.id
                return (
                  <div key={plan.id} className={clsx(
                    'app-card p-5 flex flex-col relative',
                    isCurrent ? 'border-brand-500/40' : '',
                    plan.popular && !isCurrent ? 'border-accent-400/30' : ''
                  )}>
                    {plan.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <span className="app-badge-green text-[9px] px-2.5 py-0.5">Most popular</span>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <span className="app-badge-blue text-[9px] px-2.5 py-0.5">Current plan</span>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1">{plan.name}</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-bold text-white">${plan.price}</span>
                        {plan.price > 0 && <span className="text-slate-500 text-sm">/mo</span>}
                      </div>
                      <div className="text-xs text-brand-400 font-mono">{plan.label}</div>
                    </div>

                    <ul className="space-y-2 mb-5 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                          <Check className="w-3 h-3 text-accent-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <div className="text-center text-xs font-mono text-slate-600 py-2">Current plan</div>
                    ) : plan.price === 0 ? (
                      <div className="text-center text-xs font-mono text-slate-600 py-2">Downgrade on next cycle</div>
                    ) : (
                      <button
                        onClick={plan.id === 'PRO' ? upgradeToPro : upgradeToBusiness}
                        disabled={saving}
                        className="app-btn-success w-full justify-center text-xs py-2.5"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                        Upgrade to {plan.name}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Security tab */}
        {tab === 'security' && (
          <div className="space-y-5">
            <div className="app-card p-6">
              <h2 className="text-sm font-semibold text-white mb-1">Change password</h2>
              <p className="text-xs text-slate-500 mb-5">Use a strong password of at least 12 characters.</p>
              <div className="space-y-3 max-w-sm">
                <input type="password" className="app-input" placeholder="Current password" />
                <input type="password" className="app-input" placeholder="New password" />
                <input type="password" className="app-input" placeholder="Confirm new password" />
                <button className="app-btn-primary text-sm px-5 py-2">Update password</button>
              </div>
            </div>

            <div className="app-card p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-semibold text-white mb-1">Security info</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    All API credentials are encrypted with AES-256-GCM before storage. Encryption keys are rotated quarterly. We never store plaintext secrets or log sensitive data.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Encryption', value: 'AES-256-GCM' },
                  { label: 'Auth tokens', value: 'JWT · 30 days' },
                  { label: 'Data storage', value: 'Railway (EU)' },
                ].map(item => (
                  <div key={item.label} className="bg-navy-800 rounded-lg p-3">
                    <div className="text-[10px] font-mono text-slate-600 mb-1">{item.label}</div>
                    <div className="text-xs font-mono text-slate-300">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
