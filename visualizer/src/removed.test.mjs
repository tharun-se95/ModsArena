// node --test visualizer/src/removed.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRemoved, keyOf, KEEP } from './removed.js'

test('a removed thread’s events, and its agents’, are held back; others go through', () => {
  const r = createRemoved()
  r.add({ kind: 'session', session: 's1', label: 'Fix login' })
  assert.equal(r.hides({ kind: 'turn.start', session: 's1' }), true)
  assert.equal(r.hides({ kind: 'tool.start', session: 's1', agent: 'a1' }), true)
  assert.equal(r.hides({ kind: 'turn.start', session: 's2' }), false)
  assert.equal(r.hides({ kind: 'gauge' }), false)
})

test('a removed project takes its threads, live and past, with it', () => {
  const r = createRemoved()
  assert.equal(r.hides({ kind: 'session.start', session: 's1', project: { id: '/w/app' } }), false)
  r.add({ kind: 'project', project: '/w/app', label: 'app' })
  assert.equal(r.hides({ kind: 'tool.start', session: 's1' }), true, 'its later events follow its start')
  assert.equal(r.hidesPast({ session: 'p1', project: { id: '/w/app' } }), true)
  assert.equal(r.hidesPast({ session: 'p2', project: { id: '/w/other' } }), false)
  assert.equal(r.hides({ kind: 'turn.start', session: 'p1' }), true, 'a past thread resumed stays put away')
})

test('a removed agent: only its own events', () => {
  const r = createRemoved()
  r.add({ kind: 'agent', session: 's1', agent: 'a1' })
  assert.equal(r.hides({ kind: 'tool.start', session: 's1', agent: 'a1' }), true)
  assert.equal(r.hides({ kind: 'tool.start', session: 's1', agent: 'a2' }), false)
  assert.equal(r.hides({ kind: 'tool.start', session: 's1' }), false)
})

test('bringing one back, and what is remembered', () => {
  const r = createRemoved([{ kind: 'session', session: 's1', label: 'x', t: 1 }, { kind: 'bogus' }, null])
  assert.deepEqual(r.list().map(i => i.key), ['s|s1'])
  r.add({ kind: 'agent', session: 's1', agent: 'a', label: 'y' })
  assert.deepEqual(r.list().map(i => i.key), ['a|s1|a', 's|s1'], 'newest first')
  assert.equal(r.restore('s|s1'), true)
  assert.equal(r.hides({ kind: 'turn.start', session: 's1' }), false)
  assert.deepEqual(createRemoved(r.toJSON()).list().map(i => i.key), ['a|s1|a'])
  for (let i = 0; i < KEEP + 5; i++) r.add({ kind: 'session', session: `x${i}` })
  assert.equal(r.list().length, KEEP)
  assert.equal(keyOf({ kind: 'project', project: '/w' }), 'p|/w')
})
