import type { Metadata } from 'next'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { HappeningRow } from '@/components/happenings'
import { PageHero } from '@/components/page-hero'
import { LineLink } from '@/components/ui'
import { getGallery, getSchedule, getSettings, getSpecials } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Happenings — Happy Hour, Tasting Menu + More',
  description:
    'Happy hour, the chef’s tasting menu, Beef Wellington nights and holiday parties at Mission + Market in Buckhead, Atlanta.',
  alternates: { canonical: '/happenings' },
}

export default async function HappeningsPage() {
  const [specials, schedule, settings, gallery] = await Promise.all([
    getSpecials(),
    getSchedule(),
    getSettings(),
    getGallery(),
  ])
  const instagram = settings?.social?.find((s) => s.platform === 'Instagram')?.url
  const hero = gallery.find((g) => g._id === 'gallery-mm-0925-24-cocktail-lineup-room')?.image

  return (
    <>
      <PageHero
        label="Happenings"
        title="What’s *On*"
        intro="Every week at Mission + Market — and what’s coming up this season."
        image={hero}
        tone="teal"
      />
      {specials.length ? (
        <div>
          {specials.map((s, i) => (
            <HappeningRow key={s._id} item={s} schedule={schedule} flip={i % 2 === 1} />
          ))}
        </div>
      ) : (
        <section className="page section-y text-center">
          <p className="mx-auto max-w-prose text-lead font-light text-ink-soft">Nothing scheduled right now.</p>
          {instagram ? <LineLink href={instagram} className="mt-8">Follow along on Instagram</LineLink> : null}
        </section>
      )}
      <BreadcrumbsJsonLd trail={[{ name: 'Happenings', path: '/happenings' }]} />
    </>
  )
}
