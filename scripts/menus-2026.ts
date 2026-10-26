/**
 * 2026 menus + single-source schedule.
 *
 *   pnpm menus-2026            # write
 *   pnpm menus-2026 --dry-run  # print, write nothing
 *
 * Sources: the restaurant's "Dinner 2026" and "Lunch 2026" PDFs (Aug 2026),
 * transcribed item by item. Drinks + desserts come from the Dinner PDF's back
 * page (the Lunch PDF's back page differs in four details — flagged to the
 * client). Print capitals are set in title case; prices keep the menu's
 * no-dollar-sign style.
 *
 * Spelling corrected from the print (all flagged to the client to confirm):
 * Gigandes → Gigantes · Parmagiano → Parmigiano · Anchioves → Anchovies ·
 * Mayonaise → Mayonnaise · Spritzs → Spritzes · Brulée → Brûlée ·
 * Bokchoy → Bok Choy · a la Brava → à la Brava.
 *
 * Idempotent: fixed _ids, createOrReplace. It OVERWRITES these menus — do not
 * re-run once the restaurant is editing them in the Studio.
 */
import { createClient } from '@sanity/client'

const DRY = process.argv.includes('--dry-run')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Missing Sanity env vars')

const client = createClient({ projectId, dataset, token, apiVersion: '2026-07-22', useCdn: false })

type Item = [name: string, price: string, description?: string]
type Section = { title: string; note?: string; layout?: 'list' | 'feature'; items: Item[] }

const ALLERGY =
  'Please make your server aware of any allergies or dietary restrictions. Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.'

const DINNER: Section[] = [
  {
    title: 'Social',
    items: [
      ['Mediterranean Hummus', '16', 'Blistered Peppers, Shaved Vegetables'],
      ['Grilled Octopus', '21', 'Romesco, Marinated Gigantes, Chimmi'],
      ['Tuna Tataki', '22', 'Calamansi, Pickled Vegetables, Guacamole'],
      ['Crispy Salmon Croquettes', '14', 'Honey Mustard Sabayon'],
      ['Roasted Mushroom Pizza', '21', 'Parmesan Cream, Crispy Ham Chives'],
      ['Warm Artichoke + Black Truffle Fondue', '18', 'Toasted Focaccia'],
      ['Yuzu Tempura Shrimp', '19', 'Spicy Mango Chutney'],
      [
        'Thomasville GA Cheese Plate',
        '29',
        'Camembert, Tomme, Danish Blue · Spicy Peach Marmalade, Crackers + Hearth Focaccia',
      ],
    ],
  },
  {
    title: 'Garden',
    items: [
      ['Local Beets', '19', 'Goat Cheese Panna Cotta, Pistachio Oil'],
      ['Romaine Caesar', '16', 'Ciabatta Croutons, Parmigiano-Reggiano, Anchovies (As per request)'],
      ['Market Salad', '15', 'Shaved Vegetables, Pumpkin Seeds'],
      ['Burrata', '19', 'Bursting Baby Heirloom Tomatoes, Pecan Pesto'],
    ],
  },
  {
    title: 'Pasta',
    note: 'Add ons: Chicken +10 · Shrimp +15 · Salmon +17',
    items: [
      ['Roasted Mushroom Pasta', '24', 'Fresh Pasta, Parmesan Cream'],
      ['Spinach + Ricotta Tortellini', '24', 'Wilted Spinach, Brown Butter'],
      ['Bolognese', '27', 'Beef + Pork, Rigatoni'],
    ],
  },
  {
    title: 'Market Reserve',
    layout: 'feature',
    items: [
      [
        '20 oz Bone-In Ribeye — Dinner for Two',
        '140',
        'Potatoes à la Brava, Market Greens, Green Peppercorn Jus',
      ],
    ],
  },
  {
    title: 'Mission Plates',
    items: [
      [
        'Oven Roasted Salmon Steak',
        '34',
        'Israeli Cous Cous, Charred Cucumber, Roasted Peppers, Tomato Citronette',
      ],
      ['Herb Roasted Chicken', '29', 'Cauliflower Purée, Warm Frisée-Haricot Vert Salad, Truffle Jus'],
      ['Ginger Marinated Duck Steak', '40', 'Sushi Rice, Panang Curry, Bok Choy'],
      ['Halibut', '48', 'Corn, Pickled Enoki, Asparagus, Sauce Vierge'],
      ['Maryland Blue Crab Cakes', '42', 'Lemon Mustard Sauce, Grilled Rapini'],
      [
        'Sea Bass à la Plancha',
        '44',
        'Romanesco, Baby Potatoes, Saffron Fennel, Green Olive Tapenade',
      ],
      ['Flatiron Steak Frites', '48', 'Truffle Fries, Chimichurri'],
      ['Pressed Lamb Shoulder', '42', 'Butter Bean Puree, Chermoula, Baby Carrots'],
      ['Grilled Petite Filet Mignon', '56', 'Koji Butter, Tempura Sweet Potatoes, Heirloom Tomato'],
      ['Signature Wagyu Market Burger', '25', 'American Cheese, Lettuce, Tomato, Pickles, M+M Sauce'],
    ],
  },
  {
    title: 'Market Sides',
    items: [
      ['Salt & Pepper Fries + Herb Butter', '8'],
      ['Creamy Orzo + Parmesan & Crispy Ham', '10'],
      ['Grilled Rapini + Trumpet Mushroom Escabeche', '9'],
      ['Fingerling Potatoes à la Brava', '9'],
    ],
  },
]

