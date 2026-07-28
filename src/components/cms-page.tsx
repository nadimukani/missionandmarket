import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

import { PageHeader } from '@/components/page-header'
import { PortableBody } from '@/components/portable-body'
import { SanityImage } from '@/components/sanity-image'
import { Measure, Shell } from '@/components/ui'
import { SITE_URL } from '@/lib/site'
import { urlForImage } from '@/sanity/image'
import { getPage } from '@/sanity/queries'
import type { Page, SanityImage as SanityImageType } from '@/sanity/types'

/** Interior pages (About, Private Events, …) are plain CMS documents, so the
 *  client can add a new one without a deploy. */
export async function cmsPageMetadata(
  slug: string,
  fallback: Metadata = {},
): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return fallback

  const title = page.seo?.title ?? page.title
  const description =
    page.seo?.description ?? page.intro ?? (fallback.description as string)

  // Without an explicit openGraph block a subpage inherits the root layout's,
  // so every share of /private-events used to carry the homepage's title, URL
  // and photograph. The seo.image field was offered in the Studio and read
  // nowhere — a client uploading a share card for the page they most want to
  // promote got no share card.
  const share = page.seo?.image
    ? urlForImage(page.seo.image as SanityImageType)
        .width(1200)
        .height(630)
        .fit('crop')
        .url()
    : undefined

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${slug}`,
      ...(share ? { images: [{ url: share, width: 1200, height: 630 }] } : {}),
    },
  }
}

/** Full-width CMS hero image, on the page rail. */
export function CmsHero({ image }: { image: SanityImageType }) {
  return (
    <Shell>
      <div className="-mt-10 aspect-16/7 overflow-hidden rounded-xs lg:-mt-14">
        <SanityImage
          image={image}
          width={2400}
          height={1050}
          priority
          sizes="(min-width: 1728px) 1536px, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
    </Shell>
  )
}

/** Long-form CMS body copy, on the reading measure. */
export function CmsBody({ body }: { body: NonNullable<Page['body']> }) {
  return (
    <Measure className="band font-sans text-base text-ink-muted">
      <PortableText value={body} components={PortableBody} />
    </Measure>
  )
}

export async function CmsPage({
  slug,
  eyebrow,
}: {
  slug: string
  eyebrow?: string
}) {
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={page.title} intro={page.intro} />
      {page.heroImage ? <CmsHero image={page.heroImage} /> : null}
      {page.body?.length ? <CmsBody body={page.body} /> : null}
    </>
  )
}
