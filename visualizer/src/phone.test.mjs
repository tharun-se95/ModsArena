// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { today } from './phone.js'

test('made today: pictures and deliveries since midnight, files as a count', () => {
  const now = new Date(2026, 9, 8, 15, 0).getTime()
  const yesterday = new Date(2026, 9, 7, 23, 0).getTime()
  const list = [
    { type: 'image', t: now - 1000 }, { type: 'pr', t: now - 2000 }, { type: 'file', t: now - 3000 },
    { type: 'file', t: now - 4000 }, { type: 'artifact', t: yesterday }, { type: 'image', t: yesterday },
  ]
  const made = today(list, now)
  assert.equal(made.pictures.length, 1)
  assert.deepEqual(made.delivered.map(o => o.type), ['pr'])
  assert.equal(made.files, 2)
})