const LUNCH: Section[] = [
  {
    title: 'Social',
    items: [
      ['Fry Farm Kale + Artichoke Dip', '18', 'Black Truffle, Ciabatta'],
      ['Mediterranean Hummus', '15', 'Blistered Peppers, Shaved Vegetables'],
      ['Burrata', '19', 'Bursting Baby Heirloom Tomatoes, Pecan Pesto'],
      ['Grilled Spanish Octopus', '21', 'Romesco, Marinated Gigantes, Chimmi'],
      ['Jumbo Lump Crab Cake', '21', 'Lemon Mustard Sauce'],
      ['Yuzu Tempura Shrimp', '19', 'Spicy Mango Chutney'],
    ],
  },
  {
    title: 'M+M Express',
    layout: 'feature',
    items: [["Chef's Special Presse Sandwich + Choice of Soup or Salad", '21']],
  },
  {
    title: 'Handhelds',
    note: 'Add fries or salad +5',
    items: [
      ['Impossible Burger', '21', 'Asiago Cheese, Avocado, Pickled Red Onions'],
      ['Grilled Chicken Sandwich', '18', 'Lettuce, Tomato, Chipotle Mayo'],
      ['Smoked Brisket Sandwich', '20', 'Mustard, Mayonnaise, Rocket, Asiago Cheese'],
      ['Tuna Banh Mi', '25', 'Pickled Vegetable, Sriracha Aioli'],
      ['Signature Wagyu Market Burger', '21', 'American Cheese, Lettuce, Tomato, Pickles, M+M Sauce'],
    ],
  },
  {
    title: 'Pizza',
    items: [
      ['Roasted Mushroom', '20', 'Creamy Parmesan, Chive, Crispy Prosciutto'],
      ['Margherita', '15', 'Tomato, Mozzarella, Basil'],
      ['Pepperoni', '18', 'Tomato, Mozzarella, Parsley'],
    ],
  },
  {
    title: 'Market Greens + Bowls',
    note: 'Add ons: Corvina Sea Bass +24 · Atlantic Salmon +16 · Chargrilled Chicken +10 · Shrimp +14 · Flatiron +21',
    items: [
      [
        'Tuscan Kale Salad',
        '17',
        'Corn, Sweet-Peppers, Pickled Onions, Feta, Meyer-Lemon Honey Dressing, Toasted Pecans',
      ],
      [
        'M+M Chopped Salad',
        '17',
        'Romaine Lettuce, Cucumber, Asparagus, Cherry Tomatoes, Hard-boiled Egg, Blue Cheese Dressing and Blue Cheese Crumbles',
      ],
      ['Baby Gem Caesar', '16', 'Ciabatta Croutons, Parmigiano-Reggiano (Anchovies as per request)'],
      ['Warm Quinoa + Brown Rice', '18', 'Vegetables, Peanut Agrodolce'],
      ['Garden Mix', '14', 'Shaved Vegetables, Pumpkin Seeds'],
      ['Roasted Local Beets', '19', 'Goat Cheese Panna Cotta, Pistachio Oil'],
      ['China Black Rice', '19', 'Fried Kale, Spiced Coconut Panang Curry'],
    ],
  },
  {
    title: 'Pasta',
    items: [
      ['Wild Mushroom Pasta', '24', 'Fresh Pasta, Parmesan Cream'],
      ['Bolognese', '26', 'Beef + Pork, Rigatoni'],
      ['Spinach + Ricotta Tortellini', '21', 'Brown Butter, Wilted Spinach'],
    ],
  },
  {
    title: 'Mission Plates',
    items: [
      [
        'Oven Roasted Salmon Steak',
        '34',
        'Israeli Cous Cous, Charred Cucumber, Roasted Peppers, Tomato Citronette',
      ],
      ['Herb Roasted Chicken', '28', 'Cauliflower Puree, Warm Frisée - Haricot Vert Salad, Truffle Jus'],
      ['Sea Bass à la Plancha', '44', 'Romanesco, Potatoes, Saffron Fennel, Green Olive Tapenade'],
      ['8 oz Flatiron Steak', '48', 'Chimichurri, Truffle Fries'],
    ],
  },
]

