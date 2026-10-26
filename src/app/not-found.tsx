import Link from 'next/link'

import { Monogram } from '@/components/logo'

/** Rendered outside the (site) group for unmatched URLs, so it brings its own
 *  minimal chrome rather than the full header and footer. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="page flex h-(--header-h) items-center">
        <Link href="/" aria-label="Mission + Market — home">
          <Monogram className="h-[1.2rem]" />
        </Link>
      </header>
      <main className="page flex flex-1 flex-col justify-center py-24">
        <p className="eyebrow text-bronze">404</p>
        <h1 className="mt-5 max-w-3xl font-display text-hero">
          This page isn’t on the <em>menu</em>.
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-moss">
            Back to the home page
          </Link>
          <Link href="/menus" className="btn btn-line">
            See the menus
          </Link>
        </div>
      </main>
    </div>
  )
}
