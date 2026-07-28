import { Shell } from '@/components/ui'

/** Shared page masthead. Dark band under the sticky header so every interior
 *  page opens with the same rhythm as the homepage hero. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  children?: React.ReactNode
}) {
  return (
    <div className="band-lg bg-ink">
      <Shell className="text-center">
        {eyebrow ? (
          <p className="eyebrow load-in text-brass-ondark">{eyebrow}</p>
        ) : null}
        <h1 className="load-in mt-4 font-display text-4xl text-cream [--load-delay:80ms] lg:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="load-in mx-auto mt-5 max-w-[40rem] font-sans text-base leading-relaxed text-cream-muted [--load-delay:160ms]">
            {intro}
          </p>
        ) : null}
        {children ? (
          <div className="load-in [--load-delay:240ms]">{children}</div>
        ) : null}
      </Shell>
    </div>
  )
}
