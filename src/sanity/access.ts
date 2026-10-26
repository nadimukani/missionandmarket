import type { ConfigContext, NewDocumentOptionsContext, TemplateItem, Tool } from 'sanity'

/**
 * Who sees what in the Studio. The restaurant asked to change three things
 * themselves — menu updates, events and closure notices — so everyone gets
 * just those: Menus (the PDF only), Happenings and Closures, in the Studio's
 * main tool, with everything else read-only. The site's developers, listed
 * here by Sanity user ID, get the whole Studio.
 *
 * The project is on Sanity's free plan, where people can only be
 * Administrators or Viewers, so the restaurant's login is an Administrator
 * too: this list, not the role, is what tells them apart. A developer signs
 * in the same way every time (a different login method can be a different
 * user); find an ID with `pnpm exec sanity users list -p x2izrrun`.
 */
const DEVELOPERS = new Set([
  'p0nm3OtDr', // the site's developer (GitHub login)
])

type User = { id?: string } | null | undefined

export const isDeveloper = (user: User) => Boolean(user?.id && DEVELOPERS.has(user.id))

/** For a field's `hidden` or a type's `readOnly`: on for everyone but developers. */
export const developerOnly = ({ currentUser }: { currentUser: User }) => !isDeveloper(currentUser)

/** The main tool only: no Live preview, no query console. */
export const studioTools = (tools: Tool[], { currentUser }: ConfigContext) =>
  isDeveloper(currentUser) ? tools : tools.filter((tool) => tool.name === 'structure')

/** The one thing the restaurant creates is a happening. */
export const newDocumentOptions = (items: TemplateItem[], { currentUser }: NewDocumentOptionsContext) =>
  isDeveloper(currentUser) ? items : items.filter((item) => item.templateId === 'special')

/**
 * The document actions the restaurant gets, by type (null for developers: no
 * limit here). A menu's PDF is replaced, never the menu removed; happenings
 * come and go; closures are published; anything else is read-only to them, so
 * it has none.
 */
export function clientActions(schemaType: string, user: User): string[] | null {
  if (isDeveloper(user)) return null
  if (schemaType === 'menu' || schemaType === 'hours') return ['publish', 'discardChanges', 'restore']
  if (schemaType === 'special') return ['publish', 'discardChanges', 'restore', 'delete']
  return []
}
