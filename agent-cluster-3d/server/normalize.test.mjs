// node --test agent-cluster-3d/server/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalize, GAUGES, gaugeKey } from './normalize.mjs'

test('mod events pass through, stamped when unstamped', () => {
  const [ev] = normalize({ kind: 'tool.start', session: 's1', id: 't1', tool: 'Bash' }, 42)
  assert.deepEqual(ev, { t: 42, kind: 'tool.start', session: 's1', id: 't1', tool: 'Bash' })
  assert.equal(normalize({ kind: 'tool.start', session: 's1', t: 7 }, 42)[0].t, 7)
})

test('unknown shapes are dropped', () => {
  assert.deepEqual(normalize([{ kind: 'nope', session: 's' }, { session: 's' }, null, 3]), [])
})

test('classic tool hooks map to tool events, inside subagents too', () => {
  const pre = { hook_event_name: 'PreToolUse', session_id: 's', agent_id: 'a', tool_name: 'Bash', tool_use_id: 'u', tool_input: { command: 'ls  -la' } }
  assert.deepEqual(normalize(pre, 1), [{ t: 1, session: 's', agent: 'a', kind: 'tool.start', id: 'u', tool: 'Bash', summary: 'ls -la' }])
  const fail = { hook_event_name: 'PostToolUseFailure', session_id: 's', tool_name: 'Bash', tool_use_id: 'u' }
  assert.equal(normalize(fail, 1)[0].ok, false)
  const post = { hook_event_name: 'PostToolUse', session_id: 's', tool_name: 'Bash', tool_use_id: 'u', tool_response: {} }
  assert.equal(normalize(post, 1)[0].ok, true)
})

test('Agent tool calls are left to SubagentStart/Stop', () => {
  assert.deepEqual(normalize({ hook_event_name: 'PreToolUse', session_id: 's', tool_name: 'Agent', tool_use_id: 'u' }), [])
  const [spawn] = normalize({ hook_event_name: 'SubagentStart', session_id: 's', agent_id: 'a1', agent_type: 'Explore' }, 1)
  assert.equal(spawn.kind, 'agent.spawn')
  assert.equal(spawn.agent, 'a1')
  assert.equal(spawn.type, 'Explore')
})

test('context events pass through and gauges key per loop', () => {
  const [m] = normalize({ kind: 'context.measure', session: 's', context: { tokens: 1, window: 2 } }, 1)
  assert.ok(GAUGES.has(m.kind))
  assert.equal(gaugeKey({ kind: 'agent.context', session: 's', agent: 'a' }), 'agent.context|s|a')
  assert.equal(normalize({ kind: 'context.compact', session: 's', trigger: 'auto' }).length, 1)
  assert.equal(normalize({ hook_event_name: 'PreCompact', session_id: 's', trigger: 'manual' })[0].trigger, 'manual')
})
