'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { OpenStatus } from '@/components/open-status'
import { Wordmark } from '@/components/wordmark'
import { NAV_LINKS, telHref } from '@/lib/site'
import type { SiteSettings } from '@/sanity/types'

export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // On the homepage the header floats over the hero photograph and only takes
  // a background once it has left it. Interior pages open on a dark band, so
  // it is opaque from the first pixel.
  const overlay = pathname === '/'

  useEffect(() => {
    // No listener needed off the homepage — `solid` already forces the
    // background there, so a stale `scrolled` value cannot be observed.
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  // Reset on navigation during render, so the sheet never paints open on the
  // new route.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Publish where the header actually ends so the sheet can size itself even
  // when the notice banner is above it.
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const publish = () => {
      const bottom = el.getBoundingClientRect().bottom
      document.documentElement.style.setProperty('--header-bottom', `${bottom}px`)
    }
    publish()
    window.addEventListener('resize', publish)
    window.addEventListener('scroll', publish, { passive: true })
    return () => {
      window.removeEventListener('resize', publish)
      window.removeEventListener('scroll', publish)
    }
  }, [])

  // Keep the page behind the sheet out of the tab order, so focus cannot
  // wander onto content the guest cannot see (WCAG 2.4.3).
  useEffect(() => {
    if (typeof document === 'undefined') return
    const behind = [document.getElementById('main'), document.querySelector('footer')]
    for (const el of behind) {
      if (!el) continue
      if (open) el.setAttribute('inert', '')
      else el.removeAttribute('inert')
    }
    return () => {
      for (const el of behind) el?.removeAttribute('inert')
    }
  }, [open])

  const solid = !overlay || scrolled || open

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-colors duration-500 ease-[var(--ease-out-soft)] ${
        solid ? 'bg-ink/95 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-header max-w-[88rem] items-center justify-between gap-8 px-5 lg:px-10">
        <Link
          href="/"
          aria-label={`${settings?.name ?? 'Mission + Market'} — home`}
          className="shrink-0 text-cream"
        >
          <Wordmark />
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`font-sans text-[0.8125rem] tracking-wide transition-colors
                            hover:text-cream ${
                              active ? 'text-cream' : 'text-cream-muted'
                            }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="text-right">
            {settings?.phone ? (
              <a
                href={telHref(settings.phone)}
                className="block font-sans text-[0.8125rem] text-cream-muted transition-colors hover:text-cream"
              >
                {settings.phone}
              </a>
            ) : null}
            <OpenStatus hours={settings?.machineHours} className="justify-end" />
          </div>

          <Link
            href="/reservations"
            className="rounded-xs bg-brass-button px-5 py-2.5 font-sans text-[0.8125rem]
                       font-medium tracking-wide text-cream transition-colors hover:bg-brass-button-hover"
          >
            Reserve
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-cream lg:hidden"
        >
          <span className="relative block h-3.5 w-6" aria-hidden="true">
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute top-1.5 left-0 block h-px w-6 bg-current transition-opacity duration-200 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        // Sized from the header's real bottom edge rather than a hard-coded
        // offset: with the notice banner enabled the header does not start at
        // y=0, and a fixed calc pushed the foot of the sheet off-screen.
        style={{ maxHeight: 'calc(100dvh - var(--header-bottom, 5.5rem))' }}
        className="overflow-y-auto overscroll-contain border-t border-cream/10 bg-ink lg:hidden"
      >
        <nav className="flex flex-col px-5 pt-2 pb-10" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-cream/10 py-5 font-display text-3xl font-light text-cream"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/reservations"
            className="mt-8 rounded-xs bg-brass-button px-5 py-4 text-center font-sans
                       text-sm font-medium tracking-wide text-cream transition-colors hover:bg-brass-button-hover"
          >
            Reserve a table
          </Link>

          {settings?.phone ? (
            <a
              href={telHref(settings.phone)}
              className="mt-4 py-2 text-center font-sans text-sm text-cream-muted"
            >
              {settings.phone}
            </a>
          ) : null}

          <OpenStatus
            hours={settings?.machineHours}
            className="mt-2 justify-center"
          />
        </nav>
      </div>
    </header>
  )
}
