import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'
import { redirect } from 'next/navigation'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { MenuNotices } from '@/components/menu-notices'
import { MenuPdf } from '@/components/menu-pdf'
import { ReserveButton } from '@/components/reserve'
import { ServingNow } from '@/components/serving-now'
import { Label, Ornament } from '@/components/ui'
import { servedLines } from '@/lib/menus'
import { readPageSizes } from '@/lib/pdf-pages'
import { findService } from '@/lib/schedule'
import { getMenu, getMenuSlugs, getSchedule, getSettings } from '@/sanity/queries'

type Props = { params: Promise<{ slug: string }> }

const SEO: Record<string, { title: string; description: string }> = {
  dinner: {
    title: 'Dinner Menu — Modern American in Buckhead',
    description:
      'The dinner menu at Mission + Market in Buckhead, Atlanta — modern American cooking with California and Pacific influences, with cocktails, wine and desserts.',
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

const kb = (bytes?: number) => (bytes ? `, ${Math.max(1, Math.round(bytes / 1024))} KB` : '')

export default async function MenuPage({ params }: Props) {
  const { slug } = await params
  const [menu, schedule, settings] = await Promise.all([getMenu(slug), getSchedule(), getSettings()])
  // Hidden, not uploaded yet, or never existed: offer the menus there are.
  if (!menu) redirect('/menus')

  const served = servedLines(menu, schedule)
  // Where it's served, as the owner notes it in Hours & Closures
  // ("At the bar + on the patio").
  const notes = [
    ...new Set((menu.services ?? []).map((name) => findService(schedule, name)?.note).filter((n): n is string => Boolean(n))),
  ]
  // The uploaded PDF is the menu: its pages are drawn below, in space
  // reserved from the page sizes read here.
  const pages = await readPageSizes(menu.pdf.url)

  return (
    <article aria-labelledby="menu-title">
      <header className="page pt-12 pb-10 text-center sm:pt-16 sm:pb-14">
        <div className="rise mx-auto max-w-2xl">
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
          {menu.intro ? <p className="mx-auto mt-6 max-w-lg text-lead font-light text-ink-soft">{menu.intro}</p> : null}
          <ReserveButton className="btn btn-solid mt-8">Reserve a Table</ReserveButton>
        </div>
      </header>

      <section aria-label={`The ${menu.title} menu`} className="page pb-(--section)">
        <div className="mx-auto max-w-[52rem]">
          <MenuPdf url={menu.pdf.url} title={menu.title} pages={pages ?? []} />
          <p className="mt-8 text-center">
            <a href={`${menu.pdf.url}?dl=mission-market-${slug}-menu.pdf`} className="label link-line text-stone">
              Download the menu (PDF{kb(menu.pdf.size)})
            </a>
          </p>

          <MenuNotices notices={[settings?.allergenNotice, settings?.rawFoodNotice]} className="mt-12" />
        </div>

        <div className="mt-20 text-center">
          <Ornament className="h-10 text-bronze" />
          <ReserveButton className="btn btn-solid mt-8">Reserve a Table</ReserveButton>
        </div>
      </section>

      <BreadcrumbsJsonLd
        trail={[
          { name: 'Menus', path: '/menus' },
          { name: menu.title, path: `/menus/${slug}` },
        ]}
      />
    </article>
  )
}
