import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/portal/PortalShell'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url, plan')
    .eq('id', user.id)
    .single()

  return (
    <PortalShell user={user} profile={profile}>
      {children}
    </PortalShell>
  )
}
