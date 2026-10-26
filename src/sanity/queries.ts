import { groq, stegaClean } from 'next-sanity'

import { restaurantToday } from '@/lib/opentable'
import type { Schedule } from '@/lib/schedule'

import { client, sanityFetch } from './client'
import type {
  Announcement,
  FeaturedDish,
  GalleryImage,
  HomePage,
  JobPosting,
  Menu,
  MenuSummary,
  Page,
  Person,
  SiteSettings,
  Space,
  Special,
} from './types'

/**
 * In the Studio preview every string carries invisible click-to-edit markers
 * (stega). That is right for text people read, wrong for values the code
 * compares or builds URLs from — `kind === 'seasonal'` would silently fail.
 * Those fields are cleaned here, once, so components can trust them.
 */
function cleanKeys<T extends object>(item: T, keys: (keyof T)[]): T {
  const out = { ...item }
  // stegaClean only strips the invisible markers, so the value keeps its type.
  for (const k of keys) if (out[k] != null) out[k] = stegaClean(out[k]) as T[keyof T]
  return out
}

/**
 * Every image projection goes through this.
 *
 * `lqip` is a ~500-byte base64 thumbnail Sanity generates for each asset on
 * upload. It costs nothing to ask for and it is what stops a photograph
 * snapping in from blank — the blur is on screen at first paint, holding the
 * exact frame the real file will occupy, and dissolves when it arrives.
 */
const IMAGE = groq`{
  ...,
  "alt": coalesce(alt, asset->description, ""),
  "lqip": asset->metadata.lqip
}`

const SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  name, tagline, shortDescription, phone, email, neighborhood, mapsUrl,
  parkingNote, address, hours, machineHours,
  openTableRid, openTableUrl, orderUrl, giftCardUrl,
  privateEventsEmail, social, ogImage, relatedAccounts,
  tripleseatLeadFormId, tripleseatPublicKey,
  allergenNotice, rawFoodNotice
}`

export async function getSettings() {
  const s = await sanityFetch<SiteSettings | null>({ query: SETTINGS_QUERY, tags: ['siteSettings'] })
  if (!s) return s
  // Values that become URLs, IDs or attributes rather than visible text.
  return {
    ...cleanKeys(s, ['openTableRid', 'mapsUrl', 'orderUrl', 'giftCardUrl', 'tripleseatLeadFormId', 'tripleseatPublicKey', 'phone']),
    social: stegaClean(s.social),
    relatedAccounts: stegaClean(s.relatedAccounts),
  }
}

const ANNOUNCEMENT_QUERY = groq`*[_type == "announcement" && _id == "announcement"][0]{
  enabled, message, linkLabel, linkUrl, startsAt, endsAt
}`

export function getAnnouncement() {
  return sanityFetch<Announcement | null>({
    query: ANNOUNCEMENT_QUERY,
    tags: ['announcement'],
    // A closure notice is time-critical; keep the floor short.
    revalidate: 300,
  })
}

/** A menu is on the site once it has a PDF (and isn't hidden). */
const MENU_LIST_QUERY = groq`*[_type == "menu" && hidden != true && defined(pdf.asset)] | order(order asc, title asc){
  _id, title, "slug": slug.current, availability, services, order, image${IMAGE}
}`

/** Published slugs only — for generateStaticParams, which runs at build time
 *  with no request (so no draft mode to check). */
export function getMenuSlugs() {
  return client.fetch<string[]>(
    groq`*[_type == "menu" && hidden != true && defined(pdf.asset) && defined(slug.current)].slug.current`,
    {},
    { perspective: 'published', stega: false, next: { revalidate: 60, tags: ['menu'] } },
  )
}

export async function getMenuList() {
  const menus = await sanityFetch<MenuSummary[]>({ query: MENU_LIST_QUERY, tags: ['menu'] })
  return menus.map((m) => cleanKeys(m, ['slug', 'services']))
}

const MENU_QUERY = groq`*[_type == "menu" && slug.current == $slug && hidden != true && defined(pdf.asset)][0]{
  _id, title, "slug": slug.current, availability, services, intro, image${IMAGE},
  "pdf": pdf.asset->{ url, originalFilename, size }
}`

export async function getMenu(slug: string) {
  const menu = await sanityFetch<Menu | null>({ query: MENU_QUERY, params: { slug }, tags: ['menu', `menu:${slug}`] })
  if (!menu) return menu
  return { ...cleanKeys(menu, ['slug', 'services']), pdf: stegaClean(menu.pdf) }
}

/** Hours & Closures — the one schedule everything derives from. Cleaned of
 *  stega markers: the site computes with these values (times, day codes),
 *  it doesn't print them verbatim. */
const SCHEDULE_QUERY = groq`*[_type == "hours" && _id == "hours"][0]{
  services[]{ name, note, periods[]{ days, opens, closes } },
  closures[]{ label, date, endDate, kind, opens, closes, message, showBanner, bannerDaysBefore }
}`

export async function getSchedule(): Promise<Schedule> {
  const data = await sanityFetch<Schedule | null>({ query: SCHEDULE_QUERY, tags: ['hours'] })
  return stegaClean(data ?? { services: [], closures: [] })
}

/** Home page → Signature dishes: a short list the owner keeps, each with a
 *  photograph and the menu it's on (no link if that menu is hidden). */
const FEATURED_QUERY = groq`*[_type == "homePage"][0].signatureDishes[defined(image.asset) && defined(name)]{
  name, description, image${IMAGE},
  "menuTitle": select(menu->hidden != true && defined(menu->pdf.asset) => menu->title),
  "menuSlug": select(menu->hidden != true && defined(menu->pdf.asset) => menu->slug.current)
}`

export async function getFeaturedDishes(): Promise<FeaturedDish[]> {
  const dishes = await sanityFetch<FeaturedDish[] | null>({ query: FEATURED_QUERY, tags: ['homePage', 'menu'] })
  return (dishes ?? []).map((d) => ({ ...d, menuSlug: stegaClean(d.menuSlug) }))
}

const HOME_QUERY = groq`*[_type == "homePage"][0]{
  heroEyebrow, heroHeading, heroSubheading, ticker,
  heroImages[]${IMAGE},
  storyHeading, storyBody, storyImage${IMAGE},
  kitchenHeading,
  barHeading, barBody, barImage${IMAGE},
  eventsHeading, eventsBody, eventsImage${IMAGE},
  patioHeading, patioBody, patioImages[]${IMAGE},
  bandImage${IMAGE},
  seo
}`

export function getHomePage() {
  return sanityFetch<HomePage | null>({
    query: HOME_QUERY,
    tags: ['homePage'],
  })
}

/** Active happenings that have not passed their "hide after" date. `today`
 *  is the restaurant's date, not the server's — Vercel runs in UTC, and an
 *  event ending on the 31st should still show at 9pm in Atlanta. */
const SPECIALS_QUERY = groq`*[_type == "special" && active == true &&
    (!defined(endDate) || endDate >= $today)] | order(order asc, startDate asc){
  _id, title, kind, service, schedule, startDate, endDate, description, price,
  ctaLabel, ctaUrl, image${IMAGE}
}`

export async function getSpecials() {
  const list = await sanityFetch<Special[]>({
    query: SPECIALS_QUERY,
    params: { today: restaurantToday() },
    tags: ['special'],
  })
  return list.map((s) => cleanKeys(s, ['kind', 'service', 'ctaUrl', 'startDate', 'endDate']))
}

const SPACES_QUERY = groq`*[_type == "space" && hidden != true] | order(order asc){
  _id, name, bestFor, seated, reception, capacityNote, description, features,
  photos[]${IMAGE}
}`

export function getSpaces() {
  return sanityFetch<Space[]>({ query: SPACES_QUERY, tags: ['space'] })
}

const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]{
  title, "slug": slug.current, intro, body,
  heroImage${IMAGE},
  seo
}`

export function getPage(slug: string) {
  return sanityFetch<Page | null>({
    query: PAGE_QUERY,
    params: { slug },
    tags: ['page', `page:${slug}`],
  })
}

const TEAM_QUERY = groq`*[_type == "person" && hidden != true] | order(order asc){
  _id, name, displayName, role, bio, quote, featured,
  portrait${IMAGE}
}`

export function getTeam() {
  return sanityFetch<Person[]>({ query: TEAM_QUERY, tags: ['person'] })
}

const JOBS_QUERY = groq`*[_type == "jobPosting" && open == true]{
  _id, title, employmentType, department, description, applyUrl
}`

export function getJobs() {
  return sanityFetch<JobPosting[]>({ query: JOBS_QUERY, tags: ['jobPosting'] })
}

const GALLERY_QUERY = groq`*[_type == "galleryImage" && hidden != true] | order(order asc){
  _id, image${IMAGE}, alt, category
}`

export async function getGallery() {
  const list = await sanityFetch<GalleryImage[]>({ query: GALLERY_QUERY, tags: ['galleryImage'] })
  return list.map((g) => cleanKeys(g, ['category']))
}
