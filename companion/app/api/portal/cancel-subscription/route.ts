import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch the active subscription record
    const { data: sub } = await serviceClient
      .from('subscriptions')
      .select('paystack_subscription_code, paystack_email_token')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // If we have a Paystack subscription code + email token, disable it via API
    if (sub?.paystack_subscription_code && sub?.paystack_email_token) {
      const cancelRes = await fetch('https://api.paystack.co/subscription/disable', {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code:  sub.paystack_subscription_code,
          token: sub.paystack_email_token,
        }),
      })

      const cancelData = await cancelRes.json()
      if (!cancelRes.ok) {
        console.error('[cancel-subscription] Paystack disable error:', cancelData)
        // Continue — we still update the DB so the user isn't stuck
      } else {
        console.log(`[cancel-subscription] Paystack sub disabled: ${sub.paystack_subscription_code}`)
      }
    }

    // Always update the DB — even if Paystack call was skipped (e.g. manual one-time payment)
    await serviceClient.from('subscriptions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('status', 'active')

    await serviceClient.from('profiles')
      .update({
        plan:                         'free',
        plan_status:                  'cancelled',
        conversations_limit_monthly:  5,
        voice_sessions_limit_monthly: null,
        voice_minutes_limit_daily:    3,
        updated_at:                   new Date().toISOString(),
      })
      .eq('id', user.id)

    console.log(`[cancel-subscription] Cancelled for user=${user.id}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[cancel-subscription]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
