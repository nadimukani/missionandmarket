import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

import { PageHeader } from '@/components/page-header'
import { PortableBody } from '@/components/portable-body'
import { SanityImage } from '@/components/sanity-image'
import { getPage } from '@/sanity/queries'

/** Interior pages (About, Private Events, …) are plain CMS documents, so the
 *  client can add a new one without a deploy. */
export async function cmsPageMetadata(
  slug: string,
  fallback: Metadata = {},
): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return fallback

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? page.intro ?? fallback.description,
    alternates: { canonical: `/${slug}` },
  }
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

      {page.heroImage ? (
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="-mt-10 aspect-16/7 overflow-hidden rounded-sm lg:-mt-14">
            <SanityImage
              image={page.heroImage}
              width={2000}
              height={875}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}

      {page.body?.length ? (
        <div className="mx-auto max-w-3xl px-5 py-16 font-sans text-base text-ink/80 lg:px-8 lg:py-24">
          <PortableText value={page.body} components={PortableBody} />
        </div>
      ) : null}
    </>
  )
}
