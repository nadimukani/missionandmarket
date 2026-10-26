import type { Metadata } from 'next'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { HoursList } from '@/components/hours'
import { OpenStatus } from '@/components/open-status'
import { PageHero } from '@/components/page-hero'
import { ReserveButton } from '@/components/reserve'
import { ButtonLink, Label } from '@/components/ui'
import { formatAddress, telHref } from '@/lib/site'
import { getGallery, getSchedule, getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Visit — Hours, Directions + Parking',
  description:
    'Hours, directions and parking for Mission + Market at Three Alliance Center, 3550 Lenox Road NE, Buckhead, Atlanta.',
  alternates: { canonical: '/visit' },
}

/** Driving directions as the restaurant publishes them on its current site. */
const DIRECTIONS = [
  {
    from: 'From Hartsfield-Jackson International Airport',
    route:
      'Take I-85 N to GA-400 N, Exit 2, 141 Connector (Lenox Road). Merge onto 141 Connector NE (Lenox Road). Turn into Alliance Center — the restaurant is on your right.',
  },
  {
    from: 'From Cumberland / Vinings',
    route:
      'Take I-285 E to GA-400 S, Exit 2, 141 Connector (Lenox Road). Merge onto 141 Connector NE (Lenox Road). Turn into Alliance Center — the restaurant is on your right.',
  },
  {
    from: 'From Sandy Springs, Roswell + Alpharetta',
    route:
      'Take GA-400 S, Exit 2, 141 Connector (Lenox Road). Merge onto 141 Connector NE (Lenox Road). Turn into Alliance Center — the restaurant is on your right.',
  },
]

export default async function VisitPage() {
  const [settings, schedule, gallery] = await Promise.all([getSettings(), getSchedule(), getGallery()])
  const address = formatAddress(settings?.address)
  const mapQuery = encodeURIComponent(`Mission + Market, ${address.replace(/ · /g, ', ')}`)
  const hero = gallery.find((g) => g._id === 'gallery-mm-reel-guests')?.image

  return (
    <>
      <PageHero
        label="Visit"
        title="Find us in *Buckhead*"
        image={hero}
        intro={
          <>
            <span className="block">{settings?.address?.street}</span>
            <span className="block">{settings?.address?.street2}</span>
            <span className="block">
              {[settings?.address?.city, settings?.address?.state].filter(Boolean).join(', ')} {settings?.address?.zip}
            </span>
          </>
        }
      >
        <ReserveButton className="btn btn-solid">Reserve a Table</ReserveButton>
        {settings?.mapsUrl ? (
          <ButtonLink href={settings.mapsUrl} tone="outline">
            Directions
          </ButtonLink>
        ) : null}
      </PageHero>

      <section id="hours" className="page section-y scroll-mt-24">
        <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Label className="text-bronze">Hours</Label>
            <OpenStatus schedule={schedule} className="mt-5 justify-start! text-stone" />
            <HoursList schedule={schedule} className="mt-8" />
          </div>
          <div className="grid content-start gap-12">
            {settings?.parkingNote ? (
              <div>
                <Label className="text-bronze">Parking</Label>
                <p className="mt-5 text-lead font-light text-ink-soft">{settings.parkingNote}</p>
              </div>
            ) : null}
            {settings?.phone ? (
              <div>
                <Label className="text-bronze">Call</Label>
                <p className="mt-5 font-display text-title font-light">
                  <a className="link-line tabular" href={telHref(settings.phone)}>
                    {settings.phone}
                  </a>
                </p>
              </div>
            ) : null}
            <div>
              <Label className="text-bronze">Private events</Label>
              <p className="mt-5 text-lead font-light text-ink-soft">
                Planning a party or a group dinner?{' '}
                <a className="link text-ink" href="/private-events#inquire">
                  Send an inquiry
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Map" className="h-[70svh] min-h-[420px] bg-cream">
        <iframe
          title={`Map: ${address}`}
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          className="size-full border-0 grayscale-[45%] sepia-[12%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="page section-y">
        <div className="mx-auto max-w-3xl">
          <Label className="text-center text-bronze">Driving Directions</Label>
          <ul className="mt-10 grid gap-10">
            {DIRECTIONS.map((d) => (
              <li key={d.from} className="border-t border-ink/10 pt-8 text-center">
                <p className="font-display text-subtitle font-light">{d.from}</p>
                <p className="mx-auto mt-3 max-w-xl text-[0.9375rem] font-light text-ink-soft">{d.route}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <BreadcrumbsJsonLd trail={[{ name: 'Visit', path: '/visit' }]} />
    </>
  )
}
