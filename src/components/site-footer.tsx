import Link from 'next/link'

import { HoursList } from '@/components/hours'
import { Lockup } from '@/components/logo'
import { ReserveButton } from '@/components/reserve'
import { NAV_LINKS, telHref } from '@/lib/site'
import type { SiteSettings } from '@/sanity/types'

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const a = settings?.address
  const social = (settings?.social ?? []).filter((s) => s.url && s.platform !== 'Tripadvisor')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-moss text-cream">
      <div className="page pt-20 pb-28 lg:pt-28 lg:pb-14">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Mission + Market — home" className="inline-block">
              <Lockup className="w-44 text-cream sm:w-52" />
            </Link>
            {settings?.tagline ? (
              <p className="mt-6 font-display text-subtitle italic text-cream/90">{settings.tagline}</p>
            ) : null}
            <div className="mt-8">
              <ReserveButton className="btn btn-cream">Reserve a table</ReserveButton>
            </div>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="eyebrow text-cream/70">Visit</h2>
              {a ? (
                <address className="mt-5 text-[0.9375rem] not-italic leading-relaxed">
                  {a.street2?.includes('Three Alliance') ? null : (
                    <span className="block">Three Alliance Center</span>
                  )}
                  <span className="block">{a.street}</span>
                  {a.street2 ? <span className="block">{a.street2}</span> : null}
                  <span className="block">
                    {[a.city, a.state].filter(Boolean).join(', ')} {a.zip}
                  </span>
                </address>
              ) : null}
              <div className="mt-4 grid gap-1.5 text-[0.9375rem]">
                {settings?.mapsUrl ? (
                  <a className="link w-fit" href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Get directions
                  </a>
                ) : null}
                {settings?.phone ? (
                  <a className="link w-fit tabular" href={telHref(settings.phone)}>
                    {settings.phone}
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <h2 className="eyebrow text-cream/70">Hours</h2>
              <HoursList hours={settings?.hours} tone="cream" compact className="mt-5 [&_dt]:text-[1.25rem]" />
            </div>

            <div className="grid content-start gap-10">
              <nav aria-label="Footer">
                <h2 className="eyebrow text-cream/70">Explore</h2>
                <ul className="mt-5 grid gap-2 text-[0.9375rem]">
                  {[...NAV_LINKS, { href: '/gallery', label: 'Gallery' }, { href: '/reservations', label: 'Reservations' }, { href: '/careers', label: 'Careers' }].map(
                    (l) => (
                      <li key={l.href}>
                        <Link className="link" href={l.href}>
                          {l.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
              <div>
                <h2 className="eyebrow text-cream/70">Elsewhere</h2>
                <ul className="mt-5 grid gap-2 text-[0.9375rem]">
                  {settings?.orderUrl ? (
                    <li>
                      <a className="link" href={settings.orderUrl} target="_blank" rel="noopener noreferrer">
                        Order online
                      </a>
                    </li>
                  ) : null}
                  {settings?.giftCardUrl ? (
                    <li>
                      <a className="link" href={settings.giftCardUrl} target="_blank" rel="noopener noreferrer">
                        Gift cards
                      </a>
                    </li>
                  ) : null}
                  {social.map((s) => (
                    <li key={s.url}>
                      <a className="link" href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/70 sm:flex-row sm:justify-between">
          <p>
            © {year} {settings?.name ?? 'Mission + Market'}
            {settings?.neighborhood ? ` · ${settings.neighborhood}, Atlanta` : ''}
          </p>
        </div>
      </div>
    </footer>
  )
}
