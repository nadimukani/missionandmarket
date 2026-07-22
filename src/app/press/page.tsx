import type { Metadata } from 'next'

import { PageHeader } from '@/components/page-header'
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
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
          <ul className="divide-y divide-ink/10">
            {items.map((item) => (
              <li key={item._id} className="py-8 first:pt-0">
                <p className="eyebrow text-ember">
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
                      className="underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ember"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h2>
                {item.excerpt ? (
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink/60">
                    {item.excerpt}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}
