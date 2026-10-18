// node --test agent-office/server/*.test.mjs
// Starts a real bridge on a spare port and talks to it over HTTP.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises'
import { request } from 'node:http'
import { connect } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { credentials } from './test-support.mjs'
import { hookCommand } from './settings-hooks.mjs'

const PORT = 7400 + Math.floor(Math.random() * 400)
const base = `http://127.0.0.1:${PORT}`
let bridge
let config
let auth = () => ({})

// node:http, so the test can set Host and Origin the way a browser would.
function call(method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: PORT, method, path, headers: { ...auth(), ...headers } }, res => {
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
    if (await fetch(`${base}/healthz`).then(r => r.ok, () => false)) { auth = credentials(config).both; return }
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
    const req = request({ host: '127.0.0.1', port: PORT, path: '/stream', headers: auth() }, res => {
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

// A request line the URL parser can't read, sent raw.
function raw(line) {
  return new Promise(resolve => {
    const socket = connect(PORT, '127.0.0.1', () => socket.end(`${line}\r\nHost: 127.0.0.1:${PORT}\r\n\r\n`))
    let text = ''
    socket.on('data', d => { text += d })
    socket.on('close', () => resolve(text))
    socket.on('error', () => resolve(text))
  })
}

test('a malformed request is answered, and the bridge keeps serving', async () => {
  for (const line of ['GET //[ HTTP/1.1', 'GET /%%% HTTP/1.1', 'POST //[ HTTP/1.1', 'GET http://[::1 HTTP/1.1']) await raw(line)
  const health = await call('GET', '/healthz')
  assert.equal(health.status, 200)
})

test('the page can only run its own script and can’t be framed', async () => {
  const page = await call('GET', '/')
  assert.equal(page.status, 200)
  // node:http lowercases header names
  const res = await new Promise(resolve => request({ host: '127.0.0.1', port: PORT, path: '/', headers: auth() }, resolve).end())
  res.resume()
  assert.match(res.headers['content-security-policy'], /script-src 'self'/)
  assert.match(res.headers['content-security-policy'], /frame-ancestors 'none'/)
  assert.doesNotMatch(res.headers['content-security-policy'], /unsafe-eval|script-src[^;]*unsafe-inline/)
  assert.equal(res.headers['x-frame-options'], 'DENY')
})

test('the bridge refuses to listen beyond this computer', async () => {
  const child = spawn(process.execPath, [join(import.meta.dirname, 'server.mjs'), '--port', String(PORT + 1), '--host', '0.0.0.0'], { stdio: ['ignore', 'ignore', 'pipe'] })
  let err = ''
  child.stderr.on('data', d => { err += d })
  const code = await new Promise(resolve => child.on('close', resolve))
  assert.equal(code, 2)
  assert.match(err, /only listens on this computer/)
})

// Plain requests, with none of the account's credentials.
function anonymous(method, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: PORT, method, path, headers }, res => {
      let text = ''
      res.on('data', c => { text += c })
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text }))
    })
    req.on('error', reject)
    req.end(method === 'POST' ? '{}' : undefined)
  })
}

test('the secret is this account’s alone', async () => {
  const { statSync } = await import('node:fs')
  const file = join(config, 'agent-office', 'secret')
  assert.match(readFileSync(file, 'utf8'), /^[0-9a-f]{64}\n$/)
  if (process.platform !== 'win32') assert.equal(statSync(file).mode & 0o777, 0o600)
})

test('without the key, the office page says how to open it, and nothing else answers', async () => {
  const page = await anonymous('GET', '/')
  assert.equal(page.status, 401)
  assert.match(page.text, /Open the office from Claude Code/)
  assert.doesNotMatch(page.text, /agent-office-token" content="[0-9a-f]/)
  for (const path of ['/stream', '/history', '/transcript?session=sess-1', '/agent-types', '/asset?session=a&id=b']) {
    assert.equal((await anonymous('GET', path)).status, 401, path)
  }
  // The page's script and the health check stay open.
  assert.equal((await anonymous('GET', '/app.js')).status, 200)
  assert.equal((await anonymous('GET', '/healthz')).status, 200)
})

