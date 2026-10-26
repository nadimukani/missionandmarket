'use client'

import { useEffect, useState } from 'react'

import { ReserveButton } from '@/components/reserve'
import { telHref } from '@/lib/site'

/**
 * Phones get the three things people actually came for — book, call, get
 * directions — pinned to the thumb once they have scrolled past the opening.
 */
export function MobileActionBar({ phone, mapsUrl }: { phone?: string; mapsUrl?: string }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`no-print fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-500 lg:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-1 px-3 py-2.5">
        <ReserveButton className="btn btn-solid min-h-11 w-full">Reserve a Table</ReserveButton>
        {phone ? (
          <a href={telHref(phone)} className="nav-link grid min-h-11 place-items-center px-4" aria-label={`Call ${phone}`}>
            Call
          </a>
        ) : null}
        {mapsUrl ? (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="nav-link grid min-h-11 place-items-center px-4">
            Map
          </a>
        ) : null}
      </div>
    </div>
  )
}
