import type { Metadata } from 'next'
import { Cormorant_Garamond, Instrument_Sans } from 'next/font/google'

import { NoticeBanner } from '@/components/notice-banner'
import { ReserveBar } from '@/components/reserve-bar'
import { RestaurantJsonLd } from '@/components/restaurant-json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SITE_URL } from '@/lib/site'
import { getMenuList, getSettings } from '@/sanity/queries'

import './globals.css'

/** Echoes the wordmark: a thin, high-elegance serif. Only the weights the
 *  design actually uses, so we ship two files rather than a variable range. */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

/** The one webfont the restaurant already loads — the UI voice carries over. */
const body = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings?.name ?? 'Mission + Market'
  const area = settings?.neighborhood ? ` | ${settings.neighborhood}` : ''

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} — ${settings?.tagline ?? 'Modern American'}${area}`,
      template: `%s | ${name}`,
    },
    description: settings?.shortDescription,
    openGraph: {
      type: 'website',
      siteName: name,
      title: name,
      description: settings?.shortDescription,
      url: SITE_URL,
      // Resolved from app/opengraph-image.tsx. Without this every shared link
      // rendered as a blank card.
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: settings?.shortDescription,
      images: ['/opengraph-image'],
    },
    alternates: { canonical: '/' },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, menus] = await Promise.all([getSettings(), getMenuList()])
  const menuUrl = menus[0] ? `${SITE_URL}/menus/${menus[0].slug}` : undefined

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only rounded-xs bg-ink px-4 py-2 text-cream focus:not-sr-only
                     focus:absolute focus:top-3 focus:left-3 focus:z-100"
        >
          Skip to content
        </a>

        <NoticeBanner notice={settings?.holidayNotice} />
        <SiteHeader settings={settings} />

        {/* tabIndex -1 so the skip link actually moves focus. Chrome and
            Firefox will focus a non-focusable fragment target; Safari will
            not, so a VoiceOver user activated the skip link, the page
            scrolled, and focus stayed on the skip link. */}
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>

        <SiteFooter settings={settings} />
        <ReserveBar settings={settings} />
        <RestaurantJsonLd settings={settings} menuUrl={menuUrl} />
      </body>
    </html>
  )
}
