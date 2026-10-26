import { SITE_URL } from '@/lib/site'

/** BreadcrumbList for interior pages — helps Google show the page's place
 *  in the site ("Mission + Market › Menus › Dinner") in results. */
export function BreadcrumbsJsonLd({ trail }: { trail: { name: string; path: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
