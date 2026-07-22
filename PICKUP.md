# PICKUP — Mission + Market

**Date:** 2026-07-22 · **Branch:** main (no remote) · **Tree:** clean at `43220df`
**Resume keyword:** `mm-ready-to-deploy-2026-07-22`

---

## What this is

Ground-up rebuild of **missionandmarketatl.com** — Mission + Market, a modern
American restaurant in Buckhead, Atlanta (Three Alliance Center). Client work
under Orion. Replacing a WordPress/Elementor site built by Resto Experience.

## Hard facts (verified, do not re-derive)

| Thing | Value |
| --- | --- |
| Live site being replaced | missionandmarketatl.com (WordPress + Elementor) |
| `missionandmarket.com` | Parked on Namecheap since 2019-08-03. Ownership UNCONFIRMED |
| OpenTable rid | **1005016** — verified end-to-end, deep link works |
| Toast ordering | order.toasttab.com/online/mission-market-three-alliance-center-3550-lenox-rd-ne |
| Toast gift cards | toasttab.com/mission-market-three-alliance-center-3550-lenox-rd-ne/giftcards |
| Sanity project | `x2izrrun`, dataset `production`, Studio at `/studio` |
| Address | 3550 Lenox Rd NE, Suite 550, Atlanta GA 30326 |
| Phone | 404.948.2927 |
| Socials | instagram.com/missionandmkt · facebook.com/missionandmkt |
| Chef / partners | **Executive Chef Paul (surname UNKNOWN)** — replaced Ian Winslade, confirmed by client 2026-07-22. Partners: Jonathan + Tony Akly |
| Tagline | "Flavor + Fusion" |

## Brand system — RECOVERED FROM THEIR ACTUAL ASSETS

