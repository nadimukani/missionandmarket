import type { Metadata } from 'next'
import Link from 'next/link'

import { HoursList, Shell, TextLink } from '@/components/ui'
import { PortableText } from 'next-sanity'

import { HeroImages } from '@/components/hero-images'
import { OpenStatus } from '@/components/open-status'
import { PortableBody } from '@/components/portable-body'
import { ReserveForm } from '@/components/reserve-form'
import { SanityImage } from '@/components/sanity-image'
import { MarkColumn } from '@/components/wordmark'
import { formatAddress, telHref } from '@/lib/site'
import {
  getGallery,
  getHomePage,
  getMenuList,
  getSettings,
  getSpecials,
} from '@/sanity/queries'

/**
 * The Home Page document has always carried a collapsible SEO panel and the
 * query has always selected it, but the page exported no metadata — so the
 * override was inert and the title came solely from siteSettings.
 */
export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage()
  if (!home?.seo?.title && !home?.seo?.description) return {}

  return {
    ...(home.seo.title ? { title: { absolute: home.seo.title } } : {}),
    ...(home.seo.description ? { description: home.seo.description } : {}),
    openGraph: {
      ...(home.seo.title ? { title: home.seo.title } : {}),
      ...(home.seo.description ? { description: home.seo.description } : {}),
    },
  }
}

/**
 * Homepage order.
 *
 * The first cut ordered this by guest task — see the room, book, read the
 * menu, then work out hours and parking. Reasonable on paper, but it put the
 * full address-and-hours band third, ahead of every photograph of the food,
 * on a restaurant whose actual perception risk is looking like the cafe that
 * serves the office tower it sits in. Hours already appear in the header, the
 * footer and on /contact; showing them a fourth time before the cooking is
 * arguing the wrong case.
 *
 * So: book immediately (the hero carries the form), then the food and the
 * room, and logistics last — where a guest who has decided to come goes
 * looking for them.
 *
 * Grounds alternate paper / paper-warm so no two adjacent bands share a
 * background, and the two dark bands (hero, visit) bracket the page.
 */
