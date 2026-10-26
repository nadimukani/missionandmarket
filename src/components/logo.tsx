/**
 * The restaurant's own logo files (from missionandmarketatl.com), rendered as
 * CSS masks so a single cream-on-transparent PNG can take any brand colour
 * through `currentColor`. They are raster — the vector masters have been
 * requested from the client and should replace these when they arrive.
 *
 *   mm-monogram.png  550×148  "M + M"
 *   mm-lockup.png    505×263  chevron mark over "MISSION + MARKET"
 *   mm-mark.png       53×181  the chevron mark alone (cropped from the lockup)
 */

type Props = { className?: string; title?: string }

function Masked({
  src,
  ratio,
  className = '',
  title,
}: Props & { src: string; ratio: string }) {
  return (
    <span
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`logo-mask ${className}`}
      style={{
        aspectRatio: ratio,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  )
}

export function Monogram(props: Props) {
  return <Masked src="/brand/mm-monogram.png" ratio="550 / 148" {...props} />
}

export function Lockup(props: Props) {
  return <Masked src="/brand/mm-lockup.png" ratio="505 / 263" {...props} />
}

export function Mark(props: Props) {
  return <Masked src="/brand/mm-mark.png" ratio="53 / 181" {...props} />
}
