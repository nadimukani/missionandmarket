'use client'

import { useEffect, useState } from 'react'

import { getOpenState, type OpenState } from '@/lib/hours'
import type { MachineHours } from '@/sanity/types'

function describe(state: OpenState) {
  switch (state.status) {
    case 'open':
      return { live: true, text: `Open now · until ${state.until}` }
    case 'closing-soon':
      return { live: true, text: `Open · closes at ${state.until}` }
    case 'closed':
      if (!state.opensAt) return { live: false, text: 'Closed now' }
      return {
        live: false,
        text: `Closed · opens ${state.opensDay === 'today' ? 'today' : state.opensDay === 'tomorrow' ? 'tomorrow' : state.opensDay} at ${state.opensAt}`,
      }
    default:
      return null
  }
}

/**
 * "Open now · until 9:30pm", computed in the browser from the structured
 * hours in the CMS and the restaurant's own timezone. Client-side on purpose:
 * a cached page must never claim the restaurant is open when it is not.
 */
export function OpenStatus({
  hours,
  className = '',
  tone = 'ink',
}: {
  hours?: MachineHours[]
  className?: string
  tone?: 'ink' | 'cream'
}) {
  const [state, setState] = useState<OpenState | null>(null)

  useEffect(() => {
    const tick = () => setState(getOpenState(hours))
    tick()
    const t = window.setInterval(tick, 60_000)
    return () => window.clearInterval(t)
  }, [hours])

  const info = state ? describe(state) : null
  // Reserve the line's height before hydration so nothing shifts.
  if (!info) return <p className={`eyebrow invisible ${className}`}>Open now</p>

  const dot = info.live ? 'bg-[#6f8f3a]' : tone === 'cream' ? 'bg-mist' : 'bg-stone'
  return (
    <p className={`eyebrow flex items-center gap-2.5 ${className}`} aria-live="polite">
      <span className={`inline-block size-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {info.text}
    </p>
  )
}
