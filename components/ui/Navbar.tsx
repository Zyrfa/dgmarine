'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useRFQStore } from '@/lib/rfq-store'

const LOCALES = ['en', 'pl', 'de'] as const

interface NavLink { href: string; label: string }

interface Props {
  locale: string
  links: NavLink[]
  rfqLabel: string
}

function AnchorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
      <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm1 7v1h3v2h-3v7.93A7.001 7.001 0 0 0 19 13h-2a5 5 0 0 1-4 4.9V11h3V9h-3V2h-2v7H9v2h3v6.9A5 5 0 0 1 7 13H5a7.001 7.001 0 0 0 6 6.93V12H8V10h3V9h2z"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden>
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export function Navbar({ locale, links, rfqLabel }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const rfqCount = useRFQStore(s => s.items.length)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setOpen(false) }, [pathname])

  const switchLocale = (next: string) => {
    const segments = pathname.split('/')
    segments[1] = next
    window.location.href = segments.join('/')
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <header style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
      <nav className="page" style={{ padding: '0 1rem', maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', height: 60, gap: '1rem' }}>

        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)', textDecoration: 'none', flexShrink: 0 }}>
          <AnchorIcon />
          DG Marine
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: '.25rem', flex: 1, marginLeft: '1rem' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              style={{
                padding: '.4rem .75rem', borderRadius: 7, fontSize: '.875rem', fontWeight: 500,
                textDecoration: 'none', transition: 'background .15s',
                background: isActive(l.href) ? 'var(--accent)' : 'transparent',
                color: isActive(l.href) ? 'var(--accent-fg)' : 'var(--fg)',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          {/* Language switcher */}
          <div className="hidden sm:flex" style={{ gap: 2, background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
            {LOCALES.map(loc => (
              <button key={loc} onClick={() => switchLocale(loc)}
                style={{
                  padding: '.2rem .5rem', borderRadius: 5, fontSize: '.75rem',
                  fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: locale === loc ? 'var(--accent)' : 'transparent',
                  color: locale === loc ? 'var(--accent-fg)' : 'var(--fg-muted)',
                  transition: 'all .15s',
                }}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ padding: '.4rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--fg)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}

          {/* RFQ button */}
          <Link href={`/${locale}/rfq`}
            style={{ position: 'relative', padding: '.4rem .75rem', borderRadius: 8, background: rfqCount > 0 ? 'var(--accent)' : 'var(--bg-card)', color: rfqCount > 0 ? 'var(--accent-fg)' : 'var(--fg)', border: '1px solid var(--border)', fontWeight: 600, fontSize: '.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.4rem' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden>
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
            </svg>
            {rfqLabel}
            {rfqCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: '999px', fontSize: '.65rem', fontWeight: 700, padding: '0 .35rem', minWidth: 18, textAlign: 'center' }}>
                {rfqCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button className="md:hidden"
            onClick={() => setOpen(o => !o)}
            style={{ padding: '.4rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--fg)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label="Menu"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'var(--nav-bg)', borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', marginBottom: '1rem' }}>
            {links.map(l => (
              <Link key={l.href} href={l.href}
                style={{ padding: '.6rem .75rem', borderRadius: 8, fontSize: '.9rem', fontWeight: 500, textDecoration: 'none', background: isActive(l.href) ? 'var(--accent)' : 'transparent', color: isActive(l.href) ? 'var(--accent-fg)' : 'var(--fg)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            {LOCALES.map(loc => (
              <button key={loc} onClick={() => switchLocale(loc)}
                style={{ padding: '.3rem .7rem', borderRadius: 7, fontSize: '.8rem', fontWeight: 700, border: '1px solid var(--border)', cursor: 'pointer', background: locale === loc ? 'var(--accent)' : 'var(--bg-card)', color: locale === loc ? 'var(--accent-fg)' : 'var(--fg-muted)' }}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
