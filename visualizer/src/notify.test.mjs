// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { inQuiet, titleFor, arrivals, alertFor } from './notify.js'

const at = (h, m = 0) => new Date(2026, 9, 8, h, m)

test('quiet hours wrap past midnight, and do nothing when off', () => {
  const quiet = { on: true, from: '22:00', to: '08:00' }
  assert.equal(inQuiet(at(23, 30), quiet), true)
  assert.equal(inQuiet(at(3), quiet), true)
  assert.equal(inQuiet(at(8), quiet), false)
  assert.equal(inQuiet(at(12), quiet), false)
  assert.equal(inQuiet(at(13), { on: true, from: '12:30', to: '14:00' }), true)
  assert.equal(inQuiet(at(23), { ...quiet, on: false }), false)
  assert.equal(inQuiet(at(23), { on: true, from: 'soon', to: '08:00' }), false)
})

test('the tab title counts what waits on you', () => {
  assert.equal(titleFor(0), 'Agent Office')
  assert.equal(titleFor(2), '(2) Agent Office')
})

test('only a change into waiting on you pings, and a question always does', () => {
  const before = new Map([['a', 'working'], ['b', 'waiting'], ['c', 'waiting'], ['d', 'working']])
  const now = [
    { id: 'a', state: 'waiting' }, // finished: ping
    { id: 'b', state: 'waiting' }, // no change
    { id: 'c', state: 'asking' }, // a question: ping
    { id: 'd', state: 'working' },
    { id: 'e', state: 'waiting' }, // first seen: no ping
  ]
  assert.deepEqual(arrivals(before, now).map(t => t.id), ['a', 'c'])
  assert.deepEqual(arrivals(new Map([['a', 'asking']]), [{ id: 'a', state: 'waiting' }]), [])
})

test('an alert says who, what and where in plain words', () => {
  const n = { prompts: [{ text: 'Fix the build' }], projectName: 'acme/web', answer: { text: 'Fixed. Open a PR?' } }
  assert.deepEqual(alertFor(n, 'waiting'), { title: '“Fix the build” is waiting on you', body: 'Fixed. Open a PR? · Web' })
  const asking = { ...n, asks: [{ type: 'question', questions: [{ question: 'Which branch?' }] }] }
  assert.equal(alertFor(asking, 'asking').body, 'Which branch? · Web')
  assert.match(alertFor({ label: 'x' }, 'stuck').title, /needs a look/)
})
