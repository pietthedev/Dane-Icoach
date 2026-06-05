import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
