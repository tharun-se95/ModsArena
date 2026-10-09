// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { moodOf, envelope, PERK_S, SULK_S, CHEER_S, YAWN_EVERY, YAWN_AFTER } from './moods.js'

test('a fresh moment shows, then passes', () => {
  assert.equal(moodOf(10.5, { cheerAt: 10 }).kind, 'cheer')
  assert.equal(moodOf(10 + CHEER_S + 0.01, { cheerAt: 10 }).kind, null)
  assert.equal(moodOf(11, { sulkAt: 10 }).kind, 'sulk')
  assert.equal(moodOf(10 + SULK_S, { sulkAt: 10 }).kind, null)
  assert.equal(moodOf(10.2, { perkAt: 10 }).kind, 'perk')
  assert.equal(moodOf(10 + PERK_S, { perkAt: 10 }).kind, null)
})

test('your reply outranks a sulk, a sulk outranks a cheer, and thinking waits its turn', () => {
  assert.equal(moodOf(10.5, { perkAt: 10, sulkAt: 10, cheerAt: 10, thinking: true }).kind, 'perk')
  assert.equal(moodOf(10.5, { sulkAt: 10, cheerAt: 10, thinking: true }).kind, 'sulk')
  assert.equal(moodOf(10.5, { cheerAt: 10, thinking: true }).kind, 'cheer')
  assert.equal(moodOf(10.5, { thinking: true }).kind, 'think')
})

test('a sleeping critter has no moods', () => {
  assert.equal(moodOf(10.5, { asleep: true, cheerAt: 10, thinking: true }).kind, null)
})

test('a critter waiting a while yawns now and then, not all the time', () => {
  let yawns = 0
  for (let t = 0; t < YAWN_EVERY * 4; t += 0.1) if (moodOf(t, { idleFor: YAWN_AFTER, seed: 1 }).kind === 'yawn') yawns++
  assert.ok(yawns > 0 && yawns < YAWN_EVERY * 4 * 10 * 0.2)
  assert.equal(moodOf(1, { idleFor: YAWN_AFTER - 1, seed: 0 }).kind, null)
})

test('one object is reused', () => {
  const out = { kind: null, k: 0 }
  assert.equal(moodOf(10.5, { cheerAt: 10 }, out), out)
  assert.equal(moodOf(99, {}, out).kind, null)
})

test('the envelope eases in and out', () => {
  assert.equal(envelope(0), 0)
  assert.equal(envelope(1), 0)
  assert.equal(envelope(0.5), 1)
  assert.ok(envelope(0.05) > 0 && envelope(0.05) < 1)
})
