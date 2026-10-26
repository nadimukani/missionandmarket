import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'

import { AnnouncementBar } from '@/components/announcement-bar'
import { MobileActionBar } from '@/components/mobile-action-bar'
import { ReserveDialog } from '@/components/reserve'
import { RestaurantJsonLd } from '@/components/restaurant-json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getAnnouncement, getMenuList, getSchedule, getSettings } from '@/sanity/queries'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, announcement, schedule, menus, draft] = await Promise.all([
    getSettings(),
    getAnnouncement(),
    getSchedule(),
    getMenuList(),
    draftMode(),
  ])
  const instagram = settings?.social?.find((s) => s.platform === 'Instagram')?.url
  const a = settings?.address
  const addressLines = a
    ? [a.street, a.street2, [[a.city, a.state].filter(Boolean).join(', '), a.zip].filter(Boolean).join(' ')].filter(
        (l): l is string => Boolean(l),
      )
    : []

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only z-[70] bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <SiteHeader
        banner={<AnnouncementBar announcement={announcement} schedule={schedule} />}
        phone={settings?.phone}
        addressLines={addressLines}
        mapsUrl={settings?.mapsUrl}
        instagramUrl={instagram}
      />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <SiteFooter settings={settings} schedule={schedule} />
      <MobileActionBar phone={settings?.phone} mapsUrl={settings?.mapsUrl} />
      <ReserveDialog rid={settings?.openTableRid} phone={settings?.phone} schedule={schedule} />
      <RestaurantJsonLd settings={settings} schedule={schedule} menus={menus} />
      {/* Visits (cookieless) and real visitors' page speed, in the Vercel dashboard. */}
      <Analytics />
      <SpeedInsights />

      {draft.isEnabled ? (
        <>
          {/* Inside the Studio's live preview: click any text to edit it. */}
          <VisualEditing />
          <a
            href="/api/draft-mode/disable"
            className="label fixed bottom-4 left-4 z-[80] bg-ink px-4 py-3 text-cream shadow-lg"
          >
            Preview · exit
          </a>
        </>
      ) : null}
    </div>
  )
}
