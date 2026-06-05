import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const body = await req.json() as { duration_minutes?: number }
    const duration_minutes = typeof body.duration_minutes === 'number' ? body.duration_minutes : 0

    if (duration_minutes < 0) {
      return NextResponse.json({ error: 'duration_minutes must be >= 0' }, { status: 400 })
    }

    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

    const { data: profile } = await supabase
      .from('profiles')
      .select('voice_minutes_used_today, voice_sessions_used_this_month, voice_last_session_date')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // If last session was on a different day, today's running total starts from 0
    const lastSessionDate = profile.voice_last_session_date as string | null
    const currentMinutesToday =
      lastSessionDate === today ? ((profile.voice_minutes_used_today as number) ?? 0) : 0

    const { error } = await supabase
      .from('profiles')
      .update({
        voice_minutes_used_today:       currentMinutesToday + duration_minutes,
        voice_last_session_date:        today,
        voice_sessions_used_this_month: ((profile.voice_sessions_used_this_month as number) ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error('[end-voice-session] Update error:', error)
      return NextResponse.json({ error: 'Failed to update voice usage' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[end-voice-session]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
