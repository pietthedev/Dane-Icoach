import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [profileRes, convsRes, bookingsRes, hwRes, notesRes] = await Promise.allSettled([
    supabase.from('profiles').select('*').eq('id', params.id).single(),
    supabase.from('conversations').select('id, title, created_at, conversation_ratings(rating, color_tag)').eq('user_id', params.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('bookings').select('id, scheduled_at, session_type, status').eq('user_id', params.id).order('scheduled_at', { ascending: false }).limit(10),
    supabase.from('homework').select('id, title, status, due_date').eq('user_id', params.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('admin_client_notes').select('id, body, created_at').eq('client_id', params.id).order('created_at', { ascending: false }),
  ])

  const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
  if (!profile) notFound()

  const conversations = convsRes.status === 'fulfilled' ? (convsRes.value.data ?? []) : []
  const bookings = bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data ?? []) : []
  const homework = hwRes.status === 'fulfilled' ? (hwRes.value.data ?? []) : []
  const notes = notesRes.status === 'fulfilled' ? (notesRes.value.data ?? []) : []

  const displayName = profile.first_name ? `${profile.first_name} ${profile.last_name ?? ''}`.trim() : profile.email ?? params.id

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/clients" className="font-inter text-xs text-muted hover:text-plum mb-2 block">← All clients</Link>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>{displayName}</h1>
          <p className="font-inter text-muted text-sm">{profile.email}</p>
        </div>
        <div className="flex gap-2">
          <span className="font-inter text-xs px-3 py-1.5 rounded-full bg-mist text-plum font-semibold capitalize">{profile.plan ?? 'start'}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Profile</h2>
          <div className="flex flex-col gap-2 font-inter text-sm">
            {[['Phone', profile.phone], ['Timezone', profile.timezone], ['Language', profile.language_preference], ['Joined', profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-ZA') : '—']].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-muted">{k}</span>
                <span className="text-ink font-medium text-right">{v ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">
            Conversations ({conversations.length})
          </h2>
          {conversations.length === 0 ? <p className="font-inter text-sm text-muted">None yet</p> : (
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {conversations.map((c: Record<string, unknown>) => (
                <div key={c.id as string} className="flex items-center justify-between py-1.5 border-b border-mist last:border-0">
                  <p className="font-inter text-sm text-ink truncate">{(c.title as string) ?? 'Conversation'}</p>
                  <p className="font-inter text-xs text-muted flex-shrink-0">{new Date(c.created_at as string).toLocaleDateString('en-ZA')}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Bookings</h2>
          {bookings.length === 0 ? <p className="font-inter text-sm text-muted">None yet</p> : (
            <div className="flex flex-col gap-1">
              {bookings.map((b: Record<string, string>) => (
                <div key={b.id} className="flex items-center justify-between py-1.5 border-b border-mist last:border-0">
                  <p className="font-inter text-xs text-ink">{new Date(b.scheduled_at).toLocaleDateString('en-ZA')}</p>
                  <span className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-mist text-muted">{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Homework */}
        <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Homework</h2>
          {homework.length === 0 ? <p className="font-inter text-sm text-muted">None assigned</p> : (
            <div className="flex flex-col gap-1">
              {homework.map((h: Record<string, string>) => (
                <div key={h.id} className="flex items-center justify-between py-1.5 border-b border-mist last:border-0">
                  <p className="font-inter text-xs text-ink truncate">{h.title}</p>
                  <span className={`font-inter text-[10px] px-2 py-0.5 rounded-full ${h.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{h.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin notes */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-line shadow-card">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Admin notes</h2>
          {notes.length === 0 ? <p className="font-inter text-sm text-muted">No notes yet</p> : (
            <div className="flex flex-col gap-2">
              {notes.map((n: Record<string, string>) => (
                <div key={n.id} className="bg-mist rounded-2xl px-4 py-3">
                  <p className="font-inter text-sm text-ink">{n.body}</p>
                  <p className="font-inter text-xs text-muted mt-1">{new Date(n.created_at).toLocaleDateString('en-ZA')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
