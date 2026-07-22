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
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center lg:py-48">
      <p className="eyebrow text-brass">404</p>
      <h1 className="mt-4 font-display text-4xl text-ink">
        We couldn&rsquo;t find that page
      </h1>
      <p className="mt-4 font-sans text-base text-ink-muted">
        It may have moved. The menus and reservations are always a click away.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/menus"
          className="rounded-xs bg-ink px-7 py-3.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-moss"
        >
          View menus
        </Link>
        <Link
          href="/reservations"
          className="rounded-xs border border-ink/25 px-7 py-3.5 font-sans text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Reserve a table
        </Link>
      </div>
    </div>
  )
}
