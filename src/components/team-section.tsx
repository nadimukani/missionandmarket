import { PortableText } from 'next-sanity'

import { PortableBody } from '@/components/portable-body'
import { SanityImage } from '@/components/sanity-image'
import { SITE_URL } from '@/lib/site'
import type { Person } from '@/sanity/types'

/**
 * The people behind the room.
 *
 * A featured chef gets a real editorial spread — portrait at a size worth
 * printing, name in the display serif, and their own words pulled out beside
 * it. Everyone else sits in a compact row below, so adding a second or third
 * name later doesn't dilute the lead.
 *
 * The portrait deliberately runs uncropped at 4:5 with a focal point set on
 * the face, so a vertical studio portrait is never beheaded by a wide crop.
 */
function FeaturedPerson({ person }: { person: Person }) {
  return (
    <article className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:gap-20">
      {person.portrait ? (
        <div className="relative">
          <div className="aspect-4/5 overflow-hidden rounded-xs bg-paper-warm">
            <SanityImage
              image={person.portrait}
              width={1100}
              height={1375}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="h-full w-full object-cover"
            />
          </div>
          {/* A thin moss rule anchored to the portrait — the same detail used
              above the specials, so the page reads as one system. */}
          <span
            aria-hidden="true"
            className="absolute -bottom-4 left-0 h-px w-24 bg-moss"
          />
        </div>
      ) : null}

      <div>
        <p className="eyebrow text-brass">{person.role}</p>
        <h2 className="mt-3 font-display text-4xl leading-tight font-light text-ink lg:text-5xl">
          {person.displayName ?? person.name}
        </h2>

        {person.quote ? (
          <blockquote className="mt-8 border-l border-moss pl-6">
            <p className="font-display text-2xl leading-snug font-light text-ink italic lg:text-3xl">
              {person.quote}
            </p>
          </blockquote>
        ) : null}

        {person.bio?.length ? (
          <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-ink-muted">
            <PortableText value={person.bio} components={PortableBody} />
          </div>
        ) : null}
      </div>
    </article>
  )
}

function CompactPerson({ person }: { person: Person }) {
  return (
    <li>
      {person.portrait ? (
        <div className="aspect-4/5 overflow-hidden rounded-xs bg-paper-warm">
          <SanityImage
            image={person.portrait}
            width={700}
            height={875}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <h3 className="mt-5 font-display text-2xl font-light text-ink">
        {person.displayName ?? person.name}
      </h3>
      <p className="mt-1 font-sans text-sm text-ink-muted">{person.role}</p>
    </li>
  )
}

export function TeamSection({ team }: { team: Person[] }) {
  if (!team.length) return null

  const featured = team.filter((p) => p.featured)
  const rest = team.filter((p) => !p.featured)

  return (
    <section className="mx-auto max-w-[88rem] px-5 py-20 lg:px-10 lg:py-28">
      <div className="space-y-24">
        {featured.map((person) => (
          <FeaturedPerson key={person._id} person={person} />
        ))}
      </div>

      {rest.length ? (
        <>
          <h2 className="mt-24 font-display text-3xl font-light text-ink lg:text-4xl">
            The team
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {rest.map((person) => (
              <CompactPerson key={person._id} person={person} />
            ))}
          </ul>
        </>
      ) : null}

      <TeamJsonLd team={team} />
    </section>
  )
}

/**
 * Person markup tied to the Restaurant node. `worksFor` is what lets a search
 * engine or assistant connect the chef to the restaurant rather than treating
 * the name as loose text on a page.
 */
function TeamJsonLd({ team }: { team: Person[] }) {
  const data = team.map((person) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    alternateName:
      person.displayName && person.displayName !== person.name
        ? person.displayName
        : undefined,
    jobTitle: person.role,
    worksFor: { '@id': `${SITE_URL}/#restaurant` },
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
