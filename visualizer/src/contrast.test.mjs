// node --test visualizer/src/*.test.mjs
// WCAG 2.1 AA for the page's own colors, read from index.html's tokens in
// light and dark: text 4.5:1 on the panels' paper and the page, focus
// rings and other marks 3:1. The checks live in contrast.mjs, which
// themes.test.mjs runs on every office theme too.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { css, light, dark, resolve, ratio, TEXT } from './contrast.mjs'

export { ratio }

for (const [name, theme] of [['light', light], ['dark', dark]]) {
  const c = k => resolve(theme, theme[k])
  test(`text passes AA on paper and page (${name})`, () => {
    for (const k of TEXT) {
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
