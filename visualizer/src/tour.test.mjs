// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { placeNote, shouldAutoStart, STEPS } from './tour.js'

const view = { width: 1440, height: 900 }
const note = { width: 340, height: 200 }

test('the note sits below its spotlight, else above, beside, or over the bottom', () => {
  assert.equal(placeNote({ left: 600, top: 100, width: 200, height: 100 }, note, view).side, 'below')
  assert.equal(placeNote({ left: 600, top: 650, width: 200, height: 200 }, note, view).side, 'above')
  assert.equal(placeNote({ left: 20, top: 60, width: 300, height: 800 }, note, view).side, 'right')
  assert.equal(placeNote({ left: 1100, top: 60, width: 320, height: 800 }, note, view).side, 'left')
  assert.equal(placeNote({ left: 10, top: 10, width: 1420, height: 880 }, note, view).side, 'over')
  const center = placeNote(null, note, view)
  assert.deepEqual([center.left, center.top, center.side], [550, 350, 'center'])
})

test('the note never leaves the window', () => {
  const spot = placeNote({ left: 1400, top: 100, width: 30, height: 30 }, note, view)
  assert.ok(spot.left + note.width <= view.width - 12)
  assert.ok(spot.left >= 12)
})

test('the tour plays on a first visit, not under automation, and on request', () => {
  assert.equal(shouldAutoStart({ seen: false, webdriver: false }), true)
  assert.equal(shouldAutoStart({ seen: true, webdriver: false }), false)
  assert.equal(shouldAutoStart({ seen: false, webdriver: true }), false)
  assert.equal(shouldAutoStart({ param: '1', seen: true, webdriver: true }), true)
  assert.equal(shouldAutoStart({ param: '0', seen: false, webdriver: false }), false)
})

test('the tour visits the rooms, a critter, the inbox, the clipboard and replying', () => {
  assert.deepEqual(STEPS.map(s => s.at), [null, 'room', 'critter', 'board', 'side', 'reply'])
})
