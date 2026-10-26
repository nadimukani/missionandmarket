import { defineArrayMember, defineField, defineType } from 'sanity'

export const DIETARY_TAGS = [
  { title: 'Vegetarian', value: 'vegetarian' },
  { title: 'Vegan', value: 'vegan' },
  { title: 'Gluten-free', value: 'gluten-free' },
  { title: 'Spicy', value: 'spicy' },
  { title: 'Raw', value: 'raw' },
  { title: 'Signature', value: 'signature' },
] as const

/**
 * Prices are strings, not numbers, on purpose. Real menus carry "MP",
 * "6 pc. $24 | 12 pc. $42" and "+$5" — forcing a number field would make the
 * client fight the CMS every time the oyster count changes.
 */
const menuItem = defineType({
  name: 'menuItem',
  title: 'Dish',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'The ingredient line, e.g. "Spicy Mango Chutney".',
    }),
    defineField({
      name: 'price',
      type: 'string',
      description: 'Include the $. Use "MP" for market price.',
    }),
    defineField({
      name: 'tags',
      title: 'Dietary tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: [...DIETARY_TAGS], layout: 'grid' },
    }),
    defineField({
      name: 'addOns',
      title: 'Add-ons',
      type: 'array',
      description: 'Per-dish supplements, e.g. "Add bacon +$5".',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'price', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'price' },
          },
        }),
      ],
    }),
    defineField({
      name: 'soldOut',
      title: 'Temporarily unavailable',
      type: 'boolean',
      description: 'Greys the dish out without deleting it.',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Photograph (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the home page',
      type: 'boolean',
      description:
        'Shows this dish, with its photograph, in "Signatures" on the home page. Edit or remove the dish here and the home page follows.',
      initialValue: false,
      hidden: ({ parent }) => !parent?.image,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price', desc: 'description', media: 'image', featured: 'featured', soldOut: 'soldOut' },
    prepare: ({ title, subtitle, desc, media, featured, soldOut }) => ({
      title: `${title}${featured ? '  ★' : ''}${soldOut ? '  (unavailable)' : ''}`,
      subtitle: [subtitle, desc].filter(Boolean).join(' — '),
      media,
    }),
  },
})

const menuSection = defineType({
  name: 'menuSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'e.g. Appetizers, Market Steaks, Sides',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'note',
      type: 'text',
      rows: 2,
      description:
        'Optional line under the heading, e.g. "Choose Sauce: Chimichurri, Whiskey, Green Peppercorn".',
    }),
    defineField({
      name: 'layout',
      type: 'string',
      description: 'Feature puts the section in a framed box — for a special like a dinner for two.',
      options: {
        list: [
          { title: 'List', value: 'list' },
          { title: 'Feature', value: 'feature' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'list',
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({ type: 'menuItem' })],
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({
      title,
      subtitle: `${items?.length ?? 0} dishes`,
    }),
  },
})

const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'e.g. Dinner, Lunch, Brunch, Dessert',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first in the menu switcher.',
      initialValue: 0,
    }),
    defineField({
      name: 'hidden',
      title: 'Hide from website',
      type: 'boolean',
      description:
        'Takes the menu off the site without deleting it — for a seasonal menu or a service that is paused.',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Cover photograph',
      type: 'image',
      description: 'Shown on the Menus page and at the top of this menu.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'services',
      title: 'Served during',
      type: 'array',
      description:
        'The menu page shows these hours straight from Hours & Closures, so they never go out of date.',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Lunch', value: 'Lunch' },
          { title: 'Happy Hour', value: 'Happy Hour' },
          { title: 'Dinner', value: 'Dinner' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'availability',
      title: 'Served — custom wording (optional)',
      type: 'string',
      description: 'Leave blank to show the hours automatically.',
    }),
    defineField({
      name: 'intro',
      type: 'text',
      rows: 3,
      description: 'Optional paragraph above the dishes.',
    }),
    defineField({
      name: 'sections',
      type: 'array',
      of: [defineArrayMember({ type: 'menuSection' })],
    }),
    defineField({
      name: 'footnote',
      type: 'text',
      rows: 2,
      description:
        'Allergen or gratuity notice printed at the bottom of the menu.',
    }),
    // Retired: an uploaded PDF drifts out of step with the web menu the
    // moment a price changes. The site now prints this menu from the same
    // data (/menus/<slug>/print), so there is one menu to keep up to date.
    defineField({
      name: 'pdf',
      title: 'Printable PDF (legacy)',
      type: 'file',
      hidden: true,
      options: { accept: '.pdf' },
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'availability', hidden: 'hidden' },
    prepare: ({ title, subtitle, hidden }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle,
    }),
  },
})

export const menuSchemas = [menu, menuSection, menuItem]
