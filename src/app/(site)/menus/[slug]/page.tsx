import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { MenuJsonLd } from '@/components/menu-json-ld'
import { MenuView, sectionId } from '@/components/menu-view'
import { ReserveButton } from '@/components/reserve'
import { SanityImage } from '@/components/sanity-image'
import { ServingNow } from '@/components/serving-now'
import { Label, Ornament } from '@/components/ui'
import { servedLines } from '@/lib/menus'
import { findService } from '@/lib/schedule'
import { getMenu, getMenuSlugs, getSchedule } from '@/sanity/queries'
import type { MenuItem, SanityImage as SanityImageType } from '@/sanity/types'

type Props = { params: Promise<{ slug: string }> }

const SEO: Record<string, { title: string; description: string }> = {
  dinner: {
    title: 'Dinner Menu — Modern American in Buckhead',
    description:
      'The dinner menu at Mission + Market in Buckhead, Atlanta — modern American cooking with California and Pacific influences, from social plates and pasta to steaks and market sides.',
  },
  lunch: {
    title: 'Lunch Menu — Buckhead, Atlanta',
    description:
      'Weekday lunch at Mission + Market in Buckhead: social plates, handhelds, pizza, market greens and bowls, pasta and Mission plates.',
  },
  'happy-hour': {
    title: 'Happy Hour — Buckhead Bar + Patio',
    description: 'Weekday happy hour at Mission + Market in Buckhead, at the bar and on the patio: snacks and sliders.',
  },
  drinks: {
    title: 'Cocktails, Wine + Beer',
    description:
      'House cocktails, M+M spritzes, zero-proof drinks, wine by the glass and beer at Mission + Market in Buckhead, Atlanta.',
  },
  dessert: {
    title: 'Dessert + After Dinner Drinks',
    description: 'Desserts and after-dinner drinks at Mission + Market in Buckhead, Atlanta.',
  },
}

export async function generateStaticParams() {
  const slugs = await getMenuSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const menu = await getMenu(slug)
  if (!menu) return {}
  const seo = SEO[slug]
  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    title: seo?.title ?? `${menu.title} Menu`,
    description: seo?.description ?? menu.intro ?? `The ${menu.title.toLowerCase()} menu at Mission + Market in Buckhead, Atlanta.`,
    alternates: { canonical: `/menus/${slug}` },
  })
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params
  const [menu, schedule] = await Promise.all([getMenu(slug), getSchedule()])
  if (!menu) notFound()

  const served = servedLines(menu, schedule)
  // Where it's served, as the owner notes it in Hours & Closures
  // ("At the bar + on the patio").
  const notes = [
    ...new Set((menu.services ?? []).map((name) => findService(schedule, name)?.note).filter((n): n is string => Boolean(n))),
  ]
  const sections = (menu.sections ?? []).filter((s) => s.items?.length)
  // Any dish the owner has photographed, in menu order.
  const pictured = sections
    .flatMap((s) => s.items ?? [])
    .filter((i): i is MenuItem & { image: SanityImageType } => Boolean(i.image) && !i.soldOut)

  return (
    <article aria-labelledby="menu-title">
      {/* What it is, when it's served, and Reserve. The photograph sits beside
          it on large screens only, so on a phone the dishes start on the
          first screen. */}
      <header className="page grid items-center gap-12 pt-12 pb-12 sm:pt-16 lg:grid-cols-12 lg:pb-16">
        <div className={`rise text-center ${menu.image ? 'lg:col-span-5 lg:text-left' : 'lg:col-span-8 lg:col-start-3'}`}>
          <Label className="text-bronze">
            <ServingNow services={menu.services} schedule={schedule} fallback="Menu" />
          </Label>
          <h1 id="menu-title" className="mt-5 font-display text-hero font-light">
            {menu.title}
          </h1>
          {served.length ? (
            <ul className="mt-6 grid gap-1.5">
              {served.map((l, i) => (
                <li key={i} className="label text-stone">
                  {l.service && served.length > 1 ? `${l.service} · ` : ''}
                  {l.text}
                </li>
              ))}
            </ul>
          ) : null}
          {notes.length ? <p className="mt-2.5 text-sm font-light text-stone">{notes.join(' · ')}</p> : null}
          {menu.intro ? (
            <p className="mx-auto mt-6 max-w-lg text-lead font-light text-ink-soft lg:mx-0">{menu.intro}</p>
          ) : null}
          <ReserveButton className="btn btn-solid mt-8">Reserve a Table</ReserveButton>
        </div>
        {menu.image ? (
          <div className="relative hidden aspect-[4/3] overflow-hidden bg-ink lg:col-span-6 lg:col-start-7 lg:block">
            <SanityImage
              image={menu.image}
              alt={menu.image.alt || ''}
              width={1300}
              sizes="50vw"
              priority
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        ) : null}
      </header>

      {pictured.length ? (
        <section aria-labelledby="closer-look" className="pb-14 sm:pb-16">
          <h2 id="closer-look" className="label page text-center text-bronze">
            A closer look
          </h2>
          <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-(--gutter) px-(--gutter) [scrollbar-width:none] lg:mx-auto lg:grid lg:max-w-[calc(var(--container-page)_+_2*var(--gutter))] lg:grid-cols-4 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {pictured.map((item, i) => (
              <li key={`${item.name}-${i}`} className="w-[62vw] max-w-[17rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink lg:aspect-square">
                  <SanityImage
                    image={item.image}
                    alt={item.image.alt || item.name}
                    width={800}
                    sizes="(min-width: 1024px) 25vw, 62vw"
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
                <p className="mt-3.5 font-display text-[1.1875rem] leading-snug">
                  {item.name}
                  {item.price ? <span className="ml-2.5 font-sans text-[0.9375rem] text-bronze tabular">{item.price}</span> : null}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sections.length > 1 ? (
        <nav aria-label={`${menu.title}: on this page`} className="page">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-1 border-y border-ink/10 py-3">
            {sections.map((s) => (
              <a
                key={s.title}
                href={`#${sectionId(s.title)}`}
                className="px-3 py-2 text-[0.9375rem] font-light text-ink-soft transition-colors hover:text-ink"
              >
                {s.title}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <div className="page pt-16 pb-(--section) sm:pt-20">
        <MenuView menu={menu} />

        <div className="mt-24 text-center">
          <Ornament className="h-10 text-bronze" />
          <ReserveButton className="btn btn-solid mt-8">Reserve a Table</ReserveButton>
          <p className="mt-8">
            <Link href={`/menus/${slug}/print`} className="label link-line text-stone">
              Print or save this menu
            </Link>
          </p>
        </div>
      </div>

      <MenuJsonLd menu={menu} />
      <BreadcrumbsJsonLd
        trail={[
          { name: 'Menus', path: '/menus' },
          { name: menu.title, path: `/menus/${slug}` },
        ]}
      />
    </article>
  )
}
