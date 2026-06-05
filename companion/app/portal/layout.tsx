import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import PortalShell from '@/components/portal/PortalShell'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [profileRes, adminRes] = await Promise.allSettled([
    supabase
      .from('profiles')
      .select('full_name, avatar_url, plan')
      .eq('id', user.id)
      .single(),
    createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single(),
  ])

  const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
  const isAdmin = adminRes.status === 'fulfilled' && adminRes.value.data != null

  return (
    <PortalShell user={user} profile={profile} isAdmin={isAdmin}>
      {children}
    </PortalShell>
  )
}
