// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply, nodes, reset, mail, sid, aid, threadState, agentState, teamOf, lineage } from './model.js'

const at = t => ({ t, session: 's1' })

test('a thread is working during a turn, then waiting on you, or stuck after an error', () => {
  reset()
  apply({ ...at(1), kind: 'session.start', project: { id: '/w', name: 'w' } })
  apply({ ...at(2), kind: 'turn.start', text: 'Fix the build' })
  const n = nodes.get(sid('s1'))
  assert.equal(threadState(n), 'working')
  apply({ ...at(3), kind: 'turn.complete', reason: 'answer', answer: 'Fixed. Open a PR?' })
  n.lastAt = 0
  assert.equal(threadState(n), 'waiting')
  assert.equal(n.answer.text, 'Fixed. Open a PR?')
  apply({ ...at(4), kind: 'turn.start', text: 'Yes' })
  apply({ ...at(5), kind: 'turn.complete', reason: 'error' })
  assert.equal(threadState(n), 'stuck')
  apply({ ...at(6), kind: 'session.end' })
  assert.equal(threadState(n), 'ended')
})

test('agents nest under the agent that spawned them, and a resumed one works again', () => {
  reset()
  apply({ ...at(1), kind: 'session.start' })
  apply({ ...at(2), kind: 'agent.spawn', agent: 'a', type: 'Explore' })
  apply({ ...at(3), kind: 'agent.spawn', agent: 'b', parent: 'a', type: 'Plan' })
  const tree = teamOf(nodes.get(sid('s1')))
  assert.equal(tree.length, 1)
  assert.equal(tree[0].node.agent, 'a')
  assert.equal(tree[0].children[0].node.agent, 'b')
  assert.deepEqual(lineage(nodes.get(aid('s1', 'b'))).map(x => x.id), [sid('s1'), aid('s1', 'a'), aid('s1', 'b')])
  apply({ ...at(4), kind: 'agent.waiting', agent: 'a' })
  assert.equal(agentState(nodes.get(aid('s1', 'a'))), 'waiting')
  apply({ ...at(5), kind: 'agent.end', agent: 'b', status: 'failed' })
  assert.equal(agentState(nodes.get(aid('s1', 'b'))), 'failed')
  apply({ ...at(6), kind: 'tool.start', agent: 'a', id: 't1', tool: 'Read' })
  assert.equal(agentState(nodes.get(aid('s1', 'a'))), 'working')
})

test('a project relay marks a thread, and messages keep who sent them', () => {
  reset()
  apply({ ...at(1), kind: 'session.start' })
  apply({ ...at(2), kind: 'session.thread' })
  apply({ ...at(3), kind: 'agent.message', via: 'projects-relay', text: 'Look into the flaky build' })
  apply({ ...at(4), kind: 'agent.spawn', agent: 'a', type: 'Explore', name: 'scout' })
  apply({ ...at(5), kind: 'agent.message', via: 'model', toName: 'scout', text: 'Check CI too' })
  assert.equal(nodes.get(sid('s1')).thread, true)
  assert.deepEqual(mail.map(m => [m.fromName, m.toName]), [['Lead', 'scout'], ['Project coordinator', 'Lead']])
  assert.equal(mail[0].to, aid('s1', 'a'))
})
