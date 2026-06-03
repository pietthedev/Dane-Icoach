'use client'

import { useConversation, ConversationProvider } from '@elevenlabs/react'
import { useCallback, useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface VoiceWidgetProps {
  agentId: string
  remainingMinutes?: number | null // kept for API compat; limits are now fetched live
}

interface LimitsData {
  plan: string
  can_start_voice: boolean
  can_start_text: boolean
  voice_sessions_used: number
  voice_sessions_limit: number | null
  voice_minutes_used_today: number
  voice_minutes_limit_daily: number | null
  minutes_remaining_today: number | null
  conversations_used: number
  conversations_limit: number | null
}

interface Message {
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

type ColorTag = 'green' | 'blue' | 'amber' | 'red' | 'purple'

const TAG_LABELS: Record<ColorTag, string> = {
  green: 'Great', blue: 'Good', amber: 'Okay', red: 'Tough', purple: 'Insight',
}
const TAG_STYLES: Record<ColorTag, string> = {
  green:  'bg-green-100 text-green-700 border-green-300',
  blue:   'bg-blue-100 text-blue-700 border-blue-300',
  amber:  'bg-amber-100 text-amber-700 border-amber-300',
  red:    'bg-red-100 text-red-700 border-red-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ── Inner component (needs ConversationProvider above it) ────────────────────

function VoiceControls({ agentId }: VoiceWidgetProps) {
  const [mounted,       setMounted]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [saving,        setSaving]        = useState(false)
  const [savedId,       setSavedId]       = useState<string | null>(null)

  // Limits
  const [limits,        setLimits]        = useState<LimitsData | null>(null)
  const [limitsLoading, setLimitsLoading] = useState(true)

  // Timer
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [limitHit,       setLimitHit]       = useState(false)
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionStartRef  = useRef<Date | null>(null)

  // Rating
  const [rating,       setRating]       = useState(0)
  const [hoverRating,  setHoverRating]  = useState(0)
  const [colorTag,     setColorTag]     = useState<ColorTag | null>(null)
  const [ratingSaved,  setRatingSaved]  = useState(false)
  const [savingRating, setSavingRating] = useState(false)

  const messagesRef          = useRef<Message[]>([])
  const startedAtRef         = useRef<string | null>(null)
  const elevenlabsConvIdRef  = useRef<string | null>(null)
  const sessionSecondsRef    = useRef(0) // mirror for use inside callbacks

  // ── Fetch limits on mount ──────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    fetch('/api/portal/check-limits')
      .then(r => r.json())
      .then((data: LimitsData) => setLimits(data))
      .catch(err => console.error('[VoiceWidget] check-limits error', err))
      .finally(() => setLimitsLoading(false))
  }, [])

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    setSessionSeconds(0)
    sessionSecondsRef.current = 0
    sessionStartRef.current = new Date()

    timerRef.current = setInterval(() => {
      sessionSecondsRef.current += 1
      setSessionSeconds(sessionSecondsRef.current)

      // Free plan hard-cutoff at 3:00 (180 s)
      if (limits?.plan === 'free' && sessionSecondsRef.current >= 180) {
        setLimitHit(true)
        // endSession is called reactively in the effect below
      }
    }, 1000)
  }, [limits?.plan, stopTimer])

  // ── Post usage after session ───────────────────────────────────────────────
  const postVoiceUsage = useCallback((durationSeconds: number) => {
    const duration_minutes = parseFloat((durationSeconds / 60).toFixed(2))
    fetch('/api/portal/end-voice-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration_minutes }),
    }).catch(err => console.error('[VoiceWidget] end-voice-session error', err))
  }, [])

  // ── Save session transcript ────────────────────────────────────────────────
  const saveSession = useCallback(async (durationSeconds: number) => {
    if (messagesRef.current.length === 0) return
    setSaving(true)
    postVoiceUsage(durationSeconds)
    try {
      const res = await fetch('/api/portal/voice-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elevenlabs_conversation_id: elevenlabsConvIdRef.current,
          started_at:  startedAtRef.current,
          ended_at:    new Date().toISOString(),
          messages:    messagesRef.current,
        }),
      })
      const data = await res.json()
      if (data.conversation_id) setSavedId(data.conversation_id)
    } catch (err) {
      console.error('[VoiceWidget] save session error:', err)
    } finally {
      setSaving(false)
    }
  }, [postVoiceUsage])

  // ── ElevenLabs conversation hook ───────────────────────────────────────────
  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      setError(null)
      setSavedId(null)
      setRating(0)
      setColorTag(null)
      setRatingSaved(false)
      setLimitHit(false)
      messagesRef.current = []
      startedAtRef.current = new Date().toISOString()
      elevenlabsConvIdRef.current = conversationId
      startTimer()
    },
    onDisconnect: () => {
      const elapsed = sessionSecondsRef.current
      stopTimer()
      saveSession(elapsed)
    },
    onMessage: ({ message, source }) => {
      if (message && (source === 'user' || source === 'ai')) {
        messagesRef.current.push({
          role:      source === 'ai' ? 'agent' : 'user',
          content:   message,
          timestamp: new Date().toISOString(),
        })
      }
    },
    onError: (err) => setError(typeof err === 'string' ? err : 'Connection error. Please try again.'),
  })

  // ── Auto-end when free limit is hit ───────────────────────────────────────
  useEffect(() => {
    if (limitHit && conversation.status === 'connected') {
      conversation.endSession().catch(console.error)
    }
  }, [limitHit, conversation])

  // ── Session controls ───────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    try {
      setError(null)
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await conversation.startSession({ agentId })
    } catch (err) {
      setError('Microphone access is required for voice sessions.')
      console.error(err)
    }
  }, [conversation, agentId])

  const stopSession = useCallback(async () => {
    await conversation.endSession()
  }, [conversation])

  // ── Rating ─────────────────────────────────────────────────────────────────
  const saveRating = useCallback(async () => {
    if (!savedId || rating === 0) return
    setSavingRating(true)
    try {
      await fetch('/api/portal/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: savedId, rating, color_tag: colorTag }),
      })
      setRatingSaved(true)
    } catch (err) {
      console.error('[VoiceWidget] save rating error:', err)
    } finally {
      setSavingRating(false)
    }
  }, [savedId, rating, colorTag])

  if (!mounted) return null

  const isConnected  = conversation.status === 'connected'
  const isConnecting = conversation.status === 'connecting'
  const isSpeaking   = conversation.isSpeaking
  const plan         = limits?.plan ?? 'free'
  const isFree       = plan === 'free'

  // Countdown for free (counts down from 180), elapsed for paid
  const FREE_LIMIT_SECS = 180
  const displaySeconds = isFree
    ? Math.max(0, FREE_LIMIT_SECS - sessionSeconds)
    : sessionSeconds
  const timerLabel = isFree ? 'Time remaining' : 'Elapsed'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* ── Main session card ── */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
        <h2
          className="font-poppins font-bold text-plum-dark text-base mb-2"
          style={{ letterSpacing: '-0.03em' }}
        >
          Ready to speak?
        </h2>
        <p className="font-inter text-muted text-sm mb-5">
          Your session will be recorded and a transcript saved automatically.
        </p>

        {/* Error */}
        {error && (
          <p className="font-inter text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {/* Saving */}
        {saving && (
          <p className="font-inter text-sm text-plum bg-plum/5 border border-plum/20 rounded-2xl px-4 py-3 mb-4">
            Saving your session…
          </p>
        )}

        {/* Saved confirmation */}
        {savedId && !saving && (
          <div className="font-inter text-sm text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
            <span>✓ Session saved!</span>
            <a href="/portal/conversations" className="font-semibold underline">
              View transcript
            </a>
          </div>
        )}

        {/* Limit hit after session ended */}
        {limitHit && !isConnected && (
          <div className="font-inter text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
            <p className="font-semibold mb-1">Your 3-minute free session has ended.</p>
            <p className="mb-3">
              You&apos;ve used your voice time for today. Come back tomorrow for another session —
              or upgrade to Growth for more time.
            </p>
            <a
              href="/portal/billing"
              className="inline-block font-semibold text-xs text-white px-5 py-2 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft"
            >
              Upgrade to Growth
            </a>
          </div>
        )}

        {/* Limits loading */}
        {limitsLoading ? (
          <p className="font-inter text-sm text-muted">Checking your plan…</p>

        /* Voice not available for today */
        ) : limits && !limits.can_start_voice && !isConnected ? (
          <div>
            <p className="font-inter text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-3">
              {isFree
                ? "You've used your voice time for today. Come back tomorrow for another session — or upgrade to Growth for more time."
                : limits.voice_sessions_limit != null && limits.voice_sessions_used >= limits.voice_sessions_limit
                  ? `You've used all ${limits.voice_sessions_limit} voice sessions this month. Upgrade for more.`
                  : "You've reached your daily voice limit. Come back tomorrow for more."}
            </p>
            <a
              href="/portal/billing"
              className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft inline-block"
            >
              Upgrade plan
            </a>
          </div>

        /* Active session */
        ) : isConnected ? (
          <div className="flex flex-col items-start gap-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="font-inter text-sm text-green-700 font-medium">
                {isSpeaking ? 'Companion is speaking…' : 'Listening…'}
              </span>
            </div>

            {/* Timer */}
            <div className={`rounded-2xl px-5 py-3 text-center min-w-[130px] ${
              isFree && displaySeconds <= 30
                ? 'bg-red-50 border border-red-200'
                : 'bg-mist border border-line'
            }`}>
              <p className={`font-poppins font-bold text-2xl tabular-nums ${
                isFree && displaySeconds <= 30 ? 'text-red-600' : 'text-plum-dark'
              }`} style={{ letterSpacing: '-0.04em' }}>
                {formatTime(displaySeconds)}
              </p>
              <p className="font-inter text-[10px] text-muted uppercase tracking-wide mt-0.5">
                {timerLabel}
              </p>
            </div>

            {/* Free plan warning at 30 s left */}
            {isFree && displaySeconds <= 30 && displaySeconds > 0 && (
              <p className="font-inter text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                ⚠️ Session ending in {displaySeconds}s
              </p>
            )}

            <button
              onClick={stopSession}
              className="font-inter font-semibold text-sm text-white px-8 py-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-soft flex items-center gap-2"
            >
              ⏹ End session
            </button>
          </div>

        /* Idle — ready to start */
        ) : (
          <button
            onClick={startSession}
            disabled={isConnecting}
            className="font-inter font-semibold text-sm text-white px-8 py-3.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConnecting ? '⏳ Connecting…' : '🎙️ Start voice session'}
          </button>
        )}
      </div>

      {/* ── Post-session rating ── */}
      {savedId && !saving && !isConnected && (
        <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
          {ratingSaved ? (
            <div className="text-center py-2">
              <p className="font-poppins font-bold text-plum-dark text-base mb-1" style={{ letterSpacing: '-0.03em' }}>
                Thanks for the feedback!
              </p>
              <p className="font-inter text-muted text-sm">Your rating helps Danè understand how sessions are going.</p>
            </div>
          ) : (
            <>
              <h3 className="font-poppins font-bold text-plum-dark text-base mb-1" style={{ letterSpacing: '-0.03em' }}>
                How was that session?
              </h3>
              <p className="font-inter text-muted text-sm mb-5">Rate while it&apos;s fresh — it only takes a second.</p>

              <div className="flex gap-2 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={s <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {(Object.keys(TAG_LABELS) as ColorTag[]).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setColorTag(colorTag === tag ? null : tag)}
                    className={`font-inter text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      colorTag === tag
                        ? TAG_STYLES[tag] + ' border-2'
                        : 'bg-mist text-muted border-transparent hover:border-current'
                    }`}
                  >
                    {TAG_LABELS[tag]}
                  </button>
                ))}
              </div>

              <button
                onClick={saveRating}
                disabled={rating === 0 || savingRating}
                className="font-inter font-semibold text-sm text-white px-6 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {savingRating ? 'Saving…' : 'Save rating'}
              </button>
            </>
          )}
        </div>
      )}

    </div>
  )
}

// ── Public export (wraps in provider) ────────────────────────────────────────
export default function VoiceWidget({ agentId, remainingMinutes }: VoiceWidgetProps) {
  return (
    <ConversationProvider>
      <VoiceControls agentId={agentId} remainingMinutes={remainingMinutes} />
    </ConversationProvider>
  )
}
