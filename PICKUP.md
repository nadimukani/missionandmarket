# PICKUP — Mission + Market @ menus-ux

_Updated: 2026-10-26_

## Where we left off
The fall 2026 redesign is **live** on production
(`https://missionandmarket.vercel.app`, Vercel auto-deploys `master`), pushed
2026-10-26 with the user's go-ahead, then the menus rework (`menus-ux`,
live as `2a3a92c`): **the uploaded PDF is the menu** (client decision: the
manager won't retype menus) — a chooser, a pinned switcher, each PDF drawn in
the page with tap-to-zoom, a text version read from the PDF on the server,
the menu notices under every menu — and the home page's Visit section, which
repeated the footer, is gone. Verified on production. Rationale and the
Georgia food-code findings in `docs/REDESIGN-FALL-2026.md` → "Menus on the
site — research and decision".

## State
- **`master` = live production** (Vercel auto-deploys it). Pushes go out as
  exact SHAs built and tested in a separate worktree first.
- **Branch `redesign/fall-2026-site`** also carries `315ee78` (sanity → 6.20,
  made by a second Claude session working in the main folder) and that
  session's uncommitted dependency upgrades (Next 16.4.3, React 19.3.1,
  TypeScript 6, ESLint 10, @sanity/client 8). Unverified here; not on
  `master`, and now behind it — rebase/merge onto `master` before shipping. The other local branch `redesign/fall-2026` must **never** be
  pushed (its first commit carried private notes).
- **CMS (production dataset, shared with the live site):** written by
  `scripts/fall-2026.ts`, `menus-2026.ts`, `content-v2.ts` and now
  `menus-pdf.ts` (attached the Lunch + Dinner PDFs, intros, menu notices,
  Home → Signature dishes). Backups: `backups/sanity-production-20261025-2305`,
  `…20261026-0012` and `…20261026-0241.ndjson` (local, gitignored).
  Additive/hides only. The live (`master`) code ignores the new fields, so it
  is unaffected until `menus-ux` ships. The old line-by-line menu data is
  kept, hidden in the Studio.
- **Env (.env.local only):** `SANITY_API_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`
  (same Editor robot — swap for a Viewer token), `TRIPLESEAT_PUBLIC_KEY`.
  Vercel Production has `SANITY_API_READ_TOKEN`; the Studio is connected on
  the production URL.
- **Untracked `web/`** (a blank create-next-app starter, 2026-10-26 00:36) —
  not part of the site; left untouched and uncommitted.

## Verified (menus-ux, production build on localhost:3333)
- `pnpm build` green · eslint + tsc clean · `scripts/schedule-check.ts`
  passes (incl. what's on now / serving now)
- All routes 200; a menu without a PDF (drinks, dessert) or unknown → 307 to
  `/menus`; `/menus/*/print` → the menu; no overflow or console errors at
  1440 and 390; Studio boots with the new schema (no schema errors)
- PDF pages render in ~1s (desktop) / <1s (phone), first page on the first
  screen; tap opens the zoom viewer (2400px pages), Esc closes
- Text version in the server HTML (every dish); notices on all three menus
- "Serving now" checked with the browser clock at Tue 12:30 ET and Sat 3:30 PM

## Not verified
- Logged-in Studio + Live preview on this branch
- Safari / Firefox / real devices

## Before the client demo
1. Invite the restaurant's editors; optionally set the revalidate webhook.
2. From the kitchen: the major-allergen list (for the PDFs and Restaurant
   Info → Menu notices) and which dishes are raw/undercooked (asterisks in
   the PDFs); notices on the Happy Hour sheet; PDF spellings.

## Caveats
- The content scripts **overwrite** the docs they manage — don't re-run once
  the restaurant edits in the Studio.
- Draft mode adds stega markers to strings: clean anything compared or put in
  URLs/metadata (`cleanKeys` in queries.ts; `stegaClean` in metadata/JSON-LD).
- `draftMode()` can't run in `generateStaticParams` — use `getMenuSlugs()`.
- Anything time-of-day (open now, serving now) is computed in the browser —
  pages are cached, so never decide it on the server.
- pdf.js runs in two places: the browser viewer (worker copied to
  `public/pdf.worker.min.mjs` by `scripts/copy-pdf-worker.mjs`, run by
  `dev`/`build`) and the server text reader (`serverExternalPackages`).
- Vercel + Turbopack: never mark packages external (`serverExternalPackages`)
  — with pnpm it symlinks them into `.next` and Vercel rejects the bundle.
  A one-off font error ("next/font/google queries have exactly one entry")
  cleared on a plain redeploy; if it recurs, self-host the two fonts.
- Full-page Playwright captures misplace fixed elements; verify the header and
  mobile bar with viewport screenshots.
- `@sanity/icons` v5: import per icon (`@sanity/icons/Bell`).
- Keep private-conversation details out of the repo — it is public.

## Resume keyword
`mm-menus-pdf-2026-10-26`
