import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * Sanity calls this the moment the client hits Publish, so a menu change is
 * live in seconds rather than waiting out the ISR window.
 *
 * The webhook (sanity.io/manage → API → Webhooks, "Website refresh on publish"):
 *   URL:        https://<domain>/api/revalidate
 *   Trigger:    create, update, delete (published documents only)
 *   Filter:     _type in ["announcement","siteSettings","hours","homePage","menu","special","space","page","person","jobPosting","galleryImage"]
 *   Projection: {_type, slug}
 *   Secret:     the same value as SANITY_REVALIDATE_SECRET in Vercel (Production)
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

  // Expire at once, so the first visit after Publish gets the change. The
  // usual 'max' profile serves the old page once more while it refreshes
  // (stale-while-revalidate) — the "I published but nothing changed" moment.
  // parseBody has already waited 3s for Sanity's CDN to catch up.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })

  return NextResponse.json({ revalidated: true, tags })
}
