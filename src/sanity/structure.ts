import type { StructureResolver } from 'sanity/structure'

/** Documents that must only ever have one instance. */
const SINGLETONS = ['siteSettings', 'homePage'] as const

export const singletonTypes = new Set<string>(SINGLETONS)

/**
 * A restaurant manager should open the Studio and see "Menus" and "Specials",
 * not a flat list of document types. Everything is grouped by the job to be
 * done, and the singletons open straight into the editor.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Mission + Market')
    .items([
      S.listItem()
        .title('Restaurant Info')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      S.listItem()
        .title('Home Page')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      S.documentTypeListItem('menu').title('Menus'),
      S.documentTypeListItem('special').title('Specials & Offers'),

      S.divider(),

      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('person').title('Team'),
      S.documentTypeListItem('galleryImage').title('Gallery'),
      S.documentTypeListItem('pressItem').title('Press'),
      S.documentTypeListItem('jobPosting').title('Job Openings'),
    ])