Extracted from the live site's inline CSS and logo files. These are real brand
values, not invented. **The Elementor kit is stock (Roboto/#6EC1E4 defaults) —
ignore it; the real design lives in inline widget styles.**

| Token | Hex | Provenance |
| --- | --- | --- |
| Ink | `#231F1F` | 19 uses — dominant text/ground colour |
| Moss / olive | `#464B20` | 10 uses — **the signature colour; it is the moss wall in the bar** |
| Cream | `#F0E9D7` | 5 uses — the logo's own colour |
| Brass / bronze | `#8A6445` | 3 uses — the brass sconces and chair frames |
| Off-white | `#F7F5F0` | icon fills |

**Logo:** an `M + M` monogram, and a full lockup with a *vertical stacked-M
column* mark above the wordmark `MISSION + MARKET`. The wordmark is a **thin,
uniform-stroke serif in all caps with very wide tracking** — restrained and
elegant. Assets cached in scratchpad `brand/` (`Group-350-3.png` = M+M mark,
`alt-Group-7.png` = full lockup, plus `Vector-*.svg`).

**Font they actually load:** `Instrument Sans`. Everything else is Elementor
default noise.

### Design correction (important — v1 got this wrong)

v1 assumed a dark, low-lit restaurant and invented an orange accent (`#c2703c`).
**Both are wrong.** Their photography shows a *bright, airy, light-filled* room:
floor-to-ceiling glass, sheer linen curtains, walnut tables, polished concrete,
brass frames, live greenery, and a chartreuse moss wall by the bar. The site
should be **light and warm-neutral by default**, with ink/moss used as deliberate
dark bands — not a dark-by-default restaurant cliché.

## Photography — SOLVED (2026-07-22 shoot)

A professional 2026 shoot (13 frames, 1367x2048, one landscape at 2048x1367,
same shoot as the chef portrait) was supplied by the client and is live:
homepage Signatures, a full-width band, and the gallery. `pnpm food`
re-imports it. **The earlier note that only 2 images exceeded 700px no longer
applies to food** — it still applies to the room/patio frames scraped from
WordPress.

### CRITICAL: the photographed plates contradict the published menus

The 2026 photography shows dishes that do not match the menu text migrated
from WordPress:

| Photograph | Migrated menu says |
| --- | --- |
| Salmon on pearl couscous, peppers, capers | "Spinach Scented Rice Grits" |
| Chicken over white puree, frisee, green beans | "Tomato Risotto" |
| Burrata with strawberry + rhubarb, brioche | "Heirloom Cherry Tomatoes, Aged Raspberry Balsamic" |
| Seared sliced tuna, avocado, pickled veg | only a tuna *tartare* exists |

**The dinner/lunch/brunch menus on the site are probably stale.** Homepage
featured dishes are therefore named from the plate, not the menu. Get the
current menus confirmed before launch — this is a content-accuracy risk, not
a cosmetic one.

## Older photography (WordPress scrape)

51 full-size images pulled from their WordPress uploads into scratchpad
`brand/photos/`. Client's own assets, appropriate for a rebuild. Best of set:

- `MissionMarket_AAA0088-1-1.png` (1416×948) — moss wall + brass sconce + bar. Hero candidate.
- `Mission__Market_-_Part_2_-_2024.02-2.png` (1378×994) — sunlit dining room, sheer curtains, wine display.
- `Mission-Market-Part-2-2024.02.png` (664×998) — wide dining room, portrait.
- `Patio_16.png`, `Patio-15-1.png` — patio.
- `mission_and_market_winslade_about_dining_room-*.png` — chef / room.

Not yet uploaded to Sanity.

## Built so far (commit `cf51ac3`, build + lint green)

Next.js 16 App Router + Turbopack · Tailwind 4 · Sanity CMS · TypeScript.
19 routes prerendered. See README.md.

- Sanity schema: menu/section/dish (string prices for "MP", "6pc $24"), specials,
  pages, press, jobs, gallery, homePage, siteSettings singleton.
- Content migrated + seeded (`pnpm seed`, idempotent): dinner/lunch/brunch menus
  verbatim, hours, address, links, about + private-events copy, 4 specials.
- OpenTable: native form deep-linking `restref` endpoint, NOT their iframe.
  `src/lib/opentable.ts`. Verified live — lands prefilled with party/date/time,
  `ot_source` preserved for attribution.
- Restaurant JSON-LD, 301s from all old WP URLs, sitemap, robots.
- Revalidation webhook at `/api/revalidate` (HMAC-verified).

## Redesign — LANDED (`856e31a`)

Design system rebuilt on the recovered brand values. Build, lint, contrast
audit and hours check all green. 19 routes prerendered.

New in this pass:
- `src/app/globals.css` — tokens; light by default, dark bands deliberate.
- `scripts/contrast.mjs` — WCAG AA audit, **exits non-zero on failure**.
  15/15 pass. Wire into CI before launch. Four pairs failed first run and
  were solved numerically: raw brass fails on ink (3.10:1) and as a button
  fill (4.35:1); old ink-faint was 2.68:1. **Brass on moss is impossible at
  any tint (max 2.55:1) — moss bands use cream accents only.**
- `src/components/wordmark.tsx` — stacked-M column + M+M monogram as SVG.
- `src/lib/hours.ts` + `scripts/hours-check.ts` — open/closed from CMS hours,
  handles past-midnight services. 6 cases verified.
- `src/components/open-status.tsx` — live status, computed after mount to
  avoid baking a stale time into the static build.
- `src/components/menu-json-ld.tsx` — schema.org Menu / hasMenuSection /
  hasMenuItem. Prices parsed conservatively (skips "MP", multi-price rows).
- `src/components/reserve-bar.tsx` — sticky mobile booking bar, `inert` when
  hidden so it cannot trap focus.
- `scripts/upload-images.ts` (`pnpm images`) — client photography into Sanity
  with hand-written alt text. Idempotent (matches on originalFilename).

## Research base (workflow `wf_ce6928c0-eb4`, 106 agents)

Evidence was lopsided and the honest split matters:

**Holds up (high confidence, primary sources):**
- Accessibility is the real legal exposure. Federal web-accessibility filings
  3,117 in 2025, +27% YoY. Restaurants expressly enumerated under
  42 U.S.C. 12181(7)(B). *Robles v. Domino's* — Title III reaches the site.
  No DOJ technical standard; WCAG 2.0 AA is the de facto remedy benchmark.
- schema.org `Menu`/`hasMenuSection`/`hasMenuItem` is core vocabulary.
- Google documents only a `menu` URL and **publishes no menu rich result** —
  do not sell HTML menus to the client as a rich-result win.
- Correct schema confers eligibility, not entitlement.
- **Core Web Vitals do NOT drive local/map-pack ranking** per Google's own
  docs (relevance, distance, prominence). Do not oversell performance as SEO.
- GBP ingests menus separately; the "Menu link" field is the alignment point.

**Collapsed under verification — do not cite:** every quantitative consumer
claim tested (why diners abandon sites, menu readability, booking friction,
mobile traffic share). Present those choices as design judgment, not data.

## Gotcha — ZOMBIE DEV SERVERS (corrected 2026-07-22)

**An earlier version of this file blamed a Next 16 dev cache in `.next/dev`.
That diagnosis was wrong.** The real cause of every "the site is serving stale
content" episode was **multiple `next dev` processes bound to port 4310**.
`pkill -f "next dev"` and `pkill -f next-server` did not reliably kill them, so
an old server — holding pre-change data in memory — kept answering requests
while the newly started one sat idle.

Symptom: Sanity returns correct data via both `useCdn: true` and `false`, the
project builds clean, `.next` has been deleted, and the page *still* renders
old content.

Diagnose and fix by port, not by process name:

```
lsof -ti:4310                      # more than one PID means a zombie
kill -9 $(lsof -ti:4310); sleep 3
lsof -ti:4310 || echo "port free"  # confirm BEFORE restarting
```

Deleting `.next` is neither necessary nor sufficient on its own. Always confirm
the port is free before starting a new dev server, and after starting one
confirm only the expected PIDs are listening.

## Team / chef

`person` document type, "Team" in the Studio. Featured people get the
editorial spread in `src/components/team-section.tsx`; others fall into a
compact row. Portraits need a **hotspot on the face** — the source frames are
tall and any 4:5 crop beheads the subject without it.

Chef Paul added via `pnpm chef` (`scripts/add-chef.ts`, idempotent). That
script also rewrites the About and homepage copy to drop Winslade.

## Open items

1. **Photography is the binding constraint.** Only 2 of 34 files exceed 700px
   wide (most are ~390px). Full-bleed use needs originals from the
   photographer. This gates how good the site can look.
2. Dessert + drinks menus — image-only on the old site, never extracted.
   (Happy Hour is now done; these two remain.)
3. **Chef Paul's surname and a real biography are still missing.** He is
   published as "Chef Paul" with a bio that states only what is already true
   of the restaurant's cooking — no career history was invented. The pull
   quote is also ours, not his; get it confirmed or replaced.
   The old Winslade portrait remains excluded from the gallery. Several
   frames show identifiable guests/staff and were excluded.
4. ~~Mobile not visually verified~~ **DONE 2026-07-22.** Verified at 390x844:
   homepage, menus, happy hour, about, contact, footer, sticky bar, mobile
   nav. One real bug found and fixed (sticky bar covered the footer's social
   links permanently). Note: `resize_window` resets on `navigate`, so resize
   AFTER navigating, in a single browser_batch.
   (former note: browser resize would not take
   effect in this environment. The sticky reserve bar and mobile nav are
   built but unseen. Verify before showing the client.
5. Hero PNG is ~1.9MB source; watch LCP once deployed.
6. `missionandmarket.com` ownership still unconfirmed.
7. Rotate the Sanity auth token printed to scrollback early in the session.


---

## Site review — 2026-07-22 (`0600fd5`)

225-agent review across content / a11y / SEO / code / design / responsive,
every finding adversarially verified (2-of-3 refutations killed a claim).
73 unique findings survived; the blockers and most risks are fixed.

**Worst things found** (all were live and wrong):
- Weekend `machineHours` were one continuous row → Google and the "Open now"
  badge both claimed the restaurant was open through the 3–5pm weekend
  closure. `getOpenState` now supports several services per day.
- All three booking selects had **no visible focus indicator** — `outline-none`
  in `@layer utilities` beat the `:focus-visible` ring in `@layer base`.
- Sticky reserve bar permanently covered the footer's social links on mobile.
- `text-olive` / `border-olive` and `hover:bg-brass-button-bright` were
  **undefined tokens** — third time dead tokens have shipped. If you add a
  colour class, add the token to `@theme` AND to `scripts/contrast.mjs`.
- No `og:image` anywhere → every shared link was a blank card.
- `/dessert-menu` 308'd into a hard 404.

**Deliberately NOT changed — needs the client:**
1. "Margarita Pizette" (happy hour + specials) vs "Margherita Pizza" (dinner).
   Almost certainly should be "Margherita Pizzette" — not guessed.
2. Tortellini filling differs: lunch says English pea, dinner says spinach.
   Same price, same description otherwise.
3. **No email address exists anywhere on the site**, so /private-events
   promises an events team with no way to contact them. Needs an events
   address; then add a contact block to that page.
4. Party-size select offers up to 20 while the copy says call for 9+.

**Consolidation — DONE (`43220df`).** `src/components/ui.tsx` now holds
`TextLink` (tone-based, so brass-on-dark is unwritable), `ButtonLink`,
`HoursList` and `Shell`. 16 hand-written links converted, container drift
fixed, party size capped at 8 + "9+ please call". Apostrophes normalised.

Only remaining nit: the duplicated large-party sentence on /reservations
(header intro repeats the "Large parties" section).

---

## READY TO DEPLOY — this is the next slice

Everything buildable without the client is done. The site has never left
this machine:

1. **No Vercel project, no git remote.** All commits are local.
2. `SANITY_REVALIDATE_SECRET` **is now generated** in `.env.local` — it must
   be copied into Vercel env vars, and the webhook created at
   sanity.io/manage → API → Webhooks pointing at
   `https://<domain>/api/revalidate`. Until then the client's Publish does
   nothing for up to an hour.
   Filter: `_type in ["siteSettings","homePage","menu","special","page",
   "person","pressItem","jobPosting","galleryImage"]`
3. Domain not pointed. Target is missionandmarketatl.com (in-place rebuild).

**Waiting on the client:**
- **New menu lands 2026-07-23** — do not edit menu content before it arrives;
  `pnpm seed` would overwrite it either way, so treat seed as retired now.
- An email address (blocks /private-events having any contact route).
- Chef Paul's surname + real bio; confirmation of his pull quote.
- Dessert + drinks menus.
- Press items, job openings.
- High-res originals of the ROOM/PATIO frames (food photography is now good).
- Confirm `missionandmarket.com` ownership.
- Rotate the Sanity CLI auth token printed to scrollback early on.
