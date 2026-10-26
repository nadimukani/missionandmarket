import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, stegaClean } from 'next-sanity'

import { HappeningsList } from '@/components/happenings'
import { HeroReels } from '@/components/hero-reels'
import { HoursList } from '@/components/hours'
import { Lockup } from '@/components/logo'
import { OpenStatus } from '@/components/open-status'
import { PortableBody } from '@/components/portable-body'
import { ReserveButton } from '@/components/reserve'
import { CapacityTable } from '@/components/rooms'
import { SanityImage } from '@/components/sanity-image'
import { Signatures } from '@/components/signatures'
import { ButtonLink, Emphasis, Label, LineLink, Ornament, SectionIntro } from '@/components/ui'
import { servedShort } from '@/lib/menus'
import { findService, serviceSummary } from '@/lib/schedule'
import { telHref } from '@/lib/site'
import {
  getFeaturedDishes,
  getGallery,
  getHomePage,
  getMenuList,
  getSchedule,
  getSettings,
  getSpaces,
  getSpecials,
} from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomePage(), getSettings()])
  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    title: { absolute: 'Mission + Market — Modern American Restaurant in Buckhead, Atlanta' },
    description: home?.heroSubheading ?? home?.seo?.description ?? settings?.shortDescription,
    alternates: { canonical: '/' },
  })
}

const REELS = [
  { src: '/media/atmosphere.mp4', poster: '/media/atmosphere.jpg' },
  { src: '/media/fall-cocktails.mp4', poster: '/media/fall-cocktails.jpg' },
  { src: '/media/new-dishes.mp4', poster: '/media/new-dishes.jpg' },
]

function splitFirstSentence(text = '') {
  const m = /^(.+?[.!?])\s+(.+)$/.exec(text)
  return m ? [m[1], m[2]] : [text, '']
}

