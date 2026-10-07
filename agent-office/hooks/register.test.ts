import { test, expect, mock } from 'claude-code/testing'
import { summarize, contextTokens, projectOf, nodeProblem, isNewer, isStale, beforeTool, afterTool, diffStats } from './register'

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

test('a reading made before the session has started still carries its session', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const posted: Array<Record<string, unknown>> = []
  on('http.fetch', async (_$, e) => {
    if (e.url.endsWith('/event')) posted.push(...JSON.parse(e.init?.body ?? '[]'))
    return { value: { status: 200, ok: true, headers: {}, text: '{"ok":true}' } }
  })
  on('session.start', async (_$, e) => ({ cwd: e.cwd }))
  on('session.id', async () => ({ value: 'sess-early' }))
  on('session.model', async () => ({ value: 'test-model' }))
  on('command.register', async () => ({ value: { command: 'office' } }))
  on('ui.status', async () => ({ value: undefined }))
  on('session.measure', async (_$, e) => ({ changed: e.changed }))

  await $.session.measure({ context: { tokens: 1000, window: 200000, percent: 0 }, rateLimits: [], changed: ['context'] })
  await $.session.start({ cwd: '/w', surface: null, isInteractive: false })
  await clock.advance(300)

  expect(posted.map(ev => ev.kind)).toContain('context.measure')
  expect(posted.every(ev => ev.session === 'sess-early')).toBe(true)
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

test('isNewer and isStale spot a bridge left over from an older copy', async () => {
  expect(isNewer('0.4.0', '0.3.1')).toBe(true)
  expect(isNewer('0.3.10', '0.3.9')).toBe(true)
  expect(isNewer('0.3.1', '0.3.1')).toBe(false)
  expect(isNewer('0.3.0', '0.3.1')).toBe(false)
  expect(isStale({ managed: true, version: '0.3.1' }, '0.4.0')).toBe(true)
  expect(isStale({ managed: false, version: '0.3.1' }, '0.4.0')).toBe(false) // started by hand
  expect(isStale({ managed: true }, '0.4.0')).toBe(false) // too old to say
  expect(isStale({ managed: true, version: '0.4.0' }, '0.4.0')).toBe(false)
  expect(isStale(undefined, '0.4.0')).toBe(false)
})

test('/office replaces a bridge from an older copy before opening the page', async ($, on) => {
  let bridge = { version: '0.0.1', managed: true }
  const spawned: string[][] = []
  on('fs.read', async () => ({ value: '{"name":"agent-office","version":"9.9.9"}' }))
  on('http.fetch', async (_$, e) => {
    if (e.url.endsWith('/healthz')) return { value: { status: 200, ok: true, headers: {}, text: JSON.stringify({ ok: true, events: 0, viewers: 0, ...bridge }) } }
    return { value: { status: 200, ok: true, headers: {}, text: '{"ok":true}' } }
  })
  on('process.run', async (_$, e) => ({ value: { exitCode: 0, stdout: e.argv[0] === 'node' ? 'v22.3.0\n' : '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }))
  on('process.spawn', async function* (_$, e) {
    spawned.push([...e.argv])
    bridge = { version: '9.9.9', managed: true } // the new bridge takes over
    return { code: 0, signal: null }
  })
  on('clock.sleep', async () => ({ value: undefined }))

  const report = await $.command.run({ command: 'office', args: 'status' })
  expect(report.text).toContain('(0.0.1)')
  expect(report.text).toContain('older Agent Office than this one (9.9.9); /office restarts it')

  const opened = await $.command.run({ command: 'office', args: '' })
  expect(opened.text).toContain('Agent Office')
  expect(spawned.some(argv => argv.includes('--replace') && argv.includes('--managed'))).toBe(true)
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

test('threads, messages and a subagent’s real status reach the bridge', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const posted: Array<Record<string, unknown>> = []
  let status = 'waiting'
  on('http.fetch', async (_$, e) => {
    if (e.url.endsWith('/event')) posted.push(...JSON.parse(e.init?.body ?? '[]'))
    return { value: { status: 200, ok: true, headers: {}, text: '{"ok":true}' } }
  })
  on('session.start', async (_$, e) => ({ cwd: e.cwd }))
  on('session.id', async () => ({ value: 'sess-team' }))
  on('session.model', async () => ({ value: 'test-model' }))
  on('command.register', async () => ({ value: { command: 'office' } }))
  on('ui.status', async () => ({ value: undefined }))
  on('agent.spawn', async () => ({ model: 'haiku', agentId: 'agent-1' }))
  on('agent.list', async () => ({ value: [{ id: 'agent-1', description: 'Map auth', type: 'Explore', status }] }))
  on('session.receive', async (_$, e) => ({ text: e.text }))
  on('session.send', async () => ({ isDelivered: true }))
  on('turn.complete', async (_$, e) => ({ text: e.answer }))

  await $.session.start({ cwd: '/w', surface: null, isInteractive: false })
  await $.agent.spawn({
    tool_use_id: 'tu-1', prompt: 'look', description: 'Map auth', subagentType: 'Explore', name: 'scout',
    provider: { plugin: 'engine', tier: 'core' }, parentModel: 'm', background: true, fork: true,
  })
  await $.session.receive({ origin: { kind: 'projects-relay' }, text: 'Look into the flaky build' })
  await $.session.send({ to: 'agent-1', text: 'Check the CI logs too', origin: { kind: 'model' } })
  await $.turn.complete({ agentId: 'agent-1', answer: 'Still waiting on a shell', durationMs: 5, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(300)
  status = 'completed'
  await $.turn.complete({ agentId: 'agent-1', answer: 'Found it:   the cache key.', durationMs: 5, isAborted: false, turnId: 't2', reason: 'answer' })
  await clock.advance(300)

  const spawn = posted.find(ev => ev.kind === 'agent.spawn')
  expect(spawn?.fork).toBe(true)
  expect(posted.some(ev => ev.kind === 'session.thread')).toBe(true)
  const messages = posted.filter(ev => ev.kind === 'agent.message')
  expect(messages.map(m => [m.via, m.to, m.text])).toEqual([
    ['projects-relay', undefined, 'Look into the flaky build'],
    ['model', 'agent-1', 'Check the CI logs too'],
  ])
  expect(posted.find(ev => ev.kind === 'agent.waiting')?.agent).toBe('agent-1')
  expect(posted.find(ev => ev.kind === 'agent.end')?.status).toBe('completed')
  expect(posted.filter(ev => ev.kind === 'turn.complete').map(ev => ev.answer)).toContain('Found it: the cache key.')
})

test('checklists, questions and plans reach the office before the tool runs', async () => {
  const [todo] = beforeTool({ tool: 'TodoWrite', todos: [{ content: 'Write tests', status: 'in_progress', activeForm: 'Writing tests' }] })
  expect(todo).toEqual({ kind: 'todo.update', agent: undefined, items: [{ text: 'Write tests', status: 'in_progress', active: 'Writing tests' }] })
  const [ask] = beforeTool({ tool: 'AskUserQuestion', tool_use_id: 'q1', questions: [{ header: 'Lib', question: 'Which one?', multiSelect: false, options: [{ label: 'A', description: 'first' }, { label: 'B', description: 'second' }] }] })
  expect(ask.kind).toBe('ask.open')
  expect(ask.id).toBe('q1')
  expect((ask.questions as { options: unknown[] }[])[0].options.length).toBe(2)
  expect(beforeTool({ tool: 'ExitPlanMode', tool_use_id: 'p1' })[0].type).toBe('plan')
  expect(beforeTool({ tool: 'Read', file_path: '/a' })).toEqual([])
})

test('answers, files, pictures and pull requests reach the office after it runs', async () => {
  const [closed] = afterTool({ tool: 'AskUserQuestion', tool_use_id: 'q1' }, { result: { answers: { 'Which one?': 'A' } } })
  expect(closed).toEqual({ kind: 'ask.close', agent: undefined, id: 'q1', answer: 'A' })
  const [file] = afterTool({ tool: 'Edit', file_path: '/w/src/a.ts' }, { result: { structuredPatch: [{ lines: ['+x', '+y', '-z', ' k'] }] } })
  expect(file).toEqual({ kind: 'asset.add', agent: undefined, id: 'file-/w/src/a.ts', type: 'file', title: 'a.ts', path: '/w/src/a.ts', meta: { additions: 2, deletions: 1 } })
  const [pic] = afterTool({ tool: 'Read', file_path: '/w/shot.png' }, { result: { type: 'image', file: {} } })
  expect(pic.type).toBe('image')
  const [pr] = afterTool({ tool: 'mcp__github__create_pull_request', title: 'Fix it' }, { result: {}, text: '{"html_url":"https://github.com/o/r/pull/7"}' })
  expect(pr.url).toBe('https://github.com/o/r/pull/7')
  // A refused edit made nothing.
  expect(afterTool({ tool: 'Edit', file_path: '/w/a.ts' }, { deny: 'no' })).toEqual([])
  expect(diffStats({ gitDiff: { additions: 3, deletions: 4 } })).toEqual({ additions: 3, deletions: 4 })
})

test('the Task tools build one checklist per loop', async () => {
  afterTool({ tool: 'TaskCreate', subject: 'Map it' }, { result: { task: { id: '1', subject: 'Map it' } } })
  afterTool({ tool: 'TaskCreate', subject: 'Fix it' }, { result: { task: { id: '2', subject: 'Fix it' } } })
  const [list] = afterTool({ tool: 'TaskUpdate', taskId: '1', status: 'completed' }, { result: { success: true } })
  expect(list.items).toEqual([{ text: 'Map it', status: 'completed', active: undefined }, { text: 'Fix it', status: 'pending', active: undefined }])
})
