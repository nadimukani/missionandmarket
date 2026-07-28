# PICKUP — Mission + Market @ master

_Updated: 2026-07-28 — checkpoint BEFORE the fix phase_

## Where we left off
Full review of the build under Opus 5 + ultracode. Verdict: **do not rebuild**.
The engineering is sound; the problems are a half-consolidated layout system,
art direction, missing motion, and the fact that this has **never been
deployed**. Now executing the fix pass.

## State
- **Branch:** `master` @ `7abcad4` — **clean**, no remote, all commits local
- Dev: `pnpm dev -p 4310` running
- `pnpm lint` clean · `pnpm build` **fully green with network — 21 routes incl.
  `/opengraph-image`** (the old "og build fails" caveat was sandbox-only)

## Hard facts (verified — do not re-derive)
| | |
| --- | --- |
| Live site being replaced | missionandmarketatl.com (WordPress + Elementor) |
| Sanity | project `x2izrrun`, dataset `production`, Studio at `/studio` |
| OpenTable rid | **1005016** — deep link verified end-to-end |
| Address / phone | 3550 Lenox Rd NE, Suite 550, Atlanta GA 30326 · 404.948.2927 |
| Chef | **Executive Chef Paul** (surname UNKNOWN) |
| Palette | ink #231F1F · moss #464B20 · cream #F0E9D7 · brass #8A6445 |
| Fonts | Cormorant Garamond (display) + Instrument Sans (body) |
| **User's review viewport** | **3440×1440 ultrawide** — always verify here |

## Findings from this review (evidence-backed)
1. **Never deployed.** No Vercel project, no git remote. The real blocker.
2. **Five rail widths, two gutter scales.** `Shell` (`src/components/ui.tsx:180`)
   was built to be the single rail and is used in only 3 places. The rest
   hand-roll: `max-w-[88rem]` (home/header/footer), `max-w-7xl`
   (gallery/specials/contact), `max-w-6xl` (`menus/[slug]`), `max-w-5xl`
   (`reservations`), `max-w-3xl` (careers/press/cms body). Gutters split
   `lg:px-10` vs `lg:px-8`. Navigating Home → Gallery shifts the rail 64px.
3. **Ultrawide.** 1408px cap = **41% of a 3440px viewport**. Prior sessions only
   ever verified at 1440/1024/390.
4. **Hero tells the wrong story** — empty chairs behind sheer curtains; subject
   of the frame is drapery. Reads corporate-lobby, which is this restaurant's
   actual perception risk (it is inside an office tower). Headline also sits
   over the brightest part of the frame at only ~35% scrim.
5. **`/private-events` is one image + two paragraphs** — highest-margin page.
   No capacities, no rooms, no enquiry route. `settings.email` is empty, which
   also silently guts `/careers`.
6. **No motion anywhere.** Client asked for minimal visual flow.
7. Menu content still the migrated WordPress text; client's new menu was due
   **2026-07-23** and has not landed.

**Checked and NOT a bug:** hero is a 7.8 MB PNG at origin but Sanity
`auto=format` serves **98 KB AVIF** to real browsers.

## In flight
Investigation workflow `wf_18fed0af-79c` (4 parallel agents: layout audit, CMS
asset inventory, motion research, defect sweep). Transcript + journal under
`~/.claude/projects/.../subagents/workflows/wf_18fed0af-79c/`.

Task list (TaskCreate #1–#5): rails → motion → hero/order → private events →
swept defects.

## Caveats
- **Chrome MCP screenshots fire before images paint.** A black hero in a
  screenshot is a timing artifact, not a broken image — re-`zoom` to confirm.
- `resize_window` is refused while the window is maximized; the viewport stays
  3440. Measure with `javascript_tool` rather than trusting the shot size.
- Headless-shell `Page.captureScreenshot` hangs on this machine
  (`captureBeyondViewport` and full-height both). Use the Chrome MCP.
- Watch the exit-code trap: `pnpm build | tail` reports **tail's** exit code.
- **`pnpm seed` is retired** — do not reseed menus until the new menu lands.

## Client-pending (none guessable)
Deploy target · new menu · **an email address** · Chef Paul surname + bio ·
dessert & drinks menus · press · jobs · private-dining capacities · high-res
ROOM/PATIO originals · confirm `missionandmarket.com` ownership · rotate the
Sanity CLI token printed to scrollback in an earlier session.

## Resume keyword
`mm-fix-pass-2026-07-28`
