import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'

// Use service-role client so RLS doesn't block reads of admin_client_overview
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
  const supabase = getAdminClient()

  const { data: clients, error } = await supabase
    .from('admin_client_overview')
    .select(
      'id, full_name, plan, member_since, total_conversations, avg_rating, subscription_status'
    )
    .order('member_since', { ascending: false })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>
            Clients
          </h1>
          <p className="font-inter text-sm text-muted mt-0.5">
            {clients?.length ?? 0} member{clients?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
          <p className="font-inter text-sm text-red-600">Failed to load clients: {error.message}</p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden">
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
                    No clients yet.
                  </td>
                </tr>
              ) : (
                clients.map((c: ClientRow) => (
                  <tr key={c.id} className="border-b border-mist last:border-0 hover:bg-mist/40 transition-colors">
                    {/* Client */}
                    <td className="px-5 py-3.5">
                      <p className="font-inter font-medium text-ink text-sm">{c.full_name ?? '—'}</p>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3.5">
                      <span className="font-inter text-xs px-2.5 py-1 rounded-full bg-mist text-plum font-semibold capitalize">
                        {c.plan ?? 'start'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3.5">
                      <p className="font-inter text-sm text-muted">
                        {c.member_since ? new Date(c.member_since).toLocaleDateString('en-ZA') : '—'}
                      </p>
                    </td>

                    {/* Sessions */}
                    <td className="px-4 py-3.5 text-right">
                      <p className="font-inter text-sm text-ink tabular-nums">{c.total_conversations ?? 0}</p>
                    </td>

                    {/* Avg rating */}
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

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={c.subscription_status} />
                    </td>

                    {/* View link */}
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
    active: 'bg-green-100 text-green-700',
    trialing: 'bg-blue-100 text-blue-700',
    past_due: 'bg-amber-100 text-amber-700',
    canceled: 'bg-red-100 text-red-700',
    incomplete: 'bg-gray-100 text-gray-600',
    unknown: 'bg-mist text-muted',
  }
  const cls = styles[s] ?? styles.unknown
  return (
    <span className={`font-inter text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${cls}`}>
      {s.replace('_', ' ')}
    </span>
  )
}
