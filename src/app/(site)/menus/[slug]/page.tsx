import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MenuJsonLd } from '@/components/menu-json-ld'
import { MenuView } from '@/components/menu-view'
import { ReserveButton } from '@/components/reserve'
import { SanityImage } from '@/components/sanity-image'
import { Eyebrow } from '@/components/ui'
import { getMenu, getMenuList } from '@/sanity/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const menus = await getMenuList()
  return menus.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const menu = await getMenu(slug)
  if (!menu) return {}
  return {
    title: `${menu.title} Menu`,
    description:
      menu.intro ?? `The ${menu.title.toLowerCase()} menu at Mission + Market in Buckhead, Atlanta.`,
    alternates: { canonical: `/menus/${menu.slug}` },
  }
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params
  const [menu, menus] = await Promise.all([getMenu(slug), getMenuList()])
  if (!menu) notFound()

  return (
    <>
      <section className="page pt-12 sm:pt-16 lg:pt-20">
        {menus.length > 1 ? (
          <nav aria-label="Menus" className="flex flex-wrap gap-x-8 gap-y-3 border-b border-ink/10 pb-5">
            {menus.map((m) => {
              const active = m.slug === menu.slug
              return (
                <Link
                  key={m._id}
                  href={`/menus/${m.slug}`}
                  aria-current={active ? 'page' : undefined}
                  className={`eyebrow transition-colors ${
                    active ? 'text-moss underline decoration-1 underline-offset-[0.6em]' : 'text-stone hover:text-ink'
                  }`}
                >
                  {m.title}
                </Link>
              )
            })}
          </nav>
        ) : null}

        <div className="grid gap-10 pt-12 pb-16 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pt-16 lg:pb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="text-bronze">Menu</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(2.75rem,1.8rem+3.6vw,5.5rem)] leading-[0.98] tracking-[-0.01em]">
              {menu.title}
            </h1>
            {menu.availability ? <p className="eyebrow mt-6 text-ink">{menu.availability}</p> : null}
            {menu.intro ? <p className="mt-4 max-w-[36rem] text-lead text-stone">{menu.intro}</p> : null}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ReserveButton>Reserve a table</ReserveButton>
              {menu.pdfUrl ? (
                <a className="eyebrow link" href={menu.pdfUrl} target="_blank" rel="noopener noreferrer">
                  Printable menu (PDF)
                </a>
              ) : null}
            </div>
          </div>
          {menu.image ? (
            <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <SanityImage
                  image={menu.image}
                  width={800}
                  height={1000}
                  sizes="30vw"
                  className="size-full object-cover"
                  priority
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="page pb-(--section)" aria-label={`${menu.title} menu`}>
        <MenuView menu={menu} />
        <p className="mt-6 max-w-prose text-sm text-stone">
          Dishes and prices are subject to change.
        </p>
      </section>

      <MenuJsonLd menu={menu} />
    </>
  )
}
