// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as model from './model.js'
import * as words from './words.js'

const feed = evs => evs.forEach(ev => { model.apply(ev); words.ingest(ev) })
const at = (t, ev) => ({ t, session: 's1', ...ev })

test('the feed leads with outcomes and folds the bumps it worked past', () => {
  model.reset()
  words.reset()
  feed([
    at(1, { kind: 'session.start', project: { id: '/w/pay', name: 'acme/payments-api' } }),
    at(2, { kind: 'turn.start', text: 'Fix the flaky build' }),
    at(3, { kind: 'tool.start', id: 'a', tool: 'Bash', summary: 'npm test' }),
    at(4, { kind: 'tool.end', id: 'a', tool: 'Bash', ok: false }),
    at(5, { kind: 'tool.start', id: 'b', tool: 'Read', summary: 'src/auth/session.ts' }),
    at(6, { kind: 'tool.end', id: 'b', tool: 'Read', ok: false }),
    at(7, { kind: 'tool.start', id: 'c', tool: 'Edit', summary: 'src/auth/session.ts' }),
    at(8, { kind: 'tool.end', id: 'c', tool: 'Edit', ok: true }),
    at(9, { kind: 'asset.add', id: 'pr-1', type: 'pr', title: 'Fix the cache key' }),
    at(10, { kind: 'turn.complete', reason: 'answer', answer: 'Fixed it.' }),
  ])
  const [done, made, bumps, started] = words.moments
  assert.equal(done.tone, 'done')
  assert.equal(done.text, '“Fix the flaky build” finished: Fixed it.')
  assert.equal(made.tone, 'made')
  assert.equal(made.text, '“Fix the flaky build” made a pull request: Fix the cache key')
  assert.equal(bumps.tone, 'bumps')
  assert.equal(bumps.text, '2 bumps along the way in “Fix the flaky build”')
  assert.deepEqual(bumps.bumps.map(b => b.text), ['Couldn’t read the sign-in code', 'Couldn’t check the tests'])
  assert.equal(started.tone, 'quiet')
  assert.ok(!words.moments.some(m => m.tone === 'block' || m.tone === 'bad'), 'nothing red')
})

test('only real blockers turn red, until they are dealt with', () => {
  model.reset()
  words.reset()
  feed([
    at(1, { kind: 'turn.start', text: 'Ship it' }),
    at(2, { kind: 'ask.open', id: 'q', type: 'question', questions: [{ question: 'Which branch?' }] }),
  ])
  assert.equal(words.moments[0].tone, 'block')
  feed([at(3, { kind: 'ask.close', id: 'q', answer: 'main' }), at(4, { kind: 'turn.complete', reason: 'error' })])
  assert.equal(words.moments[1].tone, 'ask')
  assert.equal(words.moments[1].answer, 'main')
  assert.equal(words.moments[0].tone, 'block')
  feed([at(5, { kind: 'turn.start', text: 'Try again' })])
  assert.equal(words.moments[0].tone, 'cleared')
})
