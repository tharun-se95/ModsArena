// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'

// actions.js reaches the page through transcript.js: a bare stand-in will do.
globalThis.document ??= { querySelector: () => null, addEventListener() {} }
const { offered, PROMPTS } = await import('./actions.js')

test('a working thread can be stopped; a helper or a finished one cannot', () => {
  assert.deepEqual(offered({ kind: 'session' }, 'working'), ['explain', 'wrap', 'stop'])
  assert.deepEqual(offered({ kind: 'session' }, 'waiting'), ['explain', 'wrap'])
  assert.deepEqual(offered({ kind: 'agent' }, 'working'), ['explain', 'wrap'])
  assert.deepEqual(offered({ kind: 'session' }, 'ended'), [])
  assert.deepEqual(offered({ kind: 'agent' }, 'done'), [])
})

test('the quick prompts ask in plain words', () => {
  assert.match(PROMPTS.wrap, /wrap up/)
  assert.match(PROMPTS.explain, /isn’t a developer/)
})
