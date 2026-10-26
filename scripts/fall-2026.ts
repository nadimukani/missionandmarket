/**
 * Fall 2026 redesign — media + content.
 *
 *   PHOTO_DIR=/path/to/upload pnpm fall-2026            # everything
 *   PHOTO_DIR=/path/to/upload pnpm fall-2026 --dry-run  # print, write nothing
 *
 * Idempotent: assets are matched on filename, documents use fixed _ids and
 * createOrReplace / patch, so re-running converges rather than duplicating.
 * Take a dataset export before running against production.
 *
 * SOURCING POLICY — nothing here is invented. Every line traces to one of:
 *   [site]   missionandmarketatl.com as published (Oct 2026), minus what the
 *            client has since contradicted
 *   [client] direction from the restaurant (Oct 2026): no weekend brunch, no
 *            half-off wine, the weekend tasting experience, the holiday-party
 *            line (their own copy), a chef change in October
 *   [pdf]    Happy Hour 2026 menu supplied by the client
 *   [photo]  what is visibly in the frame (alt text, dish naming matched to
 *            the current menu documents)
 * Anything we could not source is left blank for the client, not guessed —
 * the chef profile, the tasting price, room photography for two rooms.
 *
 * The duck dish is excluded from every image and clip, at the restaurant's request.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createClient } from '@sanity/client'

const DRY = process.argv.includes('--dry-run')
const PHOTO_DIR = process.env.PHOTO_DIR
if (!PHOTO_DIR) throw new Error('Set PHOTO_DIR to the folder of web-ready JPEGs')

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

const CREDIT = 'Foster Peters'

type Category = 'Food' | 'Drinks' | 'Space' | 'Patio' | 'Private Dining' | 'Team'
type Shot = { file: string; alt: string; category: Category }

/** Stills from the Sept 25 shoot (sRGB-converted) and frames pulled from the
 *  "Dishes and Atmosphere" reel. Gallery order is the order below. */
