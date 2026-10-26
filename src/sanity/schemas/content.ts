import { defineArrayMember, defineField, defineType } from 'sanity'

/** Shared rich-text type. Deliberately narrow — no headings above H2, no
 *  arbitrary colours. Keeps client edits inside the design system. */
export const richText = defineType({
  name: 'richText',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Body', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                validation: (r) =>
                  r.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
  ],
})

const seo = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Overrides the page title in Google. ~60 characters.',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      description: '~155 characters.',
    }),
    defineField({ name: 'image', type: 'image' }),
  ],
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'richText' }),
    seo,
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})

export const special = defineType({
  name: 'special',
  title: 'Happening',
  type: 'document',
  description:
    'Happy hour, tastings, holiday parties, one-night events. Shown on the Happenings page and the home page.',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'kind',
      type: 'string',
      description: 'Sets the small label on the card.',
      options: {
        list: [
          { title: 'Every week', value: 'weekly' },
          { title: 'Seasonal', value: 'seasonal' },
          { title: 'One-time event', value: 'event' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'weekly',
    }),
    defineField({
      name: 'service',
      title: 'Use the hours of',
      type: 'string',
      description:
        'Optional. Pick a service and the card shows its hours from Hours & Closures — e.g. Happy Hour.',
      options: {
        list: [
          { title: 'Lunch', value: 'Lunch' },
          { title: 'Happy Hour', value: 'Happy Hour' },
          { title: 'Dinner', value: 'Dinner' },
        ],
      },
    }),
    defineField({
      name: 'schedule',
      type: 'string',
      description: 'e.g. "Saturday + Sunday dinner". Not needed if you picked a service above.',
    }),
    defineField({
      name: 'startDate',
      title: 'Event date (optional)',
      type: 'date',
      description: 'For one-time events. Upcoming events sort by this date.',
    }),
    defineField({
      name: 'endDate',
      title: 'Hide after (optional)',
      type: 'date',
      description:
        'The card comes off the site by itself after this date — no need to remember to switch it off.',
    }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'price', type: 'string' }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      description: 'Leave blank to show the standard Reserve button.',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Button link',
      type: 'url',
      description: 'A page on this site such as /private-events, or a full web address.',
      validation: (r) =>
        r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
    defineField({
      name: 'active',
      title: 'Show on site',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide without deleting — useful for seasonal offers.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'schedule', media: 'image', active: 'active' },
    prepare: ({ title, subtitle, media, active }) => ({
      title: active ? title : `${title} (hidden)`,
      subtitle,
      media,
    }),
  },
})

export const person = defineType({
  name: 'person',
  title: 'Team',
  type: 'document',
  description: 'Chefs, owners and leadership shown on the About page.',
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      description: 'As it should appear in print, e.g. "Paul Smith".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'displayName',
      title: 'Display name',
      type: 'string',
      description:
        'Optional. How guests refer to them, e.g. "Chef Paul". Falls back to the full name.',
    }),
    defineField({
      name: 'role',
      title: 'Title',
      type: 'string',
      description: 'e.g. Executive Chef, Chef de Cuisine, Partner',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'portrait',
      type: 'image',
      options: { hotspot: true },
      description:
        'A portrait. Set the hotspot on the face so crops never cut the head.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the person and setting for screen-reader users.',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'richText',
    }),
    defineField({
      name: 'quote',
      title: 'Pull quote',
      type: 'text',
      rows: 3,
      description:
        'Optional. One line in their own words, set large beside the portrait.',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the About page',
      type: 'boolean',
      description:
        'Featured people get the full-width editorial treatment. Others appear in a compact row.',
      initialValue: false,
    }),
    defineField({
      name: 'hidden',
      title: 'Hide from website',
      type: 'boolean',
      description: 'Keeps the profile in the Studio but off the site.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'portrait',
      hidden: 'hidden',
    },
    prepare: ({ title, subtitle, media, hidden }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle,
      media,
    }),
  },
})

export const pressItem = defineType({
  name: 'pressItem',
  title: 'Press',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'publication',
      type: 'string',
      description: 'e.g. Atlanta Journal-Constitution',
    }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'url', type: 'url' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'logo', title: 'Publication logo', type: 'image' }),
  ],
  orderings: [
    { title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'publication', media: 'logo' } },
})

export const jobPosting = defineType({
  name: 'jobPosting',
  title: 'Job Opening',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'employmentType',
      type: 'string',
      options: { list: ['Full-time', 'Part-time', 'Seasonal'] },
    }),
    defineField({
      name: 'department',
      type: 'string',
      options: { list: ['Front of House', 'Back of House', 'Management', 'Bar'] },
    }),
    defineField({ name: 'description', type: 'richText' }),
    defineField({
      name: 'applyUrl',
      title: 'Apply link',
      type: 'url',
      description: 'Leave blank to use the careers email.',
    }),
    defineField({ name: 'open', title: 'Currently hiring', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'department', open: 'open' },
    prepare: ({ title, subtitle, open }) => ({
      title: open ? title : `${title} (closed)`,
      subtitle,
    }),
  },
})

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the photo for guests using a screen reader.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['Food', 'Drinks', 'Space', 'Patio', 'Private Dining', 'Team'] },
    }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 0 }),
    defineField({
      name: 'hidden',
      title: 'Hide from website',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'alt', subtitle: 'category', media: 'image', hidden: 'hidden' },
    prepare: ({ title, subtitle, media, hidden }) => ({
      title: hidden ? `(hidden) ${title}` : title,
      subtitle,
      media,
    }),
  },
})

