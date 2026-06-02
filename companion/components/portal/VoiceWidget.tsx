'use client'

import { useConversation, ConversationProvider } from '@elevenlabs/react'
import { useCallback, useState, useEffect, useRef } from 'react'

interface VoiceWidgetProps {
  agentId: string
  remainingMinutes: number | null
}

interface Message {
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

type ColorTag = 'green' | 'blue' | 'amber' | 'red' | 'purple'

const TAG_LABELS: Record<ColorTag, string> = {
  green: 'Great',
  blue: 'Good',
  amber: 'Okay',
  red: 'Tough',
  purple: 'Insight',
}

const TAG_STYLES: Record<ColorTag, string> = {
  green: 'bg-green-100 text-green-700 border-green-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  amber: 'bg-amber-100 text-amber-700 border-amber-300',
  red: 'bg-red-100 text-red-700 border-red-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
}

function VoiceControls({ agentId, remainingMinutes }: VoiceWidgetProps) {
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  // Rating state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [colorTag, setColorTag] = useState<ColorTag | null>(null)
  const [ratingSaved, setRatingSaved] = useState(false)
  const [savingRating, setSavingRating] = useState(false)

  const messagesRef = useRef<Message[]>([])
  const startedAtRef = useRef<string | null>(null)
  const elevenlabsConvIdRef = useRef<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const saveSession = useCallback(async () => {
    if (messagesRef.current.length === 0) return
    setSaving(true)
    try {
      const res = await fetch('/api/portal/voice-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elevenlabs_conversation_id: elevenlabsConvIdRef.current,
          started_at: startedAtRef.current,
          ended_at: new Date().toISOString(),
          messages: messagesRef.current,
        }),
      })
      const data = await res.json()
      if (data.conversation_id) setSavedId(data.conversation_id)
    } catch (err) {
      console.error('Failed to save session:', err)
    } finally {
      setSaving(false)
    }
  }, [])

  const saveRating = useCallback(async () => {
    if (!savedId || rating === 0) return
    setSavingRating(true)
    try {
      await fetch('/api/portal/ratings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: savedId,
          rating,
          color_tag: colorTag,
        }),
      })
      setRatingSaved(true)
    } catch (err) {
      console.error('Failed to save rating:', err)
    } finally {
      setSavingRating(false)
    }
  }, [savedId, rating, colorTag])

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      setError(null)
      setSavedId(null)
      setRating(0)
      setColorTag(null)
      setRatingSaved(false)
      messagesRef.current = []
      startedAtRef.current = new Date().toISOString()
      elevenlabsConvIdRef.current = conversationId
    },
    onDisconnect: () => { saveSession() },
    onMessage: ({ message, source }) => {
      if (message && (source === 'user' || source === 'ai')) {
        messagesRef.current.push({
          role: source === 'ai' ? 'agent' : 'user',
          content: message,
          timestamp: new Date().toISOString(),
        })
      }
    },
    onError: (err) => setError(typeof err === 'string' ? err : 'Connection error. Please try again.'),
  })

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

  if (!mounted) return null

  const isConnected = conversation.status === 'connected'
  const isConnecting = conversation.status === 'connecting'
  const isSpeaking = conversation.isSpeaking
  const outOfMinutes = remainingMinutes !== null && remainingMinutes <= 0

  return (
    <div className="flex flex-col gap-4">
      {/* Main session card */}
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

        {error && (
          <p className="font-inter text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {saving && (
          <p className="font-inter text-sm text-plum bg-plum/5 border border-plum/20 rounded-2xl px-4 py-3 mb-4">
            Saving your session...
          </p>
        )}

        {savedId && !saving && (
          <div className="font-inter text-sm text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
            <span>✓ Session saved!</span>
            <a href="/portal/conversations" className="font-semibold underline">
              View transcript
            </a>
          </div>
        )}

        {outOfMinutes && !isConnected ? (
          <div>
            <p className="font-inter text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-3">
              You&apos;ve used all your voice minutes this month.
            </p>
            <a
              href="/portal/billing"
              className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft inline-block"
            >
              Upgrade plan
            </a>
          </div>
        ) : isConnected ? (
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="font-inter text-sm text-green-700 font-medium">
                {isSpeaking ? 'Companion is speaking...' : 'Listening...'}
              </span>
            </div>
            <button
              onClick={stopSession}
              className="font-inter font-semibold text-sm text-white px-8 py-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-soft flex items-center gap-2"
            >
              ⏹ End session
            </button>
          </div>
        ) : (
          <button
            onClick={startSession}
            disabled={isConnecting}
            className="font-inter font-semibold text-sm text-white px-8 py-3.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConnecting ? '⏳ Connecting...' : '🎙️ Start voice session'}
          </button>
        )}
      </div>

      {/* Post-session rating — appears after session is saved */}
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

              {/* Stars */}
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

              {/* Colour tags */}
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
                {savingRating ? 'Saving...' : 'Save rating'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function VoiceWidget({ agentId, remainingMinutes }: VoiceWidgetProps) {
  return (
    <ConversationProvider>
      <VoiceControls agentId={agentId} remainingMinutes={remainingMinutes} />
    </ConversationProvider>
  )
}
