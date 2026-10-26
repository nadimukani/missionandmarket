import { closureLine, serviceRows, upcomingClosures, type Schedule } from '@/lib/schedule'

/**
 * How the timetable sits in its column. "start": days, then times, in two
 * left-aligned columns. "center", for centred columns: service names centred,
 * days right-aligned and times left-aligned either side of the centre line.
 * "center sm:start": centred on phones, start-aligned from sm up.
 */
const ALIGN = {
  start: { root: 'text-left', grid: 'grid-cols-[auto_1fr] gap-x-8', days: '' },
  center: { root: 'text-center', grid: 'grid-cols-[1fr_1fr] gap-x-6', days: 'text-right' },
  'center sm:start': {
    root: 'text-center sm:text-left',
    grid: 'grid-cols-[1fr_1fr] gap-x-6 sm:grid-cols-[auto_1fr] sm:gap-x-8',
    days: 'text-right sm:text-left',
  },
} as const

/**
 * Hours, printed from "Hours & Closures" as one timetable: every service
 * shares the same two columns (a grid, subgridded per service and row), so
 * all the days and all the times line up. A long day entry wraps rather than
 * overflowing. Upcoming closures follow.
 */
export function HoursList({
  schedule,
  tone = 'ink',
  compact = false,
  align = 'start',
  showClosures = true,
  className = '',
}: {
  schedule: Schedule | null
  tone?: 'ink' | 'cream'
  compact?: boolean
  align?: keyof typeof ALIGN
  showClosures?: boolean
  className?: string
}) {
  const services = (schedule?.services ?? []).filter((s) => s.periods?.length)
  if (!services.length) return null
  const muted = tone === 'cream' ? 'text-cream/70' : 'text-stone'
  const rule = tone === 'cream' ? 'border-cream/15' : 'border-ink/10'
  const closures = showClosures ? upcomingClosures(schedule).slice(0, 4) : []
  const a = ALIGN[align]
  const sub = 'col-span-full grid grid-cols-subgrid'

  return (
    // Compact lists size to their contents, so a caller's mx-auto centres them.
    <div className={`${a.root} ${compact ? 'w-fit' : ''} ${className}`}>
      <div className={`grid ${a.grid} font-light ${compact ? 'gap-y-5 text-sm' : 'gap-y-7 text-[0.9375rem]'}`}>
        {services.map((s) => (
          <div key={s.name} className={`${sub} ${compact ? 'gap-y-2' : `gap-y-3 border-t pt-5 ${rule}`}`}>
            <p className="col-span-full">
              <span className={compact ? 'label' : 'font-display text-subtitle'}>{s.name}</span>
              {s.note && !compact ? <span className={`ml-3 align-middle text-sm ${muted}`}>{s.note}</span> : null}
            </p>
            <dl className={`${sub} ${compact ? 'gap-y-0.5' : 'gap-y-1'}`}>
              {serviceRows(s, compact).map((r, i) => (
                <div key={i} className={sub}>
                  <dt className={`${a.days} ${muted}`}>{r.days}</dt>
                  <dd className="text-left whitespace-nowrap tabular">{r.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {closures.length ? (
        <div className={`mt-7 border-t pt-5 ${rule}`}>
          <p className={`label ${tone === 'cream' ? 'text-cream/70' : 'text-bronze'}`}>Holiday hours + closures</p>
          <ul className="mt-3 grid gap-1 text-[0.9375rem] font-light">
            {closures.map((c) => (
              <li key={`${c.date}-${c.label}`}>{closureLine(c)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
