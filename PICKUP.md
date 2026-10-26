# PICKUP — Mission + Market @ redesign/fall-2026-site

_Updated: 2026-10-26_

## Where we left off
Built the **fall 2026 redesign** — new visual system, the Sept 25 shoot, a
client-editable CMS — on branch `redesign/fall-2026-site` (one clean commit on
`master`). Built, linted and screenshot-verified locally at 1440 and 390.
**Not pushed yet**: the push needs the user's go-ahead (the repo is public).
`master` and the live demo are untouched. Full rationale in
`docs/REDESIGN-FALL-2026.md`; competitor research in
`docs/COMPETITIVE-SCAN-2026-10.md`.

## State
- **Branch:** `redesign/fall-2026-site` — clean, not pushed. The local branch
  `redesign/fall-2026` holds the same tree with working history; it must
  **not** be pushed (its first commit carried private notes, scrubbed after).
- **CMS (production dataset — shared with the live demo):** written by
  `scripts/fall-2026.ts`. Backup first at `backups/sanity-production-20261025-2305.ndjson`
  (local, gitignored). Changes are additive/hides; the old build keeps working.
- **Secrets:** `SANITY_API_WRITE_TOKEN` and `TRIPLESEAT_PUBLIC_KEY` live only
  in `.env.local` (gitignored). Neither appears in any commit.

## Verified
- `pnpm build` green (20 routes) · `eslint src scripts` clean · `tsc` clean
- All pages 200; old WordPress URLs and `/menus/brunch` redirect; 404 works
- Headless Chrome: no horizontal overflow and no console errors on all 10
  pages at 1440×900 and 390×844; all images load; hero reels autoplay, off-
  screen loops stay paused; mobile action bar shows/hides correctly
- Tripleseat form (lead form 16159) renders restyled; reCAPTCHA renders
  (we load it — Tripleseat's `document.write` is ignored by browsers)
- Studio boots to the Sanity login on `localhost:3333` (the only allowed CORS origin)

## Not verified
- **No real Tripleseat submission** — it would create a lead in the
  restaurant's account. Coordinate a test with them.
- **Studio editing end-to-end** — needs a Sanity login (user's account).
- Safari / Firefox, real iOS devices
- Anything on a deployed URL — no preview exists yet

## Blockers before the client demo
1. Push `redesign/fall-2026-site` (user decision) → Vercel preview.
2. **Sanity CORS**: add the preview origin with "Allow credentials" at
   sanity.io/manage → x2izrrun → API → CORS. Only `localhost:3333` is allowed
   today, so the Studio has never worked on any deployed URL.
3. Invite the restaurant's editors in Sanity; check the revalidate webhook.

## Caveats
- `scripts/fall-2026.ts` **overwrites** the docs it manages — don't re-run once
  the client edits in Studio.
- `@sanity/icons` v5: import per icon (`@sanity/icons/Bell`); root named
  imports type-check but fail at runtime.
- Full-page Playwright captures show the fixed mobile bar mid-page — capture
  artifact, behaviour verified separately.
- Keep private-conversation details out of the repo — it is public.

## Next best slice
Get the push approved, add the preview origin to Sanity CORS, log into the
Studio on the preview and rehearse the demo script in the redesign doc.

## Resume keyword
`mm-fall-redesign-2026-10-26`
