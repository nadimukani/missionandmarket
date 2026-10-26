import { SanityImage } from '@/components/sanity-image'
import { Placeholder, Plus } from '@/components/ui'
import type { Space } from '@/sanity/types'

/** At-a-glance capacities — the first thing a planner looks for, and the
 *  format every serious private-dining page in the city uses. */
export function CapacityTable({ rooms }: { rooms: Space[] }) {
  const rows = rooms.filter((r) => r.seated || r.reception)
  if (!rows.length) return null
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <caption className="sr-only">Private dining capacities</caption>
        <thead>
          <tr className="border-b border-ink/15">
            <th scope="col" className="eyebrow py-4 pr-4 font-medium text-stone">
              Space
            </th>
            <th scope="col" className="eyebrow py-4 pr-4 text-right font-medium text-stone">
              Seated
            </th>
            <th scope="col" className="eyebrow py-4 text-right font-medium text-stone">
              Reception
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-b border-ink/10">
              <th scope="row" className="py-5 pr-4 font-display text-card font-normal">
                <a href={`#${slugify(r.name)}`} className="hover:text-moss">
                  {r.name}
                </a>
              </th>
              <td className="py-5 pr-4 text-right font-display text-card tabular">{r.seated ?? '—'}</td>
              <td className="py-5 text-right font-display text-card tabular">{r.reception ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function Figure({ value, label }: { value?: number; label: string }) {
  if (!value) return null
  return (
    <div>
      <p className="font-display text-[clamp(3rem,2.4rem+2.4vw,4.75rem)] leading-none tabular">{value}</p>
      <p className="eyebrow mt-2 text-stone">{label}</p>
    </div>
  )
}

/** One room: photograph (or a labelled placeholder) beside its numbers. */
export function RoomRow({ room, flip = false }: { room: Space; flip?: boolean }) {
  const photo = room.photos?.[0]
  return (
    <article id={slugify(room.name)} className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className={`lg:row-start-1 lg:col-span-6 ${flip ? 'lg:col-start-7' : 'lg:col-start-1'}`}>
        {photo ? (
          <div className="aspect-[4/5] overflow-hidden bg-cream sm:aspect-[5/4] lg:aspect-[4/5]">
            <SanityImage
              image={photo}
              width={1100}
              height={1375}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="size-full object-cover"
            />
          </div>
        ) : (
          <Placeholder
            className="aspect-[5/4] lg:aspect-[4/5]"
            label={`${room.name} photography`}
            note="Room photography to come — this card fills in from the Studio."
          />
        )}
      </div>
      <div className={`lg:row-start-1 lg:col-span-5 ${flip ? 'lg:col-start-1' : 'lg:col-start-8'}`}>
        {room.bestFor ? <p className="eyebrow text-bronze">{room.bestFor}</p> : null}
        <h3 className="mt-4 font-display text-display">{room.name}</h3>
        {room.description ? <p className="mt-5 max-w-prose text-lead text-stone">{room.description}</p> : null}
        {room.seated || room.reception ? (
          <div className="mt-8 flex gap-12 border-t border-ink/10 pt-8">
            <Figure value={room.seated} label="Seated" />
            <Figure value={room.reception} label="Reception" />
          </div>
        ) : null}
        {room.capacityNote ? <p className="mt-4 text-sm text-stone">{room.capacityNote}</p> : null}
        {room.features?.length ? (
          <ul className="mt-8 grid gap-3">
            {room.features.map((f) => (
              <li key={f} className="flex items-baseline gap-3 text-[0.9375rem]">
                <Plus className="size-2.5 shrink-0 translate-y-[-1px] text-bronze" />
                {f}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