const altField = defineField({ name: 'alt', type: 'string', title: 'Alt text' })

const photo = (name: string, title: string, description?: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    group,
    description,
    options: { hotspot: true },
    fields: [altField],
  })

/**
 * Singleton. Every block on the home page has its words here so the client can
 * re-voice the page without us. All fields are optional — the page renders a
 * sensible default for anything left blank, so a half-filled document never
 * produces a broken layout.
 *
 * The motion in the hero comes from the shoot's reels, which are encoded for
 * the web and shipped with the site rather than uploaded here: a raw phone or
 * camera file dropped into a CMS field would not play in most browsers.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Opening', default: true },
    { name: 'intro', title: 'Introduction' },
    { name: 'kitchen', title: 'Kitchen' },
    { name: 'bar', title: 'Bar' },
    { name: 'events', title: 'Private dining' },
    { name: 'patio', title: 'Patio' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Line under the logo',
      type: 'string',
      group: 'hero',
      description:
        'Short and descriptive — it is also the page headline Google reads, e.g. "Modern American Restaurant · Buckhead, Atlanta".',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Introduction headline',
      type: 'string',
      group: 'intro',
      description: 'Wrap a word in *asterisks* to set it in italics.',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Short description (search + sharing)',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({ name: 'ticker', type: 'array', hidden: true, of: [defineArrayMember({ type: 'string' })] }),
    defineField({
      name: 'heroImages',
      title: 'Opening photographs',
      type: 'array',
      group: 'hero',
      description:
        'Shown in place of the video for visitors who have reduced motion switched on, and while the video loads.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [altField],
        }),
      ],
    }),

    defineField({
      name: 'storyHeading',
      title: 'Introduction (legacy)',
      type: 'string',
      group: 'intro',
      hidden: true,
    }),
    defineField({ name: 'storyBody', title: 'Introduction body', type: 'richText', group: 'intro' }),
    photo('storyImage', 'Introduction photograph', undefined, 'intro'),

    defineField({
      name: 'kitchenHeading',
      title: 'Signatures heading',
      type: 'string',
      group: 'kitchen',
      description: 'Shown above the Signature dishes below.',
    }),
    defineField({
      name: 'signatureDishes',
      title: 'Signature dishes',
      type: 'array',
      group: 'kitchen',
      description:
        'A few dishes with a photograph, shown on the home page. Take a dish off this list when it leaves the menu.',
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Photograph',
              type: 'image',
              options: { hotspot: true },
              fields: [altField],
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'menu',
              title: 'On the menu',
              type: 'reference',
              to: [{ type: 'menu' }],
              description: 'Tapping the dish opens this menu.',
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'description', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'featuredDishes',
      title: 'Featured dishes (legacy)',
      type: 'array',
      group: 'kitchen',
      hidden: true,
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'description', type: 'string' }),
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              fields: [altField],
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'description', media: 'image' } },
        }),
      ],
    }),

    defineField({ name: 'barHeading', title: 'Bar heading', type: 'string', group: 'bar' }),
    defineField({ name: 'barBody', title: 'Bar text', type: 'text', rows: 3, group: 'bar' }),
    photo('barImage', 'Bar photograph', undefined, 'bar'),

    defineField({
      name: 'eventsHeading',
      title: 'Private dining heading',
      type: 'string',
      group: 'events',
    }),
    defineField({
      name: 'eventsBody',
      title: 'Private dining text',
      type: 'text',
      rows: 3,
      group: 'events',
    }),
    photo('eventsImage', 'Private dining photograph', undefined, 'events'),

    defineField({ name: 'patioHeading', title: 'Patio heading', type: 'string', group: 'patio' }),
    defineField({ name: 'patioBody', title: 'Patio text', type: 'text', rows: 3, group: 'patio' }),
    defineField({
      name: 'patioImages',
      title: 'Patio photographs',
      type: 'array',
      group: 'patio',
      description: 'Two or three.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [altField],
        }),
      ],
    }),

    defineField({
      name: 'bandImage',
      title: 'Wide photograph for the seasonal band',
      type: 'image',
      group: 'events',
      description: 'A landscape photograph. Shown behind the seasonal happening (e.g. holiday parties).',
      options: { hotspot: true },
      fields: [altField],
    }),
    defineField({
      name: 'bandCaption',
      title: 'Band caption (legacy)',
      type: 'string',
      hidden: true,
    }),
    { ...seo, group: 'seo' },
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
