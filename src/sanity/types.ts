import type { PortableTextBlock } from 'next-sanity'
import type { Image } from 'sanity'

export type { Schedule, Service, Closure } from '@/lib/schedule'

/** `lqip` is Sanity's base64 blur thumbnail, projected by the IMAGE fragment
 *  in queries.ts and used as the placeholder while the real file loads. */
export type SanityImage = Image & { alt?: string; lqip?: string }

export type Address = {
  street?: string
  street2?: string
  city?: string
  state?: string
  zip?: string
}

export type HoursRow = { service: string; days?: string; time?: string }
export type MachineHours = { day: string; opens?: string; closes?: string }

export type SocialLink = { platform?: string; url?: string }

export type SiteSettings = {
  name: string
  tagline?: string
  shortDescription?: string
  phone: string
  email?: string
  address?: Address
  neighborhood?: string
  mapsUrl?: string
  parkingNote?: string
  hours?: HoursRow[]
  machineHours?: MachineHours[]
  holidayNotice?: {
    enabled?: boolean
    message?: string
    linkLabel?: string
    linkUrl?: string
  }
  openTableRid?: string
  openTableUrl?: string
  largePartyNote?: string
  orderUrl?: string
  giftCardUrl?: string
  privateEventsEmail?: string
  social?: SocialLink[]
  ogImage?: SanityImage
  tripleseatLeadFormId?: string
  tripleseatPublicKey?: string
  /** Shown under every menu (Restaurant Info → Menu notices). */
  allergenNotice?: string
  rawFoodNotice?: string
  relatedAccounts?: { label?: string; url?: string }[]
}

export type Announcement = {
  enabled?: boolean
  message?: string
  linkLabel?: string
  linkUrl?: string
  startsAt?: string
  endsAt?: string
}

/** A dish from Home page → Signature dishes, with the menu it links to
 *  (absent if that menu is hidden). */
export type FeaturedDish = {
  name: string
  description?: string
  image: SanityImage
  menuTitle?: string
  menuSlug?: string
}

export type MenuSummary = {
  _id: string
  title: string
  slug: string
  availability?: string
  services?: string[]
  order?: number
  hidden?: boolean
  image?: SanityImage
}

export type Menu = MenuSummary & {
  intro?: string
  /** The uploaded menu PDF — the menu itself (a menu without one isn't shown). */
  pdf: { url: string; originalFilename?: string; size?: number }
}

export type Seo = {
  title?: string
  description?: string
  image?: SanityImage
}

export type HomePage = {
  heroEyebrow?: string
  heroHeading?: string
  heroSubheading?: string
  ticker?: string[]
  heroImages?: SanityImage[]
  storyHeading?: string
  storyBody?: PortableTextBlock[]
  storyImage?: SanityImage
  kitchenHeading?: string
  barHeading?: string
  barBody?: string
  barImage?: SanityImage
  eventsHeading?: string
  eventsBody?: string
  eventsImage?: SanityImage
  patioHeading?: string
  patioBody?: string
  patioImages?: SanityImage[]
  bandImage?: SanityImage
  seo?: Seo
}

export type Special = {
  _id: string
  title: string
  kind?: 'weekly' | 'seasonal' | 'event'
  service?: string
  startDate?: string
  endDate?: string
  schedule?: string
  description?: string
  price?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: SanityImage
}

export type Page = {
  title: string
  slug: string
  intro?: string
  body?: PortableTextBlock[]
  heroImage?: SanityImage
  seo?: Seo
}

export type PressItem = {
  _id: string
  title: string
  publication?: string
  date?: string
  url?: string
  excerpt?: string
  logo?: SanityImage
}

export type JobPosting = {
  _id: string
  title: string
  employmentType?: string
  department?: string
  description?: PortableTextBlock[]
  applyUrl?: string
}

export type GalleryImage = {
  _id: string
  image: SanityImage
  alt: string
  category?: string
}

export type Space = {
  _id: string
  name: string
  bestFor?: string
  seated?: number
  reception?: number
  capacityNote?: string
  description?: string
  features?: string[]
  photos?: SanityImage[]
}

export type Person = {
  _id: string
  name: string
  displayName?: string
  role: string
  portrait?: SanityImage
  bio?: PortableTextBlock[]
  quote?: string
  featured?: boolean
}
