'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { NAV_LINKS, telHref } from '@/lib/site'
import type { SiteSettings } from '@/sanity/types'

export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The header sits over the hero on the homepage and needs a background as
  // soon as it leaves it. Everywhere else it's opaque from the start.
  const overlay = pathname === '/'

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  // Close the mobile sheet on navigation.
  useEffect(() => setOpen(false), [pathname])

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = !overlay || scrolled || open

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-ink/95 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      {/* Fixed height so the homepage hero can pull itself up underneath by
          exactly this amount (-mt-20) and sit behind a transparent header. */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-bone lg:text-xl"
          aria-label={`${settings?.name ?? 'Mission + Market'} — home`}
        >
          Mission <span className="text-ember">+</span> Market
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`font-sans text-sm transition-colors hover:text-bone ${
                  active ? 'text-bone' : 'text-bone-dim'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {settings?.phone ? (
            <a
              href={telHref(settings.phone)}
              className="font-sans text-sm text-bone-dim transition-colors hover:text-bone"
            >
              {settings.phone}
            </a>
          ) : null}
          <Link
            href="/reservations"
            className="rounded-sm bg-ember px-4 py-2.5 font-sans text-sm font-medium
                       text-bone transition-colors hover:bg-ember-bright"
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
          className="flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-px w-6 bg-bone transition-transform duration-300 ${
                open ? 'top-2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute top-2 left-0 block h-px w-6 bg-bone transition-opacity duration-200 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-bone transition-transform duration-300 ${
                open ? 'top-2 -rotate-45' : 'top-4'
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-bone-dim/10 bg-ink lg:hidden"
      >
        <nav className="flex flex-col px-5 py-4" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-bone-dim/10 py-4 font-display text-2xl text-bone"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservations"
            className="mt-6 rounded-sm bg-ember px-5 py-4 text-center font-sans
                       text-sm font-medium text-bone"
          >
            Reserve a table
          </Link>
          {settings?.phone ? (
            <a
              href={telHref(settings.phone)}
              className="py-5 text-center font-sans text-sm text-bone-dim"
            >
              {settings.phone}
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
