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
 * Service hours. One markup shape, so the hours read identically in the
 * footer, on /contact, on /reservations and on the homepage — and a change to
 * how a service is presented happens once.
 */
export function HoursList({
  hours,
  tone = 'light',
  layout = 'stacked',
}: {
  hours?: HoursRow[]
  tone?: Tone
  /** `stacked` for narrow columns, `split` for a full-width two-column row. */
  layout?: 'stacked' | 'split'
}) {
  if (!hours?.length) return null

  const label = tone === 'dark' ? 'text-cream' : 'text-ink'
  const value = tone === 'dark' ? 'text-cream-muted' : 'text-ink-muted'
  const rule = tone === 'dark' ? 'border-cream/10' : 'border-rule'

  return (
    <dl
      className={
        layout === 'split'
          ? 'grid gap-x-10 sm:grid-cols-2'
          : 'space-y-3 font-sans text-sm'
      }
    >
      {hours.map((row) => (
        <div
          key={`${row.service}-${row.days}-${row.time}`}
          className={
            layout === 'split'
              ? `flex justify-between gap-4 border-b py-3 font-sans text-sm ${rule}`
              : ''
          }
        >
          <dt className={label}>
            {row.service}
            {row.days ? (
              <span className={`block text-xs ${value}`}>{row.days}</span>
            ) : null}
          </dt>
          <dd className={`${value} tabular-nums`}>{row.time}</dd>
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
