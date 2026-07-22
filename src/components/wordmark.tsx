/**
 * The brand marks, redrawn as SVG/type rather than shipped as bitmaps.
 *
 * Their logo is a vertical column built from the letter M repeated — two
 * upright stems with a stack of chevrons between them — sitting above a
 * wide-tracked serif wordmark. Both are reproduced here so they stay crisp at
 * any size, inherit `currentColor`, and cost no image request.
 */

/** The stacked-M column. Decorative by default; the wordmark carries the name. */
export function MarkColumn({
  className,
  chevrons = 5,
}: {
  className?: string
  chevrons?: number
}) {
  const step = 34
  const height = chevrons * step + 12

  return (
    <svg
      viewBox={`0 0 60 ${height}`}
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Upright stems */}
      <path
        d={`M3 2 V ${height - 2} M57 2 V ${height - 2}`}
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="square"
      />
      {/* Chevrons — the shared vertex of each repeated M */}
      {Array.from({ length: chevrons }, (_, i) => {
        const top = 2 + i * step
        return (
          <path
            key={i}
            d={`M3 ${top} L30 ${top + step - 8} L57 ${top}`}
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
        )
      })}
    </svg>
  )
}

/** The `M + M` monogram, for tight spaces like a favicon or a mobile header. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 550 148"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 140 V12 L75 118 L142 12 V140"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinejoin="miter"
      />
      <path
        d="M275 46 V116 M240 81 H310"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="square"
      />
      <path
        d="M408 140 V12 L475 118 L542 12 V140"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

/**
 * The horizontal wordmark. Set in type rather than drawn, so it stays
 * selectable, translatable and legible to search engines.
 */
export function Wordmark({
  className = '',
  size = 'base',
}: {
  className?: string
  size?: 'sm' | 'base' | 'lg'
}) {
  const scale = {
    sm: 'text-[0.8125rem]',
    base: 'text-[0.9375rem] lg:text-base',
    lg: 'text-xl lg:text-3xl',
  }[size]

  return (
    <span className={`wordmark inline-block leading-none ${scale} ${className}`}>
      Mission{' '}
      <span aria-hidden="true" className="mx-[0.1em] font-sans font-light">
        +
      </span>
      <span className="sr-only">and</span> Market
    </span>
  )
}
