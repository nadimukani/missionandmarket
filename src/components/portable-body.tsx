import type { PortableTextComponents } from 'next-sanity'

import { SanityImage } from './sanity-image'

/** Maps CMS rich text onto the design system so client edits can't drift
 *  outside it — there is no way to author an off-palette heading. */
export const PortableBody: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 font-display text-title text-ink first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-card text-ink first:mt-0">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l border-bronze pl-6 font-display text-subtitle text-ink italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-2 pl-5">{children}</ul>,
  },
  marks: {
    // A link mark published without a URL renders as plain text rather than
    // a dead "#" that scrolls the guest to the top of the page.
    link: ({ children, value }) =>
      value?.href ? (
        <a
          className="link"
          href={value.href}
          {...(/^https?:/.test(value.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      ) : (
        <span>{children}</span>
      ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <SanityImage image={value} width={1400} sizes="(min-width: 1024px) 60vw, 100vw" className="w-full" />
      </figure>
    ),
  },
}
