'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { Check, AlertTriangle, Loader2, Activity, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react'
import { clsx } from 'clsx'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data)

const STATUS_FILTERS = ['all', 'SUCCESS', 'FAILED', 'RUNNING', 'PENDING']

export default function LogsPage() {
  const [filter,   setFilter]   = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const url = filter === 'all' ? '/api/executions?limit=100' : `/api/executions?limit=100&status=${filter}`
  const { data: executions, mutate, isLoading } = useSWR(url, fetcher, { refreshInterval: 5000 })

  const toggle = (id: string) => setExpanded(p => p === id ? null : id)

  return (
    <div className="flex-1 overflow-y-auto px-7 py-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white mb-0.5">Run logs</h1>
          <p className="text-sm text-slate-500 font-mono">every automation execution, in real time</p>
        </div>
        <button onClick={() => mutate()} className="app-btn-ghost text-xs py-2 px-3">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 bg-navy-900 border border-navy-700 rounded-xl p-1 w-fit mb-6">
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={clsx('px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all',
              filter === f ? 'bg-navy-800 text-white' : 'text-slate-500 hover:text-slate-300'
            )}>
            {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
      ) : !executions || executions.length === 0 ? (
        <div className="app-card p-16 text-center">
          <Activity className="w-10 h-10 text-slate-700 mx-auto mb-4" />
          <div className="text-slate-600 font-mono text-sm">no executions yet</div>
          <div className="text-slate-700 font-mono text-xs mt-1">activate a workflow and run it to see logs here</div>
        </div>
      ) : (
        <div className="app-card overflow-hidden divide-y divide-navy-700">
          {executions.map((ex: any) => (
            <div key={ex.id}>
              {/* Row */}
              <button
                onClick={() => toggle(ex.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-navy-850 transition-colors text-left"
              >
                {/* Status icon */}
                <div className="shrink-0">
                  {ex.status === 'SUCCESS' && <div className="w-7 h-7 rounded-full bg-accent-400/15 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-accent-400" /></div>}
                  {ex.status === 'FAILED'  && <div className="w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center"><AlertTriangle className="w-3.5 h-3.5 text-red-400" /></div>}
                  {(ex.status === 'RUNNING' || ex.status === 'PENDING') && <div className="w-7 h-7 rounded-full bg-brand-500/15 flex items-center justify-center"><Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" /></div>}
                </div>

                {/* Workflow name */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate mb-0.5">
                    {ex.workflow?.name || 'Unknown workflow'}
                  </div>
                  {ex.status === 'FAILED' && ex.errorMessage && (
                    <div className="text-xs text-red-400 truncate">{ex.errorMessage}</div>
                  )}
                  {ex.status === 'FAILED' && ex.suggestedFix && (
                    <div className="text-xs text-brand-400 font-mono truncate mt-0.5">
                      Fix: {ex.suggestedFix}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <div className={clsx('text-xs font-mono font-semibold',
                      ex.status === 'SUCCESS' ? 'text-accent-400' :
                      ex.status === 'FAILED'  ? 'text-red-400'    :
                      'text-brand-400'
                    )}>
                      {ex.status.charAt(0) + ex.status.slice(1).toLowerCase()}
                    </div>
                    {ex.durationMs && (
                      <div className="text-[10px] font-mono text-slate-600">
                        {ex.durationMs < 1000 ? `${ex.durationMs}ms` : `${(ex.durationMs / 1000).toFixed(1)}s`}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">
                      {new Date(ex.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-[10px] font-mono text-slate-600">
                      {new Date(ex.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                  {expanded === ex.id
                    ? <ChevronDown className="w-4 h-4 text-slate-600" />
                    : <ChevronRight className="w-4 h-4 text-slate-600" />
                  }
                </div>
              </button>

              {/* Expanded detail */}
              {expanded === ex.id && (
                <div className="bg-navy-950 border-t border-navy-700 px-5 py-4">
                  <div className="grid grid-cols-3 gap-4 mb-4 text-xs font-mono">
                    <div>
                      <div className="text-slate-600 mb-1">Execution ID</div>
                      <div className="text-slate-300 truncate">{ex.id}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Trigger</div>
                      <div className="text-slate-300">{ex.triggerType || 'manual'}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Duration</div>
                      <div className="text-slate-300">
                        {ex.durationMs ? (ex.durationMs < 1000 ? `${ex.durationMs}ms` : `${(ex.durationMs / 1000).toFixed(2)}s`) : 'running…'}
                      </div>
                    </div>
                  </div>

                  {/* Step results */}
                  {ex.stepResults && ex.stepResults.length > 0 && (
                    <div>
                      <div className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-widest mb-2">Step results</div>
                      <div className="space-y-2">
                        {ex.stepResults.map((step: any, i: number) => (
                          <div key={step.stepId || i} className={clsx(
                            'rounded-lg border px-3.5 py-2.5 text-xs font-mono',
                            step.status === 'success' ? 'border-accent-400/20 bg-accent-400/5'  :
                            step.status === 'failed'  ? 'border-red-500/20 bg-red-500/5'         :
                            step.status === 'skipped' ? 'border-slate-700 bg-navy-900'           :
                            'border-brand-500/20 bg-brand-500/5'
                          )}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-200">{step.stepName}</span>
                              <span className={clsx('text-[10px]',
                                step.status === 'success' ? 'text-accent-400' :
                                step.status === 'failed'  ? 'text-red-400'    :
                                step.status === 'skipped' ? 'text-slate-600'  : 'text-brand-400'
                              )}>
                                {step.status}
                                {step.durationMs ? ` · ${step.durationMs}ms` : ''}
                              </span>
                            </div>
                            {step.error?.message && (
                              <div className="text-red-400 mt-1">{step.error.message}</div>
                            )}
                            {step.output && Object.keys(step.output).length > 0 && step.status === 'success' && (
                              <div className="text-slate-600 mt-1 truncate">
                                output: {JSON.stringify(step.output).slice(0, 100)}…
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
