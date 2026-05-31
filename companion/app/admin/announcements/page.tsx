'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Announcement { id: string; title: string; body: string; type: string; is_active: boolean; target_plans: string[] | null; starts_at: string | null; ends_at: string | null }

const TYPES = ['info', 'warning', 'success', 'promo']
const PLANS = ['all', 'start', 'explorer', 'grow', 'voice', 'business']
const TYPE_STYLES: Record<string, string> = { info: 'bg-blue-100 text-blue-700', warning: 'bg-amber-100 text-amber-700', success: 'bg-green-100 text-green-700', promo: 'bg-purple-100 text-purple-700' }

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState('info')
  const [plans, setPlans] = useState<string[]>(['all'])
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setItems((data as Announcement[]) ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!title || !body) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('announcements').insert({ title, body, type, target_plans: plans, starts_at: startsAt || null, ends_at: endsAt || null, is_active: true })
    setTitle(''); setBody('')
    await load()
    setSaving(false)
  }

  async function toggle(id: string, is_active: boolean) {
    const supabase = createClient()
    await supabase.from('announcements').update({ is_active: !is_active }).eq('id', id)
    await load()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Announcements</h1>

      <div className="bg-white rounded-3xl p-5 border border-line shadow-card mb-6">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Create announcement</h2>
        <div className="flex flex-col gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum" />
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Message body…" className="font-inter text-sm border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum resize-none" />
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)} className={`font-inter text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${type === t ? TYPE_STYLES[t] + ' font-semibold' : 'bg-mist text-muted'}`}>{t}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {PLANS.map(p => (
              <button key={p} onClick={() => setPlans(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                className={`font-inter text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${plans.includes(p) ? 'bg-plum text-white' : 'bg-mist text-muted'}`}>{p}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="font-inter text-xs text-muted block mb-1">Start date</label><input type="date" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum w-full" /></div>
            <div><label className="font-inter text-xs text-muted block mb-1">End date</label><input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum w-full" /></div>
          </div>
          <button onClick={create} disabled={saving || !title || !body}
            className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark disabled:opacity-60 transition-colors shadow-soft w-fit">
            {saving ? 'Creating…' : 'Create announcement'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map(a => (
          <div key={a.id} className={`bg-white rounded-3xl p-4 border shadow-card ${a.is_active ? 'border-line' : 'border-mist opacity-60'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-inter font-semibold text-ink text-sm">{a.title}</p>
                  <span className={`font-inter text-xs px-2 py-0.5 rounded-full ${TYPE_STYLES[a.type] ?? 'bg-mist text-muted'}`}>{a.type}</span>
                  {!a.is_active && <span className="font-inter text-xs text-muted">Inactive</span>}
                </div>
                <p className="font-inter text-xs text-muted">{a.body}</p>
              </div>
              <button onClick={() => toggle(a.id, a.is_active)} className="font-inter text-xs text-plum hover:underline flex-shrink-0">
                {a.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
