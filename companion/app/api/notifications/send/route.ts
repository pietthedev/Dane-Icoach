import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    // Must be an authenticated admin
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: role } = await serviceClient
      .from('admin_roles').select('role').eq('user_id', user.id).single()
    if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { user_id, title, message, url, target } =
      await req.json() as {
        user_id?: string
        title:    string
        message:  string
        url?:     string
        target?:  'all' | 'user'
      }

    if (!title || !message) {
      return NextResponse.json({ error: 'title and message are required' }, { status: 400 })
    }

    if (target === 'all') {
      // Broadcast to all users via OneSignal segment
      const appId   = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
      const restKey = process.env.ONESIGNAL_REST_API_KEY
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://companionai.coach'

      if (appId && restKey) {
        const res = await fetch('https://onesignal.com/api/v1/notifications', {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Basic ${restKey}`,
          },
          body: JSON.stringify({
            app_id:            appId,
            included_segments: ['All'],
            headings:          { en: title },
            contents:          { en: message },
            url:               url ?? `${siteUrl}/portal/notifications`,
          }),
        })
        const data = await res.json()
        if (!res.ok) console.error('[notifications/send] OneSignal broadcast error:', data)
        else console.log(`[notifications/send] Broadcast sent:`, data.id)
      }

      return NextResponse.json({ ok: true, target: 'all' })
    }

    // Single user
    if (!user_id) {
      return NextResponse.json({ error: 'user_id required for single-user send' }, { status: 400 })
    }

    await sendNotification({ userId: user_id, title, message, url, type: 'system' })
    return NextResponse.json({ ok: true, target: 'user', user_id })

  } catch (err) {
    console.error('[notifications/send]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
