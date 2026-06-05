import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'

function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type ClientRow = {
  id: string
  full_name: string | null
  plan: string | null
  member_since: string | null
  total_conversations: number | null
  avg_rating: number | null
  subscription_status: string | null
}

export default async function ClientsListPage() {
  // Get the logged-in coach's user ID
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminClient = getAdminClient()

  // Get only this coach's assigned clients from coach_clients
  const { data: assignments } = await adminClient
    .from('coach_clients')
    .select('client_id')
    .eq('coach_id', user.id)

  const clientIds = (assignments ?? []).map((r: { client_id: string }) => r.client_id)

  // Fetch client overview rows for those IDs
  const { data: clients, error } = clientIds.length > 0
    ? await adminClient
        .from('admin_client_overview')
        .select('id, full_name, plan, member_since, total_conversations, avg_rating, subscription_status')
        .in('id', clientIds)
        .order('member_since', { ascending: false })
    : { data: [], error: null }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>
            Clients
          </h1>
          <p className="font-inter text-sm text-muted mt-0.5">
            {clients?.length ?? 0} client{clients?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
          <p className="font-inter text-sm text-red-600">Failed to load clients: {error.message}</p>
        </div>
      )}

      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden flex flex-col gap-3">
        {!clients || clients.length === 0 ? (
          <p className="font-inter text-sm text-muted text-center py-12">No clients assigned yet.</p>
        ) : (
          clients.map((c: ClientRow) => (
            <div key={c.id} className="bg-white rounded-3xl p-4 border border-line shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-inter font-semibold text-ink text-sm truncate">{c.full_name ?? '—'}</p>
                  <p className="font-inter text-xs text-muted mt-0.5">
                    Joined {c.member_since ? new Date(c.member_since).toLocaleDateString('en-ZA') : '—'}
                  </p>
                </div>
                <span className="font-inter text-xs px-2.5 py-1 rounded-full bg-mist text-plum font-semibold capitalize flex-shrink-0">
                  {c.plan ?? 'free'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="font-inter font-bold text-ink text-sm tabular-nums">{c.total_conversations ?? 0}</p>
                    <p className="font-inter text-[10px] text-muted">sessions</p>
                  </div>
                  <div>
                    {c.avg_rating != null ? (
                      <p className="font-inter text-sm text-yellow-500">
                        {'★'.repeat(Math.round(c.avg_rating))}{'☆'.repeat(5 - Math.round(c.avg_rating))}
                      </p>
                    ) : (
                      <p className="font-inter text-sm text-muted">—</p>
                    )}
                    <p className="font-inter text-[10px] text-muted">rating</p>
                  </div>
                  <StatusBadge status={c.subscription_status} />
                </div>
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="font-inter text-xs font-semibold text-white bg-plum hover:bg-plum-dark px-4 py-2 rounded-full transition-colors flex-shrink-0 min-h-[44px] flex items-center"
                >
                  View →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block bg-white rounded-3xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className="font-inter text-xs font-semibold text-muted uppercase tracking-wide text-left px-5 py-3.5">Client</th>
                <th className="font-inter text-xs font-semibold text-muted uppercase tracking-wide text-left px-4 py-3.5">Plan</th>
                <th className="font-inter text-xs font-semibold text-muted uppercase tracking-wide text-left px-4 py-3.5">Joined</th>
                <th className="font-inter text-xs font-semibold text-muted uppercase tracking-wide text-right px-4 py-3.5">Sessions</th>
                <th className="font-inter text-xs font-semibold text-muted uppercase tracking-wide text-right px-4 py-3.5">Avg rating</th>
                <th className="font-inter text-xs font-semibold text-muted uppercase tracking-wide text-left px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {!clients || clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="font-inter text-sm text-muted text-center py-12">
                    No clients assigned yet.
                  </td>
                </tr>
              ) : (
                clients.map((c: ClientRow) => (
                  <tr key={c.id} className="border-b border-mist last:border-0 hover:bg-mist/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-inter font-medium text-ink text-sm">{c.full_name ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-inter text-xs px-2.5 py-1 rounded-full bg-mist text-plum font-semibold capitalize">
                        {c.plan ?? 'free'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-inter text-sm text-muted">
                        {c.member_since ? new Date(c.member_since).toLocaleDateString('en-ZA') : '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <p className="font-inter text-sm text-ink tabular-nums">{c.total_conversations ?? 0}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {c.avg_rating != null ? (
                        <span className="font-inter text-sm text-ink tabular-nums">
                          {'★'.repeat(Math.round(c.avg_rating))}{'☆'.repeat(5 - Math.round(c.avg_rating))}
                          <span className="text-muted ml-1 text-xs">{c.avg_rating.toFixed(1)}</span>
                        </span>
                      ) : (
                        <span className="font-inter text-sm text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={c.subscription_status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="font-inter text-xs font-semibold text-plum hover:text-plum-dark transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? 'unknown'
  const styles: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    trialing:  'bg-blue-100 text-blue-700',
    past_due:  'bg-amber-100 text-amber-700',
    canceled:  'bg-red-100 text-red-700',
    incomplete: 'bg-gray-100 text-gray-600',
    unknown:   'bg-mist text-muted',
  }
  return (
    <span className={`font-inter text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${styles[s] ?? styles.unknown}`}>
      {s.replace('_', ' ')}
    </span>
  )
}
