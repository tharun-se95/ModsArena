// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { progressOf, progressHtml } from './progress.js'

const items = (...s) => s.map((status, i) => ({ text: `step ${i}`, status }))

test('a checklist reads as "3 of 7 done"', () => {
  const p = progressOf(items('completed', 'completed', 'completed', 'in_progress', 'pending', 'pending', 'pending'))
  assert.equal(p.words, '3 of 7 done')
  assert.equal(p.now, 'step 3')
  assert.equal(p.finished, false)
  assert.ok(Math.abs(p.frac - 3 / 7) < 1e-9)
})

test('a finished checklist says so, and no checklist says nothing', () => {
  assert.equal(progressOf(items('completed', 'completed')).words, 'All 2 done')
  assert.equal(progressOf(items('completed')).words, 'Done')
  assert.equal(progressOf([]), null)
  assert.equal(progressOf(undefined), null)
  assert.equal(progressHtml(undefined), '')
})

test('the bar is a progressbar with its words, and the item in hand is escaped', () => {
  const html = progressHtml([{ text: '<b>x</b>', status: 'in_progress' }, { text: 'y', status: 'pending' }], { big: true })
  assert.match(html, /role="progressbar"/)
  assert.match(html, /aria-valuenow="0"/)
  assert.match(html, /0 of 2 done/)
  assert.match(html, /now: &lt;b&gt;x&lt;\/b&gt;/)
  assert.match(html, /width:0%/)
})
