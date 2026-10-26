import { draftMode } from 'next/headers'
import { createClient, type QueryParams } from 'next-sanity'

import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // Click-to-edit: in the Studio's Presentation view, every string carries an
  // invisible pointer back to the field it came from. Off everywhere else.
  stega: { studioUrl: '/studio' },
})

/** Server-only. Reads drafts for the Studio preview; never sent to a browser. */
const previewToken = process.env.SANITY_API_READ_TOKEN

type FetchOptions = {
  query: string
  params?: QueryParams
  /** Cache tags, so the publish webhook can bust exactly what changed. */
  tags?: string[]
  /** Seconds. A short floor so a publish shows up within a minute even if
   *  the webhook was never configured — the owner should never wonder
   *  whether their menu change "took". */
  revalidate?: number
}

/**
 * Every query on the site goes through here.
 *
 * - Published (everyone): cached, tagged, refreshed at least every minute.
 * - Draft mode (the owner inside the Studio's Presentation tool): unsaved
 *   drafts, uncached, with stega markers so clicking text on the page opens
 *   the field that holds it.
 */
export async function sanityFetch<T>({ query, params = {}, tags, revalidate = 60 }: FetchOptions): Promise<T> {
  const isDraft = (await draftMode()).isEnabled
  if (isDraft && previewToken) {
    return client.fetch<T>(query, params, {
      perspective: 'drafts',
      useCdn: false,
      stega: true,
      token: previewToken,
      next: { revalidate: 0 },
    })
  }
  return client.fetch<T>(query, params, {
    stega: false,
    next: { revalidate, tags },
  })
}
