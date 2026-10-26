import type { Metadata } from 'next'
import Link from 'next/link'

import { PageIntro } from '@/components/page-intro'
import { SanityImage } from '@/components/sanity-image'
import { Arrow } from '@/components/ui'
import { VideoLoop } from '@/components/video-loop'
import { getMenuList } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Menus',
  description:
    'Lunch, happy hour and dinner menus at Mission + Market — modern American cooking with California and Pacific influences in Buckhead, Atlanta.',
  alternates: { canonical: '/menus' },
}

export default async function MenusPage() {
  const menus = await getMenuList()

  return (
    <>
      <PageIntro
        eyebrow="Menus"
        title="Lunch, happy hour + *dinner*"
        intro="Lunch on weekdays, happy hour at the bar and on the patio, and dinner every night."
      />

      <section className="page pb-(--section)" aria-label="Menus">
        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((m) => (
            <li key={m._id}>
              <Link href={`/menus/${m.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-cream">
                  {m.image ? (
                    <SanityImage
                      image={m.image}
                      width={900}
                      height={1125}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.02]"
                    />
                  ) : null}
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h2 className="font-display text-title">{m.title}</h2>
                    {m.availability ? <p className="mt-2 text-[0.9375rem] text-stone">{m.availability}</p> : null}
                  </div>
                  <Arrow className="mt-3 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-8 border-t border-ink/10 pt-12 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center sm:gap-12">
          <VideoLoop
            src="/media/dishes-overhead.mp4"
            poster="/media/dishes-overhead.jpg"
            label="plates from the menu, seen from above"
            className="aspect-[4/5] w-40 sm:w-full"
          />
          <p className="max-w-prose font-display text-subtitle">
            Modern American cooking with California and Pacific influences — built around locally sourced ingredients.
          </p>
        </div>
      </section>
    </>
  )
}
