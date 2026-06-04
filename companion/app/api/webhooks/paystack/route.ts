import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendInvoicePaid } from '@/lib/email'
import crypto from 'crypto'

// Always use service role — webhook has no user session
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Plan limits applied when a charge succeeds
const PLAN_LIMITS: Record<string, {
  conversations_limit_monthly: number | null
  voice_sessions_limit_monthly: number
  voice_minutes_limit_daily: number
}> = {
  grow: {
    conversations_limit_monthly: null, // unlimited
    voice_sessions_limit_monthly: 6,
    voice_minutes_limit_daily: 20,
  },
  business: {
    conversations_limit_monthly: null, // unlimited
    voice_sessions_limit_monthly: 15,
    voice_minutes_limit_daily: 30,
  },
}

export async function POST(req: NextRequest) {
  try {
    const body      = await req.text()
    const signature = req.headers.get('x-paystack-signature')
    const secret    = process.env.PAYSTACK_SECRET_KEY

    // Verify HMAC-SHA512 signature
    if (secret && signature) {
      const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')
      if (hash !== signature) {
        console.warn('[paystack webhook] Invalid signature — rejecting')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body) as { event: string; data: Record<string, unknown> }
    const supabase = getServiceClient()

    console.log(`[paystack webhook] event: ${event.event}`)

    // ── charge.success ────────────────────────────────────────────────────────
    if (event.event === 'charge.success') {
      const data       = event.data
      const reference  = data.reference as string
      const amount     = data.amount as number
      const currency   = (data.currency as string) ?? 'ZAR'
      const customer   = data.customer as Record<string, string>
      const metadata   = (data.metadata ?? {}) as Record<string, string>

      // Prefer user_id from metadata (set by our subscribe route); fall back to email lookup
      let userId: string | null = metadata.user_id ?? null
      const userPlan: string    = metadata.plan ?? 'grow'

      if (!userId && customer.email) {
        // Look up user by email via the admin API — avoids any RLS issues
        const { data: authUsers } = await supabase.auth.admin.listUsers()
        const match = authUsers?.users?.find(u => u.email === customer.email)
        if (match) {
          userId = match.id
          console.log(`[paystack webhook] charge.success: resolved user by email: ${userId}`)
        }
      }

      if (!userId) {
        console.error('[paystack webhook] charge.success: could not identify user', { reference, email: customer.email })
        return NextResponse.json({ received: true }) // still 200 so Paystack doesn't retry
      }

      const limits = PLAN_LIMITS[userPlan]

      // Update profile — plan, plan_status, and voice/conversation limits
      await supabase.from('profiles').update({
        plan:                          userPlan,
        plan_status:                   'active',
        conversations_limit_monthly:   limits?.conversations_limit_monthly ?? null,
        voice_sessions_limit_monthly:  limits?.voice_sessions_limit_monthly ?? 6,
        voice_minutes_limit_daily:     limits?.voice_minutes_limit_daily ?? 20,
        updated_at:                    new Date().toISOString(),
      }).eq('id', userId)

      // Upsert subscription record
      const subscriptionData = data.subscription as Record<string, string> | null
      await supabase.from('subscriptions').upsert({
        user_id:                      userId,
        plan:                         userPlan,
        status:                       'active',
        paystack_subscription_code:   subscriptionData?.subscription_code ?? null,
        paystack_customer_code:       customer.customer_code ?? null,
        paystack_email_token:         subscriptionData?.email_token ?? null,
        current_period_start:         new Date().toISOString(),
        updated_at:                   new Date().toISOString(),
      }, { onConflict: 'user_id' })

      // Upsert invoice record
      await supabase.from('invoices').upsert({
        user_id:            userId,
        amount,
        currency,
        status:             'paid',
        paystack_reference: reference,
        paid_at:            new Date().toISOString(),
        updated_at:         new Date().toISOString(),
      }, { onConflict: 'paystack_reference' })

      // Send confirmation email
      if (customer.email) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single()

        const firstName     = profile?.full_name?.split(' ')[0] ?? 'there'
        const invoiceNumber = `REF-${reference.slice(0, 8).toUpperCase()}`
        const formatted     = `${currency} ${(amount / 100).toFixed(2)}`
        const planLabel     = userPlan.charAt(0).toUpperCase() + userPlan.slice(1)

        sendInvoicePaid(customer.email, firstName, invoiceNumber, formatted, planLabel)
          .catch(err => console.error('[email] sendInvoicePaid failed:', err))
      }

      console.log(`[paystack webhook] charge.success: user=${userId} plan=${userPlan} ref=${reference}`)
    }

    // ── subscription.disable ─────────────────────────────────────────────────
    else if (event.event === 'subscription.disable') {
      const subCode = (event.data.subscription_code ?? event.data.code) as string

      // Find which user owns this subscription
      const { data: subRecord } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('paystack_subscription_code', subCode)
        .single()

      if (subRecord?.user_id) {
        await supabase.from('profiles').update({
          plan:        'free',
          plan_status: 'cancelled',
          updated_at:  new Date().toISOString(),
        }).eq('id', subRecord.user_id)
      }

      await supabase.from('subscriptions').update({
        status:     'cancelled',
        updated_at: new Date().toISOString(),
      }).eq('paystack_subscription_code', subCode)

      console.log(`[paystack webhook] subscription.disable: code=${subCode}`)
    }

    // ── invoice.payment_failed ───────────────────────────────────────────────
    else if (event.event === 'invoice.payment_failed') {
      const sub = event.data.subscription as Record<string, string> | null
      if (sub?.subscription_code) {
        const { data: subRecord } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('paystack_subscription_code', sub.subscription_code)
          .single()

        if (subRecord?.user_id) {
          await supabase.from('profiles').update({
            plan_status: 'past_due',
            updated_at:  new Date().toISOString(),
          }).eq('id', subRecord.user_id)
        }

        await supabase.from('subscriptions').update({
          status:     'past_due',
          updated_at: new Date().toISOString(),
        }).eq('paystack_subscription_code', sub.subscription_code)
      }

      console.log(`[paystack webhook] invoice.payment_failed`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[paystack webhook] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
