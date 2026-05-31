import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: role } = await supabase.from('admin_roles').select('role').eq('user_id', user.id).single()
    if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Note: Anthropic API key should be retrieved from system_config and used here
    // Placeholder response until ANTHROPIC_API_KEY is configured
    const placeholderQuotes = [
      { body: 'Clarity comes not from having all the answers, but from asking better questions.', author: 'Companion by Danè', category: 'clarity' },
      { body: 'Self-trust is built in the small, honest moments between who you are and what you do.', author: 'Companion by Danè', category: 'self-trust' },
      { body: 'Your voice matters most in the moments you are most tempted to stay silent.', author: 'Companion by Danè', category: 'voice' },
    ]
    const quote = placeholderQuotes[Math.floor(Math.random() * placeholderQuotes.length)]

    const { data: saved, error } = await supabase
      .from('quotes')
      .insert({ ...quote, source: 'ai' })
      .select('id, body, author, category')
      .single()

    if (error) return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 })
    return NextResponse.json({ quote: saved })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
