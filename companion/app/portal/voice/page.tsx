import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import VoiceWidget from '@/components/portal/VoiceWidget'

export default async function VoiceSessionPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, token_limit_monthly, tokens_used_this_month, plan')
    .eq('id', user.id)
    .single()

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? ''

  // Rough voice minutes estimate: show tokens remaining as a proxy until voice_minutes columns exist
  const tokensLimit = profile?.token_limit_monthly ?? 0
  const tokensUsed = profile?.tokens_used_this_month ?? 0
  const tokensRemaining = tokensLimit - tokensUsed

  // Convert remaining tokens to approximate minutes (rough guide only)
  // Average voice exchange ≈ 500 tokens/min
  const minutesRemaining = tokensLimit > 0 ? Math.floor(tokensRemaining / 500) : null

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="font-poppins font-bold text-plum-dark text-2xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            Voice session
          </h1>
          <p className="font-inter text-muted text-sm mt-1">
            Start a voice conversation with your AI companion
          </p>
        </div>
        {minutesRemaining !== null && (
          <div className="bg-white rounded-2xl px-4 py-2.5 border border-line shadow-card text-center">
            <p
              className="font-poppins font-bold text-plum-dark text-lg"
              style={{ letterSpacing: '-0.04em' }}
            >
              ~{minutesRemaining}
            </p>
            <p className="font-inter text-[10px] text-muted uppercase tracking-wide">
              min remaining
            </p>
          </div>
        )}
      </div>

      {/* Info card */}
      <section className="mb-6 bg-white rounded-3xl p-5 border border-line shadow-card">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">
          Your companion
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-plum/10 flex items-center justify-center text-2xl flex-shrink-0">
            🎙️
          </div>
          <div>
            <p className="font-inter font-semibold text-ink text-sm">CompanionAI Coach</p>
            <p className="font-inter text-xs text-muted mt-0.5">
              Powered by Danè&apos;s coaching framework · English
            </p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-6 bg-mist rounded-3xl p-5 border border-line">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">
          Before you start
        </h2>
        <ul className="space-y-2">
          {[
            'Find a quiet space where you can speak freely.',
            'Allow microphone access when prompted.',
            'Speak naturally — no need to use special commands.',
            'The session ends when you click End session.',
          ].map((tip) => (
            <li key={tip} className="font-inter text-sm text-muted flex items-start gap-2">
              <span className="text-plum mt-0.5">·</span> {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Voice widget — client component handles mic + ElevenLabs */}
      {agentId ? (
        <VoiceWidget agentId={agentId} remainingMinutes={minutesRemaining} />
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-card">
          <p className="font-inter text-sm text-red-700">
            Voice agent is not configured. Please set{' '}
            <code className="bg-red-50 px-1 rounded">NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code> in your
            environment variables.
          </p>
        </div>
      )}
    </div>
  )
}