'use client'

import { useEffect, useRef, useState } from 'react'

import { telHref } from '@/lib/site'

/**
 * The restaurant's existing Tripleseat lead form, embedded so inquiries keep
 * landing in their Tripleseat account exactly as they do today — including
 * Tripleseat's own reCAPTCHA. Restyled in globals.css (`.ts-form`).
 *
 * Tripleseat's script inserts its form immediately after its own <script>
 * tag, located via `document.currentScript`. So we create the tag inside this
 * container ourselves rather than through next/script, which would append it
 * to <head> and put the form at the bottom of the page.
 *
 * Loaded when the section approaches the viewport: the embed pulls in jQuery
 * and jQuery UI (~250 KB), which nobody should pay for unless they are about
 * to fill the form in.
 */
export function TripleseatForm({
  leadFormId,
  publicKey,
  phone,
}: {
  leadFormId?: string
  publicKey?: string
  phone?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle')

  useEffect(() => {
    const el = host.current
    if (!el || !leadFormId || !publicKey) return

    let cancelled = false
    const load = () => {
      if (cancelled || el.dataset.loaded) return
      el.dataset.loaded = '1'
      setState('loading')
      const s = document.createElement('script')
      s.src = `https://api.tripleseat.com/v1/leads/ts_script.js?lead_form_id=${encodeURIComponent(
        leadFormId,
      )}&public_key=${encodeURIComponent(publicKey)}`
      s.async = false
      s.onload = () => {
        if (cancelled) return
        // Tripleseat loads reCAPTCHA with document.write(), which browsers
        // ignore from a script that was not in the original HTML — so on any
        // modern site the captcha never renders and the lead is rejected.
        // Load it ourselves; api.js auto-renders the form's .g-recaptcha box.
        if (!document.querySelector('script[data-recaptcha]')) {
          const r = document.createElement('script')
          r.src = 'https://www.google.com/recaptcha/api.js'
          r.async = true
          r.defer = true
          r.dataset.recaptcha = '1'
          document.head.appendChild(r)
        }
        setState('ready')
      }
      s.onerror = () => !cancelled && setState('failed')
      el.appendChild(s)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load()
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    // Deep links to #inquire should not wait for a scroll.
    if (window.location.hash === '#inquire') load()

    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [leadFormId, publicKey])

  if (!leadFormId || !publicKey) {
    return (
      <p className="text-stone">
        The inquiry form is being connected.
        {phone ? (
          <>
            {' '}
            In the meantime, call{' '}
            <a className="link" href={telHref(phone)}>
              {phone}
            </a>
            .
          </>
        ) : null}
      </p>
    )
  }

  return (
    <div className="ts-form">
      <div ref={host} />
      {state !== 'ready' ? (
        <p className="text-sm text-stone" aria-live="polite">
          {state === 'failed' ? (
            <>
              The inquiry form didn’t load.
              {phone ? (
                <>
                  {' '}
                  Please call{' '}
                  <a className="link" href={telHref(phone)}>
                    {phone}
                  </a>
                  .
                </>
              ) : null}
            </>
          ) : (
            'Loading the inquiry form…'
          )}
        </p>
      ) : null}
    </div>
  )
}
