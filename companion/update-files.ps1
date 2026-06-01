# =============================================================================
# update-files.ps1 — Run from companion folder root
# Updates all files with correct schema-aligned code
# =============================================================================

Write-Host "Updating files..." -ForegroundColor Cyan

# =============================================================================
# 1. app/portal/conversations/page.tsx
# =============================================================================
$conversationsPage = @'
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

const TAG_STYLES: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
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
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'summary' | 'rating' | 'notes'>('summary')
  const [rating, setRating] = useState(0)
  const [colorTag, setColorTag] = useState<ColorTag>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at, conversation_ratings(rating, color_tag, notes)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setConversations((data as Conversation[]) ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  function selectConv(conv: Conversation) {
    setSelected(conv)
    const r = conv.conversation_ratings?.[0]
    setRating(r?.rating ?? 0)
    setColorTag(r?.color_tag ?? null)
    setNotes(r?.notes ?? '')
    setActiveTab('summary')
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
    await load()
    setSaving(false)
  }

  async function saveNotes() {
    if (!selected) return
    setSaving(true)
    await fetch('/api/portal/notes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: selected.id, notes }),
    })
    setSaving(false)
  }

  return (
    <div className="flex h-full">
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
            return (
              <button key={conv.id} onClick={() => selectConv(conv)}
                className={`w-full text-left px-4 py-3.5 border-b border-line hover:bg-cloud transition-colors ${selected?.id === conv.id ? 'bg-plum/5 border-l-2 border-l-plum' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-inter font-medium text-ink text-sm truncate">{conv.title ?? 'Conversation'}</p>
                  {tag && <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${TAG_STYLES[tag]}`}>{tag}</span>}
                </div>
                <p className="font-inter text-xs text-muted mt-0.5">{new Date(conv.created_at).toLocaleDateString('en-ZA')}</p>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-inter text-muted text-sm">Select a conversation to view details</p>
          </div>
        ) : (
          <div className="p-6 max-w-2xl">
            <h2 className="font-poppins font-bold text-plum-dark text-xl mb-1" style={{ letterSpacing: '-0.03em' }}>{selected.title ?? 'Conversation'}</h2>
            <p className="font-inter text-xs text-muted mb-5">{new Date(selected.created_at).toLocaleString('en-ZA')}</p>
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
                <p className="font-inter text-muted text-sm">Summary not available yet.</p>
              </div>
            )}
            {activeTab === 'rating' && (
              <div className="bg-white rounded-3xl p-5 border border-line flex flex-col gap-5">
                <div>
                  <p className="font-inter font-semibold text-plum-dark text-sm mb-2">Session rating</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setRating(s)}
                        className={`text-2xl transition-transform hover:scale-110 ${s <= rating ? 'opacity-100' : 'opacity-30'}`}>
                        *
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
                        {c}
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
'@
Set-Content -Path "app\portal\conversations\page.tsx" -Value $conversationsPage -Encoding UTF8
Write-Host "OK app\portal\conversations\page.tsx" -ForegroundColor Green

# =============================================================================
# 2. app/api/portal/conversations/route.ts
# =============================================================================
$conversationsRoute = @'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at, conversation_ratings(rating, color_tag, notes)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ conversations: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { title } = await req.json() as { title?: string }

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: title ?? null })
      .select('id, title, created_at')
      .single()

    if (error) return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })

    const { count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count === 1) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const email = user.email
      const firstName = profile?.full_name?.split(' ')[0] ?? email?.split('@')[0] ?? 'there'

      if (email) {
        sendWelcomeEmail(email, firstName).catch(err =>
          console.error('[email] sendWelcomeEmail failed:', err)
        )
      }
    }

    return NextResponse.json({ conversation: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
'@
Set-Content -Path "app\api\portal\conversations\route.ts" -Value $conversationsRoute -Encoding UTF8
Write-Host "OK app\api\portal\conversations\route.ts" -ForegroundColor Green

# =============================================================================
# 3. app/api/portal/profile/route.ts
# =============================================================================
$profileRoute = @'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_FIELDS = [
  'full_name', 'phone', 'timezone', 'language_preference',
  'pref_learn_from_ratings', 'pref_auto_summarise', 'pref_cross_session_memory',
  'pref_email_digest', 'pref_push_notifications', 'pref_quote_of_day',
  'consent_marketing', 'consent_data_training',
]

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    return NextResponse.json({ profile: profile ?? null, email: user.email })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const body = await req.json() as Record<string, unknown>

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const key of ALLOWED_FIELDS) {
      if (key in body) updates[key] = body[key]
    }

    await supabase.from('profiles').upsert({ id: user.id, ...updates })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
'@
Set-Content -Path "app\api\portal\profile\route.ts" -Value $profileRoute -Encoding UTF8
Write-Host "OK app\api\portal\profile\route.ts" -ForegroundColor Green

Write-Host ""
Write-Host "All files updated! Now restart dev server: npm run dev" -ForegroundColor Cyan