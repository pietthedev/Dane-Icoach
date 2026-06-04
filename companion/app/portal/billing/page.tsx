import { createClient } from '@/lib/supabase/server'
import { UpgradeButton, CancelButton } from './BillingActions'

const UPGRADE_PLANS = [
  {
    key:         'grow',
    name:        'Grow',
    price:       'R349',
    priceNote:   '/month',
    featured:    true,
    badge:       'Most popular',
    features: [
      '6 voice sessions per month',
      '20 min voice per day',
      'Unlimited text conversations',
      'Full transcripts, summaries & ratings',
      'Share conversations with Danè',
      'Monthly check-in with Danè',
    ],
  },
  {
    key:         'business',
    name:        'Business',
    price:       'R699',
    priceNote:   '/month',
    featured:    false,
    badge:       null,
    features: [
      '15 voice sessions per month',
      '30 min voice per day',
      'Unlimited text conversations',
      'Everything in Grow',
      'Priority in Danè\'s calendar',
      'Danè reviews shared conversations',
    ],
  },
]

const STATUS_STYLES: Record<string, string> = {
  active:    'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  past_due:  'bg-amber-100 text-amber-700',
  trialing:  'bg-blue-100 text-blue-700',
  free:      'bg-mist text-muted',
}

function UsageBar({ used, total, label }: { used: number; total: number; label: string }) {
  const pct   = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between font-inter text-xs text-muted">
        <span>{label}</span>
        <span className="font-semibold text-ink">{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-mist overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { upgraded?: string; plan?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profileRes, subRes, invoiceRes] = await Promise.allSettled([
    supabase
      .from('profiles')
      .select('plan, plan_status, conversations_limit_monthly, conversations_used_this_month, voice_sessions_used_this_month, voice_sessions_limit_monthly')
      .eq('id', user.id)
      .single(),
    supabase
      .from('subscriptions')
      .select('plan, status, current_period_end, paystack_subscription_code')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('invoices')
      .select('id, amount, currency, status, created_at, paystack_reference')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const profile     = profileRes.status === 'fulfilled' ? profileRes.value.data : null
  const sub         = subRes.status     === 'fulfilled' ? subRes.value.data     : null
  const invoices    = invoiceRes.status === 'fulfilled' ? (invoiceRes.value.data ?? []) : []

  const currentPlan = profile?.plan ?? 'free'
  const planStatus  = profile?.plan_status ?? (currentPlan === 'free' ? 'free' : 'active')
  const isPaid      = currentPlan === 'grow' || currentPlan === 'business'
  const planLabel   = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)

  // Success banner params
  const justUpgraded = searchParams.upgraded === 'true'
  const upgradedPlan = searchParams.plan ?? currentPlan

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1
        className="font-poppins font-bold text-plum-dark text-2xl mb-6"
        style={{ letterSpacing: '-0.04em' }}
      >
        Billing
      </h1>

      {/* ── Success banner ── */}
      {justUpgraded && (
        <div className="bg-green-50 border border-green-200 rounded-3xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🎉</span>
          <div>
            <p className="font-inter font-semibold text-green-800 text-sm">
              Welcome to {upgradedPlan.charAt(0).toUpperCase() + upgradedPlan.slice(1)}! Your account has been upgraded.
            </p>
            <p className="font-inter text-xs text-green-700 mt-0.5">
              Your new voice and conversation limits are active immediately.
            </p>
          </div>
        </div>
      )}

      {/* ── Current plan card ── */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-inter text-xs text-muted uppercase tracking-wide mb-1">Current plan</p>
            <div className="flex items-center gap-2.5">
              <p className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>
                {planLabel}
              </p>
              <span className={`font-inter font-semibold text-xs px-2.5 py-1 rounded-full ${STATUS_STYLES[planStatus] ?? STATUS_STYLES.active}`}>
                {planStatus.replace('_', ' ')}
              </span>
            </div>
            {sub?.current_period_end && (
              <p className="font-inter text-xs text-muted mt-1">
                {planStatus === 'cancelled' ? 'Access until' : 'Renews'}{' '}
                {new Date(sub.current_period_end).toLocaleDateString('en-ZA', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Cancel button for paid users */}
          {isPaid && planStatus === 'active' && (
            <CancelButton />
          )}
        </div>

        {/* Usage meters */}
        {isPaid && (
          <div className="flex flex-col gap-3 pt-4 border-t border-mist">
            <p className="font-inter text-xs text-muted uppercase tracking-wide">Usage this month</p>
            {profile?.conversations_limit_monthly != null ? (
              <UsageBar
                used={profile.conversations_used_this_month ?? 0}
                total={profile.conversations_limit_monthly}
                label="Conversations"
              />
            ) : (
              <p className="font-inter text-sm text-green-700 font-semibold">✓ Unlimited conversations</p>
            )}
            {profile?.voice_sessions_limit_monthly != null && (
              <UsageBar
                used={profile.voice_sessions_used_this_month ?? 0}
                total={profile.voice_sessions_limit_monthly}
                label="Voice sessions"
              />
            )}
          </div>
        )}
      </div>

      {/* ── Upgrade cards — only shown when on free plan ── */}
      {!isPaid && (
        <section className="mb-8">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">
            Upgrade your plan
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {UPGRADE_PLANS.map(p => (
              <div
                key={p.key}
                className="relative flex flex-col bg-white rounded-3xl p-6 border shadow-card"
                style={{ border: p.featured ? '2px solid #4B2E83' : '1px solid #E8E1F7' }}
              >
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="font-inter font-semibold text-white text-xs px-3.5 py-1.5 rounded-full bg-plum-dark shadow-soft whitespace-nowrap">
                      ⭐ {p.badge}
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-poppins font-bold text-plum-dark text-xl mb-1" style={{ letterSpacing: '-0.03em' }}>
                    {p.name}
                  </h3>
                  <div className="flex items-end gap-1">
                    <span className="font-poppins font-bold text-plum-dark text-3xl" style={{ letterSpacing: '-0.04em' }}>
                      {p.price}
                    </span>
                    <span className="font-inter text-muted text-sm mb-1">{p.priceNote}</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {p.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2 font-inter text-sm text-muted">
                      <span style={{ color: '#FF6F9F' }} className="flex-shrink-0 mt-0.5">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <UpgradeButton plan={p.key} label={p.name} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Invoice history ── */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">
            Invoice history
          </h2>
          <div className="flex flex-col divide-y divide-mist">
            {(invoices as Array<{
              id: string
              amount: number
              currency: string
              status: string
              created_at: string
              paystack_reference: string | null
            }>).map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-3 gap-3">
                <div className="min-w-0">
                  <p className="font-inter text-sm text-ink">
                    {new Date(inv.created_at).toLocaleDateString('en-ZA', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  {inv.paystack_reference && (
                    <p className="font-inter text-xs text-muted truncate">{inv.paystack_reference}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${
                    inv.status === 'paid'   ? 'bg-green-100 text-green-700' :
                    inv.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {inv.status}
                  </span>
                  <p className="font-inter font-semibold text-ink text-sm">
                    {inv.currency ?? 'ZAR'} {(inv.amount / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
