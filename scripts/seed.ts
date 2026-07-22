/**
 * Seeds the Sanity dataset with the content migrated from the existing
 * WordPress site (menus, hours, contact details, page copy).
 *
 * Idempotent: every document has a fixed _id and is written with createOrReplace,
 * so re-running overwrites rather than duplicating.
 *
 *   pnpm seed
 *
 * Requires SANITY_API_WRITE_TOKEN with Editor permissions:
 *   https://www.sanity.io/manage/project/x2izrrun/api
 */
import {
  createClient,
  type IdentifiedSanityDocumentStub,
} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) throw new Error('Missing Sanity project env vars')
if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-07-22',
  useCdn: false,
})

type Item = {
  name: string
  description?: string
  price?: string
  addOns?: { label: string; price: string }[]
}

const item = (
  name: string,
  description?: string,
  price?: string,
  addOns?: { label: string; price: string }[],
): Item => ({ name, description, price, addOns })

const section = (title: string, items: Item[], note?: string) => ({
  _type: 'menuSection',
  _key: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title,
  note,
  items: items.map((i, idx) => ({
    _type: 'menuItem',
    _key: `${i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}`,
    ...i,
    addOns: i.addOns?.map((a, ai) => ({ _key: `addon-${ai}`, ...a })),
  })),
})

const dinner = {
  _id: 'menu-dinner',
  _type: 'menu',
  title: 'Dinner',
  slug: { _type: 'slug', current: 'dinner' },
  order: 1,
  availability: 'Monday – Sunday, from 3:00pm',
  sections: [
    section('Appetizers', [
      item('Yuzu Tempura Shrimp', 'Spicy Mango Chutney', '$19'),
      item('Oysters', 'Mignonette, Cocktail Sauce', '6 pc. $24 · 12 pc. $42'),
      item('Fry Farm Kale + Artichoke Dip', 'Cashew Cream, Crispy Pita Chips', '$18'),
      item('Margherita Pizza', 'Tomato, Mozzarella, Basil', '$15'),
      item('Pepperoni Pizza', 'Tomato, Mozzarella, Parsley', '$18'),
      item('Yellowfin Tuna Tartar', 'Avocado, Ginger Dressing', '$23'),
      item('Grilled Spanish Octopus', 'Hazelnut Romesco', '$21'),
      item('Burrata', 'Heirloom Cherry Tomatoes, Aged Raspberry Balsamic', '$19'),
      item('Mediterranean Hummus', 'Blistered Red Peppers', '$15'),
      item('Jumbo Lump Crab Cake', 'Lemon Mustard Sauce', '$21'),
    ]),
    section('Soup', [item('Creamy Lobster Bisque', undefined, '$15')]),
    section('Salads', [
      item('Romaine Caesar', 'Ciabatta Croutons, Parmigiano-Reggiano, Anchovies Per Request', '$16'),
      item('Local Kale Salad', 'Local Peaches + Mangos, Candied Ginger, Goat Cheese, Spiced Honey Lime Dressing', '$17'),
      item('Market Salad', 'Shaved Vegetables, Toasted Pumpkin Seeds', '$15'),
      item('Chopped Salad', 'Romaine, Cucumber, Asparagus, Cherry Tomatoes, Hard Boiled Egg, Blue Cheese Dressing', '$17'),
      item('Hearts of Palm', 'Spicy Peanut Dressing', '$24'),
      item('Roasted Local Beets', 'Goat Cheese Panna Cotta, Pistachio Oil', '$19'),
    ]),
    section('Pasta', [
      item('Wild Mushroom Pasta', 'Fresh Pasta, Parmesan Cream', '$24'),
      item('Bolognese', 'Beef + Pork, Fresh Rigatoni', '$26'),
      item('Spinach + Ricotta Tortellini', 'Wilted Spinach, Brown Butter', '$21'),
      item('Lobster Fettuccine', 'Lobster Cream, Asparagus', '$44'),
    ]),
    section('Entrées', [
      item('Pistachio Crusted Halibut', 'Vegetables, Pistachio Pesto', '$47'),
      item('Oven Roasted Salmon Steak', 'Spinach Scented Rice Grits, Vegetables', '$33'),
      item('Seared Black Sea Bass', 'Beet Raita, Roasted Vegetables, Shaved Fennel', '$39'),
      item('Seared Sea Scallops', 'Ancient Blue Tree Rice, Porcini, Vegetables', '$46'),
      item('Herb Roasted Chicken', 'Tomato Risotto, Natural Jus', '$29'),
      item('Ginger Marinated Duck Steak', 'Coconut Panang Curry, China Black Rice', '$42'),
      item('Grilled Market Burger', 'American Cheese, Lettuce, Tomato, Pickles, M+M Sauce', '$23', [
        { label: 'Add bacon', price: '+$5' },
      ]),
    ]),
    section(
      'Market Steaks',
      [
        item('10 oz. Prime NY Strip', undefined, '$56'),
        item('8 oz. Filet Mignon', undefined, '$59'),
        item('10 oz. Prime Ribeye', undefined, '$72'),
      ],
      'Choose a sauce: Chimichurri, U.S.A. Whiskey Sauce, Green Peppercorn. Choose a side: Truffle Fries, Gnocchi + Wild Mushrooms, Roasted Potatoes.',
    ),
    section('Sides', [
      item('Gnocchi + Wild Mushrooms', undefined, '$10'),
      item('Vegetables', undefined, '$9'),
      item('Roasted Potatoes', undefined, '$9'),
      item('French Fries', undefined, '$8'),
      item('Truffle Fries', undefined, '$10'),
    ]),
  ],
}

