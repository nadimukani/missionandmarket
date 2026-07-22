import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

import { cmsPageMetadata } from '@/components/cms-page'
import { PageHeader } from '@/components/page-header'
import { PortableBody } from '@/components/portable-body'
import { SanityImage } from '@/components/sanity-image'
import { TeamSection } from '@/components/team-section'
import { getPage, getTeam } from '@/sanity/queries'

export const generateMetadata = () =>
  cmsPageMetadata('about', {
    title: 'About',
    description:
      'Mission + Market brings modern American cooking with California and Pacific Rim influence to Three Alliance Center in Buckhead, Atlanta.',
  })

export default async function AboutPage() {
  const [page, team] = await Promise.all([getPage('about'), getTeam()])
  if (!page) notFound()

  return (
    <>
      <PageHeader eyebrow="Our story" title={page.title} intro={page.intro} />

      {page.heroImage ? (
        <div className="mx-auto max-w-[88rem] px-5 lg:px-10">
          <div className="-mt-10 aspect-16/7 overflow-hidden rounded-xs lg:-mt-14">
            <SanityImage
              image={page.heroImage}
              width={2000}
              height={875}
              priority
              sizes="(min-width: 1408px) 1328px, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}

      {page.body?.length ? (
        <div className="mx-auto max-w-3xl px-5 py-16 font-sans text-base text-ink-muted lg:px-10 lg:py-24">
          <PortableText value={page.body} components={PortableBody} />
        </div>
      ) : null}

      {/* The kitchen is the reason people come — it gets its own band rather
          than a paragraph buried in the story copy. */}
      {team.length ? (
        <div className="border-t border-rule bg-paper-warm">
          <TeamSection team={team} />
        </div>
      ) : null}
    </>
  )
}
