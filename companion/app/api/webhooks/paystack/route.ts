import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendInvoicePaid } from '@/lib/email'
import { sendNotification } from '@/lib/notifications'
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
    conversations_limit_monthly:  null, // unlimited
    voice_sessions_limit_monthly: 6,
    voice_minutes_limit_daily:    20,
  },
  business: {
    conversations_limit_monthly:  null, // unlimited
    voice_sessions_limit_monthly: 15,
    voice_minutes_limit_daily:    30,
  },
}

// Map Paystack plan codes → our plan keys
function planFromCode(planCode: string | null | undefined): string | null {
  if (!planCode) return null
  if (planCode === process.env.PAYSTACK_GROW_PLAN_CODE)     return 'grow'
  if (planCode === process.env.PAYSTACK_BUSINESS_PLAN_CODE) return 'business'
  return null
}

// Resolve a Supabase user ID from customer email or stored customer code
async function resolveUserId(
  supabase: ReturnType<typeof getServiceClient>,
  email: string | null | undefined,
  customerCode: string | null | undefined
): Promise<string | null> {
  // 1. Check subscriptions table by customer code (fastest, no email needed)
  if (customerCode) {
    const { data } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('paystack_customer_code', customerCode)
      .single()
    if (data?.user_id) return data.user_id
  }

  // 2. Fall back to email lookup via auth admin API
  if (email) {
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const match = authUsers?.users?.find(u => u.email === email)
    if (match?.id) return match.id
  }

  return null
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

    const event    = JSON.parse(body) as { event: string; data: Record<string, unknown> }
    const supabase = getServiceClient()

    console.log(`[paystack webhook] event: ${event.event}`)

    // ── subscription.create ───────────────────────────────────────────────────
    // Fired when Paystack creates a recurring subscription after the first charge.
    // This is where we capture subscription_code and email_token for future cancellation.
    if (event.event === 'subscription.create') {
      const data             = event.data
      const subscriptionCode = data.subscription_code as string
      const emailToken       = data.email_token       as string
      const nextPaymentDate  = data.next_payment_date as string | null
      const customer         = data.customer as Record<string, string> | null
      const planObj          = data.plan     as Record<string, unknown> | null
      const planCode         = planObj?.plan_code as string | undefined
      const userPlan         = planFromCode(planCode)

      const userId = await resolveUserId(supabase, customer?.email, customer?.customer_code)

      if (!userId) {
        console.error('[paystack webhook] subscription.create: could not resolve user', {
          email: customer?.email,
          customerCode: customer?.customer_code,
        })
        return NextResponse.json({ received: true })
      }

      // Store the subscription code and email token — needed for cancellation
      await supabase.from('subscriptions').upsert({
        user_id:                    userId,
        plan:                       userPlan ?? 'grow',
        status:                     'active',
        paystack_subscription_code: subscriptionCode,
        paystack_customer_code:     customer?.customer_code ?? null,
        paystack_email_token:       emailToken,
        current_period_end:         nextPaymentDate ?? null,
        updated_at:                 new Date().toISOString(),
      }, { onConflict: 'user_id' })

      console.log(`[paystack webhook] subscription.create: user=${userId} code=${subscriptionCode} next=${nextPaymentDate}`)
    }

    // ── charge.success ────────────────────────────────────────────────────────
    // Fired for both initial and recurring payments.
    else if (event.event === 'charge.success') {
      const data      = event.data
      const reference = data.reference as string
      const amount    = data.amount    as number
      const currency  = (data.currency as string) ?? 'ZAR'
      const customer  = data.customer  as Record<string, string>
      const metadata  = (data.metadata ?? {}) as Record<string, string>

      // For recurring charges, metadata is absent — use plan object from charge data
      const planObj    = data.plan as Record<string, unknown> | null
      const planCode   = planObj?.plan_code as string | undefined
      const planByCode = planFromCode(planCode)

      // user_id in metadata (initial payment) takes priority; fall back to customer lookup
      let userId: string | null = metadata.user_id ?? null
      const userPlan: string    = metadata.plan ?? planByCode ?? 'grow'

      if (!userId) {
        userId = await resolveUserId(supabase, customer.email, customer.customer_code)
      }

      if (!userId) {
        console.error('[paystack webhook] charge.success: could not identify user', {
          reference, email: customer.email,
        })
        return NextResponse.json({ received: true })
      }

      const limits = PLAN_LIMITS[userPlan]

      // Update profile plan and limits
      await supabase.from('profiles').update({
        plan:                         userPlan,
        plan_status:                  'active',
        conversations_limit_monthly:  limits?.conversations_limit_monthly  ?? null,
        voice_sessions_limit_monthly: limits?.voice_sessions_limit_monthly ?? 6,
        voice_minutes_limit_daily:    limits?.voice_minutes_limit_daily    ?? 20,
        updated_at:                   new Date().toISOString(),
      }).eq('id', userId)

      // Upsert subscription — for initial payment subscription_code may arrive
      // via subscription.create; here we fill in what we have
      const subData = data.subscription as Record<string, string> | null
      await supabase.from('subscriptions').upsert({
        user_id:                    userId,
        plan:                       userPlan,
        status:                     'active',
        paystack_customer_code:     customer.customer_code ?? null,
        // Only overwrite subscription_code/token if this charge carries them
        ...(subData?.subscription_code ? {
          paystack_subscription_code: subData.subscription_code,
          paystack_email_token:       subData.email_token ?? null,
        } : {}),
        current_period_start: new Date().toISOString(),
        updated_at:           new Date().toISOString(),
      }, { onConflict: 'user_id' })

      // Upsert invoice
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

      // Push notification: upgrade confirmation
      const planLabel = userPlan.charAt(0).toUpperCase() + userPlan.slice(1)
      sendNotification({
        userId,
        title:   `Welcome to ${planLabel}! 🎉`,
        message: 'Your account has been upgraded. Your new voice and conversation limits are active now.',
        url:     `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/portal/billing`,
        type:    'invoice_paid',
      }).catch(console.error)

      console.log(`[paystack webhook] charge.success: user=${userId} plan=${userPlan} ref=${reference}`)
    }

    // ── subscription.disable ─────────────────────────────────────────────────
    else if (event.event === 'subscription.disable') {
      const subCode = (event.data.subscription_code ?? event.data.code) as string

      const { data: subRecord } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('paystack_subscription_code', subCode)
        .single()

      if (subRecord?.user_id) {
        await supabase.from('profiles').update({
          plan:        'free',
          plan_status: 'cancelled',
          conversations_limit_monthly:  5,
          voice_sessions_limit_monthly: null,
          voice_minutes_limit_daily:    3,
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

      console.log('[paystack webhook] invoice.payment_failed')
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[paystack webhook] Error:', err)
    // Always return 200 so Paystack doesn't endlessly retry
    return NextResponse.json({ received: true, error: String(err) })
  }
}
