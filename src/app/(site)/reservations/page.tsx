import type { Metadata } from 'next'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { HoursList } from '@/components/hours'
import { ReserveForm } from '@/components/reserve'
import { SanityImage } from '@/components/sanity-image'
import { Label, LineLink, Ornament } from '@/components/ui'
import { telHref } from '@/lib/site'
import { getGallery, getSchedule, getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Reservations',
  description: 'Reserve a table at Mission + Market in Buckhead, Atlanta — lunch, happy hour and dinner.',
  alternates: { canonical: '/reservations' },
}

export default async function ReservationsPage() {
  const [settings, schedule, gallery] = await Promise.all([getSettings(), getSchedule(), getGallery()])
  const photo = gallery.find((g) => g._id === 'gallery-mm-reel-booths')

  return (
    <>
      <section className="grid lg:min-h-[calc(92svh-var(--header-h))] lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center px-(--gutter) py-20 text-center sm:py-28">
          <div className="rise w-full max-w-lg">
            <Ornament className="h-10 text-bronze" />
            <Label className="mt-8 text-bronze">Reservations</Label>
            <h1 className="mt-6 font-display text-hero font-light">
              Reserve a <em>Table</em>
            </h1>
            <p className="mx-auto mt-7 max-w-md text-lead font-light text-ink-soft">
              Choose your party, date and time — we’ll take you to OpenTable with everything filled in.
            </p>
            <div className="mt-12 text-left">
              <ReserveForm rid={settings?.openTableRid} phone={settings?.phone} schedule={schedule} idPrefix="page" />
            </div>
          </div>
        </div>
        {photo ? (
          <div className="relative min-h-[60svh] overflow-hidden bg-ink lg:min-h-0">
            <SanityImage
              image={photo.image}
              alt={photo.alt}
              width={1400}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 size-full object-cover"
              priority
            />
          </div>
        ) : null}
      </section>

      <section className="bg-cream section-y">
        <div className="page grid gap-14 text-center lg:grid-cols-3 lg:gap-10">
          <div>
            <Label className="text-bronze">Larger groups</Label>
            <p className="mx-auto mt-5 max-w-xs text-lead font-light text-ink-soft">
              Private rooms, the patio and full buyouts.
            </p>
            <LineLink href="/private-events" className="mt-6 text-ink">
              Private Dining
            </LineLink>
          </div>
          <div>
            <Label className="text-bronze">By phone</Label>
            {settings?.phone ? (
              <p className="mt-5 font-display text-title font-light">
                <a className="link-line tabular" href={telHref(settings.phone)}>
                  {settings.phone}
                </a>
              </p>
            ) : null}
          </div>
          <div>
            <Label className="text-bronze">Hours</Label>
            <HoursList schedule={schedule} compact align="center" className="mx-auto mt-5 max-w-xs" />
          </div>
        </div>
      </section>
      <BreadcrumbsJsonLd trail={[{ name: 'Reservations', path: '/reservations' }]} />
    </>
  )
}
