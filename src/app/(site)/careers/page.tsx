import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

import { PageIntro } from '@/components/page-intro'
import { PortableBody } from '@/components/portable-body'
import { Placeholder, Plus } from '@/components/ui'
import { getJobs } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Front-of-house and back-of-house positions at Mission + Market in Buckhead, Atlanta.',
  alternates: { canonical: '/careers' },
}

/** The positions offered on the restaurant's current application form. */
const ROLES = ['Host', 'Server', 'Bartender', 'Line cook + food prep', 'Dish', 'Manager']

export default async function CareersPage() {
  const jobs = await getJobs()

  return (
    <>
      <PageIntro
        eyebrow="Careers"
        title="Join the *team*"
        intro="Mission + Market is always looking for qualified restaurant professionals for front-of-house and back-of-house positions."
      />

      <section className="page pb-(--section)">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="eyebrow text-bronze">We hire for</h2>
            <ul className="mt-6 border-t border-ink/10">
              {ROLES.map((r) => (
                <li key={r} className="flex items-center gap-3 border-b border-ink/10 py-4 font-display text-card">
                  <Plus className="size-2.5 text-bronze" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {jobs.length ? (
              <>
                <h2 className="eyebrow text-bronze">Open now</h2>
                <ul className="mt-6 grid gap-10">
                  {jobs.map((j) => (
                    <li key={j._id} className="border-t border-ink/10 pt-6">
                      <p className="font-display text-title">{j.title}</p>
                      <p className="eyebrow mt-2 text-stone">
                        {[j.department, j.employmentType].filter(Boolean).join(' · ')}
                      </p>
                      {j.description ? (
                        <div className="mt-4 grid gap-4 text-stone">
                          <PortableText value={j.description} components={PortableBody} />
                        </div>
                      ) : null}
                      {j.applyUrl ? (
                        <a className="btn btn-moss mt-6" href={j.applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Placeholder
                className="aspect-[5/3]"
                label="How to apply"
                note="Application email or link to come from the restaurant. Openings publish from Job Openings in the Studio."
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
