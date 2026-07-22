import type { SiteSettings } from '@/sanity/types'

/** Sitewide announcement — holiday hours, buyouts, weather closures.
 *  Rendered above the header so it's the first thing a guest reads. */
export function NoticeBanner({
  notice,
}: {
  notice: SiteSettings['holidayNotice']
}) {
  if (!notice?.enabled || !notice.message) return null

  return (
    <div className="bg-brass-button text-cream">
      <p className="mx-auto max-w-[88rem] px-5 py-2.5 text-center font-sans text-sm lg:px-10">
        {notice.message}
        {notice.linkUrl && notice.linkLabel ? (
          <>
            {' '}
            <a
              href={notice.linkUrl}
              className="underline underline-offset-4 hover:no-underline"
            >
              {notice.linkLabel}
            </a>
          </>
        ) : null}
      </p>
    </div>
  )
}
