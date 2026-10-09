// Jobs started from the office's front desk. The page posts one (POST /jobs,
// behind the same guard and token as chat); the bridge starts it as a
// Claude Code background session in one of the projects the office already
// knows, the way you would yourself:
//
//   claude --bg -n "<title>" -- "<prompt>"     (in the project's folder)
//
// No permission flags are added, so the session runs under your own
// settings: anything that needs your OK waits for it, and you give it with
// `claude attach <id>` in a terminal. `claude --bg` also refuses a folder
// you've never trusted. The session's own plugin reports to the office like
// any other, so its critter walks in; the bridge only adds job.* events
// saying where each job is (from `claude agents --json`), and stops one on
// request (`claude stop <id>`), only ever one it started itself.

import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { realpath, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const MAX_PROMPT = 8000
const MAX_TITLE = 80
const KINDS = new Set(['write', 'research', 'fix', 'review', 'plan', 'other'])
const POLL_MS = 3000
const RUN_MS = 60000
const KEEP = 50

// What `claude` to run: AGENT_OFFICE_CLAUDE for tests and unusual installs.
const claudeBin = () => process.env.AGENT_OFFICE_CLAUDE || 'claude'

// The bridge may have been started from inside a session (the plugin's
// mod starts it), and these would make a new session think it's that one.
const INHERITED = ['CLAUDECODE', 'CLAUDE_CODE_SESSION_ID', 'CLAUDE_CODE_CHILD_SESSION', 'CLAUDE_PID', 'CLAUDE_CODE_ENTRYPOINT']
export function childEnv(env = process.env) {
  const out = { ...env }
  for (const k of INHERITED) delete out[k]
  return out
}

// The command that starts a job. Never a permission mode, never a bypass:
// the session asks you the way it always does.
export function startArgs({ title, prompt }) {
  return ['--bg', '-n', title, '--', prompt]
}

// `claude --bg` answers "backgrounded · 1a2b3c4d · <name>".
export function shortIdOf(output) {
  return /backgrounded\s*·\s*([0-9a-f]{6,16})\b/i.exec(output ?? '')?.[1]
}

// Plain words for why a job didn't start.
export function explain(output, code) {
  const text = String(output ?? '')
  if (/not trusted/i.test(text)) return 'Claude Code hasn’t been trusted in that folder yet. Open Claude Code there once, say yes to trusting it, then try again.'
  if (code === 'ENOENT') return 'Couldn’t find the claude command. Is Claude Code installed on this computer?'
  if (/log ?in|auth/i.test(text)) return 'Claude Code needs you to log in first. Run claude in a terminal once, then try again.'
  const line = text.split('\n').map(s => s.trim()).find(Boolean)
  return line ? `Claude Code said: ${line.slice(0, 200)}` : 'Claude Code didn’t start the job.'
}

// Where a background session is, from `claude agents --json`, in office words.
export function stateOf(entry) {
  if (!entry) return undefined
  if (entry.state === 'blocked' || /permission|approv/i.test(entry.waitingFor ?? '')) return 'blocked'
  if (entry.state === 'done' || entry.state === 'completed') return 'done'
  if (entry.state === 'stopped' || entry.state === 'killed') return 'stopped'
  if (entry.state === 'failed' || entry.state === 'error') return 'failed'
  // `status` flickers to idle while a session starts up, so `state` decides.
  return 'working'
}

// A request to start a job, checked, or the reason it can't be.
export function check(body) {
  const { dir, prompt, title, kind } = body ?? {}
  if (typeof dir !== 'string' || !dir) return { error: 'pick a project' }
  if (typeof prompt !== 'string' || !prompt.trim()) return { error: 'say what the job is' }
  if (prompt.length > MAX_PROMPT) return { error: `the job is longer than ${MAX_PROMPT} characters` }
  const name = (typeof title === 'string' && title.trim() ? title : prompt).replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE)
  return { dir, prompt: prompt.trim(), title: name, kind: KINDS.has(kind) ? kind : 'other' }
}

