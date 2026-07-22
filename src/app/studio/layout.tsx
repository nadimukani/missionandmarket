/** The Studio owns its own full-screen chrome — bypass the site shell. */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
