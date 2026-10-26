// @sanity/icons v5 ships one module per icon; the barrel only exposes a
// lazy lookup table, so named imports from the root no longer resolve.
import { BellIcon } from '@sanity/icons/Bell'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { CaseIcon } from '@sanity/icons/Case'
import { DocumentsIcon } from '@sanity/icons/Documents'
import { HomeIcon } from '@sanity/icons/Home'
import { ImagesIcon } from '@sanity/icons/Images'
import { InfoOutlineIcon } from '@sanity/icons/InfoOutline'
import { MenuIcon } from '@sanity/icons/Menu'
import { PresentationIcon } from '@sanity/icons/Presentation'
import { StarIcon } from '@sanity/icons/Star'
import { UsersIcon } from '@sanity/icons/Users'
import type { StructureResolver } from 'sanity/structure'

/** Documents that must only ever have one instance. */
const SINGLETONS = ['siteSettings', 'homePage', 'announcement'] as const

export const singletonTypes = new Set<string>(SINGLETONS)

/**
 * Ordered by how often a manager reaches for each thing. The three edits the
 * restaurant asked to own — a closure notice, the menus, what's on — sit at the
 * top; the things set once and rarely touched sit below the line.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Mission + Market')
    .items([
      S.listItem()
        .title('Announcement Banner')
        .icon(BellIcon)
        .child(
          S.document()
            .schemaType('announcement')
            .documentId('announcement')
            .title('Announcement Banner'),
        ),
      S.documentTypeListItem('menu').title('Menus').icon(MenuIcon),
      S.documentTypeListItem('special').title('Happenings').icon(CalendarIcon),
      S.documentTypeListItem('space').title('Private Dining Rooms').icon(PresentationIcon),

      S.divider(),

      S.listItem()
        .title('Hours & Restaurant Info')
        .icon(InfoOutlineIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Hours & Restaurant Info'),
        ),
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home Page')),
      S.documentTypeListItem('galleryImage').title('Photo Gallery').icon(ImagesIcon),
      S.documentTypeListItem('person').title('Team').icon(UsersIcon),
      S.documentTypeListItem('page').title('Pages').icon(DocumentsIcon),
      S.documentTypeListItem('jobPosting').title('Job Openings').icon(CaseIcon),
      S.documentTypeListItem('pressItem').title('Press').icon(StarIcon),
    ])
