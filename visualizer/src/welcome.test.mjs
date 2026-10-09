// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { backoff, greeting, FIRST_COMMAND } from './welcome.js'

test('a lost bridge is retried quickly at first, then every half minute', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 9].map(backoff), [2, 4, 8, 15, 30, 30])
})

test('the greeter speaks to a first visit and to an office with past sessions hidden', () => {
  assert.match(greeting().title, /ready for you/)
  assert.match(greeting({ hasPast: true }).body, /Past sessions/)
  assert.equal(FIRST_COMMAND, 'claude')
})
