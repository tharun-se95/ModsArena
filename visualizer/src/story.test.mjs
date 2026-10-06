// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply, nodes, reset, mail, sid, threadState, teamOf } from './model.js'
import { startStory } from '../../agent-office/server/story.mjs'

test('the scripted story plays a whole team through to waiting on you, and a reply carries it on', async () => {
  reset()
  const seen = []
  const story = startStory(events => events.forEach(ev => { seen.push(ev); apply(ev) }), { speed: 0.004 })
  const lead = () => nodes.get(sid('story-tracking'))
  const waitFor = async ok => { for (let i = 0; i < 400 && !ok(); i++) await new Promise(r => setTimeout(r, 10)) ; assert.ok(ok()) }

  await waitFor(() => lead()?.answer?.text.includes('PR #214'))
  const n = lead()
  n.lastAt = 0
  assert.equal(n.thread, true)
  assert.equal(threadState(n), 'waiting')
  assert.equal(n.prompts[0].text.startsWith('Build live order tracking'), true)
  // Agents nest: eta-engine spawned its own test-writer.
  const spawns = seen.filter(e => e.kind === 'agent.spawn' && e.session === 'story-tracking')
  const eta = spawns.find(e => e.name === 'eta-engine')
  assert.equal(spawns.find(e => e.name === 'test-writer').parent, eta.agent)
  assert.ok(spawns.length >= 8)
  // Every agent ended, so the live team is empty again.
  assert.equal(teamOf(n).filter(x => x.node.status !== 'done').length, 0)
  // The team talks: within it, and across to the web team.
  assert.ok(mail.some(m => m.fromName === 'test-writer' && m.toName === 'eta-engine'))
  assert.ok(mail.some(m => m.session === 'story-web' && m.fromName === 'dispatch-api lead'))
  // Failing tests get fixed, not left red.
  assert.ok(seen.some(e => e.kind === 'tool.end' && e.ok === false))

  assert.equal(story.reply('story-tracking', 'Yes, but only 1%'), true)
  await waitFor(() => lead().prompts.at(-1).text === 'Yes, but only 1%' && lead().answer.text.includes('tracking_v2'))
  assert.equal(story.reply('nobody', 'hi'), false)
})
