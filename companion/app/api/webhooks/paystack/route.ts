import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-paystack-signature')

    // Verify signature
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET
    if (secret && signature) {
      const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body) as { event: string; data: Record<string, unknown> }
    const supabase = createClient()

    switch (event.event) {
      case 'charge.success': {
        const { reference, customer, amount, currency } = event.data as Record<string, unknown>
        // Update invoice status to paid
        await supabase
          .from('invoices')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('paystack_reference', reference as string)
        // Update subscription status to active
        const { data: profile } = await supabase.from('profiles').select('id').eq('email', (customer as Record<string, string>).email).single()
        if (profile) {
          await supabase.from('subscriptions').update({ status: 'active', failed_payment_count: 0 }).eq('user_id', profile.id)
        }
        console.log(`[paystack] charge.success: ${reference} amount: ${amount} ${currency}`)
        break
      }
      case 'subscription.disable': {
        const { subscription_code } = event.data as Record<string, unknown>
        await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('paystack_subscription_code', subscription_code as string)
        break
      }
      case 'invoice.payment_failed': {
        const { subscription } = event.data as Record<string, unknown>
        if (subscription) {
          await supabase.rpc('handle_failed_payment', { subscription_code: (subscription as Record<string, string>).subscription_code })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[paystack webhook]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
