/**
 * Adds the 2026 food photography shoot.
 *
 *   pnpm food
 *
 * Idempotent — assets matched on filename, gallery docs use fixed _ids.
 *
 * NAMING POLICY (important):
 * These plates do NOT match the dish descriptions migrated from the old
 * WordPress menus — the salmon is on pearl couscous where the menu says rice
 * grits, the chicken sits on a white purée where the menu says tomato
 * risotto, the burrata comes with strawberry and rhubarb rather than cherry
 * tomatoes, and the tuna is seared and sliced where the only tuna on the menu
 * is a tartare. The photography is evidently newer than the published menu
 * text.
 *
 * So the featured dishes below are named and described from what is visibly
 * on the plate, not from the menu. Nothing has been invented, and nothing
 * asserts a menu line that contradicts the photograph. The client should
 * replace these with exact current menu names — and, more importantly, the
 * menus themselves probably need re-confirming.
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

type Shot = { file: string; alt: string; category: string }

/** Every frame from the shoot, with alt text describing what is actually
 *  in the picture rather than what we wish were in it. */
const SHOTS: Shot[] = [
  {
    file: 'Mission_11.JPG',
    alt: 'Four plates on a walnut table against a blue velvet banquette — roast chicken, rigatoni bolognese, seared tuna and bread pudding, with a pink cocktail',
    category: 'Food',
  },
  {
    file: 'Mission_1.JPG',
    alt: 'Seared white fish with heirloom tomatoes and edible flowers on a patio table, beside a cocktail and a posy of daisies',
    category: 'Food',
  },
  {
    file: 'Mission.JPG',
    alt: 'Burrata with strawberry, rhubarb and grilled brioche on a white plate, a cocktail behind on a sunlit patio table',
    category: 'Food',
  },
  {
    file: 'Mission_3.JPG',
    alt: 'Crisp-skinned salmon over pearl couscous with roasted peppers, capers and pea shoots',
    category: 'Food',
  },
  {
    file: 'Mission_2.JPG',
    alt: 'Crisp-skinned salmon on pearl couscous, photographed on the patio beside a cocktail and flowers',
    category: 'Food',
  },
  {
    file: 'Mission_7.JPG',
    alt: 'Roast chicken with crisp golden skin over a white purée, with frisée and green beans',
    category: 'Food',
  },
  {
    file: 'Mission_6.JPG',
    alt: 'Roast chicken on a white plate with frisée and green beans, on a walnut table',
    category: 'Food',
  },
  {
    file: 'Mission_5.JPG',
    alt: 'Seared tuna sliced over pickled carrot and daikon with avocado mousse, roast chicken on a second plate behind',
    category: 'Food',
  },
  {
    file: 'Mission_12.JPG',
    alt: 'Stack of golden fried fillets with a lemon wedge and a pot of herbed aioli, on the patio',
    category: 'Food',
  },
  {
    file: 'Mission_10.JPG',
    alt: 'Bread pudding in a cast-iron dish topped with a scoop of ice cream and dusted with icing sugar',
    category: 'Food',
  },
  {
    file: 'Mission_4.JPG',
    alt: 'Fork and knife cutting into seared white fish over a saffron-coloured purée, with tomatoes and edible flowers',
    category: 'Food',
  },
  {
    file: 'Mission_8.JPG',
    alt: 'Seared tuna and roast chicken plated on a walnut table with a lavender-garnished pink cocktail',
    category: 'Drinks',
  },
  {
    file: 'Mission_9.JPG',
    alt: 'Table set with seared tuna, roast chicken and a pink cocktail in front of a blue velvet banquette',
    category: 'Space',
  },
]

/** Three plates for the homepage. Named from the photograph, not the menu —
 *  see the note at the top of this file. */
