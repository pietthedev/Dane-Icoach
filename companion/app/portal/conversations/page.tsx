'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type ColorTag = 'green' | 'blue' | 'amber' | 'red' | 'purple' | null

interface Conversation {
  id: string
  title: string | null
  created_at: string
  mode: string | null
  started_at: string | null
  ended_at: string | null
  elevenlabs_conversation_id: string | null
  shared_with_coach: boolean
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
  const [activeTab, setActiveTab] = useState<'summary' | 'rating' | 'notes' | 'privacy'>('summary')
  // Mobile: show the list ('list') or the detail panel ('detail')
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [colorTag, setColorTag] = useState<ColorTag>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null)
  const [sharedWithCoach, setSharedWithCoach] = useState(false)
  const [savingPrivacy, setSavingPrivacy] = useState(false)
  // (audio is streamed directly via API route — no client-side state needed)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: convData } = await supabase
      .from('conversations')
      .select('id, title, created_at, mode, started_at, ended_at, elevenlabs_conversation_id, shared_with_coach')
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
      shared_with_coach: c.shared_with_coach ?? false,
      conversation_ratings: ratingsMap[c.id] ? [ratingsMap[c.id]] : [],
    }))

    setConversations(convs)

    if (selected) {
      const refreshed = convs.find(c => c.id === selected.id)
      if (refreshed) {
        setSelected(refreshed)
        setSharedWithCoach(refreshed.shared_with_coach)
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
    setSharedWithCoach(conv.shared_with_coach)
    setActiveTab('summary')
    setSavedFeedback(null)
    loadSummary(conv.id)
    setMobileView('detail') // on mobile: switch to detail panel
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

  async function toggleSharing(newValue: boolean) {
    if (!selected) return
    setSavingPrivacy(true)
    const supabase = createClient()
    await supabase
      .from('conversations')
      .update({ shared_with_coach: newValue })
      .eq('id', selected.id)
    setSharedWithCoach(newValue)
    setSelected(prev => prev ? { ...prev, shared_with_coach: newValue } : prev)
    await load()
    setSavingPrivacy(false)
    setSavedFeedback(newValue ? 'Shared with Danè!' : 'Conversation is now private.')
    setTimeout(() => setSavedFeedback(null), 3000)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar — hidden on mobile when detail is open */}
      <div className={`${mobileView === 'detail' ? 'hidden' : 'flex'} md:flex w-full md:w-80 flex-shrink-0 border-r border-line flex-col bg-white`}>
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
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {conv.shared_with_coach && (
                      <span className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-plum/10 text-plum">Shared</span>
                    )}
                    {tag && (
                      <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full ${TAG_STYLES[tag]}`}>
                        {TAG_LABELS[tag]}
                      </span>
                    )}
                  </div>
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

      {/* Detail panel — hidden on mobile when list is shown */}
      <div className={`${mobileView === 'list' ? 'hidden md:block' : 'block'} flex-1 overflow-y-auto`}>
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-inter text-muted text-sm">Select a conversation to view details</p>
          </div>
        ) : (
          <div className="p-4 md:p-6 max-w-2xl">
            {/* Back button — mobile only */}
            <button
              className="md:hidden flex items-center gap-1.5 text-plum font-inter font-semibold text-sm mb-4 min-h-[44px]"
              onClick={() => setMobileView('list')}
            >
              ← Conversations
            </button>
            <div className="flex items-start justify-between mb-1">
              <h2 className="font-poppins font-bold text-plum-dark text-lg md:text-xl" style={{ letterSpacing: '-0.03em' }}>
                {selected.title ?? 'Conversation'}
              </h2>
              <span className={`font-inter text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-3 mt-1 ${
                sharedWithCoach ? 'bg-plum/10 text-plum' : 'bg-mist text-muted'
              }`}>
                {sharedWithCoach ? '👁 Shared with Danè' : '🔒 Private'}
              </span>
            </div>
            <p className="font-inter text-xs text-muted mb-5">{new Date(selected.created_at).toLocaleString('en-ZA')}</p>

            {savedFeedback && (
              <p className="font-inter text-sm text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-2 mb-4">
                ✓ {savedFeedback}
              </p>
            )}

            <div className="flex gap-1 bg-mist rounded-2xl p-1 mb-5 overflow-x-auto">
              {(['summary', 'rating', 'notes', 'privacy'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`font-inter text-sm px-4 py-1.5 rounded-xl capitalize transition-colors ${activeTab === tab ? 'bg-white text-plum-dark font-semibold shadow-card' : 'text-muted'}`}>
                  {tab === 'privacy' ? '🔒 Privacy' : tab}
                </button>
              ))}
            </div>

            {activeTab === 'summary' && (
              <div className="flex flex-col gap-4">

                {/* ── Session metadata ── */}
                {(selected.mode === 'voice' || selected.elevenlabs_conversation_id) && (
                  <div className="bg-mist rounded-2xl px-4 py-3 flex flex-wrap gap-x-5 gap-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-inter text-[10px] text-muted uppercase tracking-wide">Mode</span>
                      <span className="font-inter text-xs text-ink font-semibold capitalize">🎙️ Voice</span>
                    </div>
                    {selected.started_at && selected.ended_at && (() => {
                      const secs = Math.round(
                        (new Date(selected.ended_at).getTime() - new Date(selected.started_at).getTime()) / 1000
                      )
                      const m = Math.floor(secs / 60)
                      const s = secs % 60
                      return (
                        <div className="flex items-center gap-1.5">
                          <span className="font-inter text-[10px] text-muted uppercase tracking-wide">Duration</span>
                          <span className="font-inter text-xs text-ink font-semibold">
                            {m > 0 ? `${m}m ` : ''}{s}s
                          </span>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* ── Audio player — streamed directly from API route ── */}
                {selected.elevenlabs_conversation_id && (
                  <div className="bg-white rounded-2xl border border-line p-4">
                    <p className="font-inter font-semibold text-xs text-plum-dark uppercase tracking-wide mb-2">
                      🎙️ Voice recording
                    </p>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <audio
                      controls
                      src={`/api/portal/conversation-audio?conversation_id=${selected.id}`}
                      className="w-full h-10"
                      style={{ borderRadius: '12px' }}
                      preload="none"
                    />
                    <p className="font-inter text-[10px] text-muted mt-1.5">
                      Voice recording — available for 30 days after the session
                    </p>
                  </div>
                )}

                {/* ── Summary ── */}
                <div className="bg-white rounded-3xl p-5 border border-line">
                  {loadingSummary ? (
                    <p className="font-inter text-muted text-sm">Loading summary…</p>
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

            {activeTab === 'privacy' && (
              <div className="bg-white rounded-3xl p-5 border border-line flex flex-col gap-5">
                {/* Current status */}
                <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${
                  sharedWithCoach ? 'bg-plum/5 border border-plum/20' : 'bg-mist border border-line'
                }`}>
                  <span className="text-xl">{sharedWithCoach ? '👁' : '🔒'}</span>
                  <div>
                    <p className="font-inter font-semibold text-ink text-sm">
                      {sharedWithCoach ? 'Shared with Danè' : 'Private — only you can see this'}
                    </p>
                    <p className="font-inter text-xs text-muted mt-0.5">
                      {sharedWithCoach
                        ? 'Danè can see the summary and transcript of this conversation.'
                        : 'Danè cannot see this conversation. Your thoughts are yours alone.'}
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                {sharedWithCoach ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleSharing(false)}
                      disabled={savingPrivacy}
                      className="font-inter font-semibold text-sm text-plum border-2 border-plum px-5 py-2.5 rounded-full hover:bg-plum/5 transition-colors disabled:opacity-60 w-fit"
                    >
                      {savingPrivacy ? 'Saving...' : '🔒 Make private'}
                    </button>
                    <p className="font-inter text-xs text-muted">
                      Danè will no longer be able to see this conversation.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleSharing(true)}
                      disabled={savingPrivacy}
                      className="font-inter font-semibold text-sm text-white bg-plum px-5 py-2.5 rounded-full hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60 w-fit"
                    >
                      {savingPrivacy ? 'Saving...' : '👁 Share with Danè'}
                    </button>
                    <p className="font-inter text-xs text-muted">
                      Sharing gives Danè access to the summary and transcript so she can support you better in your next session.
                    </p>
                  </div>
                )}

                {/* Info box */}
                <div className="bg-mist rounded-2xl px-4 py-3 border border-line">
                  <p className="font-inter font-semibold text-xs text-plum-dark mb-1">How privacy works</p>
                  <ul className="flex flex-col gap-1">
                    {[
                      'All conversations are private by default.',
                      'Only you can choose to share a conversation with Danè.',
                      'You can make a shared conversation private again at any time.',
                      'Danè will never access your conversations without your permission.',
                    ].map((item, i) => (
                      <li key={i} className="font-inter text-xs text-muted flex gap-2">
                        <span className="text-plum flex-shrink-0">·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
