# PICKUP — Mission + Market @ master

_Updated: 2026-07-28_

## Where we left off
Full review + fix pass under Opus 5. Verdict was **do not rebuild** — the
engineering was sound; the problems were a half-consolidated layout system,
art direction, no motion, and never having been deployed. The first three are
now fixed and committed at `ceee9e3`. **Deploy is the remaining milestone.**

## State
- **Branch:** `master` @ `ceee9e3` — clean except two dead files (below)
- `pnpm lint` clean · `pnpm build` green — 21 routes incl. `/opengraph-image`
- Dev: `pnpm dev -p 4310`

## Hard facts (verified — do not re-derive)
| | |
| --- | --- |
| Sanity | project `x2izrrun`, dataset `production`, Studio at `/studio` |
| OpenTable rid | **1005016** |
| Address / phone | 3550 Lenox Rd NE, Suite 550, Atlanta GA 30326 · 404.948.2927 |
| Chef | **Executive Chef Paul** (surname UNKNOWN) |
| Palette | ink #231F1F · moss #464B20 · cream #F0E9D7 · brass #8A6445 |
| **User's review viewport** | **3440×1440 ultrawide — always verify here** |

## What landed (`ceee9e3`)
- **Two rails, both fluid.** `rail` (108rem cap) + `measure` (40rem content),
  `--gutter` / `--section` / `--section-lg` clamps in `globals.css`. Replaced
  six widths × two gutters across 24 hand-rolled containers. Fixed grids →
  `auto-fit`; `columns-2/3` → `columns-[26rem]/[22rem]`.
  Rail at 3440 is now **1728px (50%)**, was 1408 (41%).
- **Homepage reordered** — hours band moved from 3rd to 2nd-last; grounds
  alternate paper / paper-warm.
- **Hero re-cast** in Sanity onto the plated-food frame; og image too;
  multi-image cross-fade implemented (`components/hero-images.tsx`).
  Scrim deepened to hold ≥5:1 on the headline.
- **Motion:** load-in stagger (hero + every masthead) + hero cross-fade +
  hover refinements. All CSS, no JS.
- **/private-events** rebuilt: spaces grid from real categorised photography,
  working enquiry CTA. **No capacity or room name is asserted** — none exist.
- **~15 defects fixed** (see commit body), incl. two blockers: mobile menu
  locking the page at the lg crossover, and `mailto:undefined` on Apply.

## Sanity writes made this session (reversible)
`homePage.heroImages`, `homePage.bandImage`, `siteSettings.ogImage`.
Backup of previous values:
`<scratchpad>/sanity-backup.json` — **copy it somewhere durable if it still
matters**, the scratchpad is session-scoped.

## Not verified
- Reduced-motion path not exercised in-browser (code path is a media query
  around every animation; not visually confirmed).
- Firefox / Safari not opened at all. Chrome only.
- Mobile (390px) not re-checked after the rail change — **do this before
  showing the client**.
- The two `columns-[Xrem]` masonry changes were not eyeballed at 3440.

## Dead files pending deletion approval
`src/components/reveal-observer.tsx` and `src/lib/reveal.ts` — abandoned
scroll-reveal attempts, untracked, safe to `rm`.

## Caveats
- **Scroll-reveal: do not retry casually.** Two implementations failed by
  leaving sections invisible; `animation-timeline: view()` also froze the
  renderer >45s on the homepage. Full notes in `globals.css` motion block.
- **Chrome MCP screenshots fire before images paint** — a dark hero in a shot
  is a timing artifact. Re-`zoom` to confirm.
- `resize_window` is refused while maximized; viewport stays 3440. Measure
  with `javascript_tool`.
- Headless-shell `Page.captureScreenshot` hangs on this machine.
- `pnpm build | tail` reports **tail's** exit code.
- **`pnpm seed` is retired** — do not reseed menus.
- Careless regex sweeps over `src/**/*.tsx` damaged prose in comments this
  session. If doing a bulk rename, anchor on `className="..."` only.

## Client-pending (none guessable)
Deploy target · new menu (was due 2026-07-23, still not landed) · **an email
address** · Chef Paul surname + bio · private-dining capacities + room names ·
dessert & drinks menus · press · jobs · high-res ROOM/PATIO originals ·
confirm `missionandmarket.com` ownership · rotate the Sanity CLI token printed
to scrollback in an earlier session.

**Photography is the ceiling.** Of 24 assets exactly one clears 2048px; half
the interiors are low-res exports lifted from a design deck. Reordering the
library bought a real improvement; it does not buy a great hero. An evening
shoot with guests in the room, shot wide at full resolution, is the fix.

## Next best slice
Deploy to Vercel on a preview URL + `SANITY_REVALIDATE_SECRET` in env + the
Sanity webhook. Then re-verify at 390px and in Safari.

## Resume keyword
`mm-rails-hero-defects-2026-07-28`
