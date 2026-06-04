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

  const [quoteRes, profileRes, bookingRes, hwRes, convRes] = await Promise.allSettled([
    supabase.from('quotes').select('quote_text, author').eq('is_active', true).order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('profiles').select('full_name, plan, conversations_limit_monthly, conversations_used_this_month, token_limit_monthly, tokens_used_this_month').eq('id', user.id).single(),
    supabase.from('bookings').select('scheduled_at, title, meeting_url').eq('user_id', user.id).eq('status', 'confirmed').gte('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(1).single(),
    supabase.from('homework').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending'),
    supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const quote = quoteRes.status === 'fulfilled' ? quoteRes.value.data : null
  const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
  const booking = bookingRes.status === 'fulfilled' ? bookingRes.value.data : null
  const hwCount = hwRes.status === 'fulfilled' ? (hwRes.value.count ?? 0) : 0
  const convCount = convRes.status === 'fulfilled' ? (convRes.value.count ?? 0) : 0

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Greeting */}
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-4" style={{ letterSpacing: '-0.04em' }}>
        Welcome back, {firstName} 👋
      </h1>

      {/* ── Voice CTA — hero card, first thing you see ── */}
      <a
        href="/portal/voice"
        className="group flex items-center justify-between gap-4 rounded-3xl p-5 md:p-6 mb-5 text-white no-underline transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: 'linear-gradient(135deg, #2E1A47 0%, #6B3FA0 60%, #FF6F9F 140%)' }}
      >
        <div className="flex-1 min-w-0">
          <p className="font-inter text-[10px] uppercase tracking-widest opacity-60 mb-1">Voice session</p>
          <p className="font-poppins font-bold text-xl md:text-2xl leading-tight mb-1" style={{ letterSpacing: '-0.03em' }}>
            Got a few minutes?<br className="hidden sm:block" /> Talk it through.
          </p>
          <p className="font-inter text-sm opacity-75 leading-snug">
            Running to a meeting, processing something big, or just need to think out loud.
          </p>
        </div>
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors flex items-center justify-center flex-shrink-0 shadow-soft">
          <span className="text-3xl md:text-4xl" aria-hidden="true">🎙️</span>
        </div>
      </a>

      {/* Quote */}
      {quote && (
        <div className="rounded-3xl p-6 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #2E1A47 0%, #4B2E83 100%)' }}>
          <p className="font-inter text-xs uppercase tracking-widest mb-3 opacity-60">Quote of the day</p>
          <p className="font-poppins font-bold text-lg leading-snug mb-2" style={{ letterSpacing: '-0.02em' }}>
            &ldquo;{quote.quote_text}&rdquo;
          </p>
          {quote.author && <p className="font-inter text-sm opacity-70 italic">— {quote.author}</p>}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Conversations" value={String(convCount)} sub="total" />
        <StatCard label="Homework due" value={String(hwCount)} sub={hwCount === 1 ? 'item pending' : 'items pending'} />
        <StatCard label="Next session" value={booking ? new Date(booking.scheduled_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : '—'} sub={booking?.title ?? 'No bookings'} />
        <StatCard label="Plan" value={profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) : '—'} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Usage */}
        {profile && (
          <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
            <h2 className="font-poppins font-bold text-plum-dark text-base mb-4" style={{ letterSpacing: '-0.03em' }}>Usage this month</h2>
            <div className="flex flex-col gap-4">
              <UsageMeter
                used={profile.conversations_used_this_month ?? 0}
                total={profile.conversations_limit_monthly ?? 10}
                label="Conversations"
              />
              <UsageMeter
                used={profile.tokens_used_this_month ?? 0}
                total={profile.token_limit_monthly ?? 50000}
                label="Tokens"
              />
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
                <p className="font-inter font-semibold text-ink text-sm">{booking.title ?? 'Coaching session'}</p>
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