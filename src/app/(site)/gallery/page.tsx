import type { Metadata } from 'next'

import { PageIntro } from '@/components/page-intro'
import { SanityImage } from '@/components/sanity-image'
import { getGallery, getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'The food, the cocktails, the patio and the room at Mission + Market in Buckhead, Atlanta.',
  alternates: { canonical: '/gallery' },
}

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([getGallery(), getSettings()])
  const instagram = settings?.social?.find((s) => s.platform === 'Instagram')?.url

  return (
    <>
      <PageIntro eyebrow="Gallery" title="The food, the bar + *the room*" />
      <section className="page pb-(--section)" aria-label="Photographs">
        <div className="columns-2 gap-4 sm:gap-5 lg:columns-3">
          {images.map((g, i) => (
            <figure key={g._id} className="mb-4 break-inside-avoid sm:mb-5">
              <SanityImage
                image={g.image}
                alt={g.alt}
                width={900}
                sizes="(min-width: 1024px) 31vw, 50vw"
                className="h-auto w-full bg-cream"
                loading={i < 6 ? 'eager' : 'lazy'}
              />
            </figure>
          ))}
        </div>
        {instagram ? (
          <p className="mt-14 text-lead text-stone">
            More on{' '}
            <a className="link text-ink" href={instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            .
          </p>
        ) : null}
      </section>
    </>
  )
}
