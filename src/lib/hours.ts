import type { MachineHours } from '@/sanity/types'

/** Single source of truth for the restaurant's wall-clock timezone.
 *  Declared here rather than imported so this module stays dependency-free
 *  and can be executed directly by the check in scripts/hours-check.ts. */
export const RESTAURANT_TIME_ZONE = 'America/New_York'

const DAY_ORDER = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export type OpenState =
  | { status: 'open'; until: string }
  | { status: 'closing-soon'; until: string; minutesLeft: number }
  | { status: 'closed'; opensDay?: string; opensAt?: string }
  | { status: 'unknown' }

/** Wall-clock minutes-since-midnight and weekday, in the restaurant's timezone
 *  rather than the visitor's — someone checking from another state must still
 *  see whether the Atlanta dining room is open. */
function restaurantNow(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: RESTAURANT_TIME_ZONE,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  // Intl emits "24" for midnight in some ICU versions; normalise it.
  const hour = Number(get('hour')) % 24

  return {
    weekday: get('weekday'),
    minutes: hour * 60 + Number(get('minute')),
  }
}

function toMinutes(hhmm?: string): number | null {
  if (!hhmm) return null
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

function label(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const period = h24 >= 12 ? 'pm' : 'am'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, '0')}${period}`
}

const CLOSING_SOON_MINUTES = 60

/**
 * Derives whether the restaurant is open right now from the structured hours
 * the client maintains in the CMS — so this can never drift from what the
 * site says elsewhere, and there is no second source of truth to update.
 *
 * Handles services that run past midnight (closes < opens).
 */
export function getOpenState(
  hours: MachineHours[] | undefined,
  now: Date = new Date(),
): OpenState {
  if (!hours?.length) return { status: 'unknown' }

  const { weekday, minutes } = restaurantNow(now)
  const todayIndex = DAY_ORDER.indexOf(weekday as (typeof DAY_ORDER)[number])
  if (todayIndex === -1) return { status: 'unknown' }

  // A day can have SEVERAL services — Saturday is brunch 11:00-15:00 and then
  // dinner 17:00-23:00, with the kitchen shut in between. Keying by day would
  // silently drop all but one row and report "Open now" through the gap.
  const byDay = new Map<string, MachineHours[]>()
  for (const row of hours) {
    const list = byDay.get(row.day)
    if (list) list.push(row)
    else byDay.set(row.day, [row])
  }

  const intervals = (day: string) =>
    (byDay.get(day) ?? [])
      .map((r) => ({ opens: toMinutes(r.opens), closes: toMinutes(r.closes) }))
      .filter(
        (r): r is { opens: number; closes: number } =>
          r.opens !== null && r.closes !== null,
      )

  // A service that started yesterday and runs past midnight still counts.
  const yesterday = DAY_ORDER[(todayIndex + 6) % 7]
  for (const { opens, closes } of intervals(yesterday)) {
    if (closes < opens && minutes < closes) {
      const left = closes - minutes
      return left <= CLOSING_SOON_MINUTES
        ? { status: 'closing-soon', until: label(closes), minutesLeft: left }
        : { status: 'open', until: label(closes) }
    }
  }

  const today = intervals(DAY_ORDER[todayIndex]).sort((a, b) => a.opens - b.opens)

  for (const { opens, closes } of today) {
    const closesAdjusted = closes < opens ? closes + 1440 : closes
    if (minutes >= opens && minutes < closesAdjusted) {
      const left = closesAdjusted - minutes
      return left <= CLOSING_SOON_MINUTES
        ? { status: 'closing-soon', until: label(closes), minutesLeft: left }
        : { status: 'open', until: label(closes) }
    }
  }

  // Between services, or before the first one — point at the next opening
  // today rather than jumping to tomorrow.
  const nextToday = today.find((i) => minutes < i.opens)
  if (nextToday) {
    return { status: 'closed', opensDay: 'today', opensAt: label(nextToday.opens) }
  }

  for (let i = 1; i <= 7; i += 1) {
    const day = DAY_ORDER[(todayIndex + i) % 7]
    const next = intervals(day).sort((a, b) => a.opens - b.opens)[0]
    if (next) {
      return {
        status: 'closed',
        opensDay: i === 1 ? 'tomorrow' : day,
        opensAt: label(next.opens),
      }
    }
  }

  return { status: 'closed' }
}