const SHOTS: Shot[] = [
  { file: 'mm-reel-room.jpg', category: 'Space', alt: 'The dining room: an indoor tree, tall windows with sheer curtains and guests at their tables' },
  { file: 'mm-0925-02-burrata-cocktail.jpg', category: 'Food', alt: 'Burrata with heirloom tomatoes, basil and toasted bread, and a red cocktail garnished with a marigold, against a teal velvet banquette' },
  { file: 'mm-0925-20-marigold-coupe.jpg', category: 'Drinks', alt: 'A frothy golden cocktail in a cut-crystal coupe, garnished with a marigold, on a dark wood ledge with greenery behind' },
  { file: 'mm-0925-15-octopus.jpg', category: 'Food', alt: 'Grilled octopus with white beans, herb oil, a red pepper sauce and microgreens, beside a glass of red wine on a teak patio table' },
  { file: 'mm-reel-booths.jpg', category: 'Space', alt: 'Teal booths and walnut tables beneath an indoor tree and pendant lights' },
  { file: 'mm-0925-03-burrata-overhead.jpg', category: 'Food', alt: 'Overhead view of burrata with heirloom tomatoes, crispy basil, pesto, a balsamic drizzle and sliced toasted bread' },
  { file: 'mm-0925-22-cocktail-lineup-banquette.jpg', category: 'Drinks', alt: 'Five cocktails lined up on a wood ledge above a teal velvet banquette, with the dining room behind' },
  { file: 'mm-0925-16-patio-table.jpg', category: 'Patio', alt: 'A patio table with a chocolate dessert, pasta, an old fashioned and a red cocktail, beside teak chairs with teal cushions' },
  { file: 'mm-0925-05-crab-cakes.jpg', category: 'Food', alt: 'Two crab cakes with broccolini, frisée and orchid petals over a cream sauce, against a teal velvet banquette' },
  { file: 'mm-reel-bartender.jpg', category: 'Drinks', alt: 'A bartender squeezing citrus over a cocktail, with shakers lined up on the bar' },
  { file: 'mm-0925-11-beets.jpg', category: 'Food', alt: 'Roasted red, golden and candy-striped beets with radish, frisée, a white panna cotta and pistachio crumble' },
  { file: 'mm-0925-19-patio-pasta.jpg', category: 'Patio', alt: 'A guest cutting into spinach pasta topped with greens and shaved cheese, on the patio' },
  { file: 'mm-0925-26-cocktails-close.jpg', category: 'Drinks', alt: 'A red highball, a dark cocktail topped with cream foam and a marigold-garnished coupe, with warm lights behind' },
  { file: 'mm-0925-00-creme-brulee-wide.jpg', category: 'Food', alt: 'A crème brûlée tart topped with blueberries, strawberries and a sugared tuile, beside a glass of red wine and a bud vase of white carnations' },
  { file: 'mm-reel-guests.jpg', category: 'Space', alt: 'Guests at a table by tall windows with sheer curtains, under the branches of an indoor tree' },
  { file: 'mm-0925-13-patio-chocolate-cocktail.jpg', category: 'Patio', alt: 'A chocolate dessert with chocolate lace and whipped cream beside a red cocktail garnished with a marigold, by a teal patio cushion' },
  { file: 'mm-0925-07-coupe-crab-cakes.jpg', category: 'Drinks', alt: 'A golden coupe cocktail garnished with star anise, in front of a plate of crab cakes and a vase of magenta flowers' },
  { file: 'mm-0925-24-cocktail-lineup-room.jpg', category: 'Drinks', alt: 'Five cocktails on a ledge above a teal banquette, with the tree-lined dining room behind' },
  { file: 'mm-0925-14-chocolate.jpg', category: 'Food', alt: 'A chocolate dessert with chocolate lace, a sugared tuile and whipped cream, with a plate of pasta behind' },
  { file: 'mm-reel-back-bar.jpg', category: 'Drinks', alt: 'Bitters, syrups and jars of citrus on a white bar top, with the back bar’s bottles behind' },
  { file: 'mm-0925-08-crab-cakes-coupe.jpg', category: 'Food', alt: 'Crab cakes with broccolini and a cream sauce, with a coupe cocktail behind, against a teal velvet banquette' },
  { file: 'mm-0925-27-cocktail-detail.jpg', category: 'Drinks', alt: 'A layered cocktail topped with cream foam and a dried fruit garnish, beside a marigold-garnished coupe' },
  { file: 'mm-reel-tree.jpg', category: 'Space', alt: 'An indoor tree above the bar’s ice buckets and stools, with the dining room beyond' },
  { file: 'mm-0925-01-creme-brulee.jpg', category: 'Food', alt: 'A crème brûlée tart with blueberries, strawberries and a sugared tuile on a white plate' },
  { file: 'mm-0925-21-cocktail-lineup-wide.jpg', category: 'Drinks', alt: 'Five cocktails lined up on a wood ledge above a teal velvet banquette, with the dining room, a tree and planters behind' },
  { file: 'mm-0925-06-crab-cakes-wide.jpg', category: 'Food', alt: 'Crab cakes with broccolini and orchid petals beside a coupe cocktail and a vase of magenta flowers on a walnut table' },
]

const OLD_GALLERY_IDS = [
  'gallery-mission', 'gallery-mission-1', 'gallery-mission-2', 'gallery-mission-3',
  'gallery-mission-4', 'gallery-mission-5', 'gallery-mission-6', 'gallery-mission-7',
  'gallery-mission-8', 'gallery-mission-9', 'gallery-mission-10', 'gallery-mission-11',
  'gallery-mission-12', 'gallery-mission-market-part-1-2024-02-1-1-png',
  'gallery-mission-market-part-2-2024-02-2-png', 'gallery-mission-market-part-2-2024-02-3-3-png',
  'gallery-mission-market-part-2-2024-02-4-png', 'gallery-patio-16-png', 'gallery-frame-498-png',
  'gallery-missionmarket-aaa0088-1-1-png',
]

const assetIds = new Map<string, string>()

