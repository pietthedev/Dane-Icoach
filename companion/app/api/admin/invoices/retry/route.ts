import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    // Check admin role
    const { data: role } = await supabase.from('admin_roles').select('role').eq('user_id', user.id).single()
    if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json() as { invoice_id?: string }
    const { invoice_id } = body
    if (!invoice_id) return NextResponse.json({ error: 'invoice_id required' }, { status: 400 })

    const { data: invoice } = await supabase.from('invoices').select('id, paystack_reference, user_id').eq('id', invoice_id).single()
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    // Update failed payment count
    await supabase.from('subscriptions').update({
      failed_payment_count: supabase.rpc('increment', { row_id: invoice.user_id })
    }).eq('user_id', invoice.user_id)

    // Note: actual Paystack retry API call should be implemented here
    // when PAYSTACK_SECRET_KEY is configured in system_config

    return NextResponse.json({ success: true, message: 'Retry initiated (Paystack integration pending)' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
