import type { Metadata } from 'next'

import { PageHeader } from '@/components/page-header'
import { SanityImage } from '@/components/sanity-image'
import { Shell } from '@/components/ui'
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
        <Shell className="band">
          {/* Masonry via CSS columns: photos keep their native aspect ratio
              instead of being cropped into a uniform grid.
              The column COUNT is derived from a target column width rather
              than fixed at three, so a wide display gets more columns at the
              same comfortable size instead of three enormous ones. */}
          <div className="columns-[22rem] gap-4 space-y-4">
            {images.map((item) => (
              <figure
                key={item._id}
                className="break-inside-avoid overflow-hidden bg-ink/5"
              >
                <SanityImage
                  image={item.image}
                  alt={item.alt}
                  width={900}
                  sizes="(min-width: 640px) 22rem, 100vw"
                  className="w-full"
                />
              </figure>
            ))}
          </div>
        </Shell>
      ) : null}
    </>
  )
}
