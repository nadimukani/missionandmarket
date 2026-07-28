import type { MetadataRoute } from 'next'

import { CMS_ROUTED_SLUGS, SITE_URL } from '@/lib/site'
import { getMenuList, getPageSlugs } from '@/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [menus, pageSlugs] = await Promise.all([getMenuList(), getPageSlugs()])

  const staticRoutes = [
    '',
    // '/menus' is intentionally absent — it 307s to the first menu, and a
    // redirect in a sitemap is a crawl error.
    '/reservations',
    '/specials',
    '/gallery',
    '/contact',
    '/careers',
    '/press',
  ]

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...menus.map((menu) => ({
      url: `${SITE_URL}/menus/${menu.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    // Only the CMS pages that have a route. A slug the client invents in the
    // Studio has no page to serve, so listing it would submit a 404.
    ...pageSlugs
      .filter((slug) =>
        (CMS_ROUTED_SLUGS as readonly string[]).includes(slug),
      )
      .map((slug) => ({
        url: `${SITE_URL}/${slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
  ]
}