const DRINKS: Section[] = [
  {
    title: 'House Cocktails',
    items: [
      ['Chasing Summer', '16', 'Ketel One Grapefruit, Lychee, Coconut, Lime'],
      ['Spring in Provence', '16', 'Conniption Gin, St. Germain, Lavender Honey, Lemon'],
      ['Blooming Meadow', '16', 'Del Maguey Mezcal, Midori, Genepy, Jalapeño Syrup, Lime'],
      ['The Blushing Agave', '16', 'Altos Tequila, St. Germain, Coconut, Dragonfruit, Lemon'],
      ['Peach Reverie', '16', 'Old Forester Bourbon, Averna, Peach, Lemon'],
      ['The Executive Old Fashioned', '25', 'Rose + Cherry Smoked · Lock + Stock Barrel Rye Whiskey'],
    ],
  },
  {
    title: 'M+M Spritzes',
    items: [
      ['Evora', '16', 'Tatersall Vodka, Lime, Crème de Violette, Lavender Honey'],
      ['Botanical Blanc', '16', 'Gin, Sauvignon Blanc, Mint, Pineapple, and Lemon'],
      ['Edge of Desire', '16', 'Gin, Hibiscus-Pomegranate, Lemon, and Prosecco'],
    ],
  },
  {
    title: 'Zero Proof',
    items: [
      ['Golden Orchard', '12', 'Mango Lime, Agave, and Coconut Water'],
      ['Pursuit of Happiness', '12', 'Pomegranate, Hibiscus, Lime, and Orange Bitters'],
      ['Good Manners', '12', 'Lychee, Coconut, Aperitivo, and Grapefruit'],
    ],
  },
  {
    title: 'By the Glass',
    items: [
      ['Moncontour', '14', 'Brut Rosé · Loire Valley · NV'],
      ['Lamberti', '12', 'Prosecco · Italy · NV'],
      ['Moët & Chandon', '26', 'Champagne · France · NV'],
      ['Châteaumar “Perle de Rosé”', '13', 'Rosé · France · 2022'],
      ['Chateau St. Michelle', '12', 'Riesling · Columbia Valley · 2023'],
      ['Masi Masianco', '13', 'Pinot Grigio · Veneto · 2024'],
      ['Decoy by Duckhorn', '14', 'Sauvignon Blanc · Napa Valley · 2024'],
      ['Domaine Pierre Riffault', '22', 'Sancerre · Loire Valley · 2024'],
      ['Bishop’s Peak', '15', 'Chardonnay · San Luis Obispo County · 2023'],
      ['Stoller Estate', '16', 'Pinot Noir · Willamette Valley · 2023'],
      ['Achaval Ferrer', '14', 'Malbec · Mendoza Valley · 2024'],
      ['Crous St Martin', '24', 'Châteauneuf du Pape · Rhone Valley · 2020'],
      ['Sean Minor “Nicole Marie”', '16', 'Merlot · Zinfandel · North Coast · 2023'],
      ['Stolpman “La Cuadilla”', '16', 'Syrah Blend · Ballard Canyon · 2023'],
      ['Faust', '29', 'Cabernet Sauvignon · Napa Valley · 2022'],
      ['Daou', '16', 'Cabernet Sauvignon · Paso Robles · 2022'],
    ],
  },
  {
    title: 'Beer — Bottles + Cans',
    items: [
      ['La Fin du Monde', '10', 'Triple Blonde'],
      ['Stella Artois', '8', 'Pale Lager'],
      ['New Belgium Fat Tire', '8', 'Amber Ale'],
      ['Wild Leap', '8', 'Local Gold Ale'],
      ['Brooklyn', '7', 'N/A IPA'],
      ['Surf Side', '8', 'Green Tea + Vodka'],
    ],
  },
  {
    title: 'Beer — Draft',
    items: [
      ['Peroni', '8', 'Pale Lager'],
      ['Reformation', '8', 'Pilsner'],
      ['Guinness', '8', 'Stout'],
      ['Creature Comforts Tropicalia', '8', 'IPA'],
      ['Sweet Water', '8', 'Hazy IPA'],
      ['Monday Night 404 Lager', '8', 'Lager'],
    ],
  },
]

