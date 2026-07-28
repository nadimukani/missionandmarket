import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  // A 404 must not claim to be the homepage, and must not be indexed.
  alternates: { canonical: undefined },
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="measure band-lg flex flex-col items-center text-center">
      <p className="eyebrow text-brass">404</p>
      <h1 className="mt-4 font-display text-lead text-ink">
        We couldn&rsquo;t find that page
      </h1>
      <p className="mt-4 font-sans text-base text-ink-muted">
        It may have moved. The menus and reservations are always a click away.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/menus"
          className="bg-ink px-7 py-3.5 font-sans text-sm font-medium text-cream transition-colors duration-200 ease-out-soft hover:bg-moss"
        >
          View menus
        </Link>
        <Link
          href="/reservations"
          className="border border-ink/25 px-7 py-3.5 font-sans text-sm font-medium text-ink transition-colors duration-200 ease-out-soft hover:border-ink"
        >
          Reserve a table
        </Link>
      </div>
    </div>
  )
}
