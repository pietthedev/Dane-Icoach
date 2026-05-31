import { createClient } from '@/lib/supabase/server'

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
      <p className="font-inter text-xs text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>{value}</p>
      {sub && <p className="font-inter text-xs text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function UsageMeter({ used, total, label }: { used: number; total: number; label: string }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between font-inter text-xs text-muted">
        <span>{label}</span>
        <span className="font-semibold text-ink">{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-mist overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default async function PortalHomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [quoteRes, usageRes, bookingRes, hwRes, onboardingRes] = await Promise.allSettled([
    supabase.from('quotes').select('body, author').order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('usage').select('conversations_used, conversations_limit, tokens_used, tokens_limit, voice_minutes_used, voice_minutes_limit').eq('user_id', user.id).order('period_start', { ascending: false }).limit(1).single(),
    supabase.from('bookings').select('scheduled_at, session_type, meeting_url').eq('user_id', user.id).eq('status', 'confirmed').gte('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(1).single(),
    supabase.from('homework').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending'),
    supabase.from('onboarding_steps').select('step_key, completed, label').eq('user_id', user.id).order('sort_order'),
  ])

  const quote = quoteRes.status === 'fulfilled' ? quoteRes.value.data : null
  const usage = usageRes.status === 'fulfilled' ? usageRes.value.data : null
  const booking = bookingRes.status === 'fulfilled' ? bookingRes.value.data : null
  const hwCount = hwRes.status === 'fulfilled' ? (hwRes.value.count ?? 0) : 0
  const steps = onboardingRes.status === 'fulfilled' ? (onboardingRes.value.data ?? []) : []

  const completedSteps = steps.filter((s: { completed: boolean }) => s.completed).length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Quote */}
      {quote && (
        <div className="rounded-3xl p-6 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #2E1A47 0%, #4B2E83 100%)' }}>
          <p className="font-inter text-xs uppercase tracking-widest mb-3 opacity-60">Quote of the day</p>
          <p className="font-poppins font-bold text-lg leading-snug mb-2" style={{ letterSpacing: '-0.02em' }}>
            &ldquo;{quote.body}&rdquo;
          </p>
          {quote.author && <p className="font-inter text-sm opacity-70 italic">— {quote.author}</p>}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Conversations" value={String(usage?.conversations_used ?? 0)} sub={`of ${usage?.conversations_limit ?? '—'} this month`} />
        <StatCard label="Homework due" value={String(hwCount)} sub={hwCount === 1 ? 'item pending' : 'items pending'} />
        <StatCard label="Next session" value={booking ? new Date(booking.scheduled_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : '—'} sub={booking?.session_type ?? 'No bookings'} />
        <StatCard label="Voice minutes" value={String(usage?.voice_minutes_used ?? 0)} sub={`of ${usage?.voice_minutes_limit ?? '—'} used`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Token usage */}
        {usage && (
          <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
            <h2 className="font-poppins font-bold text-plum-dark text-base mb-4" style={{ letterSpacing: '-0.03em' }}>Usage this month</h2>
            <div className="flex flex-col gap-4">
              <UsageMeter used={usage.conversations_used ?? 0} total={usage.conversations_limit ?? 1} label="Conversations" />
              <UsageMeter used={usage.tokens_used ?? 0} total={usage.tokens_limit ?? 1} label="Tokens" />
              <UsageMeter used={usage.voice_minutes_used ?? 0} total={usage.voice_minutes_limit ?? 1} label="Voice minutes" />
            </div>
          </div>
        )}

        {/* Onboarding checklist */}
        {steps.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-poppins font-bold text-plum-dark text-base" style={{ letterSpacing: '-0.03em' }}>Getting started</h2>
              <span className="font-inter text-xs text-muted">{completedSteps}/{steps.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {steps.map((step: { step_key: string; completed: boolean; label: string }) => (
                <div key={step.step_key} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-plum' : 'border-2 border-mist'}`}>
                    {step.completed && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className={`font-inter text-sm ${step.completed ? 'text-muted line-through' : 'text-ink'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next booking */}
        {booking && (
          <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
            <h2 className="font-poppins font-bold text-plum-dark text-base mb-3" style={{ letterSpacing: '-0.03em' }}>Next session</h2>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-plum text-white text-center p-3 flex-shrink-0 w-14">
                <p className="font-poppins font-bold text-xl leading-none">{new Date(booking.scheduled_at).getDate()}</p>
                <p className="font-inter text-[10px] uppercase">{new Date(booking.scheduled_at).toLocaleString('en-ZA', { month: 'short' })}</p>
              </div>
              <div>
                <p className="font-inter font-semibold text-ink text-sm">{booking.session_type ?? 'Coaching session'}</p>
                <p className="font-inter text-xs text-muted">{new Date(booking.scheduled_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</p>
                {booking.meeting_url && (
                  <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer" className="font-inter text-xs text-plum underline mt-1 block">Join meeting →</a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Homework due */}
        {hwCount > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-line shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl flex-shrink-0">📋</div>
            <div className="flex-1">
              <p className="font-inter font-semibold text-ink text-sm">{hwCount} homework item{hwCount > 1 ? 's' : ''} pending</p>
              <a href="/portal/homework" className="font-inter text-xs text-plum underline">View homework →</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
