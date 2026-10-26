'use client'

import dynamic from 'next/dynamic'

/**
 * The Studio runs only in the browser. Skipping its server render keeps
 * Sanity's editing tools (Vision and the code highlighter it pulls in) out of
 * the server bundle, where Turbopack would link them as external packages —
 * a symlinked directory Vercel refuses to deploy.
 */
const Studio = dynamic(() => import('./studio-client'), {
  ssr: false,
  loading: () => (
    <p style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', color: '#6b635c' }}>Loading the Studio…</p>
  ),
})

export default Studio
