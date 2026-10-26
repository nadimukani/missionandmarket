# PICKUP — Mission + Market @ menus-ux

_Updated: 2026-10-26_

## Where we left off
The fall 2026 redesign is **live** on production
(`https://missionandmarket.vercel.app`, Vercel auto-deploys `master`), pushed
2026-10-26 with the user's go-ahead. This branch, `menus-ux` (off `master`),
adds the research-led menus rework and drops the home page's Visit section,
which repeated the footer. Built, linted, tested and click-tested on
`localhost:3333`; **not pushed** — pushing `master` deploys production, so it
needs the user's go-ahead. Rationale for the menus in
`docs/REDESIGN-FALL-2026.md` → "Menus on the site — research and decision".

## State
- **`master` = `b6cb4d8`** (live). `menus-ux` is a fast-forward of it.
- **Branch `redesign/fall-2026-site`** also carries `315ee78` (sanity → 6.20,
  made by a second Claude session working in the main folder) and that
  session's uncommitted dependency upgrades (Next 16.4.3, React 19.3.1,
  TypeScript 6, ESLint 10, @sanity/client 8). Unverified here; not on
  `master`. The other local branch `redesign/fall-2026` must **never** be
  pushed (its first commit carried private notes).
- **CMS (production dataset):** written by `scripts/fall-2026.ts`,
  `scripts/menus-2026.ts`, `scripts/content-v2.ts`. Backups:
  `backups/sanity-production-20261025-2305.ndjson` and
  `…20261026-0012.ndjson` (local, gitignored). Additive/hides only.
- **Env (.env.local only):** `SANITY_API_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`
  (same Editor robot — swap for a Viewer token), `TRIPLESEAT_PUBLIC_KEY`.
  Vercel Production has `SANITY_API_READ_TOKEN`; the Studio is connected on
  the production URL.
- **Untracked `web/`** (a blank create-next-app starter, 2026-10-26 00:36) —
  not part of the site; left untouched and uncommitted.

## Verified (menus-ux, production build on localhost:3333)
- `pnpm build` green · eslint + tsc clean · `scripts/schedule-check.ts`
  passes (incl. what's on now / serving now)
- All routes 200; unknown menu 404; no overflow or console errors on home,
  menus, all five menus, visit, reservations, private events at 1440 and 390
- Switcher fits all five at 360px; switching from mid-page lands on the new
  menu's title; Back returns; section links land below the switcher
- "Serving now" checked with the browser clock at Tue 12:30 ET (Lunch,
  Drinks, Dessert) and Sat 3:30 PM ET (none)
- Restaurant JSON-LD: `menu` → `/menus`, `hasMenu` × 5; Dinner Menu JSON-LD
  has a price on all 30 dishes

## Not verified
- Logged-in Studio + Live preview on this branch
- Safari / Firefox / real devices

## Before the client demo
1. User approves pushing `menus-ux` to `master` (production).
2. Invite the restaurant's editors; optionally set the revalidate webhook.
3. Client questions in the redesign doc (Happy Hour walk-in? allergen notice
   on happy hour / drinks / dessert? more dish photographs?).

## Caveats
- The content scripts **overwrite** the docs they manage — don't re-run once
  the restaurant edits in the Studio.
- Draft mode adds stega markers to strings: clean anything compared or put in
  URLs/metadata (`cleanKeys` in queries.ts; `stegaClean` in metadata/JSON-LD).
- `draftMode()` can't run in `generateStaticParams` — use `getMenuSlugs()`.
- Anything time-of-day (open now, serving now) is computed in the browser —
  pages are cached, so never decide it on the server.
- Full-page Playwright captures misplace fixed elements; verify the header and
  mobile bar with viewport screenshots.
- `@sanity/icons` v5: import per icon (`@sanity/icons/Bell`).
- Keep private-conversation details out of the repo — it is public.

## Resume keyword
`mm-menus-ux-2026-10-26`
