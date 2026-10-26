import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'

/**
 * Renders `*word*` as italic. CMS headlines carry their emphasis this way, so
 * the client can move the accent without touching code; a stray asterisk
 * degrades to plain text rather than breaking the layout.
 */
export function Emphasis({ text }: { text?: string | null }) {
  if (!text) return null
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}

export function Label({
  children,
  className = '',
  as: Tag = 'p',
}: {
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'h2' | 'h3' | 'div'
}) {
  return <Tag className={`label ${className}`}>{children}</Tag>
}

/** The chevron mark from the logo, used as a quiet section ornament. */
export function Ornament({ className = 'h-9 text-bronze' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`logo-mask mx-auto aspect-[53/181] ${className}`}
      style={{ maskImage: 'url(/brand/mm-mark.png)', WebkitMaskImage: 'url(/brand/mm-mark.png)' }}
    />
  )
}

export function Arrow({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 10" aria-hidden="true" className={className} fill="none">
      <path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

type Tone = 'solid' | 'light' | 'outline'
const TONE: Record<Tone, string> = {
  solid: 'btn btn-solid',
  light: 'btn btn-light',
  outline: 'btn btn-outline',
}

const external = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

export function ButtonLink({
  href,
  children,
  tone = 'solid',
  className = '',
}: {
  href: string
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  const cls = `${TONE[tone]} ${className}`
  if (external(href)) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

/** Tracked-capital text link with a hairline that draws in on hover. */
export function LineLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const cls = `label link-line ${className}`
  return external(href) ? (
    <a href={href} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

/** Centered label + heading + short text — the opening of most sections. */
export function SectionIntro({
  label,
  title,
  text,
  tone = 'ink',
  as: Tag = 'h2',
  className = '',
  ornament = false,
}: {
  label?: string
  title?: string | null
  text?: string | null
  tone?: 'ink' | 'cream'
  as?: 'h1' | 'h2'
  className?: string
  ornament?: boolean
}) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      {ornament ? <Ornament className={`mb-8 h-10 ${tone === 'cream' ? 'text-cream/60' : 'text-bronze'}`} /> : null}
      {label ? <Label className={tone === 'cream' ? 'text-cream/70' : 'text-bronze'}>{label}</Label> : null}
      {title ? (
        <Tag className={`font-display text-display ${label ? 'mt-6' : ''}`}>
          <Emphasis text={title} />
        </Tag>
      ) : null}
      {text ? (
        <p className={`mx-auto mt-7 max-w-xl text-lead font-light ${tone === 'cream' ? 'text-mist' : 'text-ink-soft'}`}>
          {text}
        </p>
      ) : null}
    </div>
  )
}

/**
 * A designed stand-in for material the restaurant hasn't supplied yet —
 * labelled, so the site is honest about what is pending.
 */
export function Placeholder({
  label,
  note,
  className = '',
}: {
  label: string
  note?: string
  className?: string
}) {
  return (
    // Positioning comes from the caller (e.g. "absolute inset-0" to fill a
    // photo slot) — a built-in `relative` here would override it.
    <div className={`flex flex-col items-center justify-center gap-5 bg-cream p-10 text-center text-ink ${className}`}>
      <Ornament className="h-12 text-bronze/50" />
      <span className="label text-bronze">Coming soon</span>
      <span className="font-display text-subtitle">{label}</span>
      {note ? <span className="max-w-[30ch] text-sm font-light text-stone">{note}</span> : null}
    </div>
  )
}
