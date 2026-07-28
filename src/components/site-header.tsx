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

  // Close when the layout crosses into the desktop breakpoint. Without this
  // an iPad opened in portrait and rotated to landscape is left scroll-locked
  // and fully inert with nothing able to clear it: the hamburger is the only
  // control that can close the sheet and it is `lg:hidden`, so at that width
  // it is display:none and unfocusable.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)')
    const sync = () => desktop.matches && setOpen(false)
    sync()
    desktop.addEventListener('change', sync)
    return () => desktop.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Publish where the header actually ends so the sheet can size itself even
  // when the notice banner is above it.
  const headerRef = useRef<HTMLElement>(null)
  const lastBottom = useRef<number>(-1)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const publish = () => {
      // Only write when the value actually changes. Setting a custom property
      // on documentElement invalidates style for the whole document, and the
      // page now carries scroll-driven animations whose timelines are
      // re-evaluated on that invalidation — so writing it on every scroll
      // event turned each frame into a full-document style recalc and pegged
      // the main thread. The header is sticky, so once any notice banner has
      // scrolled away this settles and stops writing entirely.
      const bottom = Math.round(el.getBoundingClientRect().bottom)
      if (bottom === lastBottom.current) return
      lastBottom.current = bottom
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
    // The reserve bar is a fixed sibling rendered after the footer, so it is
    // not covered by #main or <footer>. Left out, Tab past the last link in
    // the sheet lands on "Reserve a table" underneath it.
    const behind = [
      document.getElementById('main'),
      document.querySelector('footer'),
      document.querySelector('[data-reserve-bar]'),
    ]
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
      <div className="rail flex h-header items-center justify-between gap-8">
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
                            duration-200 ease-out-soft hover:text-cream ${
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
                className="block font-sans text-[0.8125rem] text-cream-muted transition-colors duration-200 ease-out-soft hover:text-cream"
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
              className="border-b border-cream/10 py-5 font-display text-sub text-cream"
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
