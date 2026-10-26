/** Canonical origin. Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every
 *  deployment, so preview builds generate correct absolute URLs too. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://missionandmarketatl.com')


/**
 * CMS `page` documents that have a hand-written route. There is no
 * `app/[slug]/page.tsx` catch-all, but the Studio offers the client a "Pages"
 * list and invites them to create more — so the sitemap has to advertise only
 * the slugs that actually resolve, or the first page they publish gets
 * submitted to Google as a 404.
 */
export const CMS_ROUTED_SLUGS = ['about', 'private-events'] as const

export const INSTAGRAM_HANDLE = '@missionandmkt'

export function telHref(phone?: string) {
  return phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined
}

export function formatAddress(address?: {
  street?: string
  street2?: string
  city?: string
  state?: string
  zip?: string
}) {
  if (!address) return ''
  const line1 = [address.street, address.street2].filter(Boolean).join(', ')
  const line2 = [address.city, address.state].filter(Boolean).join(', ')
  return [line1, [line2, address.zip].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(' · ')
}
