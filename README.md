# Mission + Market

Rebuild of missionandmarketatl.com — Buckhead, Atlanta.

Next.js 16 (App Router, Turbopack) · Tailwind CSS 4 · Sanity CMS · TypeScript.

## Running locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

The Studio is embedded at `/studio` — no separate deploy.

## Environment

Put these in `.env.local` (gitignored). The Sanity project is `x2izrrun`,
dataset `production`.

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | always |
| `NEXT_PUBLIC_SANITY_DATASET` | always |
| `SANITY_API_READ_TOKEN` | Live preview and draft mode in the Studio (a Viewer token) |
| `SANITY_REVALIDATE_SECRET` | publish-to-live webhook |
| `NEXT_PUBLIC_SITE_URL` | optional — the canonical origin; defaults to Vercel's production domain |
| `SANITY_API_WRITE_TOKEN` | the content scripts (`pnpm seed` etc.) only |

## Content

Everything is edited in the Studio; no deploy is needed for any of it. The
restaurant's editors (Editor role) see only what they asked to change: Menus
(upload the PDF), Happenings and Closures. Administrators see the rest — hours,
restaurant info and links, the banner, the home page, rooms, team, gallery
(`src/sanity/access.ts`).

`pnpm seed` re-imports the content migrated from the old WordPress site. It is
idempotent (fixed `_id`s, `createOrReplace`), so re-running overwrites rather
than duplicating — but it will also overwrite client edits to those documents.

## Reservations

The site does not embed OpenTable's iframe widget. `src/lib/opentable.ts` builds
a deep link into OpenTable's `restref` endpoint with party size, date and time
prefilled, so the guest lands on the confirmation step. `ot_source` is set so
covers attribute to the restaurant's own site in OpenTable reporting.

The restaurant ID lives in the CMS (Restaurant Info → Reservations), not in code.

## Publishing changes live

Sanity webhook → `POST /api/revalidate`, HMAC-verified with
`SANITY_REVALIDATE_SECRET`. Configure at sanity.io/manage → API → Webhooks with
trigger on create/update/delete. Queries also carry a 1-minute ISR floor so a
missed webhook self-heals.

## Launch

Moving missionandmarketatl.com over: `docs/LAUNCH-CHECKLIST.md`.
