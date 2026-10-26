import type { Menu, MenuItem } from '@/sanity/types'

import { slugify } from './rooms'

const TAG_LABEL: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
  spicy: 'Spicy',
  raw: 'Raw',
  signature: 'Signature',
}

function Item({ item }: { item: MenuItem }) {
  const tags = (item.tags ?? []).map((t) => TAG_LABEL[t]).filter(Boolean)
  return (
    <li className={`border-t border-ink/10 py-5 ${item.soldOut ? 'opacity-50' : ''}`}>
      <div className="flex items-baseline justify-between gap-6">
        <h4 className="font-display text-[1.375rem] leading-tight">
          {item.name}
          {item.soldOut ? <span className="eyebrow ml-3 align-middle text-stone">Unavailable today</span> : null}
        </h4>
        {item.price ? <p className="shrink-0 text-[0.9375rem] tabular">{item.price}</p> : null}
      </div>
      {item.description ? <p className="mt-1.5 text-[0.9375rem] text-stone">{item.description}</p> : null}
      {item.addOns?.length ? (
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone">
          {item.addOns.map((a, i) => (
            <li key={i}>
              {a.label} <span className="tabular">{a.price}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {tags.length ? <p className="eyebrow mt-2.5 text-bronze">{tags.join(' · ')}</p> : null}
    </li>
  )
}

/** HTML menus — readable by guests on a phone and by Google, which is what a
 *  PDF is not. Sections flow in two columns on wide screens. */
export function MenuView({ menu }: { menu: Menu }) {
  const sections = (menu.sections ?? []).filter((s) => s.items?.length)

  return (
    <div>
      {sections.length > 2 ? (
        <nav aria-label={`${menu.title} sections`} className="mb-14 flex flex-wrap gap-x-6 gap-y-3">
          {sections.map((s) => (
            <a key={s.title} href={`#${slugify(s.title)}`} className="eyebrow link text-stone hover:text-ink">
              {s.title}
            </a>
          ))}
        </nav>
      ) : null}

      <div className="gap-x-16 lg:columns-2">
        {sections.map((s) => (
          <section
            key={s.title}
            id={slugify(s.title)}
            aria-labelledby={`${slugify(s.title)}-h`}
            className="mb-16 break-inside-avoid scroll-mt-28"
          >
            <h3 id={`${slugify(s.title)}-h`} className="font-display text-title">
              {s.title}
            </h3>
            {s.note ? <p className="mt-3 text-[0.9375rem] text-stone italic">{s.note}</p> : null}
            <ul className="mt-6">
              {s.items!.map((item, i) => (
                <Item key={`${item.name}-${i}`} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {menu.footnote ? <p className="mt-4 max-w-prose text-sm text-stone">{menu.footnote}</p> : null}
    </div>
  )
}
