// Throwaway sanity check for the open/closed logic against the seeded hours.
import { getOpenState } from '../src/lib/hours.ts'

const hours = [
  { day: 'Monday', opens: '11:30', closes: '21:30' },
  { day: 'Tuesday', opens: '11:30', closes: '21:30' },
  { day: 'Wednesday', opens: '11:30', closes: '21:30' },
  { day: 'Thursday', opens: '11:30', closes: '22:00' },
  { day: 'Friday', opens: '11:30', closes: '23:00' },
  { day: 'Saturday', opens: '11:00', closes: '23:00' },
  { day: 'Sunday', opens: '11:00', closes: '20:00' },
]

// All times below are UTC; Atlanta is UTC-4 in July.
const cases: [string, string][] = [
  ['2026-07-22T19:00:00Z', 'Wed 3:00pm ET — mid service'],
  ['2026-07-22T15:00:00Z', 'Wed 11:00am ET — before open'],
  ['2026-07-23T01:00:00Z', 'Wed 9:00pm ET — closing soon (30m left)'],
  ['2026-07-23T02:30:00Z', 'Wed 10:30pm ET — after close'],
  ['2026-07-27T01:00:00Z', 'Sun 9:00pm ET — after Sunday 8pm close'],
  ['2026-07-25T02:00:00Z', 'Fri 10:00pm ET — open until 11'],
]

for (const [iso, note] of cases) {
  console.log(note.padEnd(46), JSON.stringify(getOpenState(hours, new Date(iso))))
}
