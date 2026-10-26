import { defineArrayMember, defineField, defineType } from 'sanity'

import { adminOnly } from '../access'

const DAYS = [
  { title: 'Mon', value: 'mon' },
  { title: 'Tue', value: 'tue' },
  { title: 'Wed', value: 'wed' },
  { title: 'Thu', value: 'thu' },
  { title: 'Fri', value: 'fri' },
  { title: 'Sat', value: 'sat' },
  { title: 'Sun', value: 'sun' },
]

/** Quarter-hour choices, 6am through 2am, so nobody types a time by hand. */
const TIMES = (() => {
  const out: { title: string; value: string }[] = []
  for (let t = 6 * 60; t <= 26 * 60; t += 15) {
    const h24 = Math.floor(t / 60) % 24
    const m = t % 60
    const value = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const period = h24 >= 12 ? 'pm' : 'am'
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12
    const title =
      h24 === 0 && m === 0
        ? '12:00 am (midnight)'
        : h24 === 12 && m === 0
          ? '12:00 pm (noon)'
          : `${h12}:${String(m).padStart(2, '0')} ${period}`
    out.push({ title, value })
  }
  return out
})()

const time = (name: string, title: string) =>
  defineField({ name, title, type: 'string', options: { list: TIMES } })

/**
 * Singleton — the one place the restaurant's hours live. The website derives
 * everything from it: the hours in the footer and on Visit, the "Served"
 * line on each menu, "Open now", the booking times, Google's opening hours
 * and the closure banner. Change it here; it changes everywhere.
 */
export const hours = defineType({
  name: 'hours',
  title: 'Hours & Closures',
  type: 'document',
  fields: [
    defineField({
      name: 'services',
      title: 'Services',
      // The restaurant edits closures; regular hours stay with administrators.
      hidden: adminOnly,
      type: 'array',
      description:
        'Lunch, Happy Hour, Dinner… Add a row for each set of days that share the same hours.',
      of: [
        defineArrayMember({
          name: 'service',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              description: 'e.g. Lunch, Happy Hour, Dinner. Menus link to this name.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'note',
              type: 'string',
              description: 'Optional, e.g. "At the bar + on the patio".',
            }),
            defineField({
              name: 'periods',
              title: 'Days + times',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'period',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'days',
                      type: 'array',
                      of: [defineArrayMember({ type: 'string' })],
                      options: { list: DAYS, layout: 'grid' },
                      validation: (r) => r.required().min(1),
                    }),
                    time('opens', 'Opens'),
                    time('closes', 'Closes'),
                  ],
                  preview: {
                    select: { days: 'days', opens: 'opens', closes: 'closes' },
                    prepare: ({ days, opens, closes }) => ({
                      title: (days ?? [])
                        .map((d: string) => DAYS.find((x) => x.value === d)?.title)
                        .join(' '),
                      subtitle: `${TIMES.find((t) => t.value === opens)?.title ?? '?'} – ${
                        TIMES.find((t) => t.value === closes)?.title ?? '?'
                      }`,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'name', note: 'note', periods: 'periods' },
            prepare: ({ title, note, periods }) => ({
              title,
              subtitle: note || `${periods?.length ?? 0} set(s) of hours`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'closures',
      title: 'Closures + special hours',
      type: 'array',
      description:
        'Holidays, private buyouts, early closes. The site shows a banner beforehand, marks the day closed and stops offering it for booking.',
      of: [
        defineArrayMember({
          name: 'closure',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              description: 'e.g. Thanksgiving, Private event',
            }),
            defineField({ name: 'date', type: 'date', validation: (r) => r.required() }),
            defineField({
              name: 'endDate',
              title: 'Through (optional)',
              type: 'date',
              description: 'For closures longer than one day.',
            }),
            defineField({
              name: 'kind',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Closed all day', value: 'closed' },
                  { title: 'Special hours', value: 'special' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'closed',
            }),
            {
              ...time('opens', 'Opens'),
              hidden: ({ parent }: { parent?: { kind?: string } }) => parent?.kind !== 'special',
            },
            {
              ...time('closes', 'Closes'),
              hidden: ({ parent }: { parent?: { kind?: string } }) => parent?.kind !== 'special',
            },
            defineField({
              name: 'showBanner',
              title: 'Show a banner on the website',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'bannerDaysBefore',
              title: 'Start the banner this many days before',
              type: 'number',
              initialValue: 7,
              hidden: ({ parent }) => parent?.showBanner === false,
              validation: (r) => r.min(0).max(60).integer(),
            }),
            defineField({
              name: 'message',
              title: 'Banner wording (optional)',
              type: 'string',
              description: 'Leave blank and the site writes it, e.g. "Closed Thursday, November 26 — Thanksgiving".',
              hidden: ({ parent }) => parent?.showBanner === false,
            }),
          ],
          preview: {
            select: { label: 'label', date: 'date', kind: 'kind' },
            prepare: ({ label, date, kind }) => ({
              title: label || (kind === 'special' ? 'Special hours' : 'Closed'),
              subtitle: date,
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Hours & Closures' }) },
})
