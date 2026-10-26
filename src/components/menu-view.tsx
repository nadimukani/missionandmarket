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

/** A dish: its name in the display serif with the price beside it (no
 *  column, no leader dots — the upscale convention), then the description
 *  in plain text at a size a phone can read. */
function Item({ item }: { item: MenuItem }) {
  const tags = (item.tags ?? []).map((t) => TAG_LABEL[t]).filter(Boolean)
  return (
    <li className={item.soldOut ? 'opacity-45' : ''}>
      <h3 className="font-display text-[1.1875rem] leading-snug sm:text-[1.25rem]">
        {item.name}
        {item.price ? (
          <span className="ml-2.5 font-sans text-[0.9375rem] font-normal whitespace-nowrap text-bronze tabular">
            {item.price}
          </span>
        ) : null}
      </h3>
      {item.description ? (
        <p className="mt-1.5 max-w-[46ch] text-[0.9375rem] leading-relaxed font-light text-ink-soft">{item.description}</p>
      ) : null}
      {item.addOns?.length ? (
        <p className="mt-1.5 text-sm font-light text-stone">
          {item.addOns.map((a) => `${a.label} ${a.price ?? ''}`.trim()).join(' · ')}
        </p>
      ) : null}
      {item.soldOut || tags.length ? (
        <p className="label mt-2.5 text-bronze">{[item.soldOut ? 'Unavailable today' : null, ...tags].filter(Boolean).join(' · ')}</p>
      ) : null}
    </li>
  )
}

function Feature({ section }: { section: MenuSection }) {
  return (
    <section
      id={sectionId(section.title)}
      aria-labelledby={`${sectionId(section.title)}-h`}
      className="mx-auto w-full max-w-2xl scroll-mt-20 border border-bronze/40 p-2"
    >
      <div className="border border-bronze/20 px-6 py-12 text-center sm:px-14">
        <h2 id={`${sectionId(section.title)}-h`} className="label text-bronze">
          {section.title}
        </h2>
        <ul className="mt-6 grid gap-8">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className={item.soldOut ? 'opacity-45' : ''}>
              <h3 className="font-display text-title font-light">{item.name}</h3>
              {item.description ? (
                <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed font-light text-ink-soft">
                  {item.description}
                </p>
              ) : null}
              {item.price ? <p className="mt-4 font-display text-2xl text-bronze tabular">{item.price}</p> : null}
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
    <div className="grid gap-20 sm:gap-24">
      {sections.map((s) =>
        s.layout === 'feature' ? (
          <Feature key={s.title} section={s} />
        ) : (
          <section key={s.title} id={sectionId(s.title)} aria-labelledby={`${sectionId(s.title)}-h`} className="scroll-mt-20">
            <div className="flex items-center gap-6 sm:gap-10">
              <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
              <h2 id={`${sectionId(s.title)}-h`} className="font-display text-title font-light italic">
                {s.title}
              </h2>
              <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
            </div>
            {s.note ? <p className="mt-5 text-center text-sm font-light tracking-wide text-stone">{s.note}</p> : null}
            <ul
              className={`mt-10 grid gap-x-16 gap-y-8 sm:mt-12 sm:gap-y-10 ${
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
