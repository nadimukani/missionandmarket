import Link from 'next/link'

import { SanityImage } from '@/components/sanity-image'
import { Arrow } from '@/components/ui'
import type { Special } from '@/sanity/types'

const KIND_LABEL: Record<NonNullable<Special['kind']>, string> = {
  weekly: 'Every week',
  seasonal: 'Seasonal',
  event: 'One night only',
}

function formatEventDate(iso?: string) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d)))
}

export function HappeningCard({
  item,
  tone = 'ink',
  sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw',
}: {
  item: Special
  tone?: 'ink' | 'cream'
  sizes?: string
}) {
  const muted = tone === 'cream' ? 'text-mist' : 'text-stone'
  const label = item.kind === 'event' && item.startDate ? formatEventDate(item.startDate) : item.kind ? KIND_LABEL[item.kind] : null
  const href = item.ctaUrl
  const external = href ? /^https?:/.test(href) : false

  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        {item.image ? (
          <SanityImage
            image={item.image}
            width={900}
            height={1125}
            sizes={sizes}
            className="size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.02]"
          />
        ) : null}
        {label ? (
          <span className="eyebrow absolute top-4 left-4 bg-paper/90 px-2.5 py-1.5 text-ink backdrop-blur-sm">
            {label}
          </span>
        ) : null}
      </div>
      <div className="mt-6">
        {item.schedule ? <p className={`eyebrow ${tone === 'cream' ? 'text-mist' : 'text-bronze'}`}>{item.schedule}</p> : null}
        <h3 className="mt-3 font-display text-card">{item.title}</h3>
        {item.description ? <p className={`mt-3 text-[0.9375rem] ${muted}`}>{item.description}</p> : null}
        {item.price ? <p className="mt-3 tabular">{item.price}</p> : null}
        {href && item.ctaLabel ? (
          <span className="eyebrow mt-5 inline-flex items-center gap-2.5">
            <span className="link">{item.ctaLabel}</span>
            <Arrow className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        ) : null}
      </div>
    </>
  )

  if (!href) return <article className="group">{body}</article>
  return (
    <article>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
          {body}
        </a>
      ) : (
        <Link href={href} className="group block">
          {body}
        </Link>
      )}
    </article>
  )
}
