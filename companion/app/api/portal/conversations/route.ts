import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at, conversation_ratings(rating, color_tag, notes)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ conversations: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { title } = await req.json() as { title?: string }

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: title ?? null })
      .select('id, title, created_at')
      .single()

    if (error) return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })

    // Send welcome email on first conversation
    const { count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count === 1) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, first_name')
        .eq('id', user.id)
        .single()

      const email = profile?.email ?? user.email
      const firstName = profile?.first_name ?? email?.split('@')[0] ?? 'there'

      if (email) {
        sendWelcomeEmail(email, firstName).catch(err =>
          console.error('[email] sendWelcomeEmail failed:', err)
        )
      }
    }

    return NextResponse.json({ conversation: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
