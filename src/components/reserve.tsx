'use client'

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

import {
  buildReservationUrl,
  formatDateLabel,
  formatSlot,
  restaurantToday,
  upcomingDates,
} from '@/lib/opentable'
import { telHref } from '@/lib/site'
import type { MachineHours } from '@/sanity/types'

const OPEN_EVENT = 'mm:reserve'
const noopSubscribe = () => () => {}
const PARTY_SIZES = Array.from({ length: 12 }, (_, i) => i + 1)
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Opens the booking panel. A real link to /reservations underneath, so it
 *  still works before hydration or with JavaScript off. */
export function ReserveButton({
  children,
  className = 'btn btn-moss',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href="/reservations"
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        window.dispatchEvent(new Event(OPEN_EVENT))
      }}
    >
      {children}
    </a>
  )
}

function minutes(hhmm?: string) {
  if (!hhmm) return null
  const [h, m] = hhmm.split(':').map(Number)
  return Number.isNaN(h) || Number.isNaN(m) ? null : h * 60 + m
}

function toSlot(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/** Bookable quarter-hours for a date, from the opening hours in the CMS.
 *  OpenTable remains the source of truth for what is actually free. */
function slotsFor(iso: string, hours?: MachineHours[]) {
  const [y, m, d] = iso.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  const ranges = (hours ?? [])
    .filter((h) => h.day === weekday)
    .map((h) => [minutes(h.opens), minutes(h.closes)] as const)
    .filter((r): r is readonly [number, number] => r[0] !== null && r[1] !== null)

  const out: string[] = []
  for (const [open, close] of ranges) {
    for (let t = open; t <= close - 30; t += 15) out.push(toSlot(t))
  }
  return [...new Set(out)].sort()
}

export function ReserveForm({
  rid,
  phone,
  hours,
  tone = 'light',
  idPrefix,
}: {
  rid?: string
  phone?: string
  hours?: MachineHours[]
  tone?: 'light' | 'dark'
  idPrefix?: string
}) {
  const autoId = useId()
  const id = idPrefix ?? autoId
  // The restaurant's date (not the visitor's), read on the client only — the
  // server snapshot is null, so the static HTML never bakes in a stale day.
  const today = useSyncExternalStore(noopSubscribe, restaurantToday, () => null)
  const [party, setParty] = useState('2')
  const [dateChoice, setDate] = useState<string | null>(null)
  const [timeChoice, setTime] = useState('')

  const date = dateChoice ?? today ?? ''
  const dates = useMemo(() => (today ? upcomingDates(today, 45) : []), [today])
  const slots = useMemo(() => (date ? slotsFor(date, hours) : []), [date, hours])
  // Keep the chosen time if that day serves it; otherwise 7pm, else the
  // first sitting — derived, so changing the date never leaves a stale time.
  const time = slots.includes(timeChoice)
    ? timeChoice
    : slots.includes('19:00')
      ? '19:00'
      : (slots[0] ?? '')

  const large = party === 'more'
  const field =
    tone === 'dark'
      ? 'border-cream/30 bg-transparent text-cream [&>option]:text-ink'
      : 'border-ink/20 bg-paper text-ink'
  const label = tone === 'dark' ? 'text-mist' : 'text-stone'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!rid || large) return
    const url = buildReservationUrl({
      rid,
      partySize: Number(party),
      date: date || undefined,
      time: time || undefined,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const select = `h-12 w-full appearance-none border px-3.5 pr-9 text-[0.9375rem] focus:outline-2 focus:outline-offset-0 ${field}`
  const chevron = (
    <svg
      viewBox="0 0 10 6"
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 bottom-[1.15rem] w-2.5"
    >
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <label className="relative flex flex-col gap-2" htmlFor={`${id}-party`}>
        <span className={`eyebrow ${label}`}>Guests</span>
        <select
          id={`${id}-party`}
          value={party}
          onChange={(e) => setParty(e.target.value)}
          className={select}
        >
          {PARTY_SIZES.map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
          <option value="more">13 or more</option>
        </select>
        {chevron}
      </label>

      <label className="relative flex flex-col gap-2" htmlFor={`${id}-date`}>
        <span className={`eyebrow ${label}`}>Date</span>
        <select
          id={`${id}-date`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={select}
          disabled={large}
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
        {chevron}
      </label>

      <label className="relative flex flex-col gap-2" htmlFor={`${id}-time`}>
        <span className={`eyebrow ${label}`}>Time</span>
        <select
          id={`${id}-time`}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={select}
          disabled={large || !slots.length}
        >
          {slots.length ? (
            slots.map((s) => (
              <option key={s} value={s}>
                {formatSlot(s)}
              </option>
            ))
          ) : (
            <option value="">{today ? 'Closed' : '—'}</option>
          )}
        </select>
        {chevron}
      </label>

      <div className="flex flex-col justify-end">
        {large ? (
          <a href="/private-events#inquire" className="btn btn-moss h-12 w-full">
            Plan a group
          </a>
        ) : (
          <button
            type="submit"
            className={`btn h-12 w-full ${tone === 'dark' ? 'btn-cream' : 'btn-moss'}`}
            disabled={!rid}
          >
            Find a table
          </button>
        )}
      </div>

      <p className={`col-span-2 text-sm sm:col-span-4 ${label}`}>
        {large ? (
          <>
            For a larger group, send a private dining inquiry
            {phone ? (
              <>
                {' '}
                — or call{' '}
                <a className="link" href={telHref(phone)}>
                  {phone}
                </a>
              </>
            ) : null}
            .
          </>
        ) : (
          <>Opens OpenTable in a new tab with your details filled in.</>
        )}
      </p>
    </form>
  )
}

/** The booking panel, opened by any ReserveButton on the page. */
export function ReserveDialog({
  rid,
  phone,
  hours,
}: {
  rid?: string
  phone?: string
  hours?: MachineHours[]
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const open = () => ref.current?.showModal()
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-auto w-[min(44rem,calc(100vw-2rem))] max-w-none bg-paper p-0 text-ink
                 backdrop:bg-ink/60 backdrop:backdrop-blur-[2px]
                 open:animate-[fade-in_200ms_ease-out]"
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) ref.current?.close()
      }}
    >
      <div className="p-6 sm:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-bronze">Reservations</p>
            <h2 id={titleId} className="mt-3 font-display text-title">
              Book a <em>table</em>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="-mt-1 -mr-2 grid size-11 place-items-center text-ink hover:text-moss"
            aria-label="Close"
          >
            <svg viewBox="0 0 14 14" className="size-4" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.25" />
            </svg>
          </button>
        </div>
        <div className="mt-8">
          <ReserveForm rid={rid} phone={phone} hours={hours} idPrefix="dlg" />
        </div>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-6 text-sm text-stone">
          <a className="link" href="/private-events">
            Planning an event? See private dining
          </a>
          {phone ? (
            <a className="link" href={telHref(phone)}>
              Call {phone}
            </a>
          ) : null}
        </div>
      </div>
    </dialog>
  )
}
