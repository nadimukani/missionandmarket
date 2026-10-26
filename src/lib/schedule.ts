/**
 * The restaurant's schedule, derived from ONE document: "Hours & Closures".
 *
 * The owner edits services ("Lunch: Mon–Fri, 11:30am – 3pm") and closure
 * dates ("Thanksgiving: closed"). Everything else is computed here, so it can
 * never disagree with itself: the hours in the footer and on Visit, the
 * "Served" line on each menu, the "Open now" status, the times offered by the
 * booking panel, Google's structured opening hours, and the closure banner.
 *
 * Dependency-free on purpose (no Sanity imports) so it runs anywhere.
 */

export const RESTAURANT_TIME_ZONE = 'America/New_York'

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type DayKey = (typeof DAY_KEYS)[number]

const DAY_NAME: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export type Period = { days?: string[]; opens?: string; closes?: string }
export type Service = { name: string; note?: string; periods?: Period[] }
export type Closure = {
  label?: string
  date: string // YYYY-MM-DD
  endDate?: string
  kind?: 'closed' | 'special'
  opens?: string
  closes?: string
  message?: string
  showBanner?: boolean
  bannerDaysBefore?: number
}
export type Schedule = { services?: Service[]; closures?: Closure[] }

/* ----------------------------------------------------------- formatting */

export function minutes(hhmm?: string): number | null {
  if (!hhmm) return null
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim())
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

