import type { Metadata } from 'next'
import Link from 'next/link'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { PageHero } from '@/components/page-hero'
import { SanityImage } from '@/components/sanity-image'
import { servedShort } from '@/lib/menus'
import { getGallery, getMenuList, getSchedule } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Menus — Lunch, Dinner, Happy Hour, Drinks + Dessert',
  description:
    'Lunch, dinner, happy hour, cocktails, wine and dessert menus at Mission + Market — modern American cooking with California and Pacific influences in Buckhead, Atlanta.',
  alternates: { canonical: '/menus' },
}

export default async function MenusPage() {
  const [menus, schedule, gallery] = await Promise.all([getMenuList(), getSchedule(), getGallery()])
  const hero = gallery.find((g) => g._id === 'gallery-mm-0925-03-burrata-overhead')?.image
  const [first, ...rest] = [menus.slice(0, 3), menus.slice(3)]

  const tile = (m: (typeof menus)[number], tall: boolean) => (
    <Link
      key={m._id}
      href={`/menus/${m.slug}`}
      className={`group relative block overflow-hidden bg-ink ${tall ? 'h-[70svh] min-h-[460px] lg:h-[84svh]' : 'h-[60svh] min-h-[400px]'}`}
    >
      {m.image ? (
        <SanityImage
          image={m.image}
          width={1100}
          sizes={tall ? '(min-width: 1024px) 34vw, 100vw' : '(min-width: 1024px) 50vw, 100vw'}
          className="absolute inset-0 size-full object-cover transition-transform duration-[1600ms] ease-(--ease-lux) group-hover:scale-[1.045]"
        />
      ) : null}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-ink/5" />
      <div className="absolute inset-x-0 bottom-0 px-8 pb-14 text-center text-cream">
        <p className="label text-cream/75">{servedShort(m, schedule)}</p>
        <h2 className="mt-5 font-display text-display font-light">{m.title}</h2>
        <span className="label link-line mt-7">View Menu</span>
      </div>
    </Link>
  )

  return (
    <>
      <PageHero
        label="Menus"
        title="The *Menus*"
        intro="Modern American cooking with California and Pacific influences — at lunch, at the bar and at dinner."
        image={hero}
        tone="cream"
      />
      <section aria-label="All menus">
        <div className="grid lg:grid-cols-3">{first.map((m) => tile(m, true))}</div>
        {rest[0]?.length ? <div className="grid lg:grid-cols-2">{rest[0].map((m) => tile(m, false))}</div> : null}
      </section>
      <BreadcrumbsJsonLd trail={[{ name: 'Menus', path: '/menus' }]} />
    </>
  )
}
