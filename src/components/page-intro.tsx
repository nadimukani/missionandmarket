import type { ReactNode } from 'react'

import { SanityImage } from '@/components/sanity-image'
import { Emphasis, Eyebrow } from '@/components/ui'
import type { SanityImage as SanityImageType } from '@/sanity/types'

/**
 * The opening of every interior page: words on the left, one photograph on
 * the right. Without a photograph the words take the full measure. Pages open
 * light — the site's dark surfaces are reserved for the bar.
 */
export function PageIntro({
  eyebrow,
  title,
  intro,
  image,
  children,
  imageSizes = '(min-width: 1024px) 45vw, 100vw',
}: {
  eyebrow?: string
  title: string
  intro?: string
  image?: SanityImageType | null
  children?: ReactNode
  imageSizes?: string
}) {
  return (
    <section className="page pt-12 pb-16 sm:pt-16 lg:pt-20 lg:pb-24">
      <div className={`grid gap-12 ${image ? 'lg:grid-cols-12 lg:items-end lg:gap-10' : ''}`}>
        <div className={image ? 'lg:col-span-6 lg:pb-6' : 'max-w-4xl'}>
          {eyebrow ? <Eyebrow className="text-bronze">{eyebrow}</Eyebrow> : null}
          <h1 className="mt-5 font-display text-[clamp(2.75rem,1.8rem+3.6vw,5.5rem)] leading-[0.98] tracking-[-0.01em]">
            <Emphasis text={title} />
          </h1>
          {intro ? <p className="mt-7 max-w-[36rem] text-lead text-stone">{intro}</p> : null}
          {children ? <div className="mt-9">{children}</div> : null}
        </div>
        {image ? (
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-[4/5] overflow-hidden bg-cream">
              <SanityImage
                image={image}
                width={1000}
                height={1250}
                sizes={imageSizes}
                className="size-full object-cover"
                priority
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
