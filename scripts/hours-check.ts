// Sanity check for the open/closed logic, including split-service weekend days
// where the kitchen shuts between brunch and dinner.
import { getOpenState } from '../src/lib/hours.ts'

const hours = [
  { day: 'Monday', opens: '11:30', closes: '21:30' },
  { day: 'Tuesday', opens: '11:30', closes: '21:30' },
  { day: 'Wednesday', opens: '11:30', closes: '21:30' },
  { day: 'Thursday', opens: '11:30', closes: '22:00' },
  { day: 'Friday', opens: '11:30', closes: '23:00' },
  { day: 'Saturday', opens: '11:00', closes: '15:00' },
  { day: 'Saturday', opens: '17:00', closes: '23:00' },
  { day: 'Sunday', opens: '11:00', closes: '15:00' },
  { day: 'Sunday', opens: '17:00', closes: '20:00' },
]

// UTC times; Atlanta is UTC-4 in July.
const cases: [string, string, string][] = [
  ['2026-07-22T19:00:00Z', 'Wed 3:00pm ET', 'open until 9:30pm'],
  ['2026-07-22T15:00:00Z', 'Wed 11:00am ET', 'closed, opens today 11:30am'],
  ['2026-07-23T01:00:00Z', 'Wed 9:00pm ET', 'closing-soon 30m'],
  ['2026-07-25T18:00:00Z', 'Sat 2:00pm ET', 'open (brunch) until 3pm'],
  ['2026-07-25T20:00:00Z', 'Sat 4:00pm ET', 'CLOSED between services'],
  ['2026-07-25T22:00:00Z', 'Sat 6:00pm ET', 'open (dinner) until 11pm'],
  ['2026-07-26T20:00:00Z', 'Sun 4:00pm ET', 'CLOSED between services'],
  ['2026-07-26T23:30:00Z', 'Sun 7:30pm ET', 'closing-soon (8pm)'],
]

let bad = 0
for (const [iso, when, expect] of cases) {
  const s = getOpenState(hours, new Date(iso))
  const gapCase = expect.startsWith('CLOSED')
  if (gapCase && s.status !== 'closed') bad += 1
  console.log(`${when.padEnd(16)} ${expect.padEnd(30)} -> ${JSON.stringify(s)}`)
}
if (bad) { console.error(`\n${bad} gap case(s) wrong`); process.exit(1) }
console.log('\nall gap cases correct')
