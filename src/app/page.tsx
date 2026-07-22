import Link from 'next/link'

import { TextLink } from '@/components/ui'
import { PortableText } from 'next-sanity'

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
 * Homepage order is deliberate, and follows what someone opening a restaurant
 * site is actually trying to do rather than what makes the prettiest brochure:
 *
 *   1. Confirm they're in the right place, and see the room.
 *   2. Book — immediately, without scrolling or hunting for a button.
 *   3. Read the menu.
 *   4. Work out when it's open and where to park.
 *
 * Everything else (story, specials, photography) sits below that, because it
 * is what a guest browses once those four questions are answered.
 */
export default async function HomePage() {
  const [home, settings, menus, specials, gallery] = await Promise.all([
    getHomePage(),
    getSettings(),
    getMenuList(),
    getSpecials(),
    getGallery(),
  ])

  const hero = home?.heroImages?.[0]

  return (
    <>
      {/* ------------------------------------------------------------- 1. Hero */}
      <section className="relative -mt-header flex min-h-[92svh] flex-col justify-end overflow-hidden bg-ink">
        {hero ? (
          <SanityImage
            image={hero}
            width={2400}
            height={1500}
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {/* The room photographs bright — full of daylight through sheer
            curtains — so a full-frame scrim turns it grey. These are
            directional instead: one behind the text column, one just deep
            enough at the head to hold the header, leaving the windows and the
            warm wine display at full strength. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10 lg:via-ink/35 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/60 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-[88rem] px-5 pt-28 pb-14 sm:pt-40 lg:px-10 lg:pb-20">
          <div className="flex items-end gap-6 lg:gap-10">
            <MarkColumn
              className="hidden h-40 w-11 shrink-0 text-cream/45 lg:block"
              chevrons={4}
            />

            <div className="min-w-0 flex-1">
              {settings?.tagline ? (
                <p className="eyebrow text-brass-ondark">{settings.tagline}</p>
              ) : null}

              <h1 className="mt-4 max-w-4xl font-display text-[2.75rem] leading-[1.02] font-light text-cream sm:text-6xl lg:text-[5rem]">
                {home?.heroHeading ?? 'Modern American cooking in Buckhead'}
              </h1>

              {home?.heroSubheading ? (
                <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-cream-muted lg:text-lg">
                  {home.heroSubheading}
                </p>
              ) : null}
            </div>
          </div>

          {/* ------------------------------------------------------- 2. Book */}
          {settings?.openTableRid ? (
            <div className="mt-6 max-w-3xl rounded-xs border border-cream/15 bg-ink/75 p-5 backdrop-blur-md lg:mt-12 lg:p-6">
              <ReserveForm
                rid={settings.openTableRid}
                fallbackUrl={settings.openTableUrl}
                largePartyNote={settings.largePartyNote}
                phone={settings.phone}
                variant="bar"
              />
            </div>
          ) : null}

          <OpenStatus hours={settings?.machineHours} className="mt-5" />
        </div>
      </section>

      {/* ------------------------------------------------------------ 3. Menus */}
      {menus.length ? (
        <section className="mx-auto max-w-[88rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-brass">The food</p>
              <h2 className="mt-3 font-display text-4xl font-light text-ink lg:text-5xl">
                Menus
              </h2>
            </div>
            {settings?.orderUrl ? (
              <TextLink href={settings.orderUrl}>
                Order takeout
              </TextLink>
            ) : null}
          </div>

          {/* auto-fit rather than a fixed column count: the client can add a
              fifth menu (or drop to two) without the grid stranding an orphan
              tile on its own row. */}
          <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-px overflow-hidden border border-rule bg-rule-strong">
            {menus.map((menu) => (
              <li key={menu._id} className="bg-paper">
                <Link
                  href={`/menus/${menu.slug}`}
                  className="group flex h-full flex-col justify-between gap-10 p-8 transition-colors hover:bg-paper-warm lg:p-10"
                >
                  <div>
                    <h3 className="font-display text-3xl font-light text-ink">
                      {menu.title}
                    </h3>
                    {menu.availability ? (
                      <p className="mt-2 font-sans text-sm text-ink-muted">
                        {menu.availability}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-sans text-sm text-brass transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1">
                    View menu <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* -------------------------------------------------- 4. Visit — the room */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-[88rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <div>
              <p className="eyebrow text-brass-ondark">Visit</p>
              <h2 className="mt-3 font-display text-4xl font-light text-cream lg:text-5xl">
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
              <dl className="mt-6 grid gap-x-10 sm:grid-cols-2">
                {settings?.hours?.map((row) => (
                  <div
                    key={`${row.service}-${row.days}`}
                    className="flex justify-between gap-4 border-b border-cream/10 py-3"
                  >
                    <dt className="font-sans text-sm text-cream">
                      {row.service}
                      {row.days ? (
                        <span className="block text-xs text-cream-muted">
                          {row.days}
                        </span>
                      ) : null}
                    </dt>
                    <dd className="font-sans text-sm text-cream-muted tabular-nums">
                      {row.time}
                    </dd>
                  </div>
                ))}
              </dl>
              <OpenStatus hours={settings?.machineHours} className="mt-6" />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Story */}
      {home?.storyBody?.length ? (
        <section className="mx-auto max-w-[88rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
            {home.storyImage ? (
              <div className="aspect-4/3 overflow-hidden rounded-xs bg-paper-warm">
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
              <h2 className="mt-3 font-display text-4xl font-light text-ink lg:text-5xl">
                {home.storyHeading ?? 'Flavor + Fusion'}
              </h2>
              <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-ink-muted">
                <PortableText value={home.storyBody} components={PortableBody} />
              </div>
              <TextLink href="/about">
                More about us
              </TextLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------ Featured dishes */}
      {home?.featuredDishes?.length ? (
        <section className="bg-paper-warm">
          <div className="mx-auto max-w-[88rem] px-5 py-20 lg:px-10 lg:py-28">
            <p className="eyebrow text-brass">From the kitchen</p>
            <h2 className="mt-3 font-display text-4xl font-light text-ink lg:text-5xl">
              Signatures
            </h2>

            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {home.featuredDishes.map((dish) => (
                <li key={dish.name}>
                  {dish.image ? (
                    <div className="aspect-4/5 overflow-hidden rounded-xs bg-paper">
                      <SanityImage
                        image={dish.image}
                        width={900}
                        height={1125}
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] hover:scale-[1.04]"
                      />
                    </div>
                  ) : null}
                  <h3 className="mt-5 font-display text-2xl font-light text-ink">
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
          </div>
        </section>
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
                <p className="absolute inset-x-0 bottom-0 mx-auto max-w-[88rem] px-5 pb-8 font-display text-2xl font-light text-cream lg:px-10 lg:pb-12 lg:text-4xl">
                  {home.bandCaption}
                </p>
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Specials */}
      {specials.length ? (
        <section className="mx-auto max-w-[88rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-brass">Every week</p>
              <h2 className="mt-3 font-display text-4xl font-light text-ink lg:text-5xl">
                What&rsquo;s on
              </h2>
            </div>
            <TextLink href="/specials">
              All specials
            </TextLink>
          </div>

          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {specials.slice(0, 4).map((special) => (
              <li key={special._id} className="border-t border-ink pt-5">
                {special.schedule ? (
                  <p className="eyebrow text-brass">{special.schedule}</p>
                ) : null}
                <h3 className="mt-3 font-display text-2xl font-light text-ink">
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
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Gallery */}
      {gallery.length >= 3 ? (
        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-[88rem] px-5 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl font-light text-ink lg:text-5xl">
                The room
              </h2>
              <TextLink href="/gallery">
                See the gallery
              </TextLink>
            </div>
          </div>

          {/* Edge-to-edge scroller: shows the room at a size worth looking at
              without forcing a tall grid onto the page. */}
          {/* Focusable so a keyboard user can scroll it at all (WCAG 2.1.1),
              and scroll-padding so snapped items respect the page gutter. */}
          <ul
            tabIndex={0}
            role="region"
            aria-label="Photographs of the dining room"
            className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scroll-padding-left:1.25rem] lg:px-10 lg:[scroll-padding-left:2.5rem]"
          >
            {gallery.slice(0, 8).map((item) => (
              <li
                key={item._id}
                className="w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[30vw]"
              >
                <div className="aspect-4/3 overflow-hidden rounded-xs bg-paper-warm">
                  <SanityImage
                    image={item.image}
                    alt={item.alt}
                    width={1000}
                    height={750}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 42vw, 78vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------------------------------------------- Closing */}
      <section className="bg-moss text-cream">
        <div className="mx-auto flex max-w-[88rem] flex-col items-center px-5 py-20 text-center lg:px-10 lg:py-28">
          <MarkColumn className="h-28 w-8 text-cream/50" chevrons={3} />
          <h2 className="mt-8 max-w-2xl font-display text-4xl font-light text-cream lg:text-5xl">
            We&rsquo;ll keep a table for you
          </h2>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/reservations"
              className="rounded-xs bg-cream px-10 py-4 font-sans text-sm font-medium tracking-wide text-ink transition-colors hover:bg-paper"
            >
              Reserve a table
            </Link>
            {settings?.phone ? (
              <a
                href={telHref(settings.phone)}
                className="rounded-xs border border-cream/35 px-10 py-4 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:border-cream"
              >
                {settings.phone}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
