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

  const plan           = (profile?.plan ?? 'free') as string
  const isFree         = plan === 'free'
  const today          = new Date().toISOString().slice(0, 10)
  const lastSessionDate = profile?.voice_last_session_date as string | null
  const voiceMinutesUsedToday =
    lastSessionDate === today ? ((profile?.voice_minutes_used_today as number) ?? 0) : 0
  const voiceMinLimit  = profile?.voice_minutes_limit_daily as number | null
  const voiceSessUsed  = (profile?.voice_sessions_used_this_month as number) ?? 0
  const voiceSessLimit = profile?.voice_sessions_limit_monthly as number | null
  const minutesRemaining = voiceMinLimit != null
    ? Math.max(0, voiceMinLimit - voiceMinutesUsedToday)
    : null
  const hadSessionToday = isFree && lastSessionDate === today
  const canStartVoice   = isFree
    ? !hadSessionToday
    : voiceSessLimit == null || voiceSessUsed < voiceSessLimit

  const PLAN_VOICE_DESC: Record<string, string> = {
    free:     '1 session per day · 3 min',
    grow:     '6 sessions / month · 20 min/day',
    business: '15 sessions / month · 30 min/day',
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">

      {/* ── Hero prompt ── */}
      <div className="mb-4">
        <h1
          className="font-poppins font-bold text-plum-dark text-2xl md:text-3xl"
          style={{ letterSpacing: '-0.04em' }}
        >
          Talk to your companion
        </h1>
        <p className="font-inter text-muted text-sm mt-1">
          Hey {firstName} — tap the button and start speaking. That&apos;s it.
        </p>
      </div>

      {/* ── Plan status pill — compact, one line ── */}
      <div className="flex items-center justify-between mb-5 px-4 py-2.5 bg-white rounded-2xl border border-line shadow-card">
        <p className="font-inter text-xs text-muted">
          <span className="font-semibold capitalize text-plum">{plan}</span>
          {' · '}
          {PLAN_VOICE_DESC[plan] ?? 'Custom plan'}
          {!isFree && voiceSessLimit != null && (
            <> · <span className={`font-semibold ${voiceSessUsed >= voiceSessLimit ? 'text-red-500' : 'text-ink'}`}>
              {Math.max(0, voiceSessLimit - voiceSessUsed)} sessions left
            </span></>
          )}
          {isFree && hadSessionToday && (
            <> · <span className="text-amber-600 font-semibold">Used today — resets midnight</span></>
          )}
          {isFree && !hadSessionToday && (
            <> · <span className="text-green-700 font-semibold">Available now</span></>
          )}
          {!isFree && minutesRemaining !== null && (
            <> · <span className="font-semibold text-ink">{minutesRemaining.toFixed(0)} min left today</span></>
          )}
        </p>
        {isFree && (
          <a href="/portal/billing"
            className="font-inter font-semibold text-[10px] text-plum hover:text-plum-dark border border-plum/30 px-2.5 py-1 rounded-full transition-colors flex-shrink-0 ml-3">
            Upgrade
          </a>
        )}
      </div>

      {/* ── VOICE WIDGET — the whole point of this page ── */}
      {agentId ? (
        <VoiceWidget agentId={agentId} />
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-card">
          <p className="font-inter text-sm text-red-700">
            Voice agent not configured.{' '}
            <code className="bg-red-50 px-1 rounded">NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code> is missing.
          </p>
        </div>
      )}

      {/* ── Tips — below the fold, secondary ── */}
      <details className="mt-6 group">
        <summary className="font-inter text-xs text-muted cursor-pointer list-none flex items-center gap-1.5 select-none">
          <span className="group-open:rotate-90 transition-transform inline-block">›</span>
          Tips for a good session
        </summary>
        <ul className="mt-3 space-y-2 pl-4 border-l-2 border-mist">
          {[
            'Find a quiet space — or use earphones in noisy environments.',
            'Allow microphone access when the browser prompts.',
            'Speak naturally — no special commands needed.',
            isFree
              ? 'Free sessions are 3 minutes. A countdown shows during the session.'
              : 'End the session any time using the button.',
          ].map(tip => (
            <li key={tip} className="font-inter text-sm text-muted flex items-start gap-2">
              <span className="text-plum mt-0.5 flex-shrink-0">·</span> {tip}
            </li>
          ))}
        </ul>
      </details>

    </div>
  )
}
