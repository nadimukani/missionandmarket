/**
 * Adds Executive Chef Paul to the Team, and removes the outgoing chef's name
 * from the published About and homepage copy.
 *
 *   pnpm chef
 *
 * Idempotent — fixed _id, createOrReplace, asset matched on filename.
 *
 * NOTE: the surname and a real biography are still outstanding from the
 * client. The bio written here states only what is already true of the
 * restaurant's cooking; nothing about his career has been invented.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createClient } from '@sanity/client'

const PHOTO_DIR =
  process.env.PHOTO_DIR ??
  '/private/tmp/claude-501/-Users-nadim-Projects-Clients-Orion-Mission---Market/9072b0cd-36d2-460f-828b-e1513f284232/scratchpad/brand/photos'

const PORTRAIT = 'chef-paul.jpeg'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Missing Sanity env vars')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-07-22',
  useCdn: false,
})

const block = (text: string, key: string) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
})

async function uploadPortrait(): Promise<string> {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $file][0]{_id}`,
    { file: PORTRAIT },
  )
  if (existing?._id) return existing._id

  const asset = await client.assets.upload(
    'image',
    readFileSync(join(PHOTO_DIR, PORTRAIT)),
    { filename: PORTRAIT },
  )
  console.log(`  uploaded ${PORTRAIT}`)
  return asset._id
}

async function run() {
  const assetId = await uploadPortrait()

  await client.createOrReplace({
    _id: 'person-chef-paul',
    _type: 'person',
    name: 'Paul',
    displayName: 'Chef Paul',
    role: 'Executive Chef',
    featured: true,
    order: 0,
    portrait: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt: 'Chef Paul standing with his arms crossed on the patio, in a white chef’s jacket and cream apron with olive straps, framed by green foliage',
      // Focal point on the face. The portrait is tall (1367×2048); without
      // this a 4:5 or wider crop would cut the top of his head.
      hotspot: { _type: 'sanity.imageHotspot', x: 0.47, y: 0.29, width: 0.55, height: 0.4 },
      crop: { _type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0 },
    },
    quote:
      'California, the Pacific Northwest and the Pacific Rim — on a Buckhead corner.',
    bio: [
      block(
        'Chef Paul leads the kitchen at Mission + Market, building the menu around California, Pacific Northwest and Pacific Rim influences with locally sourced ingredients at its centre.',
        'bio-1',
      ),
      block(
        'The kitchen cooks to the season, from the raw bar and shareable plates through to the market steaks — including signatures like the grilled Spanish octopus and the beef Wellington, carved and finished at the table.',
        'bio-2',
      ),
    ],
  })
  console.log('  person-chef-paul created (Executive Chef, featured)')

  // The published copy still named the outgoing chef; replace those blocks.
  const about = await client.fetch<{ body?: { _key: string; children?: { text?: string }[] }[] } | null>(
    `*[_id == "page-about"][0]{ body }`,
  )
  const stale = (about?.body ?? []).filter((b) =>
    b.children?.some((c) => c.text?.includes('Winslade')),
  )
  if (stale.length) {
    console.log(`  rewriting ${stale.length} About block(s) naming the outgoing chef`)
  }

  await client
    .patch('page-about')
    .set({
      body: [
        block(
          'Mission + Market sits on the lower level of Three Alliance Center in the heart of Buckhead, serving modern American cuisine with California and Pacific influences for lunch, brunch and dinner.',
          'about-1',
        ),
        block(
          'Executive Chef Paul leads the kitchen, drawing on California, the Pacific Northwest and the Pacific Rim, with locally sourced ingredients at the centre of the menu. Signature dishes include grilled Spanish octopus and chilled red king crab.',
          'about-2',
        ),
        block(
          'The restaurant is a collaboration with Jonathan and Tony Akly, partners in other Atlanta establishments. The 5,300 square foot space includes a dynamic bar and lounge, a covered and heated patio with fire pits, and private dining areas.',
          'about-3',
        ),
      ],
    })
    .commit()
  console.log('  page-about copy updated')

  await client
    .patch('homePage')
    .set({
      storyBody: [
        block(
          'Mission + Market brings modern American cuisine with California and Pacific influences to the lower level of Three Alliance Center. The kitchen builds its menu around locally sourced ingredients and the seasons, alongside a dynamic bar and lounge, seasonal cocktails and a curated wine list.',
          'story-1',
        ),
        block(
          'The 5,300 square foot room opens onto a covered, heated patio with fire pits, and holds private dining spaces for everything from a working lunch to a full buyout.',
          'story-2',
        ),
      ],
    })
    .commit()
  console.log('  homePage story copy updated')

  console.log('\nStill needed from the client:')
  console.log('  · Chef Paul’s surname — currently published as "Chef Paul" only')
  console.log('  · A real biography (career, training, previous kitchens)')
  console.log('  · Confirmation the pull quote is acceptable, or a real one')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
