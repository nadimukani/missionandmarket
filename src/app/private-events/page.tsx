import { CmsPage, cmsPageMetadata } from '@/components/cms-page'

export const generateMetadata = () =>
  cmsPageMetadata('private-events', {
    title: 'Private Events',
    description:
      'Private dining, buyouts and celebrations at Mission + Market in Buckhead, Atlanta.',
  })

export default function PrivateEventsPage() {
  return <CmsPage slug="private-events" eyebrow="Private dining" />
}
