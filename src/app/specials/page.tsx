import type { Metadata } from 'next'
import Link from 'next/link'

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
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <ul className="grid gap-12 md:grid-cols-2">
            {specials.map((special) => (
              <li
                key={special._id}
                className="flex flex-col overflow-hidden rounded-sm border border-ink/10"
              >
                {special.image ? (
                  <div className="aspect-16/9 overflow-hidden bg-ink/5">
                    <SanityImage
                      image={special.image}
                      width={1000}
                      height={563}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-7">
                  {special.schedule ? (
                    <p className="eyebrow text-ember">{special.schedule}</p>
                  ) : null}
                  <h2 className="mt-3 font-display text-2xl text-ink">
                    {special.title}
                  </h2>
                  {special.price ? (
                    <p className="mt-1 font-sans text-sm text-ink/70">
                      {special.price}
                    </p>
                  ) : null}
                  {special.description ? (
                    <p className="mt-3 font-sans text-sm leading-relaxed text-ink/60">
                      {special.description}
                    </p>
                  ) : null}

                  <div className="mt-6 pt-2">
                    {special.ctaUrl ? (
                      <a
                        href={special.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm text-ember underline underline-offset-4 hover:text-ember-bright"
                      >
                        {special.ctaLabel ?? 'Learn more'} →
                      </a>
                    ) : (
                      <Link
                        href="/reservations"
                        className="font-sans text-sm text-ember underline underline-offset-4 hover:text-ember-bright"
                      >
                        {special.ctaLabel ?? 'Reserve a table'} →
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}
