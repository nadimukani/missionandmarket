import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

import { HappeningCard } from '@/components/happening-card'
import { HoursList } from '@/components/hours'
import { OpenStatus } from '@/components/open-status'
import { PortableBody } from '@/components/portable-body'
import { ReserveButton } from '@/components/reserve'
import { SanityImage } from '@/components/sanity-image'
import { Ticker } from '@/components/ticker'
import { ButtonLink, Emphasis, Eyebrow, Plus, PlusLink } from '@/components/ui'
import { VideoLoop } from '@/components/video-loop'
import { formatAddress, telHref } from '@/lib/site'
import { getHomePage, getMenuList, getSettings, getSpaces, getSpecials } from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage()
  return {
    description: home?.seo?.description ?? undefined,
    alternates: { canonical: '/' },
  }
}

export default async function HomePage() {
  const [home, settings, menus, specials, rooms] = await Promise.all([
    getHomePage(),
    getSettings(),
    getMenuList(),
    getSpecials(),
    getSpaces(),
  ])

  const dishes = (home?.featuredDishes ?? []).filter((d) => d.image)
  const happyHour = specials.find((s) => /happy hour/i.test(s.title))
  // A live seasonal push (the holiday-party season) gets a strip right under
  // the opening; it disappears with the happening's own "hide after" date.
  const seasonal = specials.find((s) => s.kind === 'seasonal' && s.ctaUrl)
  const roomsWithCapacity = rooms.filter((r) => r.seated || r.reception)

  return (
    <>
      {/* ───────────────────────────── Opening ───────────────────────────── */}
      <section className="relative isolate overflow-hidden lg:overflow-visible">
        <div className="lg:page lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:py-10 xl:py-14">
          <div className="absolute inset-0 -z-10 lg:static lg:z-auto lg:order-2 lg:col-span-7 lg:col-start-6 lg:flex lg:items-start lg:justify-end lg:gap-4 xl:gap-5">
            <VideoLoop
              src="/media/atmosphere.mp4"
              poster="/media/atmosphere.jpg"
              label="the dining room, the bar and guests at Mission + Market"
              className="size-full lg:aspect-[9/16] lg:h-auto lg:w-[52%]"
              controlPosition="top-right"
              priority
            />
            <VideoLoop
              src="/media/fall-cocktails.mp4"
              poster="/media/fall-cocktails.jpg"
              label="fall cocktails being poured"
              className="hidden lg:mt-28 lg:block lg:aspect-[9/16] lg:w-[40%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/60 to-ink/15 lg:hidden"
            />
          </div>

          <div className="page flex min-h-[calc(92svh-var(--header-h))] flex-col justify-end pt-40 pb-10 text-cream [text-shadow:0_1px_18px_rgb(35_31_31/0.45)] lg:order-1 lg:col-span-5 lg:min-h-0 lg:justify-center lg:p-0 lg:text-ink lg:[text-shadow:none]">
            <Eyebrow className="text-cream/85 lg:text-bronze">
              {home?.heroEyebrow ?? 'Buckhead · Atlanta'}
            </Eyebrow>
            <h1 className="mt-5 font-display text-hero">
              <Emphasis text={home?.heroHeading ?? 'Mission + Market'} />
            </h1>
            {home?.heroSubheading ? (
              <p className="mt-6 max-w-[34rem] text-lead text-cream/90 lg:text-stone">{home.heroSubheading}</p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <ReserveButton className="btn btn-cream lg:btn-moss">Reserve a table</ReserveButton>
              <ButtonLink href="/menus" tone="line">
                See the menus
              </ButtonLink>
            </div>
            <OpenStatus hours={settings?.machineHours} className="mt-8 text-cream/85 lg:text-stone" tone="cream" />
          </div>
        </div>
      </section>

      <Ticker items={home?.ticker} />

      {seasonal ? (
        <section className="bg-cream" aria-label={seasonal.title}>
          <div className="page flex flex-col gap-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <p className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="eyebrow shrink-0 text-bronze">{seasonal.title}</span>
              <span className="font-display text-subtitle">{seasonal.description}</span>
            </p>
            <ButtonLink href={seasonal.ctaUrl!} className="shrink-0 self-start sm:self-center">
              {seasonal.ctaLabel ?? 'Find out more'}
            </ButtonLink>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────── Introduction ────────────────────────── */}
      <section className="page section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-10">
            <Eyebrow className="text-bronze">Flavor + Fusion</Eyebrow>
            <h2 className="mt-6 font-display text-display">
              <Emphasis text={home?.storyHeading} />
            </h2>
          </div>
        </div>
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-center lg:gap-10">
          {home?.storyImage ? (
            <div className="lg:col-span-6">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <SanityImage
                  image={home.storyImage}
                  width={1100}
                  height={1375}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="size-full object-cover"
                />
              </div>
            </div>
          ) : null}
          <div className="grid gap-5 text-lead text-stone lg:col-span-5 lg:col-start-8">
            {home?.storyBody ? <PortableText value={home.storyBody} components={PortableBody} /> : null}
            <div className="mt-4">
              <PlusLink href="/about" className="text-ink">
                About Mission + Market
              </PlusLink>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── Kitchen ───────────────────────────── */}
      <section className="section-y border-t border-ink/10" aria-labelledby="kitchen-h">
        <div className="page flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="text-bronze">Lunch + Dinner</Eyebrow>
            <h2 id="kitchen-h" className="mt-4 font-display text-display">
              <Emphasis text={home?.kitchenHeading ?? 'From the kitchen'} />
            </h2>
          </div>
          <ButtonLink href="/menus" tone="line">
            All menus
          </ButtonLink>
        </div>

        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] sm:gap-5 lg:page lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          <figure className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto">
            <VideoLoop
              src="/media/dishes-overhead.mp4"
              poster="/media/dishes-overhead.jpg"
              label="plates from the menu, seen from above"
              className="aspect-[4/5]"
            />
            <figcaption className="mt-4 text-[0.9375rem] text-stone">A few plates, from above.</figcaption>
          </figure>
          {dishes.map((d, i) => (
            <figure key={i} className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <SanityImage
                  image={d.image!}
                  width={700}
                  height={875}
                  sizes="(min-width: 1024px) 19vw, 68vw"
                  className="size-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <span className="block font-display text-card">{d.name}</span>
                {d.description ? <span className="mt-1 block text-[0.9375rem] text-stone">{d.description}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>

        {menus.length ? (
          <div className="page mt-16 lg:mt-24">
            <ul className="grid border-t border-ink/10 sm:grid-cols-3">
              {menus.map((m, i) => (
                <li
                  key={m._id}
                  className={`border-b border-ink/10 sm:border-b-0 ${i > 0 ? 'sm:border-l sm:pl-8' : ''} ${i < menus.length - 1 ? 'sm:pr-8' : ''}`}
                >
                  <a href={`/menus/${m.slug}`} className="group block py-7 sm:py-9">
                    <span className="flex items-center justify-between">
                      <span className="font-display text-title">{m.title}</span>
                      <Plus className="size-3.5 text-bronze transition-transform duration-300 group-hover:rotate-90" />
                    </span>
                    {m.availability ? (
                      <span className="mt-3 block text-[0.9375rem] text-stone">{m.availability}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* ─────────────────────────────── Bar ─────────────────────────────── */}
      <section className="bg-teal text-cream" aria-labelledby="bar-h">
        <div className="page section-y grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="relative lg:col-span-5">
            <VideoLoop
              src="/media/fall-cocktails.mp4"
              poster="/media/fall-cocktails.jpg"
              label="fall cocktails being poured at the bar"
              className="mx-auto aspect-[9/16] w-full max-w-[26rem] lg:mx-0"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow className="text-mist">The bar</Eyebrow>
            <h2 id="bar-h" className="mt-5 font-display text-display">
              <Emphasis text={home?.barHeading ?? 'The bar'} />
            </h2>
            {home?.barBody ? <p className="mt-6 max-w-prose text-lead text-mist">{home.barBody}</p> : null}

            {happyHour ? (
              <div className="mt-10 grid gap-1 border-t border-cream/15 pt-8 sm:grid-cols-[auto_1fr] sm:gap-x-10">
                <p className="font-display text-title">{happyHour.title}</p>
                <div className="sm:self-center">
                  {happyHour.schedule ? <p className="eyebrow text-cream">{happyHour.schedule}</p> : null}
                  <p className="mt-1 text-[0.9375rem] text-mist">At the bar + on the patio</p>
                </div>
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {menus.some((m) => m.slug === 'happy-hour') ? (
                <ButtonLink href="/menus/happy-hour" tone="cream">
                  Happy hour menu
                </ButtonLink>
              ) : null}
              <PlusLink href="/happenings" className="text-cream">
                What’s on
              </PlusLink>
            </div>

            {home?.barImage ? (
              <div className="mt-14 hidden w-1/2 lg:block">
                <div className="aspect-[4/5] overflow-hidden">
                  <SanityImage
                    image={home.barImage}
                    width={700}
                    height={875}
                    sizes="22vw"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Private dining ──────────────────────── */}
      <section className="page section-y" aria-labelledby="events-h">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          {home?.eventsImage ? (
            <div className="lg:col-span-6">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <SanityImage
                  image={home.eventsImage}
                  width={1100}
                  height={1375}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="size-full object-cover"
                />
              </div>
            </div>
          ) : null}
          <div className="lg:col-span-5 lg:col-start-8">
            <Eyebrow className="text-bronze">Private dining + events</Eyebrow>
            <h2 id="events-h" className="mt-5 font-display text-display">
              <Emphasis text={home?.eventsHeading ?? 'Private dining'} />
            </h2>
            {home?.eventsBody ? <p className="mt-6 text-lead text-stone">{home.eventsBody}</p> : null}

            {roomsWithCapacity.length ? (
              <ul className="mt-10 border-t border-ink/10">
                {roomsWithCapacity.map((r) => (
                  <li key={r._id} className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4">
                    <span className="font-display text-card">{r.name}</span>
                    <span className="text-[0.9375rem] text-stone tabular">
                      {[r.seated ? `${r.seated} seated` : null, r.reception ? `${r.reception} reception` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/private-events#inquire">Plan an event</ButtonLink>
              <PlusLink href="/private-events" className="text-ink">
                See the rooms
              </PlusLink>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────── Happenings ─────────────────────────── */}
      {specials.length ? (
        <section className="section-y border-t border-ink/10" aria-labelledby="happenings-h">
          <div className="page flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow className="text-bronze">What’s on</Eyebrow>
              <h2 id="happenings-h" className="mt-4 font-display text-display">
                Happenings
              </h2>
            </div>
            <ButtonLink href="/happenings" tone="line">
              Everything on
            </ButtonLink>
          </div>
          <div className="page mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {specials.slice(0, 3).map((s) => (
              <HappeningCard key={s._id} item={s} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────── Patio ───────────────────────────── */}
      {home?.patioImages?.length ? (
        <section className="bg-cream" aria-labelledby="patio-h">
          <div className="page section-y grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4 lg:pt-8">
              <Eyebrow className="text-bronze">Outside</Eyebrow>
              <h2 id="patio-h" className="mt-5 font-display text-display">
                <Emphasis text={home.patioHeading ?? 'The patio'} />
              </h2>
              {home.patioBody ? <p className="mt-6 text-lead text-stone">{home.patioBody}</p> : null}
              <div className="mt-10">
                <PlusLink href="/private-events#patio" className="text-ink">
                  Book the patio for an event
                </PlusLink>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-7 lg:col-start-6">
              {home.patioImages.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  className={`overflow-hidden bg-paper ${
                    i === 0 ? 'col-span-2 aspect-[5/4] sm:aspect-[16/10]' : 'aspect-[4/5]'
                  }`}
                >
                  <SanityImage
                    image={img}
                    width={i === 0 ? 1400 : 700}
                    height={i === 0 ? 875 : 875}
                    sizes={i === 0 ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 27vw, 50vw'}
                    className="size-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────── Visit ───────────────────────────── */}
      <section className="page section-y" aria-labelledby="visit-h">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow className="text-bronze">Visit</Eyebrow>
            <h2 id="visit-h" className="mt-5 font-display text-display">
              Find us in <em>Buckhead</em>
            </h2>
            {settings?.address ? (
              <p className="mt-6 text-lead text-stone">{formatAddress(settings.address)}</p>
            ) : null}
            {settings?.parkingNote ? <p className="mt-4 text-[0.9375rem] text-stone">{settings.parkingNote}</p> : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <ReserveButton>Reserve a table</ReserveButton>
              {settings?.mapsUrl ? (
                <ButtonLink href={settings.mapsUrl} tone="line">
                  Directions
                </ButtonLink>
              ) : null}
            </div>
            {settings?.phone ? (
              <p className="mt-8 text-[0.9375rem]">
                <a className="link tabular" href={telHref(settings.phone)}>
                  {settings.phone}
                </a>
              </p>
            ) : null}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <OpenStatus hours={settings?.machineHours} className="text-stone" />
            <HoursList hours={settings?.hours} className="mt-6" />
          </div>
        </div>
      </section>
    </>
  )
}
