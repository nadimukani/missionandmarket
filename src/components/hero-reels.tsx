'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { preload } from 'react-dom'

const REDUCED = '(prefers-reduced-motion: reduce)'
function subscribe(cb: () => void) {
  const mq = window.matchMedia(REDUCED)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

type Reel = { src: string; poster: string }

/**
 * The opening: the shoot's vertical reels, side by side and edge to edge on
 * wide screens (three portrait frames fill a landscape screen with no
 * cropping), a single reel full-screen on phones.
 *
 * - One control pauses or plays them all (WCAG 2.2.2).
 * - Reduced-motion visitors get the still frames.
 * - Panels that are hidden at the current width are never asked to play,
 *   nor loaded: on phones only the first reel is fetched.
 * - The first reel's still frame — the largest paint on phones — is fetched
 *   ahead of everything else, the video after it.
 */
export function HeroReels({ reels, label }: { reels: Reel[]; label: string }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  if (reels[0]) preload(reels[0].poster, { as: 'image', fetchPriority: 'high' })
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  )
  // null = follow the visitor's motion preference; true/false = they chose.
  const [choice, setChoice] = useState<boolean | null>(null)
  const paused = choice ?? reduced

  useEffect(() => {
    for (const v of refs.current) {
      if (!v || v.offsetParent === null) continue
      if (paused) v.pause()
      else v.play().catch(() => {})
    }
  }, [paused])

  function toggle() {
    const next = !paused
    setChoice(next)
  }

  return (
    <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-3">
      {reels.map((r, i) => (
        <div key={r.src} className={`relative overflow-hidden bg-ink ${i === 0 ? '' : 'hidden lg:block'}`}>
          <video
            ref={(el) => {
              refs.current[i] = el
            }}
            className="absolute inset-0 size-full object-cover"
            src={r.src}
            poster={r.poster}
            muted
            loop
            playsInline
            preload={i === 0 ? 'auto' : 'none'}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={toggle}
        aria-label={`${paused ? 'Play' : 'Pause'} background video: ${label}`}
        className="absolute right-5 bottom-6 z-10 grid size-10 place-items-center border border-cream/40 text-cream transition-colors hover:border-cream lg:right-8 lg:bottom-8"
      >
        {paused ? (
          <svg viewBox="0 0 12 12" className="ml-0.5 size-2.5" aria-hidden="true">
            <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden="true">
            <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  )
}
