import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const PLANS = [
  { key: 'start', name: 'Start', price: 'Free', conversations: 5, tokens: 50000, voice: 0 },
  { key: 'explorer', name: 'Explorer', price: 'R99/mo', conversations: 30, tokens: 300000, voice: 0 },
  { key: 'grow', name: 'Grow', price: 'R249/mo', conversations: 100, tokens: 1000000, voice: 30, featured: true },
  { key: 'voice', name: 'Voice', price: 'Custom', conversations: 999, tokens: 5000000, voice: 120 },
]

function UsageBar({ used, total, label }: { used: number; total: number; label: string }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between font-inter text-xs text-muted">
        <span>{label}</span>
        <span className="font-semibold text-ink">{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-mist overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [subRes, invoiceRes, usageRes, profileRes] = await Promise.allSettled([
    supabase.from('subscriptions').select('plan, status, current_period_end, cancel_at_period_end').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('invoices').select('id, amount, currency, status, created_at, paystack_reference').eq('user_id', user.id).order('created_at', { ascending: false }).limit(12),
    supabase.from('usage').select('conversations_used, conversations_limit, tokens_used, tokens_limit, voice_minutes_used, voice_minutes_limit').eq('user_id', user.id).order('period_start', { ascending: false }).limit(1).single(),
    supabase.from('profiles').select('plan').eq('id', user.id).single(),
  ])

  const sub = subRes.status === 'fulfilled' ? subRes.value.data : null
  const invoices = invoiceRes.status === 'fulfilled' ? (invoiceRes.value.data ?? []) : []
  const usage = usageRes.status === 'fulfilled' ? usageRes.value.data : null
  const currentPlan = (profileRes.status === 'fulfilled' ? profileRes.value.data?.plan : null) ?? 'start'

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Billing</h1>

      {/* Current plan */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-inter text-xs text-muted uppercase tracking-wide mb-1">Current plan</p>
            <p className="font-poppins font-bold text-plum-dark text-xl" style={{ letterSpacing: '-0.03em' }}>
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </p>
            {sub && (
              <p className="font-inter text-xs text-muted mt-1">
                Status: <span className={`font-semibold ${sub.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>{sub.status}</span>
                {sub.current_period_end && ` · Renews ${new Date(sub.current_period_end).toLocaleDateString('en-ZA')}`}
              </p>
            )}
          </div>
          <Link href="/#pricing" className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
            Upgrade
          </Link>
        </div>
        {usage && (
          <div className="flex flex-col gap-3">
            <UsageBar used={usage.conversations_used ?? 0} total={usage.conversations_limit ?? 1} label="Conversations" />
            <UsageBar used={usage.tokens_used ?? 0} total={usage.tokens_limit ?? 1} label="Tokens" />
            <UsageBar used={usage.voice_minutes_used ?? 0} total={usage.voice_minutes_limit ?? 1} label="Voice minutes" />
          </div>
        )}
      </div>

      {/* Plan comparison */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {PLANS.map(p => (
          <div key={p.key} className={`rounded-3xl p-5 border ${p.key === currentPlan ? 'border-plum bg-plum/5' : 'border-line bg-white'} shadow-card`}>
            <p className="font-poppins font-bold text-plum-dark text-base mb-0.5" style={{ letterSpacing: '-0.03em' }}>{p.name}</p>
            <p className="font-inter font-semibold text-accent text-sm mb-3">{p.price}</p>
            <div className="flex flex-col gap-1 font-inter text-xs text-muted">
              <p>{p.conversations === 999 ? 'Unlimited' : p.conversations} conversations</p>
              <p>{(p.tokens / 1000).toFixed(0)}k tokens</p>
              <p>{p.voice === 0 ? 'No voice' : `${p.voice} min voice`}</p>
            </div>
            {p.key !== currentPlan && p.key !== 'start' && (
              <button className="font-inter font-semibold text-xs text-white px-3 py-1.5 rounded-full bg-plum hover:bg-plum-dark transition-colors mt-3 w-full">
                Upgrade
              </button>
            )}
            {p.key === currentPlan && <p className="font-inter text-xs text-plum font-semibold mt-3">Current plan</p>}
          </div>
        ))}
      </div>

      {/* Invoice history */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">Invoice history</h2>
          <div className="flex flex-col divide-y divide-mist">
            {invoices.map((inv: { id: string; amount: number; currency: string; status: string; created_at: string; paystack_reference: string | null }) => (
              <div key={inv.id} className="flex items-center justify-between py-3 gap-3">
                <div>
                  <p className="font-inter text-sm text-ink">{new Date(inv.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {inv.paystack_reference && <p className="font-inter text-xs text-muted">{inv.paystack_reference}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {inv.status}
                  </span>
                  <p className="font-inter font-semibold text-ink text-sm">{inv.currency} {(inv.amount / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
