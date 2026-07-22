import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from './env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlForImage(source: Image) {
  return builder.image(source).auto('format').fit('max')
}

/** Sanity stores the focal point on the asset; honour it when cropping. */
export function imageUrl(source: Image, width: number, height?: number) {
  const b = urlForImage(source).width(width)
  return (height ? b.height(height).fit('crop').crop('focalpoint') : b).url()
}
