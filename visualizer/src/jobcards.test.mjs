// node --test visualizer/src/jobcards.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { KINDS, titleOf, matchJob } from './jobcards.js'

test('six job cards, each template a complete ask with at most one blank', () => {
  assert.deepEqual(KINDS.map(k => k.id), ['write', 'research', 'fix', 'review', 'plan', 'other'])
  for (const k of KINDS) {
    for (const [name, text] of k.templates) {
      assert.ok(name && text.endsWith('.'), `${k.id}: ${name}`)
      assert.ok((text.match(/\[/g) ?? []).length <= 1, `${k.id}: ${name} has one blank at most`)
    }
  }
})

test('a job is named by its first sentence, kept short', () => {
  assert.equal(titleOf('Fix this bug: the login page freezes. Find the cause first.'), 'Fix this bug: the login page freezes')
  assert.equal(titleOf('  Write   a README  '), 'Write a README')
  assert.equal(titleOf('x'.repeat(80)).length, 58)
})

test('a session is matched to its job by id, or by project while the id is on its way', () => {
  const jobs = [
    { id: 'a', short: '1a2b3c4d', dir: '/w/app', state: 'working' },
    { id: 'b', dir: '/w/site', state: 'starting' },
  ]
  assert.equal(matchJob(jobs, { session: '1a2b3c4d-9999', project: '/w/app' })?.id, 'a')
  assert.equal(matchJob(jobs, { session: 'ffff', project: '/w/site' })?.id, 'b')
  assert.equal(matchJob(jobs, { session: 'ffff', project: '/w/app' }), null)
  assert.equal(matchJob(jobs, {}), null)
})

test('a prompt the front desk announced is not counted again when the session sends it', async () => {
  const model = await import('./model.js')
  const S = 'job-sess'
  model.apply({ t: 1, session: S, kind: 'session.start', cwd: '/w/app', via: 'front-desk' })
  model.apply({ t: 2, session: S, kind: 'turn.start', turnId: 'front-desk', text: 'Write a README', via: 'front-desk' })
  model.apply({ t: 3, session: S, kind: 'turn.start', turnId: 'real', text: 'Write a README' })
  const n = model.nodes.get(model.sid(S))
  assert.deepEqual(n.prompts.map(p => p.text), ['Write a README'])
  assert.equal(n.turns, 1)
  model.apply({ t: 9, session: S, kind: 'turn.start', turnId: 'next', text: 'Write a README' })
  assert.equal(n.prompts.length, 2)
  model.removeNode(model.sid(S))
})
