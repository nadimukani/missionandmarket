'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A silent, looping clip from the shoot's reels.
 *
 * - Plays only while on screen (IntersectionObserver), so three loops on the
 *   home page never decode at once and battery-saver phones are spared.
 * - Visitors with "reduce motion" on get the poster frame and a play button,
 *   never autoplay.
 * - Every loop runs longer than five seconds, so WCAG 2.2.2 requires a way to
 *   pause it: the small control in the corner.
 * - Decorative: the clips carry no information that is not also in the text,
 *   so the <video> is hidden from assistive tech and the control is labelled.
 */
export function VideoLoop({
  src,
  poster,
  label,
  className = '',
  controlPosition = 'bottom-right',
  priority = false,
}: {
  src: string
  poster: string
  /** What the clip shows, for the pause control's label. */
  label: string
  className?: string
  controlPosition?: 'bottom-right' | 'bottom-left' | 'top-right'
  /** Above the fold: start fetching immediately. */
  priority?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video || reduced || userPaused) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can be refused (Low Power Mode, data saver); the poster
          // simply stays up and the control offers to play.
          video.play().catch(() => setPlaying(false))
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [reduced, userPaused])

  function toggle() {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      setUserPaused(false)
      video.play().catch(() => setPlaying(false))
    } else {
      setUserPaused(true)
      video.pause()
    }
  }

  const corner =
    controlPosition === 'bottom-left'
      ? 'bottom-3 left-3'
      : controlPosition === 'top-right'
        ? 'top-3 right-3'
        : 'bottom-3 right-3'

  return (
    <div className={`relative overflow-hidden bg-teal ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 size-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={priority ? 'auto' : 'none'}
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? 'Pause' : 'Play'} video: ${label}`}
        className={`absolute ${corner} grid size-9 place-items-center
                    bg-ink/45 text-cream backdrop-blur-sm transition-colors
                    hover:bg-ink/70 focus-visible:outline-cream`}
      >
        {playing ? (
          <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
            <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" className="ml-0.5 size-3" aria-hidden="true">
            <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  )
}
