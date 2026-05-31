import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function PATCH(req: NextRequest) {
  try {
    // 1. Authenticate the requesting user
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // 2. Verify super_admin role using the service role key
    //    (bypasses RLS so we can reliably read admin_roles)
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: roleData } = await adminClient
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!roleData || roleData.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden — super_admin role required' },
        { status: 403 }
      )
    }

    // 3. Parse and validate body
    const body = await req.json() as { key?: string; value?: string }
    const { key, value } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'key is required' }, { status: 400 })
    }
    if (value === undefined || value === null) {
      return NextResponse.json({ error: 'value is required' }, { status: 400 })
    }

    // 4. Update the row (using admin client so RLS doesn't block the write)
    const { error: updateError } = await adminClient
      .from('system_config')
      .update({ value: String(value) })
      .eq('key', key)

    if (updateError) {
      console.error('[admin/config] update error:', updateError.message)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/config] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
