'use client'

import { useEffect, useState } from 'react'

import { ReserveButton } from '@/components/reserve'
import { telHref } from '@/lib/site'

/**
 * Phones get the three things people actually came for, pinned to the thumb:
 * book, call, get directions. It waits until the visitor has scrolled past the
 * opening so it never sits on top of the hero's own buttons.
 */
export function MobileActionBar({ phone, mapsUrl }: { phone?: string; mapsUrl?: string }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-300 lg:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-1 px-3 py-2.5">
        <ReserveButton className="btn btn-moss min-h-11 w-full">Reserve a table</ReserveButton>
        {phone ? (
          <a href={telHref(phone)} className="eyebrow grid min-h-11 place-items-center px-4" aria-label={`Call ${phone}`}>
            Call
          </a>
        ) : null}
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow grid min-h-11 place-items-center px-4"
          >
            Directions
          </a>
        ) : null}
      </div>
    </div>
  )
}
