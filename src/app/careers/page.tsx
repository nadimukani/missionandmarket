import type { Metadata } from 'next'

import { ButtonLink, TextLink } from '@/components/ui'
import { PortableText } from 'next-sanity'

import { PageHeader } from '@/components/page-header'
import { PortableBody } from '@/components/portable-body'
import { getJobs, getSettings } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Front of house, back of house and management openings at Mission + Market in Buckhead, Atlanta.',
  alternates: { canonical: '/careers' },
}

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([getJobs(), getSettings()])
  const careersEmail = settings?.email

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Work with us"
        intro={
          jobs.length
            ? 'We hire for warmth first. Everything else we can teach.'
            : "No openings posted right now — we’re always glad to hear from good people."
        }
      />

      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
        {jobs.length ? (
          <ul className="divide-y divide-rule">
            {jobs.map((job) => (
              <li key={job._id} className="py-8 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl text-ink">{job.title}</h2>
                  <p className="font-sans text-sm text-ink-muted">
                    {[job.department, job.employmentType]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>

                {job.description?.length ? (
                  <div className="mt-4 font-sans text-sm text-ink-muted">
                    <PortableText
                      value={job.description}
                      components={PortableBody}
                    />
                  </div>
                ) : null}

                <ButtonLink
                  href={
                    job.applyUrl ??
                    `mailto:${careersEmail}?subject=${encodeURIComponent(
                      `Application — ${job.title}`,
                    )}`
                  }
                  variant="solid"
                  className="mt-5"
                >
                  Apply
                </ButtonLink>
              </li>
            ))}
          </ul>
        ) : careersEmail ? (
          <p className="text-center font-sans text-base text-ink-muted">
            Send a note and your résumé to{' '}
            <TextLink href={`mailto:${careersEmail}`}>
              {careersEmail}
            </TextLink>
            .
          </p>
        ) : null}
      </div>
    </>
  )
}
