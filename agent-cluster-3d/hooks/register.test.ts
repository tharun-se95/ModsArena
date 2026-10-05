import { test, expect, mock } from 'claude-code/testing'
import { summarize, contextTokens, projectOf } from './register'

test('summarize picks the most telling field and trims it', async () => {
  expect(summarize({ command: 'npm   test\n --watch' })).toBe('npm test --watch')
  expect(summarize({ file_path: 'src/a.ts', pattern: 'x' })).toBe('src/a.ts')
  expect(summarize({ other: 1 })).toBe(undefined)
  expect(summarize({ prompt: 'x'.repeat(200) })?.length).toBe(90)
})

test('tool calls and spawns reach the bridge as cluster events', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const posted: Array<Record<string, unknown>> = []

  // The engine beneath the mod: a bridge that answers, and a quiet host.
  on('http.fetch', async (_$, e) => {
    if (e.url.endsWith('/event')) posted.push(...JSON.parse(e.init?.body ?? '[]'))
    return { value: { status: 200, ok: true, headers: {}, text: '{"ok":true}' } }
  })
  on('session.start', async (_$, e) => ({ cwd: e.cwd }))
  on('session.id', async () => ({ value: 'sess-test' }))
  on('session.model', async () => ({ value: 'test-model' }))
  on('command.register', async () => ({ value: { command: 'cluster3d' } }))
  on('ui.status', async () => ({ value: undefined }))
  on('tool.call', { tool: 'Read' }, async () => ({ result: { type: 'text', file: { filePath: 'a.ts', content: '', numLines: 0, startLine: 1, totalLines: 0 } } }))
  on('agent.spawn', async () => ({ model: 'haiku', agentId: 'agent-1' }))

  await $.session.start({ cwd: '/w', surface: null, isInteractive: false })
  await $.tool.call({ tool: 'Read', file_path: '/w/a.ts' })
  await $.agent.spawn({
    tool_use_id: 'tu-1', prompt: 'look', description: 'Map auth', subagentType: 'Explore',
    provider: { plugin: 'engine', tier: 'core' }, parentModel: 'm', background: false, fork: false,
  })
  await clock.advance(300)

  expect(posted.map(ev => ev.kind)).toContain('session.start')
  const start = posted.find(ev => ev.kind === 'tool.start')
  const end = posted.find(ev => ev.kind === 'tool.end')
  expect(start?.tool).toBe('Read')
  expect(start?.summary).toBe('/w/a.ts')
  expect(end?.ok).toBe(true)
  expect(end?.id).toBe(start?.id)
  const spawn = posted.find(ev => ev.kind === 'agent.spawn')
  expect(spawn?.agent).toBe('agent-1')
  expect(spawn?.type).toBe('Explore')
  expect(posted.every(ev => ev.session === 'sess-test')).toBe(true)
})

test('contextTokens and projectOf read what the engine reports', async () => {
  expect(contextTokens({ input_tokens: 5, cache_read_input_tokens: 90000, cache_creation_input_tokens: 2000 })).toBe(92005)
  expect(projectOf('/w/app/src', { root: '/w/app', name: 'acme/app', remote: 'git@x:acme/app.git' }))
    .toEqual({ id: '/w/app', name: 'acme/app', remote: 'git@x:acme/app.git' })
  expect(projectOf('/tmp/scratch', null)).toEqual({ id: '/tmp/scratch', name: 'scratch', remote: null })
})

test('context readings, requests and compactions reach the bridge', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const posted: Array<Record<string, unknown>> = []
  on('http.fetch', async (_$, e) => {
    if (e.url.endsWith('/event')) posted.push(...JSON.parse(e.init?.body ?? '[]'))
    return { value: { status: 200, ok: true, headers: {}, text: '{}' } }
  })
  on('session.start', async (_$, e) => ({ cwd: e.cwd }))
  on('session.id', async () => ({ value: 'sess-ctx' }))
  on('session.model', async () => ({ value: 'test-model' }))
  on('session.repo', async () => ({ value: { root: '/w', remote: null, internal: false, name: null } }))
  on('session.usage', async () => ({ value: { startedAt: 0, rateLimits: [], context: { tokens: 50000, window: 200000, breakdown: undefined } } }))
  on('command.register', async () => ({ value: { command: 'cluster3d' } }))
  on('ui.status', async () => ({ value: undefined }))
  on('session.measure', async (_$, e) => ({ changed: e.changed }))
  on('session.compact', async () => ({ messages: [{ role: 'user', text: 'summary', toolUses: [] }], tokensBefore: 180000, tokensAfter: 30000 }))
  on('turn.step', async function* (_$, e) {
    return { turnId: e.turnId, index: e.index, answer: '', toolUses: [], stopReason: 'end_turn', usage: { input_tokens: 10, cache_read_input_tokens: 70000, cache_creation_input_tokens: 0, output_tokens: 5, model: 'm' } }
  })

  await $.session.start({ cwd: '/w', surface: null, isInteractive: false })
  await $.session.measure({ context: { tokens: 120000, window: 200000, percent: 60 }, rateLimits: [{ kind: 'five_hour', percentUsed: 12 }], cost: { usd: 1.5 }, changed: ['context'] })
  for await (const _ of $.turn.step({ turnId: 't1', index: 0, model: 'm', messageCount: 3, agentId: 'agent-7' })) { /* drain */ }
  await $.session.compact({ trigger: 'auto', messages: [{ role: 'user', text: 'hello', toolUses: [] }] })
  await clock.advance(300)

  const measure = posted.find(ev => ev.kind === 'context.measure')
  expect(measure?.context).toEqual({ tokens: 120000, window: 200000, percent: 60 })
  expect(measure?.costUsd).toBe(1.5)
  const step = posted.find(ev => ev.kind === 'agent.context')
  expect(step?.agent).toBe('agent-7')
  expect(step?.tokens).toBe(70010)
  const compact = posted.find(ev => ev.kind === 'context.compact')
  expect(compact?.before).toBe(180000)
  expect(compact?.after).toBe(30000)
  expect(posted.find(ev => ev.kind === 'session.start')?.project).toEqual({ id: '/w', name: 'w', remote: null })
})
