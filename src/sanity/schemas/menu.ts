import { defineArrayMember, defineField, defineType } from 'sanity'

import { developerOnly } from '../access'

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
      description: 'The number only, as printed on the menu, e.g. 16 (no $). Use "MP" for market price.',
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
      hidden: developerOnly,
      type: 'string',
      description: 'e.g. Dinner, Lunch, Happy Hour',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      hidden: developerOnly,
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      hidden: developerOnly,
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first in the menu switcher.',
      initialValue: 0,
    }),
    defineField({
      name: 'hidden',
      hidden: developerOnly,
      title: 'Hide from website',
      type: 'boolean',
      description:
        'Takes the menu off the site without deleting it — for a seasonal menu or a service that is paused.',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      hidden: developerOnly,
      title: 'Cover photograph',
      type: 'image',
      description: 'Shown on the Menus page, where guests pick a menu.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'services',
      hidden: developerOnly,
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
      hidden: developerOnly,
      title: 'Served — custom wording (optional)',
      type: 'string',
      description: 'Leave blank to show the hours automatically.',
    }),
    // The menu itself: the restaurant updates a menu by uploading the new PDF
    // from its designer — nothing to retype, line by line or anywhere else.
    defineField({
      name: 'pdf',
      title: 'Menu PDF',
      type: 'file',
      description:
        'To update this menu, upload the new PDF here and press Publish. The website shows it within a minute.',
      options: { accept: '.pdf,application/pdf' },
      validation: (r) => r.warning('Upload the menu PDF so guests can read this menu.').required(),
    }),
    defineField({
      name: 'intro',
      hidden: developerOnly,
      type: 'text',
      rows: 2,
      description: 'Optional line under the title — e.g. "With cocktails, wine, beer and desserts."',
    }),
    // Retired when the PDF became the menu (the data is kept, just hidden).
    defineField({
      name: 'sections',
      type: 'array',
      hidden: true,
      of: [defineArrayMember({ type: 'menuSection' })],
    }),
    defineField({
      name: 'footnote',
      type: 'text',
      rows: 2,
      hidden: true,
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
    select: { title: 'title', file: 'pdf.asset.originalFilename', hidden: 'hidden', media: 'image' },
    prepare: ({ title, file, hidden, media }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: file ? `PDF: ${file}` : 'No PDF yet',
      media,
    }),
  },
})

export const menuSchemas = [menu, menuSection, menuItem]
