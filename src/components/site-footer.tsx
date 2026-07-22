import Link from 'next/link'

import { NAV_LINKS, formatAddress, telHref } from '@/lib/site'
import type { SiteSettings } from '@/sanity/types'

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-cream-muted">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl text-cream">
              Mission <span className="text-brass-ondark">+</span> Market
            </p>
            {settings?.tagline ? (
              <p className="mt-2 font-sans text-sm text-cream-muted">
                {settings.tagline}
              </p>
            ) : null}
          </div>

          <div>
            <h2 className="eyebrow text-cream-muted">Visit</h2>
            <address className="mt-4 space-y-2 font-sans text-sm not-italic">
              {settings?.address ? (
                <p>{formatAddress(settings.address)}</p>
              ) : null}
              {settings?.phone ? (
                <p>
                  <a
                    href={telHref(settings.phone)}
                    className="transition-colors hover:text-cream"
                  >
                    {settings.phone}
                  </a>
                </p>
              ) : null}
              {settings?.email ? (
                <p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="transition-colors hover:text-cream"
                  >
                    {settings.email}
                  </a>
                </p>
              ) : null}
              {settings?.mapsUrl ? (
                <p>
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brass-ondark underline underline-offset-4 hover:text-cream"
                  >
                    Get directions
                  </a>
                </p>
              ) : null}
            </address>
          </div>

          <div>
            <h2 className="eyebrow text-cream-muted">Hours</h2>
            <dl className="mt-4 space-y-2 font-sans text-sm">
              {settings?.hours?.map((row) => (
                <div key={`${row.service}-${row.days}`}>
                  <dt className="text-cream">{row.service}</dt>
                  <dd className="text-cream-muted">
                    {[row.days, row.time].filter(Boolean).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="eyebrow text-cream-muted">Explore</h2>
            <ul className="mt-4 space-y-2 font-sans text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {settings?.orderUrl ? (
                <li>
                  <a
                    href={settings.orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-cream"
                  >
                    Order Takeout
                  </a>
                </li>
              ) : null}
              {settings?.giftCardUrl ? (
                <li>
                  <a
                    href={settings.giftCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-cream"
                  >
                    Gift Cards
                  </a>
                </li>
              ) : null}
              <li>
                <Link
                  href="/careers"
                  className="transition-colors hover:text-cream"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="transition-colors hover:text-cream">
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-cream/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-cream-muted">
            © {year} {settings?.name ?? 'Mission + Market'}. All rights reserved.
          </p>

          {settings?.social?.length ? (
            <ul className="flex gap-6">
              {settings.social.map((s) =>
                s.url ? (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs tracking-wide transition-colors hover:text-cream"
                    >
                      {s.platform}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