const lunch = {
  _id: 'menu-lunch',
  _type: 'menu',
  title: 'Lunch',
  slug: { _type: 'slug', current: 'lunch' },
  order: 2,
  availability: 'Monday – Friday, 11:30am – 3:00pm',
  sections: [
    section('Appetizers', [
      item('Yuzu Tempura Shrimp', 'Spicy Mango Chutney', '$19'),
      item('Fry Farm Kale + Artichoke Dip', 'Cashew Cream, Crispy Pita Chips', '$18'),
      item('Grilled Spanish Octopus', 'Hazelnut Romesco', '$21'),
      item('Burrata', 'Heirloom Cherry Tomatoes, Aged Raspberry Balsamic', '$19'),
      item('Mediterranean Hummus', 'Blistered Red Peppers', '$15'),
      item('Jumbo Lump Crab Cake', 'Lemon Mustard Sauce', '$21'),
    ]),
    section('Soup', [
      item('Creamy Lobster Bisque', undefined, '$15'),
      item('Soup of the Day', undefined, '$9'),
    ]),
    section(
      'Sandwiches',
      [
        item('Grilled Chicken Sandwich', 'Lettuce, Tomato, Chipotle Mayo', '$18'),
        item('Smoked Brisket Sandwich', 'Mustard, Mayonnaise, Rocket, Asiago Cheese', '$20'),
        item('Impossible Burger', 'Asiago Cheese, Sliced Avocado, Pickled Red Onions', '$21'),
        item('Grilled Market Burger', 'American Cheese, Lettuce, Tomato, Pickles, M+M Sauce', '$19'),
        item('Seared Tuna Sandwich', 'Wasabi Mayo, Seaweed Salad', '$23'),
      ],
      'Served with fries or salad, +$5.',
    ),
    section(
      'Pizza',
      [
        item('Margherita', 'Tomato, Fresh Mozzarella, Basil', '$15'),
        item('Pepperoni', 'Tomato, Fresh Mozzarella, Parsley', '$18'),
        item("Jenn's Wild Mushroom", 'Five Nut Pesto, Burrata, Arugula', '$20'),
      ],
      'Add fries or salad, +$5.',
    ),
    section(
      'Salads + Bowls',
      [
        item('Romaine Caesar', 'Ciabatta Croutons, Parmigiano-Reggiano, Anchovies Per Request', '$16'),
        item('Local Kale Salad', 'Local Peaches + Mangos, Candied Ginger, Goat Cheese, Spiced Honey Lime', '$17'),
        item('Market Salad', 'Shaved Vegetables, Toasted Pumpkin Seeds', '$15'),
        item('Chopped Salad', 'Romaine, Cucumber, Asparagus, Cherry Tomatoes, Hard Boiled Egg, Blue Cheese', '$17'),
        item('Fresh Hearts of Palm Salad', 'Spicy Peanut Dressing', '$24'),
        item('Roasted Local Beets', 'Goat Cheese Panna Cotta, Pistachio Oil', '$19'),
        item('Warm Quinoa + Brown Rice', 'Vegetables, Peanut Agrodolce', '$18'),
        item('China Black Rice', 'Kale, Spiced Coconut Panang Curry', '$19'),
        item('Chilled Rice Noodles', 'Green Papaya, Ginger Soy Dressing', '$17'),
      ],
      'Add-ons: Branzino +$22 · Atlantic Salmon +$15 · Chargrilled Chicken +$9 · Shrimp +$13 · Scallops +$23',
    ),
    section('Pasta', [
      item('Wild Mushroom Pasta', 'Fresh Pasta, Parmesan Cream', '$24'),
      item('Bolognese', 'Beef + Pork, Fresh Rigatoni', '$26'),
      item('English Pea + Ricotta Tortellini', 'Wilted Spinach, Brown Butter', '$21'),
    ]),
    section('Entrées', [
      item('Oven Roasted Salmon Steak', 'Spinach Scented Rice Grits, Vegetables', '$33'),
      item('Seared Black Sea Bass', 'Beet Raita, Roasted Vegetables, Shaved Fennel', '$39'),
      item('Herb Roasted Chicken', 'Tomato Risotto, Natural Jus', '$29'),
    ]),
  ],
}

