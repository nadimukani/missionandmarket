/**
 * OpenTable deep-linking.
 *
 * We deliberately do NOT embed OpenTable's iframe widget on the page. It ships
 * its own fonts and chrome, can't be styled, is a third-party cookie/tracking
 * surface, and it blocks first paint on mobile. Instead the site renders a
 * native form and hands OpenTable a fully-formed URL, so the guest lands on the
 * confirmation step with party size, date and time already chosen.
 *
 * The `restref/client` endpoint is OpenTable's supported entry point for a
 * restaurant's own website and is what preserves booking attribution.
 */

export const RESTAURANT_TIME_ZONE = 'America/New_York'

export type ReservationParams = {
  rid: string
  partySize?: number
  /** Local restaurant date, `YYYY-MM-DD`. */
  date?: string
  /** Local restaurant time, 24h `HH:mm`. */
  time?: string
}

export function buildReservationUrl({
  rid,
  partySize,
  date,
  time,
}: ReservationParams): string {
  const url = new URL('https://www.opentable.com/restref/client/')
  url.searchParams.set('rid', rid)
  url.searchParams.set('restref', rid)
  url.searchParams.set('lang', 'en-US')
  // Attributes the cover to the restaurant's own site in OpenTable reporting.
  url.searchParams.set('ot_source', 'Restaurant website')

  if (partySize) url.searchParams.set('partysize', String(partySize))
  if (date && time) url.searchParams.set('datetime', `${date}T${time}`)

  return url.toString()
}

/** Today's date in the restaurant's timezone, not the visitor's. A guest
 *  booking from London at 1am must still see the correct Atlanta date. */
export function restaurantToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: RESTAURANT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** Bookable slots, every 15 minutes. Range covers lunch through late dinner;
 *  OpenTable is the source of truth for what's actually available. */
export function timeSlots(startHour = 11, endHour = 22): string[] {
  const slots: string[] = []
  for (let h = startHour; h <= endHour; h += 1) {
    for (const m of [0, 15, 30, 45]) {
      if (h === endHour && m > 0) break
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
}

export function formatSlot(slot: string): string {
  const [h, m] = slot.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')}${period}`
}

/** Human date label for the picker, e.g. "Today", "Tomorrow", "Fri, Jul 24". */
export function formatDateLabel(iso: string, today: string): string {
  if (iso === today) return 'Today'

  const [ty, tm, td] = today.split('-').map(Number)
  const tomorrow = new Date(Date.UTC(ty, tm - 1, td + 1))
  const tomorrowIso = tomorrow.toISOString().slice(0, 10)
  if (iso === tomorrowIso) return 'Tomorrow'

  const [y, mo, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(Date.UTC(y, mo - 1, d)))
}

/** The next `count` bookable dates starting from `from` (inclusive). */
export function upcomingDates(from: string, count = 30): string[] {
  const [y, m, d] = from.split('-').map(Number)
  return Array.from({ length: count }, (_, i) =>
    new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10),
  )
}
