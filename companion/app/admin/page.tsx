import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-3xl p-5 border shadow-card ${accent ? 'bg-plum text-white border-plum' : 'bg-white border-line'}`}>
      <p className={`font-inter text-xs uppercase tracking-wide mb-1 ${accent ? 'text-white/60' : 'text-muted'}`}>{label}</p>
      <p className={`font-poppins font-bold text-2xl ${accent ? 'text-white' : 'text-plum-dark'}`} style={{ letterSpacing: '-0.04em' }}>{value}</p>
      {sub && <p className={`font-inter text-xs mt-0.5 ${accent ? 'text-white/60' : 'text-muted'}`}>{sub}</p>}
    </div>
  )
}

export default async function AdminDashboard() {
  const supabase = createClient()

  const [overviewRes, revenueRes, bookingsRes, activityRes, failedRes] = await Promise.allSettled([
    supabase.from('admin_client_overview').select('*', { count: 'exact', head: true }),
    supabase.from('admin_revenue_overview').select('*').single(),
    supabase.from('admin_upcoming_bookings').select('*').limit(8),
    supabase.from('admin_client_overview').select('id, display_name, email, plan, last_active, total_sessions').order('last_active', { ascending: false, nullsFirst: false }).limit(10),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).in('status', ['past_due', 'suspended']),
  ])

  const totalClients = overviewRes.status === 'fulfilled' ? (overviewRes.value.count ?? 0) : 0
  const revenue = revenueRes.status === 'fulfilled' ? revenueRes.value.data : null
  const bookings = bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data ?? []) : []
  const activity = activityRes.status === 'fulfilled' ? (activityRes.value.data ?? []) : []
  const failedCount = failedRes.status === 'fulfilled' ? (failedRes.value.count ?? 0) : 0

  const PLAN_STYLES: Record<string, string> = {
    start: 'bg-mist text-plum', explorer: 'bg-blue-100 text-blue-700',
    grow: 'bg-purple-100 text-purple-700', voice: 'bg-accent/10 text-accent', business: 'bg-plum text-white',
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Stat label="Total clients" value={String(totalClients)} />
        <Stat label="MRR" value={revenue ? `R${((revenue as Record<string, unknown>).mrr ?? 0)}` : '—'} accent />
        <Stat label="Revenue (month)" value={revenue ? `R${((revenue as Record<string, unknown>).month_revenue ?? 0)}` : '—'} />
        <Stat label="Sessions today" value={String(bookings.filter((b: Record<string, string>) => new Date(b.scheduled_at).toDateString() === new Date().toDateString()).length)} />
        <Stat label="Failed payments" value={String(failedCount)} sub="past_due / suspended" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's bookings */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-bold text-plum-dark text-base" style={{ letterSpacing: '-0.03em' }}>Upcoming sessions</h2>
            <Link href="/admin/bookings" className="font-inter text-xs text-plum">View all →</Link>
          </div>
          {bookings.length === 0 ? (
            <p className="font-inter text-sm text-muted">No upcoming sessions</p>
          ) : (
            <div className="flex flex-col gap-2">
              {bookings.slice(0, 5).map((b: Record<string, string>) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-mist last:border-0">
                  <div>
                    <p className="font-inter font-medium text-ink text-sm">{b.client_name ?? b.user_id}</p>
                    <p className="font-inter text-xs text-muted">{new Date(b.scheduled_at).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className="font-inter text-xs px-2 py-0.5 rounded-full bg-mist text-muted">{b.session_type ?? 'Session'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-bold text-plum-dark text-base" style={{ letterSpacing: '-0.03em' }}>Recent client activity</h2>
            <Link href="/admin/clients" className="font-inter text-xs text-plum">View all →</Link>
          </div>
          {activity.length === 0 ? (
            <p className="font-inter text-sm text-muted">No client data yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {activity.map((c: Record<string, string>) => (
                <div key={c.id} className="flex items-center gap-3 py-2 border-b border-mist last:border-0">
                  <div className="w-7 h-7 rounded-full bg-plum/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-poppins font-bold text-plum text-[10px]">{(c.display_name ?? c.email ?? '?').slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm text-ink truncate">{c.display_name ?? c.email}</p>
                    <p className="font-inter text-xs text-muted">{c.total_sessions} sessions</p>
                  </div>
                  <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full ${PLAN_STYLES[c.plan] ?? PLAN_STYLES.start}`}>{c.plan}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
