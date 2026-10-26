import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '@/sanity/client'

/**
 * The Studio's Presentation tool calls this with a one-time secret it
 * generated for a signed-in editor; the secret is verified against Sanity
 * before draft mode is switched on. Nobody else can enable previews.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
})
