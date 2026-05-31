import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: roleData } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!roleData) redirect('/portal')

  return (
    <AdminShell user={user} role={roleData.role}>
      {children}
    </AdminShell>
  )
}
