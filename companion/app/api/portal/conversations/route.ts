import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'
import { sendNotification } from '@/lib/notifications'

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

    // ── Plan limit check ───────────────────────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, conversations_limit_monthly, conversations_used_this_month, full_name')
      .eq('id', user.id)
      .single()

    const plan      = profile?.plan ?? 'free'
    const convLimit = profile?.conversations_limit_monthly as number | null
    const convUsed  = (profile?.conversations_used_this_month as number) ?? 0

    if (convLimit != null && convUsed >= convLimit) {
      return NextResponse.json(
        {
          error: plan === 'free'
            ? "You've had 5 great conversations this month. Upgrade to Growth for unlimited conversations."
            : 'Monthly conversation limit reached.',
          code: 'CONVERSATION_LIMIT_REACHED',
        },
        { status: 403 }
      )
    }

    const { title, mode } = await req.json() as { title?: string; mode?: string }

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: title ?? 'New conversation', mode: mode ?? 'text' })
      .select('id, title, created_at')
      .single()

    if (error) {
      console.error('[conversations] Insert error:', error)
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }

    // ── Increment conversations_used_this_month ────────────────────────────
    const newUsed = convUsed + 1
    await supabase
      .from('profiles')
      .update({ conversations_used_this_month: newUsed })
      .eq('id', user.id)

    // ── Notify at 80% of limit (free plan = 4 of 5) ───────────────────────
    if (convLimit != null && newUsed / convLimit >= 0.8 && newUsed < convLimit) {
      const remaining = convLimit - newUsed
      sendNotification({
        userId:  user.id,
        title:   `${remaining} conversation${remaining === 1 ? '' : 's'} left this month`,
        message: `You've used ${newUsed} of your ${convLimit} conversations. Upgrade to Growth for unlimited access.`,
        url:     `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/portal/billing`,
        type:    'token_limit_warning',
      }).catch(console.error)
    }

    // ── Welcome email on first conversation ────────────────────────────────
    const { count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count === 1) {
      const email     = user.email
      const firstName = profile?.full_name?.split(' ')[0] ?? email?.split('@')[0] ?? 'there'
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