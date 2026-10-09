// node --test agent-office/server/*.test.mjs
// Starts a real bridge on a spare port and talks to it over HTTP.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises'
import { request } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const PORT = 7400 + Math.floor(Math.random() * 400)
const base = `http://127.0.0.1:${PORT}`
let bridge
let config

// node:http, so the test can set Host and Origin the way a browser would.
function call(method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: PORT, method, path, headers }, res => {
      let text = ''
      res.on('data', c => { text += c })
      res.on('end', () => resolve({ status: res.statusCode, text, json: () => JSON.parse(text) }))
    })
    req.on('error', reject)
    if (body !== undefined) req.write(typeof body === 'string' ? body : JSON.stringify(body))
    req.end()
  })
}

before(async () => {
  config = await mkdtemp(join(tmpdir(), 'office-config-'))
  await writeFile(join(config, 'settings.json'), JSON.stringify({ theme: 'dark', extraKnownMarketplaces: { modsarena: { source: { source: 'github', repo: 'tharun-se95/ModsArena' } } } }))
  await mkdir(join(config, 'projects', '-w-app'), { recursive: true })
  await writeFile(join(config, 'projects', '-w-app', 'sess-1.jsonl'),
    JSON.stringify({ type: 'user', origin: { kind: 'human' }, timestamp: '2026-10-05T10:00:00Z', message: { content: 'hello office' } }) + '\n')
  bridge = spawn(process.execPath, [join(import.meta.dirname, 'server.mjs'), '--port', String(PORT)], {
    env: { ...process.env, CLAUDE_CONFIG_DIR: config }, stdio: 'ignore',
  })
  for (let i = 0; i < 50; i++) {
    if (await fetch(`${base}/healthz`).then(r => r.ok, () => false)) return
    await new Promise(r => setTimeout(r, 100))
  }
  throw new Error('bridge did not start')
})

after(() => bridge?.kill())

test('a request addressed to another hostname is refused', async () => {
  assert.equal((await call('GET', '/healthz', { headers: { host: 'rebound.example:' + PORT } })).status, 403)
  assert.equal((await call('GET', '/healthz')).status, 200)
})

test('the page carries the chat token; other origins cannot post', async () => {
  const page = (await call('GET', '/')).text
  const token = /name="agent-office-token" content="([0-9a-f]{48})"/.exec(page)?.[1]
  assert.ok(token, 'the served page has a token')
  const body = { session: 'sess-1', text: 'run the tests' }
  assert.equal((await call('POST', '/chat', { body })).status, 403, 'no token')
  assert.equal((await call('POST', '/chat', { body, headers: { 'x-agent-office-token': 'f'.repeat(48) } })).status, 403, 'wrong token')
  assert.equal((await call('POST', '/chat', { body, headers: { 'x-agent-office-token': token, origin: 'https://evil.example' } })).status, 403, 'foreign origin')
  assert.equal((await call('POST', '/event', { body: [], headers: { origin: 'https://evil.example' } })).status, 403, 'foreign origin, events too')

  const sent = await call('POST', '/chat', { body, headers: { 'x-agent-office-token': token, origin: base } })
  assert.equal(sent.status, 200)
  const { id } = sent.json()

  // The mod picks it up once, with its inbox header.
  assert.equal((await call('GET', '/inbox?session=sess-1')).status, 403)
  const inbox = (await call('GET', '/inbox?session=sess-1', { headers: { 'x-agent-office-inbox': '1' } })).json()
  assert.deepEqual(inbox.messages, [{ id, text: 'run the tests' }])
  assert.deepEqual((await call('GET', '/inbox?session=sess-1', { headers: { 'x-agent-office-inbox': '1' } })).json().messages, [])
})

test('a transcript is served from the session file', async () => {
  const res = await call('GET', '/transcript?session=sess-1')
  assert.equal(res.status, 200)
  assert.deepEqual(res.json().entries.map(e => e.text), ['hello office'])
  assert.equal((await call('GET', '/transcript?session=unknown')).status, 404)
  assert.equal((await call('GET', '/transcript?session=..%2F..%2Fx')).status, 404)
})

test('answering a question from the office is guarded like chat, and reaches the waiting mod', async () => {
  const token = /name="agent-office-token" content="([0-9a-f]{48})"/.exec((await call('GET', '/')).text)?.[1]
  await call('POST', '/event', { body: [{ kind: 'ask.open', session: 'sess-a', id: 'toolu_9', type: 'question', answerable: true, questions: [{ question: 'Which one?', options: [{ label: 'A' }, { label: 'B' }] }] }] })
  const body = { session: 'sess-a', id: 'toolu_9', answers: { 'Which one?': 'B' } }
  assert.equal((await call('POST', '/answer', { body })).status, 403, 'no token')
  assert.equal((await call('POST', '/answer', { body, headers: { 'x-agent-office-token': token, origin: 'https://evil.example' } })).status, 403, 'foreign origin')
  assert.equal((await call('GET', '/answer/wait?session=sess-a&id=toolu_9')).status, 403, 'no inbox header')
  const waiting = call('GET', '/answer/wait?session=sess-a&id=toolu_9', { headers: { 'x-agent-office-inbox': '1' } })
  assert.equal((await call('POST', '/answer', { body, headers: { 'x-agent-office-token': token, origin: base } })).status, 200)
  assert.deepEqual((await waiting).json(), { answer: { answers: { 'Which one?': 'B' } } })
})

