// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { empty, record, totals, check, progress, decorOf, load, save, MILESTONES } from './milestones.js'

test('counts are per thread and only go up, so a replay never counts twice', () => {
  const s = empty()
  assert.equal(record(s, 'p', 't1', { turns: 3, tools: 40 }), true)
  assert.equal(record(s, 'p', 't1', { turns: 3, tools: 40 }), false)
  // A reconnect starts the model over: smaller numbers change nothing.
  assert.equal(record(s, 'p', 't1', { turns: 1, tools: 5 }), false)
  record(s, 'p', 't2', { turns: 2, tools: 70, team: 3 })
  record(s, 'p', 't3', { team: 2 })
  assert.deepEqual(totals(s, 'p'), { threads: 3, turns: 5, tools: 110, outputs: 0, pictures: 0, prs: 0, team: 3 })
})

test('milestones unlock once, in order, and each adds to the room', () => {
  const s = empty()
  record(s, 'p', 't1', { outputs: 1, prs: 1, tools: 120 })
  const first = check(s, 'p', 1000)
  assert.deepEqual(first.map(m => m.id), ['first-output', 'first-pr', 'tools-100'])
  assert.deepEqual(check(s, 'p', 2000), [])
  assert.deepEqual(decorOf(s, 'p'), { trophies: 3, poster: false, neon: true, plant: 0 })
  record(s, 'p', 't1', { turns: 12, pictures: 1 })
  check(s, 'p', 3000)
  assert.deepEqual(decorOf(s, 'p'), { trophies: 5, poster: true, neon: true, plant: 1 })
  const list = progress(s, 'p')
  assert.equal(list.length, MILESTONES.length)
  assert.equal(list.find(m => m.id === 'first-pr').at, 1000)
  assert.equal(list.find(m => m.id === 'tools-1000').have, 120)
  // Projects keep their own.
  assert.deepEqual(decorOf(s, 'other'), { trophies: 0, poster: false, neon: false, plant: 0 })
})

test('a long past folds into one tally without losing the totals', () => {
  const s = empty()
  for (let i = 0; i < 320; i++) record(s, 'p', `t${i}`, { tools: 1, team: i === 3 ? 4 : 1 })
  assert.equal(Object.keys(s.projects.p.threads).length, 300)
  const t = totals(s, 'p')
  assert.equal(t.tools, 320)
  assert.equal(t.threads, 320)
  assert.equal(t.team, 4)
})

test('storage that is missing, broken or full never throws', () => {
  const broken = { getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('full') } }
  assert.deepEqual(load(broken), empty())
  save(empty(), broken)
  assert.deepEqual(load({ getItem: () => '{not json' }), empty())
  const mem = new Map()
  const store = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) }
  const s = empty()
  record(s, 'p', 't', { prs: 1 })
  check(s, 'p', 5)
  save(s, store)
  assert.deepEqual(load(store), s)
  assert.deepEqual(load(undefined), empty())
})
