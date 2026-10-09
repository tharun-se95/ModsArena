// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { volumeGain, audible, limiter, DEFAULT_VOLUME } from './sound.js'

const at = (h, m = 0) => new Date(2026, 9, 8, h, m)

test('the volume curve is silent at 0, full at 100, and gentle low down', () => {
  assert.equal(volumeGain(0), 0)
  assert.equal(volumeGain(100), 0.6)
  assert.ok(Math.abs(volumeGain(50) - 0.15) < 1e-9)
  // Every step up is louder.
  for (let v = 5; v <= 100; v += 5) assert.ok(volumeGain(v) > volumeGain(v - 5))
  // Out of range and junk are clamped or fall back to the default.
  assert.equal(volumeGain(140), 0.6)
  assert.equal(volumeGain(-3), 0)
  assert.equal(volumeGain('loud'), volumeGain(DEFAULT_VOLUME))
  assert.equal(volumeGain('40'), volumeGain(40))
})

test('quiet hours mute everything but the waiting-on-you chime', () => {
  const quiet = { on: true, from: '22:00', to: '08:00', chime: true }
  assert.equal(audible('keys', { quiet, now: at(23) }), false)
  assert.equal(audible('bonk', { quiet, now: at(2) }), false)
  assert.equal(audible('nudge', { quiet, now: at(2) }), true)
  // Turn the chime off and the night is silent.
  assert.equal(audible('nudge', { quiet: { ...quiet, chime: false }, now: at(2) }), false)
  // In the day everything plays, and the nudge stays out of the way (the
  // turn's own chime already says so).
  assert.equal(audible('keys', { quiet, now: at(12) }), true)
  assert.equal(audible('nudge', { quiet, now: at(12) }), false)
  // Quiet hours off: as in the day.
  assert.equal(audible('keys', { quiet: { ...quiet, on: false }, now: at(23) }), true)
  // Muted beats everything.
  assert.equal(audible('nudge', { muted: true, quiet, now: at(2) }), false)
  assert.equal(audible('keys', { muted: true }), false)
  assert.equal(audible('keys', {}), true)
})

test('the limiter keeps a gap and a budget per window', () => {
  const l = limiter({ gap: 0.1, burst: 3, window: 2 })
  assert.equal(l.allow(0), true)
  assert.equal(l.allow(0.05), false) // too soon
  assert.equal(l.allow(0.2), true)
  assert.equal(l.allow(0.4), true)
  assert.equal(l.allow(0.6), false) // three in two seconds already
  assert.equal(l.allow(1.9), false)
  assert.equal(l.allow(2.05), true) // the first has aged out
})

test('a hundred tools in ten seconds make a handful of key taps', () => {
  const l = limiter({ gap: 0.14, burst: 6, window: 3 })
  let played = 0
  for (let i = 0; i < 100; i++) if (l.allow(i * 0.1)) played++
  assert.ok(played <= 24 && played >= 18, `played ${played}`)
})
