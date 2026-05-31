import { createClient } from '@/lib/supabase/server'

interface Homework {
  id: string
  title: string
  instructions: string | null
  due_date: string | null
  status: string
  resources: string[] | null
  feedback: string | null
  feedback_at: string | null
}

export default async function HomeworkPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('homework')
    .select('id, title, instructions, due_date, status, resources, feedback, feedback_at')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true, nullsFirst: false })

  const pending = (data ?? []).filter((h: Homework) => h.status === 'pending')
  const submitted = (data ?? []).filter((h: Homework) => h.status === 'submitted' || h.status === 'completed')

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-1" style={{ letterSpacing: '-0.04em' }}>Homework</h1>
      <p className="font-inter text-muted text-sm mb-6">Assignments from Danè — complete and submit through your journal</p>

      {/* Pending */}
      <section className="mb-8">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">
          Pending <span className="text-accent">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-line text-center">
            <p className="font-inter text-muted text-sm">No pending homework — you&apos;re all caught up! 🎉</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((h: Homework) => (
              <div key={h.id} className="bg-white rounded-3xl p-5 border border-line shadow-card">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-inter font-semibold text-ink text-base">{h.title}</h3>
                  {h.due_date && (
                    <span className={`font-inter text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${new Date(h.due_date) < new Date() ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      Due {new Date(h.due_date).toLocaleDateString('en-ZA')}
                    </span>
                  )}
                </div>
                {h.instructions && <p className="font-inter text-sm text-muted leading-relaxed mb-3">{h.instructions}</p>}
                {h.resources && h.resources.length > 0 && (
                  <div className="mb-3">
                    <p className="font-inter font-semibold text-xs text-plum-dark mb-1.5">Resources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {h.resources.map((r, i) => <a key={i} href={r} target="_blank" rel="noopener noreferrer" className="font-inter text-xs text-plum underline">{r}</a>)}
                    </div>
                  </div>
                )}
                <a href={`/portal/journal?homework_id=${h.id}`}
                  className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft inline-block">
                  Submit in journal
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      {submitted.length > 0 && (
        <section>
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Completed</h2>
          <div className="flex flex-col gap-3">
            {submitted.map((h: Homework) => (
              <div key={h.id} className="bg-white rounded-3xl p-5 border border-line">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-inter font-semibold text-ink text-sm">{h.title}</h3>
                  <span className="font-inter text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700">Completed</span>
                </div>
                {h.feedback && (
                  <div className="mt-3 bg-mist rounded-2xl px-4 py-3">
                    <p className="font-inter font-semibold text-xs text-plum-dark mb-1">Danè&apos;s feedback</p>
                    <p className="font-inter text-sm text-ink leading-relaxed">{h.feedback}</p>
                    {h.feedback_at && <p className="font-inter text-xs text-muted mt-1">{new Date(h.feedback_at).toLocaleDateString('en-ZA')}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
