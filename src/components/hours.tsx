import { closureLine, serviceRows, upcomingClosures, type Schedule } from '@/lib/schedule'

/**
 * Hours, printed from "Hours & Closures" as one timetable. Every service
 * shares the same four columns (a grid, subgridded per service and row), so
 * the days line up and every range shares one dash: opening times
 * right-align against it, closing times left-align after it. The days column
 * fits its longest entry and wraps only when the screen is too narrow.
 * Upcoming closures follow.
 */
export function HoursList({
  schedule,
  tone = 'ink',
  compact = false,
  showClosures = true,
  className = '',
}: {
  schedule: Schedule | null
  tone?: 'ink' | 'cream'
  compact?: boolean
  showClosures?: boolean
  className?: string
}) {
  const services = (schedule?.services ?? []).filter((s) => s.periods?.length)
  if (!services.length) return null
  const muted = tone === 'cream' ? 'text-cream/70' : 'text-stone'
  const rule = tone === 'cream' ? 'border-cream/15' : 'border-ink/10'
  const closures = showClosures ? upcomingClosures(schedule).slice(0, 4) : []
  const sub = 'col-span-full grid grid-cols-subgrid'

  return (
    // Always left-aligned inside; compact lists size to their contents, so a
    // caller's mx-auto centres the whole block.
    <div className={`text-left ${compact ? 'w-fit' : ''} ${className}`}>
      <div
        className={`grid grid-cols-[auto_auto_auto_1fr] font-light ${
          compact ? 'gap-y-5 text-sm' : 'gap-y-7 text-[0.9375rem]'
        }`}
      >
        {services.map((s) => (
          <div key={s.name} className={`${sub} ${compact ? 'gap-y-2' : `gap-y-3 border-t pt-5 ${rule}`}`}>
            <p className="col-span-full">
              <span className={compact ? 'label' : 'font-display text-subtitle'}>{s.name}</span>
              {s.note && !compact ? <span className={`ml-3 align-middle text-sm ${muted}`}>{s.note}</span> : null}
            </p>
            <dl className={`${sub} ${compact ? 'gap-y-0.5' : 'gap-y-1'}`}>
              {serviceRows(s, compact).map((r, i) => (
                <div key={i} className={sub}>
                  <dt className={`pr-8 ${muted}`}>{r.days}</dt>
                  <dd className="col-span-3 grid grid-cols-subgrid whitespace-nowrap tabular">
                    <span className="text-right">{r.opens}</span>
                    <span className={`px-2 ${muted}`} aria-hidden="true">
                      –
                    </span>
                    <span>
                      <span className="sr-only">to </span>
                      {r.closes}
                    </span>
                  </dd>
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