const FEATURED = [
  {
    file: 'Mission.JPG',
    name: 'Burrata',
    description: 'Strawberry, rhubarb, grilled brioche',
    alt: 'Burrata with strawberry, rhubarb and grilled brioche on a white plate',
  },
  {
    file: 'Mission_3.JPG',
    name: 'Crisp-Skinned Salmon',
    description: 'Pearl couscous, roasted peppers, capers',
    alt: 'Crisp-skinned salmon over pearl couscous with roasted peppers and capers',
  },
  {
    file: 'Mission_7.JPG',
    name: 'Roast Chicken',
    description: 'Frisée, green beans, pan jus',
    alt: 'Roast chicken with crisp golden skin over a white purée, with frisée and green beans',
  },
]

/** The one landscape frame in the set — the widest asset in the project. */
const BAND = {
  file: 'Mission_11.JPG',
  alt: 'A full table — roast chicken, rigatoni bolognese, seared tuna and bread pudding with a pink cocktail, against a blue velvet banquette',
}

const cache = new Map<string, string>()

async function upload(file: string): Promise<string> {
  const hit = cache.get(file)
  if (hit) return hit

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $f][0]{_id}`,
    { f: file },
  )
  if (existing?._id) {
    cache.set(file, existing._id)
    return existing._id
  }

  const asset = await client.assets.upload(
    'image',
    readFileSync(join(PHOTO_DIR, file)),
    { filename: file },
  )
  cache.set(file, asset._id)
  console.log(`  uploaded ${file}`)
  return asset._id
}

const img = (id: string, alt: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: id },
  alt,
})

const slug = (s: string) =>
  s.toLowerCase().replace(/\.jpe?g$/i, '').replace(/[^a-z0-9]+/g, '-')

async function run() {
  console.log(`Adding 2026 food photography to ${projectId}/${dataset}\n`)

  const featuredDishes = await Promise.all(
    FEATURED.map(async (d, i) => ({
      _key: `dish-${i}`,
      name: d.name,
      description: d.description,
      image: img(await upload(d.file), d.alt),
    })),
  )

  const bandId = await upload(BAND.file)

  await client
    .patch('homePage')
    .set({
      featuredDishes,
      bandImage: img(bandId, BAND.alt),
      bandCaption: 'Lunch, brunch and dinner — seven days a week.',
    })
    .commit()
  console.log('\n  homePage: 3 featured dishes replaced, full-width band set')

  // Retire the low-resolution crops the old WordPress library supplied for
  // the same three slots — they were 390px wide and cannot survive a retina
  // display, let alone a 4:5 crop.
  const retired = [
    'gallery-frame-497-png',
    'gallery-frame-491-3-png',
    'gallery-mission-market-part-2-2024-02-6-png',
  ]
  await client.delete({ query: `*[_id in $ids]`, params: { ids: retired } })
  console.log(`  gallery: retired ${retired.length} low-resolution crops`)

  let tx = client.transaction()
  for (const [i, shot] of SHOTS.entries()) {
    const id = await upload(shot.file)
    tx = tx.createOrReplace({
      _id: `gallery-${slug(shot.file)}`,
      _type: 'galleryImage',
      image: { _type: 'image', asset: { _type: 'reference', _ref: id } },
      alt: shot.alt,
      category: shot.category,
      // Negative order so the new shoot leads the gallery ahead of the older
      // room and patio frames.
      order: -100 + i,
    })
  }
  await tx.commit()
  console.log(`  gallery: ${SHOTS.length} new frames added`)

  console.log('\nFlagged for the client:')
  console.log('  · The photographed plates do NOT match the published menu text.')
  console.log('    Salmon is on pearl couscous (menu says rice grits); chicken is')
  console.log('    on a white puree (menu says tomato risotto); burrata comes with')
  console.log('    strawberry + rhubarb (menu says cherry tomatoes). The menus')
  console.log('    migrated from WordPress are probably out of date — please')
  console.log('    confirm the current dinner, lunch and brunch menus.')
  console.log('  · Featured dish names are described from the plate, not the menu.')
  console.log('    Replace with exact menu names once the menus are confirmed.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