async function uploadAll() {
  for (const shot of SHOTS) {
    const existing = await client.fetch<string | null>(
      `*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`,
      { f: shot.file },
    )
    if (existing) {
      assetIds.set(shot.file, existing)
      console.log(`  = ${shot.file}`)
      continue
    }
    if (DRY) {
      assetIds.set(shot.file, `image-DRY-${shot.file}`)
      console.log(`  + ${shot.file} (dry run)`)
      continue
    }
    const asset = await client.assets.upload('image', readFileSync(join(PHOTO_DIR!, shot.file)), {
      filename: shot.file,
      title: shot.alt,
      description: shot.alt,
      creditLine: CREDIT,
    })
    assetIds.set(shot.file, asset._id)
    console.log(`  + ${shot.file}`)
  }
}

function img(file: string, alt?: string) {
  const id = assetIds.get(file)
  if (!id) throw new Error(`No asset for ${file}`)
  const shot = SHOTS.find((s) => s.file === file)
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: id },
    alt: alt ?? shot?.alt ?? '',
  }
}

function keyed<T extends object>(items: T[], prefix: string) {
  return items.map((item, i) => ({ _key: `${prefix}-${i}`, ...item }))
}

function block(key: string, text: string) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: `${key}-s`, _type: 'span', marks: [], text }],
  }
}

