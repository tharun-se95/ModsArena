// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openOf, copyOf, byThread, card, isDeliverable, hostOf } from './deliverables.js'

const pr = { id: 'pr-1', t: 1000, session: 's1', type: 'pr', title: 'Retry <sends>', url: 'https://github.com/acme/api/pull/7', meta: { state: 'open', additions: 12, deletions: 3 } }
const plan = { id: 'plan-1', t: 900, session: 's2', type: 'plan', title: 'Rotate tokens', text: '# Rotate tokens\n1. Issue' }
const file = { id: 'file-a', t: 800, session: 's1', type: 'file', title: 'a.ts', path: 'src/a.ts' }
const pic = { id: 'img-1', t: 700, session: 's1', type: 'image', title: 'Chart', path: '/tmp/chart.png' }

test('Open follows a link, or shows a plan or picture full size', () => {
  assert.deepEqual(openOf(pr), { href: pr.url })
  assert.deepEqual(openOf(plan), { zoom: 's2|plan-1' })
  assert.deepEqual(openOf(pic), { zoom: 's1|img-1' })
  assert.equal(openOf(file), null)
})

test('Copy copies the link, else the path, else the text', () => {
  assert.deepEqual(copyOf(pr), { text: pr.url, label: 'Copy link' })
  assert.deepEqual(copyOf(file), { text: 'src/a.ts', label: 'Copy path' })
  assert.deepEqual(copyOf(plan), { text: plan.text, label: 'Copy text' })
  assert.equal(copyOf({ type: 'link' }), null)
})

test('outputs group by thread in the order they arrive, newest thread first', () => {
  const groups = byThread([pr, plan, file, pic])
  assert.deepEqual(groups.map(g => g.session), ['s1', 's2'])
  assert.deepEqual(groups[0].items.map(o => o.id), ['pr-1', 'file-a', 'img-1'])
  assert.ok(isDeliverable(pr) && isDeliverable(plan) && !isDeliverable(file) && !isDeliverable(pic))
})

test('a card has Open and Copy, escapes its title, and lands fresh', () => {
  const html = card(pr, { where: 'Explore', now: 2000 })
  assert.match(html, /Retry &lt;sends&gt;/)
  assert.match(html, /href="https:\/\/github.com\/acme\/api\/pull\/7"/)
  assert.match(html, /data-copy="s1\|pr-1"/)
  assert.match(html, /Copy link/)
  assert.match(html, /class="dv pr fresh"/)
  assert.match(html, /github.com · Explore/)
  assert.match(card(pr, { now: 99999 }), /class="dv pr "/)
  assert.match(card(pr, { now: 2000, copied: 's1|pr-1' }), /Copied ✓/)
  assert.equal(hostOf('not a url'), '')
})
