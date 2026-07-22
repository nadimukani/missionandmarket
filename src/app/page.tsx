import Link from 'next/link'
import { PortableText } from 'next-sanity'

import { PortableBody } from '@/components/portable-body'
import { ReserveForm } from '@/components/reserve-form'
import { SanityImage } from '@/components/sanity-image'
import { formatAddress, telHref } from '@/lib/site'
import { getHomePage, getMenuList, getSettings, getSpecials } from '@/sanity/queries'

export default async function HomePage() {
  const [home, settings, menus, specials] = await Promise.all([
    getHomePage(),
    getSettings(),
    getMenuList(),
    getSpecials(),
  ])

  const hero = home?.heroImages?.[0]

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative -mt-20 flex min-h-[88svh] items-end overflow-hidden bg-ink">
        {hero ? (
          <SanityImage
            image={hero}
            width={2400}
            height={1600}
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {/* Weighted toward the bottom so the headline and booking form stay
            legible without flattening the whole photograph. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-16 lg:px-8 lg:pb-24">
          {settings?.tagline ? (
            <p className="eyebrow text-ember">{settings.tagline}</p>
          ) : null}

          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] text-bone lg:text-7xl">
            {home?.heroHeading ?? 'Modern American cooking in Buckhead'}
          </h1>

          {home?.heroSubheading ? (
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-bone-dim">
              {home.heroSubheading}
            </p>
          ) : null}

          {settings?.openTableRid ? (
            <div className="mt-12 max-w-3xl rounded-md border border-bone-dim/15 bg-ink/70 p-5 backdrop-blur-md lg:p-6">
              <ReserveForm
                rid={settings.openTableRid}
                fallbackUrl={settings.openTableUrl}
                largePartyNote={settings.largePartyNote}
                phone={settings.phone}
                variant="bar"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* ------------------------------------------------------ Featured dishes */}
      {home?.featuredDishes?.length ? (
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-ink lg:text-4xl">
              From the kitchen
            </h2>
            <Link
              href="/menus"
              className="font-sans text-sm text-ember underline underline-offset-4 hover:text-ember-bright"
            >
              See all menus
            </Link>
          </div>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {home.featuredDishes.map((dish) => (
              <li key={dish.name}>
                {dish.image ? (
                  <div className="aspect-4/5 overflow-hidden rounded-sm bg-ink/5">
                    <SanityImage
                      image={dish.image}
                      width={800}
                      height={1000}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] hover:scale-105"
                    />
                  </div>
                ) : null}
                <h3 className="mt-5 font-display text-xl text-ink">
                  {dish.name}
                </h3>
                {dish.description ? (
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink/60">
                    {dish.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* --------------------------------------------------------------- Story */}
      {home?.storyBody?.length ? (
        <section className="bg-ink text-bone">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
            {home.storyImage ? (
              <div className="aspect-4/3 overflow-hidden rounded-sm">
                <SanityImage
                  image={home.storyImage}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div>
              <h2 className="font-display text-3xl text-bone lg:text-4xl">
                {home.storyHeading ?? 'Our story'}
              </h2>
              <div className="mt-6 space-y-4 font-sans text-base leading-relaxed text-bone-dim">
                <PortableText
                  value={home.storyBody}
                  components={PortableBody}
                />
              </div>
              <Link
                href="/about"
                className="mt-8 inline-block font-sans text-sm text-ember underline underline-offset-4 hover:text-ember-bright"
              >
                More about us
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Menus nav */}
      {menus.length ? (
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <h2 className="font-display text-3xl text-ink lg:text-4xl">Menus</h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-sm bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {menus.map((menu) => (
              <li key={menu._id} className="bg-bone">
                <Link
                  href={`/menus/${menu.slug}`}
                  className="group flex h-full flex-col justify-between gap-8 p-7 transition-colors hover:bg-bone-dim/40"
                >
                  <div>
                    <h3 className="font-display text-2xl text-ink">
                      {menu.title}
                    </h3>
                    {menu.availability ? (
                      <p className="mt-2 font-sans text-sm text-ink/55">
                        {menu.availability}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-sans text-sm text-ember">
                    View menu →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Specials */}
      {specials.length ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-ink lg:text-4xl">
                What&rsquo;s on
              </h2>
              <Link
                href="/specials"
                className="font-sans text-sm text-ember underline underline-offset-4 hover:text-ember-bright"
              >
                All specials
              </Link>
            </div>

            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {specials.slice(0, 3).map((special) => (
                <li
                  key={special._id}
                  className="border-t-2 border-ember pt-5"
                >
                  {special.schedule ? (
                    <p className="eyebrow text-ember">{special.schedule}</p>
                  ) : null}
                  <h3 className="mt-3 font-display text-xl text-ink">
                    {special.title}
                  </h3>
                  {special.description ? (
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60">
                      {special.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* --------------------------------------------------------------- Visit */}
      <section className="bg-ink text-bone">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-3 lg:px-8 lg:py-28">
          <div>
            <h2 className="font-display text-3xl text-bone lg:text-4xl">
              Visit us
            </h2>
            {settings?.address ? (
              <address className="mt-6 font-sans text-base leading-relaxed text-bone-dim not-italic">
                {formatAddress(settings.address)}
              </address>
            ) : null}
            {settings?.phone ? (
              <p className="mt-3">
                <a
                  href={telHref(settings.phone)}
                  className="font-sans text-base text-ember underline underline-offset-4 hover:text-ember-bright"
                >
                  {settings.phone}
                </a>
              </p>
            ) : null}
          </div>

          <div>
            <h3 className="eyebrow text-bone-muted">Hours</h3>
            <dl className="mt-5 space-y-3 font-sans text-sm">
              {settings?.hours?.map((row) => (
                <div key={`${row.service}-${row.days}`}>
                  <dt className="text-bone">{row.service}</dt>
                  <dd className="text-bone-muted">
                    {[row.days, row.time].filter(Boolean).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="eyebrow text-bone-muted">Parking</h3>
            {settings?.parkingNote ? (
              <p className="mt-5 font-sans text-sm leading-relaxed text-bone-dim">
                {settings.parkingNote}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/reservations"
                className="rounded-sm bg-ember px-6 py-3.5 text-center font-sans text-sm font-medium text-bone transition-colors hover:bg-ember-bright"
              >
                Reserve a table
              </Link>
              {settings?.orderUrl ? (
                <a
                  href={settings.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-bone-dim/30 px-6 py-3.5 text-center font-sans text-sm font-medium text-bone transition-colors hover:border-bone"
                >
                  Order takeout
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
