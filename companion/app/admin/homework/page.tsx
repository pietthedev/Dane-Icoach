'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface HWItem {
  id: string
  title: string
  status: string
  user_id: string
  due_date: string | null
  instructions: string | null
  feedback: string | null
}

export default function AdminHomeworkPage() {
  const [items, setItems] = useState<HWItem[]>([])
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  // Assign form
  const [clientId, setClientId] = useState('')
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assigning, setAssigning] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('homework').select('id, title, status, user_id, due_date, instructions, feedback').order('created_at', { ascending: false }).limit(50)
    setItems((data as HWItem[]) ?? [])
    const fb: Record<string, string> = {}
    ;(data ?? []).forEach((h: HWItem) => { fb[h.id] = h.feedback ?? '' })
    setFeedback(fb)
  }, [])

  useEffect(() => { load() }, [load])

  async function saveFeedback(id: string) {
    setSaving(id)
    const supabase = createClient()
    await supabase.from('homework').update({ feedback: feedback[id], status: 'completed', feedback_at: new Date().toISOString() }).eq('id', id)
    await load()
    setSaving(null)
  }

  async function assign() {
    if (!clientId || !title) return
    setAssigning(true)
    const supabase = createClient()
    await supabase.from('homework').insert({ user_id: clientId, title, instructions: instructions || null, due_date: dueDate || null, status: 'pending' })
    setClientId(''); setTitle(''); setInstructions(''); setDueDate('')
    await load()
    setAssigning(false)
  }

  const awaiting = items.filter(h => h.status === 'submitted')
  const pending = items.filter(h => h.status === 'pending')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Homework</h1>

      {/* Assign form */}
      <div className="bg-white rounded-3xl p-5 border border-line shadow-card mb-6">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Assign homework</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input value={clientId} onChange={e => setClientId(e.target.value)} placeholder="Client user ID" className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum" />
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Homework title" className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum" />
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum" />
          <input value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Instructions (optional)" className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum" />
        </div>
        <button onClick={assign} disabled={assigning || !clientId || !title}
          className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark disabled:opacity-60 transition-colors shadow-soft">
          {assigning ? 'Assigning…' : 'Assign homework'}
        </button>
      </div>

      {/* Awaiting review */}
      {awaiting.length > 0 && (
        <section className="mb-6">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Awaiting review ({awaiting.length})</h2>
          <div className="flex flex-col gap-3">
            {awaiting.map(h => (
              <div key={h.id} className="bg-white rounded-3xl p-5 border border-amber-200 shadow-card">
                <p className="font-inter font-semibold text-ink text-sm mb-1">{h.title}</p>
                <p className="font-inter text-xs text-muted mb-3">User: {h.user_id}</p>
                <textarea value={feedback[h.id] ?? ''} onChange={e => setFeedback(p => ({ ...p, [h.id]: e.target.value }))}
                  placeholder="Write feedback for the client…" rows={3}
                  className="w-full font-inter text-sm border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum resize-none mb-2" />
                <button onClick={() => saveFeedback(h.id)} disabled={saving === h.id}
                  className="font-inter font-semibold text-sm text-white px-4 py-2 rounded-full bg-plum hover:bg-plum-dark disabled:opacity-60 transition-colors shadow-soft">
                  {saving === h.id ? 'Saving…' : 'Submit feedback'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <section>
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Pending ({pending.length})</h2>
          <div className="flex flex-col gap-2">
            {pending.map(h => (
              <div key={h.id} className="bg-white rounded-3xl p-4 border border-line flex items-center justify-between gap-3">
                <div>
                  <p className="font-inter font-medium text-ink text-sm">{h.title}</p>
                  <p className="font-inter text-xs text-muted">{h.user_id}{h.due_date ? ` · Due ${new Date(h.due_date).toLocaleDateString('en-ZA')}` : ''}</p>
                </div>
                <span className="font-inter text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Pending</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
