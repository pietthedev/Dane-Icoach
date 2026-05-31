import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('calendly-webhook-signature')

    const secret = process.env.CALENDLY_WEBHOOK_SECRET
    if (secret && signature) {
      const [, t, , v1] = signature.split(',').reduce((acc: Record<string, string>, part) => {
        const [k, val] = part.split('=')
        acc[k] = val
        return acc
      }, {}) as unknown as string[]
      const hash = crypto.createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')
      if (hash !== v1) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body) as { event: string; payload: Record<string, unknown> }
    const supabase = createClient()

    switch (event.event) {
      case 'invitee.created': {
        const { email, name, event: calEvent } = event.payload as Record<string, unknown>
        const calEventData = calEvent as Record<string, unknown>

        // Look up user by email
        const { data: profile } = await supabase.from('profiles').select('id').eq('email', email as string).single()

        await supabase.from('bookings').upsert({
          user_id: profile?.id ?? null,
          scheduled_at: calEventData.start_time as string,
          session_type: String(calEventData.name ?? 'Coaching session'),
          status: 'confirmed',
          meeting_url: (calEventData.location as Record<string, string>)?.join_url ?? null,
          calendly_event_uri: calEventData.uri as string,
          invitee_name: name as string,
          invitee_email: email as string,
        }, { onConflict: 'calendly_event_uri' })
        break
      }
      case 'invitee.canceled': {
        const { event: calEvent } = event.payload as Record<string, unknown>
        const calEventData = calEvent as Record<string, unknown>
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('calendly_event_uri', calEventData.uri as string)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[calendly webhook]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