const brunch = {
  _id: 'menu-brunch',
  _type: 'menu',
  title: 'Brunch',
  slug: { _type: 'slug', current: 'brunch' },
  order: 3,
  availability: 'Saturday & Sunday, 11:00am – 3:00pm',
  sections: [
    section('Appetizers', [
      item('Yuzu Tempura Shrimp', 'Spicy Mango Chutney', '$19'),
      item('Everything Spiced Avocado Toast', 'Shaved Vegetables, Poached Eggs, Pita', '$14'),
      item('Mediterranean Hummus', 'Blistered Red Peppers', '$15'),
    ]),
    section(
      'Entrées',
      [
        item('French Toast', 'Creamy Nutella Cremoso', '$26'),
        item('Chicken + Waffles', 'Korean Style Fried Chicken, Maple Syrup, Sambal Sauce', '$26'),
        item('Blueberry Pancakes', 'Vanilla Whipped Cream', '$15'),
        item('Shrimp + Grits', 'Pistachio Pesto, Tomato, Spinach', '$26'),
        item('American Breakfast', 'Two Eggs Your Way, Home Fries, Bacon, Toast', '$20'),
        item('Omelette', 'Ham, Gruyère + Tomato', '$19'),
        item('Crab Cake Benedict', 'Pickled Jalapeño Hollandaise', '$24'),
        item('Smoked Salmon Benedict', 'Poached Eggs, English Muffin, Caper Hollandaise', '$20'),
        item('Pine St. Chicken Sausage + Egg Scramble', 'Roasted Vegetables, Chimichurri', '$19'),
      ],
      'Supplements, each +$6: Toast and Jam · Side Salad · Anson Mill Grits · Fried Eggs · Home Fries · Pine St. Bacon',
    ),
  ],
}

const settings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  name: 'Mission + Market',
  tagline: 'Flavor + Fusion',
  shortDescription:
    'Modern American cooking with California and Pacific Rim influence, in the heart of Buckhead. Lunch, brunch and dinner, a dynamic bar and lounge, and a heated patio.',
  phone: '404.948.2927',
  neighborhood: 'Buckhead',
  address: {
    street: '3550 Lenox Road NE',
    street2: 'Suite 550, Three Alliance Center',
    city: 'Atlanta',
    state: 'GA',
    zip: '30326',
  },
  parkingNote:
    'Complimentary valet, plus up to three hours of free self-parking in the Three Alliance Center deck.',
  hours: [
    { _key: 'lunch', service: 'Lunch', days: 'Monday – Friday', time: '11:30am – 3:00pm' },
    { _key: 'brunch', service: 'Brunch', days: 'Saturday & Sunday', time: '11:00am – 3:00pm' },
    { _key: 'dinner-mw', service: 'Dinner', days: 'Monday – Wednesday', time: '3:00pm – 9:30pm' },
    { _key: 'dinner-th', service: 'Dinner', days: 'Thursday', time: '3:00pm – 10:00pm' },
    { _key: 'dinner-fr', service: 'Dinner', days: 'Friday', time: '3:00pm – 11:00pm' },
    { _key: 'dinner-sa', service: 'Dinner', days: 'Saturday', time: '5:00pm – 11:00pm' },
    { _key: 'dinner-su', service: 'Dinner', days: 'Sunday', time: '5:00pm – 8:00pm' },
    { _key: 'hh', service: 'Happy Hour', days: 'Monday – Friday', time: '3:00pm – 6:00pm' },
  ],
  machineHours: [
    { _key: 'mo', day: 'Monday', opens: '11:30', closes: '21:30' },
    { _key: 'tu', day: 'Tuesday', opens: '11:30', closes: '21:30' },
    { _key: 'we', day: 'Wednesday', opens: '11:30', closes: '21:30' },
    { _key: 'th', day: 'Thursday', opens: '11:30', closes: '22:00' },
    { _key: 'fr', day: 'Friday', opens: '11:30', closes: '23:00' },
    { _key: 'sa', day: 'Saturday', opens: '11:00', closes: '23:00' },
    { _key: 'su', day: 'Sunday', opens: '11:00', closes: '20:00' },
  ],
  openTableRid: '1005016',
  openTableUrl: 'https://www.opentable.com/r/mission-and-market-atlanta',
  largePartyNote: 'For parties of nine or more, please call us and we will take care of you.',
  orderUrl:
    'https://order.toasttab.com/online/mission-market-three-alliance-center-3550-lenox-rd-ne',
  giftCardUrl:
    'https://www.toasttab.com/mission-market-three-alliance-center-3550-lenox-rd-ne/giftcards',
  social: [
    { _key: 'ig', platform: 'Instagram', url: 'https://www.instagram.com/missionandmkt' },
    { _key: 'fb', platform: 'Facebook', url: 'https://www.facebook.com/missionandmkt' },
    {
      _key: 'ot',
      platform: 'Tripadvisor',
      url: 'https://www.tripadvisor.com/Restaurant_Review-g60898-d14020905-Reviews-Mission_Market-Atlanta_Georgia.html',
    },
  ],
}

