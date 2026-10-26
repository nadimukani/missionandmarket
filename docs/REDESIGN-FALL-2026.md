# Mission + Market — fall 2026 redesign

_Branch `redesign/fall-2026`, built 2026-10-25/26. Supersedes the visual layer
described in `DESIGN-DIRECTION.md`; the CMS, OpenTable deep link, hours engine
and revalidation webhook from the previous build are kept._

## Brief

A fresh design and build with modern language, using the Sept 25 shoot
(28 photos, 4 reels). Presentable for the client review, together with the
client-editing side the restaurant asked for (menus, events, closure notices).
**Rule: nothing invented.** Every fact on the site traces to a source below;
anything unsourced is a labelled placeholder.

## The concept (second pass)

**Quiet luxury in warm light: few words, big photographs, generous space.**
The first pass read too editorial ("like a blog") and its condensed display
face was too narrow; this pass is immersive and image-led, organised as
dedicated pages for search rather than one long scroll.

- **Palette is the restaurant's own** (client requirement: keep the current
  site's colours): moss `#464B20`, cream `#F0E9D7`, paper `#F7F5F0`, ink
  `#231F1F`, bronze `#8A6445`, deep teal `#0B2F31`. The competitive scan found
  it unoccupied in the Atlanta set (everyone else is dark-and-gold or white).
- **Type:** Noto Serif Display, light — the display face their current site
  already uses, wide and high-contrast — with Jost, a geometric sans that
  echoes the logo's wordmark, for labels, navigation and text.
- **Signature details:** the logo's chevron mark as a section ornament;
  centred compositions; tracked capitals; hairlines; square corners; dish
  names in the display serif with the price beside them, descriptions in
  plain text.
- **Motion:** the reels, slow photographic hover zoom, a once-only entrance
  fade on page openings. No scroll-triggered reveals.

## Site map (SEO)

| Route | Purpose |
| --- | --- |
| `/` | Full-screen opening: three vertical reels edge to edge (one on phones), logo, "Modern American Restaurant · Buckhead, Atlanta" as the H1 · welcome · menu gateway (Lunch, Dinner, Happy Hour) · the bar (teal) · signature dishes · private dining with capacities · seasonal band · happenings · gallery mosaic (the footer carries address, hours and phone) |
| `/menus` | Chooser: every menu with when it's served and a live "Serving now" — all on the first screen |
| `/menus/{dinner,lunch,happy-hour}` | Each menu is its own page (title, description) under a pinned switcher: the uploaded PDF drawn in the page, tap to zoom, the notices |
| `/menus/[slug]/print` | Retired (redirects to the menu): the PDF is the printable menu |
| `/private-events` | Private dining: rooms, capacities, Tripleseat inquiry |
| `/holiday-parties` | Seasonal landing page; exists only while the seasonal happening is live, then redirects to private dining |
| `/happenings` | Happy hour, tasting menu, Beef Wellington, holiday parties |
| `/about`, `/visit`, `/reservations`, `/gallery`, `/careers` | `/contact` and `/contact-us` redirect to `/visit` |
| `/studio` | Sanity Studio, full-screen, with **Live preview** |

Every interior page has one descriptive H1, a unique title and description,
canonical URL and BreadcrumbList data; the home page carries Restaurant data
with opening hours **and holiday hours** from the schedule.

## Owner editing — one source for every fact

The brief: when the restaurant changes something, it must change everywhere,
and the site must never show a stale copy.

- **What the restaurant sees.** They asked to change three things
  themselves: menu updates, events and closure notices. So every login gets
  just **Menus** (the PDF only), **Happenings** and **Closures**, in one
  tool, with everything else read-only — except the developers listed by
  Sanity user ID in `src/sanity/access.ts`, who get the whole Studio, Live
  preview and the query console. The project stays on Sanity's free plan,
  where people can only be Administrators or Viewers, so the restaurant's
  login is an Administrator too: the list, not the role, tells them apart.
- **Hours & Closures** (new singleton). Services with days + times picked from
  dropdowns; closures with a date, "closed" or special hours, and an optional
  banner. Everything derives from it: footer and Visit hours, each menu's
  "served" line, "Open now", the booking panel's times (closed days are
  disabled), the opening and holiday hours in the structured data, and an
  automatic closure banner a week ahead. (Google Maps and Search show the
  hours from the Google Business Profile, so closures go there too.)
- **Menus.** The uploaded PDF is the menu: the manager updates a menu by
  uploading the designer's new PDF — nothing to retype, line by line or
  anywhere else (client decision, 26 Oct). A menu appears on the site once it
  has a PDF. Each menu links to its service for its hours.
- **Signature dishes** (Home page → Signature dishes): a short list with
  photographs, each linked to the menu it's on; take a dish off when it
  leaves the menu.
- **Menu notices** (Restaurant Info → Menu notices): the allergen and
  raw-or-undercooked notices, shown under every menu.
- **Happenings** can take their hours from a service (Happy Hour) or their own
  wording; one-time events hide themselves after their date.
