'use client'

import { useEffect, useState } from 'react'

import type { Announcement } from '@/sanity/types'

function inWindow(a: Announcement, now = Date.now()) {
  if (!a.enabled || !a.message) return false
  if (a.startsAt && now < Date.parse(a.startsAt)) return false
  if (a.endsAt && now > Date.parse(a.endsAt)) return false
  return true
}

/**
 * The sitewide banner from the "Announcement Banner" document. Rendered on the
 * server when it is live at build/revalidate time, then re-checked against the
 * visitor's clock — so a notice scheduled to end at midnight comes down at
 * midnight even if the cached page is a few minutes old.
 */
export function AnnouncementBar({ announcement }: { announcement: Announcement | null }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  if (!announcement || !inWindow(announcement, now)) return null

  return (
    <div role="region" aria-label="Announcement" className="bg-moss text-cream">
      <p className="page flex min-h-10 flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2.5 text-center text-sm">
        <span>{announcement.message}</span>
        {announcement.linkUrl && announcement.linkLabel ? (
          <a
            href={announcement.linkUrl}
            className="eyebrow link whitespace-nowrap"
            {...(/^https?:/.test(announcement.linkUrl)
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {announcement.linkLabel}
          </a>
        ) : null}
      </p>
    </div>
  )
}
