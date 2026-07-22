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
  title: 'Special / Offer',
  type: 'document',
  description: 'Happy hour, wine nights, cocktail classes, prix fixe.',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'schedule',
      type: 'string',
      description: 'e.g. "Monday – Friday, 3 – 6pm" or "Every Saturday"',
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
    defineField({ name: 'ctaUrl', title: 'Button link', type: 'url' }),
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
    },
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
  ],
  orderings: [
    { title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'alt', subtitle: 'category', media: 'image' } },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImages',
      title: 'Hero images',
      type: 'array',
      description: 'One or more. Multiple images cross-fade automatically.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({ name: 'heroHeading', type: 'string' }),
    defineField({ name: 'heroSubheading', type: 'text', rows: 2 }),
    defineField({
      name: 'storyHeading',
      title: 'Story section heading',
      type: 'string',
    }),
    defineField({ name: 'storyBody', title: 'Story section body', type: 'richText' }),
    defineField({
      name: 'storyImage',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'bandImage',
      title: 'Full-width band image',
      type: 'image',
      options: { hotspot: true },
      description:
        'A wide, landscape photograph shown edge-to-edge between sections. Use the widest frame you have — it runs the full width of the screen.',
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'bandCaption',
      title: 'Band caption',
      type: 'string',
      description: 'Optional line set over the band image.',
    }),
    defineField({
      name: 'featuredDishes',
      title: 'Featured dishes',
      type: 'array',
      description: 'Three works best. Shown between the hero and the menus.',
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
              fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'description', media: 'image' } },
        }),
      ],
    }),
    seo,
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
