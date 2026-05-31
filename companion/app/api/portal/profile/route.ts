import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_FIELDS = [
  'first_name', 'last_name', 'phone', 'timezone', 'language_preference',
  'pref_learn_ratings', 'pref_auto_summarise', 'pref_cross_session',
  'pref_email_digest', 'pref_quote_of_day', 'popi_marketing', 'popi_data_training',
]

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    return NextResponse.json({ profile: profile ?? null })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const body = await req.json() as Record<string, unknown>

    // Only allow whitelisted fields
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const key of ALLOWED_FIELDS) {
      if (key in body) updates[key] = body[key]
    }

    await supabase.from('profiles').upsert({ id: user.id, ...updates })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
