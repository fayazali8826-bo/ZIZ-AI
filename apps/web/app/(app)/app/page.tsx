'use client'
import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Plus, ArrowRight, Check, AlertTriangle, Loader2, ChevronRight, Play, Pause, Zap } from 'lucide-react'
import { clsx } from 'clsx'
import { CONNECTORS } from '@ziz/shared/src/connectors'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data)

const TEMPLATES = [
  { id: 't1', emoji: '💳', name: 'Stripe payment → Slack', description: 'Notify your team every time a payment succeeds', connectors: ['stripe', 'slack'], prompt: 'When a Stripe payment succeeds, send a Slack message to #revenue with the customer name and amount' },
  { id: 't2', emoji: '📋', name: 'Form submission → CRM', description: 'Add new leads to HubSpot automatically', connectors: ['hubspot'], prompt: 'When someone submits my contact form, create a contact in HubSpot and notify the sales team on Slack' },
  { id: 't3', emoji: '📧', name: 'New lead → Welcome email', description: 'Send a personalised welcome email to new leads', connectors: ['gmail'], prompt: 'When someone fills my signup form, send them a personalised welcome email via Gmail' },
  { id: 't4', emoji: '📈', name: 'Daily sales report', description: 'Get a Slack summary of revenue every morning', connectors: ['stripe', 'slack'], prompt: 'Every morning at 9am, send a daily sales report to Slack with yesterday revenue and number of transactions' },
  { id: 't5', emoji: '🤖', name: 'WhatsApp AI responder', description: 'Auto-reply to WhatsApp messages with AI', connectors: ['whatsapp'], prompt: 'When I receive a WhatsApp message, have the AI read it and send a helpful automated reply' },
  { id: 't6', emoji: '🔗', name: 'Webhook → Google Sheets', description: 'Log every webhook event to a spreadsheet', connectors: ['google_sheets'], prompt: 'When my webhook receives data, append a new row to my Google Sheets spreadsheet' },
]

function getConnector(type: string) {
  const c = CONNECTORS.find(c => type?.includes(c.id) || c.actions.some(a => a.includes(type?.split('_')[0] || '')))
  return c ? { icon: c.icon, color: c.color } : { icon: 'ZZ', color: '#1a1a2e' }
}

