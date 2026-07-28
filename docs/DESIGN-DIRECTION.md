# Design direction — Mission + Market

_Derived 2026-07-28 from a survey of 22 upscale restaurant sites (Michelin,
James Beard, high-end independents) plus the Atlanta peer set. Values here are
measured from real sites, not chosen by eye. Where this document and the code
disagree, this document is the intent and the code is behind._

## The verdict

The engineering is already above the peer set — the token layer, contrast
solved against WCAG rather than eyeballed, HTML menus with prices, an
OpenTable deep link with real params, the accessibility work on the mobile
sheet. That is ahead of Bacchanalia, Aria and Chops.

It is **not yet in the fine-dining tier**, and the reason is narrow:
the typography was set to startup-landing-page conventions, and the stated
intent in `globals.css` is contradicted by what ships.

1. **Display type was ~1.8× the tier.** Largest hand-built display value in
   the sample is Saga at 62px. Aman's biggest heading on a 2560px screen is
   31px. Quince's h1 is 40px. **72px is the BentoBox template default** — the
   tell. This build shipped 112px, with 0.98 leading and −0.025em tracking.
   No site in the sample uses negative tracking on display; none goes under
   1.10 leading. **Fixed 2026-07-28.**
2. **The six-role scale collapsed to three.** Every interior page H1 and every
   homepage H2 were the same object at up to 64px. **Fixed 2026-07-28.**
3. **The site is dark-dominant** while `globals.css` claims light-by-default:
   18 `bg-ink` surfaces, every interior page opening on a full-bleed ink
   masthead, and roughly half the homepage's vertical area dark. Aman's cream
   ground is ~84% of its coloured area. **Not yet fixed.**

## The type ladder (implemented)

| Role | Size | Leading | Tracking | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| `text-display` | 36 → 60px | 1.15 | 0 | 300 | homepage hero only |
| `text-lead` | 28 → 40px | 1.2 | 0 | 300 | page H1 only |
| `text-section` | 24 → 30px | 1.25 | +0.01em | 400 | section H2 |
| `text-sub` | 20 → 24px | 1.35 | +0.015em | 400 | card / item H3 |
| `text-lede` | 17 → 20px | 1.65 | — | — | opening paragraph |
| body | 16px | 1.7 | +0.01em | — | everything else |

Steps: 1.5 / 1.33 / 1.25 / 1.2 / 1.25. Saga steps 62→32; Quince 48→40→24.
Cormorant 300 at ≥36px, 400 below.

## Sequence — highest leverage first

1. ~~Cap display at 60px, lead at 40px, zero tracking~~ **DONE**
2. ~~Demote homepage H2s to `text-section`~~ **DONE**
3. ~~Body leading 1.7 / +0.01em~~ **DONE**
4. **Unify the CTA.** Nine controls ship three treatments today. One `.cta`
   class: 11px / 0.18em / weight 500 / uppercase. Padding `px-9 py-4`
   standalone, `px-6 py-3` in the header. (The recent move to 0.16em was the
   right direction, 0.02em short, and applied to only two of six controls.)
5. **Moss: keep it, darken it, shrink the acreage.** The colour is validated —
   Quince ships `#1c2b01` on cream, the same decision made independently. But
   the two largest moss surfaces are fills and the smallest are rules, exactly
   inverted from the tier. Redefine `--color-moss-deep: #2b2e14` and point the
   closing band at it; raw `#464B20` becomes hairlines, `::selection` and
   small-caps labels only — never a fill over ~4rem².
6. **Brass: one fill per viewport** (the booking control), hairline everywhere
   else. Revoke from the mobile-sheet CTA and the menu tab pills. Kill the
   off-token `#7f9b4e` in `open-status.tsx`.
7. **Motion: fade only.** Delete the rise translate and `--rise`; re-stagger to
   0/60/120/180ms (currently 340ms before the last element starts). Drop the
   `scale-[1.03]` on dish images and `translate-x-1` on menu arrows. Saga ships
   zero keyframes; Le Bernardin is fade-only. Keep the hero cross-fade.
8. **Flip `PageHeader` to `paper-warm`** so interior pages stop opening dark;
   keep `bg-ink` as an opt-in for `/private-events` and `/menus/[slug]`. Target
   ~⅓ dark vertical area, down from ~½.
9. **Rail 1728 → 90rem (1440).** ⚠️ This partially undoes the recent two-rail
   rebuild — Aman constrains to 1440 on a 2560px viewport. Discuss before doing.
10. **Nav to four items plus Reserve.** Fold Specials into `/menus` + footer;
    delete `/gallery` and redistribute. Routing change — own commit, and update
    `sitemap.ts` + `CMS_ROUTED_SLUGS`.
11. Strip the box off the hero reservation form (hairline, no fill, no
    backdrop-blur); add `partysize=2` to the OpenTable fallback URL.
12. Menus: delete dietary pills and rounded tab pills (the last rounded objects
    on a zero-radius site), add one allergy footnote, restrict `pdfUrl` to wine.

## Client blockers — cannot be fixed in code

13. **Private-dining capacities.** ⚠️ **We regressed here.** The current live
    WordPress site already publishes: **Patio 75 seated · Bar Salon 20/30 ·
    Semi-Private 20/30 · Private Dining Room 40/50.** Our rebuild publishes
    none of it, with a code comment claiming the data doesn't exist. It does.
    Add a Sanity `spaces` schema and populate from their own live site, then
    get the buyout number, events email and coordinator name. Buckhead Life
    prints exactly this format and it is the only criterion a planner applies.
14. **Copy pass.** Hero headline as a declarative sentence naming the
    restaurant, not a category label. Clear "Suite 550" from the address.
    Demote "Three Alliance Center" from a display heading to an address line.
    Parking with exact economics and validation. Reservation window, walk-in
    policy, dress code. None of this is code.
15. **The shoot.** Nothing above fixes an evening interior that does not exist.
    Commission at 2500px minimum: evening room with guests, a full room dining,
    a people/process frame, four 3:4 portraits, one 3000px landscape, patio at
    dusk. Interim mitigations: seven images not fifteen, pull the band onto the
    rail rather than full-bleed, and consider grading the hero monochrome
    (Aria's move) so the resolution deficit reads as art direction.

**Be straight with the client:** items 1–12 make this the best-built restaurant
site in Buckhead. Item 15 is what makes it look like the restaurant is worth
the drive.

## Open questions the research answered

- **Cormorant Garamond** — fine as a display face, but it cannot do real small
  caps. The wordmark should load `Cormorant_SC` and set title case at 0.12em
  rather than faking caps with `text-transform` at 0.24em.
- **Moss `#464B20`** — an asset, not a liability, and validated at 3-Michelin
  level. The error was area, not hue.
- **Embedded OpenTable widget vs deep link** — the deep link we built is the
  more premium pattern. Keep it.
