import type { Metadata } from 'next'
import Link from 'next/link'

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
        intro={
          settings?.largePartyNote ??
          'We hold tables for walk-ins at the bar every evening.'
        }
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
          <p className="mt-10 font-sans text-sm text-bone-dim">
            Please call{' '}
            <a
              href={telHref(settings?.phone)}
              className="text-ember underline underline-offset-4"
            >
              {settings?.phone}
            </a>{' '}
            to book.
          </p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <section>
            <h2 className="eyebrow text-ember">Large parties</h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ink/70">
              {settings?.largePartyNote ??
                'For parties of nine or more, our team will build the evening around you.'}
            </p>
            <p className="mt-4 font-sans text-sm">
              <Link
                href="/private-events"
                className="text-ember underline underline-offset-4 hover:text-ember-bright"
              >
                Private dining & events
              </Link>
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-ember">Getting here</h2>
            {settings?.address ? (
              <address className="mt-4 font-sans text-sm leading-relaxed text-ink/70 not-italic">
                {formatAddress(settings.address)}
              </address>
            ) : null}
            {settings?.parkingNote ? (
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink/70">
                {settings.parkingNote}
              </p>
            ) : null}
            {settings?.mapsUrl ? (
              <p className="mt-4 font-sans text-sm">
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember underline underline-offset-4 hover:text-ember-bright"
                >
                  Get directions
                </a>
              </p>
            ) : null}
          </section>

          <section>
            <h2 className="eyebrow text-ember">Hours</h2>
            <dl className="mt-4 space-y-3 font-sans text-sm">
              {settings?.hours?.map((row) => (
                <div key={`${row.service}-${row.days}`}>
                  <dt className="text-ink">{row.service}</dt>
                  <dd className="text-ink/60">
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
