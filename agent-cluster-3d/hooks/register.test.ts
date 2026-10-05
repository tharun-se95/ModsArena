import { test, expect, mock } from 'claude-code/testing'
import { summarize } from './register'

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
