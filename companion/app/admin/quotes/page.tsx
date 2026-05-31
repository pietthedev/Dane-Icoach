'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Quote { id: string; body: string; author: string | null; category: string | null; source: string; created_at: string }

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('quotes').select('id, body, author, category, source, created_at').order('created_at', { ascending: false }).limit(20)
    setQuotes((data as Quote[]) ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  async function saveQuote() {
    if (!body.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('quotes').insert({ body, author: author || null, category: category || null, source: 'manual' })
    setBody(''); setAuthor(''); setCategory('')
    await load()
    setSaving(false)
  }

  async function generateQuote() {
    setGenerating(true)
    await fetch('/api/admin/quotes/generate', { method: 'POST' })
    await load()
    setGenerating(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Quotes</h1>
        <button onClick={generateQuote} disabled={generating}
          className="font-inter font-semibold text-sm text-plum px-5 py-2.5 rounded-full border border-plum hover:bg-plum hover:text-white transition-colors disabled:opacity-60">
          {generating ? 'Generating…' : '✦ Generate with AI'}
        </button>
      </div>

      {/* Today's quote */}
      {quotes[0] && (
        <div className="rounded-3xl p-6 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #2E1A47 0%, #4B2E83 100%)' }}>
          <p className="font-inter text-xs uppercase tracking-widest mb-2 opacity-60">Today&apos;s quote</p>
          <p className="font-poppins font-bold text-lg mb-2" style={{ letterSpacing: '-0.02em' }}>&ldquo;{quotes[0].body}&rdquo;</p>
          {quotes[0].author && <p className="font-inter text-sm opacity-60">— {quotes[0].author}</p>}
        </div>
      )}

      {/* Write form */}
      <div className="bg-white rounded-3xl p-5 border border-line shadow-card mb-6">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Write a quote</h2>
        <div className="flex flex-col gap-3">
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Quote text…"
            className="font-inter text-sm border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum resize-none w-full" />
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author (optional)" className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum" />
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (optional)" className="font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum" />
          </div>
          <button onClick={saveQuote} disabled={saving || !body.trim()}
            className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark disabled:opacity-60 transition-colors shadow-soft w-fit">
            {saving ? 'Saving…' : 'Save quote'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {quotes.slice(1).map(q => (
          <div key={q.id} className="bg-white rounded-3xl p-4 border border-line shadow-card">
            <p className="font-inter text-sm text-ink mb-1">&ldquo;{q.body}&rdquo;</p>
            <div className="flex items-center gap-2 flex-wrap">
              {q.author && <span className="font-inter text-xs text-muted">— {q.author}</span>}
              {q.category && <span className="font-inter text-xs px-2 py-0.5 rounded-full bg-mist text-muted">{q.category}</span>}
              <span className={`font-inter text-xs px-2 py-0.5 rounded-full ${q.source === 'ai' ? 'bg-purple-100 text-purple-700' : 'bg-mist text-muted'}`}>{q.source}</span>
              <span className="font-inter text-xs text-muted ml-auto">{new Date(q.created_at).toLocaleDateString('en-ZA')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
