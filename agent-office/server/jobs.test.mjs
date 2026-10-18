// node --test agent-office/server/jobs.test.mjs
// The front desk's jobs: the command it runs, and a real bridge starting
// one with a stand-in `claude` that records how it was called.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, readFile, chmod, stat } from 'node:fs/promises'
import { request } from 'node:http'
import { tmpdir } from 'node:os'
import { credentials } from './test-support.mjs'
import { join } from 'node:path'
import { startArgs, resumeArgs, checkResume, shortIdOf, explain, stateOf, check, childEnv, resolveClaude } from './jobs.mjs'

test('a job starts as a background session, never with a permission mode or a bypass', () => {
  const args = startArgs({ title: 'Write a README', prompt: '--sneaky: write it' })
  assert.deepEqual(args, ['--bg', '-n', 'Write a README', '--', '--sneaky: write it'])
  for (const a of args.slice(0, 3)) assert.doesNotMatch(a, /permission|dangerous|bypass/i)
})

test('talking to an ended session resumes it in the background, your words after --', () => {
  assert.deepEqual(resumeArgs({ session: 'abc-123', text: '--help me' }), ['--bg', '--resume', 'abc-123', '--', '--help me'])
  assert.deepEqual(checkResume({ session: 'abc-123', text: '  hi ' }), { session: 'abc-123', text: 'hi' })
  assert.ok(checkResume({ session: '../etc', text: 'hi' }).error)
  assert.ok(checkResume({ session: '--dangerously-skip-permissions', text: 'hi' }).error, 'never an option')
  assert.deepEqual(startArgs({ title: '--help me', prompt: 'x' }).slice(0, 3), ['--bg', '-n', 'help me'])
  assert.ok(checkResume({ session: 'abc', text: ' ' }).error)
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
let bridge, dir, calls, token, root
let signed = () => ({})

function call(method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: PORT, method, path, headers: { ...signed(), ...headers } }, res => {
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
  root = await mkdtemp(join(tmpdir(), 'office-jobs-'))
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
  signed = credentials(root).both
  token = /agent-office-token" content="([0-9a-f]+)"/.exec(await (await fetch(base, { headers: signed() })).text())[1]
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
  await fetch(`${base}/event`, { method: 'POST', headers: signed(), body: JSON.stringify({ kind: 'session.start', session: 's1', t: Date.now(), cwd: dir }) })
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

const read = async () => (await readFile(calls, 'utf8')).trim().split('\n').map(l => JSON.parse(l))

test('an ended session is picked up again in its own folder, and can be deleted for good', async () => {
  // Its transcript says where it ran.
  await mkdir(join(root, 'projects', '-p'), { recursive: true })
  const path = join(root, 'projects', '-p', 'old-1.jsonl')
  await writeFile(path, JSON.stringify({ type: 'user', cwd: dir, origin: { kind: 'human' }, timestamp: '2026-10-01T10:00:00Z', message: { content: 'first ask' } }) + '\n')
  await mkdir(join(root, 'projects', '-p', 'old-1', 'subagents'), { recursive: true })
  await writeFile(join(root, 'projects', '-p', 'old-1', 'subagents', 'agent-x.jsonl'), '{}\n')
  assert.equal((await call('POST', '/resume', { headers: { host: `127.0.0.1:${PORT}` }, body: { session: 'old-1', text: 'hi' } })).status, 403, 'no token')
  const res = await call('POST', '/resume', { headers: auth(), body: { session: 'old-1', text: 'What did you change?' } })
  assert.equal(res.status, 200, res.text)
  const resumed = (await read()).find(c => c.args[1] === '--resume')
  assert.deepEqual(resumed.args, ['--bg', '--resume', 'old-1', '--', 'What did you change?'])
  assert.equal(resumed.cwd, dir)
  assert.equal((await call('POST', '/resume', { headers: auth(), body: { session: 'nope-9', text: 'hi' } })).status, 404)

  // Deleting for good: its transcript and its subagents', nothing else.
  assert.equal((await call('POST', '/delete', { headers: { host: `127.0.0.1:${PORT}` }, body: { session: 'old-1' } })).status, 403, 'no token')
  const del = await call('POST', '/delete', { headers: auth(), body: { session: 'old-1' } })
  assert.equal(del.status, 200, del.text)
  await assert.rejects(stat(path))
  await assert.rejects(stat(join(root, 'projects', '-p', 'old-1')))
  assert.ok(await stat(dir), 'the project folder stays')
})

test('a session still open in Claude Code isn’t deleted', async () => {
  await mkdir(join(root, 'projects', '-p'), { recursive: true })
  await writeFile(join(root, 'projects', '-p', 'live-1.jsonl'), JSON.stringify({ type: 'user', cwd: dir, timestamp: '2026-10-01T10:00:00Z', message: { content: 'hi' } }) + '\n')
  await fetch(`${base}/event`, { method: 'POST', headers: signed(), body: JSON.stringify({ kind: 'session.start', session: 'live-1', t: Date.now(), cwd: dir }) })
  const res = await call('POST', '/delete', { headers: auth(), body: { session: 'live-1' } })
  assert.equal(res.status, 409)
  assert.ok(await stat(join(root, 'projects', '-p', 'live-1.jsonl')))
})

test('a new project: the folder is opened (or made) and its trust read from Claude Code', async () => {
  const res = await call('POST', '/projects', { headers: auth(), body: { path: dir } })
  assert.equal(res.status, 200, res.text)
  assert.equal(res.json().trusted, false)
  await writeFile(join(root, '.claude.json'), JSON.stringify({ projects: { [res.json().dir]: { hasTrustDialogAccepted: true } } }))
  const again = await call('POST', '/projects', { headers: auth(), body: { path: dir } })
  assert.equal(again.json().trusted, true)
  assert.equal((await call('POST', '/projects', { headers: { host: `127.0.0.1:${PORT}` }, body: { path: dir } })).status, 403, 'no token')
})

test('a custom agent type is saved in a known project, never over another', async () => {
  const body = { dir, scope: 'project', name: 'doc-writer', description: 'Writes docs', instructions: 'Plain words.' }
  const res = await call('POST', '/agent-types', { headers: auth(), body })
  assert.equal(res.status, 200, res.text)
  assert.match(await readFile(join(dir, '.claude', 'agents', 'doc-writer.md'), 'utf8'), /name: doc-writer/)
  assert.equal((await call('POST', '/agent-types', { headers: auth(), body })).status, 409)
  assert.equal((await call('POST', '/agent-types', { headers: auth(), body: { ...body, dir: '/somewhere/else' } })).status, 403)
  const listed = await (await fetch(`${base}/agent-types?dir=${encodeURIComponent(dir)}`, { headers: signed() })).json()
  assert.ok(listed.types.some(t => t.name === 'doc-writer'))
})
