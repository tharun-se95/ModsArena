// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { caption, fileName, cropOf } from './snapshot.js'

test('the caption and file name carry the date', () => {
  const d = new Date(2026, 9, 9, 8, 5)
  assert.match(caption(d), /^My Agent Office · .*2026/)
  assert.equal(fileName(d), 'agent-office-2026-10-09-0805.png')
})

test('the picture is cropped to what the panels leave free, unless that is too little', () => {
  assert.deepEqual(cropOf(2880, 1800, { left: 320, right: 350, top: 60, bottom: 0 }, 2), { x: 640, y: 120, w: 1540, h: 1680 })
  // A phone: the panels cover most of it, so take the whole stage.
  assert.deepEqual(cropOf(780, 1688, { left: 0, right: 0, top: 60, bottom: 500 }, 2), { x: 0, y: 0, w: 780, h: 1688 })
})
