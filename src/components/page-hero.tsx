import type { ReactNode } from 'react'

import { SanityImage } from '@/components/sanity-image'
import { Emphasis, Label, Ornament } from '@/components/ui'
import type { SanityImage as SanityImageType } from '@/sanity/types'

/**
 * Interior page opening: a coloured panel with the words, and one photograph
 * at full height beside it. Split rather than full-bleed so portrait
 * photography stays sharp on large retina screens.
 */
export function PageHero({
  label,
  title,
  intro,
  image,
  children,
  tone = 'paper',
  flip = false,
}: {
  label?: string
  title: string
  intro?: ReactNode
  image?: SanityImageType | null
  children?: ReactNode
  tone?: 'paper' | 'moss' | 'teal' | 'cream'
  flip?: boolean
}) {
  const panel =
    tone === 'moss'
      ? 'bg-moss text-cream'
      : tone === 'teal'
        ? 'bg-teal text-cream'
        : tone === 'cream'
          ? 'bg-cream text-ink'
          : 'bg-paper text-ink'
  const dark = tone === 'moss' || tone === 'teal'

  return (
    <section className={`grid lg:min-h-[calc(88svh-var(--header-h))] ${image ? 'lg:grid-cols-2' : ''}`}>
      <div
        className={`flex flex-col items-center justify-center px-(--gutter) py-20 text-center sm:py-28 ${panel} ${
          flip ? 'lg:order-2' : ''
        }`}
      >
        <div className="rise max-w-xl">
          <Ornament className={`h-10 ${dark ? 'text-cream/55' : 'text-bronze'}`} />
          {label ? <Label className={`mt-8 ${dark ? 'text-cream/70' : 'text-bronze'}`}>{label}</Label> : null}
          <h1 className="mt-6 font-display text-hero font-light">
            <Emphasis text={title} />
          </h1>
          {intro ? (
            <div className={`mx-auto mt-8 max-w-md text-lead font-light ${dark ? 'text-mist' : 'text-ink-soft'}`}>
              {intro}
            </div>
          ) : null}
          {children ? <div className="mt-10 flex flex-wrap justify-center gap-3">{children}</div> : null}
        </div>
      </div>
      {image ? (
        <div className={`relative min-h-[62svh] overflow-hidden bg-ink lg:min-h-0 ${flip ? 'lg:order-1' : ''}`}>
          <SanityImage
            image={image}
            width={1400}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute inset-0 size-full object-cover"
            priority
          />
        </div>
      ) : null}
    </section>
  )
}
