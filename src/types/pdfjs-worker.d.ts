// pdf.js ships no types for its worker entry; the server only imports it
// for its side effect (registering globalThis.pdfjsWorker).
declare module 'pdfjs-dist/legacy/build/pdf.worker.mjs'
