import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'

/**
 * Renders `*word*` as italic. The CMS headlines carry their emphasis this way
 * ("West Coast *flavor*, in the heart of Buckhead.") so the client can move
 * the accent without touching code — and a stray asterisk degrades to plain
 * text rather than breaking the layout.
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

export function Eyebrow({
  children,
  className = '',
  as: Tag = 'p',
}: {
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'h2' | 'h3'
}) {
  return <Tag className={`eyebrow ${className}`}>{children}</Tag>
}

/** The brand's "+" — thin, square-ended, drawn rather than typed so it sits
 *  optically centred against both the serif and the sans. */
export function Plus({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={className} fill="none">
      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

export function Arrow({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className={className} fill="none">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

type ButtonTone = 'moss' | 'cream' | 'line'

const TONE: Record<ButtonTone, string> = {
  moss: 'btn btn-moss',
  cream: 'btn btn-cream',
  line: 'btn btn-line',
}

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href)
}

export function ButtonLink({
  href,
  children,
  tone = 'moss',
  className = '',
  newTab,
}: {
  href: string
  children: ReactNode
  tone?: ButtonTone
  className?: string
  /** Defaults to true for off-site http(s) links. */
  newTab?: boolean
}) {
  const cls = `${TONE[tone]} ${className}`
  if (isExternal(href)) {
    const blank = newTab ?? href.startsWith('http')
    return (
      <a
        href={href}
        className={cls}
        {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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

/** Small tracked link with the brand plus — "+ Dinner menu". */
export function PlusLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const inner = (
    <>
      <Plus className="size-2.5 transition-transform duration-300 group-hover:rotate-90" />
      <span className="link">{children}</span>
    </>
  )
  const cls = `group eyebrow inline-flex items-center gap-2.5 ${className}`
  return isExternal(href) ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className = '',
  tone = 'ink',
}: {
  eyebrow?: string
  title: string
  intro?: string
  className?: string
  tone?: 'ink' | 'cream'
}) {
  return (
    <div className={className}>
      {eyebrow ? (
        <Eyebrow className={tone === 'cream' ? 'text-mist' : 'text-bronze'}>{eyebrow}</Eyebrow>
      ) : null}
      <h2 className="mt-4 font-display text-display">
        <Emphasis text={title} />
      </h2>
      {intro ? (
        <p
          className={`mt-6 max-w-prose text-lead ${tone === 'cream' ? 'text-mist' : 'text-stone'}`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  )
}

/**
 * A designed stand-in for content the restaurant has not supplied yet. It is
 * deliberately labelled — the site is honest about what is pending rather
 * than filling the gap with something invented.
 */
export function Placeholder({
  label,
  note,
  className = '',
  tone = 'cream',
}: {
  label: string
  note?: string
  className?: string
  tone?: 'cream' | 'moss' | 'teal'
}) {
  const surface =
    tone === 'moss'
      ? 'bg-moss text-cream'
      : tone === 'teal'
        ? 'bg-teal text-cream'
        : 'bg-cream text-ink'
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden p-8 text-center ${surface} ${className}`}
    >
      <span
        aria-hidden="true"
        className="logo-mask absolute inset-y-[18%] left-1/2 w-[14%] -translate-x-1/2 opacity-[0.07]"
        style={{ maskImage: 'url(/brand/mm-mark.png)', WebkitMaskImage: 'url(/brand/mm-mark.png)' }}
      />
      <span className="eyebrow relative border border-current/30 px-3 py-1.5">Placeholder</span>
      <span className="relative font-display text-card">{label}</span>
      {note ? <span className="relative max-w-[28ch] text-sm opacity-75">{note}</span> : null}
    </div>
  )
}
