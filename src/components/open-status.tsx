'use client'

import { useEffect, useState } from 'react'

import { openState, type OpenState, type Schedule } from '@/lib/schedule'

function describe(s: OpenState) {
  if (s.status === 'open') return { live: true, text: s.closingSoon ? `Open · closes at ${s.until}` : `Open today until ${s.until}` }
  if (s.status === 'closed') {
    if (!s.opensAt) return { live: false, text: s.closure ? `Closed · ${s.closure}` : 'Closed' }
    const when = s.opensDay === 'today' ? 'today' : s.opensDay === 'tomorrow' ? 'tomorrow' : s.opensDay
    return { live: false, text: `${s.closure ? `Closed · ${s.closure} · ` : ''}Opens ${when} at ${s.opensAt}` }
  }
  return null
}

/**
 * "Open today until 9:30pm" — computed in the browser from Hours & Closures,
 * in the restaurant's timezone, honouring closures. Client-side so a cached
 * page can never claim the restaurant is open when it isn't.
 */
export function OpenStatus({ schedule, className = '' }: { schedule: Schedule | null; className?: string }) {
  const [state, setState] = useState<OpenState | null>(null)

  useEffect(() => {
    const tick = () => setState(openState(schedule))
    tick()
    const t = window.setInterval(tick, 60_000)
    return () => window.clearInterval(t)
  }, [schedule])

  const info = state ? describe(state) : null
  if (!info) return <p className={`label invisible ${className}`}>Open</p>
  return (
    <p className={`label flex items-center justify-center gap-3 ${className}`} aria-live="polite">
      <span
        aria-hidden="true"
        className={`inline-block size-1.5 rounded-full ${info.live ? 'bg-[#8fae5a]' : 'bg-current opacity-50'}`}
      />
      {info.text}
    </p>
  )
}
