/**
 * Adds the Happy Hour menu, transcribed from "New Happy Hour 2026.pdf".
 *
 *   pnpm happy-hour
 *
 * The menu is created as real HTML content, not a PDF link. A PDF-only menu
 * is the single most common restaurant accessibility complaint, it cannot
 * carry schema.org Menu markup, and it is not selectable, translatable or
 * resizable on a phone. The PDF is still attached as an optional printable
 * version via the menu's `pdf` field.
 *
 * TRANSCRIPTION NOTES — flagged to the client, not silently changed:
 *   · The PDF reads "HOT SAUSE BUTTER". Corrected to "Hot Sauce Butter"
 *     here; revert if that spelling is deliberate.
 *   · The PDF reads "MARGARITA PIZETTE". Left exactly as printed, though the
 *     dinner menu says "Margherita Pizza" and this looks like it should be
 *     "Margherita Pizzette". Awaiting confirmation.
 *
 * Idempotent — fixed _id, createOrReplace.
 */
import { readFileSync } from 'node:fs'

import { createClient } from '@sanity/client'

const PDF_PATH =
  process.env.HAPPY_HOUR_PDF ?? '/Users/nadim/Downloads/New Happy Hour 2026.pdf'

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

type Item = { name: string; description?: string; price?: string }

const section = (title: string, items: Item[], note?: string) => ({
  _type: 'menuSection',
  _key: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title,
  note,
  items: items.map((i, idx) => ({
    _type: 'menuItem',
    _key: `${i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32)}-${idx}`,
    ...i,
  })),
})

async function uploadPdf(): Promise<string | null> {
  try {
    const buf = readFileSync(PDF_PATH)
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "sanity.fileAsset" && originalFilename == $f][0]{_id}`,
      { f: 'mission-market-happy-hour-2026.pdf' },
    )
    if (existing?._id) return existing._id

    const asset = await client.assets.upload('file', buf, {
      filename: 'mission-market-happy-hour-2026.pdf',
      contentType: 'application/pdf',
    })
    console.log('  uploaded printable PDF')
    return asset._id
  } catch {
    console.log('  (PDF not found — menu created without a printable version)')
    return null
  }
}

async function run() {
  const pdfId = await uploadPdf()

  await client.createOrReplace({
    _id: 'menu-happy-hour',
    _type: 'menu',
    title: 'Happy Hour',
    slug: { _type: 'slug', current: 'happy-hour' },
    order: 4,
    availability: 'Weekdays, 3:00 – 6:00pm',
    intro: 'Served at the bar and on the patio, Monday through Friday.',
    sections: [
      section('Snacks', [
        { name: 'Margarita Pizette', price: '$10' },
        {
          name: 'Semolina Fried Chicken Bites',
          description: 'Hot Sauce Butter',
          price: '$9',
        },
        {
          name: "'Frenchie' Fries",
          description: 'Crème Fraîche, Chives, Mimolette',
          price: '$10',
        },
        {
          name: 'Artichoke Dip',
          description: 'Black Truffle, Grilled Ciabatta',
          price: '$14',
        },
        {
          name: "Crispy Salmon 'Chips'",
          description: 'Buttermilk + Dill',
          price: '$12',
        },
        { name: 'Yuzu Tempura Shrimp', price: '$14' },
        { name: 'Romaine Caesar', price: '$7' },
      ]),
      section('Sliders', [
        { name: 'Wagyu Cheeseburger (2)', price: '$12' },
        { name: 'Crab Cake Banh Mi (2)', price: '$14' },
      ]),
    ],
    ...(pdfId
      ? { pdf: { _type: 'file', asset: { _type: 'reference', _ref: pdfId } } }
      : {}),
  })
  console.log('  menu-happy-hour created (9 items across 2 sections)')

  // The seeded special said "bar and lounge only"; the new PDF says bar + patio.
  await client
    .patch('special-happy-hour')
    .set({
      schedule: 'Weekdays, 3:00 – 6:00pm',
      description:
        'Snacks and sliders at the bar and on the patio — from the Margarita Pizette to wagyu cheeseburgers and crab cake banh mi.',
      // Left unset deliberately: the card then falls back to "Reserve a table",
      // which is the action worth taking. The menu itself is reachable from
      // Menus, where a guest looking for food will already be.
      ctaLabel: undefined,
      ctaUrl: undefined,
    })
    .commit()
  console.log('  special-happy-hour updated to match (bar + patio)')

  console.log('\nFlagged for the client:')
  console.log('  · PDF reads "HOT SAUSE BUTTER" — published as "Hot Sauce Butter"')
  console.log('  · PDF reads "MARGARITA PIZETTE" — published verbatim, but the')
  console.log('    dinner menu says "Margherita Pizza". Confirm the spelling.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
