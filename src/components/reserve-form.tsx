'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'

import { TextLink } from '@/components/ui'
import { telHref } from '@/lib/site'

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
  'w-full appearance-none rounded-xs border border-cream/40 bg-transparent ' +
  // 16px on touch widths: iOS Safari auto-zooms the whole page when a focused
  // control is under 16px, which throws the guest out of the booking flow.
  'px-3 py-3 font-sans text-base text-cream transition-colors sm:text-sm ' +
  'hover:border-brass-ondark focus:border-brass-ondark ' +
  '[&>option]:bg-ink [&>option]:text-cream'

export function ReserveForm({
  rid,
  fallbackUrl,
  largePartyNote,
  phone,
  variant = 'panel',
}: Props) {
  const slots = useMemo(() => timeSlots(), [])

  // "Today" is only knowable on the client. This component renders into
  // statically cached HTML, so computing the date on the server would bake in
  // whatever day the page was built and then mismatch on hydration.
  // useSyncExternalStore is the supported way to read a client-only value:
  // the server snapshot is null, and the date appears after hydration.
  const today = useSyncExternalStore(
    () => () => {},
    () => restaurantToday(),
    () => null,
  )

  const dates = useMemo(() => (today ? upcomingDates(today, 60) : []), [today])

  const [partySize, setPartySize] = useState(2)
  const [pickedDate, setPickedDate] = useState('')
  const [time, setTime] = useState('19:00')

  // Falls back to today until the guest picks something, with no second
  // effect to keep in sync.
  const date = pickedDate || today || ''

  const href = buildReservationUrl({ rid, partySize, date, time })
  const isLargeParty = partySize > MAX_ONLINE_PARTY

  return (
    <div className={variant === 'bar' ? 'w-full' : 'w-full max-w-3xl'}>
      <form
        // A plain link submit: no JS required to book, and the URL is
        // right-clickable / shareable like any other link.
        action="https://www.opentable.com/restref/client/"
        method="get"
        onSubmit={(e) => {
          e.preventDefault()
          window.open(href, '_blank', 'noopener,noreferrer')
        }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {/* Carried by the plain GET when JavaScript has not run.
            Date and time are deliberately NOT named, so they are not
            submitted: OpenTable takes a single combined `datetime`, and
            without JS there is nothing to combine them with — the date select
            has no value until it hydrates. Sending `date=&time=19:00` looked
            like a prefill and was simply ignored. Party size does carry. */}
        <input type="hidden" name="rid" value={rid} />
        <input type="hidden" name="restref" value={rid} />
        <input type="hidden" name="lang" value="en-US" />
        <input type="hidden" name="ot_source" value="Restaurant website" />
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-cream-muted">Party</span>
          <select
            name="partysize"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className={selectClass}
          >
            {Array.from({ length: MAX_ONLINE_PARTY }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n === 1 ? '1 guest' : `${n} guests`}
                </option>
              ),
            )}
            {/* Offering 20 while the copy said "call for 9 or more" invited
                guests to build a booking OpenTable would refuse. */}
            <option value={MAX_ONLINE_PARTY + 1}>
              {MAX_ONLINE_PARTY + 1}+ guests — please call
            </option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-cream-muted">Date</span>
          <select
            value={date}
            onChange={(e) => setPickedDate(e.target.value)}
            className={selectClass}
          >
            {today ? (
              dates.map((d) => (
                <option key={d} value={d}>
                  {formatDateLabel(d, today)}
                </option>
              ))
            ) : (
              <option value="">Today</option>
            )}
          </select>
        </label>

        <label className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
          <span className="eyebrow text-cream-muted">Time</span>
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
          {/* Over the online cap the button becomes the phone. Previously the
              copy said "please call" while the button stayed live and sent the
              guest to OpenTable with partysize=9 — a booking OpenTable would
              refuse, discovered two screens later. */}
          {isLargeParty && phone ? (
            <a
              href={telHref(phone)}
              className="flex w-full items-center justify-center rounded-xs bg-brass-button px-5 py-3
                         font-sans text-sm font-medium tracking-wide text-cream transition-colors
                         duration-200 ease-out-soft hover:bg-brass-button-hover"
            >
              Call {phone}
            </a>
          ) : (
            <button
              type="submit"
              disabled={isLargeParty}
              className="w-full cursor-pointer rounded-xs bg-brass-button px-5 py-3 font-sans text-sm
                         font-medium tracking-wide text-cream transition-colors duration-200
                         ease-out-soft hover:bg-brass-button-hover
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              Find a table
            </button>
          )}
        </div>
      </form>

      <p className="mt-3 text-xs text-cream-muted">
        {isLargeParty ? (
          <>
            {largePartyNote ??
              `For parties over ${MAX_ONLINE_PARTY}, please call us`}{' '}
            {phone ? (
              <TextLink href={telHref(phone)} tone="dark">
                {phone}
              </TextLink>
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
                className="underline underline-offset-4 hover:text-cream"
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
