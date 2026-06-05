import { createClient } from '@/lib/supabase/server'

export default async function AdminBillingPage() {
  const supabase = createClient()
  const { data: revenue } = await supabase.from('admin_revenue_overview').select('*').single()
  const r = (revenue as Record<string, unknown>) ?? {}

  const PLAN_KEYS = ['start', 'explorer', 'grow', 'voice', 'business']

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Revenue</h1>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'MRR', value: `R${r.mrr ?? 0}` },
          { label: 'ARR', value: `R${r.arr ?? 0}` },
          { label: 'This month', value: `R${r.month_revenue ?? 0}` },
          { label: 'Churn rate', value: `${r.churn_rate ?? 0}%` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-5 border border-line shadow-card">
            <p className="font-inter text-xs text-muted uppercase tracking-wide mb-1">{s.label}</p>
            <p className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card mb-6">
        <h2 className="font-poppins font-bold text-plum-dark text-base mb-4" style={{ letterSpacing: '-0.03em' }}>Revenue by plan</h2>
        <div className="flex flex-col gap-3">
          {PLAN_KEYS.map(plan => {
            const rev = Number(r[`${plan}_revenue`] ?? 0)
            const max = Math.max(...PLAN_KEYS.map(p => Number(r[`${p}_revenue`] ?? 0)), 1)
            return (
              <div key={plan} className="flex items-center gap-3">
                <span className="font-inter text-xs capitalize w-16 text-muted">{plan}</span>
                <div className="flex-1 h-3 rounded-full bg-mist overflow-hidden">
                  <div className="h-full rounded-full bg-plum" style={{ width: `${(rev / max) * 100}%` }} />
                </div>
                <span className="font-inter text-xs font-semibold text-ink w-16 text-right">R{rev}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* POPIA export */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">POPIA marketing list</h2>
        <p className="font-inter text-sm text-muted mb-4">Export a list of clients who have consented to marketing communications.</p>
        <button className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
          Export CSV
        </button>
      </div>
    </div>
  )
}
