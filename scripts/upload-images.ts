/**
 * Uploads the restaurant's own photography (migrated from their WordPress
 * media library) into Sanity, and wires the best frames into the homepage and
 * gallery.
 *
 *   pnpm images
 *
 * Idempotent: assets are uploaded once and matched on filename thereafter, and
 * gallery documents use fixed _ids.
 *
 * Alt text below was written by looking at each photograph. It describes what
 * is actually in frame — a screen-reader user gets the same information a
 * sighted guest does.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createClient } from '@sanity/client'

const PHOTO_DIR =
  process.env.PHOTO_DIR ??
  '/private/tmp/claude-501/-Users-nadim-Projects-Clients-Orion-Mission---Market/9072b0cd-36d2-460f-828b-e1513f284232/scratchpad/brand/photos'

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

type Photo = { file: string; alt: string; category: string }

/** Hero — the two frames large enough to run full-bleed. */
const HERO: Photo[] = [
  {
    file: 'Mission__Market_-_Part_2_-_2024.02-2.png',
    alt: 'Sunlit dining room with sheer linen curtains, walnut tables, navy leather armchairs and a lit glass wine cabinet',
    category: 'Space',
  },
  {
    file: 'MissionMarket_AAA0088-1-1.png',
    alt: 'Brass globe sconce mounted on a chartreuse moss-covered column, with the lit back bar and bottle display behind',
    category: 'Space',
  },
]

const STORY: Photo = {
  file: 'MissionMarket_AAA0088-1-1.png',
  alt: 'Brass globe sconce on a moss-covered column beside the bar and its backlit bottle display',
  category: 'Space',
}

/** Three signature plates, each the widest available crop of its frame. */
const DISHES: (Photo & { name: string; description: string })[] = [
  {
    file: 'Frame-497.png',
    name: 'Beef Wellington',
    description: 'Carved to order, jus poured at the table',
    alt: 'Hand pouring jus from a steel pitcher over a halved beef Wellington beside roasted rainbow potatoes',
    category: 'Food',
  },
  {
    file: 'Frame-491-3.png',
    name: 'Seared Pork Chop',
    description: 'Farro, wild mushrooms, kale',
    alt: 'Seared pork chop with crosshatch grill marks over farro, mushrooms and kale in a pale cream sauce',
    category: 'Food',
  },
  {
    file: 'Mission-Market-Part-2-2024.02-6.png',
    name: 'Herb Roasted Chicken',
    description: 'Saffron risotto, pan jus',
    alt: 'Half chicken with a charred herb crust over saffron risotto in pan sauce, topped with pea shoots',
    category: 'Food',
  },
]

/**
 * Gallery. Deliberately excludes frames flagged during review:
 * near-duplicate crops, an illuminated EXIT sign, a projector showing a
 * software window, identifiable guests and staff (which would need releases),
 * and a dated event flyer that is not a photograph at all.
 */
const GALLERY: Photo[] = [
  ...HERO,
  {
    file: 'Mission__Market_-_Part_2_-_2024.02-3-3.png',
    alt: 'Private dining table for sixteen beside a slate textured wall, facing floor-to-ceiling illuminated wine cabinets',
    category: 'Private Dining',
  },
  {
    file: 'Mission-Market-Part-2-2024.02-4.png',
    alt: 'Long banquet table set with wine glasses, red roses in bud vases and brass table lamps against bright curtains',
    category: 'Private Dining',
  },
  {
    file: 'Patio_16.png',
    alt: 'Covered patio lounge with teak sofas, white cushions and a linear gas fire pit under a Japanese maple',
    category: 'Patio',
  },
  {
    file: 'Mission__Market_-_Part_1-_2024.02-1-1.png',
    alt: 'Dining room with chartreuse moss-clad columns, a black steel ceiling grid, brass pendants and set walnut tables',
    category: 'Space',
  },
  ...DISHES.map(({ file, alt, category }) => ({ file, alt, category })),
  {
    file: 'Frame-498.png',
    alt: 'Glass of white wine held over a wood bar top, backlit shelves of bottles filling the background',
    category: 'Drinks',
  },
]

const assetCache = new Map<string, string>()

async function uploadAsset(file: string): Promise<string> {
  const cached = assetCache.get(file)
  if (cached) return cached

  // Reuse an identical upload if this filename is already in the dataset.
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $file][0]{_id}`,
    { file },
  )
  if (existing?._id) {
    assetCache.set(file, existing._id)
    return existing._id
  }

  const asset = await client.assets.upload(
    'image',
    readFileSync(join(PHOTO_DIR, file)),
    { filename: file },
  )
  assetCache.set(file, asset._id)
  console.log(`  uploaded ${file}`)
  return asset._id
}

const imageRef = (assetId: string, alt: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
  alt,
})

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)

async function run() {
  console.log(`Uploading photography to ${projectId}/${dataset}\n`)

  const heroImages = await Promise.all(
    HERO.map(async (p, i) => ({
      ...imageRef(await uploadAsset(p.file), p.alt),
      _key: `hero-${i}`,
    })),
  )

  const storyAsset = await uploadAsset(STORY.file)

  const featuredDishes = await Promise.all(
    DISHES.map(async (d, i) => ({
      _key: `dish-${i}`,
      name: d.name,
      description: d.description,
      image: imageRef(await uploadAsset(d.file), d.alt),
    })),
  )

  await client
    .patch('homePage')
    .set({
      heroImages,
      storyImage: imageRef(storyAsset, STORY.alt),
      featuredDishes,
    })
    .commit()
  console.log('\n  homePage: hero, story image and 3 featured dishes set')

  let tx = client.transaction()
  for (const [i, photo] of GALLERY.entries()) {
    const assetId = await uploadAsset(photo.file)
    tx = tx.createOrReplace({
      _id: `gallery-${slug(photo.file)}`,
      _type: 'galleryImage',
      image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
      alt: photo.alt,
      category: photo.category,
      order: i,
    })
  }
  await tx.commit()
  console.log(`  gallery: ${GALLERY.length} images`)

  console.log('\nStill to source from the client:')
  console.log('  · High-resolution originals — only 2 of 34 files exceed 700px')
  console.log('    wide, so most cannot run full-bleed. Ask the photographer.')
  console.log('  · Dessert + drinks menus (image-only on the old site)')
  console.log('  · A signed release for the chef portrait before publishing it')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
