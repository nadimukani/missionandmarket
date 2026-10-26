import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'
import { getMenuList } from '@/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const menus = await getMenuList()

  const routes: [string, number][] = [
    ['', 1],
    ['/menus', 0.9],
    ['/private-events', 0.9],
    ['/holiday-parties', 0.8],
    ['/reservations', 0.8],
    ['/happenings', 0.8],
    ['/visit', 0.8],
    ['/about', 0.6],
    ['/gallery', 0.5],
    ['/careers', 0.4],
  ]

  return [
    ...routes.map(([path, priority]) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    // Hidden menus are already excluded by the query.
    ...menus.map((menu) => ({
      url: `${SITE_URL}/menus/${menu.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]
}
