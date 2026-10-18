// node --test agent-office/server/*.test.mjs
// After a plugin update, the new mod starts a bridge with --replace, which asks
// the old managed one to step down and takes its port; /office run again adds
// --restart, which takes over from any Agent Office bridge.
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { credentials } from './test-support.mjs'
import { join } from 'node:path'

const PORT = 7800 + Math.floor(Math.random() * 400)
const base = `http://127.0.0.1:${PORT}`
const SERVER = join(import.meta.dirname, 'server.mjs')
const VERSION = JSON.parse(readFileSync(join(import.meta.dirname, '..', '.claude-plugin', 'plugin.json'), 'utf8')).version
const started = []
// Its own config folder: never the real ~/.claude.
const CONFIG = mkdtempSync(join(tmpdir(), 'office-takeover-'))
const auth = credentials(CONFIG).session

function start(...flags) {
  const child = spawn(process.execPath, [SERVER, '--port', String(PORT), ...flags], { stdio: 'ignore', env: { ...process.env, CLAUDE_CONFIG_DIR: CONFIG } })
  started.push(child)
  return child
}

const health = () => fetch(`${base}/healthz`).then(r => r.json(), () => undefined)
const exited = child => new Promise(resolve => child.exitCode !== null ? resolve(child.exitCode) : child.once('exit', resolve))

async function until(check) {
  for (let i = 0; i < 50; i++) {
    const value = await check()
    if (value) return value
    await new Promise(r => setTimeout(r, 100))
  }
  throw new Error('timed out')
}

after(() => { for (const child of started) child.kill() })

test('a bridge you started yourself refuses to step down', async () => {
  const mine = start()
  const seen = await until(health)
  assert.equal(seen.version, VERSION)
  assert.equal(seen.managed, false)
  const stop = headers => fetch(`${base}/shutdown`, { method: 'POST', headers: { ...auth(), ...headers } }).then(r => r.status)
  assert.equal(await stop({}), 403, 'no control header')
  assert.equal(await stop({ 'x-agent-office-control': '1' }), 409, 'not managed')
  mine.kill()
  await exited(mine)
})

test('--replace takes the port from a managed bridge', async () => {
  const old = start('--managed')
  await until(async () => (await health())?.managed)
  await fetch(`${base}/event`, { method: 'POST', headers: { 'content-type': 'application/json', ...auth() }, body: JSON.stringify({ kind: 'turn.start', session: 's' }) })
  assert.equal((await health()).events, 1)

  const replacement = start('--managed', '--replace')
  assert.equal(await exited(old), 0, 'the old bridge steps down')
  // The replacement answers with its own pid, and the old one's log, handed over.
  const seen = await until(async () => { const h = await health(); return h?.pid === replacement.pid && h })
  assert.equal(seen.managed, true)
  assert.equal(seen.events, 1, 'the live events came across')
  assert.equal(replacement.exitCode, null, 'the replacement keeps running')
  replacement.kill()
  await exited(replacement)
})

test('/office run again restarts a bridge you started yourself, keeping its events', async () => {
  const mine = start()
  await until(async () => (await health())?.pid === mine.pid)
  await fetch(`${base}/event`, { method: 'POST', headers: { 'content-type': 'application/json', ...auth() }, body: JSON.stringify([{ kind: 'turn.start', session: 's' }, { kind: 'turn.start', session: 't' }]) })

  const fresh = start('--managed', '--replace', '--restart')
  assert.equal(await exited(mine), 0, 'it steps down when asked for a restart')
  const seen = await until(async () => { const h = await health(); return h?.pid === fresh.pid && h })
  assert.equal(seen.events, 2)
  fresh.kill()
  await exited(fresh)
})

test('an older bridge that cannot step down is stopped, and nothing else is', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  // An old bridge: refuses to step down and reports no pid. Lives where a
  // plugin copy would, so it's recognised as one.
  const root = mkdtempSync(join(tmpdir(), 'old-'))
  mkdirSync(join(root, 'agent-office', 'server'), { recursive: true })
  const oldServer = join(root, 'agent-office', 'server', 'server.mjs')
  writeFileSync(oldServer, `import { createServer } from 'node:http'
createServer((req, res) => {
  if (req.url === '/healthz') return res.end(JSON.stringify({ ok: true, version: '0.9.0' }))
  res.writeHead(409).end()
}).listen(${PORT}, '127.0.0.1')`)
  const old = spawn(process.execPath, [oldServer], { stdio: 'ignore' })
  started.push(old)
  await until(async () => (await health())?.version === '0.9.0')

  const fresh = start('--managed', '--replace', '--restart')
  assert.equal(await exited(old) !== undefined, true, 'the old bridge was stopped')
  await until(async () => (await health())?.pid === fresh.pid)
  fresh.kill()
  await exited(fresh)

  // Something that isn't a bridge keeps the port: nothing is stopped.
  const other = join(root, 'my-app.mjs')
  writeFileSync(other, `import { createServer } from 'node:http'
createServer((req, res) => res.writeHead(404).end()).listen(${PORT}, '127.0.0.1')`)
  const app = spawn(process.execPath, [other], { stdio: 'ignore' })
  started.push(app)
  await until(() => fetch(`${base}/`).then(() => true, () => false))
  const intruder = start('--managed', '--replace', '--restart')
  await exited(intruder) // it finds the port taken and leaves
  assert.equal(app.exitCode, null, 'the other server is untouched')
  app.kill()
  await exited(app)
})

test('--background hands the office to a detached bridge, which stops once idle', async () => {
  const { existsSync } = await import('node:fs')
  const port = PORT + 7
  const url = `http://127.0.0.1:${port}`
  const launcher = spawn(process.execPath, [SERVER, '--port', String(port), '--managed', '--background'], {
    stdio: 'ignore', env: { ...process.env, CLAUDE_CONFIG_DIR: CONFIG, AGENT_OFFICE_IDLE_MS: '1500' },
  })
  assert.equal(await exited(launcher), 0, 'the launcher hands over and exits')
  const seen = await until(() => fetch(`${url}/healthz`).then(r => r.json(), () => undefined))
  assert.notEqual(seen.pid, launcher.pid, 'a detached process serves the office')
  assert.ok(existsSync(join(CONFIG, 'agent-office', 'bridge.log')))
  // Nobody watching, nothing reporting: it stops on its own.
  await until(() => fetch(`${url}/healthz`).then(() => false, () => true))
})

test('a message not yet picked up survives the swap to a newer bridge', async () => {
  const both = credentials(CONFIG).both
  const old = start('--managed')
  await until(async () => (await health())?.pid === old.pid)
  const page = await (await fetch(`${base}/`, { headers: both() })).text()
  const token = /name="agent-office-token" content="([0-9a-f]{48})"/.exec(page)?.[1]
  const sent = await fetch(`${base}/chat`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: base, 'x-agent-office-token': token, ...both() },
    body: JSON.stringify({ session: 'sess-9', text: 'still there after the update?' }),
  })
  assert.equal(sent.status, 200)

  const replacement = start('--managed', '--replace')
  assert.equal(await exited(old), 0)
  await until(async () => (await health())?.pid === replacement.pid)
  const inbox = await (await fetch(`${base}/inbox?session=sess-9`, { headers: { 'x-agent-office-inbox': '1', ...auth() } })).json()
  assert.deepEqual(inbox.messages.map(m => m.text), ['still there after the update?'])
  replacement.kill()
  await exited(replacement)
})
