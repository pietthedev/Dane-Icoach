'use client'

import { useState } from 'react'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export type ConversationCardProps = {
  id: string
  title: string | null
  mode: string | null
  created_at: string
  colorTag: string | null
  starRating: number | null
  summary: string | null
  keyTopics: string[]
  messages: Message[]
  elevenLabsConvId: string | null
}

const TAG_STYLES: Record<string, string> = {
  green:  'bg-green-100 text-green-700',
  blue:   'bg-blue-100 text-blue-700',
  amber:  'bg-amber-100 text-amber-700',
  red:    'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
}
const TAG_LABELS: Record<string, string> = {
  green: 'Great', blue: 'Good', amber: 'Okay', red: 'Poor', purple: 'Insight',
}

export default function ConversationCard({
  title,
  mode,
  created_at,
  colorTag,
  starRating,
  summary,
  keyTopics,
  messages,
  elevenLabsConvId,
}: ConversationCardProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [showAudio,      setShowAudio]      = useState(false)

  return (
    <div className="border border-line rounded-2xl p-4">

      {/* ── Title row ── */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-inter font-medium text-ink text-sm">
          {title ?? 'Conversation'}
        </p>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {mode && (
            <span className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-mist text-muted capitalize">
              {mode}
            </span>
          )}
          {colorTag && TAG_STYLES[colorTag] && (
            <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full ${TAG_STYLES[colorTag]}`}>
              {TAG_LABELS[colorTag]}
            </span>
          )}
          {starRating != null && (
            <span className="font-inter text-xs text-yellow-500">
              {'★'.repeat(starRating)}{'☆'.repeat(5 - starRating)}
            </span>
          )}
        </div>
      </div>

      {/* ── Summary ── */}
      {summary && (
        <p className="font-inter text-xs text-muted leading-relaxed mb-2">
          {summary}
        </p>
      )}

      {/* ── Key topics ── */}
      {keyTopics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {keyTopics.map((t, i) => (
            <span key={i} className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-plum/10 text-plum">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* ── Actions row ── */}
      <div className="flex flex-wrap gap-3 mt-1">
        {messages.length > 0 && (
          <button
            onClick={() => setShowTranscript(prev => !prev)}
            className="font-inter text-xs font-semibold text-plum hover:text-plum-dark transition-colors"
          >
            {showTranscript ? '▲ Hide transcript' : `▼ Read transcript (${messages.length} messages)`}
          </button>
        )}

        {elevenLabsConvId && (
          <button
            onClick={() => setShowAudio(prev => !prev)}
            className="font-inter text-xs font-semibold text-plum hover:text-plum-dark transition-colors"
          >
            {showAudio ? '▲ Hide recording' : '🎙️ Play recording'}
          </button>
        )}
      </div>

      {/* ── Audio player — streamed directly from admin API route ── */}
      {showAudio && elevenLabsConvId && (
        <div className="mt-3 bg-mist rounded-xl px-3 py-3">
          <p className="font-inter text-[10px] text-muted uppercase tracking-wide mb-2">
            Voice recording — available for 30 days
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            src={`/api/admin/conversation-audio?elevenlabs_id=${elevenLabsConvId}`}
            className="w-full h-9"
            style={{ borderRadius: '10px' }}
            preload="none"
          />
        </div>
      )}

      {/* ── Transcript ── */}
      {showTranscript && messages.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`rounded-xl px-3 py-2 text-xs font-inter leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-plum/8 text-ink ml-6'
                  : 'bg-white border border-line text-ink mr-6'
              }`}
            >
              <span className={`font-semibold mr-1.5 ${msg.role === 'user' ? 'text-plum' : 'text-plum-dark'}`}>
                {msg.role === 'user' ? 'Client' : 'Companion'}
              </span>
              <span className="whitespace-pre-wrap">{msg.content}</span>
              <p className="text-muted text-[10px] mt-1">
                {new Date(msg.created_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && !summary && !elevenLabsConvId && (
        <p className="font-inter text-xs text-muted italic mt-2">No messages or summary available.</p>
      )}

      <p className="font-inter text-[10px] text-muted mt-3">
        {new Date(created_at).toLocaleString('en-ZA')}
      </p>
    </div>
  )
}
