import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

import { PageIntro } from '@/components/page-intro'
import { PortableBody } from '@/components/portable-body'
import { ReserveButton } from '@/components/reserve'
import { SanityImage } from '@/components/sanity-image'
import { ButtonLink, Eyebrow, Placeholder } from '@/components/ui'
import { getGallery, getPage, getTeam } from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('about')
  return {
    title: page?.seo?.title ?? 'About',
    description: page?.seo?.description ?? page?.intro,
    alternates: { canonical: '/about' },
  }
}

export default async function AboutPage() {
  const [page, team, gallery] = await Promise.all([getPage('about'), getTeam(), getGallery()])
  const room = gallery.filter((g) => g.category === 'Space').slice(0, 4)
  const chef = team.find((p) => p.featured)

  return (
    <>
      <PageIntro eyebrow="About" title={page?.title ?? 'About'} intro={page?.intro} image={page?.heroImage} />

      {page?.body ? (
        <section className="page pb-(--section)">
          <div className="grid gap-5 font-display text-subtitle lg:w-2/3 [&_p]:text-pretty">
            <PortableText value={page.body} components={PortableBody} />
          </div>
        </section>
      ) : null}

      {room.length ? (
        <section className="section-y border-t border-ink/10" aria-labelledby="room-h">
          <div className="page">
            <Eyebrow className="text-bronze">The room</Eyebrow>
            <h2 id="room-h" className="mt-5 font-display text-display">
              Light, trees + <em>teal velvet</em>
            </h2>
          </div>
          <div className="page mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {room.map((g, i) => (
              <figure key={g._id} className={i % 2 === 1 ? 'lg:mt-16' : ''}>
                <div className="aspect-[9/16] overflow-hidden bg-cream">
                  <SanityImage
                    image={g.image}
                    alt={g.alt}
                    width={600}
                    height={1067}
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="size-full object-cover"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-y border-t border-ink/10" aria-labelledby="kitchen-h">
        <div className="page grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            {chef?.portrait ? (
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <SanityImage
                  image={chef.portrait}
                  width={1000}
                  height={1250}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <Placeholder
                className="aspect-[4/5]"
                label="Chef portrait + profile"
                note="Portrait and profile to come. They publish from Team in the Studio."
              />
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow className="text-bronze">{chef?.role ?? 'The kitchen'}</Eyebrow>
            <h2 id="kitchen-h" className="mt-5 font-display text-display">
              {chef ? (
                chef.displayName ?? chef.name
              ) : (
                <>
                  Meet the <em>chef</em>
                </>
              )}
            </h2>
            {chef?.bio ? (
              <div className="mt-6 grid gap-5 text-lead text-stone">
                <PortableText value={chef.bio} components={PortableBody} />
              </div>
            ) : (
              <p className="mt-6 text-lead text-stone">
                Modern American cooking with California and Pacific influences, built around locally sourced
                ingredients.
              </p>
            )}
            {chef?.quote ? (
              <blockquote className="mt-8 border-l border-bronze pl-6 font-display text-subtitle italic">
                {chef.quote}
              </blockquote>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/menus">See the menus</ButtonLink>
              <ReserveButton className="btn btn-line">Reserve a table</ReserveButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream" aria-label="Recognition">
        <div className="page flex flex-col gap-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-subtitle">
            OpenTable <em>Diners’ Choice</em> 2024
          </p>
          <ButtonLink href="/gallery" tone="line">
            See the gallery
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
