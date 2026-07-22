# PICKUP — Mission + Market

**Date:** 2026-07-22 · **Branch:** main (no remote) · **Tree:** clean at `856e31a`
**Resume keyword:** `mm-redesign-landed-2026-07-22`

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
| Chef / partners | Ian Winslade; Jonathan + Tony Akly |
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

## Photography — SOLVED, no longer a blocker

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

## Gotcha discovered

Next's data cache persists **outside** `.next/cache`. After a CMS write, the
site kept rendering pre-upload (empty) content until `rm -rf .next`. Deleting
only `.next/cache` was not enough. In production the Sanity webhook handles
this; in dev, wipe `.next` after seeding or uploading.

## Open items

1. **Photography is the binding constraint.** Only 2 of 34 files exceed 700px
   wide (most are ~390px). Full-bleed use needs originals from the
   photographer. This gates how good the site can look.
2. Dessert + drinks menus — image-only on the old site, never extracted.
3. Chef portrait needs a signed release; several frames show identifiable
   guests/staff and were excluded from the gallery.
4. **Mobile still not visually verified** — browser resize would not take
   effect in this environment. The sticky reserve bar and mobile nav are
   built but unseen. Verify before showing the client.
5. Hero PNG is ~1.9MB source; watch LCP once deployed.
6. `missionandmarket.com` ownership still unconfirmed.
7. Rotate the Sanity auth token printed to scrollback early in the session.
