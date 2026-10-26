import Link from 'next/link'

import { SanityImage } from '@/components/sanity-image'
import { Label } from '@/components/ui'
import { findService, formatDate, serviceSummary, type Schedule } from '@/lib/schedule'
import type { Special } from '@/sanity/types'

/** When it happens — from Hours & Closures when the happening is tied to a
 *  service, otherwise the happening's own wording or event date. */
export function whenLine(item: Special, schedule: Schedule | null) {
  if (item.service) {
    const s = findService(schedule, item.service)
    if (s) return serviceSummary(s)
  }
  if (item.kind === 'event' && item.startDate) return formatDate(item.startDate)
  return item.schedule ?? ''
}

function CtaLink({ item, className = '' }: { item: Special; className?: string }) {
  if (!item.ctaUrl || !item.ctaLabel) return null
  const ext = /^https?:/.test(item.ctaUrl)
  const cls = `label link-line ${className}`
  return ext ? (
    <a href={item.ctaUrl} className={cls} target="_blank" rel="noopener noreferrer">
      {item.ctaLabel}
    </a>
  ) : (
    <Link href={item.ctaUrl} className={cls}>
      {item.ctaLabel}
    </Link>
  )
}

/** Home page: a quiet, typographic list — no cards. */
export function HappeningsList({ items, schedule }: { items: Special[]; schedule: Schedule | null }) {
  // As many columns as there are items (max three), so no cell sits empty.
  const cols = items.length >= 3 && items.length !== 4 ? 3 : Math.min(items.length, 2)
  const grid = cols === 3 ? 'md:grid-cols-3' : cols === 2 ? 'md:grid-cols-2' : ''
  return (
    <ul className={`grid border-t border-ink/12 ${grid}`}>
      {items.map((item, i) => (
        <li
          key={item._id}
          className={`border-b border-ink/12 px-2 py-12 text-center md:px-10 ${
            (i + 1) % cols !== 0 ? 'md:border-r' : ''
          }`}
        >
          <Label className="text-bronze">{whenLine(item, schedule)}</Label>
          <h3 className="mt-4 font-display text-title font-light">{item.title}</h3>
          {item.description ? (
            <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] font-light text-ink-soft">{item.description}</p>
          ) : null}
          <CtaLink item={item} className="mt-6 text-ink" />
        </li>
      ))}
    </ul>
  )
}

/** Happenings page: one full-bleed row each, alternating. */
export function HappeningRow({
  item,
  schedule,
  flip,
}: {
  item: Special
  schedule: Schedule | null
  flip?: boolean
}) {
  const body = (
    <div className="max-w-md text-center">
      <Label className="text-bronze">{whenLine(item, schedule)}</Label>
      <h2 className="mt-6 font-display text-display font-light">{item.title}</h2>
      {item.description ? <p className="mt-6 text-lead font-light text-ink-soft">{item.description}</p> : null}
      {item.price ? <p className="mt-4 font-display text-subtitle">{item.price}</p> : null}
      <CtaLink item={item} className="mt-9 text-ink" />
    </div>
  )

  if (!item.image) {
    return (
      <article className="flex justify-center border-t border-ink/10 px-(--gutter) py-24 sm:py-32">{body}</article>
    )
  }
  return (
    <article className="grid lg:min-h-[80svh] lg:grid-cols-2">
      <div className={`relative min-h-[56svh] overflow-hidden lg:min-h-0 ${flip ? 'lg:order-2' : ''}`}>
        <SanityImage
          image={item.image}
          width={1400}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="flex items-center justify-center px-(--gutter) py-20 sm:py-28">{body}</div>
    </article>
  )
}
