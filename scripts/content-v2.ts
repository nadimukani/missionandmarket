/**
 * Image placement + links for the second design pass.
 *   pnpm content-v2 [--dry-run]
 * Idempotent: patches only the fields named below.
 */
import { createClient } from '@sanity/client'

const DRY = process.argv.includes('--dry-run')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Missing Sanity env vars')
const client = createClient({ projectId, dataset, token, apiVersion: '2026-07-22', useCdn: false })

async function image(file: string) {
  const id = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`, { f: file })
  if (!id) throw new Error(`Missing asset ${file}`)
  return { _type: 'image', asset: { _type: 'reference', _ref: id } }
}

/** Gallery order: the first five form the home page mosaic, chosen so none
 *  repeats a photograph used elsewhere on the home page. */
const GALLERY_ORDER = [
  'mm-reel-booths',
  'mm-0925-16-patio-table',
  'mm-reel-bartender',
  'mm-reel-guests',
  'mm-0925-27-cocktail-detail',
  'mm-reel-room',
  'mm-0925-02-burrata-cocktail',
  'mm-0925-20-marigold-coupe',
  'mm-0925-15-octopus',
  'mm-0925-03-burrata-overhead',
  'mm-0925-22-cocktail-lineup-banquette',
  'mm-0925-05-crab-cakes',
  'mm-0925-11-beets',
  'mm-0925-19-patio-pasta',
  'mm-0925-26-cocktails-close',
  'mm-0925-00-creme-brulee-wide',
  'mm-0925-13-patio-chocolate-cocktail',
  'mm-0925-07-coupe-crab-cakes',
  'mm-0925-24-cocktail-lineup-room',
  'mm-0925-14-chocolate',
  'mm-reel-back-bar',
  'mm-0925-08-crab-cakes-coupe',
  'mm-reel-tree',
  'mm-0925-01-creme-brulee',
  'mm-0925-21-cocktail-lineup-wide',
  'mm-0925-06-crab-cakes-wide',
]

async function main() {
  const room = await image('mm-reel-room.jpg')
  const tree = await image('mm-reel-tree.jpg')
  let tx = client.transaction()
  tx = tx.patch('special-holiday-parties', (p) => p.set({ ctaUrl: '/holiday-parties', ctaLabel: 'Plan Your Party' }))
  tx = tx.patch('homePage', (p) => p.set({ eventsImage: room }))
  tx = tx.patch('page-private-events', (p) => p.set({ heroImage: room }))
  tx = tx.patch('page-about', (p) =>
    p.set({
      heroImage: tree,
      title: 'About Mission + Market',
      intro: 'Modern American cooking with California and Pacific influences, in the heart of Buckhead.',
    }),
  )
  GALLERY_ORDER.forEach((file, i) => {
    tx = tx.patch(`gallery-${file}`, (p) => p.set({ order: i }))
  })
  if (DRY) {
    console.log(`${tx.serialize().length} mutations (dry run)`)
    return
  }
  const res = await tx.commit({ visibility: 'sync' })
  console.log(`Committed — ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
