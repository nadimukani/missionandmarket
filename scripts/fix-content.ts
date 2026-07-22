/**
 * Content corrections from the site review.
 *
 *   pnpm fix-content
 *
 * Each change fixes a statement that was factually wrong on the live site.
 * Idempotent.
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Missing Sanity env vars')

const client = createClient({ projectId, dataset, token, apiVersion: '2026-07-22', useCdn: false })

const block = (text: string, key: string) => ({
  _type: 'block', _key: key, style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
})

async function run() {
  // 1. Dinner said "Monday – Sunday, from 3:00pm" while the footer on the same
  //    page said Sat/Sun dinner starts at 5:00pm. Guests would arrive to a
  //    closed dining room.
  await client.patch('menu-dinner').set({
    availability: 'Monday – Friday from 3:00pm · Saturday & Sunday from 5:00pm',
  }).commit()
  console.log('  dinner availability corrected')

  // 2. Weekend hours were a single continuous row, so both the Restaurant
  //    JSON-LD and the "Open now" badge claimed the restaurant was open
  //    through the 3–5pm gap between brunch and dinner.
  await client.patch('siteSettings').set({
    machineHours: [
      { _key: 'mo', day: 'Monday', opens: '11:30', closes: '21:30' },
      { _key: 'tu', day: 'Tuesday', opens: '11:30', closes: '21:30' },
      { _key: 'we', day: 'Wednesday', opens: '11:30', closes: '21:30' },
      { _key: 'th', day: 'Thursday', opens: '11:30', closes: '22:00' },
      { _key: 'fr', day: 'Friday', opens: '11:30', closes: '23:00' },
      { _key: 'sa-brunch', day: 'Saturday', opens: '11:00', closes: '15:00' },
      { _key: 'sa-dinner', day: 'Saturday', opens: '17:00', closes: '23:00' },
      { _key: 'su-brunch', day: 'Sunday', opens: '11:00', closes: '15:00' },
      { _key: 'su-dinner', day: 'Sunday', opens: '17:00', closes: '20:00' },
    ],
  }).commit()
  console.log('  weekend split services set (closes 3–5pm)')

  // 3. The band caption claimed lunch seven days a week; lunch is Mon–Fri.
  await client.patch('homePage').set({
    bandCaption: 'Brunch, lunch and dinner — open seven days.',
  }).commit()
  console.log('  band caption corrected')

  // 4. "Rocket" is the British term; the same menu says "Arugula" elsewhere.
  const lunch = await client.fetch<{ sections?: unknown[] } | null>(
    `*[_id == "menu-lunch"][0]{ sections }`,
  )
  if (lunch?.sections) {
    const json = JSON.stringify(lunch.sections).replace(/Rocket/g, 'Arugula')
    await client.patch('menu-lunch').set({ sections: JSON.parse(json) }).commit()
    console.log('  lunch: "Rocket" → "Arugula"')
  }

  // 5. The About page advertised "chilled red king crab", which appears on no
  //    menu. Replaced with dishes that actually exist.
  await client.patch('page-about').set({
    body: [
      block(
        'Mission + Market sits on the lower level of Three Alliance Center in the heart of Buckhead, serving modern American cuisine with California and Pacific influences for lunch, brunch and dinner.',
        'about-1',
      ),
      block(
        'Executive Chef Paul leads the kitchen, drawing on California, the Pacific Northwest and the Pacific Rim, with locally sourced ingredients at the center of the menu. Signature dishes include the grilled Spanish octopus with hazelnut romesco and the ginger marinated duck steak.',
        'about-2',
      ),
      block(
        'The restaurant is a collaboration with Jonathan and Tony Akly, partners in other Atlanta establishments. The 5,300 square foot space includes a dynamic bar and lounge, a covered and heated patio with fire pits, and private dining areas.',
        'about-3',
      ),
    ],
  }).commit()
  console.log('  about: signature dishes now exist on the menu')

  // 6. Happy Hour stated the bar/patio restriction in both the intro and the
  //    footnote.
  await client.patch('menu-happy-hour').unset(['footnote']).commit()
  console.log('  happy hour: duplicate restriction removed')

  // 7. British spellings in gallery alt text.
  const gallery = await client.fetch<{ _id: string; alt: string }[]>(
    `*[_type == "galleryImage" && (alt match "icing sugar" || alt match "coloured")]{_id, alt}`,
  )
  if (gallery.length) {
    let tx = client.transaction()
    for (const g of gallery) {
      tx = tx.patch(g._id, (pt) =>
        pt.set({ alt: g.alt.replace(/icing sugar/g, 'powdered sugar').replace(/coloured/g, 'colored') }),
      )
    }
    await tx.commit()
    console.log(`  gallery: ${gallery.length} alt text(s) Americanised`)
  }

  // 8. The lunch sandwich note read "Served with fries or salad, +$5" — which
  //    reads as included; the pizza note on the same page says "Add".
  const l2 = await client.fetch<{ sections?: unknown[] } | null>(
    `*[_id == "menu-lunch"][0]{ sections }`,
  )
  if (l2?.sections) {
    const json = JSON.stringify(l2.sections).replace(
      'Served with fries or salad, +$5.',
      'Add fries or salad, +$5.',
    )
    await client.patch('menu-lunch').set({ sections: JSON.parse(json) }).commit()
    console.log('  lunch: sandwich add-on wording matches pizza')
  }

  console.log('\nStill needing the client (not guessed):')
  console.log('  · "Margarita Pizette" — likely "Margherita Pizzette". Unconfirmed.')
  console.log('  · Tortellini filling differs lunch (English pea) vs dinner (spinach).')
  console.log('  · A private-events / reservations email address — none exists anywhere.')
}

run().catch((e) => { console.error(e); process.exit(1) })