const DESSERT: Section[] = [
  {
    title: 'Desserts',
    items: [
      ['White Chocolate Crème Brûlée', '12', 'Short Bread Cookies'],
      ['Cream Cheese Pound Cake', '12', 'Rum Sauce, Almond Brittle Ice-Cream'],
      ['Tres Leches Cocoa Bread Pudding', '12', 'Salty Caramel Ice-Cream'],
      [
        'A Selection of Gelato and Sorbets',
        '12',
        'Choose any three of the following flavors: Vanilla, Raspberry, Chocolate, Salted Caramel, Almond Brittle, Espresso',
      ],
      ['Dark Chocolate Torte', '12', 'Whipped Cream and Chocolate Cremoso'],
    ],
  },
  {
    title: 'After Dinner Drinks',
    items: [
      ['Tiramisù Affogato', '16', 'Vanilla Gelato, Coffee Liqueur, Amaretto, and Espresso'],
      ['Espresso Martini', '16', 'Vodka, Mr. Black Coffee Liqueur, and Espresso'],
      ['Café Cacao Banane', '16', 'Vodka, Espresso, Demerara, Banana, and Chocolate'],
    ],
  },
]

/** Dishes that appear in the September shoot, matched plate to menu line. */
const PHOTOS: Record<string, { file: string; featured: boolean }> = {
  'Grilled Octopus': { file: 'mm-0925-15-octopus.jpg', featured: true },
  Burrata: { file: 'mm-0925-03-burrata-overhead.jpg', featured: true },
  'Maryland Blue Crab Cakes': { file: 'mm-0925-05-crab-cakes.jpg', featured: true },
  'Local Beets': { file: 'mm-0925-11-beets.jpg', featured: true },
  'White Chocolate Crème Brûlée': { file: 'mm-0925-01-creme-brulee.jpg', featured: true },
  'Dark Chocolate Torte': { file: 'mm-0925-14-chocolate.jpg', featured: false },
}

const assetByFile = new Map<string, string>()