- **Live preview** (developers). Inside the Studio, the real site: click
  any text to open the field behind it, edit, publish. Published changes
  reach the public site within a minute without any webhook (instantly with
  it).

## Menus (2026)

Transcribed from the restaurant's Dinner 2026 and Lunch 2026 PDFs (Aug 2026):
Dinner 30 items, Lunch 29, Drinks 40, Dessert 8 (+ Happy Hour 9 from the 2026
happy-hour sheet). Drinks + desserts are one shared menu each, taken from the
Dinner PDF's back page (client decision). Spelling corrected from the print,
pending the restaurant's confirmation: Gigandes → Gigantes, Parmagiano →
Parmigiano, Anchioves → Anchovies, Mayonaise → Mayonnaise, Spritzs →
Spritzes, Brulée → Brûlée, Bokchoy → Bok Choy, a la Brava → à la Brava.

The Lunch PDF's back page differs from the Dinner one in four places — the
Evora spritz's ingredients, Monday Night 404 Lager on draft, Espresso gelato,
and the tasting menu ("Saturdays at 4 PM" vs "Sat + Sun dinner"). The site
follows the Dinner version; confirm with the restaurant.

## Menus on the site — research and decision (26 Oct 2026)

How 15 restaurant sites present menus (Chops, Aria, Atlas, Le Bilboquet,
Storico Fresco, Bistro Niko, St. Cecilia, Lucian, Kyma, Umi, Gramercy Tavern,
Le Bernardin, COTE, Union Square Cafe, Carbone): 9 swap menus on the same
screen under tabs, 2 give each menu its own page, 1 slides a drawer over the
page, 3 are PDF only. None has a "Print" button; none opens on the menu being
served; none puts photos beside every dish. Best-practice sources (NN/g,
Google Search Central, Baymard, W3C) agree: real HTML, one URL per menu, no
modal or overlay for long content (it breaks Back, sharing and phones), and
the menu on the first screens.

Then the client's constraint: the manager updates a menu by uploading the
designer's PDF and will not retype menus line by line, so **the PDF is the
menu**, and the owners want the PDF alone — nothing beside it. The
research's warnings about PDFs on phones (unreadable, Android can't embed
them) are handled in the build instead:

- **`/menus` is a chooser**: every menu with its hours on the first screen
  (rows on a phone, photographs across on desktop). The restaurant's PDFs
  are Lunch, Dinner (each with drinks and desserts on page 2) and Happy Hour;
  a menu appears once it has a PDF.
- **Picking a menu opens it in place** under a pinned switcher shared by every
  menu page (`menus/layout.tsx`); each keeps its own address and title.
- **The PDF is drawn in the page** with pdf.js, sharp at any width, on every
  phone; tapping a page opens it full screen with pinch and double-tap zoom
  (PhotoSwipe). The download link names the format and size.
