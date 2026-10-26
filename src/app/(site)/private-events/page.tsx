import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

import { PageIntro } from '@/components/page-intro'
import { PortableBody } from '@/components/portable-body'
import { CapacityTable, RoomRow } from '@/components/rooms'
import { TripleseatForm } from '@/components/tripleseat-form'
import { ButtonLink, Eyebrow } from '@/components/ui'
import { telHref } from '@/lib/site'
import { getPage, getSettings, getSpaces, getSpecials } from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('private-events')
  return {
    title: page?.seo?.title ?? 'Private Dining + Events',
    description:
      page?.seo?.description ??
      page?.intro ??
      'Private dining rooms, the patio and full buyouts at Mission + Market in Buckhead, Atlanta.',
    alternates: { canonical: '/private-events' },
  }
}

export default async function PrivateEventsPage() {
  const [page, rooms, settings, specials] = await Promise.all([
    getPage('private-events'),
    getSpaces(),
    getSettings(),
    getSpecials(),
  ])

  // A seasonal happening that points here — the holiday push — gets the band.
  const seasonal = specials.find((s) => s.kind === 'seasonal' && s.ctaUrl?.startsWith('/private-events'))

  return (
    <>
      <PageIntro
        eyebrow="Private dining + events"
        title={page?.title ?? 'Private Dining'}
        intro={page?.intro}
        image={page?.heroImage}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#inquire">Start an inquiry</ButtonLink>
          {settings?.phone ? (
            <ButtonLink href={telHref(settings.phone)!} tone="line">
              Call {settings.phone}
            </ButtonLink>
          ) : null}
        </div>
      </PageIntro>

      {seasonal ? (
        <section className="bg-moss text-cream" aria-label={seasonal.title}>
          <div className="page flex flex-col gap-6 py-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div>
              <Eyebrow className="text-cream/75">{seasonal.title}</Eyebrow>
              <p className="mt-3 max-w-3xl font-display text-subtitle">{seasonal.description}</p>
            </div>
            <ButtonLink href="#inquire" tone="cream" className="shrink-0 self-start lg:self-center">
              {seasonal.ctaLabel ?? 'Start an inquiry'}
            </ButtonLink>
          </div>
        </section>
      ) : null}

      <section className="page section-y" aria-labelledby="spaces-h">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow className="text-bronze">The spaces</Eyebrow>
            <h2 id="spaces-h" className="mt-5 font-display text-display">
              Rooms for <em>20 to 140</em>
            </h2>
            {page?.body ? (
              <div className="mt-6 grid gap-5 text-lead text-stone">
                <PortableText value={page.body} components={PortableBody} />
              </div>
            ) : null}
          </div>
          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <CapacityTable rooms={rooms} />
          </div>
        </div>
      </section>

      <section className="page pb-(--section)" aria-label="Rooms">
        <div className="grid gap-24 lg:gap-32">
          {rooms.map((room, i) => (
            <RoomRow key={room._id} room={room} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      <section id="inquire" className="scroll-mt-20 bg-cream" aria-labelledby="inquire-h">
        <div className="page section-y grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Eyebrow className="text-bronze">Inquire</Eyebrow>
            <h2 id="inquire-h" className="mt-5 font-display text-display">
              Tell us about <em>your event</em>
            </h2>
            <p className="mt-6 text-lead text-stone">
              The date, the headcount and the occasion are all we need to start.
            </p>
            {settings?.phone ? (
              <p className="mt-8 text-[0.9375rem]">
                Prefer to talk it through?{' '}
                <a className="link tabular" href={telHref(settings.phone)}>
                  {settings.phone}
                </a>
              </p>
            ) : null}
          </div>
          <div className="bg-paper p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
            <TripleseatForm
              leadFormId={settings?.tripleseatLeadFormId}
              publicKey={settings?.tripleseatPublicKey}
              phone={settings?.phone}
            />
          </div>
        </div>
      </section>
    </>
  )
}
