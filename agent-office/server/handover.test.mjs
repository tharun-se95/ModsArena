// node --test agent-office/server/*.test.mjs
// What a bridge stepping down hands to the one taking over (POST /shutdown):
// the newcomer keeps only what it can trust to be well formed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as chat from './chat.mjs'
import { createJobs } from './jobs.mjs'

test('undelivered messages carry over, delivered ones and junk do not', () => {
  chat.reset()
  const { message: queued } = chat.send({ session: 's1', text: 'hello' })
  const { message: taken } = chat.send({ session: 's2', agent: 'a1', text: 'for the agent' })
  chat.take('s2')
  const { message: done } = chat.send({ session: 's3', text: 'old news' })
  chat.take('s3')
  chat.settle(done.id, true)
  const handed = chat.handOver()
  assert.deepEqual(handed.map(m => m.id).sort(), [queued.id, taken.id].sort())

  chat.reset()
  chat.adopt([...handed, { id: 'x', session: '../etc', text: 'bad session' }, { id: 'y', session: 's4', text: 5 }, { id: 'z', session: 's5', text: 'hi', action: 'rm -rf' }, null])
  assert.deepEqual(chat.take('s1').map(m => m.text), ['hello'])
  assert.deepEqual(chat.take('s4'), [])
  assert.deepEqual(chat.take('s5'), [])
  // Already picked up by the mod: not handed out again, but still settles.
  assert.deepEqual(chat.take('s2'), [])
  assert.equal(chat.settle(taken.id, true)?.status, 'delivered')
  chat.reset()
})

test('jobs carry over, so a job started before the swap can still be stopped', async () => {
  const before = createJobs({ publish: () => {}, isKnown: async () => true })
  before.jobs.set('j1', { id: 'j1', short: 'abc123', dir: '/w', title: 'Fix it', kind: 'fix', state: 'done', t: 1 })
  const after = createJobs({ publish: () => {}, isKnown: async () => true })
  after.adopt([...before.handOver(), { id: 'j2', short: '--evil', state: 'done' }, { id: 7 }, 'nope'])
  assert.ok(after.jobs.has('j1'))
  assert.ok(!after.jobs.has('j2'), 'a short id that could read as an option is refused')
  assert.equal(after.jobs.size, 1)
  after.adopt('not a list')
  assert.equal(after.jobs.size, 1)
})
