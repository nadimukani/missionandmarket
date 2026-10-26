'use client'

import 'photoswipe/style.css'

import type { PDFDocumentProxy } from 'pdfjs-dist'
import { useEffect, useRef, useState } from 'react'

export type PageSize = { width: number; height: number }

/** Wide enough that a phone can zoom in to the smallest print on the menu. */
const ZOOM_WIDTH = 2400

/**
 * The uploaded menu PDF, drawn into the page with pdf.js — phones can't embed
 * a PDF (Android least of all), so every page is rendered in the browser,
 * sharp at whatever width it's shown. Tapping or clicking a page opens it
 * full screen with pinch and double-tap zoom (PhotoSwipe). Page sizes come
 * from the server so the space is reserved before the PDF arrives; if the
 * server couldn't read the file, they're found here instead.
 */
export function MenuPdf({ url, title, pages }: { url: string; title: string; pages: PageSize[] }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [sizes, setSizes] = useState<PageSize[]>(pages)
  const [failed, setFailed] = useState(false)
  const [opening, setOpening] = useState(false)
  const zoomed = useRef<{ src: string; width: number; height: number }[] | null>(null)

  useEffect(() => {
    let cancelled = false
    let task: { destroy: () => Promise<void> } | null = null
    import('pdfjs-dist')
      .then(async (pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs?v=${pdfjs.version}`
        const loading = pdfjs.getDocument({ url })
        task = loading
        const loaded = await loading.promise
        if (cancelled) return
        if (!pages.length) {
          const found: PageSize[] = []
          for (let n = 1; n <= loaded.numPages; n += 1) {
            const { width, height } = (await loaded.getPage(n)).getViewport({ scale: 1 })
            found.push({ width, height })
          }
          if (cancelled) return
          setSizes(found)
        }
        setDoc(loaded)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
      task?.destroy()
      zoomed.current?.forEach((z) => URL.revokeObjectURL(z.src))
      zoomed.current = null
    }
  }, [url, pages.length])

  async function open(index: number) {
    if (!doc || opening) return
    setOpening(true)
    try {
      const [{ default: PhotoSwipe }, slides] = await Promise.all([
        import('photoswipe'),
        zoomed.current ?? renderForZoom(doc),
      ])
      zoomed.current = slides
      const pswp = new PhotoSwipe({
        dataSource: slides.map((s, i) => ({ ...s, alt: `${title} menu, page ${i + 1}` })),
        index,
        bgOpacity: 1,
        showHideAnimationType: 'fade',
        closeTitle: 'Close the menu',
        zoomTitle: 'Zoom',
        arrowPrevTitle: 'Previous page',
        arrowNextTitle: 'Next page',
        errorMsg: 'This page could not be shown.',
      })
      pswp.init()
    } finally {
      setOpening(false)
    }
  }

  if (failed) return null

  return (
    <div className="grid gap-6 sm:gap-10">
      {sizes.length ? (
        sizes.map((size, i) => (
          <PdfPage
            key={`${url}-${i}`}
            doc={doc}
            number={i + 1}
            size={size}
            label={`${title} menu, page ${i + 1} of ${sizes.length}. Open full screen to zoom.`}
            onOpen={() => open(i)}
          />
        ))
      ) : (
        <div className="aspect-[8.5/11] animate-pulse bg-mist/30" aria-hidden="true" />
      )}
    </div>
  )
}

/** Each page once, at a width a phone can zoom into, as images for PhotoSwipe. */
async function renderForZoom(doc: PDFDocumentProxy) {
  const out: { src: string; width: number; height: number }[] = []
  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n)
    const viewport = page.getViewport({ scale: ZOOM_WIDTH / page.getViewport({ scale: 1 }).width })
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(viewport.width)
    canvas.height = Math.round(viewport.height)
    await page.render({ canvas, viewport }).promise
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    out.push({ src: blob ? URL.createObjectURL(blob) : '', width: canvas.width, height: canvas.height })
    page.cleanup()
  }
  return out
}

function PdfPage({
  doc,
  number,
  size,
  label,
  onOpen,
}: {
  doc: PDFDocumentProxy | null
  number: number
  size: PageSize
  label: string
  onOpen: () => void
}) {
  const box = useRef<HTMLButtonElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = box.current
    const c = canvas.current
    if (!doc || !el || !c) return
    let cancelled = false
    let task: { cancel: () => void; promise: Promise<void> } | null = null
    let timer = 0

    const draw = async () => {
      const width = el.clientWidth
      if (!width) return
      const page = await doc.getPage(number)
      if (cancelled) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const viewport = page.getViewport({ scale: (width * dpr) / page.getViewport({ scale: 1 }).width })
      // Draw off-screen, then swap in, so a resize never flashes a blank page.
      const next = document.createElement('canvas')
      next.width = Math.round(viewport.width)
      next.height = Math.round(viewport.height)
      task?.cancel()
      task = page.render({ canvas: next, viewport })
      try {
        await task.promise
      } catch {
        return // cancelled by a newer draw
      }
      if (cancelled) return
      c.width = next.width
      c.height = next.height
      c.getContext('2d')?.drawImage(next, 0, 0)
      setDrawn(true)
    }

    draw()
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(draw, 150)
    })
    ro.observe(el)
    return () => {
      cancelled = true
      task?.cancel()
      ro.disconnect()
      window.clearTimeout(timer)
    }
  }, [doc, number])

  return (
    <button
      ref={box}
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="relative block w-full cursor-zoom-in overflow-hidden bg-white shadow-[0_1px_2px_rgb(35_31_31/0.06),0_12px_40px_-12px_rgb(35_31_31/0.18)]"
      style={{ aspectRatio: `${size.width} / ${size.height}` }}
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`absolute inset-0 size-full transition-opacity duration-500 ${drawn ? 'opacity-100' : 'opacity-0'}`}
      />
      {!drawn ? <span className="absolute inset-0 animate-pulse bg-mist/30" aria-hidden="true" /> : null}
    </button>
  )
}
