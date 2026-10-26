import { AnnouncementBar } from '@/components/announcement-bar'
import { MobileActionBar } from '@/components/mobile-action-bar'
import { ReserveDialog } from '@/components/reserve'
import { RestaurantJsonLd } from '@/components/restaurant-json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SITE_URL, formatAddress } from '@/lib/site'
import { getAnnouncement, getMenuList, getSettings } from '@/sanity/queries'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, announcement, menus] = await Promise.all([
    getSettings(),
    getAnnouncement(),
    getMenuList(),
  ])
  const menuUrl = menus[0] ? `${SITE_URL}/menus/${menus[0].slug}` : undefined
  const instagram = settings?.social?.find((s) => s.platform === 'Instagram')?.url

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only z-100 bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <AnnouncementBar announcement={announcement} />
      <SiteHeader
        phone={settings?.phone}
        addressLine={formatAddress(settings?.address)}
        mapsUrl={settings?.mapsUrl}
        orderUrl={settings?.orderUrl}
        giftCardUrl={settings?.giftCardUrl}
        instagramUrl={instagram}
      />

      {/* tabIndex -1 so the skip link moves focus in Safari too. */}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <SiteFooter settings={settings} />
      <MobileActionBar phone={settings?.phone} mapsUrl={settings?.mapsUrl} />
      <ReserveDialog
        rid={settings?.openTableRid}
        phone={settings?.phone}
        hours={settings?.machineHours}
      />
      <RestaurantJsonLd settings={settings} menuUrl={menuUrl} />
    </div>
  )
}
