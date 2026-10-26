'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Lockup, Monogram } from '@/components/logo'
import { ReserveButton } from '@/components/reserve'
import { telHref } from '@/lib/site'

const LEFT = [
  { href: '/menus', label: 'Menus' },
  { href: '/private-events', label: 'Private Dining' },
  { href: '/happenings', label: 'Happenings' },
]
const RIGHT = [
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
]
const ALL = [{ href: '/', label: 'Home' }, ...LEFT, ...RIGHT, { href: '/gallery', label: 'Gallery' }]

type Props = {
  banner?: ReactNode
  phone?: string
  addressLines?: string[]
  mapsUrl?: string
  instagramUrl?: string
}

export function SiteHeader({ banner, phone, addressLines = [], mapsUrl, instagramUrl }: Props) {
  const pathname = usePathname()
  const overlay = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on navigation — adjusted during render, not in an effect.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  // Lock the page behind the menu, and always release it — including when the
  // window widens past the breakpoint with the menu open.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 64rem)')
    const close = () => mq.matches && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    mq.addEventListener('change', close)
    window.addEventListener('keydown', onKey)
    sheetRef.current?.querySelector<HTMLElement>('nav a')?.focus()
    return () => {
      document.documentElement.style.overflow = ''
      mq.removeEventListener('change', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const clear = overlay && !scrolled
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const navItem = (l: { href: string; label: string }) => (
    <Link
      key={l.href}
      href={l.href}
      aria-current={active(l.href) ? 'page' : undefined}
      className="nav-link link-hover py-1"
    >
      {l.label}
    </Link>
  )

  return (
    <>
      <header
        className={`${overlay ? 'fixed' : 'sticky'} inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-500 ${
          clear
            ? 'border-b border-transparent bg-transparent text-cream'
            : 'border-b border-ink/10 bg-paper/95 text-ink backdrop-blur-md supports-[backdrop-filter]:bg-paper/85'
        }`}
      >
        {banner}
        <div className="page grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: desktop nav · mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="-ml-2 grid size-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
                <span className="h-px w-6 bg-current" />
                <span className="h-px w-4 bg-current" />
              </span>
            </button>
            <nav aria-label="Main" className="hidden items-center gap-10 lg:flex">
              {LEFT.map(navItem)}
            </nav>
          </div>

          {/* Centre: logo */}
          <Link href="/" aria-label="Mission + Market — home" className="px-6">
            <Monogram className="h-[1.05rem] lg:h-[1.2rem]" />
          </Link>

          {/* Right: desktop nav + reserve · mobile reserve */}
          <div className="flex items-center justify-end gap-10">
            <nav aria-label="More" className="hidden items-center gap-10 lg:flex">
              {RIGHT.map(navItem)}
            </nav>
            <ReserveButton
              className={`btn btn-outline hidden min-h-10 px-6 py-2.5 lg:inline-flex ${clear ? '' : 'text-ink'}`}
            >
              Reserve
            </ReserveButton>
            <ReserveButton className="nav-link -mr-1 py-3 lg:hidden">Reserve</ReserveButton>
          </div>
        </div>
      </header>

      {/* Full-screen menu (phones + tablets) */}
      <div
        id="site-menu"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-[60] overflow-y-auto bg-moss text-cream lg:hidden"
      >
        <div className="page flex min-h-full flex-col">
          <div className="grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center">
            <button
              type="button"
              className="-ml-2 grid size-11 place-items-center"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
            <Link href="/" aria-label="Mission + Market — home">
              <Monogram className="h-[1.05rem]" />
            </Link>
            <span />
          </div>

          <nav aria-label="Site" className="flex flex-1 flex-col items-center justify-center gap-7 py-12 text-center">
            {ALL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active(l.href) && l.href !== '/' ? 'page' : undefined}
                className="font-display text-[2.125rem] leading-none font-light"
              >
                {l.label}
              </Link>
            ))}
            <ReserveButton className="btn btn-light mt-6">Reserve a Table</ReserveButton>
          </nav>

          <div className="grid gap-2 border-t border-cream/15 py-8 text-center text-sm font-light text-cream/80">
            {addressLines.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="mt-2 flex justify-center gap-6">
              {mapsUrl ? (
                <a className="link" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Directions
                </a>
              ) : null}
              {phone ? (
                <a className="link tabular" href={telHref(phone)}>
                  {phone}
                </a>
              ) : null}
              {instagramUrl ? (
                <a className="link" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              ) : null}
            </p>
            <Lockup className="mx-auto mt-6 w-24 text-cream/40" />
          </div>
        </div>
      </div>
    </>
  )
}
