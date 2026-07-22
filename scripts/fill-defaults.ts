/**
 * Fills in the settings and page imagery that can be derived from assets and
 * facts the client has already supplied.
 *
 *   pnpm defaults
 *
 * Nothing here is invented. The map link is built from the address they gave
 * us; every image is one of their own photographs already in the dataset.
 * All of it is editable in the Studio afterwards.
 *
 * Deliberately NOT set, because guessing would be worse than leaving blank:
 *   · email / privateEventsEmail — no address exists anywhere
 *   · press items, job openings — no content supplied
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Missing Sanity env vars')

const client = createClient({ projectId, dataset, token, apiVersion: '2026-07-22', useCdn: false })

/** Look an already-uploaded photograph up by its original filename. */
async function assetId(filename: string): Promise<string | null> {
  const a = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $f][0]{_id}`,
    { f: filename },
  )
  return a?._id ?? null
}

const img = (id: string, alt: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: id },
  alt,
})

async function run() {
  const settings = await client.fetch<{ address?: Record<string, string>; name?: string }>(
    `*[_id == "siteSettings"][0]{ address, name }`,
  )

  const patch: Record<string, unknown> = {}

  // Built from the address already in the CMS, not looked up or guessed.
  if (settings?.address) {
    const q = [
      settings.name,
      settings.address.street,
      settings.address.city,
      settings.address.state,
      settings.address.zip,
    ]
      .filter(Boolean)
      .join(', ')
    patch.mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  }

  // Share card: the sunlit dining room — the widest, sharpest room frame.
  const og = await assetId('Mission__Market_-_Part_2_-_2024.02-2.png')
  if (og) {
    patch.ogImage = img(
      og,
      'The sunlit dining room at Mission + Market, with sheer linen curtains and walnut tables',
    )
  }

  if (Object.keys(patch).length) {
    await client.patch('siteSettings').set(patch).commit()
    console.log(`  siteSettings: ${Object.keys(patch).join(', ')}`)
  }

  // About — the moss wall and brass sconce, the room's signature detail.
  const aboutHero = await assetId('MissionMarket_AAA0088-1-1.png')
  if (aboutHero) {
    await client.patch('page-about').set({
      heroImage: img(
        aboutHero,
        'Brass globe sconce on a chartreuse moss-covered column, with the lit back bar behind',
      ),
    }).commit()
    console.log('  page-about: hero image set')
  }

  // Private events — the private dining room set for sixteen.
  const eventsHero = await assetId('Mission__Market_-_Part_2_-_2024.02-3-3.png')
  if (eventsHero) {
    await client.patch('page-private-events').set({
      heroImage: img(
        eventsHero,
        'Private dining table set for sixteen beside floor-to-ceiling illuminated wine cabinets',
      ),
    }).commit()
    console.log('  page-private-events: hero image set')
  }

  console.log('\nStill blank because guessing would be worse:')
  console.log('  · email and privateEventsEmail — no address exists anywhere')
  console.log('  · press items and job openings — no content supplied')
}

run().catch((e) => { console.error(e); process.exit(1) })
