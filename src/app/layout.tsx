import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'

import { NoticeBanner } from '@/components/notice-banner'
import { RestaurantJsonLd } from '@/components/restaurant-json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SITE_URL } from '@/lib/site'
import { getSettings } from '@/sanity/queries'

import './globals.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans-body',
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
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: '/' },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col bg-bone text-ink">
        <a
          href="#main"
          className="sr-only rounded-sm bg-ink px-4 py-2 text-bone focus:not-sr-only
                     focus:absolute focus:top-3 focus:left-3 focus:z-100"
        >
          Skip to content
        </a>

        <NoticeBanner notice={settings?.holidayNotice} />
        <SiteHeader settings={settings} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <SiteFooter settings={settings} />
        <RestaurantJsonLd settings={settings} />
      </body>
    </html>
  )
}
