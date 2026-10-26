import type { Metadata } from 'next'
import { PortableText, stegaClean } from 'next-sanity'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { PageHero } from '@/components/page-hero'
import { PortableBody } from '@/components/portable-body'
import { ReserveButton } from '@/components/reserve'
import { SanityImage } from '@/components/sanity-image'
import { ButtonLink, Label, Ornament, Placeholder } from '@/components/ui'
import { linkPreview } from '@/lib/metadata'
import { getGallery, getPage, getTeam } from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('about')
  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    title: page?.seo?.title ?? 'About — Modern American Dining in Buckhead',
    description: page?.seo?.description ?? page?.intro,
    alternates: { canonical: '/about' },
    openGraph: await linkPreview('/about'),
  })
}

export default async function AboutPage() {
  const [page, team, gallery] = await Promise.all([getPage('about'), getTeam(), getGallery()])
  // The room, without repeating the photograph already used at the top.
  const heroRef = (page?.heroImage as { asset?: { _ref?: string } } | undefined)?.asset?._ref
  const room = gallery
    .filter((g) => g.category === 'Space' && (g.image as { asset?: { _ref?: string } }).asset?._ref !== heroRef)
    .slice(0, 4)
  const chef = team.find((p) => p.featured)

  return (
    <>
      <PageHero label="About" title="Flavor + *Fusion*" intro={page?.intro} image={page?.heroImage} tone="cream" />

      {page?.body ? (
        <section className="page section-y text-center">
          <Ornament className="h-12 text-bronze" />
          <div className="mx-auto mt-10 grid max-w-3xl gap-8 font-display text-subtitle font-light">
            <PortableText value={page.body} components={PortableBody} />
          </div>
        </section>
      ) : null}

      {room.length ? (
        <section aria-labelledby="room-h">
          <div className="page pb-14 text-center">
            <Label className="text-bronze">The Room</Label>
            <h2 id="room-h" className="mt-6 font-display text-display font-light">
              Light, trees + <em>teal velvet</em>
            </h2>
          </div>
          <div className={`grid gap-1 ${room.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {room.map((g) => (
              <div key={g._id} className="relative aspect-[9/16] overflow-hidden bg-cream">
                <SanityImage
                  image={g.image}
                  alt={g.alt}
                  width={800}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid lg:min-h-[86svh] lg:grid-cols-2" aria-labelledby="kitchen-h">
        <div className="relative min-h-[64svh] overflow-hidden lg:min-h-0">
          {chef?.portrait ? (
            <SanityImage
              image={chef.portrait}
              width={1400}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <Placeholder className="absolute inset-0" label="Meet the chef" />
          )}
        </div>
        <div className="flex items-center justify-center px-(--gutter) py-24 text-center sm:py-32">
          <div className="max-w-md">
            <Label className="text-bronze">{chef?.role ?? 'The Kitchen'}</Label>
            <h2 id="kitchen-h" className="mt-6 font-display text-display font-light">
              {chef ? (
                (chef.displayName ?? chef.name)
              ) : (
                <>
                  Meet the <em>Chef</em>
                </>
              )}
            </h2>
            {chef?.bio ? (
              <div className="mt-7 grid gap-5 text-lead font-light text-ink-soft">
                <PortableText value={chef.bio} components={PortableBody} />
              </div>
            ) : (
              <p className="mt-7 text-lead font-light text-ink-soft">
                Modern American cooking with California and Pacific influences, built around locally sourced
                ingredients.
              </p>
            )}
            {chef?.quote ? (
              <blockquote className="mt-9 font-display text-subtitle font-light italic">“{chef.quote}”</blockquote>
            ) : null}
            <div className="mt-11 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/menus/dinner">The Dinner Menu</ButtonLink>
              <ReserveButton className="btn btn-outline">Reserve a Table</ReserveButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 text-center">
        <Label className="text-bronze">Recognition</Label>
        <p className="mt-5 font-display text-title font-light">
          OpenTable <em>Diners’ Choice</em> 2024
        </p>
      </section>
      <BreadcrumbsJsonLd trail={[{ name: 'About', path: '/about' }]} />
    </>
  )
}
