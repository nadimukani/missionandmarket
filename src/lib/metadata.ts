import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'

import { urlForImage } from '@/sanity/image'
import { getSettings } from '@/sanity/queries'

/**
 * A page's link preview (Facebook, iMessage, LinkedIn, X): its own address,
 * the site's name and the share photograph from Restaurant Info.
 *
 * Next replaces a layout's `openGraph` rather than merging it, so this is the
 * whole block — a page that sets only its address would lose the photograph.
 * There's no title or description here on purpose: Next fills both from the
 * page's own (and X's card from those), so every page previews as itself.
 * Before, the layout carried the homepage's address, title and description
 * onto every page, and Facebook opened shared links on the homepage.
 */
export async function linkPreview(path?: string): Promise<NonNullable<Metadata['openGraph']>> {
  const settings = await getSettings()
  const image = settings?.ogImage
    ? urlForImage(settings.ogImage).width(1200).height(630).fit('crop').url()
    : undefined

  // No click-to-edit markers in <head>, even in the Studio preview.
  return stegaClean({
    type: 'website',
    siteName: settings?.name ?? 'Mission + Market',
    locale: 'en_US',
    url: path,
    images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
  })
}
