// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clampClip, clampSheet, dragClip, dragSheet, CLIP_W, CLIP_MIN_W, CLIP_MIN_H, SHEET_SHARE } from './clipsize.js'

const desk = { vw: 1440, vh: 900 }

test('the clipboard starts about 1.3 times the old 320px, and taller', () => {
  assert.equal(CLIP_W, 416)
  const s = clampClip(null, desk)
  assert.equal(s.w, 416)
  assert.equal(s.h, 720)
  assert.equal(clampClip(null, { vw: 1280, vh: 700 }).h, 700 - 74 - 16) // as tall as the window allows
})

test('a size stays readable and on screen, and leaves the left panel clear', () => {
  assert.deepEqual(clampClip({ w: 100, h: 50 }, desk), { w: CLIP_MIN_W, h: CLIP_MIN_H })
  const big = clampClip({ w: 5000, h: 5000 }, desk)
  assert.equal(big.w, 1440 - 322 - 32)
  assert.equal(big.h, 900 - 90)
  // A saved size that's junk falls back to the default.
  assert.deepEqual(clampClip({ w: 'wide', h: NaN }, desk), clampClip(null, desk))
  // A window smaller than the minimum still gets the minimum.
  assert.deepEqual(clampClip({ w: 900, h: 900 }, { vw: 320, vh: 300 }), { w: CLIP_MIN_W, h: CLIP_MIN_H })
})

test('dragging the left edge widens it; the corner also makes it taller', () => {
  const start = { w: 416, h: 600 }
  assert.deepEqual(dragClip(start, -50, 30, 'edge'), { w: 466, h: 600 })
  assert.deepEqual(dragClip(start, 40, 30, 'corner'), { w: 376, h: 630 })
})

test('the phone sheet keeps a share of the screen, with office showing above', () => {
  const room = 714 // a 844px phone between its bars
  assert.equal(clampSheet(undefined, room), SHEET_SHARE)
  assert.equal(clampSheet(0.01, room), 180 / room)
  assert.equal(clampSheet(1, room), 1 - 72 / room)
  // Dragging the handle up 100px grows it by 100px.
  assert.ok(Math.abs(dragSheet(0.5, -100, room) * room - (0.5 * room + 100)) < 1e-9)
})
