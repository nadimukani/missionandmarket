import type { Metadata } from 'next'

import { TextLink } from '@/components/ui'

import { PageHeader } from '@/components/page-header'
import { ReserveForm } from '@/components/reserve-form'
import { formatAddress, telHref } from '@/lib/site'
import { getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Reservations',
  description:
    'Book a table at Mission + Market in Buckhead, Atlanta. Reservations through OpenTable, private dining and large party enquiries.',
  alternates: { canonical: '/reservations' },
}

export default async function ReservationsPage() {
  const settings = await getSettings()

  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Book a table"
        intro="Book below, or call us — we keep seats at the bar for walk-ins every evening."
      >
        {settings?.openTableRid ? (
          <div className="mt-12 flex justify-center">
            <ReserveForm
              rid={settings.openTableRid}
              fallbackUrl={settings.openTableUrl}
              largePartyNote={settings.largePartyNote}
              phone={settings.phone}
            />
          </div>
        ) : (
          <p className="mt-10 font-sans text-sm text-cream-muted">
            Please call{' '}
            <TextLink href={telHref(settings?.phone)} tone="dark">
              {settings?.phone}
            </TextLink>{' '}
            to book.
          </p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <section>
            <h2 className="eyebrow text-brass">Large parties</h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">
              {settings?.largePartyNote ??
                'For parties of nine or more, our team will build the evening around you.'}
              {settings?.phone ? (
                <>
                  {' '}
                  <TextLink href={telHref(settings.phone)}>
                    {settings.phone}
                  </TextLink>
                </>
              ) : null}
            </p>
            <p className="mt-4 font-sans text-sm">
              <TextLink href="/private-events">
                Private dining & events
              </TextLink>
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-brass">Getting here</h2>
            {settings?.address ? (
              <address className="mt-4 font-sans text-sm leading-relaxed text-ink-muted not-italic">
                {formatAddress(settings.address)}
              </address>
            ) : null}
            {settings?.parkingNote ? (
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                {settings.parkingNote}
              </p>
            ) : null}
            {settings?.mapsUrl ? (
              <p className="mt-4 font-sans text-sm">
                <TextLink href={settings.mapsUrl}>
                  Get directions
                </TextLink>
              </p>
            ) : null}
          </section>

          <section>
            <h2 className="eyebrow text-brass">Hours</h2>
            <dl className="mt-4 space-y-3 font-sans text-sm">
              {settings?.hours?.map((row) => (
                <div key={`${row.service}-${row.days}`}>
                  <dt className="text-ink">{row.service}</dt>
                  <dd className="text-ink-muted">
                    {[row.days, row.time].filter(Boolean).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  )
}
