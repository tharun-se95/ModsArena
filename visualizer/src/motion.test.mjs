// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { decide } from './motion.js'

test('less motion follows the system, or your own choice', () => {
  assert.equal(decide({ system: false, chosen: false }), false)
  assert.equal(decide({ system: true, chosen: false }), true)
  assert.equal(decide({ system: false, chosen: true }), true)
})