test('the key signs a browser in with a cookie only the bridge can read', async () => {
  const { openKey, cookieValue } = await import('./secret.mjs')
  const secret = readFileSync(join(config, 'agent-office', 'secret'), 'utf8').trim()
  assert.equal((await anonymous('GET', '/?key=' + 'f'.repeat(64))).status, 401, 'a wrong key')
  const signedIn = await anonymous('GET', `/?key=${openKey(secret)}`)
  assert.equal(signedIn.status, 303)
  assert.equal(signedIn.headers.location, '/')
  const cookie = signedIn.headers['set-cookie'][0]
  assert.match(cookie, new RegExp(`^agent_office=${cookieValue(secret)};`))
  assert.match(cookie, /HttpOnly/)
  assert.match(cookie, /SameSite=Strict/)
  const page = await anonymous('GET', '/', { cookie: cookie.split(';')[0] })
  assert.equal(page.status, 200)
  assert.match(page.text, /agent-office-token" content="[0-9a-f]{48}"/)
})

test('only your own sessions can report and read their inbox', async () => {
  for (const [method, path] of [['POST', '/event'], ['GET', '/inbox?session=s'], ['GET', '/answer/wait?session=s&id=x'], ['POST', '/shutdown']]) {
    const res = await anonymous(method, path, { 'x-agent-office-inbox': '1', 'x-agent-office-control': '1', 'content-type': 'application/json' })
    assert.equal(res.status, 401, `${method} ${path}`)
  }
  const ok = await call('POST', '/event', { body: { kind: 'turn.start', session: 'sess-auth', t: Date.now() } })
  assert.equal(ok.status, 200)
})

test('the bridge proves it knows the secret, without giving it away', async () => {
  const { proof } = await import('./secret.mjs')
  const secret = readFileSync(join(config, 'agent-office', 'secret'), 'utf8').trim()
  const health = JSON.parse((await anonymous('GET', '/healthz?nonce=abc123')).text)
  assert.equal(health.name, 'agent-office')
  assert.equal(health.proof, proof(secret, 'abc123'))
  assert.doesNotMatch(JSON.stringify(health), new RegExp(secret))
})

test('the demo, which opens without signing in, never shows your own sessions', async () => {
  const port = PORT + 2
  const child = spawn(process.execPath, [join(import.meta.dirname, 'server.mjs'), '--port', String(port), '--demo'], {
    env: { ...process.env, CLAUDE_CONFIG_DIR: config }, stdio: 'ignore',
  })
  try {
    let res
    for (let i = 0; i < 50 && !res; i++) {
      res = await fetch(`http://127.0.0.1:${port}/history`).then(r => (r.ok ? r : undefined), () => undefined)
      if (!res) await new Promise(r => setTimeout(r, 100))
    }
    const { sessions } = await res.json()
    assert.ok(sessions.length > 0, 'sample sessions')
    assert.ok(!sessions.some(s => s.session === 'sess-1' || /hello office/.test(JSON.stringify(s))), 'none of yours')
  } finally {
    child.kill()
  }
})

// The settings hooks' command, exactly as installed, run the way Claude Code
// runs hooks: through bash (Git Bash on Windows, which CI runs this on too).
const hasShell = ['bash', 'curl'].every(cmd => spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0)
test('a settings hook reaches the bridge with your secret', { skip: !hasShell && 'needs bash and curl' }, async () => {
  const seen = async session => JSON.stringify(await firstReplay()).includes(session)
  const hook = (session, configDir) => spawnSync('bash', ['-c', hookCommand(PORT)], {
    input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', session_id: session, cwd: config, prompt: 'from a settings hook' }),
    env: { ...process.env, CLAUDE_CONFIG_DIR: configDir }, encoding: 'utf8',
  })
  assert.equal(hook('hook-sess-1', config).status, 0, 'a hook never fails')
  let arrived = false
  for (let i = 0; i < 20 && !arrived; i++) arrived = await seen('hook-sess-1') || (await new Promise(r => setTimeout(r, 100)), false)
  assert.ok(arrived, 'the event arrived')

  // Without the secret (another account's hook), it's refused, and still exits 0.
  assert.equal(hook('hook-sess-2', await mkdtemp(join(tmpdir(), 'office-other-'))).status, 0)
  await new Promise(r => setTimeout(r, 300))
  assert.ok(!(await seen('hook-sess-2')), 'nothing arrived')
})
