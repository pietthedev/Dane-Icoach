import { createClient } from '@/lib/supabase/server'

interface AuditRow { id: string; action: string; user_id: string | null; details: Record<string, unknown> | null; created_at: string }

export default async function AdminAuditPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('audit_log')
    .select('id, action, user_id, details, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const rows: AuditRow[] = (data as AuditRow[]) ?? []

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Audit log</h1>
        <button className="font-inter font-semibold text-sm text-plum px-5 py-2.5 rounded-full border border-plum hover:bg-plum hover:text-white transition-colors">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden">
        {rows.length === 0 ? (
          <p className="font-inter text-sm text-muted p-6">No audit log entries yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mist bg-cloud">
                  {['Time', 'Action', 'User', 'Details'].map(h => (
                    <th key={h} className="font-inter font-semibold text-xs text-muted uppercase tracking-wide px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-cloud/50">
                    <td className="px-4 py-3 font-inter text-xs text-muted whitespace-nowrap">{new Date(r.created_at).toLocaleString('en-ZA')}</td>
                    <td className="px-4 py-3 font-inter text-sm text-ink font-mono">{r.action}</td>
                    <td className="px-4 py-3 font-inter text-xs text-muted truncate max-w-[120px]">{r.user_id ?? '—'}</td>
                    <td className="px-4 py-3 font-inter text-xs text-muted truncate max-w-[200px]">
                      {r.details ? JSON.stringify(r.details).slice(0, 80) : '—'}
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
