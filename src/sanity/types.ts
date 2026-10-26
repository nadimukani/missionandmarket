import type { PortableTextBlock } from 'next-sanity'
import type { Image } from 'sanity'

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
}

export type Announcement = {
  enabled?: boolean
  message?: string
  linkLabel?: string
  linkUrl?: string
  startsAt?: string
  endsAt?: string
}

export type MenuItem = {
  name: string
  description?: string
  price?: string
  tags?: string[]
  soldOut?: boolean
  addOns?: { label?: string; price?: string }[]
}

export type MenuSection = {
  title: string
  note?: string
  items?: MenuItem[]
}

export type MenuSummary = {
  _id: string
  title: string
  slug: string
  availability?: string
  order?: number
  hidden?: boolean
  image?: SanityImage
}

export type Menu = MenuSummary & {
  intro?: string
  footnote?: string
  pdfUrl?: string
  sections?: MenuSection[]
}

export type Seo = {
  title?: string
  description?: string
  image?: SanityImage
}

export type FeaturedDish = {
  name?: string
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
  featuredDishes?: FeaturedDish[]
  barHeading?: string
  barBody?: string
  barImage?: SanityImage
  eventsHeading?: string
  eventsBody?: string
  eventsImage?: SanityImage
  patioHeading?: string
  patioBody?: string
  patioImages?: SanityImage[]
  seo?: Seo
}

export type Special = {
  _id: string
  title: string
  kind?: 'weekly' | 'seasonal' | 'event'
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
