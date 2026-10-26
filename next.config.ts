import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Loaded from node_modules at run time, not bundled: the menu pages read each
  // uploaded PDF's text on the server, and pdf.js brings its own worker file.
  serverExternalPackages: ['pdfjs-dist'],
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
    ]
  },
}

export default nextConfig
