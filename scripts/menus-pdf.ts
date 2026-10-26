/**
 * The uploaded PDF becomes the menu: the restaurant updates a menu by
 * uploading the designer's new PDF, with nothing to retype.
 *   pnpm menus-pdf --dinner <dinner.pdf> --lunch <lunch.pdf> [--dry-run]
 *
 * Additive and idempotent — nothing is deleted:
 * - attaches the Dinner and Lunch PDFs (the Happy Hour sheet is attached);
 * - Drinks and Dessert need nothing: a menu shows on the site once it has a
 *   PDF, and theirs are page 2 of the Dinner and Lunch PDFs;
 * - says so in the Dinner and Lunch intros, unless the owner has edited them;
 * - adds the menu notices if none are set;
 * - starts Home → Signature dishes from the dishes the home page shows today.
 */
import { readFileSync } from 'node:fs'

import { createClient } from '@sanity/client'

const DRY = process.argv.includes('--dry-run')
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Missing Sanity env vars')
const client = createClient({ projectId, dataset, token, apiVersion: '2026-07-22', useCdn: false })

const PDFS = [
  { id: 'menu-dinner', path: arg('dinner'), filename: 'mission-market-dinner-2026.pdf' },
  { id: 'menu-lunch', path: arg('lunch'), filename: 'mission-market-lunch-2026.pdf' },
]

/** Intros written by the 2026 content pass; anything else is the owner's. */
const INTROS: Record<string, [from: string, to: string]> = {
  'menu-dinner': [
    'Modern American cooking with California and Pacific influences.',
    'Modern American cooking with California and Pacific influences — with cocktails, wine, beer and desserts.',
  ],
  'menu-lunch': [
    'Close to the office, far from the desk.',
    'Close to the office, far from the desk — with cocktails, wine, beer and desserts.',
  ],
  // Where it's served already shows from Hours & Closures; say what's on it.
  'menu-happy-hour': ['At the bar and on the patio.', 'Snacks and sliders.'],
}

/** The restaurant's printed allergen line, and Georgia's approved reminder
 *  (Rule 511-6-1-.04(7)(e)3.(ii)); the site sets both in capitals. */
const NOTICES = {
  allergenNotice: 'Please make your server aware of any allergies or dietary restrictions.',
  rawFoodNotice:
    'Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.',
}

const key = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function main() {
  const tx = client.transaction()

  for (const { id, path, filename } of PDFS) {
    const doc = await client.getDocument<{ pdf?: { asset?: { _ref: string } } }>(id)
    if (!doc) throw new Error(`Missing ${id}`)
    if (doc.pdf?.asset) {
      console.log(`${id}: PDF already attached (${doc.pdf.asset._ref})`)
      continue
    }
    if (!path) throw new Error(`${id} has no PDF yet — pass --${id.replace('menu-', '')} <file.pdf>`)
    const asset = DRY
      ? { _id: `(dry-run upload of ${filename})` }
      : await client.assets.upload('file', readFileSync(path), { filename, contentType: 'application/pdf' })
    console.log(`${id}: attach ${filename} → ${asset._id}`)
    tx.patch(id, (p) => p.set({ pdf: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } } }))
  }

  const intros = await client.fetch<{ _id: string; intro?: string }[]>(`*[_id in $ids]{ _id, intro }`, {
    ids: Object.keys(INTROS),
  })
  for (const m of intros) {
    const [from, to] = INTROS[m._id]
    if (m.intro === from) {
      console.log(`${m._id}: intro → "${to}"`)
      tx.patch(m._id, (p) => p.set({ intro: to }))
    }
  }

  tx.patch('siteSettings', (p) => p.setIfMissing(NOTICES))
  console.log('siteSettings: menu notices, if not set')

  // Today's home page dishes: ticked "featured" with a photograph, in menu
  // order. They live on the Dinner PDF (the crème brûlée on its page 2).
  type Dish = { name: string; description?: string; image: Record<string, unknown> }
  const menus = await client.fetch<{ items: Dish[] | null }[]>(
    `*[_type == "menu" && _id in ["menu-dinner", "menu-dessert"]] | order(order asc){
      "items": sections[].items[featured == true && defined(image.asset)]{ name, description, image }
    }`,
  )
  const featured = menus.flatMap((m) => m.items ?? [])
  const hasList = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].signatureDishes)`)
  if (!hasList && featured.length) {
    console.log(`homePage: Signature dishes ← ${featured.map((d) => d.name).join(', ')}`)
    tx.patch('homePage', (p) =>
      p.setIfMissing({
        signatureDishes: featured.map((d) => ({
          _key: key(d.name),
          name: d.name,
          description: d.description,
          image: d.image,
          menu: { _type: 'reference', _ref: 'menu-dinner' },
        })),
      }),
    )
  }

  if (DRY) {
    console.log('\n(dry run — nothing written)')
    return
  }
  const res = await tx.commit()
  console.log(`\ncommitted ${res.results.length} change(s)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
