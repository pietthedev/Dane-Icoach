import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingConfirmation } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('calendly-webhook-signature')

    const secret = process.env.CALENDLY_WEBHOOK_SECRET
    if (secret && signature) {
      const parts = signature.split(',').reduce((acc: Record<string, string>, part) => {
        const [k, val] = part.split('=')
        acc[k] = val
        return acc
      }, {})
      const hash = crypto.createHmac('sha256', secret).update(`${parts['t']}.${body}`).digest('hex')
      if (hash !== parts['v1']) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body) as { event: string; payload: Record<string, unknown> }
    const supabase = createClient()

    switch (event.event) {
      case 'invitee.created': {
        const { email, name, event: calEvent } = event.payload as Record<string, unknown>
        const calEventData = calEvent as Record<string, unknown>
        const inviteeEmail = email as string
        const inviteeName = name as string
        const scheduledAt = calEventData.start_time as string
        const sessionType = String(calEventData.name ?? 'Coaching session')
        const meetingUrl = (calEventData.location as Record<string, string>)?.join_url ?? ''

        // Look up user profile by email
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, first_name')
          .eq('email', inviteeEmail)
          .single()

        await supabase.from('bookings').upsert({
          user_id: profile?.id ?? null,
          scheduled_at: scheduledAt,
          session_type: sessionType,
          status: 'confirmed',
          meeting_url: meetingUrl || null,
          calendly_event_uri: calEventData.uri as string,
          invitee_name: inviteeName,
          invitee_email: inviteeEmail,
        }, { onConflict: 'calendly_event_uri' })

        // Send booking confirmation email
        if (inviteeEmail) {
          const firstName = profile?.first_name ?? inviteeName.split(' ')[0] ?? 'there'
          const sessionDate = new Date(scheduledAt).toLocaleDateString('en-ZA', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })
          const sessionTime = new Date(scheduledAt).toLocaleTimeString('en-ZA', {
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
          })

          sendBookingConfirmation(
            inviteeEmail,
            firstName,
            sessionType,
            sessionDate,
            sessionTime,
            meetingUrl,
          ).catch(err => console.error('[email] sendBookingConfirmation failed:', err))
        }
        break
      }

      case 'invitee.canceled': {
        const { event: calEvent } = event.payload as Record<string, unknown>
        const calEventData = calEvent as Record<string, unknown>
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('calendly_event_uri', calEventData.uri as string)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[calendly webhook]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
