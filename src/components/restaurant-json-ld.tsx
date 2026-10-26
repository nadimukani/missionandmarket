import { stegaClean } from 'next-sanity'

import { openingHoursSpecification, specialOpeningHours, type Schedule } from '@/lib/schedule'
import { SITE_URL } from '@/lib/site'
import { urlForImage } from '@/sanity/image'
import type { SiteSettings } from '@/sanity/types'

/**
 * Restaurant schema.org markup. This is what earns the hours panel, the
 * "Reserve a table" action and the map card in Google — the single highest-
 * leverage SEO win over the previous WordPress site, which shipped none of it.
 */
export function RestaurantJsonLd({
  settings,
  schedule,
  menus = [],
}: {
  settings: SiteSettings | null
  schedule: Schedule | null
  /** The published menus, in the owner's order. */
  menus?: { slug: string; title: string }[]
}) {
  if (!settings) return null

  // Both from "Hours & Closures": weekly hours, plus holiday closures as
  // Google's special opening hours.
  const openingHours = openingHoursSpecification(schedule)
  const specialHours = specialOpeningHours(schedule)

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/#restaurant`,
    name: settings.name,
    description: settings.shortDescription,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    // As the restaurant describes itself. No priceRange: nothing published
    // by the restaurant states one, and Google shows it verbatim.
    servesCuisine: ['Modern American'],
    image: settings.ogImage
      ? urlForImage(settings.ogImage).width(1200).height(630).url()
      : undefined,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: [settings.address.street, settings.address.street2]
            .filter(Boolean)
            .join(', '),
          addressLocality: settings.address.city,
          addressRegion: settings.address.state,
          postalCode: settings.address.zip,
          addressCountry: 'US',
        }
      : undefined,
    hasMap: settings.mapsUrl,
    // The chooser lists every menu; each menu is also declared on its own
    // page (MenuJsonLd), joined here by @id.
    menu: menus.length ? `${SITE_URL}/menus` : undefined,
    hasMenu: menus.map((m) => ({
      '@type': 'Menu',
      '@id': `${SITE_URL}/menus/${m.slug}#menu`,
      name: `${m.title} Menu`,
      url: `${SITE_URL}/menus/${m.slug}`,
    })),
    openingHoursSpecification: openingHours.length ? openingHours : undefined,
    specialOpeningHoursSpecification: specialHours.length ? specialHours : undefined,
    sameAs: settings.social?.map((s) => s.url).filter(Boolean),
    acceptsReservations: settings.openTableUrl ?? true,
    potentialAction: settings.openTableUrl
      ? {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: settings.openTableUrl,
            inLanguage: 'en-US',
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/IOSPlatform',
              'https://schema.org/AndroidPlatform',
            ],
          },
          result: { '@type': 'FoodEstablishmentReservation', name: 'Reservation' },
        }
      : undefined,
  }

  // Drop null/undefined keys — emitting "email": null is worse than
  // omitting the property, and consumers treat it as a declared empty value.
  const compact = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(compact).filter((x) => x !== undefined && x !== null)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.entries(v as Record<string, unknown>)
              .map(([k, val]) => [k, compact(val)])
              .filter(([, val]) => val !== undefined && val !== null),
          )
        : v

  return (
    <script
      type="application/ld+json"
      // Server-rendered from trusted CMS content only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(compact(stegaClean(data))) }}
    />
  )
}
