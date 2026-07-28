import type { Metadata } from 'next'

import { Shell, TextLink } from '@/components/ui'

import { PageHeader } from '@/components/page-header'
import { SanityImage } from '@/components/sanity-image'
import { getSpecials } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Specials',
  description:
    'Happy hour, half-price wine, cocktail classes and seasonal offers at Mission + Market in Buckhead, Atlanta.',
  alternates: { canonical: '/specials' },
}

export default async function SpecialsPage() {
  const specials = await getSpecials()

  return (
    <>
      <PageHeader
        eyebrow="What's on"
        title="Specials & offers"
        intro={
          specials.length
            ? undefined
            : 'Nothing running right now — check back soon, or follow us for the latest.'
        }
      />

      {specials.length ? (
        <Shell className="band">
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-12">
            {specials.map((special) => (
              <li
                key={special._id}
                className="flex flex-col border-t border-ink/25 pt-6"
              >
                {special.image ? (
                  <div className="aspect-16/9 overflow-hidden bg-ink/5">
                    <SanityImage
                      image={special.image}
                      width={1000}
                      height={563}
                      sizes="(min-width: 768px) 20rem, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col pt-6">
                  {special.schedule ? (
                    <p className="eyebrow text-brass">{special.schedule}</p>
                  ) : null}
                  <h2 className="mt-3 font-display text-sub text-ink">
                    {special.title}
                  </h2>
                  {special.price ? (
                    <p className="mt-1 font-sans text-sm text-ink-muted">
                      {special.price}
                    </p>
                  ) : null}
                  {special.description ? (
                    <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                      {special.description}
                    </p>
                  ) : null}

                  {/* With no link, the label falls back to the generic one
                      too. Keeping the client's bespoke label —"Book the
                      cocktail class" — while silently pointing it at the table
                      reservation form promises something the link does not
                      deliver. */}
                  <div className="mt-6 pt-2">
                    {special.ctaUrl ? (
                      <TextLink href={special.ctaUrl}>
                        {special.ctaLabel ?? 'Learn more'} →
                      </TextLink>
                    ) : (
                      <TextLink href="/reservations">Reserve a table →</TextLink>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Shell>
      ) : null}
    </>
  )
}
