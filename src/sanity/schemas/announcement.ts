import { defineField, defineType } from 'sanity'

/**
 * Singleton. The one-line banner across the top of every page — closures,
 * holiday hours, a buyout night. Its own Studio item rather than a field
 * buried in Restaurant Info, because "we're closed Thursday" is the edit a
 * manager makes in a hurry.
 *
 * The optional window means a notice can be scheduled ahead and comes down on
 * its own; nobody has to remember to switch it off the next morning.
 */
export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show the banner',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'message',
      type: 'string',
      description:
        'One short line, e.g. "Closed Thursday, November 26 for Thanksgiving."',
      validation: (r) =>
        r.max(140).custom((value, context) => {
          const enabled = (context.document as { enabled?: boolean })?.enabled
          return enabled && !value ? 'Add a message, or switch the banner off.' : true
        }),
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link text (optional)',
      type: 'string',
      description: 'e.g. "See holiday hours"',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link (optional)',
      type: 'url',
      description: 'A page on this site such as /visit, or a full web address.',
      validation: (r) =>
        r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
    defineField({
      name: 'startsAt',
      title: 'Start showing (optional)',
      type: 'datetime',
      description: 'Leave blank to show it as soon as it is published.',
    }),
    defineField({
      name: 'endsAt',
      title: 'Stop showing (optional)',
      type: 'datetime',
      description: 'The banner comes down by itself after this moment.',
    }),
  ],
  preview: {
    select: { enabled: 'enabled', message: 'message' },
    prepare: ({ enabled, message }) => ({
      title: 'Announcement Banner',
      subtitle: enabled ? message || 'On — no message yet' : 'Off',
    }),
  },
})
