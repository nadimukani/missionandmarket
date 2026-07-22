'use client'

import { useEffect, useState } from 'react'

import { getOpenState, type OpenState } from '@/lib/hours'
import type { MachineHours } from '@/sanity/types'

/**
 * "Are you open right now" — the question a guest standing on Lenox Road at
 * 9:40pm actually has, and one most restaurant sites answer only by making you
 * read a table and do the arithmetic yourself.
 *
 * Computed after mount rather than on the server: the answer depends on the
 * current time, so rendering it during a static build would bake in a stale
 * status and cause a hydration mismatch. Until then nothing is shown, which
 * degrades to simply not making the claim.
 */
export function OpenStatus({
  hours,
  className = '',
  tone = 'dark',
}: {
  hours?: MachineHours[]
  className?: string
  /** Which ground it sits on, so the dot and text stay above 4.5:1. */
  tone?: 'dark' | 'light'
}) {
  const [state, setState] = useState<OpenState | null>(null)

  useEffect(() => {
    const update = () => setState(getOpenState(hours))
    update()
    // Re-check on the minute boundary so the badge can't go stale on a page
    // left open through closing time.
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [hours])

  if (!state || state.status === 'unknown') return null

  const text =
    state.status === 'open'
      ? `Open now · until ${state.until}`
      : state.status === 'closing-soon'
        ? `Closing at ${state.until}`
        : state.opensAt
          ? `Closed · opens ${state.opensDay} at ${state.opensAt}`
          : 'Closed'

  const dot =
    state.status === 'closed'
      ? tone === 'dark'
        ? 'bg-cream/40'
        : 'bg-ink/30'
      : state.status === 'closing-soon'
        ? 'bg-brass-ondark'
        : 'bg-[#7f9b4e]'

  const textTone = tone === 'dark' ? 'text-cream-muted' : 'text-ink-muted'

  return (
    <p
      className={`flex items-center gap-2 font-sans text-xs ${textTone} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
      />
      {text}
    </p>
  )
}
