// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { due, budget, setSaving, NORMAL, SAVING } from './power.js'

test('a frame cap of 30 draws every second frame of a 60 Hz screen', () => {
  const frames = Array.from({ length: 61 }, (_, i) => i * (1000 / 60))
  let last = -Infinity
  let drawn = 0
  for (const t of frames) if (due(t, last, 30)) { last = t; drawn++ }
  assert.equal(drawn, 31)
  assert.equal(frames.filter(t => due(t, t - 1, 0)).length, 61)
})

test('saving battery lowers the pixel ratio, frame rate and shadow work', () => {
  setSaving(false)
  assert.equal(budget(), NORMAL)
  setSaving(true)
  assert.equal(budget(), SAVING)
  assert.ok(SAVING.pixelRatio < NORMAL.pixelRatio && SAVING.shadowSize < NORMAL.shadowSize && SAVING.shadowEvery > NORMAL.shadowEvery)
  setSaving(false)
})
