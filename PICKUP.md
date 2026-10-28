# PICKUP — Mission + Market

_Updated: 2026-10-28_

## Start here
1. Read this file, then `docs/LAUNCH-CHECKLIST.md` (the domain move) and,
   for design and content decisions, `docs/REDESIGN-FALL-2026.md`.
2. `git status` and `git log -3` first — another Claude session has worked in
   this folder before (see State).
3. Working files that aren't in git are in `local/` (see `local/README.md`),
   including the checks run against production (`local/tools/`).

## Next up
1. **Test the publish webhook.** It exists (see State), but no publish has
   gone through it yet — none delivered on 2026-10-28. In the Studio, change
   one word in a happening, publish, reload `/happenings` after ~5 s, change
   it back; then `python3 -I local/tools/webhook-deliveries.py` should list
   the deliveries with status 200.
2. **The account owner's steps** below: the read-only token in Vercel, and
   the Pro plan before launch.
3. **The client's answers** as they arrive — see "Waiting on the client".

## Where we left off
The fall 2026 redesign is **live** on production
(`https://missionandmarket.vercel.app`, Vercel project `missionandmarket`,
auto-deploys `master`); missionandmarketatl.com still serves the old
WordPress site. On `master`:
- **Menus are the uploaded PDFs** (client decision: the manager won't retype
  menus, and the owners want the PDF alone — no text version, nothing to
  keep in step) — rationale and the Georgia food-code findings in
  `docs/REDESIGN-FALL-2026.md` → "Menus on the site — research and decision".
- **Security update** (Next 16.4.3, Sanity 6.20; Dependabot down to 2
  moderate, uuid, which needs a major bump), fonts served from the site, the
  Studio rendered in the browser only.
- **The Studio is cut down for the restaurant** to what they asked to change
  — menu updates, events, closure notices: every login sees only Menus (the
  PDF), Happenings and Closures, with the rest read-only, except the
  developers listed by Sanity user ID in `src/sanity/access.ts` (the
  developer signs in with GitHub). Sanity stays on the free plan (decided
  2026-10-26), where people can only be Administrators or Viewers, so the
  list, not the role, tells them apart.
- **Every live WordPress URL redirects** (`next.config.ts`; an audit of 538
  old paths from the sitemaps and the Wayback Machine).
- **Web Analytics** (cookieless) and **Speed Insights**; the banner on the
  same 1-minute refresh as the rest.
- **Polish:** each page previews as itself when shared (its own address,
  title and description); photos come at the size the screen needs; a
  publish expires the cached pages at once (through the webhook — its first
  real publish is Next up 1); WCAG AA contrast on every page; the home
  reel's still frame loads first.
- **`docs/LAUNCH-CHECKLIST.md`** — moving the domain over, step by step.

## Waiting on the client
All three Word documents have been sent (on the Desktop; sources in
`local/client-docs/`): the **menu allergen review** (the kitchen answers per
dish: allergens, raw/undercooked, spellings), the **Studio quick-start
guide** (Menus, Happenings, Closures) and the **content request** (13
items). The restaurant's logins are invited (Administrator, the free plan's
only editing role); none of the three invitations had been accepted on
2026-10-28 (sanity.io/manage → Members).

Where each answer goes — in the Studio (as the developer: the restaurant
sees only Menus, Happenings and Closures) unless marked **code**:

| Answer | Where |
| --- | --- |
| Allergens per dish | Restaurant Info → Menu notices → the allergen notice (draft wording in the review). Asterisks and the advisory on the PDFs are the designer's; the Happy Hour PDF has neither. |
| Chef | Team → a person with "Feature on the About page" (portrait, role, bio); replaces the "Meet the chef" placeholder. The previous chef's profile is hidden, not deleted. |
| Room photos | Private Dining Rooms → each room's photos; replaces "Photography to come". |
| Events contact | Restaurant Info → "Private events inquiries email". |
| Chef's tasting | Happenings → "Chef's Tasting Menu" (now "Saturday + Sunday dinner", no price). |
| Careers | Job Openings, each with an Apply link. **Code** if they give only an email — see Backlog. |
| Hours | Hours & Closures (confirmation only; matches the CMS today). |
| Happy hour walk-in only | **Code:** both "Reserve a Table" buttons in `src/app/(site)/menus/[slug]/page.tsx` show on every menu. |
| Link Zakia and TreVele | Already linked: the footer's "Sister restaurants" come from Restaurant Info → "Sister restaurants on Instagram" (the handles on the menus). If they say no, empty that list. |
| Logo vectors | **Code:** `public/brand/*.png` are used as CSS masks (`src/components/logo.tsx`; the mark in `src/components/ui.tsx` is a 53×181 PNG). |
| Domain, Google access, printed QR codes | `docs/LAUNCH-CHECKLIST.md`. |

