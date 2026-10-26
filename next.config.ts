import type { NextConfig } from 'next'

/** Press-clipping posts on the WordPress site; they go where /press does. */
const PRESS_POSTS = [
  'news-1',
  'news-2',
  'news-3',
  'news-4',
  'atlanta',
  'atlanta-magazine',
  'the-atlanta-journal-constitution',
  'ajc',
  'what-now-atlanta',
  '11alive',
  'cnn',
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
    ],
  },
  async redirects() {
    // The WordPress site's URLs, preserved so existing Google results and any
    // printed or linked menus keep working after the cutover.
    return [
      { source: '/dinner-menu', destination: '/menus/dinner', permanent: true },
      { source: '/lunch-menu', destination: '/menus/lunch', permanent: true },
      // Brunch is not currently served; its old URL lands on the menus hub
      // rather than a 404. Temporary, in case brunch returns.
      { source: '/brunch-menu', destination: '/menus', permanent: false },
      { source: '/menus/brunch', destination: '/menus', permanent: false },
      // Desserts are on page 2 of the Lunch and Dinner menus (the PDFs).
      { source: '/dessert-menu', destination: '/menus', permanent: false },
      // The generated print sheet is retired: the uploaded PDF is the menu.
      { source: '/menus/:slug/print', destination: '/menus/:slug', permanent: false },
      { source: '/menu', destination: '/menus', permanent: true },
      { source: '/menu-tabs', destination: '/menus', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/visit', permanent: true },
      { source: '/contact', destination: '/visit', permanent: true },
      { source: '/private-dining', destination: '/private-events', permanent: true },
      { source: '/specials', destination: '/happenings', permanent: true },
      { source: '/news', destination: '/happenings', permanent: false },
      { source: '/press', destination: '/about', permanent: false },
      { source: '/career', destination: '/careers', permanent: true },

      // Everything else the WordPress site still served on 2026-10-26 (from its
      // sitemaps and the Wayback Machine). Specific rules before their wildcard.
      // Old uploads (/wp-content/…) can't be redirected: Vercel's firewall
      // answers every /wp-* path with a 403 before redirects run.
      // Blog posts → the menu that carries the dish today, else the menus.
      { source: '/grilled-spanish-octopus-with-hazelnut-romesco-all-about-the-spanish-classic', destination: '/menus/dinner', permanent: true },
      { source: '/meet-mission-market-unique-bolognese-pasta', destination: '/menus/dinner', permanent: true },
      { source: '/taste-the-luxury-of-seared-black-sea-bass-with-beet-raita', destination: '/menus/dinner', permanent: true },
      { source: '/truffle-fries-near-me-the-quest-for-gourmet-dinner-side-dishes', destination: '/menus/dinner', permanent: true },
      { source: '/how-to-master-cream-cheese-pound-cake', destination: '/menus/dinner', permanent: true },
      { source: '/the-anatomy-of-the-best-pepperoni-pizza-in-atlanta', destination: '/menus/lunch', permanent: true },
      { source: '/warm-quinoa-bowl-in-atlanta-when-comfort-food-goes-gourmet-with-agrodolce-sauce', destination: '/menus/lunch', permanent: true },
      { source: '/soup-like-no-other-mission-market-creamy-lobster-bisque', destination: '/menus', permanent: true },
      { source: '/dessert-on-fire-ignite-your-senses-with-bananas-foster', destination: '/menus', permanent: true },
      { source: '/the-king-of-sweet-wines-royal-tokaji-aszu-5-puttonyos-reigns-supreme', destination: '/menus', permanent: true },
      { source: '/roman-holiday-cocktail-sip-by-sip-to-rome-the-hepburn-way', destination: '/menus', permanent: true },
      { source: '/brunch-cocktails-go-gourmet-all-about-signature-limoncello-spritz', destination: '/menus', permanent: true },
      { source: '/best-brunch-in-atlanta-featuring-mediterranean-hummus', destination: '/menus', permanent: true },
      ...PRESS_POSTS.map((slug) => ({ source: `/${slug}`, destination: '/about', permanent: true })),
      // WordPress post types and archives.
      { source: '/menu-item/:path*', destination: '/menus', permanent: true },
      { source: '/menu-slider/1-dinner-menu', destination: '/menus/dinner', permanent: true },
      { source: '/menu-slider/3-lunch-menu', destination: '/menus/lunch', permanent: true },
      { source: '/menu-slider/5-happy-hour-menu', destination: '/menus/happy-hour', permanent: true },
      { source: '/menu-slider/:path*', destination: '/menus', permanent: true },
      { source: '/menu-special/soup-and-lunch-specials-2', destination: '/menus/happy-hour', permanent: true },
      { source: '/menu-special/soup-and-lunch-specials-3', destination: '/menus/lunch', permanent: true },
      { source: '/menu-special/brunch-time', destination: '/menus', permanent: true },
      { source: '/menu-special/:path*', destination: '/happenings', permanent: true },
      { source: '/our-spaces/:path*', destination: '/private-events', permanent: true },
      { source: '/category/:path*', destination: '/menus', permanent: true },
      { source: '/tag/:path*', destination: '/menus', permanent: true },
      { source: '/author/:path*', destination: '/', permanent: true },
      { source: '/news/:path+', destination: '/happenings', permanent: false },
      { source: '/spucpt/:path*', destination: '/happenings', permanent: true },
      { source: '/thank-you', destination: '/', permanent: true },
      { source: '/prueba-platos', destination: '/menus', permanent: true },
      // The sitemap Search Console knows (Yoast's).
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
    ]
  },
}

export default nextConfig
