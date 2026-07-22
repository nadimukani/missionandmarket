import { createClient, type QueryParams } from 'next-sanity'

import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

type FetchOptions = {
  query: string
  params?: QueryParams
  /** Cache tags to attach, so `revalidateTag` can bust this query on publish. */
  tags?: string[]
  /** Seconds. Falls back to a 1-hour floor so a missed webhook never sticks. */
  revalidate?: number
}

/**
 * Menus change often and the client edits them directly, so every query is
 * tagged. The Sanity webhook at /api/revalidate busts the matching tags the
 * moment something is published — the time-based floor is only a safety net.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  revalidate = 3600,
}: FetchOptions): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: tags?.length ? revalidate : revalidate, tags },
  })
}
