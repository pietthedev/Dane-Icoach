'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [popiConsent, setPopiConsent] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (loading) return
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, popi_consent: popiConsent },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-4xl p-8 shadow-strong border border-line text-center">
          <span className="text-5xl block mb-4">✉️</span>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-3" style={{ letterSpacing: '-0.04em' }}>Check your inbox</h1>
          <p className="font-inter text-muted text-sm leading-relaxed mb-5">
            We&apos;ve sent a confirmation link to <strong className="text-ink">{email}</strong>. Click the link to activate your account and start your journey.
          </p>
          <Link href="/auth/login" className="font-inter font-semibold text-sm text-plum hover:text-plum-dark transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <path d="M38 16.5C35.2 10.5 29 7 22 7C12.6 7 5 14.6 5 24C5 33.4 12.6 41 22 41C29 41 35.2 37.5 38 31.5" stroke="#2E1A47" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
              <path d="M30 20L32 24L30 28L28 24Z" fill="#4B2E83"/>
              <path d="M33.5 17L35.5 21.5L33.5 26L31.5 21.5Z" fill="#FF6F9F" opacity="0.9"/>
              <circle cx="29.5" cy="24" r="1.4" fill="#FF6F9F"/>
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-poppins font-bold text-plum-dark" style={{ fontSize: 15 }}>Companion</span>
              <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#FF6F9F', fontSize: 11 }}>by Danè</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-4xl p-8 shadow-strong border border-line">
          <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-1" style={{ letterSpacing: '-0.04em' }}>Create your account</h1>
          <p className="font-inter text-muted text-sm mb-6">Start your coaching journey with Companion by Danè</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">Full name</label>
              <input
                id="fullName" type="text" required autoComplete="name"
                value={fullName} onChange={e => setFullName(e.target.value)}
                disabled={loading} placeholder="Your full name"
                className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum transition-colors disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">Email</label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                disabled={loading} placeholder="you@example.com"
                className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum transition-colors disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">Password</label>
              <input
                id="password" type="password" required autoComplete="new-password"
                value={password} onChange={e => setPassword(e.target.value)}
                disabled={loading} placeholder="At least 8 characters"
                className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum transition-colors disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">Confirm password</label>
              <input
                id="confirm" type="password" required autoComplete="new-password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                disabled={loading} placeholder="Repeat password"
                className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum transition-colors disabled:opacity-60"
              />
            </div>

            <div className="flex items-start gap-3">
              <input id="terms" type="checkbox" required checked={terms} onChange={e => setTerms(e.target.checked)}
                disabled={loading} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-plum rounded" />
              <label htmlFor="terms" className="font-inter text-xs text-muted leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-plum underline" target="_blank">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-plum underline" target="_blank">Privacy Policy</Link>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input id="popi" type="checkbox" checked={popiConsent} onChange={e => setPopiConsent(e.target.checked)}
                disabled={loading} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-plum rounded" />
              <label htmlFor="popi" className="font-inter text-xs text-muted leading-relaxed cursor-pointer">
                <span className="text-muted font-medium">(Optional)</span> I consent to Companion AI using anonymised data to improve the platform experience
              </label>
            </div>

            {error && (
              <p className="font-inter text-xs text-center rounded-xl px-3 py-2.5" style={{ color: '#c0392b', background: '#fdf0ef', border: '1px solid #f5c6c2' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full font-inter font-semibold text-sm text-white py-3.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (<><svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Creating account…</>) : 'Create account'}
            </button>
          </form>

          <p className="font-inter text-sm text-muted text-center mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-plum font-semibold hover:text-plum-dark transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
