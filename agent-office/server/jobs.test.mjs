// node --test agent-office/server/jobs.test.mjs
// The front desk's jobs: the command it runs, and a real bridge starting
// one with a stand-in `claude` that records how it was called.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, writeFile, readFile, chmod } from 'node:fs/promises'
import { request } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { startArgs, shortIdOf, explain, stateOf, check, childEnv, resolveClaude } from './jobs.mjs'

test('a job starts as a background session, never with a permission mode or a bypass', () => {
  const args = startArgs({ title: 'Write a README', prompt: '--sneaky: write it' })
  assert.deepEqual(args, ['--bg', '-n', 'Write a README', '--', '--sneaky: write it'])
  for (const a of args.slice(0, 3)) assert.doesNotMatch(a, /permission|dangerous|bypass/i)
})

// A pretend Windows disk: path -> file contents, for resolveClaude().
function windows(files, PATH) {
  const disk = new Map(Object.entries(files).map(([k, v]) => [k.toLowerCase(), v]))
  return {
    platform: 'win32', env: { Path: PATH }, node: 'C:\\Program Files\\nodejs\\node.exe',
    exists: p => disk.has(p.toLowerCase()),
    read: p => { if (!disk.has(p.toLowerCase())) throw new Error('ENOENT'); return disk.get(p.toLowerCase()) },
  }
}
// What npm writes next to a package's command on Windows (cmd-shim).
const CMD_SHIM = '@ECHO off\r\nGOTO start\r\n:find_dp0\r\nSET dp0=%~dp0\r\nEXIT /b\r\n:start\r\nSETLOCAL\r\nCALL :find_dp0\r\n\r\nIF EXIST "%dp0%\\node.exe" (\r\n  SET "_prog=%dp0%\\node.exe"\r\n) ELSE (\r\n  SET "_prog=node"\r\n  SET PATHEXT=%PATHEXT:;.JS;=;%\r\n)\r\n\r\nendLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\\node_modules\\@anthropic-ai\\claude-code\\cli.js" %*\r\n'
const SH_SHIM = '#!/bin/sh\nbasedir=$(dirname "$(echo "$0" | sed -e \'s,\\\\,/,g\')")\nexec node  "$basedir/node_modules/@anthropic-ai/claude-code/cli.js" "$@"\n'
const NPM = 'C:\\Users\\ann\\AppData\\Roaming\\npm'
const CLI = `${NPM}\\node_modules\\@anthropic-ai\\claude-code\\cli.js`

test('elsewhere than Windows, claude is run as it is', () => {
  assert.deepEqual(resolveClaude({ platform: 'linux', env: {} }), { command: 'claude', args: [] })
  assert.deepEqual(resolveClaude({ platform: 'darwin', env: { AGENT_OFFICE_CLAUDE: '/opt/claude' } }), { command: '/opt/claude', args: [] })
})

test('on Windows, a native claude.exe on PATH comes first, even after an npm shim', () => {
  const native = 'C:\\Users\\ann\\.local\\bin'
  const r = resolveClaude(windows({ [`${NPM}\\claude.cmd`]: CMD_SHIM, [CLI]: '', [`${native}\\claude.exe`]: 'MZ' }, `C:\\Windows;${NPM};${native}`))
  assert.deepEqual(r, { command: `${native}\\claude.exe`, args: [] })
})

