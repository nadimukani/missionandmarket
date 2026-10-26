export type PdfPage = { width: number; height: number; lines: string[] }

/**
 * Page sizes and text of an uploaded menu PDF, read on the server with pdf.js.
 * The sizes let the menu page reserve each page's space before the viewer
 * draws it; the text is offered as a plain-text version for screen readers
 * and search engines, without anyone typing the menu in. A Sanity file URL
 * changes with every upload, so a fetched PDF can be cached for good.
 * Returns null if the file can't be read (the viewer still shows it).
 */
export async function readPdf(url: string): Promise<PdfPage[] | null> {
  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return null
    const data = new Uint8Array(await res.arrayBuffer())
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const task = getDocument({ data, disableFontFace: true, useSystemFonts: false, verbosity: 0 })
    const doc = await task.promise
    const pages: PdfPage[] = []
    for (let n = 1; n <= doc.numPages; n += 1) {
      const page = await doc.getPage(n)
      const { width, height } = page.getViewport({ scale: 1 })
      const content = await page.getTextContent()
      const text = content.items.map((i) => ('str' in i ? i.str + (i.hasEOL ? '\n' : '') : '')).join('')
      const lines = text
        .split('\n')
        .map((l) => l.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
      pages.push({ width, height, lines })
    }
    await task.destroy()
    return pages
  } catch {
    return null
  }
}
