// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { describe, letter, arrivals } from './a11y.js'

const thread = { kind: 'session', label: 'session', prompts: [{ text: 'Fix the build' }], projectName: 'acme/web' }

test('a thread reads as one plain sentence', () => {
  assert.equal(describe(thread, { state: 'working', helpers: 2, percent: 41 }), 'Fix the build, in acme/web: working, 2 agents helping, context 41% full.')
  assert.equal(describe(thread, { state: 'asking' }), 'Fix the build, in acme/web: needs your answer.')
})

test('a new letter says whose it is and what it waits on', () => {
  assert.equal(letter({ ...thread, answer: { text: 'Done. Open a PR?' } }, 'waiting'), 'New letter: Fix the build is waiting on you. It said “Done. Open a PR?”')
  assert.equal(letter(thread, 'asking', { question: 'Which backoff?' }), 'New letter: Fix the build asks: Which backoff?')
  assert.match(letter(thread, 'stuck'), /needs a look/)
})

test('only letters that just arrived are announced', () => {
  assert.deepEqual(arrivals(new Set(['a', 'b']), ['b', 'c', 'a', 'd']), ['c', 'd'])
  assert.deepEqual(arrivals(new Set(), []), [])
})
