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

  const [ratingsRes, convsRes, goalsRes] = await Promise.allSettled([
    supabase.from('conversation_ratings').select('rating, color_tag').eq('user_id', user.id),
    supabase.from('conversations').select('id, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('goals').select('id, status').eq('user_id', user.id),
  ])

  const ratings = ratingsRes.status === 'fulfilled' ? (ratingsRes.value.data ?? []) : []
  const convs = convsRes.status === 'fulfilled' ? (convsRes.value.data ?? []) : []
  const goals = goalsRes.status === 'fulfilled' ? (goalsRes.value.data ?? []) : []

  // Fix: goals use 'achieved' not 'completed'
  const goalsAchieved = goals.filter((g: { status: string }) => g.status === 'achieved').length
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum: number, r: { rating: number | null }) => sum + (r.rating ?? 0), 0) / ratings.length).toFixed(1)
    : '—'

  const TAG_COLORS: Record<string, string> = {
    green: '#22c55e', blue: '#3b82f6', amber: '#f59e0b', red: '#ef4444', purple: '#a855f7'
  }

  const tagCounts = ratings.reduce((acc: Record<string, number>, r: { color_tag: string | null }) => {
    if (r.color_tag) acc[r.color_tag] = (acc[r.color_tag] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Insights</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatBox label="Total sessions" value={String(convs.length)} />
        <StatBox label="Goals achieved" value={String(goalsAchieved)} sub={`of ${goals.length} total`} />
        <StatBox label="Avg rating" value={String(avgRating)} sub="out of 5" />
        <StatBox label="Sessions rated" value={String(ratings.length)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Experience breakdown */}
        {ratings.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
            <h2 className="font-poppins font-bold text-plum-dark text-base mb-4" style={{ letterSpacing: '-0.03em' }}>Experience breakdown</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(TAG_COLORS).map(([tag, color]) => {
                const count = tagCounts[tag] ?? 0
                const pct = ratings.length > 0 ? (count / ratings.length) * 100 : 0
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

        {/* Recent conversations */}
        {convs.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
            <h2 className="font-poppins font-bold text-plum-dark text-base mb-4" style={{ letterSpacing: '-0.03em' }}>Sessions by month</h2>
            <div className="flex flex-col gap-2">
              {Object.entries(
                convs.reduce((acc: Record<string, number>, c: { created_at: string }) => {
                  const month = new Date(c.created_at).toLocaleString('en-ZA', { month: 'short', year: '2-digit' })
                  acc[month] = (acc[month] ?? 0) + 1
                  return acc
                }, {})
              ).slice(0, 6).map(([month, count]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="font-inter text-xs text-muted w-16">{month}</span>
                  <div className="flex-1 h-2 rounded-full bg-mist overflow-hidden">
                    <div className="h-full rounded-full bg-plum" style={{ width: `${Math.min((count / 10) * 100, 100)}%` }} />
                  </div>
                  <span className="font-inter text-xs text-muted w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}