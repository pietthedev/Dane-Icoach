'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ── Upgrade button ────────────────────────────────────────────────────────────

export function UpgradeButton({ plan, label }: { plan: string; label: string }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/portal/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan }),
      })
      const data = await res.json()

      if (!res.ok || !data.authorization_url) {
        setError(data.error ?? 'Could not start payment. Please try again.')
        return
      }

      // Redirect to Paystack hosted payment page
      window.location.href = data.authorization_url
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full font-inter font-semibold text-sm text-white py-3 px-5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting to payment…' : `Upgrade to ${label}`}
      </button>
      {error && (
        <p className="font-inter text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">
          {error}
        </p>
      )}
    </div>
  )
}

// ── Cancel button ─────────────────────────────────────────────────────────────

export function CancelButton() {
  const router  = useRouter()
  const [loading,  setLoading]  = useState(false)
  const [confirm,  setConfirm]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/portal/cancel-subscription', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Could not cancel. Please contact support.')
        return
      }
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setConfirm(false)
    }
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="font-inter text-sm text-red-500 border border-red-200 px-5 py-2.5 rounded-full hover:bg-red-50 transition-colors"
      >
        Cancel subscription
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-inter text-sm text-red-600">
        Are you sure? You&apos;ll immediately drop to the Free plan.
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="font-inter font-semibold text-sm text-white bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
        >
          {loading ? 'Cancelling…' : 'Yes, cancel'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          disabled={loading}
          className="font-inter text-sm text-muted px-5 py-2.5 rounded-full hover:bg-mist transition-colors"
        >
          Keep my plan
        </button>
      </div>
      {error && (
        <p className="font-inter text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
