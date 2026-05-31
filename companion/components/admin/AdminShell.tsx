'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AdminShellProps {
  user: User
  role: string
  children: React.ReactNode
}

interface NavItem { href: string; label: string; icon: string }

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/clients', label: 'Clients', icon: '👥' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/homework', label: 'Homework', icon: '📋' },
  { href: '/admin/billing', label: 'Revenue', icon: '💰' },
  { href: '/admin/invoices', label: 'Invoices', icon: '🧾' },
  { href: '/admin/collections', label: 'Collections', icon: '⚠️' },
  { href: '/admin/quotes', label: 'Quotes', icon: '💬' },
  { href: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { href: '/admin/voice', label: 'Voice & Personas', icon: '🎙️' },
  { href: '/admin/config', label: 'System config', icon: '⚙️' },
  { href: '/admin/audit', label: 'Audit log', icon: '🔍' },
  { href: '/admin/admins', label: 'Admin users', icon: '🔑' },
]

const ROLE_STYLES: Record<string, string> = {
  super_admin: 'bg-accent text-white',
  admin: 'bg-plum text-white',
  support: 'bg-blue-500 text-white',
  viewer: 'bg-mist text-plum-dark',
}

export default function AdminShell({ user, role, children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const displayName = user.email?.split('@')[0] ?? 'Admin'
  const initials = displayName.slice(0, 2).toUpperCase()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-60 flex-shrink-0" style={{ background: '#2E1A47' }}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
          <path d="M38 16.5C35.2 10.5 29 7 22 7C12.6 7 5 14.6 5 24C5 33.4 12.6 41 22 41C29 41 35.2 37.5 38 31.5" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
          <path d="M30 20L32 24L30 28L28 24Z" fill="#B9A7E6"/>
          <path d="M33.5 17L35.5 21.5L33.5 26L31.5 21.5Z" fill="#FF6F9F" opacity="0.9"/>
          <circle cx="29.5" cy="24" r="1.4" fill="#FF6F9F"/>
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-poppins font-bold text-white text-xs">Admin</span>
          <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#FF6F9F', fontSize: 9 }}>Companion by Danè</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-0.5 font-inter text-sm transition-all ${
                active ? 'bg-white/15 text-white font-semibold' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span aria-hidden="true" className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="font-poppins font-bold text-white text-xs">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-inter font-semibold text-white text-xs truncate">{user.email}</p>
            <span className={`font-inter font-semibold text-[10px] px-2 py-0.5 rounded-full ${ROLE_STYLES[role] ?? ROLE_STYLES.viewer}`}>
              {role.replace('_', ' ')}
            </span>
          </div>
        </div>
        <button onClick={handleSignOut} disabled={signingOut}
          className="w-full font-inter text-sm text-white/60 hover:text-white flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-60">
          <span aria-hidden="true">🚪</span>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-cloud font-inter">
      <div className="hidden md:flex flex-shrink-0"><Sidebar /></div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="flex-shrink-0 w-60"><Sidebar /></div>
          <button className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topnav */}
        <header className="h-16 bg-white border-b border-line flex items-center px-5 gap-4 flex-shrink-0">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-mist" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <p className="font-inter text-xs text-muted">Admin portal</p>
          <div className="flex-1" />
          <Link href="/portal" className="font-inter text-xs text-muted hover:text-plum transition-colors">← Client portal</Link>
          <div className="w-8 h-8 rounded-full bg-plum-dark flex items-center justify-center">
            <span className="font-poppins font-bold text-white text-xs">{initials}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
