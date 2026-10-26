import { groq } from 'next-sanity'

import { restaurantToday } from '@/lib/opentable'

import { sanityFetch } from './client'
import type {
  Announcement,
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
  privateEventsEmail, social, ogImage,
  tripleseatLeadFormId, tripleseatPublicKey
}`

export function getSettings() {
  return sanityFetch<SiteSettings | null>({
    query: SETTINGS_QUERY,
    tags: ['siteSettings'],
  })
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

const MENU_LIST_QUERY = groq`*[_type == "menu" && hidden != true] | order(order asc, title asc){
  _id, title, "slug": slug.current, availability, order, image${IMAGE}
}`

export function getMenuList() {
  return sanityFetch<MenuSummary[]>({
    query: MENU_LIST_QUERY,
    tags: ['menu'],
  })
}

const MENU_QUERY = groq`*[_type == "menu" && slug.current == $slug && hidden != true][0]{
  _id, title, "slug": slug.current, availability, intro, footnote, image${IMAGE},
  "pdfUrl": pdf.asset->url,
  sections[]{
    title, note,
    items[]{ name, description, price, tags, soldOut, addOns[]{ label, price } }
  }
}`

export function getMenu(slug: string) {
  return sanityFetch<Menu | null>({
    query: MENU_QUERY,
    params: { slug },
    tags: ['menu', `menu:${slug}`],
  })
}

const HOME_QUERY = groq`*[_type == "homePage"][0]{
  heroEyebrow, heroHeading, heroSubheading, ticker,
  heroImages[]${IMAGE},
  storyHeading, storyBody, storyImage${IMAGE},
  kitchenHeading,
  featuredDishes[]{ name, description, image${IMAGE} },
  barHeading, barBody, barImage${IMAGE},
  eventsHeading, eventsBody, eventsImage${IMAGE},
  patioHeading, patioBody, patioImages[]${IMAGE},
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
  _id, title, kind, schedule, startDate, endDate, description, price,
  ctaLabel, ctaUrl, image${IMAGE}
}`

export function getSpecials() {
  return sanityFetch<Special[]>({
    query: SPECIALS_QUERY,
    params: { today: restaurantToday() },
    tags: ['special'],
  })
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

export function getGallery() {
  return sanityFetch<GalleryImage[]>({
    query: GALLERY_QUERY,
    tags: ['galleryImage'],
  })
}
