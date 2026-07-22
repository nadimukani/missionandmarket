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
    <div className="bg-ink pt-10 pb-16 lg:pt-16 lg:pb-24">
      <Shell className="text-center">
        {eyebrow ? (
          <p className="eyebrow text-brass-ondark">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 font-display text-4xl text-cream lg:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-cream-muted">
            {intro}
          </p>
        ) : null}
        {children}
      </Shell>
    </div>
  )
}
