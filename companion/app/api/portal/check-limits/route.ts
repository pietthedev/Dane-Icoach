import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        plan,
        conversations_limit_monthly,
        conversations_used_this_month,
        voice_sessions_used_this_month,
        voice_sessions_limit_monthly,
        voice_minutes_used_today,
        voice_minutes_limit_daily,
        voice_last_session_date
      `)
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const plan = (profile.plan ?? 'free') as string
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

    // ── Reset daily voice minutes if last session was on a previous day ──────
    let voiceMinutesUsedToday = profile.voice_minutes_used_today ?? 0
    const lastSessionDate = profile.voice_last_session_date as string | null

    if (lastSessionDate && lastSessionDate !== today) {
      voiceMinutesUsedToday = 0
      // Fire-and-forget reset — don't block the response
      supabase
        .from('profiles')
        .update({ voice_minutes_used_today: 0 })
        .eq('id', user.id)
        .then(() => {/* noop */})
    }

    // ── Resolved limits ──────────────────────────────────────────────────────
    const convUsed   = (profile.conversations_used_this_month ?? 0) as number
    const convLimit  = profile.conversations_limit_monthly as number | null   // null = unlimited
    const voiceSessUsed  = (profile.voice_sessions_used_this_month ?? 0) as number
    const voiceSessLimit = profile.voice_sessions_limit_monthly as number | null
    const voiceMinLimit  = profile.voice_minutes_limit_daily as number | null  // null = unlimited

    const minutesRemainingToday =
      voiceMinLimit != null ? Math.max(0, voiceMinLimit - voiceMinutesUsedToday) : null

    // ── can_start_text ───────────────────────────────────────────────────────
    const can_start_text = convLimit == null || convUsed < convLimit

    // ── can_start_voice ──────────────────────────────────────────────────────
    let can_start_voice = true

    if (plan === 'free') {
      // Free: 1 session per day — blocked if already had one today
      can_start_voice = lastSessionDate !== today
    } else {
      // Paid: check monthly session cap
      if (voiceSessLimit != null && voiceSessUsed >= voiceSessLimit) {
        can_start_voice = false
      }
      // Paid: check daily minutes cap
      if (voiceMinLimit != null && voiceMinutesUsedToday >= voiceMinLimit) {
        can_start_voice = false
      }
    }

    return NextResponse.json({
      plan,
      voice_sessions_used:       voiceSessUsed,
      voice_sessions_limit:      voiceSessLimit,
      voice_minutes_used_today:  voiceMinutesUsedToday,
      voice_minutes_limit_daily: voiceMinLimit,
      voice_last_session_date:   lastSessionDate,
      conversations_used:        convUsed,
      conversations_limit:       convLimit,
      can_start_voice,
      can_start_text,
      minutes_remaining_today:   minutesRemainingToday,
    })
  } catch (err) {
    console.error('[check-limits]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
