import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * Sanity calls this the moment the client hits Publish, so a menu change is
 * live in seconds rather than waiting out the ISR window.
 *
 * Set up once at:
 *   sanity.io/manage → API → Webhooks
 *   URL:     https://<domain>/api/revalidate
 *   Trigger: create, update, delete
 *   Filter:  _type in ["announcement","siteSettings","hours","homePage","menu","special","space","page","person","jobPosting","galleryImage"]
 *   Secret:  SANITY_REVALIDATE_SECRET
 */
type WebhookPayload = {
  _type: string
  slug?: { current?: string }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET is not configured' },
      { status: 500 },
    )
  }

  // Verifies the HMAC signature — without this anyone could force a rebuild.
  const { isValidSignature, body } = await parseBody<WebhookPayload>(
    req,
    secret,
  )

  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  if (!body?._type) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  const tags = [body._type]
  if (body.slug?.current) tags.push(`${body._type}:${body.slug.current}`)

  // Next 16 requires an expiry profile; 'max' purges immediately and lets the
  // next request repopulate from Sanity.
  for (const tag of tags) revalidateTag(tag, 'max')

  return NextResponse.json({ revalidated: true, tags })
}
