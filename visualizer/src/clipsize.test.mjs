// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clampPanel, dragPanel, fromOld, clampSheet, dragSheet, PANEL_W, PANEL_MIN_W, SHEET_SHARE } from './clipsize.js'

const desk = { vw: 1440, vh: 900 }

test('the panel starts half as wide again as the old 320px directory', () => {
  assert.equal(PANEL_W, 480)
  assert.equal(clampPanel(null, desk), 480)
  assert.equal(clampPanel('wide', desk), 480) // junk saved falls back
})

test('a width stays readable and on screen, and leaves the left panel clear', () => {
  assert.equal(clampPanel(100, desk), PANEL_MIN_W)
  assert.equal(clampPanel(5000, desk), 1440 - 322 - 32)
  // A window smaller than the minimum still gets the minimum.
  assert.equal(clampPanel(900, { vw: 320, vh: 300 }), PANEL_MIN_W)
})

test('dragging the left edge left widens it, right narrows it', () => {
  assert.equal(dragPanel(480, -50), 530)
  assert.equal(dragPanel(480, 40), 440)
})

test('a clipboard width saved by 0.10 carries over; anything else is the default', () => {
  assert.equal(fromOld({ w: 600, h: 720 }), 600)
  assert.equal(fromOld(null), null)
  assert.equal(fromOld({ w: 'wide' }), null)
})

test('the phone sheet keeps a share of the screen, with office showing above', () => {
  const room = 714 // a 844px phone between its bars
  assert.equal(clampSheet(undefined, room), SHEET_SHARE)
  assert.equal(clampSheet(0.01, room), 180 / room)
  assert.equal(clampSheet(1, room), 1 - 72 / room)
  // Dragging the handle up 100px grows it by 100px.
  assert.ok(Math.abs(dragSheet(0.5, -100, room) * room - (0.5 * room + 100)) < 1e-9)
})
