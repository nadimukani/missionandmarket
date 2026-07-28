import Link from 'next/link'
import { Fragment } from 'react'

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
  // The rule resolving is the more refined affordance than the text moving:
  // the underline starts held back and comes up to full strength on hover,
  // while the colour stays above AA at both ends.
  const styles =
    tone === 'dark'
      ? 'text-brass-ondark decoration-brass-ondark/40 hover:text-cream hover:decoration-cream'
      : 'text-brass decoration-brass/35 hover:text-ink hover:decoration-brass'

  const classes =
    'font-sans underline underline-offset-4 transition-[color,text-decoration-color] ' +
    `duration-300 ease-out-soft ${styles} ${className}`

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
  ariaLabel,
}: {
  href: string
  children: React.ReactNode
  variant?: ButtonVariant
  external?: boolean
  className?: string
  /** For repeated CTAs — six "Apply" links need six distinct names. */
  ariaLabel?: string
}) {
  // Colour only — no lift, no scale. A call to action that jumps under the
  // cursor reads as a landing page, not a restaurant.
  const classes =
    'inline-flex items-center justify-center px-9 py-4 text-center ' +
    'font-sans text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200 ' +
    `ease-out-soft ${BUTTON_STYLES[variant]} ${className}`

  const isExternal = external ?? href.startsWith('http')

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </a>
  ) : (
    <Link href={href} aria-label={ariaLabel} className={classes}>
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
}: {
  hours?: HoursRow[]
  tone?: Tone
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

  // Two aligned columns — day left, time in a shared column so every time
  // begins at the same x and the list scans top-to-bottom. The layout is
  // capped at a comfortable reading width so day and time stay close together
  // on a desktop instead of drifting to opposite edges, and that same cap is
  // wider than a phone, so the columns render identically at both sizes.
  //
  // `auto` sizes the day column to its longest label ("Monday – Wednesday");
  // the time keeps `whitespace-nowrap` so a clock reading is never split, and
  // the widest day + time comfortably fit within the cap on a 360px phone.
  return (
    <dl className="grid max-w-xs grid-cols-[auto_1fr] gap-x-6 font-sans text-sm">
      {groups.map((group, g) => (
        <Fragment key={group.service}>
          <dt
            className={`col-span-2 font-medium ${label} ${g > 0 ? 'mt-5' : ''}`}
          >
            {group.service}
          </dt>
          {group.rows.map((row, i) => (
            <Fragment key={`${row.days}-${row.time}-${i}`}>
              <dd className={`mt-1.5 ${value}`}>{row.days}</dd>
              <dd
                className={`mt-1.5 tabular-nums whitespace-nowrap ${value}`}
              >
                {row.time}
              </dd>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </dl>
  )
}

/**
 * The page shell. Every band-aligned surface routes through this so the
 * header, notice banner, footer, page mastheads and page bodies share one
 * rail.
 *
 * This existed before and claimed to have fixed exactly that, but was used
 * in two places against twenty-four hand-rolled containers — so the site
 * still ran six widths and two gutters, and every interior page's masthead
 * sat on a different left edge from its own body. The rail is now a single
 * CSS utility (`rail`, globals.css) rather than a class string that has to
 * be re-typed correctly each time.
 */
export function Shell({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`rail ${className}`}>{children}</div>
}

/**
 * Long-form reading column — CMS bodies, job and press listings, the 404.
 *
 * The cap is on the content and the gutter sits outside it, so the measure
 * holds near 72 characters at any viewport. The old `max-w-3xl` minus its
 * padding came out at ~88 characters, which is past the point where the eye
 * loses the start of the next line.
 */
export function Measure({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`measure ${className}`}>{children}</div>
}