export default async function HomePage() {
  const [home, settings, schedule, menus, dishes, specials, rooms, gallery] = await Promise.all([
    getHomePage(),
    getSettings(),
    getSchedule(),
    getMenuList(),
    getFeaturedDishes(),
    getSpecials(),
    getSpaces(),
    getGallery(),
  ])

  const bySlug = (slug: string) => menus.find((m) => m.slug === slug)
  const gateway = ['lunch', 'dinner', 'happy-hour'].map(bySlug).filter((m): m is NonNullable<typeof m> => Boolean(m))
  const happyHour = findService(schedule, 'Happy Hour')
  const seasonal = specials.find((s) => s.kind === 'seasonal' && s.ctaUrl)
  const weekly = specials.filter((s) => s.kind !== 'seasonal').slice(0, 4)
  const mosaic = gallery.slice(0, 5)
  const instagram = settings?.social?.find((s) => s.platform === 'Instagram')?.url
  const [seasonHeadline, seasonText] = splitFirstSentence(seasonal?.description)
  const a = settings?.address

  return (
    <>
      {/* ─────────────────────────────── Opening ─────────────────────────────── */}
      <section className="relative h-svh min-h-[640px] overflow-hidden bg-ink text-cream">
        <HeroReels reels={REELS} label="the dining room, cocktails and dishes at Mission + Market" />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(35_31_31/0.5),transparent_65%)]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-56 bg-linear-to-b from-ink/70 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-(--gutter) text-center">
          <Lockup className="rise w-[200px] sm:w-[240px] lg:w-[252px]" title="Mission + Market" />
          <h1 className="rise rise-1 label mt-10 text-cream/90">
            {/* Break at the "·" on phones rather than mid-phrase. */}
            {(home?.heroEyebrow ?? 'Modern American Restaurant · Buckhead, Atlanta').split(' · ').map((part, i) => (
              <span key={i} className="block sm:inline">
                {i > 0 ? <span className="hidden sm:inline"> · </span> : null}
                {part}
              </span>
            ))}
          </h1>
          <div className="rise rise-2 mt-12 flex flex-wrap justify-center gap-3">
            <ReserveButton className="btn btn-light">Reserve a Table</ReserveButton>
            <ButtonLink href="/menus" tone="outline">
              View Menus
            </ButtonLink>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-5 px-16">
          <OpenStatus schedule={schedule} className="text-cream/85" />
          <span aria-hidden="true" className="scroll-cue block h-10 w-px bg-cream/60" />
        </div>
      </section>

      {/* ─────────────────────────────── Welcome ─────────────────────────────── */}
      <section className="page section-y text-center">
        <Ornament className="h-12 text-bronze" />
        <h2 className="mx-auto mt-10 max-w-4xl font-display text-display font-light">
          <Emphasis text={home?.heroHeading} />
        </h2>
        {home?.storyBody ? (
          <div className="mx-auto mt-10 grid max-w-2xl gap-5 text-lead font-light text-ink-soft">
            <PortableText value={home.storyBody} components={PortableBody} />
          </div>
        ) : null}
        <LineLink href="/about" className="mt-12 text-ink">
          Our Story
        </LineLink>
      </section>

      {/* ──────────────────────────────── Menus ──────────────────────────────── */}
      <section aria-labelledby="menus-h">
        <div className="page pb-14 text-center">
          <Label className="text-bronze">The Menus</Label>
          <h2 id="menus-h" className="sr-only">
            Menus
          </h2>
        </div>
        <div className="grid lg:grid-cols-3">
          {gateway.map((m) => (
            <Link
              key={m._id}
              href={`/menus/${m.slug}`}
              className="group relative block h-[72svh] min-h-[460px] overflow-hidden bg-ink lg:h-[88svh]"
            >
              {m.image ? (
                <SanityImage
                  image={m.image}
                  width={1000}
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1600ms] ease-(--ease-lux) group-hover:scale-[1.045]"
                />
              ) : null}
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-ink/5" />
              <div className="absolute inset-x-0 bottom-0 px-8 pb-14 text-center text-cream">
                <p className="label text-cream/75">{servedShort(m, schedule)}</p>
                <h3 className="mt-5 font-display text-display font-light">{m.title}</h3>
                <span className="label link-line mt-7">View Menu</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="page flex flex-wrap justify-center gap-x-12 gap-y-4 py-12">
          {bySlug('drinks') ? <LineLink href="/menus/drinks">Drinks + Wine</LineLink> : null}
          {bySlug('dessert') ? <LineLink href="/menus/dessert">Dessert</LineLink> : null}
        </div>
      </section>

      {/* ──────────────────────────────── The Bar ────────────────────────────── */}
      <section className="grid lg:min-h-[92svh] lg:grid-cols-2" aria-labelledby="bar-h">
        <div className="relative min-h-[66svh] overflow-hidden bg-ink lg:min-h-0">
          {home?.barImage ? (
            <SanityImage
              image={home.barImage}
              width={1400}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex items-center justify-center bg-teal px-(--gutter) py-24 text-center text-cream sm:py-32">
          <div className="max-w-md">
            <Ornament className="h-10 text-cream/45" />
            <Label className="mt-8 text-cream/70">Cocktails + Wine</Label>
            <h2 id="bar-h" className="mt-6 font-display text-display font-light">
              <Emphasis text={home?.barHeading ?? 'The Bar'} />
            </h2>
            {home?.barBody ? <p className="mt-7 text-lead font-light text-mist">{home.barBody}</p> : null}
            {happyHour ? (
              <div className="mt-12 border-t border-cream/15 pt-10">
                <p className="font-display text-subtitle font-light italic">Happy Hour</p>
                <p className="label mt-4 text-cream/85">{serviceSummary(happyHour)}</p>
                {happyHour.note ? <p className="mt-3 text-sm font-light text-mist">{happyHour.note}</p> : null}
              </div>
            ) : null}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {bySlug('happy-hour') ? (
                <ButtonLink href="/menus/happy-hour" tone="light">
                  Happy Hour Menu
                </ButtonLink>
              ) : null}
              {bySlug('drinks') ? (
                <ButtonLink href="/menus/drinks" tone="outline">
                  Drinks Menu
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────── Signatures ───────────────────────────── */}
      {dishes.length ? (
        <section className="section-y overflow-hidden" aria-labelledby="sig-h">
          <div className="page">
            <div className="mx-auto max-w-3xl text-center">
              <Label className="text-bronze">From the Kitchen</Label>
              <h2 id="sig-h" className="mt-6 font-display text-display font-light">
                <Emphasis text={home?.kitchenHeading ?? 'Signatures'} />
              </h2>
            </div>
          </div>
          <div className="mt-16">
            <Signatures dishes={dishes} />
          </div>
        </section>
      ) : null}

      {/* ──────────────────────────── Private dining ─────────────────────────── */}
      <section className="grid lg:min-h-[92svh] lg:grid-cols-2" aria-labelledby="events-h">
        <div className="order-2 flex items-center justify-center bg-moss px-(--gutter) py-24 text-center text-cream sm:py-32 lg:order-1">
          <div className="w-full max-w-md">
            <Ornament className="h-10 text-cream/45" />
            <Label className="mt-8 text-cream/70">Private Dining</Label>
            <h2 id="events-h" className="mt-6 font-display text-display font-light">
              <Emphasis text={home?.eventsHeading ?? 'Private Dining & Events'} />
            </h2>
            {home?.eventsBody ? <p className="mt-7 text-lead font-light text-mist">{home.eventsBody}</p> : null}
            <div className="mt-12 text-left">
              <CapacityTable rooms={rooms} tone="cream" linkBase="/private-events" />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/private-events#inquire" tone="light">
                Plan Your Event
              </ButtonLink>
              <ButtonLink href="/private-events" tone="outline">
                The Spaces
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="relative order-1 min-h-[66svh] overflow-hidden bg-ink lg:order-2 lg:min-h-0">
          {home?.eventsImage ? (
            <SanityImage
              image={home.eventsImage}
              width={1400}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
        </div>
      </section>

      {/* ───────────────────────────── Seasonal band ─────────────────────────── */}
      {seasonal && home?.bandImage ? (
        <section className="relative isolate overflow-hidden text-cream" aria-label={seasonal.title}>
          <SanityImage
            image={home.bandImage}
            width={2048}
            sizes="100vw"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />
          <div className="page flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
            <Label className="text-cream/80">{seasonal.title}</Label>
            <h2 className="mt-7 max-w-3xl font-display text-display font-light">{seasonHeadline}</h2>
            {seasonText ? <p className="mx-auto mt-7 max-w-xl text-lead font-light text-cream/85">{seasonText}</p> : null}
            <ButtonLink href={seasonal.ctaUrl!} tone="light" className="mt-12">
              {seasonal.ctaLabel ?? 'Find out more'}
            </ButtonLink>
          </div>
        </section>
      ) : null}

      {/* ────────────────────────────── Happenings ───────────────────────────── */}
      {weekly.length ? (
        <section className="page section-y">
          <SectionIntro label="Happenings" title="Every week at Mission + Market" />
          <div className="mt-16">
            <HappeningsList items={weekly} schedule={schedule} />
          </div>
          <div className="mt-14 text-center">
            <LineLink href="/happenings" className="text-ink">
              All Happenings
            </LineLink>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────── Gallery ─────────────────────────────── */}
      {mosaic.length >= 5 ? (
        <section aria-labelledby="gallery-h" className="pb-(--section)">
          <h2 id="gallery-h" className="sr-only">
            Gallery
          </h2>
          <div className="grid grid-cols-2 gap-1 lg:h-[92svh] lg:grid-cols-4 lg:grid-rows-2">
            {mosaic.map((g, i) => (
              <div
                key={g._id}
                className={`relative overflow-hidden bg-cream ${
                  i === 0 ? 'col-span-2 aspect-[4/3] lg:col-span-1 lg:row-span-2 lg:aspect-auto' : 'aspect-square lg:aspect-auto'
                } ${i === 1 || i === 4 ? 'lg:col-span-2' : ''}`}
              >
                <SanityImage
                  image={g.image}
                  alt={g.alt}
                  width={1100}
                  sizes="(min-width: 1024px) 50vw, 50vw"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="page mt-12 flex flex-wrap justify-center gap-x-12 gap-y-4">
            {instagram ? <LineLink href={instagram}>@missionandmkt</LineLink> : null}
            <LineLink href="/gallery">The Gallery</LineLink>
          </div>
        </section>
      ) : null}

      {/* ──────────────────────────────── Visit ──────────────────────────────── */}
      <section className="bg-cream section-y" aria-labelledby="visit-h">
        <div className="page">
          <div className="mx-auto max-w-3xl text-center">
            <Label className="text-bronze">Visit</Label>
            <h2 id="visit-h" className="mt-6 font-display text-display font-light">
              Find us in <em>Buckhead</em>
            </h2>
          </div>
          <div className="mt-16 grid gap-14 text-center lg:grid-cols-3 lg:gap-10">
            <div>
              <Label className="text-bronze">Address</Label>
              {a ? (
                <address className="mt-5 font-display text-subtitle font-light not-italic">
                  <span className="block">{a.street}</span>
                  {a.street2 ? <span className="block text-[1.0625rem] text-ink-soft">{a.street2}</span> : null}
                  <span className="block text-[1.0625rem] text-ink-soft">
                    {[a.city, a.state].filter(Boolean).join(', ')} {a.zip}
                  </span>
                </address>
              ) : null}
              {settings?.parkingNote ? (
                <p className="mx-auto mt-5 max-w-xs text-sm font-light text-stone">{settings.parkingNote}</p>
              ) : null}
            </div>
            <div>
              <Label className="text-bronze">Hours</Label>
              <HoursList schedule={schedule} compact align="center" showClosures={false} className="mx-auto mt-5 max-w-xs" />
            </div>
            <div>
              <Label className="text-bronze">Reservations</Label>
              <p className="mt-5 font-display text-subtitle font-light">
                {settings?.phone ? (
                  <a className="link-line tabular" href={telHref(settings.phone)}>
                    {settings.phone}
                  </a>
                ) : null}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ReserveButton className="btn btn-solid">Reserve a Table</ReserveButton>
                {settings?.mapsUrl ? (
                  <ButtonLink href={settings.mapsUrl} tone="outline">
                    Directions
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
