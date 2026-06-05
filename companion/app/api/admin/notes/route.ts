import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // Verify the caller is an authenticated admin
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check admin_roles
    const { data: role } = await serviceClient
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { client_id, body } = await req.json() as { client_id?: string; body?: string }

    if (!client_id || !body?.trim()) {
      return NextResponse.json({ error: 'client_id and body are required' }, { status: 400 })
    }

    const { data, error } = await serviceClient
      .from('admin_client_notes')
      .insert({ client_id, body: body.trim() })
      .select('id, body, created_at')
      .single()

    if (error) {
      console.error('[admin/notes] Insert error code:', error.code)
      console.error('[admin/notes] Insert error message:', error.message)
      console.error('[admin/notes] Insert error details:', error.details)
      return NextResponse.json({ error: error.message ?? 'Failed to save note' }, { status: 500 })
    }

    return NextResponse.json({ note: data })
  } catch (err) {
    console.error('[admin/notes]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
