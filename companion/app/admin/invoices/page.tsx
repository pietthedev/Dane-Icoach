import { createClient } from '@/lib/supabase/server'

export default async function AdminInvoicesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('invoices')
    .select('id, user_id, amount, currency, status, created_at, paystack_reference')
    .order('created_at', { ascending: false })
    .limit(100)

  const invoices = (data ?? []) as Array<{ id: string; user_id: string; amount: number; currency: string; status: string; created_at: string; paystack_reference: string | null }>

  const STATUS_STYLES: Record<string, string> = {
    paid: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700', refunded: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Invoices</h1>

      <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden">
        {invoices.length === 0 ? (
          <p className="font-inter text-sm text-muted p-6">No invoices yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mist bg-cloud">
                  {['Date', 'User', 'Amount', 'Reference', 'Status', 'Actions'].map(h => (
                    <th key={h} className="font-inter font-semibold text-xs text-muted uppercase tracking-wide px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-cloud/50">
                    <td className="px-4 py-3 font-inter text-sm text-muted whitespace-nowrap">{new Date(inv.created_at).toLocaleDateString('en-ZA')}</td>
                    <td className="px-4 py-3 font-inter text-sm text-muted truncate max-w-[120px]">{inv.user_id}</td>
                    <td className="px-4 py-3 font-inter font-semibold text-ink text-sm whitespace-nowrap">{inv.currency} {(inv.amount / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 font-inter text-xs text-muted">{inv.paystack_reference ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${STATUS_STYLES[inv.status] ?? 'bg-mist text-muted'}`}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {inv.status === 'failed' && (
                        <form action="/api/admin/invoices/retry" method="POST">
                          <input type="hidden" name="invoice_id" value={inv.id} />
                          <button type="submit" className="font-inter text-xs text-plum hover:underline">Retry</button>
                        </form>
                      )}
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
