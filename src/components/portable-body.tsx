import type { PortableTextComponents } from 'next-sanity'

import { TextLink } from '@/components/ui'

import { SanityImage } from './sanity-image'

/** Maps CMS rich text onto the design system so client edits can't drift
 *  outside it — there is no way to author an off-palette heading. */
export const PortableBody: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 font-display text-section first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-sub first:mt-0">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-brass pl-6 font-display text-xl italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5">{children}</ul>
    ),
  },
  marks: {
    // No `?? '#'`. The link annotation's href carries a scheme check but not
    // `.required()`, so an editor can apply a link mark and publish with no
    // URL — and TextLink already renders a plain <span> for a missing href.
    // Defaulting to '#' defeated that and shipped a control that scrolls the
    // guest back to the top of the page.
    link: ({ children, value }) => (
      <TextLink href={value?.href}>{children}</TextLink>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <SanityImage
          image={value}
          width={1400}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="w-full"
        />
        {value?.alt ? (
          // Not `text-current/60`: every consumer already wraps this in
          // `text-ink-muted` (65% ink), so 60% of that is 39% ink — about
          // 2.4:1 on paper. `text-ink-faint` is solved against the same ground
          // and holds 4.53:1.
          <figcaption className="mt-3 font-sans text-xs text-ink-faint">
            {value.alt}
          </figcaption>
        ) : null}
      </figure>
    ),
  },
}
