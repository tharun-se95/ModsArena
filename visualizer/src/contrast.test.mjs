// node --test visualizer/src/*.test.mjs
// WCAG 2.1 AA for the page's own colors, read from index.html's tokens in
// light and dark: text 4.5:1 on the panels' paper and the page, focus
// rings and other marks 3:1.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../../agent-office/server/public/index.html', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

const hex = h => { h = h.slice(1); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) }
const lum = rgb => { const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
export const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// Every `selector { --token: value; ... }` block, in order.
function tokens(selector) {
  const out = {}
  const re = /([^{}]+)\{([^{}]*)\}/g
  for (const [, sel, body] of css.matchAll(re)) {
    if (sel.trim().split('\n').pop().trim() !== selector) continue
    for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) out[name] = value.trim()
  }
  return out
}
const light = tokens(':root')
const dark = { ...light, ...tokens(':root[data-theme="dark"]') }
const resolve = (theme, v) => (v.startsWith('var(') ? resolve(theme, theme[v.slice(6, -1)]) : v)

for (const [name, theme] of [['light', light], ['dark', dark]]) {
  const c = k => resolve(theme, theme[k])
  test(`text passes AA on paper and page (${name})`, () => {
    for (const k of ['ink', 'muted', 'accent-ink', 'ok-ink', 'warn-ink', 'crit-ink', 'teal-ink', 'lilac-ink']) {
      for (const bg of ['paper', 'bg']) {
        assert.ok(ratio(c(k), c(bg)) >= 4.5, `${k} on ${bg}: ${ratio(c(k), c(bg)).toFixed(2)}`)
      }
    }
    assert.ok(ratio(c('on-accent'), c('accent')) >= 4.5, `on-accent on accent: ${ratio(c('on-accent'), c('accent')).toFixed(2)}`)
  })
  test(`focus rings stand out (${name})`, () => {
    for (const bg of ['paper', 'bg']) assert.ok(ratio(c('focus'), c(bg)) >= 3, `focus on ${bg}`)
  })
}

// The clay buttons (Approve, the suggested answer, Send) take their text
// color from --on-accent, which the tests above hold to 4.5:1 in both themes.
test('clay buttons use the on-accent text color', () => {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, sel]) => sel.includes('.ask-opts.row .ask-opt.rec'))
  const colors = rules.flatMap(([, , body]) => [...body.matchAll(/(?:^|;)\s*color:\s*([^;]+)/g)].map(m => m[1].trim()))
  assert.ok(colors.length, 'a rule colors the Approve button')
  assert.equal(colors.at(-1), 'var(--on-accent)')
  assert.ok(!colors.includes('#fff'), 'no fixed white text on clay')
})
