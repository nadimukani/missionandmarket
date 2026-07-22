import { SITE_URL } from '@/lib/site'
import { urlForImage } from '@/sanity/image'
import type { SiteSettings } from '@/sanity/types'

const DAY_URIS: Record<string, string> = {
  Monday: 'https://schema.org/Monday',
  Tuesday: 'https://schema.org/Tuesday',
  Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday',
  Friday: 'https://schema.org/Friday',
  Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
}

/**
 * Restaurant schema.org markup. This is what earns the hours panel, the
 * "Reserve a table" action and the map card in Google — the single highest-
 * leverage SEO win over the previous WordPress site, which shipped none of it.
 */
export function RestaurantJsonLd({
  settings,
}: {
  settings: SiteSettings | null
}) {
  if (!settings) return null

  const openingHours = settings.machineHours
    ?.filter((h) => h.opens && h.closes && DAY_URIS[h.day])
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_URIS[h.day],
      opens: h.opens,
      closes: h.closes,
    }))

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/#restaurant`,
    name: settings.name,
    description: settings.shortDescription,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    servesCuisine: ['Modern American', 'Pacific Rim', 'Seafood'],
    priceRange: '$$$',
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
    menu: `${SITE_URL}/menus`,
    openingHoursSpecification: openingHours?.length ? openingHours : undefined,
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

  return (
    <script
      type="application/ld+json"
      // Server-rendered from trusted CMS content only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