async function asset(file: string) {
  if (assetByFile.has(file)) return assetByFile.get(file)!
  const id = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`,
    { f: file },
  )
  if (!id) throw new Error(`Asset not uploaded yet: ${file} (run scripts/fall-2026.ts first)`)
  assetByFile.set(file, id)
  return id
}

async function image(file: string) {
  return { _type: 'image', asset: { _type: 'reference', _ref: await asset(file) } }
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

async function sections(list: Section[], withPhotos: boolean) {
  return Promise.all(
    list.map(async (sec, si) => ({
      _key: `s${si}-${slug(sec.title)}`,
      _type: 'menuSection',
      title: sec.title,
      ...(sec.note ? { note: sec.note } : {}),
      layout: sec.layout ?? 'list',
      items: await Promise.all(
        sec.items.map(async ([name, price, description], ii) => {
          const photo = withPhotos ? PHOTOS[name] : undefined
          return {
            _key: `i${si}-${ii}-${slug(name).slice(0, 40)}`,
            _type: 'menuItem',
            name,
            price,
            ...(description ? { description } : {}),
            soldOut: false,
            ...(photo ? { image: await image(photo.file), featured: photo.featured } : {}),
          }
        }),
      ),
    })),
  )
}

async function main() {
  console.log(DRY ? 'DRY RUN' : `Writing to ${projectId}/${dataset}`)
  let tx = client.transaction()

  // ── Hours & Closures: one source of truth, from the published hours.
  const period = (key: string, days: string[], opens: string, closes: string) => ({
    _key: key,
    _type: 'period',
    days,
    opens,
    closes,
  })
  const wk = ['mon', 'tue', 'wed', 'thu', 'fri']
  tx = tx.createIfNotExists({ _id: 'hours', _type: 'hours' })
  tx = tx.patch('hours', (p) =>
    p.set({
      services: [
        { _key: 'lunch', _type: 'service', name: 'Lunch', periods: [period('p0', wk, '11:30', '15:00')] },
        {
          _key: 'happy-hour',
          _type: 'service',
          name: 'Happy Hour',
          note: 'At the bar + on the patio',
          periods: [period('p0', wk, '15:00', '18:00')],
        },
        {
          _key: 'dinner',
          _type: 'service',
          name: 'Dinner',
          periods: [
            period('p0', ['mon', 'tue', 'wed'], '15:00', '21:30'),
            period('p1', ['thu'], '15:00', '22:00'),
            period('p2', ['fri'], '15:00', '23:00'),
            period('p3', ['sat'], '17:00', '23:00'),
            period('p4', ['sun'], '17:00', '20:00'),
          ],
        },
      ],
    }).setIfMissing({ closures: [] }),
  )

  // ── Menus.
  const menu = async (
    _id: string,
    title: string,
    order: number,
    services: string[],
    cover: string,
    intro: string | undefined,
    list: Section[],
    footnote?: string,
  ) => ({
    _id,
    _type: 'menu',
    title,
    slug: { _type: 'slug', current: _id.replace(/^menu-/, '') },
    order,
    hidden: false,
    services,
    image: await image(cover),
    ...(intro ? { intro } : {}),
    // Photos attach to the dinner + dessert dishes only, so a dish on two
    // menus is featured once.
    sections: await sections(list, _id === 'menu-dinner' || _id === 'menu-dessert'),
    ...(footnote ? { footnote } : {}),
  })

  tx = tx.createOrReplace(
    await menu(
      'menu-dinner',
      'Dinner',
      0,
      ['Dinner'],
      'mm-0925-02-burrata-cocktail.jpg',
      'Modern American cooking with California and Pacific influences.',
      DINNER,
      ALLERGY,
    ),
  )
  tx = tx.createOrReplace(
    await menu(
      'menu-lunch',
      'Lunch',
      1,
      ['Lunch'],
      'mm-0925-19-patio-pasta.jpg',
      'Close to the office, far from the desk.',
      LUNCH,
      ALLERGY,
    ),
  )
  tx = tx.createOrReplace(
    await menu(
      'menu-drinks',
      'Drinks',
      3,
      ['Lunch', 'Dinner'],
      'mm-0925-22-cocktail-lineup-banquette.jpg',
      'House cocktails, M+M spritzes, zero-proof pours, wine by the glass and beer.',
      DRINKS,
    ),
  )
  tx = tx.createOrReplace(
    await menu(
      'menu-dessert',
      'Dessert',
      4,
      ['Lunch', 'Dinner'],
      'mm-0925-00-creme-brulee-wide.jpg',
      undefined,
      DESSERT,
    ),
  )
  // Happy Hour keeps its 2026 items; link it to its service and match the
  // new menus' price style.
  const hh = await client.getDocument('menu-happy-hour')
  if (hh) {
    tx = tx.patch('menu-happy-hour', (p) =>
      p
        .set({
          order: 2,
          services: ['Happy Hour'],
          intro: 'At the bar and on the patio.',
          sections: (hh.sections as { items?: { price?: string }[] }[]).map((s) => ({
            ...s,
            items: (s.items ?? []).map((i) => ({ ...i, price: i.price?.replace(/^\$/, '') })),
          })),
        })
        .unset(['availability']),
    )
  }
  for (const id of ['menu-dinner', 'menu-lunch']) {
    // `availability` would override the computed hours line; clear it.
    tx = tx.patch(id, (p) => p.unset(['availability', 'pdf']))
  }

  // ── Happenings, per the 2026 menus' "weekly happenings" panel.
  tx = tx.patch('special-happy-hour', (p) =>
    p
      .set({
        service: 'Happy Hour',
        description: 'Snacks and sliders at the bar and on the patio.',
        ctaLabel: 'Happy hour menu',
        ctaUrl: '/menus/happy-hour',
      })
      .unset(['schedule']),
  )
  tx = tx.patch('special-chefs-tasting', (p) =>
    p.set({
      title: 'Chef’s Tasting Menu',
      kind: 'weekly',
      schedule: 'Saturday + Sunday dinner',
      description: 'A tasting menu from the kitchen, at dinner on Saturdays and Sundays.',
      ctaLabel: 'Reserve',
      ctaUrl: '/reservations',
    }),
  )
  tx = tx.createOrReplace({
    _id: 'special-beef-wellington',
    _type: 'special',
    kind: 'weekly',
    title: 'Beef Wellington',
    schedule: 'Friday + Saturday dinner',
    description: 'On the menu at dinner every Friday and Saturday.',
    ctaLabel: 'Reserve',
    ctaUrl: '/reservations',
    active: true,
    order: 3,
  })

  // ── Home page copy for the new layout.
  const band = await image('mm-0925-21-cocktail-lineup-wide.jpg')
  tx = tx.patch('homePage', (p) =>
    p.set({
      heroEyebrow: 'Modern American Restaurant · Buckhead, Atlanta',
      heroHeading: 'Fresh, inventive, *West Coast*–inspired cooking in the heart of Buckhead.',
      kitchenHeading: 'Signatures',
      barHeading: 'The Bar',
      barBody:
        'House cocktails, M+M spritzes, zero-proof pours and a curated wine list — with happy hour at the bar and on the patio.',
      eventsHeading: 'Private Dining & Events',
      eventsBody: 'From a working lunch to a full buyout, for 20 to 140 guests.',
      bandImage: band,
    }),
  )

  // ── Sister restaurants, as listed on the printed menus.
  tx = tx.patch('siteSettings', (p) =>
    p.set({
      relatedAccounts: [
        { _key: 'trevele', label: '@treveleatl', url: 'https://www.instagram.com/treveleatl' },
        { _key: 'zakia', label: '@zakiarestaurant', url: 'https://www.instagram.com/zakiarestaurant' },
      ],
    }),
  )

  if (DRY) {
    const ser = tx.serialize()
    console.log(`${ser.length} mutations prepared`)
    const dinner = ser.find(
      (m) => 'createOrReplace' in m && (m as { createOrReplace: { _id: string } }).createOrReplace._id === 'menu-dinner',
    )
    console.log(JSON.stringify(dinner, null, 1).slice(0, 2500))
    return
  }
  const res = await tx.commit({ visibility: 'sync' })
  console.log(`Committed — transaction ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
