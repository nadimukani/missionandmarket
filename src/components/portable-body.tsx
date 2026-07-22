import type { PortableTextComponents } from 'next-sanity'

import { SanityImage } from './sanity-image'

/** Maps CMS rich text onto the design system so client edits can't drift
 *  outside it — there is no way to author an off-palette heading. */
export const PortableBody: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 font-display text-3xl first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-xl first:mt-0">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-ember pl-6 font-display text-xl italic">
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
    link: ({ children, value }) => {
      const href = value?.href ?? '#'
      const external = href.startsWith('http')
      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-brass underline underline-offset-4 hover:text-ink"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <SanityImage
          image={value}
          width={1400}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="w-full rounded-xs"
        />
        {value?.alt ? (
          <figcaption className="mt-3 font-sans text-xs text-current/60">
            {value.alt}
          </figcaption>
        ) : null}
      </figure>
    ),
  },
}
