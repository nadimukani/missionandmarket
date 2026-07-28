import { notFound } from 'next/navigation'

import { CmsBody, CmsHero, cmsPageMetadata } from '@/components/cms-page'
import { PageHeader } from '@/components/page-header'
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

      {/* Composed from the same pieces as every other CMS page rather than a
          hand-copy of them: the two forks had drifted to different rails,
          different gutters and different `sizes` attributes for what is the
          same element. */}
      {page.heroImage ? <CmsHero image={page.heroImage} /> : null}
      {page.body?.length ? <CmsBody body={page.body} /> : null}

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
