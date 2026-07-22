'use client'

import { useMemo, useState } from 'react'

import {
  buildReservationUrl,
  formatDateLabel,
  formatSlot,
  restaurantToday,
  timeSlots,
  upcomingDates,
} from '@/lib/opentable'

type Props = {
  rid: string
  fallbackUrl?: string
  largePartyNote?: string
  phone?: string
  /** `bar` sits in the hero; `panel` is the full-width block on /reservations. */
  variant?: 'bar' | 'panel'
}

const MAX_ONLINE_PARTY = 8

const selectClass =
  'w-full appearance-none rounded-sm border border-bone-dim/40 bg-transparent ' +
  'px-3 py-3 font-sans text-sm text-bone outline-none transition-colors ' +
  'hover:border-ember focus:border-ember [&>option]:bg-ink [&>option]:text-bone'

export function ReserveForm({
  rid,
  fallbackUrl,
  largePartyNote,
  phone,
  variant = 'panel',
}: Props) {
  const today = useMemo(() => restaurantToday(), [])
  const dates = useMemo(() => upcomingDates(today, 60), [today])
  const slots = useMemo(() => timeSlots(), [])

  const [partySize, setPartySize] = useState(2)
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('19:00')

  const href = buildReservationUrl({ rid, partySize, date, time })
  const isLargeParty = partySize > MAX_ONLINE_PARTY

  return (
    <div className={variant === 'bar' ? 'w-full' : 'w-full max-w-3xl'}>
      <form
        // A plain link submit: no JS required to book, and the URL is
        // right-clickable / shareable like any other link.
        action={href}
        method="get"
        onSubmit={(e) => {
          e.preventDefault()
          window.open(href, '_blank', 'noopener,noreferrer')
        }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-bone-muted">Party</span>
          <select
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className={selectClass}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n === 1 ? '1 guest' : `${n} guests`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-bone-muted">Date</span>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={selectClass}
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatDateLabel(d, today)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-bone-muted">Time</span>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={selectClass}
          >
            {slots.map((s) => (
              <option key={s} value={s}>
                {formatSlot(s)}
              </option>
            ))}
          </select>
        </label>

        <div className="col-span-2 flex flex-col justify-end sm:col-span-1">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-sm bg-ember px-5 py-3 font-sans text-sm
                       font-medium tracking-wide text-bone transition-colors
                       hover:bg-ember-bright"
          >
            Find a table
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-bone-muted">
        {isLargeParty ? (
          <>
            {largePartyNote ??
              `For parties over ${MAX_ONLINE_PARTY}, please call us`}{' '}
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="text-ember underline underline-offset-4 hover:text-ember-bright"
              >
                {phone}
              </a>
            ) : null}
          </>
        ) : (
          <>
            Booked securely through OpenTable.{' '}
            {fallbackUrl ? (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-bone"
              >
                View full availability
              </a>
            ) : null}
          </>
        )}
      </p>
    </div>
  )
}
