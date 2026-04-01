'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { Plus, X, Eye, EyeOff, Loader2, Trash2, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { CONNECTORS } from '@ziz/shared/src/connectors'
import type { ConnectorDefinition } from '@ziz/shared/src/types'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data)

const CATEGORIES = [
  { value: 'all',                label: 'All apps'           },
  { value: 'messaging',          label: 'Messaging'          },
  { value: 'email',              label: 'Email'              },
  { value: 'crm',                label: 'CRM'                },
  { value: 'data',               label: 'Data & Sheets'      },
  { value: 'payments',           label: 'Payments'           },
  { value: 'project_management', label: 'Project management' },
  { value: 'marketing',          label: 'Marketing'          },
  { value: 'ecommerce',          label: 'E-commerce'         },
  { value: 'developer',          label: 'Developer & Custom' },
  { value: 'ai',                 label: 'AI'                 },
]

export default function CredentialsPage() {
  const { data: saved, mutate } = useSWR<any[]>('/api/credentials', fetcher)
  const [category,  setCategory]  = useState('all')
  const [search,    setSearch]    = useState('')
  const [openForm,  setOpenForm]  = useState<string | null>(null)
  const [testing,   setTesting]   = useState<string | null>(null)
  const [deleting,  setDeleting]  = useState<string | null>(null)

  const savedIds    = new Set(saved?.map(c => c.service) || [])
  const filtered    = CONNECTORS.filter(c =>
    (category === 'all' || c.category === category) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  )

  const handleTest = async (credId: string) => {
    setTesting(credId)
    await fetch(`/api/credentials/${credId}`, { method: 'POST' })
    mutate()
    setTesting(null)
  }

  const handleDelete = async (credId: string) => {
    if (!confirm('Remove this credential? Any workflows using it will stop working.')) return
    setDeleting(credId)
    await fetch(`/api/credentials/${credId}`, { method: 'DELETE' })
    mutate()
    setDeleting(null)
  }

  return (
    <div className="flex-1 overflow-y-auto px-7 py-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white mb-0.5">Credentials</h1>
          <p className="text-sm text-slate-500 font-mono">All keys encrypted · AES-256-GCM · Never logged</p>
        </div>
      </div>

      {/* Connected */}
      {saved && saved.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-widest mb-3">
            Connected ({saved.length})
          </h2>
          <div className="app-card overflow-hidden divide-y divide-navy-700">
            {saved.map(cred => {
              const def = CONNECTORS.find(c => c.id === cred.service)
              return (
                <div key={cred.id} className="flex items-center gap-3.5 px-5 py-4">
                  {def && (
                    <div className="connector-icon w-9 h-9 text-xs rounded-xl shrink-0"
                      style={{ backgroundColor: def.color + '33', color: def.color }}>
                      {def.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white">{cred.name}</span>
                      {cred.isVerified
                        ? <span className="app-badge-green">verified</span>
                        : <span className="app-badge-amber">not tested</span>
                      }
                    </div>
                    <div className="text-[11px] font-mono text-slate-600">
                      {def?.name} · added {new Date(cred.createdAt).toLocaleDateString()}
                    </div>
                    {cred.lastTestError && (
                      <div className="text-[11px] text-red-400 mt-0.5 truncate">{cred.lastTestError}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleTest(cred.id)} disabled={!!testing}
                      className="app-btn-ghost text-xs py-1.5 px-3">
                      {testing === cred.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Test'}
                    </button>
                    <button onClick={() => handleDelete(cred.id)} disabled={!!deleting}
                      className="text-slate-600 hover:text-red-400 transition-colors p-1.5">
                      {deleting === cred.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-5">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search apps…" className="app-input max-w-xs text-sm"
        />
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={clsx('text-xs px-3 py-1.5 rounded-lg transition-all border font-medium',
                category === c.value
                  ? 'bg-brand-500/15 text-brand-300 border-brand-500/30'
                  : 'text-slate-500 hover:text-slate-300 border-navy-700 bg-navy-900'
              )}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Connector grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map(connector => (
          <ConnectorCard
            key={connector.id}
            connector={connector}
            isConnected={savedIds.has(connector.id)}
            isOpen={openForm === connector.id}
            onToggle={() => setOpenForm(p => p === connector.id ? null : connector.id)}
            onSaved={() => { mutate(); setOpenForm(null) }}
          />
        ))}
      </div>
    </div>
  )
}

function ConnectorCard({ connector, isConnected, isOpen, onToggle, onSaved }: {
  connector: ConnectorDefinition
  isConnected: boolean
  isOpen: boolean
  onToggle: () => void
  onSaved: () => void
}) {
  const [name,    setName]    = useState(`My ${connector.name}`)
  const [values,  setValues]  = useState<Record<string, string>>({})
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({})

  const save = async () => {
    setError('')
    for (const field of connector.fields) {
      if (field.required && !values[field.key]?.trim()) {
        setError(`${field.label} is required`)
        return
      }
    }
    setSaving(true)
    try {
      const res = await fetch('/api/credentials', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, service: connector.id, authType: connector.authType, data: values }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error || 'Failed to save')
        return
      }
      onSaved()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div className={clsx('app-card overflow-hidden transition-all', isOpen && 'border-brand-500/30')}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-navy-850 transition-colors text-left">
        <div className="connector-icon w-10 h-10 text-xs rounded-xl shrink-0"
          style={{ backgroundColor: connector.color + '33', color: connector.color }}>
          {connector.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{connector.name}</span>
            {isConnected && <span className="app-badge-green text-[9px]">connected</span>}
          </div>
          <div className="text-[11px] text-slate-600 font-mono truncate">{connector.description}</div>
        </div>
        <ChevronDown className={clsx('w-4 h-4 text-slate-600 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="border-t border-navy-700 px-4 pb-4 pt-3 space-y-3">
          {connector.fields.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono">No credentials needed — this connector is built-in.</p>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Connection name
                </label>
                <input className="app-input text-sm" value={name} onChange={e => setName(e.target.value)} />
              </div>

              {connector.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    {field.label}
                    {!field.required && <span className="ml-1.5 normal-case text-slate-700 font-normal">(optional)</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="app-input text-xs font-mono resize-none min-h-[70px]"
                      value={values[field.key] || ''}
                      onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="app-input text-sm"
                      value={values[field.key] || ''}
                      onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !showPwd[field.key] ? 'password' : 'text'}
                        className="app-input text-sm pr-9"
                        value={values[field.key] || ''}
                        onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                      />
                      {field.type === 'password' && (
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, [field.key]: !p[field.key] }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                          {showPwd[field.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  )}
                  {field.help && (
                    <p className="text-[10.5px] font-mono text-slate-600 mt-1.5">
                      {field.help}{' '}
                      {field.helpUrl && <a href={field.helpUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">Open ↗</a>}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {error && (
            <div className="text-xs font-mono text-red-400 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving} className="app-btn-success flex-1 justify-center text-xs py-2">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
              {saving ? 'Saving…' : 'Save & test connection'}
            </button>
            <button onClick={onToggle} className="app-btn-ghost text-xs py-2 px-3">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
