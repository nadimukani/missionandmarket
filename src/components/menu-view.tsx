import type { Menu, MenuItem } from '@/sanity/types'

import { TextLink } from '@/components/ui'

const TAG_LABEL: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
  spicy: 'Spicy',
  raw: 'Raw',
  signature: 'Signature',
}

function Dish({ item }: { item: MenuItem }) {
  return (
    <li className={item.soldOut ? 'opacity-45' : undefined}>
      <div className="flex items-baseline">
        <h3 className="font-display text-lg leading-snug text-ink">
          {item.name}
        </h3>
        <span className="menu-leader" aria-hidden="true" />
        {item.price ? (
          <span className="shrink-0 font-sans text-sm tabular-nums text-ink">
            {item.price}
          </span>
        ) : null}
      </div>

      {item.description ? (
        <p className="mt-1 max-w-prose font-sans text-sm leading-relaxed text-ink-muted">
          {item.description}
        </p>
      ) : null}

      {item.addOns?.length ? (
        <p className="mt-1 font-sans text-xs text-ink-faint">
          {item.addOns
            .map((a) => [a.label, a.price].filter(Boolean).join(' '))
            .join(' · ')}
        </p>
      ) : null}

      {(item.tags?.length || item.soldOut) ? (
        <p className="mt-2 flex flex-wrap gap-2">
          {item.soldOut ? (
            <span className="eyebrow rounded-full border border-ink/20 px-2 py-0.5 text-ink-faint">
              Unavailable
            </span>
          ) : null}
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="eyebrow rounded-full border border-moss/40 px-2 py-0.5 text-moss"
            >
              {TAG_LABEL[tag] ?? tag}
            </span>
          ))}
        </p>
      ) : null}
    </li>
  )
}

export function MenuView({ menu }: { menu: Menu }) {
  return (
    <article>
      {menu.intro ? (
        <p className="mx-auto max-w-2xl text-center font-sans text-base leading-relaxed text-ink-muted">
          {menu.intro}
        </p>
      ) : null}

      {/* Two columns on wide screens reads like a printed menu and halves the
          scroll depth; sections never split across the gap. */}
      <div className="mt-14 gap-x-16 lg:columns-2">
        {menu.sections?.map((section) => (
          <section
            key={section.title}
            className="mb-14 break-inside-avoid-column"
          >
            <h2 className="eyebrow border-b border-ink/15 pb-3 text-brass">
              {section.title}
            </h2>
            {section.note ? (
              <p className="mt-3 font-sans text-xs text-ink-faint italic">
                {section.note}
              </p>
            ) : null}
            <ul className="mt-6 space-y-6">
              {section.items?.map((item) => (
                <Dish key={item.name} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {menu.footnote ? (
        <p className="mt-8 border-t border-rule pt-8 text-center font-sans text-xs text-ink-faint">
          {menu.footnote}
        </p>
      ) : null}

      {menu.pdfUrl ? (
        <p className="mt-8 text-center">
          <TextLink href={menu.pdfUrl}>
            Download printable menu (PDF)
          </TextLink>
        </p>
      ) : null}
    </article>
  )
}
