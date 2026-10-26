import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { CapacityTable } from '@/components/rooms'
import { SanityImage } from '@/components/sanity-image'
import { TripleseatForm } from '@/components/tripleseat-form'
import { ButtonLink, Label, LineLink, Ornament } from '@/components/ui'
import { telHref } from '@/lib/site'
import { getHomePage, getSettings, getSpaces, getSpecials } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Holiday Parties in Buckhead, Atlanta',
  description:
    'Corporate and social holiday parties at Mission + Market in Buckhead — private rooms, the patio or the whole restaurant.',
  alternates: { canonical: '/holiday-parties' },
}

/**
 * Seasonal landing page. It exists only while the restaurant has a live
 * "seasonal" happening in the Studio; once that comes down (its "hide after"
 * date), this address sends guests to Private Dining instead of a dead page.
 */
export default async function HolidayPartiesPage() {
  const [specials, rooms, settings, home] = await Promise.all([
    getSpecials(),
    getSpaces(),
    getSettings(),
    getHomePage(),
  ])
  const holiday = specials.find((s) => s.kind === 'seasonal')
  if (!holiday) redirect('/private-events')

  const [headline, ...rest] = (holiday.description ?? '').split(/(?<=[.!?])\s+/)
  const image = home?.bandImage ?? holiday.image

  return (
    <>
      <section className="relative isolate overflow-hidden text-cream">
        {image ? (
          <SanityImage image={image} width={2048} sizes="100vw" className="absolute inset-0 -z-10 size-full object-cover" priority />
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />
        <div className="page flex min-h-[calc(86svh-var(--header-h))] flex-col items-center justify-center py-28 text-center">
          <div className="rise">
            <Ornament className="h-12 text-cream/55" />
            <Label className="mt-8 text-cream/80">{holiday.schedule ?? 'Now booking'}</Label>
            <h1 className="mt-6 font-display text-hero font-light">{holiday.title}</h1>
            {headline ? <p className="mx-auto mt-8 max-w-2xl font-display text-subtitle font-light italic">{headline}</p> : null}
            {rest.length ? <p className="mx-auto mt-5 max-w-xl text-lead font-light text-cream/85">{rest.join(' ')}</p> : null}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <ButtonLink href="#inquire" tone="light">
                {holiday.ctaLabel ?? 'Plan Your Party'}
              </ButtonLink>
              {settings?.phone ? (
                <ButtonLink href={telHref(settings.phone)!} tone="outline">
                  {settings.phone}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="page section-y">
        <div className="mx-auto max-w-3xl text-center">
          <Label className="text-bronze">Rooms for every party</Label>
          <h2 className="mt-6 font-display text-display font-light">
            A private room, the patio or <em>the whole restaurant</em>
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          <CapacityTable rooms={rooms} linkBase="/private-events" />
          <p className="mt-10 text-center">
            <LineLink href="/private-events">See every space</LineLink>
          </p>
        </div>
      </section>

      <section id="inquire" className="scroll-mt-16 bg-cream section-y" aria-labelledby="inquire-h">
        <div className="page grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="text-center lg:col-span-4 lg:text-left">
            <Label className="text-bronze">Inquire</Label>
            <h2 id="inquire-h" className="mt-6 font-display text-display font-light">
              Reserve your <em>date</em>
            </h2>
            <p className="mt-7 text-lead font-light text-ink-soft">
              Send the date, the number of guests and the occasion, and we’ll be in touch.
            </p>
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
      <BreadcrumbsJsonLd
        trail={[
          { name: 'Private Dining', path: '/private-events' },
          { name: 'Holiday Parties', path: '/holiday-parties' },
        ]}
      />
    </>
  )
}
