import { MenuSwitcher } from '@/components/menu-switcher'
import { getMenuList, getSchedule } from '@/sanity/queries'

/**
 * Shared by the /menus chooser and every menu page. The switcher lives here,
 * so moving between menus keeps it in place and swaps only the menu beneath.
 */
export default async function MenusLayout({ children }: { children: React.ReactNode }) {
  const [menus, schedule] = await Promise.all([getMenuList(), getSchedule()])
  return (
    <>
      <MenuSwitcher
        menus={menus.map(({ slug, title, services }) => ({ slug, title, services }))}
        schedule={schedule}
      />
      {children}
    </>
  )
}
