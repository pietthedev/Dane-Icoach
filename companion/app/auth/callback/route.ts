import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && sessionData.user) {
      // Use service role to bypass RLS when checking admin_roles
      const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data: adminRole } = await serviceClient
        .from('admin_roles')
        .select('user_id')
        .eq('user_id', sessionData.user.id)
        .single()

      const destination = next ?? (adminRole ? '/admin' : '/portal')
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`)
}
