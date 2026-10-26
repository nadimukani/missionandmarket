import { closureLine, serviceRows, upcomingClosures, type Schedule } from '@/lib/schedule'

/**
 * Hours, printed from "Hours & Closures". Services in the order the owner
 * lists them; each with its days and times. Upcoming closures follow.
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

  return (
    <div className={className}>
      <dl className={`grid ${compact ? 'gap-5' : 'gap-7'}`}>
        {services.map((s) => (
          <div key={s.name} className={compact ? '' : `border-t pt-5 ${rule}`}>
            <dt className={compact ? 'label' : 'font-display text-subtitle'}>
              {s.name}
              {s.note && !compact ? <span className={`ml-3 align-middle text-sm font-light font-sans ${muted}`}>{s.note}</span> : null}
            </dt>
            <dd className="mt-2">
              <ul className={`grid ${compact ? 'gap-0.5' : 'gap-1'}`}>
                {serviceRows(s, compact).map((r, i) => (
                  <li key={i} className={`flex flex-wrap justify-between gap-x-6 font-light ${compact ? 'text-sm' : 'text-[0.9375rem]'}`}>
                    <span className={muted}>{r.days}</span>
                    <span className="tabular">{r.time}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
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
