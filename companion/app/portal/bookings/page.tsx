import { createClient } from '@/lib/supabase/server'

interface Booking {
  id: string
  scheduled_at: string
  session_type: string | null
  status: string
  meeting_url: string | null
  pre_session_notes?: string | null
}

export default async function BookingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const now = new Date().toISOString()

  const [upcomingRes, pastRes, configRes] = await Promise.allSettled([
    supabase.from('bookings').select('id, scheduled_at, session_type, status, meeting_url, pre_session_notes').eq('user_id', user.id).gte('scheduled_at', now).order('scheduled_at'),
    supabase.from('bookings').select('id, scheduled_at, session_type, status, meeting_url').eq('user_id', user.id).lt('scheduled_at', now).order('scheduled_at', { ascending: false }).limit(10),
    supabase.from('system_config').select('value').eq('key', 'calendly_url').single(),
  ])

  const upcoming: Booking[] = upcomingRes.status === 'fulfilled' ? (upcomingRes.value.data ?? []) : []
  const past: Booking[] = pastRes.status === 'fulfilled' ? (pastRes.value.data ?? []) : []
  const calendlyUrl = configRes.status === 'fulfilled' ? configRes.value.data?.value : null

  const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Bookings</h1>
          <p className="font-inter text-muted text-sm mt-1">Your upcoming and past sessions with Danè</p>
        </div>
        {calendlyUrl && (
          <a href={calendlyUrl} target="_blank" rel="noopener noreferrer"
            className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
            + Book a session
          </a>
        )}
      </div>

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-line text-center">
            <p className="font-inter text-muted text-sm">No upcoming bookings</p>
            {calendlyUrl && (
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="font-inter text-sm text-plum underline mt-2 block">
                Book your next session →
              </a>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map(b => (
              <div key={b.id} className="bg-white rounded-3xl p-5 border border-line shadow-card">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-plum text-white text-center p-2.5 w-12 flex-shrink-0">
                      <p className="font-poppins font-bold text-lg leading-none">{new Date(b.scheduled_at).getDate()}</p>
                      <p className="font-inter text-[9px] uppercase">{new Date(b.scheduled_at).toLocaleString('en-ZA', { month: 'short' })}</p>
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-ink text-sm">{b.session_type ?? 'Coaching session'}</p>
                      <p className="font-inter text-xs text-muted">{new Date(b.scheduled_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className={`font-inter font-semibold text-xs px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] ?? 'bg-mist text-muted'}`}>{b.status}</span>
                </div>
                {b.meeting_url && (
                  <a href={b.meeting_url} target="_blank" rel="noopener noreferrer"
                    className="font-inter font-semibold text-sm text-white px-4 py-2 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft inline-block">
                    Join meeting
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Past sessions</h2>
          <div className="flex flex-col gap-2">
            {past.map(b => (
              <div key={b.id} className="bg-white rounded-3xl p-4 border border-line flex items-center justify-between gap-3">
                <div>
                  <p className="font-inter font-medium text-ink text-sm">{b.session_type ?? 'Coaching session'}</p>
                  <p className="font-inter text-xs text-muted">{new Date(b.scheduled_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className={`font-inter font-semibold text-xs px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] ?? 'bg-mist text-muted'}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
