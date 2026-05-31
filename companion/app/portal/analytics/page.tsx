import { createClient } from '@/lib/supabase/server'

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
      <p className="font-inter text-xs text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>{value}</p>
      {sub && <p className="font-inter text-xs text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

export default async function AnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [feedbackRes, usageHistRes, goalsRes] = await Promise.allSettled([
    supabase.from('ai_feedback_context').select('*').eq('user_id', user.id).single(),
    supabase.from('usage').select('period_start, conversations_used, tokens_used, voice_minutes_used').eq('user_id', user.id).order('period_start', { ascending: false }).limit(6),
    supabase.from('goals').select('id, status', { count: 'exact', head: false }).eq('user_id', user.id),
  ])

  const feedback = feedbackRes.status === 'fulfilled' ? feedbackRes.value.data : null
  const usageHistory = usageHistRes.status === 'fulfilled' ? (usageHistRes.value.data ?? []) : []
  const goals = goalsRes.status === 'fulfilled' ? (goalsRes.value.data ?? []) : []

  const goalsAchieved = goals.filter((g: { status: string }) => g.status === 'completed').length
  const totalSessions = usageHistory.reduce((sum: number, u: { conversations_used: number }) => sum + (u.conversations_used ?? 0), 0)

  const TAG_COLORS: Record<string, string> = {
    green: '#22c55e', blue: '#3b82f6', amber: '#f59e0b', red: '#ef4444', purple: '#a855f7'
  }

  const breakdown = feedback && typeof feedback === 'object' ? (feedback as Record<string, unknown>) : {}

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Insights</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatBox label="Total sessions" value={String(totalSessions)} />
        <StatBox label="Goals achieved" value={String(goalsAchieved)} sub={`of ${goals.length} total`} />
        <StatBox label="Avg rating" value={feedback && 'avg_rating' in feedback ? String((feedback as Record<string, unknown>).avg_rating) : '—'} sub="out of 5" />
        <StatBox label="Voice minutes" value={String(usageHistory[0]?.voice_minutes_used ?? 0)} sub="this month" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Experience breakdown */}
        {Object.keys(TAG_COLORS).some(k => `${k}_count` in breakdown) && (
          <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
            <h2 className="font-poppins font-bold text-plum-dark text-base mb-4" style={{ letterSpacing: '-0.03em' }}>Experience breakdown</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(TAG_COLORS).map(([tag, color]) => {
                const count = Number((breakdown as Record<string, unknown>)[`${tag}_count`] ?? 0)
                const pct = totalSessions > 0 ? (count / totalSessions) * 100 : 0
                return (
                  <div key={tag} className="flex items-center gap-3">
                    <span className="font-inter text-xs capitalize w-14 text-muted">{tag}</span>
                    <div className="flex-1 h-2 rounded-full bg-mist overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="font-inter text-xs text-muted w-6 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Usage history */}
        {usageHistory.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
            <h2 className="font-poppins font-bold text-plum-dark text-base mb-4" style={{ letterSpacing: '-0.03em' }}>Sessions by month</h2>
            <div className="flex flex-col gap-2">
              {usageHistory.map((u: { period_start: string; conversations_used: number }) => (
                <div key={u.period_start} className="flex items-center gap-3">
                  <span className="font-inter text-xs text-muted w-16">
                    {new Date(u.period_start).toLocaleString('en-ZA', { month: 'short', year: '2-digit' })}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-mist overflow-hidden">
                    <div className="h-full rounded-full bg-plum" style={{ width: `${Math.min((u.conversations_used / 30) * 100, 100)}%` }} />
                  </div>
                  <span className="font-inter text-xs text-muted w-5 text-right">{u.conversations_used}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI personalisation context */}
        {feedback && 'context_summary' in feedback && (
          <div className="md:col-span-2 rounded-3xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #2E1A47 0%, #4B2E83 100%)' }}>
            <h2 className="font-poppins font-bold text-base mb-2" style={{ letterSpacing: '-0.03em' }}>AI personalisation context</h2>
            <p className="font-inter text-sm opacity-80 leading-relaxed">{String((feedback as Record<string, unknown>).context_summary)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
