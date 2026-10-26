import type { Metadata } from 'next'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { SanityImage } from '@/components/sanity-image'
import { Label, LineLink, Ornament } from '@/components/ui'
import { getGallery, getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'The food, the cocktails, the patio and the dining room at Mission + Market in Buckhead, Atlanta.',
  alternates: { canonical: '/gallery' },
}

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([getGallery(), getSettings()])
  const instagram = settings?.social?.find((s) => s.platform === 'Instagram')?.url

  return (
    <>
      <section className="page pt-20 pb-16 text-center sm:pt-28">
        <Ornament className="h-10 text-bronze" />
        <Label className="mt-8 text-bronze">Gallery</Label>
        <h1 className="mt-6 font-display text-hero font-light">
          The food, the bar + <em>the room</em>
        </h1>
      </section>
      <section aria-label="Photographs" className="px-1 pb-(--section)">
        <div className="columns-2 gap-1 lg:columns-3">
          {images.map((g, i) => (
            <figure key={g._id} className="mb-1 break-inside-avoid">
              <SanityImage
                image={g.image}
                alt={g.alt}
                width={1000}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="h-auto w-full bg-cream"
                loading={i < 6 ? 'eager' : 'lazy'}
              />
            </figure>
          ))}
        </div>
        {instagram ? (
          <p className="mt-16 text-center">
            <LineLink href={instagram}>More on Instagram · @missionandmkt</LineLink>
          </p>
        ) : null}
      </section>
      <BreadcrumbsJsonLd trail={[{ name: 'Gallery', path: '/gallery' }]} />
    </>
  )
}
