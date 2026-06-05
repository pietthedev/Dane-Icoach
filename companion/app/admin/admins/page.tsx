import { createClient } from '@/lib/supabase/server'

interface AdminRole { id: string; user_id: string; role: string; notes: string | null; created_at: string }

const ROLE_STYLES: Record<string, string> = {
  super_admin: 'bg-accent/10 text-accent', admin: 'bg-plum/10 text-plum',
  support: 'bg-blue-100 text-blue-700', viewer: 'bg-mist text-muted',
}

const PERMISSIONS: Record<string, string[]> = {
  super_admin: ['Full access — all admin features, user management, billing, config'],
  admin: ['Clients, bookings, homework, quotes, announcements, voice'],
  support: ['Clients (read), bookings, homework'],
  viewer: ['Dashboard and client overview (read-only)'],
}

export default async function AdminAdminsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('admin_roles')
    .select('id, user_id, role, notes, created_at')
    .order('created_at')

  const admins: AdminRole[] = (data as AdminRole[]) ?? []

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Admin users</h1>
        <button className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
          + Invite admin
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {admins.map(a => (
          <div key={a.id} className="bg-white rounded-3xl p-5 border border-line shadow-card flex items-start justify-between gap-3">
            <div>
              <p className="font-inter font-semibold text-ink text-sm font-mono">{a.user_id}</p>
              {a.notes && <p className="font-inter text-xs text-muted">{a.notes}</p>}
              <p className="font-inter text-xs text-muted mt-0.5">{new Date(a.created_at).toLocaleDateString('en-ZA')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-inter font-semibold text-xs px-2.5 py-1 rounded-full ${ROLE_STYLES[a.role] ?? ROLE_STYLES.viewer}`}>{a.role.replace('_', ' ')}</span>
              <button className="font-inter text-xs text-red-500 hover:underline">Revoke</button>
            </div>
          </div>
        ))}
      </div>

      {/* Role reference */}
      <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Role permissions</h2>
        <div className="flex flex-col gap-3">
          {Object.entries(PERMISSIONS).map(([role, perms]) => (
            <div key={role}>
              <span className={`font-inter font-semibold text-xs px-2.5 py-1 rounded-full ${ROLE_STYLES[role] ?? ROLE_STYLES.viewer} mb-1.5 inline-block`}>{role.replace('_', ' ')}</span>
              {perms.map(p => <p key={p} className="font-inter text-xs text-muted ml-1">{p}</p>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
