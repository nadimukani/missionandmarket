import type { Metadata } from 'next'
import Link from 'next/link'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { SanityImage } from '@/components/sanity-image'
import { ServingNow } from '@/components/serving-now'
import { Arrow, Emphasis, Label } from '@/components/ui'
import { servedShort } from '@/lib/menus'
import { getMenuList, getSchedule } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Menus — Lunch, Dinner, Happy Hour, Drinks + Dessert',
  description:
    'Lunch, dinner, happy hour, cocktails, wine and dessert menus at Mission + Market — modern American cooking with California and Pacific influences in Buckhead, Atlanta.',
  alternates: { canonical: '/menus' },
}

/**
 * The chooser: every menu, when it's served and whether it's being served
 * now, all on the first screen — rows on a phone, five photographs across on
 * a desktop. Picking one opens it beneath the menu switcher, each at its own
 * address.
 */
export default async function MenusPage() {
  const [menus, schedule] = await Promise.all([getMenuList(), getSchedule()])

  return (
    <>
      <header className="page pt-10 pb-8 text-center sm:pt-16 sm:pb-12">
        <Label className="rise text-bronze">Menus</Label>
        <h1 className="rise rise-1 mt-5 font-display text-display font-light">
          <Emphasis text="The *Menus*" />
        </h1>
        <p className="rise rise-2 mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed font-light text-ink-soft sm:text-lead">
          Modern American cooking with California and Pacific influences — at lunch, at the bar and at dinner.
        </p>
      </header>

      <nav aria-label="Choose a menu" className="page pb-(--section)">
        <ul className="rise rise-3 mx-auto grid max-w-2xl border-t border-ink/10 lg:max-w-none lg:grid-cols-5 lg:gap-6 lg:border-0">
          {menus.map((m, i) => (
            <li key={m._id} className="border-b border-ink/10 lg:border-0">
              <Link
                href={`/menus/${m.slug}`}
                className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-5 lg:grid-cols-1 lg:gap-0 lg:py-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink lg:aspect-[3/4]">
                  {m.image ? (
                    <SanityImage
                      image={m.image}
                      alt=""
                      width={700}
                      sizes="(min-width: 1024px) 20vw, 72px"
                      priority={i < 3}
                      className="absolute inset-0 size-full object-cover transition-transform duration-[1600ms] ease-(--ease-lux) group-hover:scale-[1.05]"
                    />
                  ) : null}
                </div>
                <div className="lg:mt-6 lg:text-center">
                  <h2 className="font-display text-[1.625rem] leading-tight font-light transition-colors duration-300 group-hover:text-moss lg:text-[2.25rem]">
                    {m.title}
                  </h2>
                  <p className="mt-1 text-[0.8125rem] leading-snug font-light tracking-wide text-stone lg:label lg:mt-3 lg:text-stone">
                    {servedShort(m, schedule)}
                  </p>
                  <p className="label mt-1.5 min-h-[1.4em] text-moss">
                    <ServingNow services={m.services} schedule={schedule} />
                  </p>
                </div>
                <Arrow className="size-3 text-stone transition-transform duration-500 group-hover:translate-x-1 lg:hidden" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <BreadcrumbsJsonLd trail={[{ name: 'Menus', path: '/menus' }]} />
    </>
  )
}
