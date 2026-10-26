import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { stegaClean } from 'next-sanity'

import { SITE_URL } from '@/lib/site'
import { urlForImage } from '@/sanity/image'
import { getSettings } from '@/sanity/queries'

import './globals.css'

// Both faces are served from the site itself (Google Fonts' latin files, OFL
// licensed — see ./fonts), so a build never depends on reaching Google.

/** Display: the restaurant's own display face, set light. */
const serif = localFont({
  src: [
    { path: './fonts/noto-serif-display-latin.woff2', weight: '300 400', style: 'normal' },
    { path: './fonts/noto-serif-display-italic-latin.woff2', weight: '300 400', style: 'italic' },
  ],
  variable: '--font-noto-serif-display',
  display: 'swap',
})

/** Labels, navigation and text: geometric, like the logo's wordmark. */
const sans = localFont({
  src: './fonts/jost-latin.woff2',
  weight: '300 500',
  variable: '--font-jost',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#f7f5f0',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings?.name ?? 'Mission + Market'
  const og = settings?.ogImage
    ? urlForImage(settings.ogImage).width(1200).height(630).fit('crop').url()
    : undefined

  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} — Modern American dining in Buckhead, Atlanta`,
      template: `%s · ${name}`,
    },
    description: settings?.shortDescription,
    openGraph: {
      type: 'website',
      siteName: name,
      title: name,
      description: settings?.shortDescription,
      url: SITE_URL,
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: settings?.shortDescription,
      images: og ? [og] : undefined,
    },
    alternates: { canonical: '/' },
  })
}

/** Document shell only. The site chrome lives in (site)/layout.tsx so the
 *  Studio at /studio renders full-screen without the header and footer. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
