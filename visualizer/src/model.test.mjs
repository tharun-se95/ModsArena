// node --test visualizer/src/*.test.mjs
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import * as model from './model.js'

const S = 'sess-1'
const t0 = 1_000_000

beforeEach(() => {
  for (const id of [...model.nodes.keys()]) model.removeNode(id)
})

test('an office message is listed as what was sent, and a task report is not a prompt', () => {
  model.apply({ t: t0, session: S, kind: 'turn.start', text: 'Read notes.txt' })
  model.apply({ t: t0 + 1, session: S, kind: 'turn.start', text: 'The agent-office plugin sent a message: Reply with OK This is how Claude Code surfaces a pro...' })
  model.apply({ t: t0 + 2, session: S, kind: 'turn.start', text: '<task-notification> <task-id>a1</task-id> <tool-use-id>tu1</tool-use-id>' })
  const session = model.nodes.get(model.sid(S))
  assert.deepEqual(session.prompts.map(p => [p.text, p.from]), [['Read notes.txt', undefined], ['Reply with OK', 'agent-office']])
  assert.equal(session.label, 'Read notes.txt')
  assert.equal(session.turns, 3)
})

test('a session met first in /history does not list its prompt twice', () => {
  const prompt = 'Use the Agent tool to start one general-purpose subagent in the background that reads notes.txt and reports its contents.'
  model.applyHistory([{ session: S, prompts: [{ t: t0, text: prompt }], compactions: [], agents: [], turns: 1, toolCalls: 0, errors: 0 }], true)
  model.apply({ t: t0 + 400, session: S, kind: 'turn.start', text: `${prompt.slice(0, 87)}...` })
  assert.equal(model.nodes.get(model.sid(S)).prompts.length, 1)
  // Asking the same thing again is a new prompt.
  model.apply({ t: t0 + 5000, session: S, kind: 'turn.start', text: 'yes' })
  model.apply({ t: t0 + 9000, session: S, kind: 'turn.start', text: 'yes' })
  assert.equal(model.nodes.get(model.sid(S)).prompts.length, 3)
})

test('an agent never spawned leaves once it is quiet; a spawned one stays', () => {
  model.apply({ t: t0, session: S, kind: 'agent.spawn', agent: 'a1', type: 'general-purpose' })
  model.apply({ t: t0, session: S, kind: 'tool.start', agent: 'a1', id: 'tu1', tool: 'Read' })
  model.apply({ t: t0, session: S, kind: 'tool.start', agent: 'x9', id: 'tu2', tool: 'Read' })
  model.apply({ t: t0 + 10, session: S, kind: 'tool.end', agent: 'x9', id: 'tu2', tool: 'Read', ok: false })
  model.apply({ t: t0 + 10, session: S, kind: 'tool.end', agent: 'a1', id: 'tu1', tool: 'Read', ok: true })
  const phantom = model.aid(S, 'x9')
  model.sweep(t0 + 10_000)
  assert.ok(model.nodes.has(phantom), 'still there while recent')
  model.sweep(t0 + 60_000)
  assert.ok(!model.nodes.has(phantom), 'gone once quiet')
  assert.ok(model.nodes.has(model.aid(S, 'a1')))
})
