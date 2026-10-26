# Competitive scan — restaurant websites (Oct 25–26, 2026)

_Research for the fall 2026 redesign. Sites were loaded directly (raw HTML and
headless Chrome at 1440×900 and 390×844); every observation carries its URL.
Recommendations are marked as such and were filtered against the
"nothing invented" rule before any reached the build — see
`REDESIGN-FALL-2026.md` for what was adopted._

## 0. Mission + Market's current site (missionandmarketatl.com)

- WordPress/Elementor (credits restoexp.com). Vimeo background hero (16:9
  desktop, 9:16 mobile); logo plus MENU and RESERVATIONS buttons only — no
  positioning line, no lunch/happy hour/events on the first screen.
- Desktop nav is hamburger-only, 11 items; Private Events is ninth.
- Specials carousel prices the four-course tasting at $68 on one slide and $65
  on its duplicate; every slide's button is "book your table", including the
  bar-only happy hour.
- No H1 on home, /private-events/, /specials/, /reservations/. Home
  og:description is scraped nav text.
- /private-events/: 20–140 guests + buyout; Patio 75 seated · Bar Salon 20/30 ·
  Semi-Private 20 (two tables)/30 · PDR 40/50; one photo each; two-step
  Tripleseat form; no packet, menus, minimums or named contact; intro leads
  with baby showers. The word "holiday" appears nowhere on home, events,
  specials or reservations.
- Menus are HTML with prices (good) but every dish name is an H2. Happy hour
  shows times only — no menu, no prices.
- About still says TreVele and Zakia are "set to open in 2022".

## A. Atlanta competitors

| Site | Reservation | Private dining | Menus | Notes |
| --- | --- | --- | --- | --- |
| Aria — aria-atl.com | OpenTable button widget on its own page; 9+ routed to group dining | Buyout 65/100; semi-private up to 20 (12 min, Mon–Thu); floor-plan PDF + form | HTML, dated, price ranges per course | Gold announcement bar; mono photography; James Beard nomination banner |
| Atlas (St. Regis) — atlasrestaurant.com | Links out to OpenTable | Whole room 90; Tavistock 16; Chef's Table 12; Papillon 8; tiered bar booking | HTML tasting, no prices | Five-slide promo carousel, no single promise |
| The Chastain — thechastainatl.com | Link wrapped in an email-security redirect | Six spaces in prose, no capacities; Tripleseat/email | PDFs from 2023–24 | Clearest day-part story (café → lunch → dinner); dated build |
| Bistro Niko — bistroniko.com | Embedded OpenTable widget page | None on site | PDF | Sticky bottom bar (menu, phone, address, reserve, order); "midday menu"; business-lunch positioning |
| Chops Lobster Bar — chopslobsterbar.com | Branded location modal → OpenTable | Plaza 40/60; Boardroom 18; named events manager; event package PDF; Tripleseat | HTML tabs + PDFs | Strongest build in the set; pause control on the slideshow |
| St. Cecilia — stceciliaatl.com | Links out to OpenTable | Event-space and event-menu PDFs, no capacities | PDFs | Chef's counter sold via OpenTable Experiences |
| Le Bilboquet — lebilboquetatlanta.com | Links out to OpenTable | One paragraph, no rooms | HTML with prices | Animated illustrated storefront |
| Storico Fresco / Y Hospitality — yhospitality.com | Group drawer before OpenTable | One form across venues (11+ guests), 48-hour reply promise | HTML with prices | The only full-bleed looping video hero in the set; FAQ covers parking and dress code |
| Lucian Books and Wine — lucianbooksandwine.com | Resy, links hard-coded to 2025 dates | Buyout 40/50, deposit, named coordinator | PDFs | Candid policies page |
| Le Colonial — lecolonial.com/atlanta | Branded on-site form → OpenTable | Lotus Room 12; Treehouse 30; catering | HTML, dietary tags, no prices | The only named happy hour in the set |
| Clark's Steakhouse (opened Apr 2026) — clarkssteak.com | Links out to OpenTable | Policy Room 18; published minimums ($1,000 lunch / $2,000 dinner); prix-fixe PDF | PDFs | Weekday lunch 11–2:30 |
| Luella (opened Nov 2025) — luellaatl.com | Links out to OpenTable | 10–45 private, buyout to 150; organised by occasion including **Holiday Parties** | — | The only Atlanta site selling holiday parties as of Oct 25 |

Sister sites (same ownership group as M+M, both on Popmenu): **Zakia** lists
rooms with capacities (Overlook 10–24, Salon 25–40, Conservatory 35–75, full
restaurant 200–300); **TreVele** rooftop + PDR, 10–250. Zakia presents capacity
more clearly than M+M's current site.

Dropped from the candidate list: Lazy Betty (now Midtown tasting menu), Kevin
Rathbun Steak (Inman Park); Kyma covered via its group.

## B. National benchmarks

- **COTE** (cotekoreansteakhouse.com; Barrel/Pentagram) — location pages carry
  local menus and group details; tiered event formats with capacities.
- **COQODAQ** (coqodaq.com) — full-bleed video plus a portrait video module;
  sticky mobile booking bar.
- **Gramercy Tavern** (gramercytavern.com) — lists the specific private-dining
  dates still open Oct–Dec; event kit PDF.
- **Girl & the Goat** (girlandthegoat.com/chicago) — address/hours/contact block
  directly under the hero; Reserve repeated after sections.
- **Death & Co** (deathandcompany.com) — private events as a dedicated
  conversion path with capacities and event menus.
- **Pizzeria Beddia** (pizzeriabeddia.com) — groups of 7–12 book a set format
  themselves.

## C. Synthesis

**Table stakes (of 12 Atlanta sites):** OpenTable 11; Reserve as a header
button 10; private dining in nav 10; Tripleseat 6 confirmed (+ M+M, Zakia,
TreVele); serif display over sans body; hours on the homepage.

**Gaps M+M can exploit:**
1. The holiday season is barely being sold — only Luella names it; nobody
   shows open dates.
2. Event pages are thin — capacities missing at four; only 4 of 12 offer a
   forwardable packet; nobody combines photos, capacities and menus per room
   in HTML.
3. Lunch and after-work are under-sold — no happy-hour menus with prices found
   anywhere in the set.
4. Video is barely used — one hero loop; nobody uses vertical video beyond a
   hero.
5. Five of twelve are PDF-only for menus.
6. Upkeep is poor across the set (stale PDFs, dated booking links, conflicting
   numbers).
7. Voice is mostly generic luxury superlatives; the lines that stick are short
   and concrete.

**Recommendations (researcher's, not observations) — and what happened to them:**
- On-brand booking step before OpenTable → **built** (booking panel).
- Self-hosted vertical loops with poster, inline playback, pause control,
  reduced-motion fallback → **built**.
- Seasonal holiday strip after the hero; capacities on the homepage; HTML
  happy-hour menu with prices; concrete, numeric voice → **built**.
- Per-room minimums, A/V details, sample menus, open holiday dates, event
  packet, named events lead, packages, deposit terms → **need client data**
  (listed in the redesign doc's client asks).
- Feature Chef Ian Winslade; brunch day-part card; Beef Wellington nights →
  **not adopted**: outdated (new chef; no weekend brunch) or unconfirmed.
