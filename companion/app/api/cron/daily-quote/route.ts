import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Called daily by Vercel Cron (configured in vercel.json)
// Sends today's quote as a push notification to opted-in users
export async function GET(req: NextRequest) {
  // Protect — Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
  }

  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Pick a random active quote
    const { data: quotes } = await supabase
      .from('quotes')
      .select('id, quote_text, author')
      .eq('is_active', true)

    if (!quotes || quotes.length === 0) {
      console.log('[daily-quote] No active quotes found')
      return NextResponse.json({ ok: true, sent: false, reason: 'No active quotes' })
    }

    const quote = quotes[Math.floor(Math.random() * quotes.length)]
    const appId   = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    const restKey = process.env.ONESIGNAL_REST_API_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://companionai.coach'

    if (!appId || !restKey) {
      console.warn('[daily-quote] OneSignal not configured')
      return NextResponse.json({ ok: true, sent: false, reason: 'OneSignal not configured' })
    }

    const message = quote.author
      ? `"${quote.quote_text}" — ${quote.author}`
      : `"${quote.quote_text}"`

    // Send to users tagged quote_of_day=1 (opted in via account preferences)
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Basic ${restKey}`,
      },
      body: JSON.stringify({
        app_id:  appId,
        filters: [
          { field: 'tag', key: 'quote_of_day', relation: '=', value: '1' },
        ],
        headings: { en: '✦ Your quote of the day' },
        contents: { en: message },
        url:      `${siteUrl}/portal`,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[daily-quote] OneSignal error:', data)
      return NextResponse.json({ ok: false, error: data }, { status: 500 })
    }

    console.log(`[daily-quote] Sent quote "${quote.quote_text.slice(0, 40)}…" | OneSignal id: ${data.id} | recipients: ${data.recipients}`)
    return NextResponse.json({
      ok:         true,
      sent:       true,
      quote_id:   quote.id,
      recipients: data.recipients ?? 0,
    })
  } catch (err) {
    console.error('[daily-quote]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
