import { Fragment } from 'react'

/**
 * The moving band under the opening — short phrases joined by the brand "+".
 * The track is rendered twice and slid by exactly half its width, so the loop
 * is seamless at any viewport. Screen readers get the list once, statically.
 */
export function Ticker({ items }: { items?: string[] }) {
  const list = (items ?? []).filter(Boolean)
  if (!list.length) return null

  const run = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {list.map((item, i) => (
        <Fragment key={`${hidden}-${i}`}>
          <span className="px-6 font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.5rem)] whitespace-nowrap italic sm:px-9">
            {item}
          </span>
          <span className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.5rem)] text-bronze/90" aria-hidden="true">
            +
          </span>
        </Fragment>
      ))}
    </div>
  )

  return (
    <section aria-label="At a glance" className="ticker overflow-hidden bg-moss py-5 text-cream sm:py-6">
      <ul className="sr-only">
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="ticker-track flex w-max">
        {run(true)}
        {run(true)}
      </div>
    </section>
  )
}
