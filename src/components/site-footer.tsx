import Link from 'next/link'

import { HoursList } from '@/components/hours'
import { Lockup } from '@/components/logo'
import { ReserveButton } from '@/components/reserve'
import { telHref } from '@/lib/site'
import type { Schedule } from '@/lib/schedule'
import type { SiteSettings } from '@/sanity/types'

const EXPLORE = [
  { href: '/menus', label: 'Menus' },
  { href: '/private-events', label: 'Private Dining' },
  { href: '/happenings', label: 'Happenings' },
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/careers', label: 'Careers' },
]

export function SiteFooter({ settings, schedule }: { settings: SiteSettings | null; schedule: Schedule | null }) {
  const a = settings?.address
  const social = (settings?.social ?? []).filter((s) => s.url && ['Instagram', 'Facebook'].includes(s.platform ?? ''))
  const sisters = (settings?.relatedAccounts ?? []).filter((r) => r.url && r.label)
  const year = new Date().getFullYear()

  return (
    <footer className="bg-moss text-cream">
      <div className="page pt-24 pb-28 lg:pt-32 lg:pb-14">
        <div className="text-center">
          <Link href="/" aria-label="Mission + Market — home" className="inline-block">
            <Lockup className="mx-auto w-44 text-cream sm:w-52" />
          </Link>
          {settings?.tagline ? (
            <p className="mt-7 font-display text-subtitle font-light italic text-cream/85">{settings.tagline}</p>
          ) : null}
          <ReserveButton className="btn btn-light mt-10">Reserve a Table</ReserveButton>
        </div>

        <div className="mt-20 grid gap-12 border-t border-cream/15 pt-14 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4 lg:gap-10">
          <div>
            <h2 className="label text-cream/60">Visit</h2>
            {a ? (
              <address className="mt-5 text-[0.9375rem] leading-relaxed font-light not-italic">
                <span className="block">{a.street}</span>
                {a.street2 ? <span className="block">{a.street2}</span> : null}
                <span className="block">
                  {[a.city, a.state].filter(Boolean).join(', ')} {a.zip}
                </span>
              </address>
            ) : null}
            <div className="mt-5 grid justify-center gap-2 text-[0.9375rem] font-light sm:justify-start">
              {settings?.mapsUrl ? (
                <a className="link" href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Directions
                </a>
              ) : null}
              {settings?.phone ? (
                <a className="link tabular" href={telHref(settings.phone)}>
                  {settings.phone}
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="label text-cream/60">Hours</h2>
            <HoursList schedule={schedule} tone="cream" compact showClosures={false} className="mx-auto mt-5 max-w-xs sm:mx-0" />
          </div>

          <nav aria-label="Footer">
            <h2 className="label text-cream/60">Explore</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.9375rem] font-light">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link className="link" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label text-cream/60">Follow + Order</h2>
            <ul className="mt-5 grid gap-2 text-[0.9375rem] font-light">
              {social.map((s) => (
                <li key={s.url}>
                  <a className="link" href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.platform}
                  </a>
                </li>
              ))}
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
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-cream/15 pt-8 text-xs font-light text-cream/60 lg:flex-row lg:justify-between">
          <p>
            © {year} {settings?.name ?? 'Mission + Market'} · Buckhead, Atlanta
          </p>
          {sisters.length ? (
            <p className="flex flex-wrap justify-center gap-x-4">
              <span>Sister restaurants</span>
              {sisters.map((s) => (
                <a key={s.url} className="link" href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
