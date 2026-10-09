// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply, reset, sid, aid } from './model.js'
import { typing, matches, route, handle } from './mentions.js'

// handoff.js reaches the page through transcript.js: a bare stand-in will do.
globalThis.document ??= { querySelector: () => null, addEventListener() {} }
const { handoffText, recipients, itemOf } = await import('./handoff.js')
const { nodes } = await import('./model.js')

test('a letter or an output is handed over in plain words', () => {
  assert.equal(handoffText({ kind: 'letter', from: 'Fix the build', text: 'The cache key was stale.' }),
    'Passing on what the thread “Fix the build” said, in case it helps:\n\nThe cache key was stale.')
  assert.equal(handoffText({ kind: 'output', from: 'Fix the build', output: { type: 'pr', title: 'Fix the stale key', url: 'https://github.com/o/r/pull/7' } }),
    'Have a look at this pull request from “Fix the build”: Fix the stale key (https://github.com/o/r/pull/7)')
  assert.equal(handoffText({ kind: 'output', output: { type: 'file', title: 'a.ts', path: 'a.ts' } }), 'Have a look at this file: a.ts')
})

test('anyone live can take it: threads, then their agents still around', () => {
  reset()
  apply({ t: 1, session: 's1', kind: 'session.start' })
  apply({ t: 2, session: 's1', kind: 'turn.start', text: 'Fix the build' })
  apply({ t: 3, session: 's1', kind: 'agent.spawn', agent: 'a', type: 'Explore', name: 'scout' })
  apply({ t: 4, session: 's1', kind: 'agent.spawn', agent: 'b', type: 'Plan' })
  apply({ t: 5, session: 's1', kind: 'agent.end', agent: 'b', status: 'completed' })
  apply({ t: 6, session: 's1', kind: 'turn.complete', reason: 'answer', answer: 'Fixed it.' })
  const people = recipients([...nodes.values()])
  assert.deepEqual(people.map(p => p.id), [sid('s1'), aid('s1', 'a')])
  assert.equal(itemOf(`letter|${sid('s1')}`).text, 'Fixed it.')
  assert.equal(itemOf('letter|nobody'), null)
})

test('@ brings up the thread’s agents by name, and routes the reply', () => {
  assert.deepEqual(typing('ask @sc', 7), { query: 'sc', start: 4 })
  assert.equal(typing('mail me@home', 12), null)
  const people = [{ id: 'a', name: 'scout' }, { id: 'b', name: 'general-purpose' }, { id: 'c', name: 'code reviewer' }]
  assert.deepEqual(matches(people, 'p').map(p => p.id), ['b'])
  assert.deepEqual(matches(people, '').map(p => p.id), ['a', 'b', 'c'])
  assert.equal(handle('code reviewer'), 'code-reviewer')
  assert.deepEqual(route('@scout, check the CI logs', people), { to: people[0], text: 'check the CI logs' })
  assert.deepEqual(route('Please @Code-Reviewer look again', people), { to: people[2], text: 'Please look again' })
  assert.equal(route('email scout@example.com', people).to, undefined)
})
