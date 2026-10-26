/**
 * Sanity checks for src/lib/schedule.ts — the hours engine every page relies on.
 *   node --experimental-strip-types scripts/schedule-check.ts
 */
import assert from 'node:assert/strict'

import {
  bannerClosure,
  bookingSlots,
  formatDays,
  formatTime,
  openState,
  serviceSummary,
  weeklyIntervals,
  type Schedule,
} from '../src/lib/schedule.ts'

const wk = ['mon', 'tue', 'wed', 'thu', 'fri']
const schedule: Schedule = {
  services: [
    { name: 'Lunch', periods: [{ days: wk, opens: '11:30', closes: '15:00' }] },
    { name: 'Happy Hour', periods: [{ days: wk, opens: '15:00', closes: '18:00' }] },
    {
      name: 'Dinner',
      periods: [
        { days: ['mon', 'tue', 'wed'], opens: '15:00', closes: '21:30' },
        { days: ['thu'], opens: '15:00', closes: '22:00' },
        { days: ['fri'], opens: '15:00', closes: '23:00' },
        { days: ['sat'], opens: '17:00', closes: '23:00' },
        { days: ['sun'], opens: '17:00', closes: '20:00' },
      ],
    },
  ],
  closures: [{ label: 'Thanksgiving', date: '2026-11-26', kind: 'closed', showBanner: true, bannerDaysBefore: 7 }],
}

// Formatting
assert.equal(formatTime('15:00'), '3pm')
assert.equal(formatTime('11:30'), '11:30am')
assert.equal(formatTime('00:00'), 'midnight')
assert.equal(formatDays(wk), 'Monday – Friday')
assert.equal(formatDays(['sat', 'sun']), 'Saturday + Sunday')
assert.equal(formatDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']), 'Every day')
assert.equal(serviceSummary(schedule.services![0]), 'Monday – Friday, 11:30am – 3pm')
assert.equal(serviceSummary(schedule.services![2]), 'Monday – Friday from 3pm · Saturday + Sunday from 5pm')

// Lunch + happy hour + dinner merge into one open stretch on weekdays.
assert.deepEqual(weeklyIntervals(schedule).mon, [{ opens: 690, closes: 1290 }])
assert.deepEqual(weeklyIntervals(schedule).sat, [{ opens: 1020, closes: 1380 }])

// Open status (America/New_York). Monday 2026-10-26 12:00 EDT = 16:00Z.
let s = openState(schedule, new Date('2026-10-26T16:00:00Z'))
assert.equal(s.status, 'open')
// Monday 23:00 EDT → closed, opens tomorrow 11:30am.
s = openState(schedule, new Date('2026-10-27T03:00:00Z'))
assert.equal(s.status, 'closed')
assert.equal(s.status === 'closed' && s.opensDay, 'tomorrow')
assert.equal(s.status === 'closed' && s.opensAt, '11:30am')
// Thanksgiving (Thu 2026-11-26) 13:00 EST = 18:00Z → closed; next open Friday.
s = openState(schedule, new Date('2026-11-26T18:00:00Z'))
assert.equal(s.status, 'closed')

// Booking: no slots on a closure; Saturday starts at 5pm.
assert.deepEqual(bookingSlots('2026-11-26', schedule), [])
assert.equal(bookingSlots('2026-10-31', schedule)[0], '17:00')
assert.equal(bookingSlots('2026-10-31', schedule).at(-1), '22:30')

// Banner shows within 7 days of the closure, not before.
assert.equal(bannerClosure(schedule, new Date('2026-11-10T15:00:00Z')), undefined)
assert.equal(bannerClosure(schedule, new Date('2026-11-20T15:00:00Z'))?.label, 'Thanksgiving')

console.log('schedule: all checks passed')
