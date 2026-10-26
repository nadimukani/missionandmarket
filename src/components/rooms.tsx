import { stegaClean } from 'next-sanity'

import { SanityImage } from '@/components/sanity-image'
import { Label, Placeholder } from '@/components/ui'
import type { Space } from '@/sanity/types'

export function slugify(name: string) {
  return stegaClean(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Capacities at a glance — the first thing a planner looks for. */
export function CapacityTable({
  rooms,
  tone = 'ink',
  linkBase = '',
}: {
  rooms: Space[]
  tone?: 'ink' | 'cream'
  /** Where the room rows live — '' on the private dining page itself. */
  linkBase?: string
}) {
  const rows = rooms.filter((r) => r.seated || r.reception)
  if (!rows.length) return null
  const rule = tone === 'cream' ? 'border-cream/20' : 'border-ink/15'
  const muted = tone === 'cream' ? 'text-cream/60' : 'text-stone'
  return (
    <table className="w-full text-left">
      <caption className="sr-only">Private dining capacities</caption>
      <thead>
        <tr className={`border-b ${rule}`}>
          <th scope="col" className={`label py-4 pr-4 font-medium ${muted}`}>
            Space
          </th>
          <th scope="col" className={`label py-4 pr-4 text-right font-medium ${muted}`}>
            Seated
          </th>
          <th scope="col" className={`label py-4 text-right font-medium ${muted}`}>
            Reception
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r._id} className={`border-b ${rule}`}>
            <th scope="row" className="py-5 pr-4 font-display text-subtitle font-light">
              <a href={`${linkBase}#${slugify(r.name)}`} className="link-hover">
                {r.name}
              </a>
            </th>
            <td className="py-5 pr-4 text-right font-display text-subtitle font-light tabular">{r.seated ?? '—'}</td>
            <td className="py-5 text-right font-display text-subtitle font-light tabular">{r.reception ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Figure({ value, label }: { value?: number; label: string }) {
  if (!value) return null
  return (
    <div className="text-center">
      <p className="font-display text-[clamp(3.25rem,2.4rem+3vw,5.5rem)] leading-none font-light tabular">{value}</p>
      <p className="label mt-3 text-stone">{label}</p>
    </div>
  )
}

/** One room, full-bleed: photograph on one side, the room on the other. */
export function RoomRow({ room, flip = false }: { room: Space; flip?: boolean }) {
  const photo = room.photos?.[0]
  return (
    <article id={slugify(room.name)} className="grid scroll-mt-24 lg:min-h-[86svh] lg:grid-cols-2">
      <div className={`relative min-h-[60svh] overflow-hidden lg:min-h-0 ${flip ? 'lg:order-2' : ''}`}>
        {photo ? (
          <SanityImage
            image={photo}
            width={1400}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Placeholder className="absolute inset-0" label="Photography to come" />
        )}
      </div>
      <div className="flex flex-col items-center justify-center px-(--gutter) py-20 text-center sm:py-28">
        <div className="max-w-md">
          {room.bestFor ? <Label className="text-bronze">{room.bestFor}</Label> : null}
          <h3 className="mt-6 font-display text-display font-light">{room.name}</h3>
          {room.description ? <p className="mt-6 text-lead font-light text-ink-soft">{room.description}</p> : null}
          {room.seated || room.reception ? (
            <div className="mt-12 flex justify-center gap-16">
              <Figure value={room.seated} label="Seated" />
              <Figure value={room.reception} label="Reception" />
            </div>
          ) : null}
          {room.capacityNote ? <p className="mt-5 text-sm font-light text-stone">{room.capacityNote}</p> : null}
          {room.features?.length ? (
            <ul className="mt-12 grid gap-2.5 border-t border-ink/10 pt-8 text-[0.9375rem] font-light">
              {room.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  )
}
