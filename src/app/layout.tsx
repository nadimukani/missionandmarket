import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { stegaClean } from 'next-sanity'

import { linkPreview } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'
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

  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} — Modern American dining in Buckhead, Atlanta`,
      template: `%s · ${name}`,
    },
    description: settings?.shortDescription,
    // No address here: each page passes its own to linkPreview(). The preview
    // title, description and X's card (photograph included) follow the page.
    openGraph: await linkPreview(),
    twitter: { card: 'summary_large_image' },
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