export default async function HomePage() {
  const [home, settings, menus, specials, gallery] = await Promise.all([
    getHomePage(),
    getSettings(),
    getMenuList(),
    getSpecials(),
    getGallery(),
  ])

  const heroImages = home?.heroImages ?? []

  return (
    <>
      {/* ------------------------------------------------------------- 1. Hero */}
      <section
        className="relative -mt-header flex min-h-[92svh] flex-col justify-end overflow-hidden bg-ink
                   pt-[calc(var(--spacing-header)+var(--section))] pb-[var(--section)]"
      >
        {heroImages.length ? <HeroImages images={heroImages} /> : null}

        {/* Directional rather than a flat scrim — a full-frame wash turns a
            warm photograph grey. The horizontal stop was measured against the
            actual asset rather than eyeballed: the previous
            `via-ink/35 lg:to-transparent` left cream headline text sitting on
            the sunlit part of the frame at about 2:1. Holding 75% out to the
            midpoint keeps every glyph above 5:1 while the far third of the
            photograph still reads at full strength. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 via-50% to-ink/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/60 to-transparent"
        />

        {/* The hero content is above the fold at first paint, so it animates
            on a time-based stagger. The photograph itself is never animated —
            it is the LCP element, and an element at opacity 0 does not count
            as painted. */}
        <Shell className="relative">
          {settings?.tagline ? (
            <p className="eyebrow load-in text-brass-ondark">
              {settings.tagline}
            </p>
          ) : null}

          <h1 className="load-in mt-4 max-w-4xl font-display text-display text-cream [--load-delay:80ms] [--rise:14px]">
            {home?.heroHeading ?? 'Modern American cooking in Buckhead'}
          </h1>

          {home?.heroSubheading ? (
            <p className="load-in mt-6 max-w-xl font-sans text-base leading-relaxed text-cream-muted [--load-delay:160ms] lg:text-lg">
              {home.heroSubheading}
            </p>
          ) : null}

          {/* ------------------------------------------------------- 2. Book */}
          {settings?.openTableRid ? (
            <div className="load-in mt-8 max-w-3xl border border-cream/15 bg-ink/75 p-5 backdrop-blur-md [--load-delay:260ms] lg:mt-12 lg:p-6">
              <ReserveForm
                rid={settings.openTableRid}
                fallbackUrl={settings.openTableUrl}
                largePartyNote={settings.largePartyNote}
                phone={settings.phone}
                variant="bar"
              />
            </div>
          ) : null}

          <OpenStatus
            hours={settings?.machineHours}
            className="load-in mt-5 [--load-delay:340ms]"
          />
        </Shell>
      </section>

      {/* ------------------------------------------------------------ 3. Menus */}
      {menus.length ? (
        <Shell className="band-lg">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-brass">The food</p>
              <h2 className="mt-3 font-display text-lead text-ink">
                Menus
              </h2>
            </div>
            {settings?.orderUrl ? (
              <TextLink href={settings.orderUrl}>Order takeout</TextLink>
            ) : null}
          </div>

          {/* auto-fit rather than a fixed column count: the client can add a
              fifth menu (or drop to two) without the grid stranding an orphan
              tile on its own row, and a wide display gets more tiles per row
              rather than four increasingly fat ones. */}
          <ul className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-x-10">
            {menus.map((menu) => (
              <li key={menu._id} className="border-t border-ink/25">
                <Link
                  href={`/menus/${menu.slug}`}
                  className="group flex h-full flex-col justify-between gap-14 py-7 pr-6"
                >
                  <div>
                    <h3 className="font-display text-sub text-ink">
                      {menu.title}
                    </h3>
                    {menu.availability ? (
                      <p className="mt-2 font-sans text-sm text-ink-muted">
                        {menu.availability}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-sans text-sm text-brass transition-transform duration-300 ease-out-soft group-hover:translate-x-1">
                    View menu <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Shell>
      ) : null}

      {/* ------------------------------------------------------------- Story */}
      {home?.storyBody?.length ? (
        <section className="bg-paper-warm">
          <Shell className="band-lg">
            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-28">
              {home.storyImage ? (
                <div className="aspect-4/3 overflow-hidden bg-paper">
                  <SanityImage
                    image={home.storyImage}
                    width={1400}
                    height={1050}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div>
                <p className="eyebrow text-brass">Our story</p>
                <h2 className="mt-3 font-display text-lead text-ink">
                  {home.storyHeading ?? 'Flavor + Fusion'}
                </h2>
                <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-ink-muted">
                  <PortableText
                    value={home.storyBody}
                    components={PortableBody}
                  />
                </div>
                <TextLink href="/about">More about us</TextLink>
              </div>
            </div>
          </Shell>
        </section>
      ) : null}

      {/* ------------------------------------------------------ Featured dishes */}
      {home?.featuredDishes?.length ? (
        <Shell className="band-lg">
          <div>
            <p className="eyebrow text-brass">From the kitchen</p>
            <h2 className="mt-3 font-display text-lead text-ink">
              Signatures
            </h2>
          </div>

          <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-8 lg:gap-10">
            {home.featuredDishes.map((dish) => (
              <li key={dish.name} className="group lg:even:mt-16">
                {dish.image ? (
                  <div className="aspect-4/5 overflow-hidden bg-paper-warm">
                    <SanityImage
                      image={dish.image}
                      width={900}
                      height={1125}
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
                <h3 className="mt-5 font-display text-sub text-ink">
                  {dish.name}
                </h3>
                {dish.description ? (
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink-muted">
                    {dish.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Shell>
      ) : null}

      {/* --------------------------------------------------------------- Band */}
      {home?.bandImage ? (
        <section className="relative isolate overflow-hidden bg-ink">
          {/* The only landscape frame in the shoot, run edge-to-edge. Fixed
              aspect ratios rather than a viewport height so it can't become a
              letterbox slot on a short laptop screen. */}
          {/* The source is 3:2. A 2.4:1 band cropped ~40% off it and cut the
              table in half, so the widescreen ratio stops at 2:1 — and mobile
              keeps the native 3:2 rather than a 4:5 portrait crop, which
              reduced the photograph to an unreadable close-up. */}
          {/* No : it is a full-bleed photograph inside an
              overflow-hidden box, and it should simply be present. */}
          <div className="relative aspect-3/2 lg:aspect-[2/1]">
            <SanityImage
              image={home.bandImage}
              width={2400}
              height={1000}
              sizes="100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {home.bandCaption ? (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0">
                  <Shell className="pb-8 lg:pb-12">
                    <p className="font-display text-section text-cream">
                      {home.bandCaption}
                    </p>
                  </Shell>
                </div>
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Specials */}
      {specials.length ? (
        <section className="bg-paper-warm">
          <Shell className="band-lg">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-brass">Every week</p>
                <h2 className="mt-3 font-display text-lead text-ink">
                  What&rsquo;s on
                </h2>
              </div>
              <TextLink href="/specials">All specials</TextLink>
            </div>

            <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-10">
              {specials.slice(0, 4).map((special) => (
                <li key={special._id} className="border-t border-ink pt-5">
                  {special.schedule ? (
                    <p className="eyebrow text-brass">{special.schedule}</p>
                  ) : null}
                  <h3 className="mt-3 font-display text-sub text-ink">
                    {special.title}
                  </h3>
                  {special.description ? (
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                      {special.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Shell>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Gallery */}
      {gallery.length >= 3 ? (
        <section className="pb-[var(--section-lg)]">
          <Shell>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-lead text-ink">
                The room
              </h2>
              <TextLink href="/gallery">See the gallery</TextLink>
            </div>
          </Shell>

          {/* Edge-to-edge scroller: shows the room at a size worth looking at
              without forcing a tall grid onto the page. Focusable so a
              keyboard user can scroll it at all (WCAG 2.1.1).

              `role="region"` lives on a wrapper rather than on the <ul>: an
              explicit role replaces the implicit `list` role, which orphans
              the <li> children and costs a screen-reader user the item count
              and item-by-item navigation.

              No on the items — a horizontal scroll container traps a
              view() timeline the same way overflow-hidden does. */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Photographs of the dining room"
            className="mt-10 overflow-x-auto [scroll-padding-left:var(--gutter)]"
          >
            <ul className="flex snap-x snap-mandatory gap-4 px-[var(--gutter)] pb-4">
              {gallery.slice(0, 8).map((item) => (
                <li
                  key={item._id}
                  className="w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[28vw] xl:w-[22vw]"
                >
                  <div className="aspect-4/3 overflow-hidden bg-paper-warm">
                    <SanityImage
                      image={item.image}
                      alt={item.alt}
                      width={1000}
                      height={750}
                      sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 42vw, 78vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------- Visit — the room */}
      <section className="bg-ink text-cream">
        <Shell className="band-lg">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <div>
              <p className="eyebrow text-brass-ondark">Visit</p>
              <h2 className="mt-3 font-display text-lead text-cream">
                Three Alliance Center,
                <br />
                {settings?.neighborhood ?? 'Buckhead'}
              </h2>

              {settings?.address ? (
                <address className="mt-8 font-sans text-base leading-relaxed text-cream-muted not-italic">
                  {formatAddress(settings.address)}
                </address>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                {settings?.phone ? (
                  <TextLink href={telHref(settings.phone)} tone="dark">
                    {settings.phone}
                  </TextLink>
                ) : null}
                {settings?.mapsUrl ? (
                  <TextLink href={settings.mapsUrl} tone="dark">
                    Directions
                  </TextLink>
                ) : null}
              </div>

              {settings?.parkingNote ? (
                <p className="mt-8 max-w-md font-sans text-sm leading-relaxed text-cream-muted">
                  {settings.parkingNote}
                </p>
              ) : null}
            </div>

            <div>
              <h3 className="eyebrow text-cream-muted">Hours</h3>
              <div className="mt-6">
                <HoursList hours={settings?.hours} tone="dark" />
              </div>
              <OpenStatus hours={settings?.machineHours} className="mt-6" />
            </div>
          </div>
        </Shell>
      </section>

      {/* ------------------------------------------------------------- Closing */}
      <section className="bg-moss text-cream">
        <Shell className="band-lg">
          <div className="flex flex-col items-center text-center">
            <MarkColumn className="h-28 w-8 text-cream/50" chevrons={3} />
            <h2 className="mt-8 max-w-2xl font-display text-lead text-cream">
              We&rsquo;ll keep a table for you
            </h2>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/reservations"
                className="bg-cream px-10 py-4 font-sans text-sm font-medium tracking-wide text-ink transition-colors duration-200 ease-out-soft hover:bg-paper"
              >
                Reserve a table
              </Link>
              {settings?.phone ? (
                <a
                  href={telHref(settings.phone)}
                  className="border border-cream/35 px-10 py-4 font-sans text-sm font-medium tracking-wide text-cream transition-colors duration-200 ease-out-soft hover:border-cream"
                >
                  {settings.phone}
                </a>
              ) : null}
            </div>
          </div>
        </Shell>
      </section>
    </>
  )
}
