// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { todayRecap, headline, shippedWords, helperWords, effortWords, recapText, windingDown, startOfDay, QUIET_MS } from './today.js'

const now = new Date(2026, 9, 8, 16, 0).getTime()
const day = startOfDay(now)
const yesterday = day - 3600000

const nodes = [
  { kind: 'session', id: 's:a', session: 'a', projectName: 'acme/api', label: 'Fix…', prompts: [{ t: day + 1000, text: 'Fix the build' }, { t: day + 2000, text: 'Open a PR' }], turns: 3, toolCalls: 40, errors: 2, todos: [{ text: 'x', status: 'completed' }] },
  { kind: 'session', id: 's:b', session: 'b', projectName: 'acme/web', prompts: [{ t: day + 5000, text: 'Dark mode' }], turns: 1, toolCalls: 10, errors: 0, askAt: day },
  { kind: 'session', id: 's:c', session: 'c', past: true, status: 'past', endedAt: day + 100, prompts: [{ t: yesterday, text: 'Upgrade React' }], turns: 2, toolCalls: 5, errors: 0 },
  { kind: 'session', id: 's:d', session: 'd', past: true, status: 'past', endedAt: yesterday, prompts: [{ t: yesterday, text: 'Old work' }], turns: 9, toolCalls: 99, errors: 9 },
  { kind: 'agent', id: 'a:a:1', session: 'a' },
]
const outputs = [
  { t: day + 9000, session: 'a', type: 'pr', title: 'Fix the stale cache key', url: 'https://github.com/acme/api/pull/3' },
  { t: day + 8000, session: 'b', type: 'image', title: 'Dark chart' },
  { t: day + 7000, session: 'a', type: 'file', path: 'ci/cache.yml', meta: { additions: 4, deletions: 1 } },
  { t: day + 6000, session: 'a', type: 'file', path: 'ci/cache.yml', meta: { additions: 4, deletions: 1 } },
  { t: day + 5000, session: 'b', type: 'artifact', title: 'Flaky build report', url: 'https://claude.ai/artifact/x' },
  { t: yesterday, session: 'd', type: 'pr', title: 'Old PR' },
]
const helpers = [{ t: day + 1, type: 'Explore' }, { t: day + 2, type: 'Explore' }, { t: day + 3, type: 'Plan' }, { t: yesterday, type: 'Old' }]
const stateOf = n => (n.askAt ? 'asking' : 'waiting')

test('the recap counts only what happened since local midnight', () => {
  // The model hands over its nodes as an iterator.
  const r = todayRecap({ nodes: nodes.values(), outputs, helpers, now, stateOf })
  assert.equal(r.day, day)
  assert.deepEqual(r.shipped.map(o => o.title), ['Fix the stale cache key', 'Dark chart', 'Flaky build report'])
  assert.equal(r.shipped[0].thread, 'Fix the build')
  assert.deepEqual([r.prs, r.docs, r.pictures, r.files, r.added, r.removed], [1, 1, 1, 1, 4, 1])
  assert.deepEqual(r.finished.map(f => f.title), ['Fix the build', 'Upgrade React'])
  assert.deepEqual(r.waiting.map(w => [w.title, w.state]), [['Fix the build', 'waiting'], ['Dark mode', 'asking']])
  assert.deepEqual(r.helpers, [{ type: 'Explore', count: 2 }, { type: 'Plan', count: 1 }])
  assert.deepEqual([r.threads, r.asked, r.turns, r.toolCalls, r.errors], [3, 3, 6, 55, 2])
})

test('it says the day in plain words', () => {
  const r = todayRecap({ nodes, outputs, helpers, now, stateOf })
  assert.equal(headline(r), '3 things shipped and 2 threads wrapped up.')
  assert.equal(shippedWords(r), '1 pull request, 1 doc and 1 picture; 1 file changed (+4 −1 lines)')
  assert.equal(helperWords(r), '3 helpers: Explore ×2, Plan.')
  assert.equal(effortWords(r), 'You asked for 3 things across 3 threads, in 6 back-and-forths. Claude took 55 steps to do it: reading, editing, searching and running things; 2 hit a snag along the way.')
  const text = recapText(r)
  assert.match(text, /^Today in the office: /)
  assert.match(text, /- Fix the stale cache key \(https:\/\/github.com\/acme\/api\/pull\/3\)/)
  assert.match(text, /- Dark mode needs your answer/)
  assert.doesNotMatch(text, /Old PR/)
})

test('an empty day is quiet, not broken', () => {
  const r = todayRecap({ nodes: [], outputs: [], now })
  assert.equal(headline(r), 'A quiet day so far.')
  assert.equal(shippedWords(r), 'Nothing yet.')
  assert.equal(effortWords(r), 'No threads ran today.')
  assert.match(recapText(r), /all caught up/)
})

test('it offers itself once the work winds down, once a day', () => {
  const r = todayRecap({ nodes, outputs, helpers, now, stateOf })
  assert.equal(windingDown(r, { now, lastBusyAt: now - 60000 }), false)
  assert.equal(windingDown(r, { now, lastBusyAt: now - QUIET_MS }), true)
  assert.equal(windingDown(r, { now, lastBusyAt: now - QUIET_MS, offeredDay: day }), false)
  const evening = new Date(2026, 9, 8, 18, 30).getTime()
  assert.equal(windingDown(r, { now: evening, lastBusyAt: evening - 3 * 60000 }), true)
  const empty = todayRecap({ nodes: [], outputs: [], now })
  assert.equal(windingDown(empty, { now, lastBusyAt: 0 }), false)
})

test('the model remembers every helper spawned, once each, even after it leaves', async () => {
  const model = await import('./model.js')
  model.reset()
  model.apply({ t: 1, session: 's', kind: 'agent.spawn', agent: 'x', type: 'Explore' })
  model.apply({ t: 2, session: 's', kind: 'agent.spawn', agent: 'x', type: 'Explore' })
  model.apply({ t: 3, session: 's', kind: 'agent.spawn', agent: 'y', type: 'Plan', name: 'planner' })
  model.apply({ t: 4, session: 's', kind: 'agent.end', agent: 'x', status: 'completed' })
  assert.deepEqual(model.helpers.map(h => h.type), ['Explore', 'planner'])
  model.reset()
  assert.equal(model.helpers.length, 0)
})
