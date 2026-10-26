'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useNow } from '@/components/serving-now'
import { servingNow, type Schedule } from '@/lib/schedule'

type MenuLink = { slug: string; title: string; services?: string[] }

/**
 * The menus as one row of links, pinned under the header on every menu page.
 * Each menu is a real page (its own URL, title and search listing); the
 * shared layout and prefetching make switching feel like changing tabs.
 * Sentence-case labels so all five fit a 360px phone — if the owner adds
 * more, the row scrolls, fades at the edge and keeps the current one in
 * view. A dot marks the menu being served now, worked out in the browser.
 */
export function MenuSwitcher({ menus, schedule }: { menus: MenuLink[]; schedule: Schedule | null }) {
  const active = useSelectedLayoutSegment()
  const now = useNow()
  const row = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = row.current
    if (!el) return
    const fit = () => {
      const overflowing = el.scrollWidth > el.clientWidth + 1
      el.dataset.overflow = String(overflowing)
      const current = el.querySelector<HTMLElement>('[aria-current="page"]')
      if (overflowing && current) el.scrollLeft = current.offsetLeft - (el.clientWidth - current.offsetWidth) / 2
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [active])

  // The /menus chooser shows the menus as cards instead.
  if (!active) return null
  const live = now ? servingNow(menus, schedule, now)?.slug : undefined

  return (
    <nav aria-label="Menus" className="no-print sticky top-(--header-h) z-30 border-b border-ink/10 bg-paper">
      <ul
        ref={row}
        className="mx-auto flex max-w-(--container-page) justify-center-safe overflow-x-auto px-3 [scrollbar-width:none] data-[overflow=true]:[mask-image:linear-gradient(to_right,#000_calc(100%_-_2.5rem),transparent)] sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {menus.map((m) => {
          const current = m.slug === active
          return (
            <li key={m.slug} className="shrink-0">
              <Link
                href={`/menus/${m.slug}`}
                aria-current={current ? 'page' : undefined}
                className={`relative flex h-12 items-center gap-1.5 px-2 text-[0.875rem] whitespace-nowrap transition-colors duration-300 sm:h-14 sm:px-5 sm:text-[0.9375rem] ${
                  current ? 'text-ink' : 'text-stone hover:text-ink'
                }`}
              >
                {m.title}
                {live === m.slug ? (
                  <>
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#7d9a4a]" />
                    <span className="sr-only">(serving now)</span>
                  </>
                ) : null}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2 bottom-0 h-0.5 bg-moss transition-transform duration-500 ease-(--ease-lux) sm:inset-x-5 ${
                    current ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
