/**
 * The allergen and raw-or-undercooked notices, under every menu. They come
 * from Restaurant Info → Menu notices, so one edit covers every menu — and a
 * menu whose PDF lacks them (the happy-hour sheet) still carries them.
 * Capitals at a legible size, as Georgia's food code asks of these notices.
 */
export function MenuNotices({ notices, className = '' }: { notices: (string | undefined)[]; className?: string }) {
  const list = notices.map((n) => n?.trim()).filter((n): n is string => Boolean(n))
  if (!list.length) return null
  return (
    <div className={`mx-auto grid max-w-2xl gap-3 text-center ${className}`}>
      {list.map((n, i) => (
        <p key={i} className="text-xs leading-relaxed font-medium tracking-[0.06em] text-ink-soft uppercase">
          {n}
        </p>
      ))}
    </div>
  )
}
