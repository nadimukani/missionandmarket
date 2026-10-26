// Puts pdf.js's worker in /public so the menu viewer loads it from the site
// itself, always at the installed version (runs before `next dev` / `build`).
import { copyFileSync } from 'node:fs'

copyFileSync(
  new URL('../node_modules/pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
  new URL('../public/pdf.worker.min.mjs', import.meta.url),
)
