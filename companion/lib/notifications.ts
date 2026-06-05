import { createClient as createServiceClient } from '@supabase/supabase-js'

export interface NotificationPayload {
  userId:   string
  title:    string
  message:  string
  url?:     string
  type?:    string   // maps to notifications.type column
}

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Sends a push notification via OneSignal AND inserts a row into the
 * Supabase `notifications` table for in-app display.
 * Safe to call fire-and-forget (.catch(console.error)).
 */
export async function sendNotification(payload: NotificationPayload) {
  const { userId, title, message, url, type = 'system' } = payload

  const appId     = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
  const restKey   = process.env.ONESIGNAL_REST_API_KEY
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://companionai.coach'
  const targetUrl = url ?? `${siteUrl}/portal/notifications`

  // ── 1. OneSignal push (fire-and-forget, never blocks) ─────────────────────
  if (appId && restKey) {
    fetch('https://onesignal.com/api/v1/notifications', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Basic ${restKey}`,
      },
      body: JSON.stringify({
        app_id:   appId,
        // Target by external_id (set via OneSignal.login(userId) in the client)
        include_aliases:            { external_id: [userId] },
        target_channel:             'push',
        headings:  { en: title },
        contents:  { en: message },
        url:       targetUrl,
      }),
    }).then(async r => {
      const d = await r.json()
      if (!r.ok) console.error('[notifications] OneSignal error:', d)
      else console.log(`[notifications] Push sent to ${userId}:`, d.id)
    }).catch(err => console.error('[notifications] OneSignal fetch error:', err))
  } else {
    console.warn('[notifications] OneSignal not configured — skipping push')
  }

  // ── 2. Insert into Supabase notifications table for in-app display ─────────
  try {
    const supabase = getServiceClient()
    const { error } = await supabase.from('notifications').insert({
      user_id:    userId,
      type,
      title,
      body:       message,
      read:       false,
      created_at: new Date().toISOString(),
    })
    if (error) console.error('[notifications] Supabase insert error:', error.message)
  } catch (err) {
    console.error('[notifications] Supabase error:', err)
  }
}