const block = (text: string, key: string) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
})

const home = {
  _id: 'homePage',
  _type: 'homePage',
  heroHeading: 'Flavor + Fusion in the heart of Buckhead',
  heroSubheading:
    'Modern American cooking drawn from California, the Pacific Northwest and the Pacific Rim — served in a room built for long dinners.',
  storyHeading: 'A West Coast accent on a Buckhead corner',
  storyBody: [
    block(
      'Mission + Market brings modern American cuisine with California and Pacific influences to the lower level of Three Alliance Center. Chef Ian Winslade builds the menu around locally sourced ingredients and the seasons, alongside a dynamic bar and lounge, seasonal cocktails and a curated wine list.',
      'story-1',
    ),
    block(
      'The 5,300 square foot room opens onto a covered, heated patio with fire pits, and holds private dining spaces for everything from a working lunch to a full buyout.',
      'story-2',
    ),
  ],
}

const aboutPage = {
  _id: 'page-about',
  _type: 'page',
  title: 'About Mission + Market',
  slug: { _type: 'slug', current: 'about' },
  intro: 'Flavor + Fusion — modern American cooking in Buckhead, Atlanta.',
  body: [
    block(
      'Mission + Market sits on the lower level of Three Alliance Center in the heart of Buckhead, serving modern American cuisine with California and Pacific influences for lunch, brunch and dinner.',
      'about-1',
    ),
    block(
      'Chef Ian Winslade leads the kitchen, drawing on California, the Pacific Northwest and the Pacific Rim, with locally sourced ingredients at the centre of the menu. Signature dishes include grilled Spanish octopus and chilled red king crab.',
      'about-2',
    ),
    block(
      'The restaurant is a collaboration between Chef Winslade and Jonathan and Tony Akly, partners in other Atlanta establishments. The 5,300 square foot space includes a dynamic bar and lounge, a covered and heated patio with fire pits, and private dining areas.',
      'about-3',
    ),
  ],
}

const privateEventsPage = {
  _id: 'page-private-events',
  _type: 'page',
  title: 'Private Events',
  slug: { _type: 'slug', current: 'private-events' },
  intro:
    'Private dining rooms, patio buyouts and full restaurant takeovers in Buckhead.',
  body: [
    block(
      'Our private dining spaces host everything from working lunches and client dinners to rehearsal dinners, birthdays and holiday parties. The covered, heated patio with fire pits is available year round.',
      'pe-1',
    ),
    block(
      'Tell us the date, the headcount and the occasion, and our events team will build a menu around it.',
      'pe-2',
    ),
  ],
}

const specials = [
  {
    _id: 'special-happy-hour',
    _type: 'special',
    title: 'Happy Hour',
    schedule: 'Monday – Friday, 3:00 – 6:00pm',
    description:
      'Bar and lounge only. Cocktails, wines by the glass and a short list of bites.',
    active: true,
    order: 1,
  },
  {
    _id: 'special-half-price-wine',
    _type: 'special',
    title: 'Half-Priced Wine',
    schedule: 'Every Friday',
    description: 'Half off every bottle on the list, all evening.',
    active: true,
    order: 2,
  },
  {
    _id: 'special-cocktail-class',
    _type: 'special',
    title: 'Cocktail Classes',
    schedule: 'Saturdays',
    description:
      'Spend an hour behind the bar with our team, then keep what you make.',
    active: true,
    order: 3,
  },
  {
    _id: 'special-sunday-brunch',
    _type: 'special',
    title: 'Sunday Brunch Buffet',
    schedule: 'Sundays, 11:00am – 3:00pm',
    description: 'A full buffet alongside the à la carte brunch menu.',
    active: true,
    order: 4,
  },
]

async function seed() {
  const docs: IdentifiedSanityDocumentStub[] = [
    settings,
    home,
    dinner,
    lunch,
    brunch,
    aboutPage,
    privateEventsPage,
    ...specials,
  ]

  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction())
  await tx.commit()

  console.log(`Seeded ${docs.length} documents into ${projectId}/${dataset}`)
  console.log('Menus: dinner, lunch, brunch')
  console.log('\nStill needed from the client:')
  console.log('  · Photography (hero, featured dishes, gallery, story)')
  console.log('  · Dessert + drinks menus (image-only on the old site)')
  console.log('  · Reservations email / private events email')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
