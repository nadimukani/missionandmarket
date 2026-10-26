'use client'

import { useEffect, useState } from 'react'

import { bannerClosure, closureLine, type Schedule } from '@/lib/schedule'
import type { Announcement } from '@/sanity/types'

function inWindow(a: Announcement, now: number) {
  if (!a.enabled || !a.message) return false
  if (a.startsAt && now < Date.parse(a.startsAt)) return false
  if (a.endsAt && now > Date.parse(a.endsAt)) return false
  return true
}

/**
 * The thin line across the top of every page. Two sources, one place:
 *  1. the "Announcement Banner" document, when it is switched on and in its
 *     scheduled window;
 *  2. otherwise, the next closure in "Hours & Closures" — so adding
 *     "Thanksgiving: closed" there is all it takes to warn guests.
 * Re-checked against the visitor's clock so it comes down on time even from
 * a cached page.
 */
export function AnnouncementBar({
  announcement,
  schedule,
}: {
  announcement: Announcement | null
  schedule: Schedule | null
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  let message: string | undefined
  let link: { label: string; href: string } | undefined
  if (announcement && inWindow(announcement, now)) {
    message = announcement.message
    if (announcement.linkLabel && announcement.linkUrl) {
      link = { label: announcement.linkLabel, href: announcement.linkUrl }
    }
  } else {
    const closure = bannerClosure(schedule, new Date(now))
    if (closure) {
      message = closureLine(closure)
      link = { label: 'Hours', href: '/visit#hours' }
    }
  }
  if (!message) return null

  return (
    <div role="region" aria-label="Announcement" className="bg-ink text-cream">
      <p className="page flex min-h-9 flex-wrap items-center justify-center gap-x-5 gap-y-1 py-2 text-center text-[0.8125rem] font-light tracking-wide">
        <span>{message}</span>
        {link ? (
          <a
            href={link.href}
            className="label link-line text-cream/80"
            {...(/^https?:/.test(link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {link.label}
          </a>
        ) : null}
      </p>
    </div>
  )
}
