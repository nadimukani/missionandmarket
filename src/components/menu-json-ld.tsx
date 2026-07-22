import { SITE_URL } from '@/lib/site'
import type { Menu } from '@/sanity/types'

/**
 * schema.org Menu markup.
 *
 * `Menu` / `hasMenuSection` / `hasMenuItem` are core (non-pending) schema.org
 * vocabulary, and nesting them is only possible because the menu is real HTML
 * — a PDF menu cannot carry this in any form a crawler will parse.
 *
 * Worth being precise about the payoff: Google documents only a `menu` URL on
 * LocalBusiness and publishes no menu rich result, so this is not a route to a
 * guaranteed search feature. The value is that the dishes, sections and prices
 * become machine-readable to search engines and assistants at all.
 */

/** Pulls a single numeric price out of the free-text price field.
 *  Deliberately conservative: "$19" yields 19, while "6 pc. $24 · 12 pc. $42"
 *  and "MP" yield nothing rather than a misleading half-truth. */
function parsePrice(price?: string): string | undefined {
  if (!price) return undefined
  const matches = price.match(/\$\s?(\d+(?:\.\d{2})?)/g)
  if (!matches || matches.length !== 1) return undefined
  return matches[0].replace(/[^\d.]/g, '')
}

export function MenuJsonLd({ menu }: { menu: Menu }) {
  const sections = (menu.sections ?? [])
    .filter((s) => s.items?.length)
    .map((section) => ({
      '@type': 'MenuSection',
      name: section.title,
      description: section.note || undefined,
      hasMenuItem: section.items!.map((item) => {
        const amount = parsePrice(item.price)
        return {
          '@type': 'MenuItem',
          name: item.name,
          description: item.description || undefined,
          suitableForDiet: dietUris(item.tags),
          offers: amount
            ? {
                '@type': 'Offer',
                price: amount,
                priceCurrency: 'USD',
                availability: item.soldOut
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/InStock',
              }
            : undefined,
        }
      }),
    }))

  if (!sections.length) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SITE_URL}/menus/${menu.slug}#menu`,
    name: `${menu.title} Menu`,
    url: `${SITE_URL}/menus/${menu.slug}`,
    description: menu.intro || undefined,
    inLanguage: 'en-US',
    // Ties the menu back to the Restaurant node declared in the root layout.
    isPartOf: { '@id': `${SITE_URL}/#restaurant` },
    hasMenuSection: sections,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Only the tags with a real schema.org RestrictedDiet counterpart.
 *  "spicy", "raw" and "signature" have none, so they are intentionally
 *  omitted rather than mapped to something approximate. */
function dietUris(tags?: string[]): string[] | undefined {
  if (!tags?.length) return undefined
  const map: Record<string, string> = {
    vegetarian: 'https://schema.org/VegetarianDiet',
    vegan: 'https://schema.org/VeganDiet',
    'gluten-free': 'https://schema.org/GlutenFreeDiet',
  }
  const uris = tags.map((t) => map[t]).filter(Boolean)
  return uris.length ? uris : undefined
}
