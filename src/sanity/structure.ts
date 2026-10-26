// @sanity/icons v5 ships one module per icon; the barrel only exposes a
// lazy lookup table, so named imports from the root no longer resolve.
import { BellIcon } from '@sanity/icons/Bell'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { CaseIcon } from '@sanity/icons/Case'
import { ClockIcon } from '@sanity/icons/Clock'
import { DocumentsIcon } from '@sanity/icons/Documents'
import { HomeIcon } from '@sanity/icons/Home'
import { ImagesIcon } from '@sanity/icons/Images'
import { InfoOutlineIcon } from '@sanity/icons/InfoOutline'
import { MenuIcon } from '@sanity/icons/Menu'
import { PresentationIcon } from '@sanity/icons/Presentation'
import { StarIcon } from '@sanity/icons/Star'
import { UsersIcon } from '@sanity/icons/Users'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'

import { isAdmin } from './access'
import { apiVersion } from './env'

/** Documents that must only ever have one instance. */
const SINGLETONS = ['siteSettings', 'homePage', 'announcement', 'hours'] as const

export const singletonTypes = new Set<string>(SINGLETONS)

/** The restaurant sees only what it asked to change (see access.ts). */
export const structure: StructureResolver = (S, { currentUser }) =>
  isAdmin(currentUser) ? everything(S) : restaurant(S)

/**
 * Menu updates, events and closure notices — the three things the restaurant
 * asked to change itself. Menus lists the ones on the site; a menu's form
 * shows only its PDF.
 */
const restaurant = (S: StructureBuilder) =>
  S.list()
    .title('Mission + Market')
    .items([
      S.listItem()
        .title('Menus')
        .icon(MenuIcon)
        .child(
          S.documentList()
            .title('Menus')
            .schemaType('menu')
            .apiVersion(apiVersion)
            .filter('_type == "menu" && defined(pdf.asset) && hidden != true')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
            .initialValueTemplates([]),
        ),
      S.documentTypeListItem('special').title('Happenings').icon(CalendarIcon),
      S.listItem()
        .title('Closures')
        .icon(ClockIcon)
        .child(S.document().schemaType('hours').documentId('hours').title('Closures')),
    ])

/**
 * Ordered by how often a manager reaches for each thing. The edits the
 * restaurant asked to own — closures and hours, the menus, what's on — sit at
 * the top; the things set once and rarely touched sit below the line.
 */
const everything = (S: StructureBuilder) =>
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
      S.listItem()
        .title('Hours & Closures')
        .icon(ClockIcon)
        .child(S.document().schemaType('hours').documentId('hours').title('Hours & Closures')),
      S.documentTypeListItem('menu').title('Menus').icon(MenuIcon),
      S.documentTypeListItem('special').title('Happenings').icon(CalendarIcon),
      S.documentTypeListItem('space').title('Private Dining Rooms').icon(PresentationIcon),

      S.divider(),

      S.listItem()
        .title('Restaurant Info')
        .icon(InfoOutlineIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Restaurant Info'),
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
