import { CmsPage, cmsPageMetadata } from '@/components/cms-page'

export const generateMetadata = () =>
  cmsPageMetadata('about', {
    title: 'About',
    description:
      'Mission + Market brings modern American cooking with California and Pacific Rim influence to Three Alliance Center in Buckhead, Atlanta.',
  })

export default function AboutPage() {
  return <CmsPage slug="about" eyebrow="Our story" />
}
