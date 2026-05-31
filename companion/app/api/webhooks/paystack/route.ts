import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendInvoicePaid } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-paystack-signature')

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
        const customerData = customer as Record<string, string>

        // Update invoice to paid
        const { data: invoice } = await supabase
          .from('invoices')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('paystack_reference', reference as string)
          .select('id')
          .single()

        // Update subscription to active
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, first_name, plan')
          .eq('email', customerData.email)
          .single()

        if (profile) {
          await supabase
            .from('subscriptions')
            .update({ status: 'active', failed_payment_count: 0 })
            .eq('user_id', profile.id)
        }

        // Send invoice paid email
        if (customerData.email) {
          const firstName = profile?.first_name ?? customerData.name?.split(' ')[0] ?? 'there'
          const invoiceNumber = invoice?.id
            ? `INV-${invoice.id.slice(0, 8).toUpperCase()}`
            : `REF-${String(reference).slice(0, 8).toUpperCase()}`
          const amountNum = Number(amount) / 100
          const formattedAmount = `${String(currency ?? 'ZAR')} ${amountNum.toFixed(2)}`
          const planName = profile?.plan
            ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)
            : 'Companion'

          sendInvoicePaid(
            customerData.email,
            firstName,
            invoiceNumber,
            formattedAmount,
            planName,
          ).catch(err => console.error('[email] sendInvoicePaid failed:', err))
        }

        console.log(`[paystack] charge.success: ${reference} amount: ${amount} ${currency}`)
        break
      }

      case 'subscription.disable': {
        const { subscription_code } = event.data as Record<string, unknown>
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('paystack_subscription_code', subscription_code as string)
        break
      }

      case 'invoice.payment_failed': {
        const { subscription } = event.data as Record<string, unknown>
        if (subscription) {
          await supabase.rpc('handle_failed_payment', {
            subscription_code: (subscription as Record<string, string>).subscription_code,
          })
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
