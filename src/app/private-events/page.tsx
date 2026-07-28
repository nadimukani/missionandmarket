import { notFound } from 'next/navigation'

import { CmsBody, CmsHero, cmsPageMetadata } from '@/components/cms-page'
import { PageHeader } from '@/components/page-header'
import { SanityImage } from '@/components/sanity-image'
import { ButtonLink, Shell, TextLink } from '@/components/ui'
import { telHref } from '@/lib/site'
import { getGallery, getPage, getSettings } from '@/sanity/queries'

export const generateMetadata = () =>
  cmsPageMetadata('private-events', {
    title: 'Private Events',
    description:
      'Private dining, buyouts and celebrations at Mission + Market in Buckhead, Atlanta.',
  })

/** Photography the client has already categorised as event space. */
const SPACE_CATEGORIES = ['Private Dining', 'Patio'] as const

export default async function PrivateEventsPage() {
  const [page, settings, gallery] = await Promise.all([
    getPage('private-events'),
    getSettings(),
    getGallery(),
  ])
  if (!page) notFound()

  const spaces = gallery.filter((item) =>
    (SPACE_CATEGORIES as readonly string[]).includes(item.category ?? ''),
  )

  // No email exists in the dataset yet. The page asks for an enquiry, so it
  // must offer a route that works today — the phone — and pick up an address
  // automatically the moment one is set, rather than shipping a dead mailto.
  const enquiryEmail = settings?.privateEventsEmail ?? settings?.email

  return (
    <>
      <PageHeader eyebrow="Private dining" title={page.title} intro={page.intro} />

      {page.heroImage ? <CmsHero image={page.heroImage} /> : null}
      {page.body?.length ? <CmsBody body={page.body} /> : null}

      {/* The spaces. Labels and captions are the client's own category and alt
          text — nothing here asserts a capacity, a room name or a minimum
          spend, because none of those exist in the CMS yet and an event
          planner acting on an invented number is worse than one who calls. */}
      {spaces.length ? (
        <section className="border-t border-rule bg-paper-warm">
          <Shell className="band">
            <div>
              <p className="eyebrow text-brass">The spaces</p>
              <h2 className="mt-3 font-display text-lead text-ink">
                Where you&rsquo;ll sit
              </h2>
            </div>

            <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8 lg:gap-10">
              {spaces.map((item) => (
                <li key={item._id}>
                  <div className="aspect-4/3 overflow-hidden rounded-xs bg-paper">
                    <SanityImage
                      image={item.image}
                      alt={item.alt}
                      width={900}
                      height={675}
                      sizes="(min-width: 640px) 18rem, 90vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {item.category ? (
                    <p className="eyebrow mt-4 text-brass">{item.category}</p>
                  ) : null}
                  {item.alt ? (
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                      {item.alt}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Shell>
        </section>
      ) : null}

      {/* Enquiry. Previously the page ended on: tell us the date, the
          headcount and the occasion — with no way to tell anyone anything. */}
      <section className="bg-ink text-cream">
        <Shell className="band">
          <div className="mx-auto max-w-[40rem] text-center">
            <p className="eyebrow text-brass-ondark">Plan your event</p>
            <h2 className="mt-3 font-display text-lead text-cream">
              Tell us the occasion
            </h2>
            <p className="mt-5 font-sans text-base leading-relaxed text-cream-muted">
              Every event is quoted on the date, the headcount and what you want
              to eat, so the fastest way to a real answer is to talk to us.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {settings?.phone ? (
                <ButtonLink
                  href={telHref(settings.phone) ?? '#'}
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Call {settings.phone}
                </ButtonLink>
              ) : null}
              {enquiryEmail ? (
                <ButtonLink
                  href={`mailto:${enquiryEmail}?subject=${encodeURIComponent(
                    'Private event enquiry',
                  )}`}
                  variant="onDark"
                  className="w-full sm:w-auto"
                >
                  Email the events team
                </ButtonLink>
              ) : null}
            </div>

            {settings?.largePartyNote ? (
              <p className="mt-8 font-sans text-sm text-cream-muted">
                {settings.largePartyNote}{' '}
                <TextLink href="/reservations" tone="dark">
                  Smaller party? Book a table
                </TextLink>
              </p>
            ) : null}
          </div>
        </Shell>
      </section>
    </>
  )
}
