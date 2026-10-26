import Link from 'next/link'

import { Monogram } from '@/components/logo'
import { Ornament } from '@/components/ui'

/** Rendered outside the (site) group for unmatched URLs, so it brings its own
 *  minimal chrome rather than the full header and footer. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="page flex h-(--header-h) items-center justify-center border-b border-ink/10">
        <Link href="/" aria-label="Mission + Market — home">
          <Monogram className="h-[1.15rem]" />
        </Link>
      </header>
      <main className="page flex flex-1 flex-col items-center justify-center py-24 text-center">
        <Ornament className="h-12 text-bronze" />
        <p className="label mt-8 text-bronze">404</p>
        <h1 className="mt-6 max-w-3xl font-display text-hero font-light">
          This page isn’t on the <em>menu</em>.
        </h1>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-solid">
            Home
          </Link>
          <Link href="/menus" className="btn btn-outline">
            The Menus
          </Link>
        </div>
      </main>
    </div>
  )
}
