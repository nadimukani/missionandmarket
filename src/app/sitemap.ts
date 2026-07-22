import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'
import { getMenuList, getPageSlugs } from '@/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [menus, pageSlugs] = await Promise.all([getMenuList(), getPageSlugs()])

  const staticRoutes = [
    '',
    '/menus',
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
    ...pageSlugs.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
