'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ConsentState = {
  essential: true
  analytics: boolean
  marketing: boolean
  consented_at: string
}

const CONSENT_KEY = 'companion_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [consent, setConsent] = useState({ essential: true, analytics: false, marketing: false })

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      setTimeout(() => setVisible(true), 1200)
    }

    // Listen for the footer "Cookie preferences" link
    function handleHash() {
      if (window.location.hash === '#cookie-preferences') {
        setVisible(true)
        setExpanded(true)
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
    window.addEventListener('hashchange', handleHash)
    handleHash()
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  async function saveConsent(c: { essential: true; analytics: boolean; marketing: boolean }) {
    const full = { ...c, consented_at: new Date().toISOString() }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(full))

    // Save to Supabase if logged in
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({
          consent_marketing: c.marketing,
          consent_data_training: c.analytics,
          consent_given_at: full.consented_at,
        }).eq('id', user.id)
      }
    } catch {
      // Not logged in — that's fine, localStorage is enough
    }

    setVisible(false)
  }

  function acceptAll() {
    saveConsent({ essential: true, analytics: true, marketing: true })
  }

  function saveChoices() {
    saveConsent({ essential: true, analytics: consent.analytics, marketing: consent.marketing })
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-xs w-full">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-line overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(46,26,71,0.12)' }}
      >
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍪</span>
              <p className="font-poppins font-bold text-plum-dark text-sm" style={{ letterSpacing: '-0.02em' }}>
                Your privacy matters
              </p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-inter text-xs text-muted hover:text-plum-dark transition-colors flex-shrink-0 mt-0.5"
            >
              {expanded ? 'Less' : 'Customise'}
            </button>
          </div>
          <p className="font-inter text-xs text-muted leading-relaxed">
            We use cookies to keep you signed in and improve Companion. Essential cookies are always on.{' '}
            <Link href="/privacy" className="text-plum underline">Privacy policy</Link>
          </p>
        </div>

        {expanded && (
          <div className="px-5 pb-3 border-t border-mist pt-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter font-semibold text-ink text-xs">Essential</p>
                <p className="font-inter text-[11px] text-muted">Login, security, session — always on</p>
              </div>
              <div className="w-8 h-4 rounded-full bg-plum flex-shrink-0 relative">
                <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full shadow" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter font-semibold text-ink text-xs">Analytics</p>
                <p className="font-inter text-[11px] text-muted">Usage patterns to improve Companion</p>
              </div>
              <button
                onClick={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
                className={`w-8 h-4 rounded-full flex-shrink-0 relative transition-colors ${consent.analytics ? 'bg-plum' : 'bg-mist'}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${consent.analytics ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter font-semibold text-ink text-xs">Marketing</p>
                <p className="font-inter text-[11px] text-muted">Coaching tips and updates by email</p>
              </div>
              <button
                onClick={() => setConsent(c => ({ ...c, marketing: !c.marketing }))}
                className={`w-8 h-4 rounded-full flex-shrink-0 relative transition-colors ${consent.marketing ? 'bg-plum' : 'bg-mist'}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${consent.marketing ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        <div className="px-5 pb-5 pt-3 flex gap-2">
          <button
            onClick={acceptAll}
            className="flex-1 font-inter font-semibold text-xs text-white px-3 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors"
          >
            Accept all
          </button>
          <button
            onClick={saveChoices}
            className="flex-1 font-inter font-semibold text-xs text-plum px-3 py-2.5 rounded-full border border-plum/30 hover:bg-plum/5 transition-colors"
          >
            {expanded ? 'Save choices' : 'Essential only'}
          </button>
        </div>
      </div>
    </div>
  )
}