async function main() {
  console.log(DRY ? 'DRY RUN — nothing will be written' : `Writing to ${projectId}/${dataset}`)

  console.log('Uploading photographs')
  await uploadAll()

  let tx = client.transaction()

  // ── Gallery: the new shoot leads; the July set and the 2024 site crops are
  //    hidden, not deleted, so nothing is lost if the client wants one back.
  SHOTS.forEach((shot, i) => {
    tx = tx.createOrReplace({
      _id: `gallery-${shot.file.replace(/\.jpg$/, '')}`,
      _type: 'galleryImage',
      image: { ...img(shot.file), alt: undefined },
      alt: shot.alt,
      category: shot.category,
      order: i,
      hidden: false,
    })
  })
  for (const id of OLD_GALLERY_IDS) tx = tx.patch(id, (p) => p.set({ hidden: true }))

  // ── Announcement banner: created switched off, ready for a closure notice.
  tx = tx.createIfNotExists({ _id: 'announcement', _type: 'announcement', enabled: false })

  // ── Restaurant info.  [site] hours minus brunch [client]; [site] parking wording.
  tx = tx.patch('siteSettings', (p) =>
    p
      .set({
        shortDescription:
          'Modern American cooking with California and Pacific influences in the heart of Buckhead — weekday lunch, happy hour at the bar, dinner nightly, a patio with fire pits and private dining.',
        parkingNote:
          'Valet parking is available, and validated self-parking is available in the Three Alliance Center parking garage.',
        hours: keyed(
          [
            { service: 'Lunch', days: 'Monday – Friday', time: '11:30am – 3:00pm' },
            { service: 'Happy Hour', days: 'Monday – Friday', time: '3:00pm – 6:00pm' },
            { service: 'Dinner', days: 'Monday – Wednesday', time: '3:00pm – 9:30pm' },
            { service: 'Dinner', days: 'Thursday', time: '3:00pm – 10:00pm' },
            { service: 'Dinner', days: 'Friday', time: '3:00pm – 11:00pm' },
            { service: 'Dinner', days: 'Saturday', time: '5:00pm – 11:00pm' },
            { service: 'Dinner', days: 'Sunday', time: '5:00pm – 8:00pm' },
          ],
          'h',
        ),
        machineHours: keyed(
          [
            { day: 'Monday', opens: '11:30', closes: '21:30' },
            { day: 'Tuesday', opens: '11:30', closes: '21:30' },
            { day: 'Wednesday', opens: '11:30', closes: '21:30' },
            { day: 'Thursday', opens: '11:30', closes: '22:00' },
            { day: 'Friday', opens: '11:30', closes: '23:00' },
            { day: 'Saturday', opens: '17:00', closes: '23:00' },
            { day: 'Sunday', opens: '17:00', closes: '20:00' },
          ],
          'mh',
        ),
        tripleseatLeadFormId: '16159',
        tripleseatPublicKey: process.env.TRIPLESEAT_PUBLIC_KEY ?? '',
        ogImage: img('mm-0925-21-cocktail-lineup-wide.jpg'),
      })
      // Unsourced — not on the live site; removed rather than published.
      .unset(['largePartyNote']),
  )

  // ── Menus: no brunch is served [client]; hidden, not deleted.
  tx = tx.patch('menu-brunch', (p) => p.set({ hidden: true }))
  // Time-of-day order, each with a cover photograph from the shoot.
  const covers: [string, number, string][] = [
    ['menu-lunch', 0, 'mm-0925-19-patio-pasta.jpg'],
    ['menu-happy-hour', 1, 'mm-0925-26-cocktails-close.jpg'],
    ['menu-dinner', 2, 'mm-0925-15-octopus.jpg'],
  ]
  for (const [id, order, file] of covers) {
    tx = tx.patch(id, (p) => p.set({ hidden: false, order, image: img(file) }))
  }
  tx = tx.patch('menu-lunch', (p) =>
    p.set({ intro: 'Weekday lunch, 11:30 to 3 — close to the office, far from the desk.' }),
  )
  tx = tx.patch('menu-happy-hour', (p) =>
    p.set({ intro: 'Three to six, weekdays — at the bar and on the patio.' }), // [pdf]
  )
  tx = tx.patch('menu-dinner', (p) =>
    p.set({
      intro: 'Modern American cooking with California and Pacific influences, every night of the week.',
    }),
  )

  // ── Happenings.
  tx = tx.patch('special-half-price-wine', (p) => p.set({ active: false })) // [client]
  tx = tx.patch('special-sunday-brunch', (p) => p.set({ active: false })) // [client]
  tx = tx.patch('special-cocktail-class', (p) => p.set({ active: false })) // unsourced
  tx = tx.patch('special-happy-hour', (p) =>
    p.set({
      kind: 'weekly',
      title: 'Happy Hour',
      schedule: 'Weekdays, 3 – 6pm',
      description:
        'Snacks and sliders at the bar and on the patio — Margarita pizette, ‘Frenchie’ fries, wagyu cheeseburgers and crab cake banh mi.',
      ctaLabel: 'Happy hour menu',
      ctaUrl: '/menus/happy-hour',
      image: img('mm-0925-26-cocktails-close.jpg'),
      active: true,
      order: 1,
    }),
  )
  tx = tx.createOrReplace({
    _id: 'special-holiday-parties',
    _type: 'special',
    kind: 'seasonal',
    title: 'Holiday Parties',
    schedule: 'Now booking December',
    // The restaurant's own copy.
    description:
      'December is filling up fast. Reach out now to make your corporate or social holiday event unforgettable.',
    ctaLabel: 'Plan your party',
    ctaUrl: '/private-events#inquire',
    image: img('mm-reel-guests.jpg'),
    endDate: '2026-12-31',
    active: true,
    order: 0,
  })
  tx = tx.createOrReplace({
    _id: 'special-chefs-tasting',
    _type: 'special',
    kind: 'weekly',
    title: 'Four-Course Chef’s Tasting',
    schedule: 'Friday + Saturday evenings',
    // [site] four courses, wine pairing, Fri & Sat; [client] still offered on
    // weekends. Price left blank: the site shows both $65 and $68.
    description: 'Four courses from the kitchen, with an optional wine pairing.',
    image: img('mm-0925-00-creme-brulee-wide.jpg'),
    active: true,
    order: 2,
  })

  // ── Private dining rooms. [site] capacities and features, verbatim in substance.
  type Room = {
    _id: string
    name: string
    bestFor: string
    seated?: number
    reception?: number
    capacityNote?: string
    description: string
    features: string[]
    photos?: ReturnType<typeof img>[]
    order: number
  }
  const rooms: Room[] = [
    {
      _id: 'space-private-dining-room',
      name: 'Private Dining Room',
      bestFor: 'Groups of 40 or fewer',
      seated: 40,
      reception: 50,
      description: 'Forty seats, two walls of glass and curtains to draw — great views, kept private.',
      features: [
        'Floor-to-ceiling windows on two walls',
        'Curtains close it off from the main dining room',
        'Panoramic views',
      ],
      order: 0,
    },
    {
      _id: 'space-semi-private',
      name: 'Semi-Private',
      bestFor: 'Groups of 20 or fewer',
      seated: 20,
      reception: 30,
      capacityNote: 'Seated across two tables',
      description: 'Twenty seats across two tables, with windows on two sides and curtains for privacy.',
      features: [
        'Floor-to-ceiling windows on two walls',
        'Curtains for privacy',
        'Panoramic views',
        'Free Wi-Fi',
      ],
      order: 1,
    },
    {
      _id: 'space-bar-salon',
      name: 'Bar Salon',
      bestFor: 'Happy hours + receptions',
      seated: 20,
      reception: 30,
      description: 'In front of the bar — room to sit, and more room to mingle.',
      features: ['In front of the bar', 'Seating and standing room', 'Happy hour specials'],
      photos: [img('mm-reel-bartender.jpg'), img('mm-reel-back-bar.jpg')],
      order: 2,
    },
    {
      _id: 'space-patio',
      name: 'Patio',
      bestFor: 'Happy hours + receptions',
      seated: 75,
      capacityNote: 'Whole patio, seated',
      description: 'Heaters for cooler evenings, fans for warmer days, fire pits for everything in between.',
      features: ['Heaters for cooler evenings', 'Fans for warmer days', 'Fire pits'],
      photos: [img('mm-0925-16-patio-table.jpg'), img('mm-0925-19-patio-pasta.jpg')],
      order: 3,
    },
    {
      _id: 'space-buyout',
      name: 'Full Buyout',
      bestFor: 'The whole restaurant',
      description: 'All 5,300 square feet, configured around your event.',
      features: ['Dining room, bar and chef’s counter', 'Configured to your event'],
      photos: [img('mm-reel-room.jpg')],
      order: 4,
    },
  ]
  for (const room of rooms) {
    tx = tx.createOrReplace({
      _type: 'space',
      hidden: false,
      ...room,
      photos: room.photos ? keyed(room.photos, 'ph') : undefined,
    })
  }

  // ── Previous chef's profile hidden; the new profile is pending [client].
  tx = tx.patch('person-chef-paul', (p) => p.set({ hidden: true, featured: false }))

  // ── Home page.
  tx = tx.patch('homePage', (p) =>
    p.set({
      heroEyebrow: 'Flavor + Fusion · Buckhead',
      heroHeading: '*California light*, Buckhead address.',
      heroSubheading:
        'Modern American cooking with California and Pacific influences — weekday lunch, happy hour at the bar and dinner every night, in the heart of Buckhead.',
      ticker: [
        'Lunch, weekdays 11:30–3',
        'Happy hour 3–6 at the bar + patio',
        'Dinner every night',
        'Seasonal cocktails',
        'Trees indoors, fire pits outdoors',
        'Private dining for 20 to 140',
      ],
      heroImages: keyed([img('mm-reel-room.jpg'), img('mm-0925-22-cocktail-lineup-banquette.jpg')], 'hero'),
      storyHeading:
        'Fresh, inventive cooking with a West Coast accent — in a light-filled room among the trees.',
      storyBody: [
        block(
          'story-1',
          'Mission + Market brings modern American cuisine with California and Pacific influences to Three Alliance Center in Buckhead, with locally sourced ingredients across the menu.',
        ),
        block(
          'story-2',
          'Across 5,300 square feet: the dining room, a chef’s counter, a bar and lounge pouring seasonal cocktails and a curated wine list, a patio with fire pits, and private rooms for gatherings of 20 to 140.',
        ),
      ],
      storyImage: img('mm-0925-02-burrata-cocktail.jpg'),
      kitchenHeading: 'From the kitchen',
      featuredDishes: keyed(
        [
          { name: 'Burrata', description: 'Heirloom tomatoes, basil, balsamic', image: img('mm-0925-03-burrata-overhead.jpg') },
          { name: 'Grilled Spanish Octopus', description: 'Hazelnut romesco', image: img('mm-0925-15-octopus.jpg') },
          { name: 'Jumbo Lump Crab Cake', description: 'Lemon mustard sauce', image: img('mm-0925-05-crab-cakes.jpg') },
          { name: 'Roasted Local Beets', description: 'Goat cheese panna cotta, pistachio', image: img('mm-0925-11-beets.jpg') },
        ],
        'dish',
      ),
      barHeading: 'A bar worth arriving early for.',
      barBody:
        'Seasonal cocktails, a curated wine list and a bar salon made for after work. Happy hour runs weekdays from 3 to 6, at the bar and on the patio.',
      barImage: img('mm-0925-20-marigold-coupe.jpg'),
      eventsHeading: 'December is filling up fast.',
      eventsBody:
        'Reach out now to make your corporate or social holiday event unforgettable — a private room, the patio or the whole restaurant, for 20 to 140 guests.',
      eventsImage: img('mm-0925-24-cocktail-lineup-room.jpg'),
      patioHeading: 'Trees indoors, *fire pits* outdoors.',
      patioBody:
        'Heaters for cooler evenings, fans for warmer days and fire pits once the sun goes down. The whole patio seats 75.',
      seo: {
        description:
          'Modern American cooking with California and Pacific influences in Buckhead, Atlanta — weekday lunch, happy hour, dinner nightly, a patio with fire pits and private dining for 20 to 140.',
      },
      patioImages: keyed(
        [img('mm-0925-16-patio-table.jpg'), img('mm-0925-19-patio-pasta.jpg'), img('mm-0925-15-octopus.jpg')],
        'patio',
      ),
    }),
  )

  // ── Pages.
  tx = tx.patch('page-about', (p) =>
    p.set({
      title: 'About',
      intro:
        'Flavor + Fusion — modern American cooking with California and Pacific influences, in the heart of Buckhead.',
      heroImage: img('mm-reel-room.jpg'),
      body: [
        block(
          'about-1',
          'Mission + Market brings fresh, inventive, West Coast–inspired cooking to Three Alliance Center in Buckhead. The menu draws on California and the Pacific, with locally sourced ingredients throughout.',
        ),
        block(
          'about-2',
          'The 5,300-square-foot space holds a light-filled dining room, a chef’s counter, a bar and lounge pouring seasonal cocktails and a curated wine list, a patio with fire pits, and private dining for gatherings of 20 to 140.',
        ),
      ],
    }),
  )
  tx = tx.patch('page-private-events', (p) =>
    p.set({
      seo: {
        title: 'Private Dining + Events in Buckhead',
        description:
          'Private dining rooms, the patio and full buyouts for 20 to 140 guests at Mission + Market in Buckhead — corporate lunches, holiday parties and celebrations.',
      },
      title: 'Private Dining',
      intro:
        'From a working lunch to a full buyout — rooms for 20 to 140 guests in the heart of Buckhead.',
      heroImage: img('mm-0925-24-cocktail-lineup-room.jpg'),
      body: [
        block(
          'pe-1',
          'Corporate lunches, holiday parties, celebration dinners — our light-filled spaces can be configured many different ways, and the entire restaurant is available for a buyout.',
        ),
        block(
          'pe-2',
          'Choose from tiered menus or build a fully custom one. Send us the date, the headcount and the occasion, and we’ll be in touch.',
        ),
      ],
    }),
  )

  if (DRY) {
    console.log(JSON.stringify(tx.serialize(), null, 1).slice(0, 4000))
    console.log('… dry run complete')
    return
  }
  const res = await tx.commit({ visibility: 'sync' })
  console.log(`Committed ${res.results.length} mutations — transaction ${res.transactionId}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
