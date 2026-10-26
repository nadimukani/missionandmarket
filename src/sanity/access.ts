import type { ConfigContext, NewDocumentOptionsContext, TemplateItem, Tool } from 'sanity'

/**
 * Who sees what in the Studio. The restaurant asked to change three things
 * themselves — menu updates, events and closure notices — so anyone who is
 * not a project administrator gets just those: Menus (the PDF only),
 * Happenings and Closures, in the Studio's main tool. Everything else is
 * read-only to them. Administrators keep the whole Studio.
 *
 * Invite the restaurant's people as Editor at sanity.io/manage; an
 * Administrator sees everything.
 */

type User = { roles?: { name: string }[] } | null | undefined

export const isAdmin = (user: User) => Boolean(user?.roles?.some((role) => role.name === 'administrator'))

/** For a field's `hidden` or a type's `readOnly`: on for everyone but administrators. */
export const adminOnly = ({ currentUser }: { currentUser: User }) => !isAdmin(currentUser)

/** The main tool only: no Live preview, no query console. */
export const studioTools = (tools: Tool[], { currentUser }: ConfigContext) =>
  isAdmin(currentUser) ? tools : tools.filter((tool) => tool.name === 'structure')

/** The one thing the restaurant creates is a happening. */
export const newDocumentOptions = (items: TemplateItem[], { currentUser }: NewDocumentOptionsContext) =>
  isAdmin(currentUser) ? items : items.filter((item) => item.templateId === 'special')

/**
 * The document actions the restaurant gets, by type (null for administrators:
 * no limit here). A menu's PDF is replaced, never the menu removed; happenings
 * come and go; closures are published; anything else is read-only to them, so
 * it has none.
 */
export function clientActions(schemaType: string, user: User): string[] | null {
  if (isAdmin(user)) return null
  if (schemaType === 'menu' || schemaType === 'hours') return ['publish', 'discardChanges', 'restore']
  if (schemaType === 'special') return ['publish', 'discardChanges', 'restore', 'delete']
  return []
}
