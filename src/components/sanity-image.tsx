import Image, { type ImageProps } from 'next/image'

import { urlForImage } from '@/sanity/image'
import type { SanityImage as SanityImageType } from '@/sanity/types'

type Props = Omit<ImageProps, 'src' | 'alt' | 'loader'> & {
  image: SanityImageType
  alt?: string
  width?: number
  height?: number
}

/**
 * Next/Image over Sanity's CDN. Sanity already handles format negotiation and
 * resizing, so we hand it the transform directly rather than paying for
 * Vercel's optimizer on top — meaningful on a photo-heavy restaurant site.
 */
/**
 * Sanity encodes an asset's real pixel dimensions in its `_ref`, e.g.
 * `image-<hash>-1367x2048-jpg`. Reading them there is exact and costs no
 * request — which matters because guessing is worse than it sounds: the old
 * fallback declared `height = width * 0.66` for every uncropped image, so a
 * 1367x2048 portrait in the gallery was laid out as a 900x594 landscape box
 * and then reflowed by ~750px once the real file arrived.
 */
function nativeAspect(image: SanityImageType): number | null {
  const ref = (image as { asset?: { _ref?: string } }).asset?._ref
  const match = ref?.match(/-(\d+)x(\d+)-[a-z]+$/)
  if (!match) return null
  const w = Number(match[1])
  const h = Number(match[2])
  return w > 0 && h > 0 ? h / w : null
}

export function SanityImage({
  image,
  alt,
  width = 1600,
  height,
  ...props
}: Props) {
  const builder = urlForImage(image).width(width)
  const src = (
    height ? builder.height(height).fit('crop').crop('focalpoint') : builder
  ).url()

  const aspect = nativeAspect(image)

  return (
    <Image
      src={src}
      alt={alt ?? image.alt ?? ''}
      width={width}
      // next/image requires a height, so the guess survives only as a last
      // resort for a ref that does not parse — which no Sanity asset produces.
      height={height ?? Math.round(width * (aspect ?? 0.66))}
      // Sanity's CDN has already produced the exact width and format, so the
      // Vercel optimizer would re-encode an already-optimal file.
      unoptimized
      {...props}
    />
  )
}
