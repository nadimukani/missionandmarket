# Mission + Market — fall 2026 redesign

_Branch `redesign/fall-2026`, built 2026-10-25/26. Supersedes the visual layer
described in `DESIGN-DIRECTION.md`; the CMS, OpenTable deep link, hours engine
and revalidation webhook from the previous build are kept._

## Brief

A fresh design and build with modern language, using the Sept 25 shoot
(28 photos, 4 reels). Presentable for the client review, together with the
client-editing side the restaurant asked for (menus, events, closure notices).
**Rule: nothing invented.** Every fact on the site traces to a source below;
anything unsourced is a labelled placeholder.

## The concept

**Light, editorial, warm — the room in daylight, the bar at night.**

- **Palette is the restaurant's own**, measured from missionandmarketatl.com
  (client requirement: keep the current site's colours): moss `#464B20`,
  cream `#F0E9D7`, paper `#F7F5F0`, ink `#231F1F`, bronze `#8A6445`, and their
  deep teal `#0B2F31` — which is also the colour of the velvet banquettes in
  the photography. The competitive scan found this palette is unoccupied in
  the Atlanta set (everyone else is dark-and-gold or plain white).
- **Type:** Instrument Serif (display, with its italic carrying the voice) +
  Instrument Sans (UI/body, already on their current site). Tracked uppercase
  labels echo the logo's wordmark.
- **The "+" is the brand device** — it is in the name, the tagline
  ("Flavor + Fusion") and even their print happy-hour menu ("Bar + Patio").
  Used as the ticker separator, list bullets and link markers.
- **Square corners, hairlines, no boxes.** Motion is limited to things that
  cannot strand content: video loops, the ticker, hover states. No
  scroll-reveal (the previous build's two attempts left sections invisible).
- **Voice:** short, concrete, a little wry, numbers doing the work —
  "*California light*, Buckhead address." · "Trees indoors, *fire pits*
  outdoors." · "Forty seats, two walls of glass and curtains to draw."

## Site map

| Route | Purpose |
| --- | --- |
| `/` | Split hero (headline + two vertical reels; full-bleed reel on mobile) · "+" ticker · seasonal strip (holiday parties) · introduction · kitchen (dish loop + 4 dishes + Lunch/Happy Hour/Dinner) · the bar (teal, cocktail reel) · private dining with capacities · happenings · patio · visit |
| `/menus`, `/menus/[slug]` | HTML menus (Lunch, Happy Hour, Dinner), section jump links, cover photo, PDF link when present |
| `/private-events` | Labelled "Private Dining". Seasonal band · capacity table · a row per room · Tripleseat inquiry form (`#inquire`) |
| `/happenings` | CMS "Happenings" (replaces `/specials`, which redirects) |
| `/about` | Story · the room (reel stills) · chef (placeholder until headshots) · Diners' Choice 2024 |
| `/contact` | Labelled "Visit". Hours, live open status, parking, map, driving directions |
| `/reservations` | Inline booking form → OpenTable |
| `/gallery`, `/careers` | Footer-level |
| `/studio` | Sanity Studio, full-screen (moved out of the site chrome via the `(site)` route group) |

Booking: every "Reserve" opens an on-brand panel (party, date, time — times
generated from the CMS opening hours for that day) and hands off to OpenTable
`rid 1005016` with everything prefilled. Only 2 of 12 Atlanta competitors keep
this first step on-brand.

## Media

Photographs: Foster Peters (embedded copyright). Delivered in **Adobe RGB** —
converted to sRGB before upload, or they render washed-out wherever the ICC
profile is stripped.

**The duck dish is excluded everywhere**, at the restaurant's request.
Stills #9, #10, #12, #17, #18 dropped; the reels were re-cut around it.

| Use | Source |
| --- | --- |
| Hero reel 1 + About stills | "Dishes and Atmosphere", re-cut to the room/bar/guest shots (3.17–5.84s + 6.38–10.09s), duck and logo end-card removed |
| Hero reel 2 + bar section | "Fall Cocktails", unedited |
| Dish loop (kitchen, menus) | "Dishes and Atmosphere" overhead sequence minus the duck (0.58–1.13s removed), reordered to open on dessert |
| Not used | "10 Seconds at Mission" (duck in 4 shots); "New Dish Features" (split-screen opening crops badly at 4:5) |
| 20 stills + 6 reel frames | Uploaded to Sanity with alt text and credit line; gallery order set by `scripts/fall-2026.ts` |

Reels are encoded H.264 720×1280, silent, faststart, full-range → limited
range converted (the source is 10-bit full-range HEVC, which most browsers
outside Safari cannot play). 0.3–1.7 MB each. Off-screen loops don't
download until scrolled to; reduced-motion visitors get the poster frame; each
loop has a pause control (WCAG 2.2.2).

## Content sources

- **Live site (Oct 2026)** — address, phone, hours (minus brunch), parking
  wording, room capacities and features, 20–140 guests + full buyout, 5,300
  sq ft, chef's counter, OpenTable Diners' Choice 2024, driving directions,
  careers copy and roles, Instagram/Facebook, Toast links.
- **Client direction (Oct 2026)** — no weekend brunch; no half-off wine; the
  weekend tasting experience; the holiday-party line "December is filling up
  fast…" (the restaurant's own copy); a chef change in October.
- **Happy Hour 2026 PDF** (supplied by the client) — items, prices, "bar +
  patio", weekdays 3–6.
- **Photographs** — alt text and dish names describe what is on the plate,
  matched to the current menu documents.

Removed because unsourced: "parties of nine or more, please call", "complimentary
valet / three hours free parking", the "Cocktail Classes" special, `priceRange
$$$` and "Seafood" in structured data, "covered" patio, "lower level".

## CMS changes (Sanity `x2izrrun/production`)

Backup taken first: `backups/sanity-production-20261025-2305.ndjson` (local,
gitignored). Every change is a hide or an addition — nothing deleted.

- New **Announcement Banner** singleton (on/off, message, link, optional
  start/stop times — a closure notice comes down by itself).
- **Happenings** (`special`) gain kind + event date + "hide after" date.
- New **Private Dining Rooms** (`space`) with seated/reception capacities.
- "Hide from website" on menus, team, gallery, rooms.
- Menus gain a cover photograph; Tripleseat ID/key live in Restaurant Info →
  Integrations (the key is public by design — it is in their live page source).
- Brunch menu, half-price wine, Sunday brunch buffet, Cocktail Classes, the
  previous chef's profile and the 20 older gallery images: **hidden**, not
  deleted.
- Studio desk reordered around the three jobs the restaurant asked to own:
  Announcement Banner · Menus · Happenings · Private Dining Rooms, then
  Hours & Info, Home Page, Gallery, Team, Pages, Jobs, Press.

`scripts/fall-2026.ts` is idempotent and re-runnable — but it **overwrites**
the documents it manages, so don't re-run it after the client starts editing.

## Placeholders + what we need from the client

1. **Chef** — name, title, bio, headshots.
2. **Semi-Private and Private Dining Room photography** — the only room images
   that exist are 2024 crops at 280–570 px wide, too small to use.
3. **Logo vector files** (SVG/AI/EPS). The site uses their PNGs as masks.
4. **Chef's tasting** — price and details (their site shows both $65 and $68).
5. **Careers** — how to apply (email or link).
6. **Confirm**: hours as published (minus brunch) · whether the Ginger
   Marinated Duck Steak is still on the dinner menu · dessert menu (none in the
   CMS) · an events contact/email and any event packet, minimums or menus for
   private dining · whether to cross-link Zakia and TreVele.

## Before the client demo

1. **Sanity CORS.** Only `http://localhost:3333` is allowed today — the Studio
   has never worked on any deployed URL. At sanity.io/manage → project
   `x2izrrun` → API → CORS origins, add the preview URL **with "Allow
   credentials" ticked**. (An Editor token cannot do this; it needs a project
   admin.)
2. **Invite the restaurant's editors** at sanity.io/manage → Members.
3. **Revalidation webhook** — confirm sanity.io/manage → API → Webhooks points
   at the deployment's `/api/revalidate` with the filter in
   `src/app/api/revalidate/route.ts`, or edits wait out the 5-minute floor.

## Demo script (≈90 seconds)

1. `/studio` → **Announcement Banner** → switch on, type "Closed Thursday,
   November 26 for Thanksgiving", set "Stop showing" to Nov 27 → Publish →
   refresh the site: banner across the top.
2. **Menus → Dinner** → edit a price, or toggle "Temporarily unavailable" on a
   dish → Publish → show the dinner menu.
3. **Happenings → New** → "Wine Dinner", one-time event, date, "hide after"
   date → Publish → it appears on `/happenings` and the home page.
4. **Private Dining Rooms → Semi-Private** → drop in a photo → the placeholder
   is replaced.
