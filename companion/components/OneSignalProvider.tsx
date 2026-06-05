'use client'

import { useEffect, useRef } from 'react'

interface OneSignalProviderProps {
  userId:          string
  prefQuoteOfDay?: boolean  // synced as a OneSignal tag for targeted daily sends
}

export default function OneSignalProvider({ userId, prefQuoteOfDay = true }: OneSignalProviderProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !userId) return
    initialized.current = true

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    if (!appId) {
      console.warn('[OneSignal] NEXT_PUBLIC_ONESIGNAL_APP_ID not set')
      return
    }

    import('react-onesignal').then(({ default: OneSignal }) => {
      OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerParam: { scope: '/' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        notifyButton: { enable: false } as any,
      }).then(() => {
        // Link device to user
        OneSignal.login(userId).catch(err =>
          console.warn('[OneSignal] login error:', err)
        )

        // Tag with quote preference so daily cron can target opted-in users only
        OneSignal.User.addTag('quote_of_day', prefQuoteOfDay ? '1' : '0')

        console.log('[OneSignal] Initialized for user:', userId, '| quote_of_day:', prefQuoteOfDay)
      }).catch(err => console.warn('[OneSignal] init error:', err))
    }).catch(err => console.warn('[OneSignal] import error:', err))
  }, [userId, prefQuoteOfDay])

  return null
}
