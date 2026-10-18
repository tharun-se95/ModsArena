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

test('the office idles at 15 frames a second when nothing happens or the window is elsewhere', async () => {
  const { fpsNow, IDLE_FPS, IDLE_AFTER_MS } = await import('./power.js')
  setSaving(false)
  assert.equal(fpsNow({ now: 1000, lastActive: 0, focused: true }), NORMAL.fps)
  assert.equal(fpsNow({ now: IDLE_AFTER_MS + 1, lastActive: 0, focused: true }), IDLE_FPS)
  assert.equal(fpsNow({ now: 1000, lastActive: 0, focused: false }), IDLE_FPS)
  assert.ok(NORMAL.fps > 0 && NORMAL.fps <= 60, 'never uncapped')
})

test('saving follows the battery until you choose', async () => {
  const { followBattery, isSaving } = await import('./power.js')
  const listeners = []
  const battery = { charging: false, addEventListener: (_, fn) => listeners.push(fn) }
  // A choice is already made above (setSaving), so the battery is ignored.
  followBattery(battery)
  assert.equal(isSaving(), false)
})

test('with no choice made, unplugging saves battery and plugging in stops', async () => {
  const fresh = await import('./power.js?fresh')
  const listeners = []
  const battery = { charging: false, addEventListener: (_, fn) => listeners.push(fn) }
  fresh.followBattery(battery)
  assert.equal(fresh.isSaving(), true)
  battery.charging = true
  for (const fn of listeners) fn()
  assert.equal(fresh.isSaving(), false)
})
