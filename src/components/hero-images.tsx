import { SanityImage } from '@/components/sanity-image'
import type { SanityImage as SanityImageType } from '@/sanity/types'

const HOLD_SECONDS = 7
const FADE_SECONDS = 1.6

/**
 * The hero photograph, or a slow cross-fade between several.
 *
 * The CMS has always described this field as "One or more. Multiple images
 * cross-fade automatically" — but only `heroImages[0]` was ever rendered, so
 * a client who uploaded four shots on the strength of that description saw
 * the same frame forever. This makes the description true.
 *
 * Pure CSS, no client component and no timers. The keyframes have to be
 * generated because their percentages depend on how many images the client
 * uploaded, and CSS cannot parameterise a keyframe offset — but `n` is known
 * at render time, so the stylesheet is just computed here.
 *
 * Every image after the first rests at opacity 0, which is deliberate and is
 * NOT the "content hidden if the animation never runs" trap: the first image
 * rests visible, so the hero always shows a photograph. Under
 * prefers-reduced-motion no animation is attached at all and the hero is
 * simply a still.
 */
export function HeroImages({ images }: { images: SanityImageType[] }) {
  const single = images.length < 2

  if (single) {
    return (
      <SanityImage
        image={images[0]}
        width={2400}
        height={1500}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }

  const n = images.length
  const cycle = n * HOLD_SECONDS
  const slot = 100 / n
  const fade = (100 * FADE_SECONDS) / cycle

  // Each frame holds, fades out, waits out the other frames, then fades back
  // in across the cycle boundary. Negative delays start every frame already
  // in progress, one slot apart, so no image has to wait a full cycle for its
  // first appearance.
  const keyframes = `@keyframes mm-hero{
0%{opacity:1}
${(slot - fade).toFixed(3)}%{opacity:1}
${slot.toFixed(3)}%{opacity:0}
${(100 - fade).toFixed(3)}%{opacity:0}
100%{opacity:1}
}`

  return (
    <>
      <style>{keyframes}</style>
      {images.map((image, i) => (
        <SanityImage
          key={i}
          image={image}
          width={2400}
          height={1500}
          // Only the first frame is an LCP candidate; the rest must not
          // compete with it for bandwidth on first paint.
          priority={i === 0}
          loading={i === 0 ? undefined : 'lazy'}
          sizes="100vw"
          style={
            {
              '--i': i,
              '--cycle': `${cycle}s`,
            } as React.CSSProperties
          }
          className={`hero-frame absolute inset-0 h-full w-full object-cover ${
            i === 0 ? '' : 'opacity-0'
          }`}
        />
      ))}
    </>
  )
}
