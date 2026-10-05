import { test, expect, mock } from 'claude-code/testing'
import { summarize, contextTokens, projectOf, nodeProblem } from './register'

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
  on('command.register', async () => ({ value: { command: 'office' } }))
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
  on('command.register', async () => ({ value: { command: 'office' } }))
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

test('nodeProblem explains a missing or old Node, and passes a current one', async () => {
  expect(nodeProblem(undefined)).toContain('Node 18 or newer')
  expect(nodeProblem('v16.20.0\n')).toContain('v16.20.0')
  expect(nodeProblem('v22.3.0\n')).toBe(undefined)
})

test('/office starts the bridge, waits for it, then opens the page', async ($, on) => {
  let isUp = false
  const ran: string[][] = []
  on('http.fetch', async (_$, e) => {
    if (e.url.endsWith('/healthz')) {
      return { value: { status: isUp ? 200 : 503, ok: isUp, headers: {}, text: '{"ok":true,"events":3,"viewers":1}' } }
    }
    return { value: { status: 200, ok: true, headers: {}, text: '{"ok":true}' } }
  })
  on('process.run', async (_$, e) => {
    ran.push([...e.argv])
    return { value: { exitCode: 0, stdout: e.argv[0] === 'node' ? 'v22.3.0\n' : '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  on('process.spawn', async function* () {
    isUp = true // the bridge comes up once started
    return { code: 0, signal: null }
  })
  on('clock.sleep', async () => ({ value: undefined }))

  const opened = await $.command.run({ command: 'office', args: '' })
  expect(opened.text).toContain('Opened Agent Office at http://127.0.0.1:7337')
  expect(ran.some(argv => argv[0] === 'node')).toBe(true)
  expect(ran.some(argv => argv.includes('http://127.0.0.1:7337'))).toBe(true)

  const report = await $.command.run({ command: 'office', args: 'status' })
  expect(report.text).toContain('Bridge: running on http://127.0.0.1:7337, 3 events so far, 1 page open.')
})

test('/office says plainly when Node is missing', async ($, on) => {
  on('http.fetch', async () => ({ value: { status: 503, ok: false, headers: {}, text: '' } }))
  on('process.run', async () => { throw new Error('spawn node ENOENT') })
  const answer = await $.command.run({ command: 'office', args: '' })
  expect(answer.text).toContain('needs Node 18 or newer')
})

test('messages from the office reach the session and its subagents', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const posted: Array<Record<string, unknown>> = []
  const prompts: string[] = []
  const sent: Array<{ to: unknown; text: string }> = []
  let inbox = [
    { id: 'm1', text: 'Also check the retries.' },
    { id: 'm2', agent: 'agent-1', text: 'Stop after this file.' },
    { id: 'm3', agent: 'agent-9', text: 'Are you gone?' },
  ]
  on('http.fetch', async (_$, e) => {
    if (e.url.endsWith('/event')) posted.push(...JSON.parse(e.init?.body ?? '[]'))
    if (e.url.includes('/inbox?session=sess-chat')) {
      const body = JSON.stringify({ messages: inbox })
      inbox = []
      return { value: { status: 200, ok: true, headers: {}, text: body } }
    }
    return { value: { status: 200, ok: true, headers: {}, text: '{"ok":true}' } }
  })
  on('session.start', async (_$, e) => ({ cwd: e.cwd }))
  on('session.id', async () => ({ value: 'sess-chat' }))
  on('session.model', async () => ({ value: 'test-model' }))
  on('command.register', async () => ({ value: { command: 'office' } }))
  on('prompt.submit', async (_$, e) => { prompts.push(e.text); return { text: e.text } })
  on('session.send', async (_$, e) => { sent.push({ to: e.to, text: e.text }); return e.text.includes('gone') ? { isDelivered: false, reason: 'no agent by that id' } : { isDelivered: true } })

  await $.session.start({ cwd: '/w', surface: null, isInteractive: false })
  await clock.advance(1300)
  await clock.advance(300)

  expect(prompts).toEqual(['Also check the retries.'])
  expect(sent.map(s => s.text)).toEqual(['Stop after this file.', 'Are you gone?'])
  const delivered = posted.filter(ev => ev.kind === 'chat.delivered')
  expect(delivered.map(ev => [ev.id, ev.ok])).toEqual([['m1', true], ['m2', true], ['m3', false]])
  expect(delivered[2].how).toBe('no agent by that id')
})
