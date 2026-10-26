import type { Metadata } from 'next'
import { PortableText, stegaClean } from 'next-sanity'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { PageHero } from '@/components/page-hero'
import { PortableBody } from '@/components/portable-body'
import { CapacityTable, RoomRow } from '@/components/rooms'
import { TripleseatForm } from '@/components/tripleseat-form'
import { ButtonLink, Label, LineLink, Ornament } from '@/components/ui'
import { telHref } from '@/lib/site'
import { getPage, getSettings, getSpaces, getSpecials } from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('private-events')
  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    title: page?.seo?.title ?? 'Private Dining + Events in Buckhead',
    description:
      page?.seo?.description ??
      page?.intro ??
      'Private dining rooms, the patio and full buyouts at Mission + Market in Buckhead, Atlanta.',
    alternates: { canonical: '/private-events' },
  })
}

export default async function PrivateEventsPage() {
  const [page, rooms, settings, specials] = await Promise.all([
    getPage('private-events'),
    getSpaces(),
    getSettings(),
    getSpecials(),
  ])
  const seasonal = specials.find((s) => s.kind === 'seasonal' && s.ctaUrl)

  return (
    <>
      <PageHero
        label="Private Dining + Events"
        title={page?.title ?? 'Private Dining'}
        intro={page?.intro}
        image={page?.heroImage}
        tone="moss"
      >
        <ButtonLink href="#inquire" tone="light">
          Plan Your Event
        </ButtonLink>
        {settings?.phone ? (
          <ButtonLink href={telHref(settings.phone)!} tone="outline">
            {settings.phone}
          </ButtonLink>
        ) : null}
      </PageHero>

      <section className="page section-y">
        <div className="mx-auto max-w-2xl text-center">
          <Ornament className="h-12 text-bronze" />
          {page?.body ? (
            <div className="mt-10 grid gap-6 font-display text-subtitle font-light">
              <PortableText value={page.body} components={PortableBody} />
            </div>
          ) : null}
          {seasonal ? (
            <p className="mt-10">
              <LineLink href={seasonal.ctaUrl!} className="text-moss">
                {seasonal.title} — {seasonal.schedule ?? 'now booking'}
              </LineLink>
            </p>
          ) : null}
        </div>
        <div className="mx-auto mt-20 max-w-3xl">
          <Label className="text-center text-bronze">The Spaces at a Glance</Label>
          <div className="mt-6">
            <CapacityTable rooms={rooms} />
          </div>
        </div>
      </section>

      <div aria-label="The spaces">
        {rooms.map((room, i) => (
          <RoomRow key={room._id} room={room} flip={i % 2 === 1} />
        ))}
      </div>

      <section id="inquire" className="scroll-mt-16 bg-cream section-y" aria-labelledby="inquire-h">
        <div className="page grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="text-center lg:col-span-4 lg:text-left">
            <Label className="text-bronze">Inquire</Label>
            <h2 id="inquire-h" className="mt-6 font-display text-display font-light">
              Tell us about <em>your event</em>
            </h2>
            <p className="mt-7 text-lead font-light text-ink-soft">
              The date, the number of guests and the occasion are all we need to begin.
            </p>
            {settings?.phone ? (
              <p className="mt-8 text-[0.9375rem] font-light">
                Or call{' '}
                <a className="link tabular" href={telHref(settings.phone)}>
                  {settings.phone}
                </a>
              </p>
            ) : null}
          </div>
          <div className="bg-paper px-6 py-10 sm:px-12 lg:col-span-7 lg:col-start-6">
            <TripleseatForm
              leadFormId={settings?.tripleseatLeadFormId}
              publicKey={settings?.tripleseatPublicKey}
              phone={settings?.phone}
            />
          </div>
        </div>
      </section>
      <BreadcrumbsJsonLd trail={[{ name: 'Private Dining', path: '/private-events' }]} />
    </>
  )
}