export default function DashboardPage() {
  const { data: workflows,  mutate: mutateWf  } = useSWR('/api/workflows',           fetcher, { refreshInterval: 8000 })
  const { data: executions                     } = useSWR('/api/executions?limit=30', fetcher, { refreshInterval: 5000 })
  const { data: usage                          } = useSWR('/api/usage',               fetcher, { refreshInterval: 30000 })

  const activeCount  = workflows?.filter((w: any) => w.status === 'ACTIVE').length || 0
  const failedToday  = executions?.filter((e: any) => e.status === 'FAILED').length || 0
  const totalRuns    = executions?.length || 0
  const successRate  = totalRuns > 0
    ? Math.round(executions.filter((e: any) => e.status === 'SUCCESS').length / totalRuns * 100)
    : 100

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main */}
      <div className="flex-1 overflow-y-auto px-7 py-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-xl font-bold text-white mb-0.5">Dashboard</h1>
            <p className="text-sm text-slate-500 font-mono">ziz / dashboard</p>
          </div>
          <Link href="/app/create" className="app-btn-primary">
            <Plus className="w-4 h-4" /> New workflow
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-7">
          {[
            { label: 'Runs this month',  value: usage?.runsThisMonth ?? 0,  sub: `of ${usage?.runsLimit === Infinity ? '∞' : (usage?.runsLimit || 100)}` },
            { label: 'Success rate',     value: `${successRate}%`,          sub: 'this period',      color: 'text-accent-400' },
            { label: 'Active workflows', value: activeCount,                sub: 'running 24/7' },
            { label: 'Errors',           value: failedToday,                sub: 'need attention',   color: failedToday > 0 ? 'text-red-400' : undefined },
          ].map(s => (
            <div key={s.label} className="app-card p-4">
              <div className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-widest mb-2">{s.label}</div>
              <div className={clsx('text-3xl font-bold font-mono tracking-tight mb-1', s.color || 'text-white')}>{s.value}</div>
              <div className="text-[11px] font-mono text-slate-600">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {(!workflows || workflows.length === 0) && (
          <div className="app-card p-10 text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="25" viewBox="0 0 36 28" fill="none">
                <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
                  stroke="#2e7dff" strokeWidth="2.5" fill="none"/>
                <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Create your first automation</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              Describe what you want to automate in plain English. Ziz AI builds the workflow for you in seconds.
            </p>
            <Link href="/app/create" className="app-btn-primary inline-flex">
              <Plus className="w-4 h-4" /> Start automating
            </Link>
          </div>
        )}

        {/* Workflows */}
        {workflows?.length > 0 && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-widest">
                Your workflows
              </h2>
              <Link href="/app/create" className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-mono">
                + new
              </Link>
            </div>
            <div className="app-card overflow-hidden divide-y divide-navy-700">
              {workflows.map((wf: any) => <WorkflowRow key={wf.id} wf={wf} onRefresh={mutateWf} />)}
            </div>
          </div>
        )}

        {/* Templates */}
        <div>
          <h2 className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-widest mb-3">
            Start from a template
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <Link key={t.id} href={`/app/create?prompt=${encodeURIComponent(t.prompt)}`}
                className="app-card p-4 hover:border-brand-500/30 transition-all group block"
              >
                <div className="text-2xl mb-3">{t.emoji}</div>
                <div className="text-sm font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors">
                  {t.name}
                </div>
                <div className="text-xs text-slate-500 leading-relaxed line-clamp-2">{t.description}</div>
                <div className="flex gap-1.5 mt-3">
                  {t.connectors.map(c => {
                    const conn = CONNECTORS.find(x => x.id === c)
                    return conn ? (
                      <span key={c} className="connector-icon w-5 h-5 text-[9px] rounded-md"
                        style={{ backgroundColor: conn.color + '33', color: conn.color }}>
                        {conn.icon}
                      </span>
                    ) : null
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Live activity sidebar */}
      <div className="w-72 shrink-0 border-l border-navy-700 flex flex-col overflow-hidden bg-navy-900">
        <div className="px-4 py-3 border-b border-navy-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
            Live activity
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!executions || executions.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="text-slate-700 text-xs font-mono">no activity yet</div>
              <div className="text-slate-800 text-[10px] font-mono mt-1">runs will appear here</div>
            </div>
          ) : (
            executions.slice(0, 50).map((ex: any) => (
              <div key={ex.id} className="flex items-start gap-2.5 px-4 py-3 border-b border-navy-800 hover:bg-navy-850 transition-colors">
                <div className="mt-1.5 shrink-0">
                  {ex.status === 'SUCCESS' && <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />}
                  {ex.status === 'FAILED'  && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {(ex.status === 'RUNNING' || ex.status === 'PENDING') && <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400 truncate">
                    <span className="text-slate-200 font-medium">{ex.workflow?.name}</span>
                  </div>
                  {ex.status === 'FAILED' && ex.errorMessage && (
                    <div className="text-[10.5px] text-red-400 truncate mt-0.5">{ex.errorMessage}</div>
                  )}
                  {ex.suggestedFix && (
                    <div className="text-[10px] text-brand-400 font-mono mt-0.5 truncate">
                      Fix: {ex.suggestedFix}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-slate-700 mt-0.5">
                    {new Date(ex.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {ex.durationMs ? ` · ${ex.durationMs < 1000 ? ex.durationMs + 'ms' : (ex.durationMs / 1000).toFixed(1) + 's'}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function WorkflowRow({ wf, onRefresh }: { wf: any; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const action = wf.status === 'ACTIVE' ? 'pause' : 'activate'
    await fetch(`/api/workflows/${wf.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action === 'activate' ? 'ACTIVE' : 'PAUSED' }),
    })
    onRefresh()
    setLoading(false)
  }

  const run = async () => {
    setLoading(true)
    const res = await fetch(`/api/workflows/${wf.id}/run`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    if (!res.ok) alert(data.error || 'Failed to run')
    setLoading(false)
    setTimeout(onRefresh, 2000)
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-navy-850 transition-colors">
      <div className={clsx('shrink-0',
        wf.status === 'ACTIVE' ? 'status-live' :
        wf.status === 'FAILED' ? 'status-error' : 'status-paused'
      )} />
      <div className="flex-1 min-w-0">
        <Link href={`/app/workflows/${wf.id}`} className="text-sm font-medium text-white hover:text-brand-300 transition-colors truncate block">
          {wf.name}
        </Link>
        <div className="text-[10px] font-mono text-slate-600">
          {wf.runCount} runs · last {wf.lastRunAt ? new Date(wf.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'never'}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={run} disabled={loading} className="app-btn-ghost text-xs py-1 px-2">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
        </button>
        <button onClick={toggle} disabled={loading}
          className={clsx('text-xs py-1 px-2 rounded-md font-medium transition-all border',
            wf.status === 'ACTIVE'
              ? 'border-slate-700 text-slate-400 hover:border-red-500/40 hover:text-red-400'
              : 'border-accent-400/30 text-accent-400 hover:bg-accent-400/10'
          )}
        >
          {wf.status === 'ACTIVE' ? <Pause className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
        </button>
      </div>
    </div>
  )
}
