// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { today, plain, exact, standing, headsUp, startOfDay } from './spend.js'

const now = new Date(2026, 9, 8, 15, 0).getTime()
const hour = 3600000

test('today counts sessions active since midnight, once each, by project', () => {
  const sessions = [
    { session: 'a', costUsd: 1.2, projectName: 'acme/api', lastAt: now - hour },
    { session: 'b', costUsd: 0.3, projectName: 'acme/api', startedAt: now - 30 * hour, answeredAt: now - 2 * hour },
    { session: 'c', costUsd: 5, projectName: 'acme/web', endedAt: now - 20 * hour }, // yesterday
    { session: 'a', costUsd: 9, project: { name: 'acme/api' }, endedAt: now - hour }, // its history row
    { session: 'd', costUsd: 2.5, project: { name: 'blog' }, endedAt: now - 3 * hour }, // a past session from /history
    { session: 'e', costUsd: 0, projectName: 'acme/api', lastAt: now },
  ]
  const { total, byProject, count } = today(sessions, now)
  assert.equal(Math.round(total * 100), 400)
  assert.equal(count, 3)
  assert.deepEqual([...byProject].map(([k, v]) => [k, Math.round(v * 100)]), [['acme/api', 150], ['blog', 250]])
  assert.equal(startOfDay(now), new Date(2026, 9, 8).getTime())
})

test('money in plain words, exact in the tooltip', () => {
  assert.equal(plain(0), 'Nothing yet')
  assert.equal(plain(0.003), 'Less than a cent')
  assert.equal(plain(0.4), 'About $0.40')
  assert.equal(plain(1.2049), 'About $1.20')
  assert.equal(plain(48.3), 'About $48')
  assert.equal(exact(1.20491), '$1.2049')
})

test('a daily limit gives a heads-up at 80% and once passed', () => {
  assert.equal(standing(5, 0), 'none')
  assert.equal(standing(7.9, 10), 'ok')
  assert.equal(standing(8, 10), 'near')
  assert.equal(standing(10.5, 10), 'over')
  assert.equal(headsUp(5, 10), '')
  assert.equal(headsUp(8.1, 10), 'Heads up: about $8.10 of your $10 for today so far.')
  assert.match(headsUp(11.2, 10), /passed today’s \$10 limit, at about \$11\. /)
  assert.match(headsUp(2.6, 2.5), /\$2\.50 limit/)
})
