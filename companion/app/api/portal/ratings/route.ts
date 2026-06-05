import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const body = await req.json() as { conversation_id?: string; rating?: number; color_tag?: string }
    const { conversation_id, rating, color_tag } = body

    if (!conversation_id) return NextResponse.json({ error: 'conversation_id required' }, { status: 400 })

    // Verify ownership
    const { data: conv } = await supabase.from('conversations').select('id').eq('id', conversation_id).eq('user_id', user.id).single()
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await supabase.from('conversation_ratings').upsert(
      { conversation_id, user_id: user.id, rating: rating ?? null, color_tag: color_tag ?? null, updated_at: new Date().toISOString() },
      { onConflict: 'conversation_id' }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
