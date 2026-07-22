import { ImageResponse } from 'next/og'

import { getSettings } from '@/sanity/queries'
import { urlForImage } from '@/sanity/image'

/**
 * Social share card.
 *
 * Every link to this site — texted, posted to Instagram, pasted into a press
 * email — previously rendered as a blank card, because no og:image existed
 * anywhere. For a restaurant selling a room and a plate of food, that is the
 * highest-traffic surface on the internet to ship empty.
 *
 * Uses the restaurant's own photography when the client has set a share image
 * in the CMS, and falls back to a typographic card in the brand palette.
 */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Mission + Market — modern American cooking in Buckhead, Atlanta'

export default async function OpengraphImage() {
  const settings = await getSettings()
  const photo = settings?.ogImage
    ? urlForImage(settings.ogImage).width(1200).height(630).fit('crop').url()
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: '#231f1f',
          position: 'relative',
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #231f1f 15%, rgba(35,31,31,0.55) 60%, rgba(35,31,31,0.2) 100%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', padding: '64px', position: 'relative' }}>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 14,
              color: '#f0e9d7',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Mission + Market
          </div>
          <div style={{ fontSize: 60, color: '#f0e9d7', marginTop: 20, display: 'flex' }}>
            {settings?.tagline ?? 'Flavor + Fusion'}
          </div>
          <div style={{ fontSize: 28, color: '#a08165', marginTop: 18, display: 'flex' }}>
            {settings?.neighborhood ?? 'Buckhead'}, Atlanta
          </div>
        </div>
      </div>
    ),
    size,
  )
}
