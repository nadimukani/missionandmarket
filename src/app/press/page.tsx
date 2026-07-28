import type { Metadata } from 'next'

import { PageHeader } from '@/components/page-header'
import { SanityImage } from '@/components/sanity-image'
import { Measure } from '@/components/ui'
import { getPress } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Press',
  description:
    'Mission + Market in the press — reviews, features and coverage from Atlanta and beyond.',
  alternates: { canonical: '/press' },
}

function formatDate(iso?: string) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d)))
}

export default async function PressPage() {
  const items = await getPress()

  return (
    <>
      <PageHeader
        eyebrow="Press"
        title="In the news"
        intro={items.length ? undefined : 'Coverage coming soon.'}
      />

      {items.length ? (
        <Measure className="band">
          <ul className="divide-y divide-rule">
            {items.map((item) => (
              <li key={item._id} className="py-8 first:pt-0">
                {/* The Studio offers a Publication logo field and the query
                    has always selected it; nothing rendered it, so an uploaded
                    masthead appeared in the Studio preview and nowhere else. */}
                {item.logo ? (
                  <SanityImage
                    image={item.logo}
                    width={320}
                    alt={item.publication ? `${item.publication} logo` : ''}
                    className="mb-4 h-8 w-auto opacity-70"
                  />
                ) : null}
                <p className="eyebrow text-brass">
                  {[item.publication, formatDate(item.date)]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <h2 className="mt-3 font-display text-2xl text-ink">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-brass"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h2>
                {item.excerpt ? (
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                    {item.excerpt}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Measure>
      ) : null}
    </>
  )
}
