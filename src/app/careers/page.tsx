import type { Metadata } from 'next'

import { ButtonLink, Measure, TextLink } from '@/components/ui'
import { PortableText } from 'next-sanity'

import { PageHeader } from '@/components/page-header'
import { PortableBody } from '@/components/portable-body'
import { telHref } from '@/lib/site'
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
            : 'No openings posted right now — we’re always glad to hear from good people.'
        }
      />

      <Measure className="band">
        {jobs.length ? (
          <ul className="divide-y divide-rule">
            {jobs.map((job) => {
              // The jobPosting schema tells the editor"leave blank to use the
              // careers email" — but no email exists in the dataset, and this
              // used to interpolate it unguarded, so publishing a posting with
              // no applyUrl shipped a live `mailto:undefined` button. Fall
              // back to the phone, then to nothing, rather than to a control
              // that cannot work.
              const applyHref =
                job.applyUrl ??
                (careersEmail
                  ? `mailto:${careersEmail}?subject=${encodeURIComponent(
                      `Application — ${job.title}`,
                    )}`
                  : undefined)

              return (
                <li key={job._id} className="py-8 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-2xl text-ink">
                      {job.title}
                    </h2>
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

                  {applyHref ? (
                    <ButtonLink
                      href={applyHref}
                      variant="solid"
                      className="mt-5"
                      // Six postings otherwise give a screen-reader user six
                      // links all announced as"Apply".
                      ariaLabel={`Apply for ${job.title}`}
                    >
                      Apply
                    </ButtonLink>
                  ) : settings?.phone ? (
                    <p className="mt-5 font-sans text-sm text-ink-muted">
                      To apply, call{' '}
                      <TextLink href={telHref(settings.phone)}>
                        {settings.phone}
                      </TextLink>
                      .
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        ) : (
          // Both branches could previously resolve to null, leaving a padded
          // but completely empty <div> between the masthead and the footer.
          <p className="text-center font-sans text-base text-ink-muted">
            {careersEmail ? (
              <>
                Send a note and your résumé to{' '}
                <TextLink href={`mailto:${careersEmail}`}>
                  {careersEmail}
                </TextLink>
                .
              </>
            ) : settings?.phone ? (
              <>
                Call{' '}
                <TextLink href={telHref(settings.phone)}>
                  {settings.phone}
                </TextLink>{' '}
                and ask for a manager, or come in and introduce yourself — we
                would rather meet you than read a form.
              </>
            ) : (
              'Come in and ask for a manager — we would rather meet you than read a form.'
            )}
          </p>
        )}
      </Measure>
    </>
  )
}
