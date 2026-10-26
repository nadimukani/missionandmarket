/**
 * WCAG 2.1 contrast audit for the design tokens.
 *
 * Accessibility is the single largest legal exposure for a restaurant website
 * (restaurants are expressly enumerated public accommodations under
 * 42 U.S.C. 12181(7)(B), and federal web-accessibility filings rose 27% to
 * 3,117 in 2025), so the palette is verified rather than assumed.
 *
 *   node scripts/contrast.mjs
 *
 * Exits non-zero if any text pair falls below AA. Wire into CI before launch.
 */
const hex = (h) => {
  h = h.replace('#', '')
  if (h.length === 8) h = h.slice(0, 6)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const L = (h) => {
  const [r, g, b] = hex(h).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = L(a) > L(b) ? [L(a), L(b)] : [L(b), L(a)]
  return (hi + 0.05) / (lo + 0.05)
}
const over = (fg, alpha, bg) => {
  const f = hex(fg)
  const b = hex(bg)
  return (
    '#' +
    f
      .map((c, i) => Math.round((c * alpha + b[i] * (1 - alpha)) * 255)
        .toString(16)
        .padStart(2, '0'))
      .join('')
  )
}

const INK = '#231F1F'
const MOSS = '#464B20'
const CREAM = '#F0E9D7'
// The bronze token: a shade under the old site's #8A6445 so labels pass on cream.
const BRASS = '#866143'
const PAPER = '#FAF8F4'
const PAPER_WARM = '#F4EFE4'

// [label, foreground, background, size] — 'large' is >=24px or >=19px bold.
const PAIRS = [
  ['ink on paper', INK, PAPER, 'normal'],
  ['ink on paper-warm', INK, PAPER_WARM, 'normal'],
  ['ink-muted 65% on paper', over(INK, 0.65, PAPER), PAPER, 'normal'],
  ['ink-faint 62% on paper', over(INK, 0.62, PAPER), PAPER, 'normal'],
  ['brass on paper', BRASS, PAPER, 'normal'],
  ['brass on paper-warm', BRASS, PAPER_WARM, 'normal'],
  ['brass on cream', BRASS, CREAM, 'normal'],
  ['moss on paper', MOSS, PAPER, 'normal'],
  ['cream on ink', CREAM, INK, 'normal'],
  ['cream-muted 70% on ink', over(CREAM, 0.7, INK), INK, 'normal'],
  ['cream on moss', CREAM, MOSS, 'normal'],
  ['brass-ondark on ink', '#A08165', INK, 'normal'],
  // Brass on moss tops out at 2.55:1 — the two brand colours are too close in
  // luminance. Moss bands therefore use cream for accents, never brass.
  ['cream-muted 70% on moss', over(CREAM, 0.7, MOSS), MOSS, 'normal'],
  ['cream on brass-button', CREAM, '#866143', 'normal'],
  ['cream on brass-button hover', CREAM, '#725239', 'normal'],
  ['paper on moss button', PAPER, MOSS, 'normal'],
  ['paper on ink button', PAPER, INK, 'normal'],
]

const threshold = (size) => (size === 'large' ? 3.0 : 4.5)

let failed = 0
console.log('WCAG 2.1 contrast audit\n')
console.log('pair'.padEnd(28) + 'ratio'.padEnd(9) + 'req'.padEnd(7) + 'result')
console.log('-'.repeat(58))

for (const [label, fg, bg, size] of PAIRS) {
  const r = ratio(fg, bg)
  const req = threshold(size)
  const pass = r >= req
  if (!pass) failed += 1
  const tag = !pass ? 'FAIL' : r >= 7 ? 'PASS (AAA)' : 'PASS'
  console.log(
    label.padEnd(28) + r.toFixed(2).padEnd(9) + `${req}:1`.padEnd(7) + tag,
  )
}

console.log(`\n${PAIRS.length - failed}/${PAIRS.length} pass`)
if (failed > 0) {
  console.error(`\n${failed} pair(s) below AA.`)
  process.exit(1)
}
