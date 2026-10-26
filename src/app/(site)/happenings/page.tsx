import type { Metadata } from 'next'

import { HappeningCard } from '@/components/happening-card'
import { PageIntro } from '@/components/page-intro'
import { getSettings, getSpecials } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Happenings',
  description:
    'Happy hour, the chef’s tasting, holiday parties and what’s on at Mission + Market in Buckhead, Atlanta.',
  alternates: { canonical: '/happenings' },
}

export default async function HappeningsPage() {
  const [specials, settings] = await Promise.all([getSpecials(), getSettings()])
  const instagram = settings?.social?.find((s) => s.platform === 'Instagram')?.url

  return (
    <>
      <PageIntro
        eyebrow="What’s on"
        title="Happenings"
        intro="Happy hour, the weekend tasting and what’s coming up — updated by the restaurant as plans change."
      />
      <section className="page pb-(--section)" aria-label="Happenings">
        {specials.length ? (
          <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {specials.map((s) => (
              <HappeningCard key={s._id} item={s} />
            ))}
          </div>
        ) : (
          <p className="max-w-prose text-lead text-stone">
            Nothing scheduled right now.
            {instagram ? (
              <>
                {' '}
                Follow along on{' '}
                <a className="link text-ink" href={instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>{' '}
                for what’s next.
              </>
            ) : null}
          </p>
        )}
      </section>
    </>
  )
}
