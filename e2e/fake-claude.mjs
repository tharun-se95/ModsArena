#!/usr/bin/env node
// A stand-in for Claude Code's CLI: background sessions that report to the
// bridge like the plugin does and write transcripts like Claude Code does.
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
const HOME = process.env.E2E_HOME, PORT = process.env.E2E_PORT
const STATE = path.join(HOME, 'state.json')
const load = () => { try { return JSON.parse(fs.readFileSync(STATE, 'utf8')) } catch { return {} } }
const save = s => fs.writeFileSync(STATE, JSON.stringify(s))
const args = process.argv.slice(2)
fs.appendFileSync(path.join(HOME, 'calls.log'), JSON.stringify({ args, cwd: process.cwd() }) + '\n')
if (args[0] === '__run') {
  // The session itself, detached: reports in, writes its turn, finishes.
  const [, session, short, cwd, text] = args
  // Like a real session's plugin: it reports with your account's secret.
  const secret = fs.readFileSync(path.join(process.env.CLAUDE_CONFIG_DIR, 'agent-office', 'secret'), 'utf8').trim()
  const post = ev => fetch(`http://127.0.0.1:${PORT}/event`, { method: 'POST', headers: { 'x-agent-office-secret': secret }, body: JSON.stringify({ t: Date.now(), session, ...ev }) }).catch(() => {})
  const dir = path.join(process.env.CLAUDE_CONFIG_DIR, 'projects', cwd.replace(/[^a-zA-Z0-9]/g, '-'))
  fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `${session}.jsonl`)
  const row = r => fs.appendFileSync(file, JSON.stringify({ cwd, sessionId: session, timestamp: new Date().toISOString(), ...r }) + '\n')
  await new Promise(r => setTimeout(r, 1200))
  await post({ kind: 'session.start', cwd })
  await post({ kind: 'turn.start', turnId: 'x1', text })
  row({ type: 'user', origin: { kind: 'human' }, message: { content: text } })
  await new Promise(r => setTimeout(r, 1500))
  row({ type: 'assistant', message: { model: 'claude-sonnet-5-5', content: [{ type: 'text', text: `**Done.** Here is my answer to: ${text.slice(0, 80)}` }], usage: { input_tokens: 30000 } } })
  await post({ kind: 'turn.complete', turnId: 'x1', reason: 'answer', answer: 'Done.' })
  const s = load(); s[short].state = 'done'; save(s)
  process.exit(0)
}
if (args[0] === '--bg') {
  const resume = args[1] === '--resume' ? args[2] : null
  const text = args[args.indexOf('--') + 1]
  const session = resume ?? randomUUID()
  const short = session.replace(/-/g, '').slice(0, 8)
  const s = load(); s[short] = { id: short, sessionId: session, state: 'working' }; save(s)
  spawn(process.execPath, [process.argv[1], '__run', session, short, process.cwd(), text], { detached: true, stdio: 'ignore', env: process.env }).unref()
  console.log(`backgrounded · ${short} · ${resume ? 'resumed' : 'job'}`)
} else if (args[0] === 'agents') {
  console.log(JSON.stringify(Object.values(load())))
} else if (args[0] === 'stop') {
  const s = load(); if (s[args[1]]) s[args[1]].state = 'stopped'; save(s); console.log('stopped')
}
