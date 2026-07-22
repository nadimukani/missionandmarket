import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MenuJsonLd } from '@/components/menu-json-ld'
import { MenuView } from '@/components/menu-view'
import { PageHeader } from '@/components/page-header'
import { getMenu, getMenuList, getSettings } from '@/sanity/queries'

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
      menu.intro ??
      `The ${menu.title.toLowerCase()} menu at Mission + Market in Buckhead, Atlanta.`,
    alternates: { canonical: `/menus/${menu.slug}` },
  }
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params
  const [menu, menus, settings] = await Promise.all([
    getMenu(slug),
    getMenuList(),
    getSettings(),
  ])

  if (!menu) notFound()

  return (
    <>
      <PageHeader
        eyebrow={menu.availability}
        title={`${menu.title} Menu`}
      >
        {menus.length > 1 ? (
          <nav
            aria-label="Menus"
            className="mt-10 flex flex-wrap justify-center gap-2"
          >
            {menus.map((m) => {
              const active = m.slug === menu.slug
              return (
                <Link
                  key={m._id}
                  href={`/menus/${m.slug}`}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-5 py-2 font-sans text-sm transition-colors ${
                    active
                      ? 'bg-brass-button text-cream'
                      : 'border border-cream/25 text-cream-muted hover:border-brass hover:text-cream'
                  }`}
                >
                  {m.title}
                </Link>
              )
            })}
          </nav>
        ) : null}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <MenuView menu={menu} />
        <MenuJsonLd menu={menu} />

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-rule pt-12 sm:flex-row sm:justify-center">
          <Link
            href="/reservations"
            className="w-full rounded-xs bg-ink px-8 py-3.5 text-center font-sans
                       text-sm font-medium text-cream transition-colors hover:bg-moss sm:w-auto"
          >
            Reserve a table
          </Link>
          {settings?.orderUrl ? (
            <a
              href={settings.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xs border border-ink/25 px-8 py-3.5 text-center
                         font-sans text-sm font-medium text-ink transition-colors
                         hover:border-ink sm:w-auto"
            >
              Order takeout
            </a>
          ) : null}
        </div>
      </div>
    </>
  )
}
