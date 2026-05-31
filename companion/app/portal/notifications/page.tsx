'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  created_at: string
}

const TYPE_ICONS: Record<string, string> = {
  homework_assigned: '📋', booking_confirmed: '📅', booking_reminder: '⏰',
  session_complete: '✅', payment_success: '💳', payment_failed: '⚠️',
  plan_upgraded: '⭐', quote_of_day: '💬', message: '💬',
  goal_achieved: '🎯', streak_milestone: '🔥', feedback_received: '📝',
  system: '🔔', announcement: '📢', welcome: '👋',
  onboarding: '🌱', export_ready: '📦', security_alert: '🔒',
}

const TYPE_COLORS: Record<string, string> = {
  payment_failed: 'border-l-red-400', security_alert: 'border-l-red-400',
  booking_reminder: 'border-l-amber-400', payment_success: 'border-l-green-400',
  plan_upgraded: 'border-l-plum', goal_achieved: 'border-l-green-400',
  default: 'border-l-mist',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('id, type, title, body, read, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    setNotifications((data as Notification[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function markAllRead() {
    setMarkingAll(true)
    await fetch('/api/portal/notifications/read-all', { method: 'PATCH' })
    await load()
    setMarkingAll(false)
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Notifications</h1>
          {unread > 0 && <p className="font-inter text-sm text-muted mt-0.5">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} disabled={markingAll}
            className="font-inter text-sm text-plum hover:text-plum-dark transition-colors disabled:opacity-60">
            {markingAll ? 'Marking…' : 'Mark all read'}
          </button>
        )}
      </div>

      {loading && <p className="font-inter text-muted text-sm">Loading…</p>}

      {!loading && notifications.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-line text-center">
          <span className="text-4xl block mb-3">🔔</span>
          <p className="font-inter text-muted text-sm">No notifications yet</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className={`bg-white rounded-3xl p-4 border-l-4 border border-line shadow-card ${!n.read ? 'bg-plum/[0.02]' : ''} ${TYPE_COLORS[n.type] ?? TYPE_COLORS.default}`}>
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="text-lg flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type] ?? '🔔'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-inter text-sm ${n.read ? 'text-muted' : 'text-ink font-semibold'}`}>{n.title}</p>
                  <p className="font-inter text-[10px] text-muted flex-shrink-0">{new Date(n.created_at).toLocaleDateString('en-ZA')}</p>
                </div>
                {n.body && <p className="font-inter text-xs text-muted mt-0.5 leading-relaxed">{n.body}</p>}
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
