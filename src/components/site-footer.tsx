import Link from 'next/link'

import { OpenStatus } from '@/components/open-status'
import { Shell, TextLink } from '@/components/ui'
import { NAV_LINKS, formatAddress, telHref } from '@/lib/site'
import type { SiteSettings } from '@/sanity/types'

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()

  // The footer sits on every page, so it carries a summary — the services and
  // a live open/closed line — not the full per-day breakdown. Repeating the
  // whole schedule here made the footer top-heavy and duplicated the Visit
  // page. The detail lives one click away.
  const services = settings?.hours
    ? [...new Set(settings.hours.map((row) => row.service))]
    : []

  return (
    // The sticky reserve bar is fixed over the bottom of the viewport on
    // mobile and would otherwise sit permanently on top of the social links,
    // making them unreachable — the page cannot scroll past its own end.
    // This clears the bar's height plus the iOS home indicator.
    <footer className="bg-ink pb-[calc(6rem+env(safe-area-inset-bottom))] text-cream-muted lg:pb-0">
      <Shell className="py-16 lg:py-20">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
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
                    className="-my-0.5 inline-block py-2 transition-colors hover:text-cream"
                  >
                    {settings.phone}
                  </a>
                </p>
              ) : null}
              {settings?.email ? (
                <p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="-my-0.5 inline-block py-2 transition-colors hover:text-cream"
                  >
                    {settings.email}
                  </a>
                </p>
              ) : null}
              {settings?.mapsUrl ? (
                <p>
                  <TextLink href={settings.mapsUrl} tone="dark">
                    Get directions
                  </TextLink>
                </p>
              ) : null}
            </address>
          </div>

          <div>
            <h2 className="eyebrow text-cream-muted">Hours</h2>
            <OpenStatus
              hours={settings?.machineHours}
              tone="dark"
              className="mt-4"
            />
            {services.length ? (
              <ul className="mt-4 space-y-1.5 font-sans text-sm text-cream-muted">
                {services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            ) : null}
            <p className="mt-5">
              <TextLink href="/contact" tone="dark" className="text-sm">
                Full hours &amp; directions
              </TextLink>
            </p>
          </div>

          <div>
            <h2 className="eyebrow text-cream-muted">Explore</h2>
            <ul className="mt-2 font-sans text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="-my-0.5 inline-block py-2 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-cream-muted">More</h2>
            <ul className="mt-2 font-sans text-sm">
              {settings?.orderUrl ? (
                <li>
                  <a
                    href={settings.orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-my-0.5 inline-block py-2 transition-colors hover:text-cream"
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
                    className="-my-0.5 inline-block py-2 transition-colors hover:text-cream"
                  >
                    Gift Cards
                  </a>
                </li>
              ) : null}
              <li>
                <Link
                  href="/careers"
                  className="-my-0.5 inline-block py-2 transition-colors hover:text-cream"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="-my-0.5 inline-block py-2 transition-colors hover:text-cream">
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
      </Shell>
    </footer>
  )
}