- **No text version.** One read from the PDF on the server ("Read this menu
  as text") was tried and removed at the owners' request: the page is the
  PDF.
- **"Serving now"** is worked out in the browser from Hours & Closures. It
  highlights; it never redirects (pages are cached).
- **Notices** from Restaurant Info sit under every menu, in capitals at a
  legible size — so the happy-hour sheet, which has none, is covered online.
- **Search:** the Restaurant JSON-LD points `menu` at `/menus` and lists each
  menu in `hasMenu`.

Georgia food code (DPH Chapter 511-6-1, revised 12 Feb 2025 to the 2022 FDA
Food Code; checked 26 Oct 2026):

- **Allergens** (.04(7)(d)3.): guests must be told in writing which of the
  nine major allergens (milk, eggs, fish, crustacean shellfish, tree nuts,
  wheat, peanuts, soy, sesame) are in the food, naming the type of fish,
  shellfish or nut. DPH's guidance gives examples ("The following major food
  allergens are used as ingredients: …" or "Contains …"); a general "tell
  your server" line does not say which allergens are present. The kitchen
  needs to supply the list — for the PDFs and for the website's notice.
- **Raw or undercooked** (.04(7)(e)): each such dish must be marked (an
  asterisk, or a description such as "hamburgers (can be cooked to order)")
  and the asterisk tied to the reminder footnote — in capitals, 8 pt or
  larger. The Lunch and Dinner PDFs carry the footnote but mark no dish; the
  Happy Hour sheet has neither. Candidates for the chef to confirm: tuna
  tataki, burgers and sliders cooked to order, a raw-egg Caesar dressing,
  steaks (intact whole-muscle steaks can be exempt).

Also for the client: the PDFs carry their own spellings (Gigandes,
Parmagiano, Anchioves…); after the domain moves, point the Google Business
Profile menu link at `/menus`.

## Media

Photographs: Foster Peters (embedded copyright). Delivered in **Adobe RGB** —
converted to sRGB before upload, or they render washed-out wherever the ICC
profile is stripped.

**The duck dish is excluded everywhere**, at the restaurant's request.
Stills #9, #10, #12, #17, #18 dropped; the reels were re-cut around it.

| Use | Source |
| --- | --- |
| Hero reel 1 + About stills | "Dishes and Atmosphere", re-cut to the room/bar/guest shots (3.17–5.84s + 6.38–10.09s), duck and logo end-card removed |
| Hero reel 2 + bar section | "Fall Cocktails", unedited |
| Dish loop (kitchen, menus) | "Dishes and Atmosphere" overhead sequence minus the duck (0.58–1.13s removed), reordered to open on dessert |
| Not used | "10 Seconds at Mission" (duck in 4 shots); "New Dish Features" (split-screen opening crops badly at 4:5) |
| 20 stills + 6 reel frames | Uploaded to Sanity with alt text and credit line; gallery order set by `scripts/fall-2026.ts` |

Reels are encoded H.264 720×1280, silent, faststart, full-range → limited
range converted (the source is 10-bit full-range HEVC, which most browsers
outside Safari cannot play). 0.3–1.7 MB each. Off-screen loops don't
download until scrolled to; reduced-motion visitors get the poster frame; each
loop has a pause control (WCAG 2.2.2).

## Content sources

- **Live site (Oct 2026)** — address, phone, hours (minus brunch), parking
  wording, room capacities and features, 20–140 guests + full buyout, 5,300
  sq ft, chef's counter, OpenTable Diners' Choice 2024, driving directions,
  careers copy and roles, Instagram/Facebook, Toast links.
- **Client direction (Oct 2026)** — no weekend brunch; no half-off wine; the
  weekend tasting experience; the holiday-party line "December is filling up
  fast…" (the restaurant's own copy); a chef change in October.
- **Happy Hour 2026 PDF** (supplied by the client) — items, prices, "bar +
  patio", weekdays 3–6.
- **Photographs** — alt text and dish names describe what is on the plate,
  matched to the current menu documents.

Removed because unsourced: "parties of nine or more, please call", "complimentary
valet / three hours free parking", the "Cocktail Classes" special, `priceRange
$$$` and "Seafood" in structured data, "covered" patio, "lower level".

## CMS changes (Sanity `x2izrrun/production`)

Backup taken first: `backups/sanity-production-20261025-2305.ndjson` (local,
gitignored). Every change is a hide or an addition — nothing deleted.

- New **Announcement Banner** singleton (on/off, message, link, optional
  start/stop times — a closure notice comes down by itself).
- **Happenings** (`special`) gain kind + event date + "hide after" date.
- New **Private Dining Rooms** (`space`) with seated/reception capacities.
- "Hide from website" on menus, team, gallery, rooms.
- Menus gain a cover photograph; Tripleseat ID/key live in Restaurant Info →
  Integrations (the key is public by design — it is in their live page source).
- Brunch menu, half-price wine, Sunday brunch buffet, Cocktail Classes, the
  previous chef's profile and the 20 older gallery images: **hidden**, not
  deleted.
- Studio desk reordered around the three jobs the restaurant asked to own:
  Announcement Banner · Menus · Happenings · Private Dining Rooms, then
  Hours & Info, Home Page, Gallery, Team, Pages, Jobs, Press.

`scripts/fall-2026.ts` is idempotent and re-runnable — but it **overwrites**
the documents it manages, so don't re-run it after the client starts editing.

## Placeholders + what we need from the client

1. **Chef** — name, title, bio, headshots.
2. **Semi-Private and Private Dining Room photography** — the only room images
   that exist are 2024 crops at 280–570 px wide, too small to use.
3. **Logo vector files** (SVG/AI/EPS). The site uses their PNGs as masks.
4. **Chef's tasting** — price and details (their site shows both $65 and $68).
5. **Careers** — how to apply (email or link).
6. **Confirm**: hours as published (minus brunch) · whether the Ginger
   Marinated Duck Steak is still on the dinner menu · dessert menu (none in the
   CMS) · an events contact/email and any event packet, minimums or menus for
   private dining · whether to cross-link Zakia and TreVele.

## Before the client demo

1. **Sanity CORS.** Done for `https://missionandmarket.vercel.app` (with
   credentials). The domain is added at launch — `LAUNCH-CHECKLIST.md`.
2. **Invite the restaurant's login** at sanity.io/manage → Members, as
   Administrator (the free plan's only editing role). The Studio still shows
   them only Menus, Happenings and Closures.
3. **Revalidation webhook** — confirm sanity.io/manage → API → Webhooks points
   at the deployment's `/api/revalidate` with the filter in
   `src/app/api/revalidate/route.ts`, or edits wait out the 1-minute floor.

## Demo script (≈2 minutes)

Sign in with any login other than the developer's (`src/sanity/access.ts`)
to show what the restaurant will see; the developer's login sees the whole
Studio.

1. **Menus → Dinner** → upload the new PDF → Publish → within a minute the
   dinner page shows it.
2. **Happenings → +** → a one-time event with a date and "hide after" →
   Publish → it appears on Happenings and the home page.
3. **Closures** → add a closure: "Thanksgiving", Nov 26, closed → Publish →
   the banner appears (within a week of the date), Visit lists it, "Open
   now" and the booking panel skip the day.
