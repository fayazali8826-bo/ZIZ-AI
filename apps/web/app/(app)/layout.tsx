'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Plus, Activity, Lock, Settings, Zap, LogOut, CreditCard, Monitor } from 'lucide-react'
import { clsx } from 'clsx'
import { signOut } from 'next-auth/react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data)

function ZizMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 36 28" fill="none">
      <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
        stroke="#2e7dff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
    </svg>
  )
}

const NAV = [
  { href: '/app',             icon: LayoutDashboard, label: 'Dashboard'    },
  { href: '/app/create',      icon: Plus,            label: 'New workflow'  },
  { href: '/app/logs',        icon: Activity,        label: 'Run logs'      },
  { href: '/app/credentials', icon: Lock,            label: 'Credentials'   },
  { href: '/app/settings',    icon: Settings,        label: 'Settings'      },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: usage } = useSWR('/api/usage', fetcher, { refreshInterval: 60000 })
  const { data: workflows } = useSWR('/api/workflows', fetcher, { refreshInterval: 10000 })

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm animate-pulse">
          <ZizMark size={20} />
          loading…
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-brand-100/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-brand-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3">
            Desktop Only
          </h1>
          
          <p className="text-gray-300 mb-4 leading-relaxed">
            The Ziz dashboard is designed for desktop. Please access from a desktop computer or tablet for the full experience.
          </p>

          <Link
            href="/" 
            className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full"
          >
            Back to Home
          </Link>

          <p className="text-xs text-gray-500 mt-6">
            You can still access this from your desktop browser.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm animate-pulse">
          <ZizMark size={20} />
          loading…
        </div>
      </div>
    )
  }

  const runsPercent = usage?.runsLimit
    ? Math.min(100, (usage.runsThisMonth / usage.runsLimit) * 100)
    : 0

  return (
    <div className="app-shell h-screen flex overflow-hidden">
      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col bg-navy-900 border-r border-navy-700">
        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-navy-700 shrink-0">
          <ZizMark size={24} />
          <span className="text-lg font-bold text-white tracking-tight">ZIZ</span>
          <span className="ml-auto app-badge-blue text-[9px]">{usage?.planLabel || 'Free'}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all',
                  active
                    ? 'bg-brand-500/15 text-brand-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}

          {/* Recent workflows */}
          {workflows?.length > 0 && (
            <div className="pt-4">
              <div className="text-[9.5px] font-mono font-semibold text-slate-700 uppercase tracking-widest px-3 mb-2">
                My workflows
              </div>
              {workflows.slice(0, 6).map((wf: any) => (
                <Link key={wf.id} href={`/app/workflows/${wf.id}`}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all truncate',
                    pathname.includes(wf.id)
                      ? 'bg-brand-500/10 text-brand-300'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-navy-800'
                  )}
                >
                  <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0',
                    wf.status === 'ACTIVE' ? 'bg-accent-400' :
                    wf.status === 'FAILED' ? 'bg-red-500'    : 'bg-slate-600'
                  )} />
                  <span className="truncate">{wf.name}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Usage meter */}
        {usage && usage.runsLimit && (
          <div className="p-3 border-t border-navy-700 shrink-0">
            <div className="bg-navy-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Monthly runs</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {usage.runsThisMonth} / {usage.runsLimit === Infinity ? '∞' : usage.runsLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', runsPercent > 85 ? 'bg-red-500' : 'bg-brand-500')}
                  style={{ width: `${runsPercent}%` }}
                />
              </div>
              {runsPercent > 80 && (
                <Link href="/app/settings?tab=billing" className="block mt-2 text-[10px] text-amber-400 hover:text-amber-300 transition-colors font-mono">
                  Upgrade for more runs →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* User */}
        <div className="p-3 border-t border-navy-700 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-navy-800 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(session?.user?.name || session?.user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">
                {session?.user?.name || session?.user?.email}
              </div>
              <div className="text-[10px] text-slate-600 font-mono truncate">
                {session?.user?.email}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  )
}
