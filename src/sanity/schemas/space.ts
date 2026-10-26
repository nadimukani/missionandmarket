import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A bookable room for private events. Capacity is the first thing a planner
 * filters on, so the two numbers are real fields — not prose — and render as
 * figures on the Private Dining page.
 */
export const space = defineType({
  name: 'space',
  title: 'Private Dining Room',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'e.g. Private Dining Room, Patio',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'bestFor',
      title: 'Best for',
      type: 'string',
      description: 'e.g. "Groups of 40 or fewer"',
    }),
    defineField({
      name: 'seated',
      title: 'Seated capacity',
      type: 'number',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'reception',
      title: 'Reception capacity',
      type: 'number',
      description: 'Standing / cocktail-style. Leave blank if not offered.',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'capacityNote',
      title: 'Capacity note',
      type: 'string',
      description: 'Optional, e.g. "Across two tables"',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'features',
      type: 'array',
      description: 'Short lines, e.g. "Floor-to-ceiling windows on two walls".',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'photos',
      type: 'array',
      description:
        'Photographs of this room. The first one leads. Without a photo the room shows as a text card.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
    }),
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
    select: {
      title: 'name',
      seated: 'seated',
      reception: 'reception',
      media: 'photos.0',
      hidden: 'hidden',
    },
    prepare: ({ title, seated, reception, media, hidden }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: [
        seated ? `${seated} seated` : null,
        reception ? `${reception} reception` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
