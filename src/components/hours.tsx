import type { HoursRow } from '@/sanity/types'

/** Groups the CMS rows by service so "Dinner" prints once with its days
 *  beneath it, in the order the services first appear. */
export function groupHours(rows: HoursRow[] = []) {
  const groups = new Map<string, HoursRow[]>()
  for (const row of rows) {
    const list = groups.get(row.service)
    if (list) list.push(row)
    else groups.set(row.service, [row])
  }
  return [...groups.entries()]
}

const SHORT_DAYS: [RegExp, string][] = [
  [/Monday/g, 'Mon'],
  [/Tuesday/g, 'Tue'],
  [/Wednesday/g, 'Wed'],
  [/Thursday/g, 'Thu'],
  [/Friday/g, 'Fri'],
  [/Saturday/g, 'Sat'],
  [/Sunday/g, 'Sun'],
]

function shortDays(days?: string) {
  return SHORT_DAYS.reduce((d, [re, short]) => d.replace(re, short), days ?? '')
}

export function HoursList({
  hours,
  tone = 'ink',
  className = '',
  compact = false,
}: {
  hours?: HoursRow[]
  tone?: 'ink' | 'cream'
  className?: string
  /** Abbreviated day names, for narrow columns like the footer. */
  compact?: boolean
}) {
  const groups = groupHours(hours)
  if (!groups.length) return null
  const muted = tone === 'cream' ? 'text-mist' : 'text-stone'
  const rule = tone === 'cream' ? 'border-cream/15' : 'border-ink/10'

  return (
    <dl className={`grid gap-6 ${className}`}>
      {groups.map(([service, rows]) => (
        <div key={service} className={`border-t pt-4 ${rule}`}>
          <dt className="font-display text-card">{service}</dt>
          <dd className="mt-2">
            <ul className="grid gap-1.5">
              {rows.map((r, i) => (
                <li key={i} className="flex flex-wrap justify-between gap-x-6 text-[0.9375rem]">
                  <span className={muted}>{compact ? shortDays(r.days) : r.days}</span>
                  <span className="tabular">{r.time}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  )
}
