import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

import { BreadcrumbsJsonLd } from '@/components/breadcrumbs-json-ld'
import { PortableBody } from '@/components/portable-body'
import { Label, Ornament, Placeholder } from '@/components/ui'
import { linkPreview } from '@/lib/metadata'
import { getJobs } from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Careers',
    description: 'Front-of-house and back-of-house positions at Mission + Market in Buckhead, Atlanta.',
    alternates: { canonical: '/careers' },
    openGraph: await linkPreview('/careers'),
  }
}

/** The positions offered on the restaurant's current application form. */
const ROLES = ['Host', 'Server', 'Bartender', 'Line Cook + Food Prep', 'Dish', 'Manager']

export default async function CareersPage() {
  const jobs = await getJobs()

  return (
    <>
      <section className="page pt-20 pb-16 text-center sm:pt-28">
        <Ornament className="h-10 text-bronze" />
        <Label className="mt-8 text-bronze">Careers</Label>
        <h1 className="mt-6 font-display text-hero font-light">
          Join the <em>Team</em>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lead font-light text-ink-soft">
          Mission + Market is always looking for qualified restaurant professionals for front-of-house and
          back-of-house positions.
        </p>
      </section>

      <section className="page pb-(--section)">
        <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Label className="text-bronze">We hire for</Label>
            <ul className="mt-6 border-t border-ink/10">
              {ROLES.map((r) => (
                <li key={r} className="border-b border-ink/10 py-5 font-display text-subtitle font-light">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            {jobs.length ? (
              <>
                <Label className="text-bronze">Open now</Label>
                <ul className="mt-6 grid gap-10">
                  {jobs.map((j) => (
                    <li key={j._id} className="border-t border-ink/10 pt-6">
                      <p className="font-display text-title font-light">{j.title}</p>
                      <p className="label mt-2 text-stone">{[j.department, j.employmentType].filter(Boolean).join(' · ')}</p>
                      {j.description ? (
                        <div className="mt-4 grid gap-4 font-light text-ink-soft">
                          <PortableText value={j.description} components={PortableBody} />
                        </div>
                      ) : null}
                      {j.applyUrl ? (
                        <a className="btn btn-solid mt-6" href={j.applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Placeholder
                className="aspect-[5/4]"
                label="How to apply"
                note="Application details are coming soon."
              />
            )}
          </div>
        </div>
      </section>
      <BreadcrumbsJsonLd trail={[{ name: 'Careers', path: '/careers' }]} />
    </>
  )
}
