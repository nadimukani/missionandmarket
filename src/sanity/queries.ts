import { groq } from 'next-sanity'

import { sanityFetch } from './client'
import type {
  GalleryImage,
  HomePage,
  JobPosting,
  Menu,
  MenuSummary,
  Page,
  Person,
  PressItem,
  SiteSettings,
  Special,
} from './types'

/**
 * Every image projection goes through this.
 *
 * `lqip` is a ~500-byte base64 thumbnail Sanity generates for each asset on
 * upload. It costs nothing to ask for and it is what stops a photograph
 * snapping in from blank — the blur is on screen at first paint, holding the
 * exact frame the real file will occupy, and dissolves when it arrives. On a
 * photography-led page like the gallery that is the difference between the
 * page assembling itself as you scroll and it just being there.
 */
const IMAGE = groq`{
  ...,
  "alt": coalesce(alt, ""),
  "lqip": asset->metadata.lqip
}`

const SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  name, tagline, shortDescription, phone, email, neighborhood, mapsUrl,
  parkingNote, address, hours, machineHours, holidayNotice,
  openTableRid, openTableUrl, largePartyNote, orderUrl, giftCardUrl,
  privateEventsEmail, social, ogImage
}`

export function getSettings() {
  return sanityFetch<SiteSettings | null>({
    query: SETTINGS_QUERY,
    tags: ['siteSettings'],
  })
}

const MENU_LIST_QUERY = groq`*[_type == "menu"] | order(order asc, title asc){
  _id, title, "slug": slug.current, availability, order
}`

export function getMenuList() {
  return sanityFetch<MenuSummary[]>({
    query: MENU_LIST_QUERY,
    tags: ['menu'],
  })
}

const MENU_QUERY = groq`*[_type == "menu" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, availability, intro, footnote,
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
  heroImages[]${IMAGE},
  heroHeading, heroSubheading, storyHeading, storyBody,
  storyImage${IMAGE},
  bandImage${IMAGE},
  bandCaption,
  featuredDishes[]{ name, description, image${IMAGE} },
  seo
}`

export function getHomePage() {
  return sanityFetch<HomePage | null>({
    query: HOME_QUERY,
    tags: ['homePage'],
  })
}

const SPECIALS_QUERY = groq`*[_type == "special" && active == true] | order(order asc){
  _id, title, schedule, description, price, ctaLabel, ctaUrl, image${IMAGE}
}`

export function getSpecials() {
  return sanityFetch<Special[]>({
    query: SPECIALS_QUERY,
    tags: ['special'],
  })
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

const PAGE_SLUGS_QUERY = groq`*[_type == "page" && defined(slug.current)].slug.current`

export function getPageSlugs() {
  return sanityFetch<string[]>({ query: PAGE_SLUGS_QUERY, tags: ['page'] })
}

const TEAM_QUERY = groq`*[_type == "person"] | order(order asc){
  _id, name, displayName, role, bio, quote, featured,
  portrait${IMAGE}
}`

export function getTeam() {
  return sanityFetch<Person[]>({ query: TEAM_QUERY, tags: ['person'] })
}

const PRESS_QUERY = groq`*[_type == "pressItem"] | order(date desc){
  _id, title, publication, date, url, excerpt, logo${IMAGE}
}`

export function getPress() {
  return sanityFetch<PressItem[]>({ query: PRESS_QUERY, tags: ['pressItem'] })
}

const JOBS_QUERY = groq`*[_type == "jobPosting" && open == true]{
  _id, title, employmentType, department, description, applyUrl
}`

export function getJobs() {
  return sanityFetch<JobPosting[]>({ query: JOBS_QUERY, tags: ['jobPosting'] })
}

const GALLERY_QUERY = groq`*[_type == "galleryImage"] | order(order asc){
  _id, image${IMAGE}, alt, category
}`

export function getGallery() {
  return sanityFetch<GalleryImage[]>({
    query: GALLERY_QUERY,
    tags: ['galleryImage'],
  })
}
