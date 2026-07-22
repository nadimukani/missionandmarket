'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { telHref } from '@/lib/site'
import type { SiteSettings } from '@/sanity/types'

/**
 * Persistent booking bar, mobile only.
 *
 * A guest reading the menu on a phone is the likeliest person on the site to
 * want a table, and they are also the furthest from the header. Rather than
 * make them scroll back, the two actions that matter — book, call — stay
 * within thumb reach.
 *
 * Hidden on /reservations (the booking form is already the page) and until the
 * guest has scrolled past the first screen, so it never covers the hero.
 */
export function ReserveBar({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname === '/reservations') return null

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-ink/95
                  backdrop-blur-md transition-transform duration-300 ease-[var(--ease-out-soft)]
                  lg:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      // Kept out of the tab order while off-screen so it can't trap focus.
      inert={!visible ? true : undefined}
    >
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        {settings?.phone ? (
          <a
            href={telHref(settings.phone)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xs
                       border border-cream/25 text-cream"
            aria-label={`Call ${settings.name ?? 'the restaurant'}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
          </a>
        ) : null}

        <Link
          href="/reservations"
          className="flex h-12 flex-1 items-center justify-center rounded-xs bg-brass-button
                     font-sans text-sm font-medium tracking-wide text-cream"
        >
          Reserve a table
        </Link>
      </div>
    </div>
  )
}
