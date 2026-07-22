# PICKUP — Mission + Market

**Date:** 2026-07-22 · **Branch:** main (no remote) · **Tree:** clean at `cf51ac3`
**Resume keyword:** `mm-brand-grounded-rebuild-2026-07-22`

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

## Current task (in flight)

User asked for a **full ground-up redesign** — no preset guidelines — using the
brand logo's colours and typography, optimised around: why does a patron visit a
restaurant site, and how do we get them to a reservation.

- `/deep-research` workflow running (run `wf_ce6928c0-eb4`) on restaurant web
  best practice: patron intent ranking, booking conversion, menu presentation,
  local SEO/schema, WCAG exposure, best-in-class examples.
- Next slice after research lands: rebuild the design system on the real palette
  (ink/moss/cream/brass), replace Fraunces with a thin wide-tracked serif that
  echoes the wordmark + Instrument Sans for UI, upload photography to Sanity,
  and rebuild every page around the reservation path.

## Caveats

- Mobile layout has **never been visually verified** — a browser resize failed
  to take effect. Do not claim it works.
- Dessert + drinks menus are image-only on the old site; text never extracted.
- `pnpm seed` overwrites client edits — one-time migration tool from here on.
- A Sanity auth token was printed to terminal scrollback early in the session;
  recommended rotation. The write token in `.env.local` is separate and gitignored.
