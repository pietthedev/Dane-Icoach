import { createClient } from '@/lib/supabase/server'

interface LoginEvent {
  id: string
  created_at: string
  device: string | null
  location: string | null
  success: boolean
}

export default async function SecurityPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: history } = await supabase
    .from('login_history')
    .select('id, created_at, device, location, success')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const loginHistory: LoginEvent[] = (history as LoginEvent[]) ?? []

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Security</h1>

      {/* Password */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card mb-5">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Password</h2>
        <p className="font-inter text-sm text-muted mb-4">Change your password to keep your account secure.</p>
        <a href="/auth/reset" className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft inline-block">
          Change password
        </a>
      </div>

      {/* Email */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card mb-5">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Account email</h2>
        <p className="font-inter text-sm text-ink font-medium">{user.email}</p>
        <p className="font-inter text-xs text-muted mt-1">To change your email, contact support at <a href="mailto:dane@companionai.coach" className="underline text-plum">dane@companionai.coach</a></p>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card mb-5">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Two-factor authentication</h2>
        <p className="font-inter text-sm text-muted mb-4">Add an extra layer of security to your account using an authenticator app.</p>
        <button className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
          Enable 2FA
        </button>
      </div>

      {/* Login history */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-4">Recent login history</h2>
        {loginHistory.length === 0 ? (
          <p className="font-inter text-sm text-muted">No login history available</p>
        ) : (
          <div className="flex flex-col divide-y divide-mist">
            {loginHistory.map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 gap-3">
                <div>
                  <p className="font-inter text-sm text-ink">{l.device ?? 'Unknown device'}</p>
                  <p className="font-inter text-xs text-muted">{l.location ?? 'Unknown location'} · {new Date(l.created_at).toLocaleString('en-ZA')}</p>
                </div>
                <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${l.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {l.success ? 'Success' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