test('on Windows, the npm claude.cmd is run as node with the script it wraps, never through a shell', () => {
  const r = resolveClaude(windows({ [`${NPM}\\claude.cmd`]: CMD_SHIM, [CLI]: '' }, `C:\\Windows;${NPM}\\`))
  assert.deepEqual(r, { command: 'C:\\Program Files\\nodejs\\node.exe', args: [CLI] })
  // The sh shim npm writes beside it works the same.
  const sh = resolveClaude(windows({ [`${NPM}\\claude`]: SH_SHIM, [CLI]: '' }, `"${NPM}"`))
  assert.deepEqual(sh, { command: 'C:\\Program Files\\nodejs\\node.exe', args: [CLI] })
  // AGENT_OFFICE_CLAUDE naming a shim is unwrapped too.
  const named = resolveClaude({ ...windows({ [`${NPM}\\claude.cmd`]: CMD_SHIM, [CLI]: '' }, ''), env: { AGENT_OFFICE_CLAUDE: `${NPM}\\claude.cmd` } })
  assert.deepEqual(named.args, [CLI])
})

test('on Windows, a shim whose script is missing, or no claude at all, is refused in plain words', () => {
  const broken = resolveClaude(windows({ [`${NPM}\\claude.cmd`]: CMD_SHIM }, NPM))
  assert.ok(broken.error)
  const none = resolveClaude(windows({}, 'C:\\Windows'))
  assert.match(none.error, /Claude Code/)
  assert.doesNotMatch(none.error, /ENOENT|spawn|shim|PATH/)
  assert.equal(explain(none.error, 'NO_CLAUDE'), none.error)
})

test('the session id, the state and the reasons come out in plain words', () => {
  assert.equal(shortIdOf('Starting background service…\nbackgrounded · 7370dae4 · Office job\n  claude attach 7370dae4'), '7370dae4')
  assert.equal(shortIdOf('Workspace not trusted.'), undefined)
  assert.match(explain('Workspace not trusted. Run `claude` in /x once', 1), /trust/)
  assert.match(explain('', 'ENOENT'), /installed/)
  assert.equal(stateOf({ status: 'waiting', waitingFor: 'permission prompt', state: 'blocked' }), 'blocked')
  assert.equal(stateOf({ status: 'idle', state: 'done' }), 'done')
  assert.equal(stateOf({ status: 'busy', state: 'running' }), 'working')
  assert.equal(stateOf({ status: 'idle', state: 'working' }), 'working')
  assert.equal(stateOf(undefined), undefined)
})

test('a request needs a project and words, and is kept short', () => {
  assert.ok(check({ prompt: 'x' }).error)
  assert.ok(check({ dir: '/a', prompt: '  ' }).error)
  assert.ok(check({ dir: '/a', prompt: 'x'.repeat(9000) }).error)
  const ok = check({ dir: '/a', prompt: ' Fix   the\nlogin ', kind: 'hack' })
  assert.deepEqual(ok, { dir: '/a', prompt: 'Fix   the\nlogin', title: 'Fix the login', kind: 'other' })
})

test('a new session never inherits the session that started the bridge', () => {
  const env = childEnv({ PATH: '/bin', CLAUDECODE: '1', CLAUDE_CODE_SESSION_ID: 'abc', CLAUDE_CONFIG_DIR: '/c' })
  assert.deepEqual(env, { PATH: '/bin', CLAUDE_CONFIG_DIR: '/c' })
})

// ---------------------------------------------------------------------------
// A real bridge

const PORT = 7800 + Math.floor(Math.random() * 150)
const base = `http://127.0.0.1:${PORT}`
let bridge, dir, calls, token

function call(method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: PORT, method, path, headers }, res => {
      let text = ''
      res.on('data', c => { text += c })
      res.on('end', () => resolve({ status: res.statusCode, text, json: () => JSON.parse(text) }))
    })
    req.on('error', reject)
    if (body !== undefined) req.write(JSON.stringify(body))
    req.end()
  })
}

