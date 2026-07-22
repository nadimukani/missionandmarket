import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/page-header'
import { formatAddress, telHref } from '@/lib/site'
import { getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Visit',
  description:
    'Find Mission + Market at Three Alliance Center, 3550 Lenox Road NE, Buckhead, Atlanta. Hours, parking, directions and contact details.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const settings = await getSettings()
  const address = settings?.address
  const mapQuery = address
    ? encodeURIComponent(
        [address.street, address.city, address.state, address.zip]
          .filter(Boolean)
          .join(', '),
      )
    : null

  return (
    <>
      <PageHeader
        eyebrow="Visit"
        title="Find us"
        intro={settings?.neighborhood ? `${settings.neighborhood}, Atlanta` : undefined}
      />

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-10">
            <section>
              <h2 className="eyebrow text-brass">Address</h2>
              {address ? (
                <address className="mt-4 font-sans text-lg leading-relaxed text-ink not-italic">
                  {formatAddress(address)}
                </address>
              ) : null}
              {settings?.mapsUrl ? (
                <p className="mt-3">
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-brass underline underline-offset-4 hover:text-ink"
                  >
                    Open in Google Maps
                  </a>
                </p>
              ) : null}
            </section>

            <section>
              <h2 className="eyebrow text-brass">Contact</h2>
              <ul className="mt-4 space-y-2 font-sans text-base">
                {settings?.phone ? (
                  <li>
                    <a
                      href={telHref(settings.phone)}
                      className="text-ink underline underline-offset-4 hover:text-ink"
                    >
                      {settings.phone}
                    </a>
                  </li>
                ) : null}
                {settings?.email ? (
                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-ink underline underline-offset-4 hover:text-ink"
                    >
                      {settings.email}
                    </a>
                  </li>
                ) : null}
                {settings?.privateEventsEmail ? (
                  <li className="text-ink-muted">
                    Private events:{' '}
                    <a
                      href={`mailto:${settings.privateEventsEmail}`}
                      className="text-ink underline underline-offset-4 hover:text-ink"
                    >
                      {settings.privateEventsEmail}
                    </a>
                  </li>
                ) : null}
              </ul>
            </section>

            {settings?.parkingNote ? (
              <section>
                <h2 className="eyebrow text-brass">Parking</h2>
                <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-ink-muted">
                  {settings.parkingNote}
                </p>
              </section>
            ) : null}

            <section>
              <h2 className="eyebrow text-brass">Hours</h2>
              <dl className="mt-4 space-y-3 font-sans text-sm">
                {settings?.hours?.map((row) => (
                  <div
                    key={`${row.service}-${row.days}`}
                    className="flex flex-wrap justify-between gap-x-6 border-b border-rule pb-2"
                  >
                    <dt className="text-ink">
                      {row.service}
                      {row.days ? (
                        <span className="text-ink-faint"> · {row.days}</span>
                      ) : null}
                    </dt>
                    <dd className="text-ink-muted tabular-nums">{row.time}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <Link
              href="/reservations"
              className="inline-block rounded-xs bg-ink px-8 py-3.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-moss"
            >
              Reserve a table
            </Link>
          </div>

          {mapQuery ? (
            <div className="min-h-80 overflow-hidden rounded-xs bg-ink/5 lg:min-h-full">
              <iframe
                title={`Map to ${settings?.name ?? 'the restaurant'}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-80 w-full border-0"
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
