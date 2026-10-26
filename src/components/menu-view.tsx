import type { Menu, MenuItem, MenuSection } from '@/sanity/types'

const TAG_LABEL: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
  spicy: 'Spicy',
  raw: 'Raw',
  signature: 'Signature',
}

export const sectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function Item({ item }: { item: MenuItem }) {
  const tags = (item.tags ?? []).map((t) => TAG_LABEL[t]).filter(Boolean)
  return (
    <li className={item.soldOut ? 'opacity-45' : ''}>
      <h4 className="text-[0.8125rem] leading-snug font-medium tracking-[0.16em] uppercase">
        {item.name}
        {item.price ? (
          <span className="ml-3 font-display text-[1.0625rem] font-normal tracking-normal normal-case tabular">
            {item.price}
          </span>
        ) : null}
      </h4>
      {item.description ? (
        <p className="mt-1.5 font-display text-[1.0625rem] leading-relaxed text-ink-soft italic">{item.description}</p>
      ) : null}
      {item.addOns?.length ? (
        <p className="mt-1.5 text-sm font-light text-stone">
          {item.addOns.map((a) => `${a.label} ${a.price ?? ''}`.trim()).join(' · ')}
        </p>
      ) : null}
      {item.soldOut || tags.length ? (
        <p className="label mt-2 text-bronze">{[item.soldOut ? 'Unavailable today' : null, ...tags].filter(Boolean).join(' · ')}</p>
      ) : null}
    </li>
  )
}

function Feature({ section }: { section: MenuSection }) {
  return (
    <section id={sectionId(section.title)} className="mx-auto max-w-2xl scroll-mt-40 border border-bronze/40 p-2">
      <div className="border border-bronze/20 px-6 py-12 text-center sm:px-14">
        <h3 className="label text-bronze">{section.title}</h3>
        <ul className="mt-6 grid gap-8">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className={item.soldOut ? 'opacity-45' : ''}>
              <p className="font-display text-title font-light">{item.name}</p>
              {item.description ? (
                <p className="mt-3 font-display text-lg text-ink-soft italic">{item.description}</p>
              ) : null}
              {item.price ? <p className="mt-4 font-display text-2xl tabular">{item.price}</p> : null}
            </li>
          ))}
        </ul>
        {section.note ? <p className="mt-6 text-sm font-light text-stone">{section.note}</p> : null}
      </div>
    </section>
  )
}

/** HTML menus — readable on a phone and by Google, and the same data the
 *  printable menu is made from, so the two can never disagree. */
export function MenuView({ menu, columns = 2 }: { menu: Menu; columns?: 1 | 2 }) {
  const sections = (menu.sections ?? []).filter((s) => s.items?.length)

  return (
    <div className="grid gap-24">
      {sections.map((s) =>
        s.layout === 'feature' ? (
          <Feature key={s.title} section={s} />
        ) : (
          <section key={s.title} id={sectionId(s.title)} aria-labelledby={`${sectionId(s.title)}-h`} className="scroll-mt-40">
            <div className="flex items-center gap-6 sm:gap-10">
              <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
              <h3 id={`${sectionId(s.title)}-h`} className="font-display text-title font-light italic">
                {s.title}
              </h3>
              <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
            </div>
            {s.note ? <p className="mt-5 text-center text-sm font-light tracking-wide text-stone">{s.note}</p> : null}
            <ul
              className={`mt-12 grid gap-x-20 gap-y-10 ${
                columns === 2 ? 'md:grid-cols-2' : 'mx-auto max-w-2xl text-center'
              }`}
            >
              {s.items!.map((item, i) => (
                <Item key={`${item.name}-${i}`} item={item} />
              ))}
            </ul>
          </section>
        ),
      )}
      {menu.footnote ? (
        <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed font-light tracking-wide text-stone">
          {menu.footnote}
        </p>
      ) : null}
    </div>
  )
}
