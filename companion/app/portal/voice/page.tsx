import { createClient } from '@/lib/supabase/server'
import VoiceWidget from '@/components/portal/VoiceWidget'

export default async function VoiceSessionPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      full_name, plan,
      conversations_limit_monthly, conversations_used_this_month,
      voice_sessions_used_this_month, voice_sessions_limit_monthly,
      voice_minutes_used_today, voice_minutes_limit_daily,
      voice_last_session_date
    `)
    .eq('id', user.id)
    .single()

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? ''

  const plan         = (profile?.plan ?? 'free') as string
  const isFree       = plan === 'free'
  const today        = new Date().toISOString().slice(0, 10)

  // Daily minutes — reset display if last session wasn't today
  const lastSessionDate = profile?.voice_last_session_date as string | null
  const voiceMinutesUsedToday =
    lastSessionDate === today ? ((profile?.voice_minutes_used_today as number) ?? 0) : 0
  const voiceMinLimit   = profile?.voice_minutes_limit_daily as number | null
  const voiceSessUsed   = (profile?.voice_sessions_used_this_month as number) ?? 0
  const voiceSessLimit  = profile?.voice_sessions_limit_monthly as number | null

  const minutesRemaining = voiceMinLimit != null
    ? Math.max(0, voiceMinLimit - voiceMinutesUsedToday)
    : null

  // Free plan: 1 session/day — check if already used today
  const hadSessionToday  = isFree && lastSessionDate === today
  const canStartVoice    = isFree
    ? !hadSessionToday
    : voiceSessLimit == null || voiceSessUsed < voiceSessLimit

  // Plan label map
  const PLAN_VOICE_DESC: Record<string, string> = {
    free:     '1 session per day · 3 min max',
    grow:     '6 sessions per month · 20 min/day',
    business: '15 sessions per month · 30 min/day',
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* ── Header ── */}
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

        {/* Minutes pill — only for paid plans with a daily cap */}
        {minutesRemaining !== null && !isFree && (
          <div className="bg-white rounded-2xl px-4 py-2.5 border border-line shadow-card text-center">
            <p
              className="font-poppins font-bold text-plum-dark text-lg"
              style={{ letterSpacing: '-0.04em' }}
            >
              {minutesRemaining.toFixed(0)}
            </p>
            <p className="font-inter text-[10px] text-muted uppercase tracking-wide">
              min left today
            </p>
          </div>
        )}
      </div>

      {/* ── Plan limits banner ── */}
      <section className="mb-6 bg-white rounded-3xl p-5 border border-line shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-2">
              Your voice allowance
            </h2>
            <p className="font-inter text-sm text-muted">
              <span className="font-semibold capitalize text-plum">{plan}</span> plan ·{' '}
              {PLAN_VOICE_DESC[plan] ?? 'Custom plan'}
            </p>

            {/* Paid: monthly session counter */}
            {!isFree && voiceSessLimit != null && (
              <p className="font-inter text-sm text-muted mt-1">
                <span className={`font-semibold ${voiceSessUsed >= voiceSessLimit ? 'text-red-600' : 'text-ink'}`}>
                  {Math.max(0, voiceSessLimit - voiceSessUsed)}
                </span>{' '}
                voice session{voiceSessLimit - voiceSessUsed !== 1 ? 's' : ''} remaining this month
              </p>
            )}

            {/* Free: today status */}
            {isFree && (
              <p className="font-inter text-sm text-muted mt-1">
                {hadSessionToday ? (
                  <span className="text-amber-600 font-semibold">Session used today — resets at midnight</span>
                ) : (
                  <span className="text-green-700 font-semibold">1 free session available today</span>
                )}
              </p>
            )}
          </div>

          {/* Upgrade CTA for free plan */}
          {isFree && (
            <a
              href="/portal/billing"
              className="font-inter font-semibold text-xs text-plum hover:text-plum-dark border border-plum/30 hover:border-plum px-4 py-2 rounded-full transition-colors flex-shrink-0 ml-4"
            >
              Upgrade →
            </a>
          )}
        </div>

        {/* Free plan upgrade pitch */}
        {isFree && (
          <div className="mt-4 pt-4 border-t border-mist">
            <p className="font-inter text-xs text-muted leading-relaxed">
              <span className="font-semibold text-plum">Growth plan</span> gives you 6 voice sessions per
              month with up to 20 minutes per day, plus unlimited text conversations.
            </p>
          </div>
        )}
      </section>

      {/* ── Your companion ── */}
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

      {/* ── Tips ── */}
      <section className="mb-6 bg-mist rounded-3xl p-5 border border-line">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">
          Before you start
        </h2>
        <ul className="space-y-2">
          {[
            'Find a quiet space where you can speak freely.',
            'Allow microphone access when prompted.',
            'Speak naturally — no need to use special commands.',
            isFree
              ? 'Free sessions are 3 minutes. A countdown will show during your session.'
              : 'The session ends when you click End session.',
          ].map((tip) => (
            <li key={tip} className="font-inter text-sm text-muted flex items-start gap-2">
              <span className="text-plum mt-0.5">·</span> {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Voice widget ── */}
      {agentId ? (
        <VoiceWidget agentId={agentId} />
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
