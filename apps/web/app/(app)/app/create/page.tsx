'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Send, Loader2, Check, AlertTriangle, ChevronRight, Zap } from 'lucide-react'
import { clsx } from 'clsx'
import { CONNECTORS } from '@ziz/shared/src/connectors'
import type { WorkflowDefinition, StepNode, StepType } from '@ziz/shared/src/types'

function getConnectorMeta(type: string) {
  const c = CONNECTORS.find(c =>
    c.id === type?.split('_')[0] ||
    c.actions.includes(type as any) ||
    c.triggers.includes(type as any)
  )
  return c ? { icon: c.icon, color: c.color, name: c.name } : { icon: '⚙', color: '#1a1a2e', name: type }
}

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  workflowDraft?: WorkflowDefinition
  credentialRequest?: { service: string; helpSteps: string[]; helpUrl?: string }
  timestamp: string
}

export default function CreatePage() {
  const params = useSearchParams()
  const router = useRouter()
  const initPrompt = params.get('prompt') || ''

  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>()
  const [workflowId, setWorkflowId] = useState<string>()
  const [draftWf, setDraftWf] = useState<WorkflowDefinition | null>(null)
  const [activating, setActivating] = useState(false)
  const [activated, setActivated] = useState(false)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({})
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const greeting = initPrompt
      ? `Hi! I'm ZIZ AI. I'll help you build this automation right away.`
      : `Hi! I'm ZIZ AI. Tell me what you want to automate and I'll build it for you — no code needed.\n\nFor example:\n• "When someone pays on Stripe, send a Slack message"\n• "When I get a new lead, add them to HubSpot"\n• "Every morning, send me a sales report"`

    setMessages([{ role: 'assistant', content: greeting, timestamp: new Date().toISOString() }])
    if (initPrompt) {
      send(initPrompt)
    }
  }, [initPrompt])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveWorkflow = useCallback(async (updatedWf: WorkflowDefinition) => {
    if (!workflowId) return
    await fetch(`/api/workflows/${workflowId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ definition: updatedWf }),
    })
  }, [workflowId])

  const send = useCallback(async (text: string) => {
    if (!text?.trim() || loading) return
    setInput('')
    setLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date().toISOString() }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, workflowId }),
      })
      const json = await res.json()
      const { response, sessionId: sid, workflowId: wid } = json

      if (sid) setSessionId(sid)
      if (wid) setWorkflowId(wid)
      if (response?.workflow) setDraftWf(response.workflow)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response?.message || 'Done',
        workflowDraft: response?.workflow,
        credentialRequest: response?.service ? { service: response.service, helpSteps: response.helpSteps || [], helpUrl: response.helpUrl } : undefined,
        timestamp: new Date().toISOString(),
      }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.', timestamp: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }, [loading, sessionId, workflowId])

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    setDragging(nodeId)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y
    setNodePositions(prev => ({ ...prev, [dragging]: { x, y } }))
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const updateNodeConfig = (nodeId: string, config: Record<string, any>) => {
    if (!draftWf) return

    const updatedWf = { ...draftWf }
    if (nodeId === 'trigger') {
      updatedWf.trigger = { ...updatedWf.trigger, config: { ...updatedWf.trigger?.config, ...config } }
    } else {
      const idx = updatedWf.steps?.findIndex(s => s.id === nodeId)
      if (idx !== undefined && idx !== -1 && updatedWf.steps) {
        updatedWf.steps[idx] = { ...updatedWf.steps[idx], config: { ...updatedWf.steps[idx].config, ...config } }
      }
    }

    setDraftWf(updatedWf)
    saveWorkflow(updatedWf)
  }

  const addNode = (connectorId: string) => {
    if (!draftWf) return
    const connector = CONNECTORS.find(c => c.id === connectorId)
    if (!connector) return

    const actionType = connector.actions[0] || `${connectorId}_action` as StepType
    const newStep: StepNode = {
      id: `${connectorId}_${Date.now()}`,
      type: actionType,
      name: connector.name,
      description: connector.description || '',
      config: {},
      inputMapping: [],
      outputSchema: [],
    }

    const updatedWf: WorkflowDefinition = {
      ...draftWf,
      steps: [...(draftWf.steps || []), newStep],
    }

    setDraftWf(updatedWf)
    saveWorkflow(updatedWf)
  }

  const activate = async () => {
    if (!workflowId || activating || activated) return
    setActivating(true)
    try {
      const res = await fetch(`/api/workflows/${workflowId}/activate`, { method: 'POST' })
      if (res.ok) {
        setActivated(true)
        setTimeout(() => router.push('/app'), 2000)
      }
    } catch (error) {
      console.error('activation', error)
    } finally {
      setActivating(false)
    }
  }

  const QUICK_PROMPTS = [
    'Stripe payment → Slack',
    'New lead → HubSpot + email',
    'Form submission → Google Sheets',
    'Daily sales report at 9am',
  ]

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-[440px] shrink-0 border-r border-navy-700 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-navy-700 shrink-0">
          <div className="w-9 h-9 rounded-full bg-brand-500/10 border border-brand-500/25 flex items-center justify-center relative">
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-400 border-2 border-navy-900" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">ZIZ AI</div>
            <div className="text-[10.5px] font-mono text-slate-600">Here we go!</div>
          </div>
          <span className="ml-auto app-badge-blue text-[9px]">Automate Everything</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={clsx('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={clsx('max-w-[92%] px-4 py-3 text-[13px] leading-relaxed rounded-2xl',
                msg.role === 'user' ? 'bg-brand-500 text-white rounded-br-sm' : 'bg-navy-800 text-slate-200 border border-navy-700 rounded-bl-sm')}
              >
                {msg.content.split('\n').map((line, j, arr) => (
                  <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                ))}
              </div>
              {msg.credentialRequest && (
                <div className="mt-2 max-w-[94%] bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                      {msg.credentialRequest.service} needed
                    </span>
                  </div>
                  <a href="/app/credentials" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300 hover:text-brand-200 transition-colors">
                    Connect {msg.credentialRequest.service} <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              )}
              <span className="text-[10px] font-mono text-slate-700 mt-1">
                {msg.role === 'user' ? 'you' : 'ziz ai'} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {loading && (
            <div className="flex items-start">
              <div className="bg-navy-800 border border-navy-700 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-4 py-2 border-t border-navy-700 flex gap-1.5 overflow-x-auto shrink-0">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} className="text-[10px] font-mono text-slate-600 hover:text-brand-300 bg-navy-850 hover:bg-brand-500/10 border border-navy-700 hover:border-brand-500/25 px-2.5 py-1 rounded-md whitespace-nowrap transition-all">
              {p}
            </button>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-navy-700 shrink-0">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Describe your automation..."
              className="flex-1 bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none min-h-[40px] max-h-32"
              rows={1}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || loading} className="bg-brand-500 hover:bg-brand-600 disabled:bg-navy-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 bg-navy-900 border-r border-navy-700 flex flex-col">
          <div className="p-4 border-b border-navy-700">
            <h3 className="text-sm font-semibold text-white">Add Nodes</h3>
            <p className="text-xs text-slate-600 mt-1">Drag or click to add to your workflow</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {['messaging', 'email', 'crm', 'data', 'payments'].map(category => (
              <div key={category} className="p-4 border-b border-navy-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{category.replace('_', ' ')}</h4>
                <div className="space-y-2">
                  {CONNECTORS.filter(c => c.category === category).map(c => (
                    <button key={c.id} onClick={() => addNode(c.id)} className="w-full p-3 bg-navy-800 border border-navy-700 rounded-lg hover:border-brand-500/40 transition-all text-left group">
                      <div className="flex items-center gap-3">
                        <div className="connector-icon w-8 h-8 text-xs rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.color + '33', color: c.color }}>
                          {c.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors truncate">{c.name}</div>
                          <div className="text-xs text-slate-600 truncate">{c.description?.slice(0, 50) || ''}...</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {draftWf ? (
              <>
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-navy-700 bg-navy-900 shrink-0">
                  <div>
                    <div className="text-sm font-semibold text-white">{draftWf.name}</div>
                    <div className="text-[11px] font-mono text-slate-600 mt-0.5">{draftWf.description}</div>
                  </div>
                  <button onClick={activate} disabled={activating || activated || !workflowId} className="app-btn-success text-xs py-2 px-4">
                    {activating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : activated ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    {activated ? 'Activated!' : activating ? 'Activating…' : 'Activate'}
                  </button>
                </div>
                <div ref={canvasRef} className="flex-1 relative overflow-auto bg-navy-950" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={() => setSelectedNode(null)}>
                  <div className="absolute inset-0 p-10">
                    {[{ ...draftWf.trigger, kind: 'trigger', id: 'trigger' }, ...(draftWf.steps || []).map((s, idx) => ({ ...s, kind: 'action', id: s.id || `step_${idx}` }))].map((node: any, idx) => {
                      const meta = getConnectorMeta(node.type || '')
                      const pos = nodePositions[node.id] || { x: 100 + idx * 250, y: 150 }
                      return (
                        <div key={node.id} className={clsx('absolute bg-navy-850 border rounded-2xl p-5 text-center w-40 shadow-xl cursor-move transition-all', selectedNode === node.id ? 'ring-2 ring-brand-500 border-brand-500' : '', node.kind === 'trigger' ? 'border-purple-500/30' : node.type?.startsWith('ai_') ? 'border-brand-500/30' : 'border-navy-700')} style={{ left: pos.x, top: pos.y }} onMouseDown={e => { e.stopPropagation(); handleMouseDown(e, node.id) }} onClick={e => { e.stopPropagation(); setSelectedNode(node.id) }}>
                          <div className="text-[9px] font-mono uppercase tracking-widest mb-2.5 font-semibold" style={{ color: node.kind === 'trigger' ? '#a855f7' : node.type?.startsWith('ai_') ? '#2e7dff' : '#475569' }}>{node.kind}</div>
                          <div className="connector-icon w-12 h-12 text-sm rounded-xl mx-auto mb-2.5" style={{ backgroundColor: meta.color + '33', color: meta.color }}>{meta.icon}</div>
                          <div className="text-xs font-semibold text-white leading-tight">{node.name}</div>
                          {node.credentialId && <div className="mt-2 app-badge-green text-[9px] mx-auto">connected</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 canvas-grid flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <div className="text-slate-700 font-mono text-sm">Please build your workflow</div>
                  <div className="text-slate-800 font-mono text-xs mt-1">Your workflow will appear here</div>
                </div>
              </div>
            )}
          </div>

          {selectedNode && draftWf && (
            <div className="w-80 bg-navy-900 border-l border-navy-700 flex flex-col">
              <div className="p-4 border-b border-navy-700">
                <h3 className="text-sm font-semibold text-white">Configure Node</h3>
                <p className="text-xs text-slate-600 mt-1">Set up your automation step</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {(() => {
                  const node = selectedNode === 'trigger' ? { ...draftWf.trigger, kind: 'trigger' } : draftWf.steps?.find(s => s.id === selectedNode)
                  if (!node) return null
                  const connector = CONNECTORS.find(c => c.id === node.type?.split('_')[0])
                  return (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Node Type</label>
                        <div className="text-sm text-white">{node.name}</div>
                      </div>
                      {connector?.fields.map(field => (
                        <div key={field.key}>
                          <label className="block text-xs font-medium text-slate-400 mb-1">{field.label}</label>
                          <input
                            type={field.type === 'password' ? 'password' : 'text'}
                            placeholder={field.placeholder || ''}
                            value={String(node.config?.[field.key] || '')}
                            onChange={(e) => updateNodeConfig(selectedNode as string, { [field.key]: e.target.value })}
                            className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-md text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          />
                          {field.help && <p className="text-xs text-slate-600 mt-1">{field.help}</p>}
                        </div>
                      ))}
                      {node.type === 'slack_send_message' && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Channel</label>
                            <input
                              type="text"
                              placeholder="#general"
                              value={String(node.config?.channel || '')}
                              onChange={(e) => updateNodeConfig(selectedNode as string, { channel: e.target.value })}
                              className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-md text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Message</label>
                            <textarea
                              placeholder="Your message here..."
                              value={String(node.config?.message || '')}
                              onChange={(e) => updateNodeConfig(selectedNode as string, { message: e.target.value })}
                              className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-md text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
                              rows={3}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
