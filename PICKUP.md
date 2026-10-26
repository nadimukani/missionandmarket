# PICKUP — Mission + Market @ redesign/fall-2026-site

_Updated: 2026-10-26_

## Where we left off
Second design pass done: immersive luxury layout (no ticker), wider type
(Noto Serif Display + Jost), SEO page structure, 2026 menus, and a single
source for every fact (Hours & Closures, menus with print versions, featured
dishes from the menus, Studio Live preview). Hours now print as one aligned
timetable everywhere (footer, home, Visit, Reservations): days column,
opening times right-aligned to a shared dash, closing times left-aligned.
Built, linted, tested and screenshot-verified at 1440 and 390 on
`localhost:3333`. **Not pushed** — the
push needs the user's go-ahead (public repo). `master` and the live demo are
untouched. Rationale in `docs/REDESIGN-FALL-2026.md`; research in
`docs/COMPETITIVE-SCAN-2026-10.md`.

## State
- **Branch:** `redesign/fall-2026-site` — local commits on `master`, clean
  (no private notes, no secrets). The other local branch `redesign/fall-2026`
  must **never** be pushed (its first commit carried private notes).
- **CMS (production dataset, shared with the live demo):** written by
  `scripts/fall-2026.ts`, `scripts/menus-2026.ts`, `scripts/content-v2.ts`.
  Backups first: `backups/sanity-production-20261025-2305.ndjson` and
  `…20261026-0012.ndjson` (local, gitignored). Additive/hides only.
- **Env (.env.local only):** `SANITY_API_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`
  (same Editor robot — swap for a Viewer token), `TRIPLESEAT_PUBLIC_KEY`.
- **Untracked `web/`** appeared 2026-10-26 00:36 (a create-next-app scaffold) —
  not created by this session; left untouched and uncommitted.

## Verified
- `pnpm build` green (30 pages) · eslint + tsc clean · `scripts/schedule-check.ts` passes
- All routes 200; `/contact` → `/visit`; brunch/old WP URLs redirect; 404 ok
- No overflow / console errors on every page at 1440×900 and 390×844
- Tripleseat form 16159 + reCAPTCHA render (private events + holiday parties)
- Draft-mode enable route rejects missing/bad secrets (401); Studio boots

## Not verified
- Logged-in Studio + Live preview (needs the user's Sanity login)
- A real Tripleseat submission (would create a lead — coordinate with client)
- Safari / Firefox / real devices; any deployed URL

## Before the client demo
1. User approves push of `redesign/fall-2026-site` → Vercel preview.
2. Vercel env (Preview): `SANITY_API_READ_TOKEN` (ideally a Viewer token).
3. Sanity CORS: add the preview origin **with credentials** (only
   `localhost:3333` is allowed today).
4. Invite the restaurant's editors; optionally set the revalidate webhook.

## Caveats
- The content scripts **overwrite** the docs they manage — don't re-run once
  the restaurant edits in the Studio.
- Draft mode adds stega markers to strings: clean anything compared or put in
  URLs/metadata (`cleanKeys` in queries.ts; `stegaClean` in metadata/JSON-LD).
- `draftMode()` can't run in `generateStaticParams` — use `getMenuSlugs()`.
- Full-page Playwright captures misplace fixed elements; verify the header and
  mobile bar with viewport screenshots.
- `@sanity/icons` v5: import per icon (`@sanity/icons/Bell`).
- Keep private-conversation details out of the repo — it is public.

## Resume keyword
`mm-luxury-pass-2026-10-26`
