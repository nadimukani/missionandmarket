# PICKUP — Mission + Market @ main

_Updated: 2026-07-22 22:13_

## Where we left off
Ground-up rebuild of **missionandmarketatl.com** (Buckhead restaurant, client
work under Orion), replacing a WordPress/Elementor site. The site is
functionally complete, builds green, reviewed and mobile-verified. This session
was mostly polish driven by client feedback on the **hours display** and
**footer** — both are now clean. The app has **never been deployed**; that's the
next real milestone.

## State
- **Branch:** `main` @ `849a1d0` — **clean** (no remote, all commits local)
- Dev: `pnpm dev` (kill zombies by port — see caveats). Prod preview this
  session ran on `pnpm exec next start --port 4311`.

## Hard facts (verified — do not re-derive)
| | |
| --- | --- |
| Live site being replaced | missionandmarketatl.com (WordPress + Elementor) |
| Sanity | project `x2izrrun`, dataset `production`, Studio at `/studio` |
| OpenTable rid | **1005016** — deep link verified end-to-end |
| Toast ordering | order.toasttab.com/online/mission-market-three-alliance-center-3550-lenox-rd-ne |
| Address / phone | 3550 Lenox Rd NE, Suite 550, Atlanta GA 30326 · 404.948.2927 |
| Chef | **Executive Chef Paul** (surname UNKNOWN) — replaced Ian Winslade (fully removed) |
| Palette | ink #231F1F · moss #464B20 · cream #F0E9D7 · brass #8A6445 (from their assets) |
| Fonts | Cormorant Garamond (display) + Instrument Sans (body) |

## What changed this session
- **Hours grouped by service** so "Dinner" prints once, not 5× — `src/components/ui.tsx` `HoursList`
- **Hours aligned** two-col (day left / time same-x), `max-w-xs` + `gap-x-6`, `whitespace-nowrap` on time. Measured 0-overflow/0-wrap at 1440/900/390 — `src/components/ui.tsx:151`
- **Footer hours compacted**: live OpenStatus + service names + "Full hours & directions" link instead of the full per-day block on every page — `src/components/site-footer.tsx:65`
- **Removed duplicate in-body "Reserve a table"** on /contact (header + sticky bar already carry it) — `src/app/contact/page.tsx:106`
- Earlier this session: split-service weekend hours + full site-review fixes (git ff43265, 43220df) and the shared-UI consolidation.

## Verified
- `pnpm lint` clean · `pnpm build` green (19 routes) · `scripts/contrast.mjs` 16/16
- `scripts/hours-check.ts` all gap cases correct (incl. 3–5pm weekend closure)
- Hours layout measured via CDP at 3 widths (0 overflow, 0 wrap); eyeballed desktop + mobile
- Footer eyeballed after compacting — clean, balanced

## Not verified
- The regenerated 26-image deliverable set (`~/Desktop/mission-market-preview/`) — a background regen was mid-run at session end. **Re-run `shoot.mjs` before sending to the client.**

## Caveats
- **Zombie dev servers**, not a Next cache, cause every "stale content" episode. `pkill -f "next dev"` is unreliable. Fix by port: `lsof -ti:PORT` (>1 PID = zombie) → `kill -9 $(lsof -ti:PORT)` → confirm free BEFORE restarting.
- **`pnpm seed` is retired** — the client's NEW menu lands **2026-07-23**; do not edit or reseed menu content, it would be overwritten.
- Screenshots: use `<scratchpad>/shoot.mjs` (seam-correct). `shoot-m/one.mjs` are quick variants with a tile-seam artifact. `captureBeyondViewport` hangs in Chrome 150 → the script tiles + stitches with ImageMagick.

## Client-pending (blocks a credible launch — none guessable)
1. **Deploy**: no Vercel project / git remote. `SANITY_REVALIDATE_SECRET` is in `.env.local` but must go into Vercel env + a Sanity webhook created (filter must include `person`).
2. **New menu** (2026-07-23) — replaces migrated WordPress text, which is likely stale (photographed dishes contradict it).
3. **Email address** — none exists; /private-events promises an events team with no contact route.
4. Chef Paul surname + bio; dessert & drinks menus; press; jobs; high-res ROOM/PATIO originals (food photos already good).
5. Confirm `missionandmarket.com` ownership; rotate the Sanity CLI token printed to scrollback earlier.

## Next best slice
Deploy to Vercel on a preview URL + wire the revalidate secret and Sanity webhook — turns everything else into the client's decisions and surfaces anything that breaks outside dev. Do NOT touch menus until the 2026-07-23 menu lands.

## Resume keyword
`mm-footer-hours-cleanup-2026-07-22`
