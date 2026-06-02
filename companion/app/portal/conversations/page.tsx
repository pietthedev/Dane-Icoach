'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type ColorTag = 'green' | 'blue' | 'amber' | 'red' | 'purple' | null

interface Conversation {
  id: string
  title: string | null
  created_at: string
  conversation_ratings?: { rating: number | null; color_tag: ColorTag; notes: string | null }[]
}

interface Summary {
  summary: string
  key_topics: string[]
  action_items: string[]
}

const TAG_STYLES: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
}

const TAG_LABELS: Record<string, string> = {
  green: 'Great',
  blue: 'Good',
  amber: 'Okay',
  red: 'Poor',
  purple: 'Insight',
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'green', label: 'Great' },
  { id: 'blue', label: 'Good' },
  { id: 'amber', label: 'Okay' },
  { id: 'red', label: 'Poor' },
  { id: 'purple', label: 'Insight' },
]

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'summary' | 'rating' | 'notes'>('summary')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [colorTag, setColorTag] = useState<ColorTag>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: convData } = await supabase
      .from('conversations')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const { data: ratingsData } = await supabase
      .from('conversation_ratings')
      .select('conversation_id, rating, color_tag, notes')
      .eq('user_id', user.id)

    const ratingsMap = Object.fromEntries(
      (ratingsData ?? []).map(r => [r.conversation_id, r])
    )

    const convs: Conversation[] = (convData ?? []).map(c => ({
      ...c,
      conversation_ratings: ratingsMap[c.id] ? [ratingsMap[c.id]] : [],
    }))
    setConversations(convs)
    // Refresh selected if open
    if (selected) {
      const refreshed = convs.find(c => c.id === selected.id)
      if (refreshed) {
        setSelected(refreshed)
        const r = refreshed.conversation_ratings?.[0]
        setRating(r?.rating ?? 0)
        setColorTag(r?.color_tag ?? null)
        setNotes(r?.notes ?? '')
      }
    }
  }, [selected])

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadSummary(conversationId: string) {
    setLoadingSummary(true)
    setSummary(null)
    const supabase = createClient()
    const { data } = await supabase
      .from('conversation_summaries')
      .select('summary, key_topics, action_items')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setSummary(data as Summary ?? null)
    setLoadingSummary(false)
  }

  function selectConv(conv: Conversation) {
    setSelected(conv)
    const r = conv.conversation_ratings?.[0]
    setRating(r?.rating ?? 0)
    setHoverRating(0)
    setColorTag(r?.color_tag ?? null)
    setNotes(r?.notes ?? '')
    setActiveTab('summary')
    setSavedFeedback(null)
    loadSummary(conv.id)
  }

  const filtered = conversations.filter(c => {
    const matchFilter = filter === 'all' || c.conversation_ratings?.[0]?.color_tag === filter
    const matchSearch = !search || (c.title ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  async function saveRating() {
    if (!selected) return
    setSaving(true)
    await fetch('/api/portal/ratings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: selected.id, rating, color_tag: colorTag }),
    })
    setSavedFeedback('Rating saved!')
    await load()
    setSaving(false)
    setTimeout(() => setSavedFeedback(null), 3000)
  }

  async function saveNotes() {
    if (!selected) return
    setSaving(true)
    await fetch('/api/portal/notes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: selected.id, notes }),
    })
    setSavedFeedback('Notes saved!')
    await load()
    setSaving(false)
    setTimeout(() => setSavedFeedback(null), 3000)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-full md:w-80 flex-shrink-0 border-r border-line flex flex-col bg-white">
        <div className="p-4 border-b border-line">
          <h1 className="font-poppins font-bold text-plum-dark text-lg mb-3" style={{ letterSpacing: '-0.03em' }}>Conversations</h1>
          <input
            type="search" placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full font-inter text-sm border border-mist rounded-2xl px-3 py-2 bg-cloud focus:outline-none focus:border-plum mb-3"
          />
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`font-inter text-xs px-2.5 py-1 rounded-full transition-colors ${filter === f.id ? 'bg-plum text-white' : 'bg-mist text-muted hover:bg-plum/10'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="font-inter text-sm text-muted p-5 text-center">No conversations yet</p>
          )}
          {filtered.map(conv => {
            const tag = conv.conversation_ratings?.[0]?.color_tag
            const r = conv.conversation_ratings?.[0]?.rating
            return (
              <button key={conv.id} onClick={() => selectConv(conv)}
                className={`w-full text-left px-4 py-3.5 border-b border-line hover:bg-cloud transition-colors ${selected?.id === conv.id ? 'bg-plum/5 border-l-2 border-l-plum' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-inter font-medium text-ink text-sm truncate">{conv.title ?? 'Conversation'}</p>
                  {tag && (
                    <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${TAG_STYLES[tag]}`}>
                      {TAG_LABELS[tag]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="font-inter text-xs text-muted">{new Date(conv.created_at).toLocaleDateString('en-ZA')}</p>
                  {r ? <span className="font-inter text-xs text-yellow-500">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span> : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-inter text-muted text-sm">Select a conversation to view details</p>
          </div>
        ) : (
          <div className="p-6 max-w-2xl">
            <h2 className="font-poppins font-bold text-plum-dark text-xl mb-1" style={{ letterSpacing: '-0.03em' }}>{selected.title ?? 'Conversation'}</h2>
            <p className="font-inter text-xs text-muted mb-5">{new Date(selected.created_at).toLocaleString('en-ZA')}</p>

            {savedFeedback && (
              <p className="font-inter text-sm text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-2 mb-4">
                ✓ {savedFeedback}
              </p>
            )}

            <div className="flex gap-1 bg-mist rounded-2xl p-1 mb-5 w-fit">
              {(['summary', 'rating', 'notes'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`font-inter text-sm px-4 py-1.5 rounded-xl capitalize transition-colors ${activeTab === tab ? 'bg-white text-plum-dark font-semibold shadow-card' : 'text-muted'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'summary' && (
              <div className="bg-white rounded-3xl p-5 border border-line">
                {loadingSummary ? (
                  <p className="font-inter text-muted text-sm">Loading summary...</p>
                ) : summary ? (
                  <div className="flex flex-col gap-4">
                    <p className="font-inter text-sm text-ink leading-relaxed">{summary.summary}</p>
                    {summary.key_topics?.length > 0 && (
                      <div>
                        <p className="font-inter font-semibold text-xs text-plum-dark uppercase tracking-wide mb-2">Key topics</p>
                        <div className="flex flex-wrap gap-1.5">
                          {summary.key_topics.map((t, i) => (
                            <span key={i} className="font-inter text-xs px-2.5 py-1 rounded-full bg-plum/10 text-plum">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {summary.action_items?.length > 0 && (
                      <div>
                        <p className="font-inter font-semibold text-xs text-plum-dark uppercase tracking-wide mb-2">Action items</p>
                        <ul className="flex flex-col gap-1.5">
                          {summary.action_items.map((a, i) => (
                            <li key={i} className="font-inter text-sm text-ink flex gap-2">
                              <span className="text-plum mt-0.5">→</span>{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-inter text-muted text-sm">No summary available for this conversation yet.</p>
                )}
              </div>
            )}

            {activeTab === 'rating' && (
              <div className="bg-white rounded-3xl p-5 border border-line flex flex-col gap-5">
                <div>
                  <p className="font-inter font-semibold text-plum-dark text-sm mb-3">Session rating</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s}
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl transition-transform hover:scale-110 focus:outline-none">
                        <span className={s <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-inter font-semibold text-plum-dark text-sm mb-2">Experience tag</p>
                  <div className="flex flex-wrap gap-2">
                    {(['green','blue','amber','red','purple'] as ColorTag[]).map(c => (
                      <button key={c!} onClick={() => setColorTag(c === colorTag ? null : c)}
                        className={`font-inter text-xs px-3 py-1.5 rounded-full border-2 transition-colors ${TAG_STYLES[c!]} ${colorTag === c ? 'border-current' : 'border-transparent'}`}>
                        {TAG_LABELS[c!]}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={saveRating} disabled={saving}
                  className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60 w-fit">
                  {saving ? 'Saving...' : 'Save rating'}
                </button>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="bg-white rounded-3xl p-5 border border-line flex flex-col gap-4">
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Add your notes about this conversation..."
                  rows={6}
                  className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum w-full resize-none"
                />
                <button onClick={saveNotes} disabled={saving}
                  className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60 w-fit">
                  {saving ? 'Saving...' : 'Save notes'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
