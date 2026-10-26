import { findService, serviceSummary, type Schedule } from '@/lib/schedule'

/** "Served" lines for a menu, from Hours & Closures — one per linked service
 *  ("Lunch · Monday – Friday, 11:30am – 3pm"). A custom wording on the menu,
 *  if the owner set one, wins. */
export function servedLines(
  menu: { availability?: string; services?: string[] },
  schedule: Schedule | null,
): { service?: string; text: string }[] {
  if (menu.availability) return [{ text: menu.availability }]
  const services = menu.services ?? []
  return services
    .map((name) => ({ service: name, text: serviceSummary(findService(schedule, name)) }))
    .filter((l) => l.text)
}

/** A single line for compact places (menu tiles): one service prints its
 *  hours; several print their names ("Lunch + Dinner"). */
export function servedShort(menu: { availability?: string; services?: string[] }, schedule: Schedule | null) {
  const lines = servedLines(menu, schedule)
  if (lines.length === 1) return lines[0].text
  return lines.map((l) => l.service).filter(Boolean).join(' + ')
}
