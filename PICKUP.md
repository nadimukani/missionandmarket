# PICKUP — Mission + Market @ master

_Updated: 2026-07-23 00:05_

## Where we left off
Ground-up rebuild of **missionandmarketatl.com** (Buckhead restaurant, client
work under Orion), replacing a WordPress/Elementor site. The site is
functionally complete, builds green, reviewed and mobile-verified. Recent work
is footer polish from client feedback: the hours block, then the reserve
duplication, then the **footer navigation** — all clean now. The app has
**never been deployed**; that's the next real milestone.

## State
- **Branch:** `master` @ `e150fdc` — **clean** (no remote, all commits local)
- Dev: `pnpm dev` — currently running on **port 4310** (kill zombies by port —
  see caveats).

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
- **Footer nav split** into two headed groups — **Explore** (6 site pages) and
  **More** (Order Takeout, Gift Cards, Careers, Press) — on a 5-column grid, so
  columns balance instead of one 10-item stack towering over the rest —
  `src/components/site-footer.tsx` (commit `e150fdc`)
- Prior in this thread (already committed): compact footer hours + dropped the
  duplicate in-body Reserve on /contact (`849a1d0`); hours two-column alignment
  (`9d0ef52`).

## Verified
- `pnpm lint` clean · `pnpm build` green — **compiled 11.2s, TS pass, 21/21
  static pages** incl. `/opengraph-image` (needs network — see caveats)
- Footer rendered via CDP at **1440 / 1024 / 390**: five even columns on
  desktop, clean vertical stack on mobile with the sticky Reserve bar clearing
  content. Shot script: `<scratchpad>/footer-shot.mjs` (targets :4310).

## Not verified
- Nothing outstanding for this change. (The 26-image client deliverable set in
  `~/Desktop/mission-market-preview/` predates the footer edits — regenerate
  with `shoot.mjs` before sending, but point it at the running port.)

## Caveats
- **`/opengraph-image` build fetch**: the route fetches a cover image from
  `cdn.sanity.io` during prerender. In the sandbox the build worker has **no
  outbound network**, so the build fails ONLY on that route (`fetch failed`).
  Run the build with network (or on Vercel) and it's green. Not a code issue.
- Watch the exit-code trap: `pnpm build | tail` reports **tail's** exit code,
  not the build's. Capture `$?` right after `pnpm build`, unpiped.
- **Zombie dev servers**, not a Next cache, cause every "stale content" episode.
  A screenshot showing old UI is almost always a pre-edit tab/build. Fix by
  port: `lsof -ti:PORT` (>1 PID = zombie) → `kill -9 $(lsof -ti:PORT)`.
- **`pnpm seed` is retired** — the client's NEW menu was due **2026-07-23**; do
  not edit or reseed menu content until it actually lands, it would be
  overwritten. Migrated WordPress menu text is likely stale.
- Chrome MCP extension was disconnected this session; CDP screenshot scripts
  (`footer-shot.mjs`, `shoot.mjs`) are the reliable path.

## Client-pending (blocks a credible launch — none guessable)
1. **Deploy**: no Vercel project / git remote. `SANITY_REVALIDATE_SECRET` is in
   `.env.local` but must go into Vercel env + a Sanity webhook created (filter
   must include `person`).
2. **New menu** (was 2026-07-23) — replaces migrated WordPress text.
3. **Email address** — none exists; /private-events promises an events team with
   no contact route.
4. Chef Paul surname + bio; dessert & drinks menus; press; jobs; high-res
   ROOM/PATIO originals (food photos already good).
5. Confirm `missionandmarket.com` ownership; rotate the Sanity CLI token printed
   to scrollback earlier.

## Next best slice
Deploy to Vercel on a preview URL + wire the revalidate secret and Sanity
webhook — turns everything else into the client's decisions and surfaces
anything that breaks outside dev. Do NOT touch menus until the new menu lands.

## Resume keyword
`mm-footer-nav-split-2026-07-23`
