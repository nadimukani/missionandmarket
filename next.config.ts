import type { NextConfig } from 'next'

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
      { source: '/brunch-menu', destination: '/menus/brunch', permanent: true },
      { source: '/dessert-menu', destination: '/menus/dessert', permanent: true },
      { source: '/menu', destination: '/menus', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/news', destination: '/press', permanent: true },
    ]
  },
}

export default nextConfig
