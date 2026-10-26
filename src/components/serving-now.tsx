'use client'

import { useSyncExternalStore } from 'react'

import { servedNow, type Schedule } from '@/lib/schedule'

const subscribe = (tick: () => void) => {
  const t = window.setInterval(tick, 15_000)
  return () => window.clearInterval(t)
}
const minute = () => Math.floor(Date.now() / 60_000)

/**
 * The current time to the minute, in the browser. Null on the server and
 * through hydration, so a cached page renders the same first and only then
 * learns what time it is.
 */
export function useNow(): Date | null {
  const m = useSyncExternalStore(subscribe, minute, () => null)
  return m === null ? null : new Date(m * 60_000)
}

/**
 * "Serving now", when one of these services is on in the restaurant's time
 * zone, from Hours & Closures. Renders `fallback` until then, so the line
 * keeps its height and nothing jumps.
 */
export function ServingNow({
  services,
  schedule,
  fallback = null,
  className = '',
}: {
  services?: string[]
  schedule: Schedule | null
  fallback?: React.ReactNode
  className?: string
}) {
  const now = useNow()
  if (!now || !servedNow({ services }, schedule, now)) return <>{fallback}</>
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#7d9a4a]" />
      Serving now
    </span>
  )
}
