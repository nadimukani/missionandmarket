import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Lockup } from '@/components/logo'
import { PrintButton } from '@/components/print-button'
import { servedLines } from '@/lib/menus'
import { getMenu, getMenuSlugs, getSchedule } from '@/sanity/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getMenuSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const menu = await getMenu(slug)
  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    title: menu ? `${menu.title} Menu (print)` : 'Menu',
    robots: { index: false },
    alternates: { canonical: `/menus/${slug}` },
  })
}

/**
 * The printable menu — generated from the same data as the web menu, so there
 * is only ever one menu to update. Staff can print it in-house; guests can
 * save it as a PDF.
 */
export default async function PrintMenuPage({ params }: Props) {
  const { slug } = await params
  const [menu, schedule] = await Promise.all([getMenu(slug), getSchedule()])
  if (!menu) notFound()
  const served = servedLines(menu, schedule)
  const sections = (menu.sections ?? []).filter((s) => s.items?.length)

  return (
    <div className="min-h-dvh bg-[#e9e4d8] py-10 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-[8.5in] items-center justify-between px-4">
        <Link href={`/menus/${slug}`} className="label link-line">
          ← Back to the menu
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-[8.5in] bg-white px-[0.6in] py-[0.55in] text-ink shadow-[0_1px_30px_rgb(35_31_31/0.12)] print:max-w-none print:p-0 print:shadow-none">
        <header className="text-center">
          <Lockup className="mx-auto w-40 text-ink" title="Mission + Market" />
          <h1 className="label mt-5 text-ink">{menu.title}</h1>
          {served.length ? (
            <p className="mt-2 text-[10px] tracking-[0.18em] text-stone uppercase">
              {served.map((l) => (served.length > 1 && l.service ? `${l.service}: ${l.text}` : l.text)).join('   ·   ')}
            </p>
          ) : null}
        </header>

        <div className="mt-8 columns-2 gap-10 [column-fill:balance]">
          {sections.map((s) => (
            <section key={s.title} className="mb-7 break-inside-avoid">
              <h2
                className={`mb-3 border-b border-ink/20 pb-1.5 font-display text-[17px] italic ${
                  s.layout === 'feature' ? 'text-center' : ''
                }`}
              >
                {s.title}
              </h2>
              {s.note ? <p className="mb-2 text-[9.5px] tracking-wide text-stone">{s.note}</p> : null}
              <ul className="grid gap-2.5">
                {s.items!.map((item, i) => (
                  <li key={i} className={`break-inside-avoid ${s.layout === 'feature' ? 'text-center' : ''}`}>
                    <p className="text-[10px] font-medium tracking-[0.12em] uppercase">
                      {item.name}
                      {item.price ? <span className="ml-2 font-display text-[12px] tracking-normal">{item.price}</span> : null}
                    </p>
                    {item.description ? (
                      <p className="font-display text-[11.5px] leading-snug text-ink-soft italic">{item.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {menu.footnote ? (
          <p className="mt-6 border-t border-ink/15 pt-3 text-center text-[8.5px] leading-snug tracking-wide text-stone uppercase">
            {menu.footnote}
          </p>
        ) : null}
      </article>
    </div>
  )
}
