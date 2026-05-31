'use client'

import { useState, useEffect, useCallback, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  first_name: string
  last_name: string
  email: string
  phone: string
  timezone: string
  language_preference: string
  pref_learn_ratings: boolean
  pref_auto_summarise: boolean
  pref_cross_session: boolean
  pref_email_digest: boolean
  pref_quote_of_day: boolean
  popi_marketing: boolean
  popi_data_training: boolean
}

const DEFAULT: Profile = {
  first_name: '', last_name: '', email: '', phone: '', timezone: 'Africa/Johannesburg', language_preference: 'en',
  pref_learn_ratings: true, pref_auto_summarise: true, pref_cross_session: true, pref_email_digest: false, pref_quote_of_day: true,
  popi_marketing: false, popi_data_training: false,
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/portal/profile')
    if (res.ok) {
      const data = await res.json()
      if (data.profile) setProfile({ ...DEFAULT, ...data.profile })
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setSaved(false)
    await fetch('/api/portal/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const field = (id: keyof Profile, label: string, type = 'text') => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">{label}</label>
      <input id={id} type={type} value={String(profile[id])} onChange={e => setProfile(p => ({ ...p, [id]: e.target.value }))}
        className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum transition-colors" />
    </div>
  )

  const toggle = (id: keyof Profile, label: string, sub?: string) => (
    <label key={id} className="flex items-start gap-3 cursor-pointer">
      <div className={`mt-0.5 w-10 h-5 rounded-full transition-colors flex-shrink-0 relative cursor-pointer ${profile[id] ? 'bg-plum' : 'bg-mist'}`}
        onClick={() => setProfile(p => ({ ...p, [id]: !p[id] }))}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${profile[id] ? 'translate-x-5' : ''}`} />
      </div>
      <div>
        <p className="font-inter font-medium text-ink text-sm">{label}</p>
        {sub && <p className="font-inter text-xs text-muted">{sub}</p>}
      </div>
    </label>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>My profile</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Personal info */}
        <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">Personal information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('first_name', 'First name')}
            {field('last_name', 'Last name')}
            {field('email', 'Email', 'email')}
            {field('phone', 'Phone', 'tel')}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">Localisation</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('timezone', 'Timezone')}
            {field('language_preference', 'Language')}
          </div>
        </div>

        {/* AI preferences */}
        <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">AI preferences</h2>
          <div className="flex flex-col gap-4">
            {toggle('pref_learn_ratings', 'Learn from my ratings', 'Personalise responses based on how I rate sessions')}
            {toggle('pref_auto_summarise', 'Auto-summarise conversations')}
            {toggle('pref_cross_session', 'Cross-session memory', 'Remember context from previous conversations')}
            {toggle('pref_email_digest', 'Weekly email digest')}
            {toggle('pref_quote_of_day', 'Quote of the day on dashboard')}
          </div>
        </div>

        {/* POPIA */}
        <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">POPIA consent</h2>
          <div className="flex flex-col gap-4">
            {toggle('popi_marketing', 'Marketing communications', 'Coaching tips and platform updates by email')}
            {toggle('popi_data_training', 'Anonymised data for platform improvement', 'Your conversations may contribute to improving the AI, in anonymised form')}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span className="font-inter text-sm text-green-600">✓ Saved</span>}
          <Link href="/auth/reset" className="font-inter text-sm text-muted hover:text-plum-dark transition-colors ml-auto">Change password →</Link>
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-8 bg-white rounded-3xl p-6 border border-red-200">
        <h2 className="font-inter font-semibold text-red-600 text-sm uppercase tracking-wide mb-3">Danger zone</h2>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)}
            className="font-inter text-sm text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition-colors">
            Delete all my conversations
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-inter text-sm text-red-600">Are you sure? This cannot be undone.</p>
            <button onClick={() => setDeleteConfirm(false)} className="font-inter text-sm text-muted px-4 py-2 rounded-full hover:bg-mist transition-colors">Cancel</button>
            <button className="font-inter font-semibold text-sm text-white px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
              Confirm delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