function run(args, { cwd, timeout = RUN_MS } = {}) {
  return new Promise(done => {
    let out = ''
    let child
    try {
      child = spawn(claudeBin(), args, { cwd, env: childEnv(), stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    } catch (err) {
      return done({ code: err.code ?? 1, out: String(err.message) })
    }
    const timer = setTimeout(() => child.kill(), timeout)
    child.stdout.on('data', d => { out += d })
    child.stderr.on('data', d => { out += d })
    child.on('error', err => { clearTimeout(timer); done({ code: err.code ?? 1, out: out || String(err.message) }) })
    child.on('close', code => { clearTimeout(timer); done({ code, out }) })
  })
}

export function createJobs({ publish, isKnown, demo }) {
  const jobs = new Map() // id -> { id, short?, session?, dir, title, kind, state, t }
  let poller = null

  const emit = (kind, job, extra = {}) => publish([{ t: Date.now(), kind, job: job.id, ...extra }])

  async function poll() {
    const live = [...jobs.values()].filter(j => j.short && !['done', 'stopped', 'failed'].includes(j.state))
    if (!live.length) { clearInterval(poller); poller = null; return }
    const { code, out } = await run(['agents', '--json', '--all'], { timeout: 15000 })
    if (code !== 0) return
    let list
    try { list = JSON.parse(out) } catch { return }
    for (const job of live) {
      const say = (...events) => publish(events.map(ev => ({ t: Date.now(), session: job.session, ...ev })))
      const entry = list.find(e => e.id === job.short || e.sessionId?.startsWith(job.short))
      const state = stateOf(entry)
      if (entry?.sessionId && !job.session) {
        job.session = entry.sessionId
        // A background session's own events reach the office in batches,
        // the first often only once its first turn ends, so say it has
        // started now: its critter walks in while it works. Its plugin's
        // own session.start fills in the rest when it arrives.
        say({ kind: 'session.start', cwd: job.dir, via: 'front-desk' }, { kind: 'turn.start', turnId: 'front-desk', text: job.prompt, via: 'front-desk' })
      }
      if (state && state !== job.state) {
        const was = job.state
        job.state = state
        emit('job.update', job, { state, session: job.session, waitingFor: entry.waitingFor })
        // Waiting for your OK shows as a question on its card, saying where
        // to answer it; the office can't answer it for you.
        if (state === 'blocked') {
          const question = `It needs your OK to go on. To see what, and answer, run claude attach ${job.short} in a terminal.`
          say({ kind: 'ask.open', id: `front-desk-${job.short}`, type: 'question', questions: [{ header: 'Your OK', question, options: [] }] })
        }
        else if (was === 'blocked') say({ kind: 'ask.close', id: `front-desk-${job.short}`, answer: 'Answered' })
        if (state === 'done' && !job.answered) {
          job.answered = true
          say({ kind: 'turn.complete', turnId: 'front-desk', reason: 'answer' })
        }
        if (state === 'stopped' || state === 'failed') say({ kind: 'session.end', reason: state })
      }
    }
  }

  const watch = () => { poller ??= setInterval(poll, POLL_MS) }

  async function start(body) {
    const req = check(body)
    if (req.error) return { status: 400, error: req.error }
    // Only a folder the office has already seen a session in.
    let dir = req.dir
    if (!demo) {
      try {
        dir = await realpath(resolve(req.dir))
        if (!(await stat(dir)).isDirectory()) throw new Error()
      } catch {
        return { status: 400, error: 'that project folder isn’t there any more' }
      }
    }
    if (!(await isKnown(req.dir)) && !(await isKnown(dir))) return { status: 403, error: 'the office only starts jobs in projects it already knows' }
    const job = { id: randomUUID(), dir: req.dir, title: req.title, kind: req.kind, prompt: req.prompt, state: 'starting', t: Date.now() }
    jobs.set(job.id, job)
    if (jobs.size > KEEP) jobs.delete(jobs.keys().next().value)
    emit('job.start', job, { dir: job.dir, title: job.title, type: job.kind, prompt: req.prompt, ...(demo && { demo: true }) })
    if (demo) {
      // Demo only: no Claude Code behind a demo bridge, so a sample session
      // takes the job instead.
      demo(job, req.prompt, update => { Object.assign(job, update); emit('job.update', job, update) })
      return { status: 200, job: { id: job.id } }
    }
    const { code, out } = await run(startArgs(req), { cwd: dir })
    const short = code === 0 ? shortIdOf(out) : undefined
    if (!short) {
      job.state = 'failed'
      emit('job.update', job, { state: 'failed', error: explain(out, code) })
      return { status: 502, error: explain(out, code) }
    }
    job.short = short
    job.state = 'working'
    emit('job.update', job, { state: 'working', short })
    watch()
    void poll()
    return { status: 200, job: { id: job.id, short } }
  }

  async function stop(body) {
    const job = jobs.get(body?.id)
    if (!job) return { status: 404, error: 'no such job' }
    if (demo) {
      job.state = 'stopped'
      emit('job.update', job, { state: 'stopped' })
      return { status: 200 }
    }
    if (!job.short) return { status: 409, error: 'it hasn’t started yet' }
    const { code, out } = await run(['stop', job.short], { timeout: 20000 })
    if (code !== 0 && !/not running|already|no job matching/i.test(out)) return { status: 502, error: explain(out, code) }
    job.state = 'stopped'
    emit('job.update', job, { state: 'stopped' })
    if (job.session) publish([{ t: Date.now(), kind: 'session.end', session: job.session, reason: 'stopped' }])
    return { status: 200 }
  }

  return { start, stop, jobs }
}
