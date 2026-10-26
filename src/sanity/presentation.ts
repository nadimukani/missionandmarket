import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

/**
 * Tells the Studio where each document appears on the website, so an editor
 * sees "Used on: Home · Dinner menu" beside every document and can jump
 * straight to it in the live preview.
 */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/', filter: `_type == "homePage" && _id == "homePage"` },
    { route: '/menus/:slug', filter: `_type == "menu" && slug.current == $slug` },
    { route: '/menus/:slug/print', filter: `_type == "menu" && slug.current == $slug` },
    { route: '/private-events', filter: `_type == "page" && slug.current == "private-events"` },
    { route: '/about', filter: `_type == "page" && slug.current == "about"` },
  ]),
  locations: {
    homePage: defineLocations({
      message: 'The home page',
      tone: 'positive',
      locations: [{ title: 'Home', href: '/' }],
    }),
    menu: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: `${doc?.title ?? 'Menu'} menu`, href: `/menus/${doc?.slug}` },
          { title: 'All menus', href: '/menus' },
          { title: 'Home (signature dishes)', href: '/' },
        ],
      }),
    }),
    hours: defineLocations({
      message: 'Hours appear across the site',
      tone: 'positive',
      locations: [
        { title: 'Visit', href: '/visit' },
        { title: 'Home', href: '/' },
        { title: 'Reservations', href: '/reservations' },
      ],
    }),
    announcement: defineLocations({
      message: 'Shown at the top of every page',
      locations: [{ title: 'Home', href: '/' }],
    }),
    special: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [
          { title: 'Happenings', href: '/happenings' },
          { title: 'Home', href: '/' },
          ...(doc?.title?.toLowerCase().includes('holiday')
            ? [{ title: 'Holiday parties', href: '/holiday-parties' }]
            : []),
        ],
      }),
    }),
    space: defineLocations({
      select: { title: 'name' },
      resolve: () => ({
        locations: [
          { title: 'Private dining', href: '/private-events' },
          { title: 'Home', href: '/' },
        ],
      }),
    }),
    galleryImage: defineLocations({
      locations: [{ title: 'Gallery', href: '/gallery' }],
    }),
    siteSettings: defineLocations({
      message: 'Restaurant details appear on every page',
      locations: [
        { title: 'Visit', href: '/visit' },
        { title: 'Home', href: '/' },
      ],
    }),
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: doc?.slug ? [{ title: doc.title ?? doc.slug, href: `/${doc.slug}` }] : [],
      }),
    }),
  },
}
