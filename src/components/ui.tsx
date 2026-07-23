import Link from 'next/link'

import type { HoursRow } from '@/sanity/types'

/**
 * The small set of primitives every page shares.
 *
 * These exist because the review found the same patterns hand-written over
 * and over — twelve copies of the brass underline link, four CTA buttons with
 * three different paddings, four hours tables with four markup shapes — and
 * the copies had drifted. Two of them used raw brass on a dark ground, which
 * fails contrast; that is exactly the class of bug a shared component makes
 * impossible rather than merely unlikely.
 */

type Tone = 'light' | 'dark'

/**
 * Inline text link. `tone` is not decoration — brass is only legible on light
 * grounds (4.96:1); on ink it drops to 3.10:1 and must use the lifted tint.
 * Passing the tone rather than the colour is what stops that being got wrong.
 */
export function TextLink({
  href,
  children,
  tone = 'light',
  external,
  className = '',
}: {
  /** Optional on purpose: helpers like telHref return undefined when the CMS
   *  has no phone number. A link with nowhere to go renders as plain text
   *  rather than as a dead control. */
  href?: string
  children: React.ReactNode
  tone?: Tone
  external?: boolean
  className?: string
}) {
  const styles =
    tone === 'dark'
      ? 'text-brass-ondark hover:text-cream'
      : 'text-brass hover:text-ink'

  const classes = `font-sans underline underline-offset-4 transition-colors ${styles} ${className}`

  if (!href) return <span className={className}>{children}</span>

  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)

  return isExternal ? (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={classes}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

type ButtonVariant = 'primary' | 'solid' | 'outline' | 'onDark'

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  // Brass fill — the booking CTA. Hover darkens; lightening drops cream to
  // 4.35:1, below AA.
  primary: 'bg-brass-button text-cream hover:bg-brass-button-hover',
  solid: 'bg-ink text-cream hover:bg-moss',
  outline: 'border border-ink/25 text-ink hover:border-ink',
  onDark: 'border border-cream/35 text-cream hover:border-cream',
}

/** One padding, one radius, one type size for every call to action. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external,
  className = '',
}: {
  href: string
  children: React.ReactNode
  variant?: ButtonVariant
  external?: boolean
  className?: string
}) {
  const classes =
    'inline-flex items-center justify-center rounded-xs px-8 py-3.5 text-center ' +
    `font-sans text-sm font-medium tracking-wide transition-colors ${BUTTON_STYLES[variant]} ${className}`

  const isExternal = external ?? href.startsWith('http')

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

/**
 * Service hours.
 *
 * Grouped by service, because Dinner runs five different day/time ranges and
 * listing each as its own "Dinner" row printed the word five times down the
 * column — messy, and it buried the one thing a guest scans for. The service
 * name now appears once, with its schedule beneath it.
 *
 * One markup shape, used by the footer, /contact, /reservations and the
 * homepage, so the hours read identically everywhere and a change happens once.
 */
export function HoursList({
  hours,
  tone = 'light',
  columns = 1,
}: {
  hours?: HoursRow[]
  tone?: Tone
  /** 2 lets a long list (dinner + the rest) flow into two balanced columns. */
  columns?: 1 | 2
}) {
  if (!hours?.length) return null

  const label = tone === 'dark' ? 'text-cream' : 'text-ink'
  const value = tone === 'dark' ? 'text-cream-muted' : 'text-ink-muted'

  // Collapse consecutive rows that share a service into one group, keeping the
  // order the client set in the CMS.
  const groups: { service: string; rows: HoursRow[] }[] = []
  for (const row of hours) {
    const last = groups[groups.length - 1]
    if (last && last.service === row.service) last.rows.push(row)
    else groups.push({ service: row.service, rows: [row] })
  }

  return (
    <dl
      className={
        columns === 2
          ? 'grid gap-x-12 gap-y-6 font-sans text-sm sm:grid-cols-2'
          : 'space-y-5 font-sans text-sm'
      }
    >
      {groups.map((group) => (
        <div key={group.service} className="break-inside-avoid">
          <dt className={`font-medium ${label}`}>{group.service}</dt>
          <dd className="mt-1.5 space-y-1">
            {group.rows.map((row, i) => (
              <div
                key={`${row.days}-${row.time}-${i}`}
                className="flex justify-between gap-6"
              >
                {row.days ? <span className={value}>{row.days}</span> : null}
                <span className={`shrink-0 tabular-nums ${value}`}>
                  {row.time}
                </span>
              </div>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * The page shell. Every full-width band routes through this so the header,
 * footer, notice banner and page content share one rail — three of them had
 * drifted to a narrower `max-w-7xl` and no longer lined up.
 */
export function Shell({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[88rem] px-5 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}
