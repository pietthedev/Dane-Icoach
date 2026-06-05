import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PLAN_AMOUNTS: Record<string, number> = {
  grow:     34900, // R349.00 in kobo
  business: 69900, // R699.00 in kobo
}

const PLAN_LABELS: Record<string, string> = {
  grow:     'Grow',
  business: 'Business',
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    if (!user.email) return NextResponse.json({ error: 'No email on account' }, { status: 400 })

    const { plan } = await req.json() as { plan?: string }

    if (!plan || !PLAN_AMOUNTS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "grow" or "business".' },
        { status: 400 }
      )
    }

    const amount       = PLAN_AMOUNTS[plan]
    const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const callbackUrl  = `${siteUrl}/portal/billing?upgraded=true&plan=${plan}`
    const subaccount   = process.env.PAYSTACK_SUBACCOUNT_CODE
    const secretKey    = process.env.PAYSTACK_SECRET_KEY

    // Paystack plan codes enable recurring monthly billing
    const planCodes: Record<string, string | undefined> = {
      grow:     process.env.PAYSTACK_GROW_PLAN_CODE,
      business: process.env.PAYSTACK_BUSINESS_PLAN_CODE,
    }
    const planCode = planCodes[plan]

    if (!secretKey) {
      console.error('[subscribe] PAYSTACK_SECRET_KEY not set')
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    if (!planCode) {
      console.warn(`[subscribe] Plan code not set for "${plan}" — transaction will be one-time only`)
    }

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email:        user.email,
        amount,
        currency:     'ZAR',
        callback_url: callbackUrl,
        channels:     ['card'],
        // Including plan code tells Paystack to create a recurring subscription
        ...(planCode ? { plan: planCode } : {}),
        metadata: {
          user_id:       user.id,
          plan,
          plan_label:    PLAN_LABELS[plan],
          cancel_action: `${siteUrl}/portal/billing`,
        },
        ...(subaccount ? {
          subaccount,
          bearer: 'subaccount',
        } : {}),
      }),
    })

    const paystackData = await paystackRes.json()

    if (!paystackRes.ok || !paystackData.status) {
      console.error('[subscribe] Paystack error:', paystackData)
      return NextResponse.json(
        { error: paystackData.message ?? 'Failed to initialise payment' },
        { status: 502 }
      )
    }

    const { authorization_url, reference } = paystackData.data as {
      authorization_url: string
      reference: string
    }

    console.log(`[subscribe] Initialized: user=${user.id} plan=${plan} ref=${reference}`)

    return NextResponse.json({ authorization_url, reference })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
