import { createClient } from '@/lib/supabase/server'

export default async function AdminCollectionsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan, status, failed_payment_count, last_failed_at')
    .in('status', ['past_due', 'suspended'])
    .order('last_failed_at', { ascending: false, nullsFirst: false })

  const subs = (data ?? []) as Array<{ id: string; user_id: string; plan: string | null; status: string; failed_payment_count: number | null; last_failed_at: string | null }>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Collections</h1>
          <p className="font-inter text-muted text-sm mt-0.5">{subs.length} account{subs.length !== 1 ? 's' : ''} with failed payments</p>
        </div>
      </div>

      {subs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-line text-center">
          <span className="text-4xl block mb-3">✅</span>
          <p className="font-inter text-muted text-sm">No overdue accounts — everything is up to date!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {subs.map(s => (
            <div key={s.id} className="bg-white rounded-3xl p-5 border border-red-200 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-inter font-semibold text-ink text-sm">{s.user_id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-inter text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">{s.status}</span>
                    <span className="font-inter text-xs text-muted capitalize">{s.plan ?? 'unknown'} plan</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-inter font-semibold text-red-600 text-sm">{s.failed_payment_count ?? 0} failed</p>
                  {s.last_failed_at && <p className="font-inter text-xs text-muted">{new Date(s.last_failed_at).toLocaleDateString('en-ZA')}</p>}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="font-inter font-semibold text-sm text-white px-4 py-2 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
                  Send payment link
                </button>
                <button className="font-inter text-sm text-muted px-4 py-2 rounded-full border border-mist hover:bg-mist transition-colors">
                  {s.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
