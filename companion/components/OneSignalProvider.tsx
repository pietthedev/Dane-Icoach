'use client'

import { useEffect, useRef } from 'react'

interface OneSignalProviderProps {
  userId: string
}

export default function OneSignalProvider({ userId }: OneSignalProviderProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !userId) return
    initialized.current = true

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    if (!appId) {
      console.warn('[OneSignal] NEXT_PUBLIC_ONESIGNAL_APP_ID not set')
      return
    }

    // Dynamic import avoids SSR issues with window references
    import('react-onesignal').then(({ default: OneSignal }) => {
      OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerParam: { scope: '/' },
        notifyButton: { enable: false }, // we use our own UI
      }).then(() => {
        // Link this browser device to the Supabase user ID
        OneSignal.login(userId).catch(err =>
          console.warn('[OneSignal] login error:', err)
        )
        console.log('[OneSignal] Initialized for user:', userId)
      }).catch(err => console.warn('[OneSignal] init error:', err))
    }).catch(err => console.warn('[OneSignal] import error:', err))
  }, [userId])

  return null
}
