import type { Metadata } from 'next'

import { HoursList } from '@/components/hours'
import { OpenStatus } from '@/components/open-status'
import { PageIntro } from '@/components/page-intro'
import { ReserveButton } from '@/components/reserve'
import { ButtonLink, Eyebrow, Plus } from '@/components/ui'
import { formatAddress, telHref } from '@/lib/site'
import { getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Visit',
  description:
    'Hours, directions and parking for Mission + Market at Three Alliance Center, 3550 Lenox Road NE, Buckhead, Atlanta.',
  alternates: { canonical: '/contact' },
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
  const settings = await getSettings()
  const address = formatAddress(settings?.address)
  const mapQuery = encodeURIComponent(`Mission + Market, ${address.replace(/ · /g, ', ')}`)

  return (
    <>
      <PageIntro eyebrow="Visit" title="Find us in *Buckhead*" intro={address}>
        <div className="flex flex-wrap gap-3">
          <ReserveButton>Reserve a table</ReserveButton>
          {settings?.mapsUrl ? (
            <ButtonLink href={settings.mapsUrl} tone="line">
              Get directions
            </ButtonLink>
          ) : null}
        </div>
      </PageIntro>

      <section className="page pb-(--section)">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <OpenStatus hours={settings?.machineHours} className="text-stone" />
            <h2 className="sr-only">Hours</h2>
            <HoursList hours={settings?.hours} className="mt-6" />

            <div className="mt-12 grid gap-8 border-t border-ink/10 pt-8">
              {settings?.parkingNote ? (
                <div>
                  <Eyebrow as="h2" className="text-bronze">
                    Parking
                  </Eyebrow>
                  <p className="mt-3 text-[0.9375rem]">{settings.parkingNote}</p>
                </div>
              ) : null}
              {settings?.phone ? (
                <div>
                  <Eyebrow as="h2" className="text-bronze">
                    Call
                  </Eyebrow>
                  <a className="link mt-3 inline-block text-[0.9375rem] tabular" href={telHref(settings.phone)}>
                    {settings.phone}
                  </a>
                </div>
              ) : null}
              <div>
                <Eyebrow as="h2" className="text-bronze">
                  Events
                </Eyebrow>
                <p className="mt-3 text-[0.9375rem]">
                  Planning a party or a group dinner?{' '}
                  <a className="link" href="/private-events#inquire">
                    Send a private dining inquiry
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="aspect-[4/3] overflow-hidden bg-cream">
              <iframe
                title={`Map: ${address}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="size-full border-0 grayscale-[35%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <h2 className="eyebrow mt-12 text-bronze">Driving directions</h2>
            <ul className="mt-6 grid gap-6">
              {DIRECTIONS.map((d) => (
                <li key={d.from} className="border-t border-ink/10 pt-5">
                  <p className="flex items-center gap-3 font-display text-card">
                    <Plus className="size-2.5 text-bronze" />
                    {d.from}
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-stone">{d.route}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