/** "15:00" → "3pm", "11:30" → "11:30am", "00:00" → "midnight". */
export function formatTime(hhmm?: string): string {
  const t = minutes(hhmm)
  if (t === null) return ''
  const h24 = Math.floor(t / 60) % 24
  const m = t % 60
  if (h24 === 0 && m === 0) return 'midnight'
  if (h24 === 12 && m === 0) return 'noon'
  const period = h24 >= 12 ? 'pm' : 'am'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, '0')}${period}`
}

export function formatRange(opens?: string, closes?: string) {
  return `${formatTime(opens)} – ${formatTime(closes)}`
}

function sortDays(days: string[] = []): DayKey[] {
  return DAY_KEYS.filter((d) => days.includes(d))
}

/** ["mon","tue","wed","thu","fri"] → "Monday – Friday";
 *  ["sat","sun"] → "Saturday + Sunday"; all seven → "Every day". */
export function formatDays(days: string[] = [], short = false): string {
  const sorted = sortDays(days)
  const name = (d: DayKey) => (short ? DAY_NAME[d].slice(0, 3) : DAY_NAME[d])
  if (sorted.length === 7) return short ? 'Daily' : 'Every day'
  if (!sorted.length) return ''

  // Split into runs of consecutive days.
  const runs: DayKey[][] = []
  for (const d of sorted) {
    const last = runs.at(-1)
    if (last && DAY_KEYS.indexOf(d) === DAY_KEYS.indexOf(last.at(-1)!) + 1) last.push(d)
    else runs.push([d])
  }
  const parts = runs.map((r) =>
    r.length >= 3 ? `${name(r[0])} – ${name(r.at(-1)!)}` : r.map(name).join(' + '),
  )
  return parts.join(', ')
}

/** Display rows for one service: one row per period, in week order. */
export function serviceRows(service: Service, short = false) {
  return (service.periods ?? [])
    .filter((p) => p.days?.length && p.opens && p.closes)
    .sort((a, b) => DAY_KEYS.indexOf(sortDays(a.days)[0]) - DAY_KEYS.indexOf(sortDays(b.days)[0]))
    .map((p) => ({
      days: formatDays(p.days, short),
      // Separate ends, so tables can align ranges on the dash.
      opens: formatTime(p.opens),
      closes: formatTime(p.closes),
      time: formatRange(p.opens, p.closes),
    }))
}

/** A one-line summary for a service: "Monday – Friday, 11:30am – 3pm" when
 *  there is one set of hours; otherwise the start times, grouped —
 *  "Monday – Friday from 3pm · Saturday + Sunday from 5pm". The full table
 *  (with closing times) lives on Visit. */
export function serviceSummary(service?: Service): string {
  if (!service) return ''
  const rows = serviceRows(service)
  if (rows.length === 1) return `${rows[0].days}, ${rows[0].time}`
  const periods = (service.periods ?? []).filter((p) => p.days?.length && p.opens)
  const byOpen = new Map<string, string[]>()
  for (const p of periods) byOpen.set(p.opens!, [...(byOpen.get(p.opens!) ?? []), ...(p.days ?? [])])
  return [...byOpen.entries()]
    .sort((a, b) => DAY_KEYS.indexOf(sortDays(a[1])[0]) - DAY_KEYS.indexOf(sortDays(b[1])[0]))
    .map(([opens, days]) => `${formatDays(days)} from ${formatTime(opens)}`)
    .join(' · ')
}

export function findService(schedule: Schedule | null | undefined, name?: string) {
  if (!name) return undefined
  const key = name.trim().toLowerCase()
  return schedule?.services?.find((s) => s.name?.trim().toLowerCase() === key)
}

/* ---------------------------------------------------------- the clock */

/** Restaurant-local date and minutes for a moment in time. */
export function restaurantClock(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: RESTAURANT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = get('weekday').slice(0, 3).toLowerCase() as DayKey
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    day,
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
  }
}

export function weekdayOf(iso: string): DayKey {
  const [y, m, d] = iso.split('-').map(Number)
  return DAY_KEYS[(new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7]
}

export function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

/* ------------------------------------------------------ opening times */

type Interval = { opens: number; closes: number }

/** Merge overlapping/adjacent intervals — lunch 11:30–15:00 and dinner
 *  15:00–21:30 become one open stretch, 11:30–21:30. Happy hour inside
 *  dinner adds nothing. */
function merge(list: Interval[]): Interval[] {
  const sorted = [...list].sort((a, b) => a.opens - b.opens)
  const out: Interval[] = []
  for (const i of sorted) {
    const last = out.at(-1)
    if (last && i.opens <= last.closes) last.closes = Math.max(last.closes, i.closes)
    else out.push({ ...i })
  }
  return out
}

/** Open intervals for each weekday, across every service. A close earlier
 *  than the open (e.g. 17:00–01:00) runs past midnight. */
export function weeklyIntervals(schedule?: Schedule | null): Record<DayKey, Interval[]> {
  const out = Object.fromEntries(DAY_KEYS.map((d) => [d, [] as Interval[]])) as Record<
    DayKey,
    Interval[]
  >
  for (const s of schedule?.services ?? []) {
    for (const p of s.periods ?? []) {
      const o = minutes(p.opens)
      let c = minutes(p.closes)
      if (o === null || c === null) continue
      if (c <= o) c += 1440
      for (const d of sortDays(p.days)) out[d].push({ opens: o, closes: c })
    }
  }
  for (const d of DAY_KEYS) out[d] = merge(out[d])
  return out
}

export function closureOn(iso: string, closures?: Closure[]) {
  return closures?.find((c) => c.date && iso >= c.date && iso <= (c.endDate || c.date))
}

/** The open intervals on a specific date, honouring closures and special hours. */
export function intervalsOn(iso: string, schedule?: Schedule | null): Interval[] {
  const closure = closureOn(iso, schedule?.closures)
  if (closure) {
    if (closure.kind !== 'special') return []
    const o = minutes(closure.opens)
    let c = minutes(closure.closes)
    if (o === null || c === null) return []
    if (c <= o) c += 1440
    return [{ opens: o, closes: c }]
  }
  return weeklyIntervals(schedule)[weekdayOf(iso)]
}

function label(total: number) {
  return formatTime(`${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`)
}

export type OpenState =
  | { status: 'open'; until: string; closingSoon: boolean }
  | { status: 'closed'; opensDay?: 'today' | 'tomorrow' | string; opensAt?: string; closure?: string }
  | { status: 'unknown' }

/** "Open now · until 9:30pm" / "Closed · opens tomorrow at 11:30am",
 *  in the restaurant's timezone, honouring closures. */
export function openState(schedule?: Schedule | null, now: Date = new Date()): OpenState {
  if (!schedule?.services?.length) return { status: 'unknown' }
  const clock = restaurantClock(now)

  // A service that started yesterday and runs past midnight still counts.
  for (const i of intervalsOn(addDays(clock.date, -1), schedule)) {
    if (i.closes > 1440 && clock.minutes < i.closes - 1440) {
      return { status: 'open', until: label(i.closes), closingSoon: i.closes - 1440 - clock.minutes <= 60 }
    }
  }
  const today = intervalsOn(clock.date, schedule)
  for (const i of today) {
    if (clock.minutes >= i.opens && clock.minutes < i.closes) {
      return { status: 'open', until: label(i.closes), closingSoon: i.closes - clock.minutes <= 60 }
    }
  }
  const todaysClosure = closureOn(clock.date, schedule.closures)
  const later = today.find((i) => clock.minutes < i.opens)
  if (later) return { status: 'closed', opensDay: 'today', opensAt: label(later.opens) }

  for (let n = 1; n <= 14; n += 1) {
    const iso = addDays(clock.date, n)
    const next = intervalsOn(iso, schedule)[0]
    if (next) {
      return {
        status: 'closed',
        opensDay: n === 1 ? 'tomorrow' : DAY_NAME[weekdayOf(iso)],
        opensAt: label(next.opens),
        closure: todaysClosure?.label,
      }
    }
  }
  return { status: 'closed', closure: todaysClosure?.label }
}

/** Quarter-hour booking times for a date, from the hours (minus closures).
 *  Stops 30 minutes before close. OpenTable has the final word on tables. */
export function bookingSlots(iso: string, schedule?: Schedule | null): string[] {
  const out = new Set<string>()
  for (const i of intervalsOn(iso, schedule)) {
    for (let t = i.opens; t <= i.closes - 30; t += 15) {
      if (t >= 1440) break
      out.add(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
    }
  }
  return [...out].sort()
}

/* ------------------------------------------------------------ closures */

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts }).format(new Date(Date.UTC(y, m - 1, d)))
}

/** Human line for a closure: "Closed Thursday, November 26 — Thanksgiving". */
export function closureLine(c: Closure): string {
  if (c.message) return c.message
  const when =
    c.endDate && c.endDate !== c.date
      ? `${formatDate(c.date)} – ${formatDate(c.endDate)}`
      : formatDate(c.date)
  const what = c.kind === 'special' ? `Special hours ${when}: ${formatRange(c.opens, c.closes)}` : `Closed ${when}`
  return c.label ? `${what} — ${c.label}` : what
}

/** Closures from today on, soonest first. */
export function upcomingClosures(schedule?: Schedule | null, now: Date = new Date()) {
  const today = restaurantClock(now).date
  return (schedule?.closures ?? [])
    .filter((c) => c.date && (c.endDate || c.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** The closure that should be bannered right now, if any. */
export function bannerClosure(schedule?: Schedule | null, now: Date = new Date()) {
  const today = restaurantClock(now).date
  return upcomingClosures(schedule, now).find(
    (c) => c.showBanner !== false && today >= addDays(c.date, -(c.bannerDaysBefore ?? 7)),
  )
}

/* --------------------------------------------------- structured data */

const SCHEMA_DAY: Record<DayKey, string> = {
  mon: 'https://schema.org/Monday',
  tue: 'https://schema.org/Tuesday',
  wed: 'https://schema.org/Wednesday',
  thu: 'https://schema.org/Thursday',
  fri: 'https://schema.org/Friday',
  sat: 'https://schema.org/Saturday',
  sun: 'https://schema.org/Sunday',
}

function hhmm(total: number) {
  const t = total % 1440
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

/** schema.org OpeningHoursSpecification from the merged weekly intervals. */
export function openingHoursSpecification(schedule?: Schedule | null) {
  const week = weeklyIntervals(schedule)
  return DAY_KEYS.flatMap((d) =>
    week[d].map((i) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SCHEMA_DAY[d],
      opens: hhmm(i.opens),
      closes: hhmm(i.closes),
    })),
  )
}

/** Google's "holiday hours": closures as specialOpeningHoursSpecification. */
export function specialOpeningHours(schedule?: Schedule | null, now: Date = new Date()) {
  return upcomingClosures(schedule, now).map((c) =>
    c.kind === 'special' && c.opens && c.closes
      ? {
          '@type': 'OpeningHoursSpecification',
          validFrom: c.date,
          validThrough: c.endDate || c.date,
          opens: c.opens,
          closes: c.closes,
        }
      : {
          '@type': 'OpeningHoursSpecification',
          validFrom: c.date,
          validThrough: c.endDate || c.date,
          opens: '00:00',
          closes: '00:00',
        },
  )
}
