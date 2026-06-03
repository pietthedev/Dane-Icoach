import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [profileRes, convsRes, bookingsRes, hwRes, notesRes] = await Promise.allSettled([
    supabase.from('profiles').select('*').eq('id', params.id).single(),
    supabase
      .from('conversations')
      .select('id, title, created_at, mode, conversation_ratings(rating, color_tag), conversation_summaries(summary, key_topics)')
      .eq('user_id', params.id)
      .eq('shared_with_coach', true)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('bookings')
      .select('id, scheduled_at, title, status')
      .eq('user_id', params.id)
      .order('scheduled_at', { ascending: false })
      .limit(10),
    supabase
      .from('homework')
      .select('id, title, status, due_date')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('admin_client_notes')
      .select('id, body, created_at')
      .eq('client_id', params.id)
      .order('created_at', { ascending: false }),
  ])

  const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
  if (!profile) notFound()

  const conversations = convsRes.status === 'fulfilled' ? (convsRes.value.data ?? []) : []
  const bookings = bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data ?? []) : []
  const homework = hwRes.status === 'fulfilled' ? (hwRes.value.data ?? []) : []
  const notes = notesRes.status === 'fulfilled' ? (notesRes.value.data ?? []) : []

  const displayName = profile.full_name ?? profile.email ?? params.id

  const TAG_STYLES: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
  }

  const TAG_LABELS: Record<string, string> = {
    green: 'Great', blue: 'Good', amber: 'Okay', red: 'Poor', purple: 'Insight',
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/clients" className="font-inter text-xs text-muted hover:text-plum mb-2 block">
            ← All clients
          </Link>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>
            {displayName}
          </h1>
          <p className="font-inter text-muted text-sm">{profile.email}</p>
        </div>
        <span className="font-inter text-xs px-3 py-1.5 rounded-full bg-mist text-plum font-semibold capitalize">
          {profile.plan ?? 'start'}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Profile</h2>
          <div className="flex flex-col gap-2 font-inter text-sm">
            {[
              ['Phone', profile.phone],
              ['Timezone', profile.timezone],
              ['Language', profile.language_preference],
              ['Joined', profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-ZA') : '—'],
              ['Last active', profile.last_active_at ? new Date(profile.last_active_at).toLocaleDateString('en-ZA') : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-muted">{k}</span>
                <span className="text-ink font-medium text-right">{v ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shared conversations */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-line shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide">
              Shared conversations ({conversations.length})
            </h2>
            <span className="font-inter text-xs text-muted bg-mist px-2.5 py-1 rounded-full">
              Client chose to share these
            </span>
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-6">
              <p className="font-inter text-sm text-muted">No shared conversations yet.</p>
              <p className="font-inter text-xs text-muted mt-1">The client can share conversations from their portal.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {conversations.map((c: Record<string, unknown>) => {
                const rating = (c.conversation_ratings as Record<string, unknown>[])?.[0]
                const summaryObj = (c.conversation_summaries as Record<string, unknown>[])?.[0]
                const colorTag = rating?.color_tag as string | null
                const topics = summaryObj?.key_topics as string[] | null

                return (
                  <div key={c.id as string} className="border border-line rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-inter font-medium text-ink text-sm">
                        {(c.title as string) ?? 'Conversation'}
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {c.mode && (
                          <span className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-mist text-muted capitalize">
                            {c.mode as string}
                          </span>
                        )}
                        {colorTag && (
                          <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full ${TAG_STYLES[colorTag]}`}>
                            {TAG_LABELS[colorTag]}
                          </span>
                        )}
                        {rating?.rating && (
                          <span className="font-inter text-xs text-yellow-500">
                            {'★'.repeat(rating.rating as number)}{'☆'.repeat(5 - (rating.rating as number))}
                          </span>
                        )}
                      </div>
                    </div>

                    {summaryObj?.summary && (
                      <p className="font-inter text-xs text-muted leading-relaxed mb-2">
                        {summaryObj.summary as string}
                      </p>
                    )}

                    {topics && topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {topics.map((t: string, i: number) => (
                          <span key={i} className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-plum/10 text-plum">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="font-inter text-[10px] text-muted mt-2">
                      {new Date(c.created_at as string).toLocaleString('en-ZA')}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Bookings</h2>
          {bookings.length === 0 ? (
            <p className="font-inter text-sm text-muted">None yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {bookings.map((b: Record<string, string>) => (
                <div key={b.id} className="flex items-center justify-between py-1.5 border-b border-mist last:border-0">
                  <div>
                    <p className="font-inter text-xs text-ink">{b.title ?? 'Session'}</p>
                    <p className="font-inter text-[10px] text-muted">
                      {new Date(b.scheduled_at).toLocaleDateString('en-ZA')}
                    </p>
                  </div>
                  <span className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-mist text-muted">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Homework */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Homework</h2>
          {homework.length === 0 ? (
            <p className="font-inter text-sm text-muted">None assigned</p>
          ) : (
            <div className="flex flex-col gap-1">
              {homework.map((h: Record<string, string>) => (
                <div key={h.id} className="flex items-center justify-between py-1.5 border-b border-mist last:border-0">
                  <p className="font-inter text-xs text-ink truncate">{h.title}</p>
                  <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                    h.status === 'submitted' || h.status === 'reviewed'
                      ? 'bg-green-100 text-green-700'
                      : h.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin notes */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-1">
            My notes on this client
          </h2>
          <p className="font-inter text-xs text-muted mb-3">These notes are private to you and never shown to the client.</p>
          {notes.length === 0 ? (
            <p className="font-inter text-sm text-muted">No notes yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {notes.map((n: Record<string, string>) => (
                <div key={n.id} className="bg-mist rounded-2xl px-4 py-3">
                  <p className="font-inter text-sm text-ink">{n.body}</p>
                  <p className="font-inter text-xs text-muted mt-1">
                    {new Date(n.created_at).toLocaleDateString('en-ZA')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
