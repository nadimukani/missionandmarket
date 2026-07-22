import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { PageHeader } from '@/components/page-header'
import { getMenuList } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Menus',
  description:
    'Lunch, brunch, dinner and dessert menus at Mission + Market — modern American cooking with California and Pacific Rim influence, in Buckhead, Atlanta.',
  alternates: { canonical: '/menus' },
}

export default async function MenusPage() {
  const menus = await getMenuList()

  // One canonical menu page per service; /menus is just the entry point.
  if (menus.length > 0) redirect(`/menus/${menus[0].slug}`)

  return (
    <PageHeader
      title="Menus"
      intro="Our menus are being updated. Please call us for today’s offering."
    />
  )
}
