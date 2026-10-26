import type { PageSize } from '@/components/menu-pdf'

/**
 * Page sizes of an uploaded menu PDF, read on the server with pdf.js, so the
 * menu page reserves each page's space before the viewer draws it. A Sanity
 * file URL changes with every upload, so a fetched PDF can be cached for good.
 * Returns null if the file can't be read (the viewer finds the sizes itself).
 */
export async function readPageSizes(url: string): Promise<PageSize[] | null> {
  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return null
    const data = new Uint8Array(await res.arrayBuffer())
    const [{ getDocument }] = await Promise.all([
      import('pdfjs-dist/legacy/build/pdf.mjs'),
      // pdf.js's worker, run in this process: importing it registers it, so
      // pdf.js never resolves a worker file at run time (and it bundles like
      // any other module — no external package, no symlinks in the build).
      import('pdfjs-dist/legacy/build/pdf.worker.mjs'),
    ])
    const task = getDocument({ data, disableFontFace: true, useSystemFonts: false, verbosity: 0 })
    const doc = await task.promise
    const pages: PageSize[] = []
    for (let n = 1; n <= doc.numPages; n += 1) {
      const { width, height } = (await doc.getPage(n)).getViewport({ scale: 1 })
      pages.push({ width, height })
    }
    await task.destroy()
    return pages
  } catch {
    return null
  }
}
