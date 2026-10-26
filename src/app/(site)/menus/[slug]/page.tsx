import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { MenuJsonLd } from '@/components/menu-json-ld'
import { MenuView, sectionId } from '@/components/menu-view'
import { PageHero } from '@/components/page-hero'
import { ReserveButton } from '@/components/reserve'
import { ButtonLink } from '@/components/ui'
import { servedLines } from '@/lib/menus'
import { getMenu, getMenuList, getMenuSlugs, getSchedule } from '@/sanity/queries'

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
  const [menu, menus, schedule] = await Promise.all([getMenu(slug), getMenuList(), getSchedule()])
  if (!menu) notFound()

  const served = servedLines(menu, schedule)
  const sections = (menu.sections ?? []).filter((s) => s.items?.length && s.layout !== 'feature')

  return (
    <>
      <PageHero
        label="Menu"
        title={menu.title}
        image={menu.image}
        tone={slug === 'happy-hour' || slug === 'drinks' ? 'teal' : 'paper'}
        intro={
          <>
            {served.length ? (
              <span className="block">
                {served.map((l, i) => (
                  <span key={i} className="label block leading-loose">
                    {l.service && served.length > 1 ? `${l.service} · ` : ''}
                    {l.text}
                  </span>
                ))}
              </span>
            ) : null}
            {menu.intro ? <span className="mt-5 block">{menu.intro}</span> : null}
          </>
        }
      >
        <ReserveButton className={`btn ${slug === 'happy-hour' || slug === 'drinks' ? 'btn-light' : 'btn-solid'}`}>
          Reserve a Table
        </ReserveButton>
        <ButtonLink href={`/menus/${slug}/print`} tone="outline">
          Print Menu
        </ButtonLink>
      </PageHero>

      {/* Menu switcher */}
      <nav
        aria-label="Menus"
        className="no-print sticky top-(--header-h) z-30 border-b border-ink/10 bg-paper/95 backdrop-blur-md supports-[backdrop-filter]:bg-paper/85"
      >
        <ul className="page flex justify-start gap-8 overflow-x-auto py-5 [scrollbar-width:none] sm:justify-center sm:gap-12">
          {menus.map((m) => {
            const active = m.slug === slug
            return (
              <li key={m._id} className="shrink-0">
                <Link
                  href={`/menus/${m.slug}`}
                  aria-current={active ? 'page' : undefined}
                  className={`nav-link link-line ${active ? 'text-moss [background-size:100%_1px,100%_1px]' : 'text-ink-soft'}`}
                >
                  {m.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <section className="page section-y" aria-label={`${menu.title} menu`}>
        {sections.length > 3 ? (
          <nav aria-label={`${menu.title} sections`} className="mb-20 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {(menu.sections ?? [])
              .filter((s) => s.items?.length)
              .map((s) => (
                <a key={s.title} href={`#${sectionId(s.title)}`} className="label link-line text-stone hover:text-ink">
                  {s.title}
                </a>
              ))}
          </nav>
        ) : null}

        <MenuView menu={menu} />

        <div className="mt-24 flex flex-wrap justify-center gap-3">
          <ReserveButton className="btn btn-solid">Reserve a Table</ReserveButton>
          <ButtonLink href={`/menus/${slug}/print`} tone="outline">
            Print Menu
          </ButtonLink>
        </div>
      </section>

      <MenuJsonLd menu={menu} />
      <BreadcrumbsJsonLd
        trail={[
          { name: 'Menus', path: '/menus' },
          { name: menu.title, path: `/menus/${slug}` },
        ]}
      />
    </>
  )
}
