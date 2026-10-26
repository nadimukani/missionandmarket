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

import { Ornament } from '@/components/ui'
import {
  buildReservationUrl,
  formatDateLabel,
  formatSlot,
  restaurantToday,
  upcomingDates,
} from '@/lib/opentable'
import { bookingSlots, type Schedule } from '@/lib/schedule'
import { telHref } from '@/lib/site'

const OPEN_EVENT = 'mm:reserve'
const noopSubscribe = () => () => {}
const PARTY_SIZES = Array.from({ length: 12 }, (_, i) => i + 1)

/** Opens the booking panel. A real link to /reservations underneath, so it
 *  still works before hydration or with JavaScript off. */
export function ReserveButton({
  children,
  className = 'btn btn-solid',
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

export function ReserveForm({
  rid,
  phone,
  schedule,
  tone = 'light',
  idPrefix,
}: {
  rid?: string
  phone?: string
  schedule?: Schedule | null
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

  const dates = useMemo(
    () =>
      today
        ? upcomingDates(today, 45).map((d) => ({ iso: d, open: bookingSlots(d, schedule).length > 0 }))
        : [],
    [today, schedule],
  )
  // Default to the first date that is actually open.
  const date = dateChoice ?? dates.find((d) => d.open)?.iso ?? today ?? ''
  const slots = useMemo(() => (date ? bookingSlots(date, schedule) : []), [date, schedule])
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
      ? 'border-cream/35 bg-transparent text-cream [&>option]:text-ink'
      : 'border-ink/25 bg-transparent text-ink'
  const label = tone === 'dark' ? 'text-cream/70' : 'text-stone'

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

  const select = `h-12 w-full appearance-none border-0 border-b px-0 pr-8 font-display text-[1.1875rem] font-light focus:outline-none focus-visible:border-current ${field}`
  const chevron = (
    <svg
      viewBox="0 0 10 6"
      aria-hidden="true"
      className="pointer-events-none absolute right-1 bottom-[1.15rem] w-2.5"
    >
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <label className="relative flex flex-col gap-2" htmlFor={`${id}-party`}>
        <span className={`label ${label}`}>Guests</span>
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
        <span className={`label ${label}`}>Date</span>
        <select
          id={`${id}-date`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={select}
          disabled={large}
        >
          {today ? (
            dates.map((d) => (
              <option key={d.iso} value={d.iso} disabled={!d.open}>
                {formatDateLabel(d.iso, today)}
                {d.open ? '' : ' — closed'}
              </option>
            ))
          ) : (
            <option value="">Today</option>
          )}
        </select>
        {chevron}
      </label>

      <label className="relative flex flex-col gap-2" htmlFor={`${id}-time`}>
        <span className={`label ${label}`}>Time</span>
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
          <a href="/private-events#inquire" className="btn btn-solid h-12 w-full">
            Plan a group
          </a>
        ) : (
          <button
            type="submit"
            className={`btn h-12 w-full cursor-pointer ${tone === 'dark' ? 'btn-light' : 'btn-solid'}`}
            disabled={!rid || !time}
          >
            Find a table
          </button>
        )}
      </div>

      <p className={`col-span-2 text-sm font-light sm:col-span-4 ${label}`}>
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
  schedule,
}: {
  rid?: string
  phone?: string
  schedule?: Schedule | null
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
      className="m-auto w-[min(46rem,calc(100vw-2rem))] max-w-none bg-paper p-0 text-ink
                 backdrop:bg-ink/70 backdrop:backdrop-blur-[3px]
                 open:animate-[fade-in_300ms_ease-out]"
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) ref.current?.close()
      }}
    >
      <div className="relative px-6 pt-12 pb-8 sm:px-14 sm:pt-14 sm:pb-12">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="absolute top-3 right-3 grid size-11 place-items-center text-ink hover:text-moss"
          aria-label="Close"
        >
          <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <div className="text-center">
          <Ornament className="h-9 text-bronze" />
          <p className="label mt-6 text-bronze">Reservations</p>
          <h2 id={titleId} className="mt-4 font-display text-title">
            Reserve a Table
          </h2>
        </div>
        <div className="mt-10">
          <ReserveForm rid={rid} phone={phone} schedule={schedule} idPrefix="dlg" />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-ink/10 pt-6 text-sm font-light text-stone">
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
