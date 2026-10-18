// A throwaway account for the browser tests: a home folder with a few past
// sessions in three projects, Claude Code's trust list, and a real bridge
// running as that account, with a stand-in `claude` (fake-claude.mjs) that
// starts background sessions, writes their transcripts and reports them.
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
export const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']

const dirOf = (home, cwd) => join(home, '.claude', 'projects', cwd.replace(/[^a-zA-Z0-9]/g, '-'))

function pastSession(home, project, id, hoursAgo, ask, reply, agent) {
  const cwd = join(home, 'code', project)
  mkdirSync(cwd, { recursive: true })
  const dir = dirOf(home, cwd)
  mkdirSync(dir, { recursive: true })
  const t = Date.now() - hoursAgo * 3600e3
  const at = s => new Date(t + s * 1000).toISOString()
  const rows = [
    { type: 'user', cwd, origin: { kind: 'human' }, timestamp: at(0), message: { content: ask } },
    { type: 'assistant', cwd, timestamp: at(20), message: { model: 'claude-sonnet-5-5', content: [{ type: 'tool_use', id: 't1', name: 'Read', input: { file_path: `${cwd}/src/a.js` } }], usage: { input_tokens: 40000 } } },
    { type: 'user', cwd, timestamp: at(21), message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: 'ok' }] } },
    { type: 'assistant', cwd, timestamp: at(60), message: { model: 'claude-sonnet-5-5', content: [{ type: 'text', text: reply }], usage: { input_tokens: 52000 } } },
  ]
  const file = join(dir, `${id}.jsonl`)
  writeFileSync(file, rows.map(r => JSON.stringify(r)).join('\n') + '\n')
  if (agent) {
    mkdirSync(join(dir, id, 'subagents'), { recursive: true })
    writeFileSync(join(dir, id, 'subagents', `agent-${agent}.jsonl`), JSON.stringify({ type: 'user', timestamp: at(5), message: { content: 'look around' } }) + '\n')
  }
  const old = t / 1000
  utimesSync(file, old, old)
}

export const SESSIONS = {
  fix: 'aaaa0001-0000-4000-8000-000000000001',
  keys: 'aaaa0001-0000-4000-8000-000000000002',
  dark: 'bbbb0001-0000-4000-8000-000000000001',
  proof: 'cccc0001-0000-4000-8000-000000000001',
  faq: 'cccc0001-0000-4000-8000-000000000002',
}

export function makeAccount() {
  const home = mkdtempSync(join(tmpdir(), 'office-e2e-'))
  pastSession(home, 'payments', SESSIONS.fix, 3, 'Fix the double-charge race', '**Fixed.** The charge takes a lock first.', 'sub1')
  pastSession(home, 'payments', SESSIONS.keys, 26, 'Add idempotency keys', 'Done: every charge carries a key.')
  pastSession(home, 'dashboard', SESSIONS.dark, 5, 'Dark mode for the charts', 'The charts follow the theme now.')
  pastSession(home, 'docs', SESSIONS.proof, 8, 'Proofread the guide', 'Fixed 12 typos.')
  pastSession(home, 'docs', SESSIONS.faq, 9, 'Add a FAQ', 'Added a FAQ page.')
  const trust = Object.fromEntries(['payments', 'dashboard', 'docs'].map(p => [join(home, 'code', p), { hasTrustDialogAccepted: true }]))
  writeFileSync(join(home, '.claude', '.claude.json'), JSON.stringify({ projects: trust }))
  return home
}

// A bridge for `home`, on a free port. stop() ends it.
export async function startBridge(home, { demo = false } = {}) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const port = 7500 + Math.floor(Math.random() * 1500)
    const env = { ...process.env, HOME: home, USERPROFILE: home, CLAUDE_CONFIG_DIR: join(home, '.claude'), AGENT_OFFICE_CLAUDE: join(import.meta.dirname, 'fake-claude.mjs'), E2E_HOME: home, E2E_PORT: String(port) }
    const child = spawn(process.execPath, [join(ROOT, 'agent-office', 'server', 'server.mjs'), '--port', String(port), ...(demo ? ['--demo'] : [])], { env, stdio: ['ignore', 'ignore', 'inherit'] })
    const base = `http://127.0.0.1:${port}`
    for (let i = 0; i < 60; i++) {
      if (child.exitCode !== null) break
      const health = await fetch(`${base}/healthz`).then(r => r.json(), () => null)
      if (health?.pid === child.pid) {
        const secret = demo ? '' : readFileSync(join(home, '.claude', 'agent-office', 'secret'), 'utf8').trim()
        const key = secret && createHash('sha256').update(`${secret}:open`).digest('hex')
        return {
          base, port, home, secret,
          signIn: `${base}/?key=${key}`,
          // What a session of this account sends.
          report: events => fetch(`${base}/event`, { method: 'POST', headers: { 'x-agent-office-secret': secret }, body: JSON.stringify(events) }),
          calls: () => {
            try { return readFileSync(join(home, 'calls.log'), 'utf8').trim().split('\n').map(l => JSON.parse(l)).filter(c => c.args[0] !== 'agents' && c.args[0] !== '__run') } catch { return [] }
          },
          transcript: (project, id) => join(dirOf(home, join(home, 'code', project)), `${id}.jsonl`),
          stop: () => { child.kill(); return new Promise(r => child.exitCode !== null ? r() : child.once('exit', r)) },
        }
      }
      await new Promise(r => setTimeout(r, 100))
    }
    child.kill()
  }
  throw new Error('no bridge started')
}

export async function until(check, ms = 15000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try { if (await check()) return true } catch {}
    await new Promise(r => setTimeout(r, 200))
  }
  return false
}
