import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const adminClient = getAdminClient()
    const { data, error } = await adminClient
      .from('quotes')
      .select('id, quote_text, author, category, source, is_active, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ quotes: data ?? [] })
  } catch (err) {
    console.error('[admin/quotes GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const adminClient = getAdminClient()
    const { data: role } = await adminClient
      .from('admin_roles').select('role').eq('user_id', user.id).single()
    if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { quote_text, author, category } =
      await req.json() as { quote_text: string; author?: string; category?: string }

    if (!quote_text?.trim()) {
      return NextResponse.json({ error: 'quote_text is required' }, { status: 400 })
    }

    const { data, error } = await adminClient
      .from('quotes')
      .insert({
        quote_text: quote_text.trim(),
        author:     author?.trim() || null,
        category:   category?.trim() || null,
        source:     'dane',
        is_active:  true,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[admin/quotes] Insert error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch (err) {
    console.error('[admin/quotes]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
