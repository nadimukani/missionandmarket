'use client'

import Link from 'next/link'
import { useRef } from 'react'

import { SanityImage } from '@/components/sanity-image'
import { Arrow } from '@/components/ui'
import type { FeaturedDish } from '@/sanity/types'

/**
 * Signature dishes — straight from the menus (ticked "Feature on the home
 * page" there), so the home page can never show a plate the menu dropped.
 * A horizontal gallery: large frames, one gesture to browse.
 */
export function Signatures({ dishes }: { dishes: FeaturedDish[] }) {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <ul
        ref={track}
        className="flex snap-x snap-mandatory scroll-px-(--gutter) gap-5 overflow-x-auto px-(--gutter) pb-4 [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {dishes.map((d) => (
          <li key={`${d.menuSlug}-${d.name}`} className="w-[78vw] shrink-0 snap-center sm:w-[44vw] lg:w-[30vw] lg:snap-start xl:w-[26vw]">
            <Link href={`/menus/${d.menuSlug}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-cream">
                <SanityImage
                  image={d.image}
                  width={900}
                  height={1200}
                  sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                  className="size-full object-cover transition-transform duration-[1600ms] ease-(--ease-lux) group-hover:scale-[1.045]"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-[0.8125rem] font-medium tracking-[0.16em] uppercase">{d.name}</p>
                {d.description ? (
                  <p className="mx-auto mt-2 max-w-xs font-display text-[1.0625rem] text-ink-soft italic">{d.description}</p>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {dishes.length > 3 ? (
        <div className="page mt-10 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="grid size-12 place-items-center border border-ink/25 transition-colors hover:border-ink"
            aria-label="Previous dishes"
          >
            <Arrow className="size-3.5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="grid size-12 place-items-center border border-ink/25 transition-colors hover:border-ink"
            aria-label="More dishes"
          >
            <Arrow className="size-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
