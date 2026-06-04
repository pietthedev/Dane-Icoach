import { createClient as createServiceClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ConversationCard, { type Message } from './ConversationCard'

// Service-role client — bypasses RLS for all admin reads
function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = getAdminClient()

  // ── Step 1: fetch everything except messages in parallel ──────────────────
  const [profileRes, convsRes, bookingsRes, hwRes, notesRes] = await Promise.allSettled([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('conversations')
      .select(`
        id, title, created_at, mode,
        conversation_ratings ( rating, color_tag ),
        conversation_summaries ( summary, key_topics )
      `)
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
  const bookings      = bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data ?? []) : []
  const homework      = hwRes.status === 'fulfilled' ? (hwRes.value.data ?? []) : []
  const notes         = notesRes.status === 'fulfilled' ? (notesRes.value.data ?? []) : []

  // ── Step 2: batch-fetch all messages for shared conversations ─────────────
  const convIds = conversations.map((c: Record<string, unknown>) => c.id as string)

  const messagesByConvId = new Map<string, Message[]>()

  if (convIds.length > 0) {
    const { data: allMessages } = await supabase
      .from('messages')
      .select('id, conversation_id, role, content, created_at')
      .in('conversation_id', convIds)
      .order('created_at', { ascending: true })

    for (const msg of allMessages ?? []) {
      const list = messagesByConvId.get(msg.conversation_id) ?? []
      list.push({ id: msg.id, role: msg.role, content: msg.content, created_at: msg.created_at })
      messagesByConvId.set(msg.conversation_id, list)
    }
  }

  const displayName = profile.full_name ?? profile.email ?? params.id

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
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

        {/* ── Profile ── */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Profile</h2>
          <div className="flex flex-col gap-2 font-inter text-sm">
            {([
              ['Phone',       profile.phone],
              ['Timezone',    profile.timezone],
              ['Language',    profile.language_preference],
              ['Joined',      profile.created_at     ? new Date(profile.created_at).toLocaleDateString('en-ZA')     : '—'],
              ['Last active', profile.last_active_at ? new Date(profile.last_active_at).toLocaleDateString('en-ZA') : '—'],
            ] as [string, string | null][]).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-muted">{k}</span>
                <span className="text-ink font-medium text-right">{v ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Shared conversations ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-line shadow-card">
          <div className="flex items-center justify-between mb-4">
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
              <p className="font-inter text-xs text-muted mt-1">
                The client can share conversations from their portal.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {conversations.map((c: Record<string, unknown>) => {
                const ratingRow   = (c.conversation_ratings  as Record<string, unknown>[])?.[0]
                const summaryRow  = (c.conversation_summaries as Record<string, unknown>[])?.[0]

                return (
                  <ConversationCard
                    key={c.id as string}
                    id={c.id as string}
                    title={(c.title as string) ?? null}
                    mode={(c.mode as string) ?? null}
                    created_at={c.created_at as string}
                    colorTag={(ratingRow?.color_tag as string) ?? null}
                    starRating={ratingRow?.rating != null ? Math.round(ratingRow.rating as number) : null}
                    summary={(summaryRow?.summary as string) ?? null}
                    keyTopics={(summaryRow?.key_topics as string[]) ?? []}
                    messages={messagesByConvId.get(c.id as string) ?? []}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* ── Bookings ── */}
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

        {/* ── Homework ── */}
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

        {/* ── Admin notes ── */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-1">
            My notes on this client
          </h2>
          <p className="font-inter text-xs text-muted mb-3">
            These notes are private to you and never shown to the client.
          </p>
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
