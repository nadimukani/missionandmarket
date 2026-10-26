# Launch checklist — moving missionandmarketatl.com to the new site

_Written 2026-10-26. The new site is live at
`https://missionandmarket.vercel.app`; the domain still serves the old
WordPress site. Nothing below has been done yet._

## The domain today (public DNS, 2026-10-26)

DNS is at **GoDaddy** (nameservers `ns49`/`ns50.domaincontrol.com`).

| Record | Value | At launch |
| --- | --- | --- |
| `@` A | `160.153.0.98` (the WordPress host), TTL 1 hour | **Change** → Vercel |
| `www` CNAME | `@` | **Change** → Vercel |
| `@` MX | `missionandmarketatl-com.mail.protection.outlook.com` (Microsoft 365) | Leave — email |
| `@` TXT | `v=spf1 include:secureserver.net -all` | Leave — email |

Only the two web records change. Every other record (MX, TXT, autodiscover…)
carries the restaurant's email; leave it alone. No CAA records, so nothing
blocks Vercel's certificate.

The bare domain is the main address, as on the old site (`www` and `http://`
redirect to `https://missionandmarketatl.com/`), and the code's fallback in
`src/lib/site.ts` assumes the same.

## A day before

1. **Vercel plan.** The project's team is on Hobby, which Vercel limits to
   non-commercial personal use (fair-use guidelines); a restaurant's site
   needs Pro. Upgrade the team, or move the project to a Pro team (the
   agency's or the client's own) before the domain points at it.
2. **Access.** Someone who can sign in to GoDaddy (DNS), the Google Business
   Profile and Search Console — asked for in the client's content request.
3. **Sign-off** on the content, and the open items in
   `REDESIGN-FALL-2026.md` → "Placeholders".
4. **Back up WordPress** — a full backup from the host, plus Tools → Export —
   and keep the hosting running for a month after launch.
5. **Lower the TTL** of the `@` A and `www` CNAME records to the lowest GoDaddy
   offers, so the switch (and a rollback) takes minutes, not an hour.
6. **Printed links.** Ask what the restaurant has printed (QR codes, cards,
   ads). Old page URLs are redirected (`next.config.ts`), but old uploads
   (`/wp-content/…`, e.g. a PDF menu) can't be: Vercel's firewall answers
   every `/wp-*` path with a 403 before redirects run. A printed link to one
   needs reprinting, or a new short URL redirected in `next.config.ts`.
7. **Sanity CORS.** sanity.io/manage → `x2izrrun` → API → CORS origins → add
   `https://missionandmarketatl.com` **with "Allow credentials"**, so the
   Studio works on the domain. (The vercel.app URL and `localhost:3333` are
   already allowed.)

## The switch

1. **Vercel** → `missionandmarket` → Settings → Domains → add
   `missionandmarketatl.com`, then `www.missionandmarketatl.com` set to
   redirect to it.
2. **GoDaddy** → DNS → edit only the `@` A and `www` CNAME records, to the
   values Vercel shows on that page. If Vercel asks for a TXT verification
   record, add that too.
3. Wait for both domains to show **Valid Configuration** and a certificate.
4. **Vercel** → Settings → Environment Variables → Production → add
   `NEXT_PUBLIC_SITE_URL` = `https://missionandmarketatl.com`, then
   **Redeploy**. Pages are built ahead of time, so canonical links, the
   sitemap, Open Graph and structured data only switch on a new build.
5. **Sanity webhook**, if one is set up (sanity.io/manage → API → Webhooks):
   point it at `https://missionandmarketatl.com/api/revalidate`.

## Check

- `https://missionandmarketatl.com` is the new site; `www`, `http://` and
  `http://www` redirect to it.
- View source on a page: the canonical link, `og:url` and the JSON-LD use the
  domain; so do `/sitemap.xml` and `/robots.txt`.
- Old URLs redirect: `/dinner-menu/`, `/lunch-menu/`, `/private-dining/`,
  `/contact-us/`, `/our-spaces/6-private-dining-room/`, a `/menu-item/…`.
- `/studio` signs in, and Live preview loads.
- Reserve opens OpenTable; the private-events form loads (don't submit it — it
  creates a real lead in Tripleseat).
- Mail to and from an `@missionandmarketatl.com` address still arrives.

## After

1. **Search Console:** add (or confirm) the domain property, submit
   `https://missionandmarketatl.com/sitemap.xml`, inspect the home page and a
   menu. Watch Pages → "Not found (404)" for a few weeks and redirect anything
   that matters.
2. **Google Business Profile:** website → `https://missionandmarketatl.com/`,
   menu link → `https://missionandmarketatl.com/menus`. The same for OpenTable,
   Yelp, Instagram and other listings that link to a menu.
3. **Hours on Google** come from the Business Profile, not the website: holiday
   closures must be set there as well as in the Studio.
4. **The vercel.app URL** keeps working. Once nothing points at it, it can
   redirect to the domain (Vercel → Domains).
5. **After a quiet month,** the restaurant may end the WordPress hosting — not
   the domain, not Microsoft 365. Keep the backup.

## Rollback

Set `@` back to an A record of `160.153.0.98` and `www` back to a CNAME of `@`.
With the lowered TTL the old site is back within minutes; nothing in Vercel
needs undoing.
