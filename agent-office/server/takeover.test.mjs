// node --test agent-office/server/*.test.mjs
// After a plugin update, the new mod starts a bridge with --replace, which asks
// the old managed one to step down and takes its port.
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const PORT = 7800 + Math.floor(Math.random() * 400)
const base = `http://127.0.0.1:${PORT}`
const SERVER = join(import.meta.dirname, 'server.mjs')
const VERSION = JSON.parse(readFileSync(join(import.meta.dirname, '..', '.claude-plugin', 'plugin.json'), 'utf8')).version
const started = []

function start(...flags) {
  const child = spawn(process.execPath, [SERVER, '--port', String(PORT), ...flags], { stdio: 'ignore' })
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
  const stop = headers => fetch(`${base}/shutdown`, { method: 'POST', headers }).then(r => r.status)
  assert.equal(await stop({}), 403, 'no control header')
  assert.equal(await stop({ 'x-agent-office-control': '1' }), 409, 'not managed')
  mine.kill()
  await exited(mine)
})

test('--replace takes the port from a managed bridge', async () => {
  const old = start('--managed')
  await until(async () => (await health())?.managed)
  await fetch(`${base}/event`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind: 'turn.start', session: 's' }) })
  assert.equal((await health()).events, 1)

  const replacement = start('--managed', '--replace')
  assert.equal(await exited(old), 0, 'the old bridge steps down')
  // The replacement starts with an empty log, which tells it apart.
  const seen = await until(async () => { const h = await health(); return h?.events === 0 && h })
  assert.equal(seen.managed, true)
  assert.equal(replacement.exitCode, null, 'the replacement keeps running')
})
