import type { PortableTextBlock } from 'next-sanity'
import type { Image } from 'sanity'

export type SanityImage = Image & { alt?: string }

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

export type HomePage = {
  heroImages?: SanityImage[]
  heroHeading?: string
  heroSubheading?: string
  storyHeading?: string
  storyBody?: PortableTextBlock[]
  storyImage?: SanityImage
  featuredDishes?: {
    name?: string
    description?: string
    image?: SanityImage
  }[]
  seo?: Seo
}

export type Special = {
  _id: string
  title: string
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