test('Stop is guarded like chat and reaches the session’s mod through its inbox', async () => {
  const token = /name="agent-office-token" content="([0-9a-f]{48})"/.exec((await call('GET', '/')).text)?.[1]
  const body = { session: 'sess-stop' }
  assert.equal((await call('POST', '/stop', { body })).status, 403, 'no token')
  assert.equal((await call('POST', '/stop', { body, headers: { 'x-agent-office-token': token, origin: 'https://evil.example' } })).status, 403, 'foreign origin')
  const sent = await call('POST', '/stop', { body, headers: { 'x-agent-office-token': token, origin: base } })
  assert.equal(sent.status, 200)
  const inbox = (await call('GET', '/inbox?session=sess-stop', { headers: { 'x-agent-office-inbox': '1' } })).json()
  assert.deepEqual(inbox.messages, [{ id: sent.json().id, action: 'stop', text: '' }])
})

// The first replay frame a fresh page gets from /stream.
function firstReplay() {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: PORT, path: '/stream' }, res => {
      let text = ''
      res.on('data', c => {
        text += c
        const m = /event: replay\ndata: (.*)\n\n/.exec(text)
        if (m) {
          req.destroy()
          resolve(JSON.parse(m[1]))
        }
      })
    })
    req.on('error', err => (err.code === 'ECONNRESET' ? null : reject(err)))
    req.end()
  })
}

test('a long-running bridge still replays what places each thread in its room', async () => {
  const t = Date.now()
  const project = { id: '/w/long', name: 'long', remote: false }
  await call('POST', '/event', { body: [
    { t, kind: 'session.start', session: 'long-1', cwd: '/w/long', project },
    { t: t + 1, kind: 'turn.start', session: 'long-1', text: 'tidy the long log' },
    { t: t + 2, kind: 'session.thread', session: 'long-1' },
    { t: t + 3, kind: 'agent.spawn', session: 'long-1', agent: 'helper', type: 'Explore' },
    { t: t + 4, kind: 'agent.spawn', session: 'long-1', agent: 'gone', type: 'Explore' },
    { t: t + 5, kind: 'agent.end', session: 'long-1', agent: 'gone' },
  ] })
  // Far more than the log keeps, in bodies under the size limit.
  for (let batch = 0; batch < 9; batch++) {
    const events = []
    for (let i = 0; i < 1000; i++) events.push({ t: t + 10 + batch * 1000 + i, kind: 'turn.start', session: 'long-1', text: `step ${batch}-${i}` })
    assert.equal((await call('POST', '/event', { body: events })).status, 200)
  }
  const replay = await firstReplay()
  const mine = replay.filter(e => e.session === 'long-1')
  const start = mine.findIndex(e => e.kind === 'session.start')
  assert.ok(start >= 0, 'the session.start is replayed')
  assert.equal(mine[start].project.name, 'long')
  assert.equal(mine.find(e => e.kind === 'turn.start')?.text, 'tidy the long log', 'its first prompt comes before the rest')
  assert.ok(mine.some(e => e.kind === 'session.thread'), 'the thread marker too')
  assert.deepEqual(mine.filter(e => e.kind === 'agent.spawn').map(e => e.agent), ['helper'], 'only agents still at work')
  assert.equal(mine.filter(e => e.kind === 'session.start').length, 1, 'nothing twice')
})

test('auto-update: /healthz says where it stands, and only the office page can switch it', async () => {
  assert.deepEqual((await call('GET', '/healthz')).json().autoUpdate, { state: 'off', pending: false })
  const token = /name="agent-office-token" content="([0-9a-f]{48})"/.exec((await call('GET', '/')).text)?.[1]
  const body = { on: true }
  assert.equal((await call('POST', '/auto-update', { body })).status, 403, 'no token')
  assert.equal((await call('POST', '/auto-update', { body, headers: { 'x-agent-office-token': token, origin: 'https://evil.example' } })).status, 403, 'foreign origin')
  assert.equal((await call('POST', '/auto-update', { body: { on: 'yes' }, headers: { 'x-agent-office-token': token, origin: base } })).status, 400)
  const sent = await call('POST', '/auto-update', { body, headers: { 'x-agent-office-token': token, origin: base } })
  assert.equal(sent.status, 200)
  assert.deepEqual(sent.json().autoUpdate, { state: 'on', pending: true })
  const settings = JSON.parse(await readFile(join(config, 'settings.json'), 'utf8'))
  assert.equal(settings.theme, 'dark')
  assert.equal(settings.extraKnownMarketplaces.modsarena.autoUpdate, true)
  assert.deepEqual((await call('GET', '/healthz')).json().autoUpdate, { state: 'on', pending: true })
})
