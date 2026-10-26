import type { Metadata } from 'next'

import { HoursList } from '@/components/hours'
import { PageIntro } from '@/components/page-intro'
import { ReserveForm } from '@/components/reserve'
import { SanityImage } from '@/components/sanity-image'
import { Eyebrow, PlusLink } from '@/components/ui'
import { telHref } from '@/lib/site'
import { getGallery, getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Reservations',
  description: 'Book a table at Mission + Market in Buckhead, Atlanta — lunch, happy hour and dinner.',
  alternates: { canonical: '/reservations' },
}

export default async function ReservationsPage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGallery()])
  const photo = gallery.find((g) => g._id === 'gallery-mm-reel-booths') ?? gallery[0]

  return (
    <>
      <PageIntro
        eyebrow="Reservations"
        title="Book a *table*"
        intro="Choose your party, date and time — we’ll hand you to OpenTable with everything filled in."
      />

      <section className="page pb-(--section)">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="bg-cream p-6 sm:p-10">
              <ReserveForm rid={settings?.openTableRid} phone={settings?.phone} hours={settings?.machineHours} idPrefix="page" />
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <Eyebrow as="h2" className="text-bronze">
                  Larger groups
                </Eyebrow>
                <p className="mt-3 text-[0.9375rem] text-stone">
                  Private rooms, the patio and full buyouts for 20 to 140 guests.
                </p>
                <PlusLink href="/private-events" className="mt-4 text-ink">
                  Private dining
                </PlusLink>
              </div>
              {settings?.phone ? (
                <div>
                  <Eyebrow as="h2" className="text-bronze">
                    By phone
                  </Eyebrow>
                  <p className="mt-3 text-[0.9375rem] text-stone">Prefer to call? We’re happy to help.</p>
                  <a className="link mt-4 inline-block tabular" href={telHref(settings.phone)}>
                    {settings.phone}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="mt-14">
              <h2 className="eyebrow text-bronze">Hours</h2>
              <HoursList hours={settings?.hours} className="mt-6" />
            </div>
          </div>

          {photo ? (
            <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
              <div className="sticky top-[calc(var(--header-h)+2rem)] aspect-[9/16] overflow-hidden bg-cream">
                <SanityImage
                  image={photo.image}
                  alt={photo.alt}
                  width={700}
                  height={1244}
                  sizes="30vw"
                  className="size-full object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
