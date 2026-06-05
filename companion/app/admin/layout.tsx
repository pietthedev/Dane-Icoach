import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check admin role and fetch admin profile in parallel
  const [roleRes, adminProfileRes] = await Promise.allSettled([
    adminClient
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single(),
    adminClient
      .from('admin_profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single(),
  ])

  const roleData        = roleRes.status === 'fulfilled' ? roleRes.value.data : null
  const adminProfile    = adminProfileRes.status === 'fulfilled' ? adminProfileRes.value.data : null

  if (!roleData) redirect('/portal')

  return (
    <AdminShell
      user={user}
      role={roleData.role}
      adminName={adminProfile?.full_name ?? null}
      adminAvatarUrl={adminProfile?.avatar_url ?? null}
    >
      {children}
    </AdminShell>
  )
}
