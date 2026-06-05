'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  full_name?: string | null
  avatar_url?: string | null
  plan?: string | null
}

interface PortalShellProps {
  user: User
  profile: Profile | null
  isAdmin?: boolean
  children: React.ReactNode
}

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-mist text-plum',
  start: 'bg-mist text-plum',
  explorer: 'bg-blue-100 text-blue-700',
  grow: 'bg-purple-100 text-purple-700',
  voice: 'bg-accent/10 text-accent',
  business: 'bg-plum text-white',
}

interface NavItem {
  href: string
  label: string
  icon: string
}

const journeyNav: NavItem[] = [
  { href: '/portal', label: 'Home', icon: '' },
  { href: '/portal/conversations', label: 'Conversations', icon: '' },
  { href: '/portal/voice', label: 'Voice session', icon: '' },
  { href: '/portal/chat', label: 'Text chat', icon: '' },
  { href: '/portal/bookings', label: 'Bookings', icon: '' },
  { href: '/portal/journal', label: 'Journal & goals', icon: '' },
  { href: '/portal/homework', label: 'Homework', icon: '' },
  { href: '/portal/analytics', label: 'Insights', icon: '' },
]

const accountNav: NavItem[] = [
  { href: '/portal/account', label: 'My profile', icon: '' },
  { href: '/portal/billing', label: 'Billing', icon: '' },
  { href: '/portal/notifications', label: 'Notifications', icon: '' },
  { href: '/portal/security', label: 'Security', icon: '' },
  { href: '/portal/export', label: 'Data & export', icon: '' },
]

export default function PortalShell({ user, profile, isAdmin = false, children }: PortalShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread notification count on mount
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('read', false)
      .then(({ count }) => setUnreadCount(count ?? 0))
      .catch(() => {})
  }, [pathname]) // re-check when navigating

  const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'You'

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const plan = profile?.plan ?? 'start'
  const planLabel = isAdmin ? 'Admin' : plan.charAt(0).toUpperCase() + plan.slice(1)
  const planClass = isAdmin ? 'bg-plum-dark text-white' : (PLAN_COLORS[plan] ?? PLAN_COLORS.start)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    // Hard redirect — clears all client-side session state and cookie cache
    window.location.href = '/'
  }

  const isActive = (href: string) =>
    href === '/portal' ? pathname === '/portal' : pathname.startsWith(href)

  const NavGroup = ({ label, items }: { label: string; items: NavItem[] }) => (
    <div className="mb-4">
      <p className="font-inter font-semibold text-[10px] uppercase tracking-widest text-muted/60 px-3 mb-1.5">{label}</p>
      {items.map(item => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-0.5 font-inter text-sm transition-all ${
              active
                ? 'bg-plum text-white font-semibold shadow-soft'
                : 'text-muted hover:bg-mist hover:text-plum-dark'
            }`}
          >
            <span aria-hidden="true" className="text-base w-5 text-center">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.href === '/portal/notifications' && unreadCount > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${active ? 'bg-white/30 text-white' : 'bg-accent text-white'}`}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-60 bg-white border-r border-line">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-line flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
          <path d="M38 16.5C35.2 10.5 29 7 22 7C12.6 7 5 14.6 5 24C5 33.4 12.6 41 22 41C29 41 35.2 37.5 38 31.5" stroke="#2E1A47" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
          <path d="M30 20L32 24L30 28L28 24Z" fill="#4B2E83"/>
          <path d="M33.5 17L35.5 21.5L33.5 26L31.5 21.5Z" fill="#FF6F9F" opacity="0.9"/>
          <circle cx="29.5" cy="24" r="1.4" fill="#FF6F9F"/>
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-poppins font-bold text-plum-dark" style={{ fontSize: 13 }}>Companion</span>
          <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#FF6F9F', fontSize: 10 }}>by Dane</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Portal navigation">
        <NavGroup label="My journey" items={journeyNav} />
        <NavGroup label="Account" items={accountNav} />
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-line flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-plum flex items-center justify-center flex-shrink-0">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
              : <span className="font-poppins font-bold text-white text-xs">{initials}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-inter font-semibold text-ink text-xs truncate">{displayName}</p>
            <span className={`font-inter font-semibold text-[10px] px-2 py-0.5 rounded-full ${planClass}`}>{planLabel}</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full font-inter text-sm text-muted hover:text-plum-dark flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-mist transition-colors disabled:opacity-60"
        >
          Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-cloud font-inter">
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="flex-shrink-0 w-60"><Sidebar /></div>
          <button
            className="flex-1 bg-plum-dark/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-line flex items-center px-5 gap-3 flex-shrink-0">
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-mist transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2.5">
            {/* ── Persistent voice button — one tap from anywhere ── */}
            <Link
              href="/portal/voice"
              className="flex items-center gap-1.5 font-inter font-semibold text-xs text-white px-3.5 py-2 rounded-full transition-all shadow-soft hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2E1A47, #6B3FA0)' }}
              title="Start a voice session"
            >
              <span aria-hidden="true">🎙️</span>
              <span className="hidden sm:inline">Talk</span>
            </Link>

            {isAdmin ? (
              <span className={`font-inter font-semibold text-xs px-2.5 py-1 rounded-full hidden sm:inline-block ${planClass}`}>{planLabel}</span>
            ) : plan === 'free' || plan === 'start' ? (
              <Link href="/portal/billing"
                className="font-inter font-semibold text-xs text-plum border border-plum/30 px-3 py-1.5 rounded-full hover:bg-plum/5 transition-colors hidden sm:block">
                Upgrade
              </Link>
            ) : (
              <span className={`font-inter font-semibold text-xs px-2.5 py-1 rounded-full hidden sm:inline-block ${planClass}`}>{planLabel}</span>
            )}
            <div className="w-8 h-8 rounded-full bg-plum flex items-center justify-center">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                : <span className="font-poppins font-bold text-white text-xs">{initials}</span>
              }
            </div>
            <span className="font-inter text-sm text-ink font-medium hidden md:block">{displayName}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}