'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Monogram } from '@/components/logo'
import { ReserveButton } from '@/components/reserve'
import { Plus } from '@/components/ui'
import { NAV_LINKS, telHref } from '@/lib/site'

type Props = {
  phone?: string
  addressLine?: string
  mapsUrl?: string
  orderUrl?: string
  giftCardUrl?: string
  instagramUrl?: string
}

export function SiteHeader({
  phone,
  addressLine,
  mapsUrl,
  orderUrl,
  giftCardUrl,
  instagramUrl,
}: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on navigation — adjusted during render (React's pattern for
  // resetting state when a value changes), not in an effect.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  // Lock the page behind the sheet — and always release it, including when the
  // window is widened past the breakpoint with the sheet open (the old build
  // left the page frozen at exactly that crossover).
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 64rem)')
    const close = () => mq.matches && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    mq.addEventListener('change', close)
    window.addEventListener('keydown', onKey)
    sheetRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => {
      document.documentElement.style.overflow = ''
      mq.removeEventListener('change', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/95 backdrop-blur-md transition-[border-color] duration-300 supports-[backdrop-filter]:bg-paper/85 ${
        scrolled || open ? 'border-b border-ink/10' : 'border-b border-transparent'
      }`}
    >
      <div className="page flex h-(--header-h) items-center justify-between gap-6">
        <Link href="/" className="relative z-10 -my-2 py-2 text-ink" aria-label="Mission + Market — home">
          <Monogram className="h-[1.15rem] lg:h-[1.3rem]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={`eyebrow py-2 transition-colors hover:text-moss ${
                    isActive(l.href)
                      ? 'text-moss underline decoration-1 underline-offset-[0.6em]'
                      : 'text-ink'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          {phone ? (
            <a
              href={telHref(phone)}
              className="eyebrow hidden tabular text-stone transition-colors hover:text-ink xl:inline"
            >
              {phone}
            </a>
          ) : null}
          <ReserveButton className="btn btn-moss min-h-10 px-4 py-2.5 sm:px-6">
            Reserve
          </ReserveButton>
          <button
            type="button"
            className="relative z-10 -mr-2 grid size-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 block h-px w-6 bg-ink transition-transform duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-ink transition-transform duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        hidden={!open}
        className="fixed inset-x-0 top-(--header-h) bottom-0 overflow-y-auto bg-paper lg:hidden"
      >
        <div className="page flex min-h-full flex-col pt-6 pb-10">
          <nav aria-label="Mobile">
            <ul className="border-t border-ink/10">
              {[{ href: '/', label: 'Home' }, ...NAV_LINKS, { href: '/gallery', label: 'Gallery' }].map(
                (l) => (
                  <li key={l.href} className="border-b border-ink/10">
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) && l.href !== '/' ? 'page' : undefined}
                      className="flex items-center justify-between py-4 font-display text-[2rem] leading-none"
                    >
                      {l.label}
                      <Plus className="size-3 text-bronze" />
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="mt-10 grid gap-6 text-[0.9375rem]">
            {addressLine ? (
              <div>
                <p className="eyebrow text-bronze">Find us</p>
                <p className="mt-2">{addressLine}</p>
                {mapsUrl ? (
                  <a className="link mt-1 inline-block" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    Directions
                  </a>
                ) : null}
              </div>
            ) : null}
            {phone ? (
              <div>
                <p className="eyebrow text-bronze">Call</p>
                <a className="link mt-2 inline-block tabular" href={telHref(phone)}>
                  {phone}
                </a>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {orderUrl ? (
                <a className="link" href={orderUrl} target="_blank" rel="noopener noreferrer">
                  Order online
                </a>
              ) : null}
              {giftCardUrl ? (
                <a className="link" href={giftCardUrl} target="_blank" rel="noopener noreferrer">
                  Gift cards
                </a>
              ) : null}
              {instagramUrl ? (
                <a className="link" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
