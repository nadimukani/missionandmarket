import type { Metadata } from 'next'

import { PageHeader } from '@/components/page-header'
import { SanityImage } from '@/components/sanity-image'
import { getGallery } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Inside Mission + Market — the dining room, the heated patio, the bar and the food, in Buckhead, Atlanta.',
  alternates: { canonical: '/gallery' },
}

export default async function GalleryPage() {
  const images = await getGallery()

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Inside the room"
        intro={images.length ? undefined : 'Photography coming soon.'}
      />

      {images.length ? (
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          {/* Masonry via CSS columns: photos keep their native aspect ratio
              instead of being cropped into a uniform grid. */}
          <div className="gap-4 space-y-4 sm:columns-2 lg:columns-3">
            {images.map((item) => (
              <figure
                key={item._id}
                className="break-inside-avoid overflow-hidden rounded-sm bg-ink/5"
              >
                <SanityImage
                  image={item.image}
                  alt={item.alt}
                  width={900}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full"
                />
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
