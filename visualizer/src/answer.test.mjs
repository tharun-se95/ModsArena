// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toggle, isReady, payload, summary, bubbleOptions, keyOf } from './answer.js'

const one = { id: 'q1', type: 'question', who: { session: 's1' }, questions: [{ question: 'Which one?', multiSelect: false, options: [{ label: 'A' }, { label: 'B' }] }] }
const two = { ...one, questions: [...one.questions, { question: 'Run what?', multiSelect: true, options: [{ label: 'Tests' }, { label: 'Lint' }] }] }

test('a pick holds one answer, or several on a multi-select', () => {
  let picks = toggle({}, 0, 'A', false)
  picks = toggle(picks, 0, 'B', false)
  assert.deepEqual(picks[0], ['B'])
  picks = toggle(picks, 1, 'Tests', true)
  picks = toggle(picks, 1, 'Lint', true)
  assert.deepEqual(picks[1], ['Tests', 'Lint'])
  assert.deepEqual(toggle(picks, 1, 'Tests', true)[1], ['Lint'])
})

test('ready once every question has a pick, or there are your own words', () => {
  assert.equal(isReady(two, { 0: ['A'] }), false)
  assert.equal(isReady(two, { 0: ['A'], 1: ['Lint'] }), true)
  assert.equal(isReady(two, {}, ' only the fast ones '), true)
})

test('the answer is keyed by question, as Claude Code keys it', () => {
  assert.deepEqual(payload(two, { 0: ['A'], 1: ['Tests', 'Lint'] }), { answers: { 'Which one?': 'A', 'Run what?': 'Tests, Lint' } })
  assert.deepEqual(payload(one, {}, 'neither'), { answers: {}, note: 'neither' })
  assert.deepEqual(payload({ type: 'plan' }, {}, ' smaller steps '), { choice: 'keep', note: 'smaller steps' })
  assert.equal(summary(two, { answers: { a: 'A', b: 'Tests, Lint' } }), 'A · Tests, Lint')
  assert.equal(summary({ type: 'plan' }, { choice: 'keep' }), 'Kept planning')
  assert.equal(keyOf(one), 's1|q1')
})

test('a bubble offers choices only for one single-answer question', () => {
  assert.deepEqual(bubbleOptions(one), ['A', 'B'])
  assert.equal(bubbleOptions(two), undefined)
  assert.equal(bubbleOptions({ type: 'plan' }), undefined)
})
