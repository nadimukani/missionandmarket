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

  return (
    <Image
      src={src}
      alt={alt ?? image.alt ?? ''}
      width={width}
      height={height ?? Math.round(width * 0.66)}
      // Sanity's CDN has already produced the exact width and format, so the
      // Vercel optimizer would re-encode an already-optimal file.
      unoptimized
      {...props}
    />
  )
}
