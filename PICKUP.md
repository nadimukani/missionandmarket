# PICKUP — Mission + Market @ master

_Updated: 2026-07-29_

## Where we left off
Reviewed the whole build under Opus 5, verdict **do not rebuild** — then landed
a large fix pass, shipped it to GitHub and Vercel, and finally researched what
upscale restaurant sites actually do. That research contradicted my own craft
work and I corrected it. The site is live and buildable; the remaining work is
specced in `docs/DESIGN-DIRECTION.md` (items 4–12) plus three client blockers.

## State
- **Branch:** `master` @ `48238fd` — **clean**, pushed to origin
- **Repo:** https://github.com/nadimukani/missionandmarket — **PUBLIC** (user's
  explicit call; no secrets anywhere in history, verified)
- **Live:** https://missionandmarket-nadimukanis-projects.vercel.app
  Project `missionandmarket` / `nadimukanis-projects`, GitHub-connected so
  pushes to `master` auto-deploy.

## What changed this session
- **Layout rebuilt on two fluid rails** — `rail` + `measure` utilities replaced
  six widths × two gutters across 24 hand-rolled containers —
  `src/app/globals.css`, `src/components/ui.tsx:204`
- **~15 defects fixed**, two of them blockers: mobile menu locked the page at
  the `lg` crossover; Apply built `mailto:undefined` — `ceee9e3`
- **Hero re-cast in Sanity** onto the plated-food frame + og image; multi-image
  cross-fade implemented — `src/components/hero-images.tsx`
- **LQIP blur-up on every photograph** — `src/sanity/queries.ts:17`, `2b21ef8`
- **Craft pass**: de-boxed, corners squared, CTAs to tracked caps — `34248be`
- **Type scale reset to researched values** after the survey contradicted the
  values I chose by eye — `48238fd`
- **`docs/DESIGN-DIRECTION.md`** — the survey, the ladder, sequence, blockers

## Verified
- `pnpm lint` → clean · `pnpm build` → green, 21 routes incl. `/opengraph-image`
- Production deploy Ready; `/`, `/menus/dinner`, `/private-events`, `/gallery`,
  `/contact` all 200 on the live alias
- Rail measured in-browser at the real 3440px viewport: 1728px (was 1408)
- No env/secret files on the remote after push

## Not verified
- **Nothing since `8044213` has been seen in a browser.** The Chrome extension
  disconnected and never came back — type scale, craft pass and type reset are
  build-verified only. **Look at the live URL first thing.**
- Safari, Firefox, reduced-motion: never exercised
- Mobile 390px not re-checked since the rail change

## Caveats
- **Scroll-reveal: do not retry casually.** Two implementations failed by
  leaving sections invisible; `animation-timeline: view()` also froze the
  renderer >45s. Notes in the `globals.css` motion block.
- **Dead files got committed** by a `git add -A src`: `src/lib/reveal.ts` and
  `src/components/reveal-observer.tsx` (a stub). Delete both.
- **Duplicate repo** `nadimukani/mission-and-market` still exists — needs
  `gh auth refresh -h github.com -s delete_repo` before it can be removed.
- **12 Dependabot alerts** (6 high) on the public repo.
- Sanity CMS writes made this session (hero/band/og); undo values are committed
  at `sanity-hero-backup.json`.
- Careless regex sweeps over `src/**/*.tsx` damaged prose in comments earlier;
  anchor bulk edits on `className="..."` only.
- Chrome MCP screenshots fire before images paint — a dark hero is a timing
  artifact, re-`zoom` to confirm.

## Next best slice
Open the live URL and check the new type ladder at 3440px, then do
`DESIGN-DIRECTION.md` item 4 (unify the nine CTAs on one `.cta` class) — it is
the cheapest remaining item and three treatments currently ship at once.

## Resume keyword
`mm-type-reset-design-direction-2026-07-29`
