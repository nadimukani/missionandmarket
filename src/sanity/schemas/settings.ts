import { defineArrayMember, defineField, defineType } from 'sanity'

import { developerOnly } from '../access'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/**
 * Singleton. The Studio pins this to one document — see structure.ts.
 * Everything a guest needs to find, call, or book the restaurant lives here so
 * the client never has to ask us to change a phone number.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Restaurant Info',
  type: 'document',
  readOnly: developerOnly,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact & Location' },
    { name: 'hours', title: 'Hours (moved)', hidden: true },
    { name: 'booking', title: 'Reservations & Ordering' },
    { name: 'menus', title: 'Menu notices' },
    { name: 'social', title: 'Social' },
    { name: 'seo', title: 'SEO' },
    { name: 'integrations', title: 'Integrations' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Restaurant name',
      type: 'string',
      group: 'identity',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      group: 'identity',
      description: 'e.g. "Flavor + Fusion"',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'identity',
      description:
        'One or two sentences. Used in search results and social previews.',
    }),

    defineField({
      name: 'phone',
      type: 'string',
      group: 'contact',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'email', type: 'string', group: 'contact' }),
    defineField({
      name: 'address',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'street', type: 'string' }),
        defineField({ name: 'street2', title: 'Suite / Floor', type: 'string' }),
        defineField({ name: 'city', type: 'string' }),
        defineField({ name: 'state', type: 'string' }),
        defineField({ name: 'zip', title: 'ZIP', type: 'string' }),
      ],
    }),
    defineField({
      name: 'neighborhood',
      type: 'string',
      group: 'contact',
      description: 'e.g. Buckhead. Used in page titles for local search.',
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Google Maps link',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'parkingNote',
      title: 'Parking & directions',
      type: 'text',
      rows: 3,
      group: 'contact',
      description:
        'Guests ask this more than anything else. Mention valet and self-park validation.',
    }),

    // Superseded by the "Hours & Closures" singleton (hours.ts). Hidden; kept
    // readable for the pre-redesign build.
    defineField({
      name: 'hours',
      title: 'Service hours (legacy)',
      type: 'array',
      group: 'hours',
      hidden: true,
      description:
        'One row per service. Group days that share hours, e.g. "Monday – Wednesday".',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'service',
              type: 'string',
              description: 'Lunch, Dinner, Happy Hour, Bar',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'days',
              type: 'string',
              description: 'e.g. "Monday – Friday"',
            }),
            defineField({ name: 'time', type: 'string', description: 'e.g. "11:30am – 3:00pm"' }),
          ],
          preview: {
            select: { title: 'service', days: 'days', time: 'time' },
            prepare: ({ title, days, time }) => ({
              title,
              subtitle: [days, time].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'machineHours',
      title: 'Structured hours for Google (legacy)',
      type: 'array',
      group: 'hours',
      hidden: true,
      description:
        'Powers the rich result in Google Search. Use 24-hour times. Keep in sync with the rows above.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              type: 'string',
              options: { list: DAYS },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'opens', type: 'string', description: '18:00' }),
            defineField({ name: 'closes', type: 'string', description: '22:00' }),
          ],
          preview: {
            select: { title: 'day', opens: 'opens', closes: 'closes' },
            prepare: ({ title, opens, closes }) => ({
              title,
              subtitle: `${opens ?? '?'} – ${closes ?? '?'}`,
            }),
          },
        }),
      ],
    }),
    // Superseded by the "Announcement Banner" singleton (announcement.ts),
    // which the Studio surfaces as its own item. Kept, hidden, so the data
    // stays readable by the pre-redesign build until it is retired.
    defineField({
      name: 'holidayNotice',
      title: 'Temporary notice (legacy)',
      type: 'object',
      group: 'hours',
      hidden: true,
      description:
        'Shows a banner sitewide. Use for holiday closures, private buyouts, weather.',
      fields: [
        defineField({ name: 'enabled', type: 'boolean', initialValue: false }),
        defineField({ name: 'message', type: 'string' }),
        defineField({ name: 'linkLabel', type: 'string' }),
        defineField({ name: 'linkUrl', type: 'url' }),
      ],
    }),

    defineField({
      name: 'openTableRid',
      title: 'OpenTable restaurant ID',
      type: 'string',
      group: 'booking',
      description:
        'The numeric rid from your OpenTable account. Drives the booking widget everywhere on the site.',
    }),
    defineField({
      name: 'openTableUrl',
      title: 'OpenTable profile URL',
      type: 'url',
      group: 'booking',
      description: 'Fallback link if a guest blocks the embedded widget.',
    }),
    defineField({
      name: 'largePartyNote',
      title: 'Large party note',
      type: 'string',
      group: 'booking',
      description:
        'Shown beside the booking form, e.g. "Parties of 9 or more, please call us."',
    }),
    defineField({
      name: 'orderUrl',
      title: 'Online ordering (Toast)',
      type: 'url',
      group: 'booking',
    }),
    defineField({
      name: 'giftCardUrl',
      title: 'Gift cards (Toast)',
      type: 'url',
      group: 'booking',
    }),
    defineField({
      name: 'privateEventsEmail',
      title: 'Private events inquiries email',
      type: 'string',
      group: 'booking',
    }),

    defineField({
      name: 'social',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  'Instagram',
                  'Facebook',
                  'X',
                  'TikTok',
                  'YouTube',
                  'Google',
                  'Yelp',
                  'Tripadvisor',
                ],
              },
            }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),

    defineField({
      name: 'relatedAccounts',
      title: 'Sister restaurants on Instagram',
      type: 'array',
      group: 'social',
      description: 'Listed in the footer, as on the printed menus.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', description: 'e.g. @treveleatl' }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),

    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      group: 'seo',
      description: '1200×630. Shown when the site is linked on social or texted.',
    }),

    defineField({
      name: 'allergenNotice',
      title: 'Allergen notice',
      type: 'text',
      rows: 3,
      group: 'menus',
      description:
        'Shown under every menu on the website. Georgia requires telling guests in writing which of the nine major allergens are in the food (milk, eggs, fish, shellfish, tree nuts, wheat, peanuts, soy, sesame — naming the type of fish, shellfish or nut), e.g. "The following major food allergens are used as ingredients: …"',
    }),
    defineField({
      name: 'rawFoodNotice',
      title: 'Raw or undercooked notice',
      type: 'text',
      rows: 3,
      group: 'menus',
      description:
        'Shown under every menu. Dishes served raw or undercooked must also carry an asterisk on the menu PDF itself.',
    }),
    defineField({
      name: 'tripleseatLeadFormId',
      title: 'Tripleseat lead form ID',
      type: 'string',
      group: 'integrations',
      description:
        'From the Tripleseat embed code (lead_form_id=…). Powers the private events inquiry form.',
    }),
    defineField({
      name: 'tripleseatPublicKey',
      title: 'Tripleseat public key',
      type: 'string',
      group: 'integrations',
      description:
        'From the same embed code (public_key=…). This key is designed to be public — it is visible in the page source of any site that embeds the form.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Restaurant Info' }),
  },
})
