'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type EntryType = 'reflection' | 'homework' | 'goal' | 'win' | 'challenge' | 'gratitude'

interface JournalEntry {
  id: string
  entry_type: EntryType
  body: string
  mood_score: number | null
  created_at: string
  share_with_coach: boolean
}

interface Goal {
  id: string
  title: string
  category: string | null
  target_date: string | null
  progress: number
}

const ENTRY_STYLES: Record<EntryType, string> = {
  reflection: 'bg-blue-100 text-blue-700',
  homework: 'bg-purple-100 text-purple-700',
  goal: 'bg-plum/10 text-plum',
  win: 'bg-green-100 text-green-700',
  challenge: 'bg-amber-100 text-amber-700',
  gratitude: 'bg-pink-100 text-pink-700',
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [entryType, setEntryType] = useState<EntryType>('reflection')
  const [body, setBody] = useState('')
  const [moodScore, setMoodScore] = useState(5)
  const [shareCoach, setShareCoach] = useState(false)

  const [goalTitle, setGoalTitle] = useState('')
  const [goalCategory, setGoalCategory] = useState('')
  const [goalDate, setGoalDate] = useState('')

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [e, g] = await Promise.all([
      supabase.from('journal_entries').select('id, entry_type, body, mood_score, created_at, share_with_coach').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('goals').select('id, title, category, target_date, progress').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    setEntries((e.data as JournalEntry[]) ?? [])
    setGoals((g.data as Goal[]) ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  async function submitEntry() {
    if (!body.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('journal_entries').insert({ user_id: user.id, entry_type: entryType, body, mood_score: moodScore, share_with_coach: shareCoach })
    }
    setBody(''); setMoodScore(5); setShareCoach(false); setShowEntryForm(false)
    await load()
    setSaving(false)
  }

  async function submitGoal() {
    if (!goalTitle.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('goals').insert({ user_id: user.id, title: goalTitle, category: goalCategory || null, target_date: goalDate || null, progress: 0 })
    }
    setGoalTitle(''); setGoalCategory(''); setGoalDate(''); setShowGoalForm(false)
    await load()
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Journal &amp; Goals</h1>
        <div className="flex gap-2">
          <button onClick={() => { setShowGoalForm(!showGoalForm); setShowEntryForm(false) }}
            className="font-inter font-semibold text-sm text-plum px-4 py-2 rounded-full border border-plum hover:bg-plum hover:text-white transition-colors">
            + Goal
          </button>
          <button onClick={() => { setShowEntryForm(!showEntryForm); setShowGoalForm(false) }}
            className="font-inter font-semibold text-sm text-white px-4 py-2 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
            + New entry
          </button>
        </div>
      </div>

      {/* New entry form */}
      {showEntryForm && (
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card mb-5">
          <h2 className="font-inter font-semibold text-plum-dark text-sm mb-3">New journal entry</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(['reflection','homework','goal','win','challenge','gratitude'] as EntryType[]).map(t => (
              <button key={t} onClick={() => setEntryType(t)}
                className={`font-inter text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${entryType === t ? ENTRY_STYLES[t] + ' font-semibold' : 'bg-mist text-muted'}`}>
                {t}
              </button>
            ))}
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Write your reflection…"
            className="w-full font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum resize-none mb-3" />
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <label className="font-inter text-xs text-muted">Mood (1–10):</label>
              <input type="range" min={1} max={10} value={moodScore} onChange={e => setMoodScore(Number(e.target.value))} className="w-24 accent-plum" />
              <span className="font-inter font-semibold text-plum text-sm">{moodScore}</span>
            </div>
            <label className="flex items-center gap-2 font-inter text-xs text-muted cursor-pointer">
              <input type="checkbox" checked={shareCoach} onChange={e => setShareCoach(e.target.checked)} className="accent-plum" />
              Share with coach
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={submitEntry} disabled={saving || !body.trim()}
              className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark disabled:opacity-60 transition-colors shadow-soft">
              {saving ? 'Saving…' : 'Save entry'}
            </button>
            <button onClick={() => setShowEntryForm(false)} className="font-inter text-sm text-muted px-4 py-2.5 rounded-full hover:bg-mist transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* New goal form */}
      {showGoalForm && (
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card mb-5">
          <h2 className="font-inter font-semibold text-plum-dark text-sm mb-3">Add a goal</h2>
          <div className="flex flex-col gap-3">
            <input value={goalTitle} onChange={e => setGoalTitle(e.target.value)} placeholder="Goal title" className="font-inter text-sm border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum" />
            <input value={goalCategory} onChange={e => setGoalCategory(e.target.value)} placeholder="Category (optional)" className="font-inter text-sm border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum" />
            <input type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)} className="font-inter text-sm border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum" />
            <div className="flex gap-2">
              <button onClick={submitGoal} disabled={saving || !goalTitle.trim()}
                className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark disabled:opacity-60 transition-colors shadow-soft">
                {saving ? 'Saving…' : 'Save goal'}
              </button>
              <button onClick={() => setShowGoalForm(false)} className="font-inter text-sm text-muted px-4 py-2.5 rounded-full hover:bg-mist transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <section className="mb-6">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Goals</h2>
          <div className="flex flex-col gap-3">
            {goals.map(g => (
              <div key={g.id} className="bg-white rounded-3xl p-4 border border-line shadow-card">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-inter font-semibold text-ink text-sm">{g.title}</p>
                  {g.category && <span className="font-inter text-xs px-2 py-0.5 rounded-full bg-mist text-muted">{g.category}</span>}
                </div>
                <div className="h-1.5 rounded-full bg-mist overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all" style={{ width: `${g.progress}%`, background: 'linear-gradient(90deg, #4B2E83, #FF6F9F)' }} />
                </div>
                <p className="font-inter text-xs text-muted">{g.progress}% complete{g.target_date ? ` · Due ${new Date(g.target_date).toLocaleDateString('en-ZA')}` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Entries */}
      <section>
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Journal entries</h2>
        {entries.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-line text-center">
            <p className="font-inter text-muted text-sm">No entries yet. Start reflecting.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map(e => (
              <div key={e.id} className="bg-white rounded-3xl p-5 border border-line shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-inter text-xs px-2.5 py-1 rounded-full capitalize ${ENTRY_STYLES[e.entry_type]}`}>{e.entry_type}</span>
                  <div className="flex items-center gap-3">
                    {e.mood_score && <span className="font-inter text-xs text-muted">Mood: {e.mood_score}/10</span>}
                    <span className="font-inter text-xs text-muted">{new Date(e.created_at).toLocaleDateString('en-ZA')}</span>
                  </div>
                </div>
                <p className="font-inter text-sm text-ink leading-relaxed">{e.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