## Needs the account owner
- **Vercel Production → `SANITY_API_READ_TOKEN`:** replace it with the
  read-only token now in `.env.local` (Sanity token "Website preview
  (read-only)", Viewer role, created 2026-10-26), then redeploy. Until then
  production still uses the Editor robot token; nothing is broken. Not yet
  changed on 2026-10-28.
- **Move the project off the Hobby plan before launch:** Vercel limits Hobby
  to non-commercial personal use; the restaurant's site needs a Pro (or the
  client's own) team — `docs/LAUNCH-CHECKLIST.md`. Still Hobby on
  2026-10-28.
- The domain move.

## Backlog
- **Careers email:** the Apply link's help text says "Leave blank to use the
  careers email", but there is no careers email field, and a posting
  without a link shows no Apply button. Fix when the client says how to
  apply.
- **After the DNS switch:** run `local/url-audit/check-legacy.py` against
  the domain (`local/README.md`).
- **Dependency majors:** `redesign/fall-2026-site` (`c0ac01b`, local) has a
  second session's upgrade (TypeScript 6, ESLint 10, @sanity/client 8, …).
  Unverified and behind `master`: rebase onto `master` in a worktree, build,
  test, ship on its own.
- **`priority` on images** is deprecated in Next 16 for `preload` (still
  works): `page-hero.tsx`, `menus/page.tsx`, `reservations/page.tsx`,
  `holiday-parties/page.tsx`. (`video-loop.tsx` has its own `priority`
  prop.)
- **Home reel weight:** `public/media/atmosphere.mp4` is 1.7 MB of the home
  page's ~2.4 MB. x264 `-preset veryslow -crf 26` (high profile, yuv420p,
  faststart, no audio) makes it 1.23 MB at VMAF 95.9; CRF 28, 0.97 MB at
  VMAF 93. Not shipped — compare on a phone first.

## State
- **`master` = live production.** Pushes go out as exact SHAs, built and
  tested in a separate worktree first. The main folder is on `master`.
- The local branch `redesign/fall-2026` must **never** be pushed (its first
  commit carried private notes).
- **Publish webhook** "Website refresh on publish" (created 2026-10-26, on):
  production dataset → `https://missionandmarket.vercel.app/api/revalidate`,
  with the trigger, filter and projection in the route's docblock. Its
  secret is `SANITY_REVALIDATE_SECRET` — `.env.local` matches Vercel
  Production (checked again 2026-10-28 with
  `local/tools/revalidate-check.cjs`). At launch, point it at the domain
  (`docs/LAUNCH-CHECKLIST.md`, step 5).
- **CMS (production dataset, shared with the live site):** written by
  `scripts/fall-2026.ts`, `menus-2026.ts`, `content-v2.ts` and `menus-pdf.ts`.
  Backups: `backups/sanity-production-20261025-2305`, `…20261026-0012` and
  `…20261026-0241.ndjson` (local, gitignored). Additive/hides only. The old
  line-by-line menu data is kept, hidden in the Studio.
- **Env (.env.local only):** `SANITY_API_WRITE_TOKEN` (Editor robot, for the
  scripts), `SANITY_API_READ_TOKEN` (Viewer, for preview),
  `TRIPLESEAT_PUBLIC_KEY`, `SANITY_REVALIDATE_SECRET` (the webhook's; the
  same in Vercel). Vercel Production has `SANITY_API_READ_TOKEN`;
  Sanity CORS allows the vercel.app URL (with credentials) and
  `localhost:3333`.

## Verified (production, 2026-10-26)
- `pnpm build` green, no symlinks in `.next`; eslint + tsc clean;
  `scripts/schedule-check.ts` passes
- All routes 200; all 398 live WordPress URLs land on their intended page,
  query strings kept; no current route caught by a redirect
- Web Analytics and Speed Insights load on the live site (both scripts 200)
- Each page shares as itself (og:url, title, description); every photo has
  a srcset
- Lighthouse, mobile, analytics blocked — performance: home 86, menus 98,
  dinner menu 77, private events 92, happenings 97, visit 94–97;
  accessibility 100 on every page (baseline in `local/lighthouse/`)
- A signed call to `/api/revalidate` refreshed `/visit` at once
  (`x-vercel-cache: REVALIDATED`); the Studio boots on production (sign-in
  screen, no console errors)

## Not verified
- A real publish through the webhook (Next up 1).
- The restaurant's view signed in (any login but the developer's; no
  invitation accepted yet), and Live preview with the read-only token once
  Vercel has it. The access rules are checked against the real schemas for
  the developer and for a restaurant Administrator.
- Safari / Firefox / real devices. On an iPhone: the home reel, each menu
  (zoom, download), Reserve a Table, the private-events form loading (don't
  submit it), the Toast order and gift-card links.

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
  `dev`/`build`; ESLint skips it) and the server, which reads only the page
  sizes (`src/lib/pdf-pages.ts`, bundled, its worker imported in-process).
- Vercel + Turbopack: never mark packages external (`serverExternalPackages`)
  — with pnpm it symlinks them into `.next` and Vercel rejects the bundle.
  The same is why the Studio renders in the browser only
  (`studio.tsx`, `ssr: false`): @sanity/vision pulls in shiki.
- Vercel's firewall answers every `/wp-*` path with a 403 before redirects
  run, so old WordPress uploads can't be redirected.
- Hours on Google Maps come from the Business Profile, not the site's
  structured data.
- Web Analytics and Speed Insights load from project-specific paths
  (`/<hash>/script.js`), not `/_vercel/…`, and skip automated browsers
  (`navigator.webdriver`): to check them with Playwright, hide that flag and
  block the event calls so no test visit is recorded.
- Full-page Playwright captures misplace fixed elements; verify the header and
  mobile bar with viewport screenshots.
- `@sanity/icons` v5: import per icon (`@sanity/icons/Bell`).
- Commit messages: write them to a file and use `git commit -F <file>` — a
  heredoc chained with `&& \` runs the message lines as shell commands.
- Keep private-conversation details out of the repo — it is public.

## Resume keyword
`mm-launch-prep-2026-10-28`
