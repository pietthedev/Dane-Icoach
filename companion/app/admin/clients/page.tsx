import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Client {
  id: string
  display_name: string | null
  email: string | null
  plan: string | null
  status: string | null
  created_at: string | null
  total_sessions: number | null
  tokens_used: number | null
  tokens_limit: number | null
  avg_rating: number | null
  language: string | null
}

const PLAN_STYLES: Record<string, string> = {
  start: 'bg-mist text-plum', explorer: 'bg-blue-100 text-blue-700',
  grow: 'bg-purple-100 text-purple-700', voice: 'bg-accent/10 text-accent',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700', suspended: 'bg-red-100 text-red-700',
  inactive: 'bg-mist text-muted',
}

export default async function ClientsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('admin_client_overview')
    .select('*')
    .order('created_at', { ascending: false })

  const clients: Client[] = (data as Client[]) ?? []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Clients</h1>
          <p className="font-inter text-muted text-sm mt-0.5">{clients.length} total</p>
        </div>
        <button className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
          + Invite client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-line text-center">
          <p className="font-inter text-muted text-sm">No clients yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mist bg-cloud">
                  {['Client', 'Language', 'Plan', 'Joined', 'Sessions', 'Tokens', 'Avg rating', 'Status', ''].map(h => (
                    <th key={h} className="font-inter font-semibold text-xs text-muted uppercase tracking-wide px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {clients.map(c => {
                  const tokenPct = c.tokens_limit ? ((c.tokens_used ?? 0) / c.tokens_limit) * 100 : 0
                  return (
                    <tr key={c.id} className="hover:bg-cloud/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-plum/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-poppins font-bold text-plum text-[10px]">{(c.display_name ?? c.email ?? '?').slice(0,2).toUpperCase()}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-inter font-medium text-ink text-sm truncate">{c.display_name ?? '—'}</p>
                            <p className="font-inter text-xs text-muted truncate">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-inter text-sm text-muted">{c.language ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${PLAN_STYLES[c.plan ?? 'start'] ?? PLAN_STYLES.start}`}>
                          {c.plan ?? 'start'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-inter text-xs text-muted whitespace-nowrap">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('en-ZA') : '—'}
                      </td>
                      <td className="px-4 py-3 font-inter font-semibold text-ink text-sm">{c.total_sessions ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 w-20">
                          <div className="flex-1 h-1.5 rounded-full bg-mist overflow-hidden">
                            <div className="h-full rounded-full bg-plum" style={{ width: `${Math.min(tokenPct, 100)}%` }} />
                          </div>
                          <span className="font-inter text-[10px] text-muted">{Math.round(tokenPct)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-inter text-sm text-muted">{c.avg_rating ? `${Number(c.avg_rating).toFixed(1)} ⭐` : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status ?? 'active'] ?? STATUS_STYLES.active}`}>
                          {c.status ?? 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/clients/${c.id}`} className="font-inter text-xs text-plum hover:underline">View</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
