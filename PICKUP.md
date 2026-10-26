# PICKUP — Mission + Market

_Updated: 2026-10-26_

## Where we left off
The fall 2026 redesign is **live** on production
(`https://missionandmarket.vercel.app`, Vercel auto-deploys `master`);
missionandmarketatl.com still serves the old WordPress site. `master` is
`3311609`:
- **Menus are the uploaded PDFs** (client decision: the manager won't retype
  menus) — rationale and the Georgia food-code findings in
  `docs/REDESIGN-FALL-2026.md` → "Menus on the site — research and decision".
- **Security update** (Next 16.4.3, Sanity 6.20; Dependabot down to 2 medium,
  uuid, which needs a major bump), fonts served from the site, the Studio
  rendered in the browser only.
- **Every live WordPress URL redirects** (`next.config.ts`; an audit of 538
  old paths from the sitemaps and the Wayback Machine).
- **Speed Insights**; the banner on the same 1-minute refresh as the rest.
- **`docs/LAUNCH-CHECKLIST.md`** — moving the domain over, step by step.

## Waiting on the client
Word documents kept outside the repo: the menu allergen review (the kitchen
answers per dish: allergens, raw/undercooked, spellings), a Studio quick-start
guide, and a content request (chef, room photos, events contact, logo vectors,
tasting menu, careers; confirm hours, happy hour, sister restaurants; domain
and Google access, editors' emails, printed QR codes).

## Needs the account owner
- Invite the restaurant's editors at sanity.io/manage → Members.
- Enable Vercel Web Analytics, then add `@vercel/analytics`.
- Swap `SANITY_API_READ_TOKEN` for a Viewer token (it is the Editor robot).
- The domain move — `docs/LAUNCH-CHECKLIST.md`.

## State
- **`master` = live production.** Pushes go out as exact SHAs, built and
  tested in a separate worktree first.
- **Branch `redesign/fall-2026-site`** (local) carries a second session's
  upgrade to the latest of everything (`c0ac01b`: TypeScript 6, ESLint 10,
  @sanity/client 8, …). Unverified and behind `master` — rebase onto
  `master` and test before shipping any of it. The local branch
  `redesign/fall-2026` must **never** be pushed (its first commit carried
  private notes).
- **CMS (production dataset, shared with the live site):** written by
  `scripts/fall-2026.ts`, `menus-2026.ts`, `content-v2.ts` and `menus-pdf.ts`.
  Backups: `backups/sanity-production-20261025-2305`, `…20261026-0012` and
  `…20261026-0241.ndjson` (local, gitignored). Additive/hides only. The old
  line-by-line menu data is kept, hidden in the Studio.
- **Env (.env.local only):** `SANITY_API_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`,
  `TRIPLESEAT_PUBLIC_KEY`. Vercel Production has `SANITY_API_READ_TOKEN`;
  Sanity CORS allows the vercel.app URL (with credentials) and
  `localhost:3333`.
- **Untracked `web/`** (a blank create-next-app starter) — not part of the
  site.

## Verified (`3311609`, production)
- `pnpm build` green, no symlinks in `.next`; eslint + tsc clean;
  `scripts/schedule-check.ts` passes
- All routes 200; all 398 live WordPress URLs land on their intended page,
  query strings kept; no current route caught by a redirect
- Speed Insights in the bundle, its script served

## Not verified
- Logged-in Studio + Live preview since the security update (needs a
  signed-in editor)
- Safari / Firefox / real devices

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
  `dev`/`build`; ESLint skips it) and the server text reader
  (`src/lib/pdf-text.ts`, bundled, its worker imported in-process).
- Vercel + Turbopack: never mark packages external (`serverExternalPackages`)
  — with pnpm it symlinks them into `.next` and Vercel rejects the bundle.
  The same is why the Studio renders in the browser only
  (`studio.tsx`, `ssr: false`): @sanity/vision pulls in shiki.
- Vercel's firewall answers every `/wp-*` path with a 403 before redirects
  run, so old WordPress uploads can't be redirected.
- Hours on Google Maps come from the Business Profile, not the site's
  structured data.
- Full-page Playwright captures misplace fixed elements; verify the header and
  mobile bar with viewport screenshots.
- `@sanity/icons` v5: import per icon (`@sanity/icons/Bell`).
- Keep private-conversation details out of the repo — it is public.

## Resume keyword
`mm-launch-prep-2026-10-26`
