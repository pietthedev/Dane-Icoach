import { createClient } from '@/lib/supabase/server'

export default async function AdminBookingsPage() {
  const supabase = createClient()
  const [upcomingRes, configRes] = await Promise.allSettled([
    supabase.from('admin_upcoming_bookings').select('*').order('scheduled_at'),
    supabase.from('system_config').select('value').eq('key', 'calendly_admin_url').single(),
  ])
  const bookings = upcomingRes.status === 'fulfilled' ? (upcomingRes.value.data ?? []) : []
  const calendlyUrl = configRes.status === 'fulfilled' ? configRes.value.data?.value : null

  const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700', completed: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Bookings</h1>
        {calendlyUrl && (
          <a href={calendlyUrl} target="_blank" rel="noopener noreferrer"
            className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
            Open Calendly
          </a>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden">
        {bookings.length === 0 ? (
          <p className="font-inter text-sm text-muted p-6">No upcoming bookings</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mist bg-cloud">
                  {['Client', 'Date & time', 'Type', 'Status', 'Meeting'].map(h => (
                    <th key={h} className="font-inter font-semibold text-xs text-muted uppercase tracking-wide px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {bookings.map((b: Record<string, string>) => (
                  <tr key={b.id} className="hover:bg-cloud/50">
                    <td className="px-4 py-3 font-inter text-sm text-ink">{b.client_name ?? b.user_id}</td>
                    <td className="px-4 py-3 font-inter text-sm text-muted whitespace-nowrap">
                      {new Date(b.scheduled_at).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-inter text-sm text-muted">{b.session_type ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] ?? 'bg-mist text-muted'}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {b.meeting_url ? (
                        <a href={b.meeting_url} target="_blank" rel="noopener noreferrer" className="font-inter text-xs text-plum underline">Join</a>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