before(async () => {
  const root = await mkdtemp(join(tmpdir(), 'office-jobs-'))
  dir = await mkdtemp(join(tmpdir(), 'office-project-'))
  calls = join(root, 'calls.log')
  // A stand-in claude: logs its arguments, working folder and whether it
  // inherited a session, then answers like `claude --bg` and `agents --json`.
  const fake = join(root, 'claude')
  await writeFile(fake, `#!/usr/bin/env node
const fs = require('fs')
fs.appendFileSync(${JSON.stringify(calls)}, JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd(), inherited: process.env.CLAUDE_CODE_SESSION_ID ?? null }) + '\\n')
const a = process.argv[2]
if (a === '--bg') console.log('backgrounded · 1a2b3c4d · job')
else if (a === 'agents') console.log(JSON.stringify([{ id: '1a2b3c4d', sessionId: '1a2b3c4d-0000', status: 'waiting', waitingFor: 'permission prompt', state: 'blocked' }]))
else if (a === 'stop') console.log('stopped 1a2b3c4d')
`)
  await chmod(fake, 0o755)
  bridge = spawn(process.execPath, [join(import.meta.dirname, 'server.mjs'), '--port', String(PORT)], {
    env: { ...process.env, CLAUDE_CONFIG_DIR: root, AGENT_OFFICE_CLAUDE: fake, CLAUDE_CODE_SESSION_ID: 'the-session-that-started-it' }, stdio: 'ignore',
  })
  for (let i = 0; i < 50; i++) {
    if (await fetch(`${base}/healthz`).then(r => r.ok, () => false)) break
    await new Promise(r => setTimeout(r, 100))
  }
  token = /agent-office-token" content="([0-9a-f]+)"/.exec(await (await fetch(base)).text())[1]
})

after(() => bridge?.kill())

const auth = () => ({ host: `127.0.0.1:${PORT}`, 'content-type': 'application/json', 'x-agent-office-token': token })

test('starting a job needs the page’s token, the page’s origin and the bridge’s own host', async () => {
  const body = { dir, prompt: 'hi' }
  assert.equal((await call('POST', '/jobs', { headers: { host: `127.0.0.1:${PORT}` }, body })).status, 403)
  assert.equal((await call('POST', '/jobs', { headers: { ...auth(), origin: 'https://evil.example' }, body })).status, 403)
  assert.equal((await call('POST', '/jobs', { headers: { ...auth(), host: `evil.example:${PORT}` }, body })).status, 403)
  assert.equal((await call('POST', '/jobs/stop', { headers: { host: `127.0.0.1:${PORT}` }, body: { id: 'x' } })).status, 403)
})

test('only in a project the office already knows', async () => {
  const res = await call('POST', '/jobs', { headers: auth(), body: { dir, prompt: 'hi' } })
  assert.equal(res.status, 403)
  assert.match(res.json().error, /already knows/)
})

test('a job in a known project starts a background session there, and stops', async () => {
  await fetch(`${base}/event`, { method: 'POST', body: JSON.stringify({ kind: 'session.start', session: 's1', t: Date.now(), cwd: dir }) })
  const res = await call('POST', '/jobs', { headers: { ...auth(), origin: base }, body: { dir, prompt: 'Write a README', kind: 'write' } })
  assert.equal(res.status, 200, res.text)
  const { job } = res.json()
  assert.equal(job.short, '1a2b3c4d')
  const read = async () => (await readFile(calls, 'utf8')).trim().split('\n').map(l => JSON.parse(l))
  for (let i = 0; i < 50 && !(await read()).some(c => c.args[0] === 'agents'); i++) await new Promise(r => setTimeout(r, 100))
  const log = await read()
  const started = log.find(c => c.args[0] === '--bg')
  assert.deepEqual(started.args, ['--bg', '-n', 'Write a README', '--', 'Write a README'])
  assert.equal(started.cwd, dir)
  assert.equal(started.inherited, null)
  assert.ok(log.some(c => c.args[0] === 'agents'))
  assert.equal((await call('POST', '/jobs/stop', { headers: auth(), body: { id: job.id } })).status, 200)
  const after = (await readFile(calls, 'utf8')).trim().split('\n').map(l => JSON.parse(l))
  assert.deepEqual(after.at(-1).args, ['stop', '1a2b3c4d'])
})
