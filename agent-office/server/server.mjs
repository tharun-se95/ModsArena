#!/usr/bin/env node
// Agent Office bridge: takes events from Claude Code, streams them to the
// office page over Server-Sent Events. Node built-ins only, no install step.
//
//   node server.mjs [--port 7337] [--demo] [--history-days 14] [--managed] [--replace]
//
//   --managed   started by the plugin's mod, which may replace it after an update
//   --replace   take over the port from a managed bridge already holding it
//   --restart   with --replace: take over from whatever Agent Office bridge
//               holds it, however it was started (/office run again)
//   --background  run detached from whatever started it (the plugin's mod,
//               whose children end with the session), logging to
//               ~/.claude/agent-office/bridge.log, and stop after a while
//               with nobody watching and nothing reporting
//
//   POST /event    one event or an array (mod schema or classic hook stdin)
//   GET  /stream   SSE: replays what places each thread, the recent log and
//                  gauges, then every new event
//   GET  /history  past sessions read from ~/.claude/projects transcripts
//   GET  /healthz  liveness probe the mod uses before spawning a bridge, with
//                  this bridge's version, so a newer mod can replace it
//   POST /shutdown a newer bridge taking over the port: managed bridges, or
//                  any when /office asks for a restart; hands over the log
//   GET  /transcript?session=&agent=&after=   a conversation, read from its transcript
//   GET  /asset?session=&id=   a picture a session made or read, by the path its event named
//   POST /chat     a message for a session or subagent (the office page only)
//   POST /jobs     start a job from the front desk, in a project the office
//                  knows (the office page only; see jobs.mjs)
//   POST /jobs/stop   stop a job the front desk started (the office page only)
//   POST /resume   talk to a session that has ended: picks it up again in the
//                  background with your message (the office page only)
//   POST /projects open or make a project folder for a first job, saying
//                  whether Claude Code trusts it (the office page only)
//   GET  /agent-types?dir=   the custom agent types a project can use
//   POST /agent-types   write a new one (the office page only; manage.mjs)
//   POST /delete   delete a session's (or a project's) transcripts for good
//                  (the office page only)
//   GET  /inbox?session=   a session's mod picking up its messages
//   POST /stop     stop the turn a session is running (the office page only; its mod does it)
//   POST /answer   an answer to a question or plan a session is holding (the office page only)
//   GET  /answer/wait?session=&id=   that session's mod waiting for one (asks.mjs)
//   POST /auto-update   turn the plugin's auto-update on or off (the office
//                  page only; see autoupdate.mjs). /healthz says where it stands.
//   GET  /         the office
//
// Every request must be addressed to the bridge itself, and chat needs the
// token only the office page gets (guard.mjs says why), and so do jobs.

import { createServer } from 'node:http'
import { readFileSync, openSync, statSync, renameSync, mkdirSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, dirname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize, GAUGES, gaugeKey } from './normalize.mjs'
import { findProject } from './projects.mjs'
import { readHistory, tailContext, summarizeTranscript } from './history.mjs'
import { startDemo, demoJob, answerDemo, stopDemo } from './demo.mjs'
import { refusal, newToken, tokenMatches, TOKEN_HEADER, INBOX_HEADER, CONTROL_HEADER } from './guard.mjs'
import * as chat from './chat.mjs'
import { createJobs } from './jobs.mjs'
import * as asks from './asks.mjs'
import { findTranscript, readTranscript, forget } from './transcript.mjs'
import { openProject, writeAgent, listAgents, removeTranscript } from './manage.mjs'
import { isEngineNote } from './prompts.mjs'
import * as autoUpdate from './autoupdate.mjs'
import { RESTART_HEADER, stopOldBridge } from './restart.mjs'
import { loadSecret, proof, openKey, cookieValue, cookieOf, same, SECRET_HEADER, COOKIE, officeDir } from './secret.mjs'

const args = process.argv.slice(2)
const flag = name => args.includes(`--${name}`)
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const PORT = Number(option('port', process.env.AGENT_OFFICE_PORT ?? 7337))
const HOST = option('host', '127.0.0.1')
// Only ever on this computer: the page's token is in its HTML, and on any
// other address anyone who can reach the port could read it and start jobs.
const LOOPBACK = new Set(['127.0.0.1', '::1', 'localhost'])
if (!LOOPBACK.has(HOST)) {
  console.error(`[agent-office] --host ${HOST} refused: the office only listens on this computer (127.0.0.1, ::1 or localhost).`)
  process.exit(2)
}
const HISTORY_DAYS = Number(option('history-days', 14))
const LOG_LIMIT = 8000
// A fresh secret each run, handed to the office page in its HTML.
const TOKEN = newToken()
// This account's secret (secret.mjs): your sessions send it, the bridge
// proves it knows it, and the office page opens with a key made from it.
const SECRET = loadSecret()
const OPEN_KEY = openKey(SECRET)
const COOKIE_VALUE = cookieValue(SECRET)
const MAX_BODY = 1024 * 1024
const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(HERE, 'public')
// The plugin version this bridge is from, so a mod from a newer one can tell
// it's stale: the bridge outlives the session that started it, and an update
// leaves it serving the old page from the old copy.
const VERSION = (() => {
  try {
    return JSON.parse(readFileSync(join(HERE, '..', '.claude-plugin', 'plugin.json'), 'utf8')).version
  } catch {
    return undefined
  }
})()
const MANAGED = flag('managed')
const REPLACE_MS = 5000
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

// Pictures sessions made or read: `${session}|${id}` -> the file. Only
// these paths are ever served, and only as images (see /asset).
const pictures = new Map()
const PICTURE_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' }
const PICTURE_LIMIT = 20 * 1024 * 1024
const PICTURES_KEEP = 500

// Events in order, plus the newest reading of each gauge, which would
// otherwise crowd everything else out of the log.
const log = []
const gauges = new Map()
const clients = new Set()

// What places each thread in the office: its start (project, so its room),
// its first prompt (its name), the coordinator's marker, its end, and the
// agents and questions still open. Kept outside the log like the gauges, so
// a page opened on a long-running bridge still finds every thread in its
// room once the log has moved on. session -> { events: Map, endedAt? }
const anchors = new Map()
const ANCHOR_SESSIONS = 500
const ANCHORS_PER_SESSION = 64
const ANCHOR_ENDED_MS = 6 * 60 * 60 * 1000 // /history has it after that

function anchorKey(ev) {
  switch (ev.kind) {
    case 'session.start': return 'start'
    case 'session.thread': return 'thread'
    case 'session.end': return 'end'
    case 'turn.start': return !ev.agent && typeof ev.text === 'string' && !isEngineNote(ev.text) ? 'prompt' : undefined
    case 'agent.spawn': return `agent|${ev.agent}`
    case 'ask.open': return `ask|${ev.id}`
  }
}

function anchor(ev) {
  if (typeof ev.session !== 'string') return
  if (ev.kind === 'agent.end') return void anchors.get(ev.session)?.events.delete(`agent|${ev.agent}`)
  if (ev.kind === 'ask.close') return void anchors.get(ev.session)?.events.delete(`ask|${ev.id}`)
  const key = anchorKey(ev)
  if (!key) return
  let a = anchors.get(ev.session)
  if (!a) anchors.set(ev.session, (a = { events: new Map() }))
  // Only the first prompt names a thread.
  if (key === 'prompt' && a.events.has('prompt')) return
  if (key === 'start') {
    // Resumed: it is live again.
    a.events.delete('end')
    a.endedAt = undefined
  }
  if (key === 'end') a.endedAt = Date.now()
  a.events.set(key, ev)
  if (a.events.size > ANCHORS_PER_SESSION) {
    const oldest = [...a.events.keys()].find(k => k.includes('|'))
    if (oldest) a.events.delete(oldest)
  }
}

function pruneAnchors(now = Date.now()) {
  for (const [session, a] of anchors) if (a.endedAt && now - a.endedAt > ANCHOR_ENDED_MS) anchors.delete(session)
  // Too many: ended threads go first, then the longest-known ones.
  while (anchors.size > ANCHOR_SESSIONS) {
    const ended = [...anchors].find(([, a]) => a.endedAt)
    anchors.delete(ended ? ended[0] : anchors.keys().next().value)
  }
}

// What a fresh page is sent: the anchors the log no longer holds, oldest
// first, then the log, then the gauges.
function replay() {
  const inLog = new Set(log)
  const kept = [...anchors.values()].flatMap(a => [...a.events.values()]).filter(ev => !inLog.has(ev)).sort((a, b) => a.t - b.t)
  return [...kept, ...log, ...gauges.values()]
}

// The bridge names projects itself, so live and past sessions of one
// repository land in one room whatever the producer called it.
function enrich(ev) {
  if (ev.kind !== 'session.start') return ev
  const found = findProject(ev.project?.id ?? ev.cwd)
  // Keep a producer's name when this machine knows no repository there.
  if (!ev.project || found.remote) ev.project = found
  return ev
}

// Folders the office has seen sessions in: the only places the front desk
// starts jobs.
const knownDirs = new Set()
const know = (...dirs) => dirs.forEach(d => typeof d === 'string' && isAbsolute(d) && knownDirs.add(d))
// Folders you opened as new projects from the front desk.
const newDirs = new Set()
async function isKnown(dir) {
  if (knownDirs.has(dir) || newDirs.has(dir)) return true
  // Past sessions count too; read them once, on demand.
  try {
    for (const s of await readHistory({ days: HISTORY_DAYS })) know(s.cwd, s.project?.id)
  } catch {}
  return knownDirs.has(dir)
}
// Demo-only: the sample office keeps its auto-update switch in memory, so
// trying the toggle never writes to your Claude Code settings.
let demoAutoUpdate = { state: 'off', pending: false }
const updates = () => (flag('demo') ? demoAutoUpdate : autoUpdate.brief(autoUpdate.read()))

const jobs = createJobs({ publish: events => publish(events), isKnown, demo: flag('demo') ? demoJob() : undefined })

// The folder a session ran in, from its transcript, for resuming it.
async function sessionFolder(session) {
  const path = await findTranscript(session)
  return path ? (await summarizeTranscript(path).catch(() => null))?.cwd : undefined
}

// Deleting for good. A session still open in Claude Code (live here, its
// transcript written lately) is left alone; one the front desk started or
// picked up in the background is stopped first.
const LATELY_MS = 20 * 60 * 1000
async function isOpenElsewhere(session) {
  const a = anchors.get(session)
  if (!a || a.endedAt) return false
  const path = await findTranscript(session)
  const info = path && await stat(path).catch(() => null)
  return !info || Date.now() - info.mtimeMs < LATELY_MS
}

function purge(session, agent) {
  const mine = ev => ev.session === session && (agent === undefined || ev.agent === agent)
  for (let i = log.length - 1; i >= 0; i--) if (mine(log[i])) log.splice(i, 1)
  for (const [k, ev] of gauges) if (mine(ev)) gauges.delete(k)
  if (agent === undefined) anchors.delete(session)
  else anchors.get(session)?.events.delete(`agent|${agent}`)
}

async function deleteSession(session) {
  // One the front desk runs in the background (working, or done and idle)
  // is the office's own to stop; any other still open is yours.
  const job = jobs.jobOf(session)
  if (job) {
    if (!['stopped', 'failed'].includes(job.state)) await jobs.stop({ id: job.id })
  } else if (await isOpenElsewhere(session)) return { status: 409, error: 'it’s still open in Claude Code. End it there first (/exit), then delete it' }
  const path = await findTranscript(session)
  const removed = flag('demo') ? [] : path ? await removeTranscript(path) : []
  forget(session)
  purge(session)
  publish([{ t: Date.now(), kind: 'session.removed', session }])
  return { removed: removed.length }
}

async function deleteForGood(body) {
  const { session, agent, project } = body ?? {}
  const ID = /^[\w-]{1,100}$/
  if (typeof project === 'string' && project) {
    // Every transcript of the project's sessions; never the project's own files.
    const sessions = new Set((await readHistory({ days: 36500, perProject: Infinity })).filter(s => s.project?.id === project).map(s => s.session))
    for (const [id, a] of anchors) if (a.events.get('start')?.project?.id === project) sessions.add(id)
    let removed = 0
    const kept = []
    for (const id of sessions) {
      const out = await deleteSession(id)
      if (out.error) kept.push(id)
      else removed++
    }
    return { sessions: removed, kept: kept.length }
  }
  if (typeof session !== 'string' || !ID.test(session)) return { status: 400, error: 'which session?' }
  if (agent !== undefined) {
    if (typeof agent !== 'string' || !ID.test(agent)) return { status: 400, error: 'which agent?' }
    const path = flag('demo') ? null : await findTranscript(session, agent)
    const removed = path ? await removeTranscript(path, { session: false }) : []
    purge(session, agent)
    publish([{ t: Date.now(), kind: 'agent.removed', session, agent }])
    return { removed: removed.length }
  }
  return deleteSession(session)
}

function publish(events) {
  busy()
  for (const raw of events) {
    const ev = enrich(raw)
    if (ev.kind === 'session.start') know(ev.cwd, ev.project?.id)
    if (ev.kind === 'chat.delivered') chat.settle(ev.id, ev.ok !== false)
    if (ev.kind === 'ask.open' || ev.kind === 'ask.close') asks.track(ev)
    if (ev.kind === 'asset.add' && ev.type === 'image' && typeof ev.path === 'string' && isAbsolute(ev.path)) {
      pictures.set(`${ev.session}|${ev.id}`, ev.path)
      if (pictures.size > PICTURES_KEEP) pictures.delete(pictures.keys().next().value)
    }
    if (GAUGES.has(ev.kind)) gauges.set(gaugeKey(ev), ev)
    else log.push(ev)
    anchor(ev)
    // A finished agent's last reading has nothing left to show.
    if (ev.kind === 'agent.end') gauges.delete(gaugeKey({ kind: 'agent.context', session: ev.session, agent: ev.agent }))
    const frame = `data: ${JSON.stringify(ev)}\n\n`
    for (const res of clients) res.write(frame)
  }
  if (log.length > LOG_LIMIT) log.splice(0, log.length - LOG_LIMIT)
  pruneAnchors()
}

// Settings hooks carry no context figures, but they name the transcript.
async function contextFromTranscript(payloads) {
  for (const p of Array.isArray(payloads) ? payloads : [payloads]) {
    if (p?.hook_event_name !== 'Stop' || !p.transcript_path) continue
    const context = await tailContext(p.transcript_path)
    if (context) publish([{ t: Date.now(), kind: 'agent.context', session: String(p.session_id), ...context }])
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', chunk => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('body too large'))
        req.destroy()
      } else chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

// The page runs only its own script, can't be framed by another page (a
// click there could start a job or delete something), and reaches only
// this bridge, so nothing a reply says can run or phone home.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "object-src 'none'",
].join('; ')
const PAGE_HEADERS = {
  'content-security-policy': CSP,
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
}

const SESSION_ROUTES = new Set(['POST /event', 'GET /inbox', 'GET /answer/wait', 'POST /shutdown'])
const OPEN_ROUTES = new Set(['GET /healthz'])
const STATIC = /^\/(fonts\/)?[\w.-]+\.(js|css|svg|png|ico|woff2?)$/

export function routeOwner(method, pathname) {
  const route = `${method} ${pathname}`
  if (SESSION_ROUTES.has(route)) return 'session'
  if (OPEN_ROUTES.has(route) || (method === 'GET' && STATIC.test(pathname))) return 'anyone'
  return 'page'
}

// The demo has nothing of yours in it, so it needs no key.
const isSignedIn = req => flag('demo') || same(cookieOf(req.headers.cookie), COOKIE_VALUE)

// Opening the office: with the key (/office and the CLI put it in the URL)
// the browser gets a cookie only this bridge reads, then the plain address;
// without it, a page saying how to open it.
function signIn(req, res, searchParams) {
  if (same(searchParams.get('key'), OPEN_KEY)) {
    res.writeHead(303, {
      location: '/',
      'set-cookie': `${COOKIE}=${COOKIE_VALUE}; HttpOnly; SameSite=Strict; Path=/; Max-Age=31536000`,
      'cache-control': 'no-store',
    })
    return res.end()
  }
  res.writeHead(401, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...PAGE_HEADERS })
  res.end(LOCKED_PAGE)
}

const LOCKED_PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent Office</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:34em;margin:12vh auto;padding:0 20px;color:#2b2a2e;background:#f6f1e8}h1{font-size:22px}code{background:#e9e2d4;padding:2px 6px;border-radius:5px}</style>
<h1>Open the office from Claude Code</h1>
<p>Agent Office shows your own sessions, so it opens with a key only your account has. Run <code>/office</code> in Claude Code (or <code>npx github:tharun-se95/ModsArena</code>) and it opens here, signed in.</p>
<p>After that, this browser stays signed in.</p>`

async function serveStatic(res, pathname) {
  const rel = pathname === '/' ? 'index.html' : pathname.slice(1)
  if (rel.includes('..')) return void res.writeHead(400).end()
  try {
    let body = await readFile(join(PUBLIC, rel))
    // The page gets this run's chat token; no other origin can read it.
    if (rel === 'index.html') body = body.toString('utf8').replace('<meta name="agent-office-token" content="">', `<meta name="agent-office-token" content="${TOKEN}">`)
    // No caching: after a pull, a refresh always shows the current build.
    res.writeHead(200, { 'content-type': TYPES[extname(rel)] ?? 'application/octet-stream', 'cache-control': 'no-store', ...(rel.endsWith('.html') && PAGE_HEADERS) })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
}

const json = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

// One bad request never takes the office down: anything a route throws is
// answered with an error, and the bridge keeps serving.
const server = createServer((req, res) => {
  handle(req, res).catch(err => {
    console.error('[agent-office] request failed:', err?.message ?? err)
    if (!res.headersSent) json(res, 500, { error: 'something went wrong in the bridge' })
    else res.end()
  })
})

async function handle(req, res) {
  let url
  try {
    url = new URL(req.url, 'http://localhost')
  } catch {
    return json(res, 400, { error: 'bad request' })
  }
  const { pathname, searchParams } = url
  const refused = refusal(req, PORT)
  if (refused) return json(res, 403, { error: refused })

  // Who may use this route (one place, so it can be checked at a glance):
  //   your sessions (the secret, as a header): reporting and their inbox;
  //   the office page (its cookie): the page itself and everything it reads
  //     and does; what it changes also needs this run's token (each route);
  //   anyone on this computer: /healthz, and the page's script and images.
  const who = routeOwner(req.method, pathname)
  if (who === 'session' && !same(req.headers[SECRET_HEADER], SECRET)) return json(res, 401, { error: 'not one of your sessions' })
  if (who === 'page' && !isSignedIn(req)) {
    if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) return signIn(req, res, searchParams)
    return json(res, 401, { error: 'open the office with /office (or the CLI) to sign in' })
  }

  // The office page asks again for this run's token after the bridge
  // restarted (api.js). Only a signed-in page reaches here, and only the
  // page's own origin can read the answer.
  if (req.method === 'GET' && pathname === '/token') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
    return res.end(JSON.stringify({ token: TOKEN }))
  }

  if (req.method === 'POST' && pathname === '/chat') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const sent = chat.send(JSON.parse(await readBody(req)))
      if (sent.error) return json(res, 400, { error: sent.error })
      const { id, session, agent, text, t } = sent.message
      publish([{ t, kind: 'chat.sent', session, ...(agent ? { agent } : {}), id, text }])
      json(res, 200, { id })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'POST' && (pathname === '/jobs' || pathname === '/jobs/stop')) {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const body = JSON.parse(await readBody(req))
      const { status, error, job } = await (pathname === '/jobs' ? jobs.start(body) : jobs.stop(body))
      json(res, status, error ? { error } : { ok: true, ...(job && { job }) })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'POST' && pathname === '/resume') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const body = JSON.parse(await readBody(req))
      const { status, error, job } = await jobs.resume(body, sessionFolder)
      json(res, status, error ? { error } : { ok: true, ...(job && { job }) })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'POST' && pathname === '/projects') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const body = JSON.parse(await readBody(req))
      if (flag('demo')) return json(res, 200, { ok: true, dir: String(body?.path ?? ''), created: false, trusted: true, demo: true })
      const out = await openProject({ path: body?.path, create: body?.create === true })
      if (out.error) return json(res, out.status, { error: out.error })
      newDirs.add(out.dir)
      json(res, 200, { ok: true, ...out })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'GET' && pathname === '/agent-types') {
    const dir = searchParams.get('dir') ?? ''
    json(res, 200, { types: await listAgents(dir && (await isKnown(dir)) ? dir : undefined) })
    return
  }

  if (req.method === 'POST' && pathname === '/agent-types') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const body = JSON.parse(await readBody(req))
      const dir = typeof body?.dir === 'string' ? body.dir : ''
      if (body?.scope !== 'user' && !(dir && await isKnown(dir))) return json(res, 403, { error: 'the office only adds agents to projects it knows' })
      if (flag('demo')) return json(res, 200, { ok: true, name: body?.name, demo: true })
      const out = await writeAgent(body, { dir })
      json(res, out.status, out.error ? { error: out.error } : { ok: true, name: out.name, path: out.path, scope: out.scope })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'POST' && pathname === '/delete') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const out = await deleteForGood(JSON.parse(await readBody(req)))
      json(res, out.status ?? 200, out.error ? { error: out.error } : { ok: true, ...out })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'GET' && pathname === '/inbox') {
    // A custom header: a web page can't send it to another origin unasked.
    if (req.headers[INBOX_HEADER] !== '1') return json(res, 403, { error: 'missing inbox header' })
    json(res, 200, { messages: chat.take(searchParams.get('session') ?? '') })
    return
  }

  // Stopping a turn: a message of its own kind, through the same inbox.
  if (req.method === 'POST' && pathname === '/stop') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const body = JSON.parse(await readBody(req))
      const sent = chat.send({ session: body?.session, action: 'stop' })
      if (sent.error) return json(res, 400, { error: sent.error })
      const { id, session, t } = sent.message
      publish([{ t, kind: 'stop.sent', session, id }])
      // Demo-only: the sample session stops itself.
      if (flag('demo')) stopDemo(session)
      json(res, 200, { id })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  // Answering from the office: guarded like chat, since it speaks for you.
  if (req.method === 'POST' && pathname === '/answer') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const body = JSON.parse(await readBody(req))
      // Demo-only: the sample sessions also take a permission or a plan
      // approval, which a real session's mod can't.
      if (flag('demo') && typeof body?.say === 'string') {
        const isTaken = answerDemo(body.session, body.id, body.say.slice(0, 200))
        return json(res, isTaken ? 200 : 404, isTaken ? { ok: true } : { error: 'that question has moved on' })
      }
      const { status, error, answer } = asks.answer(body)
      if (flag('demo') && answer) answerDemo(body.session, body.id, asks.line(answer))
      json(res, status, error ? { error } : { ok: true, answer })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  // Auto-update: guarded like chat, since it writes to your settings.
  if (req.method === 'POST' && pathname === '/auto-update') {
    if (!tokenMatches(req.headers[TOKEN_HEADER], TOKEN)) return json(res, 403, { error: 'missing or wrong token' })
    try {
      const body = JSON.parse(await readBody(req))
      if (typeof body?.on !== 'boolean') return json(res, 400, { error: 'say on: true or false' })
      if (flag('demo')) {
        demoAutoUpdate = { state: body.on ? 'on' : 'off', pending: true }
        return json(res, 200, { ok: true, autoUpdate: demoAutoUpdate })
      }
      const result = autoUpdate.set(body.on)
      json(res, result.state === 'missing' ? 409 : 200, { ok: result.state !== 'missing', autoUpdate: autoUpdate.brief(result), text: autoUpdate.describe(result) })
    } catch (err) {
      json(res, 400, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'GET' && pathname === '/answer/wait') {
    if (req.headers[INBOX_HEADER] !== '1') return json(res, 403, { error: 'missing inbox header' })
    json(res, 200, await asks.wait(searchParams.get('session') ?? '', searchParams.get('id') ?? ''))
    return
  }

  if (req.method === 'GET' && pathname === '/transcript') {
    const path = await findTranscript(searchParams.get('session') ?? '', searchParams.get('agent') ?? undefined)
    if (!path) return json(res, 404, { error: 'no transcript for that session yet' })
    try {
      const after = searchParams.has('after') ? Number(searchParams.get('after')) : undefined
      json(res, 200, await readTranscript(path, after))
    } catch (err) {
      json(res, 500, { error: String(err.message ?? err) })
    }
    return
  }

  if (req.method === 'GET' && pathname === '/asset') {
    const path = pictures.get(`${searchParams.get('session')}|${searchParams.get('id')}`)
    const type = path && PICTURE_TYPES[extname(path).toLowerCase()]
    if (!type) return json(res, 404, { error: 'no such picture' })
    try {
      const info = await stat(path)
      if (!info.isFile() || info.size > PICTURE_LIMIT) return json(res, 404, { error: 'no such picture' })
      // Shown in an <img> only: an SVG opened on its own runs nothing here.
      res.writeHead(200, {
        'content-type': type,
        'cache-control': 'private, max-age=60',
        'x-content-type-options': 'nosniff',
        'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      })
      res.end(await readFile(path))
    } catch {
      json(res, 404, { error: 'no such picture' })
    }
    return
  }

  if (req.method === 'POST' && pathname === '/event') {
    try {
      const payload = JSON.parse(await readBody(req))
      const events = normalize(payload)
      publish(events)
      json(res, 200, { accepted: events.length })
      void contextFromTranscript(payload)
    } catch (err) {
      res.writeHead(400).end(String(err.message ?? err))
    }
    return
  }

  if (req.method === 'GET' && pathname === '/stream') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    })
    res.write(`event: replay\ndata: ${JSON.stringify(replay())}\n\n`)
    clients.add(res)
    busy()
    const ping = setInterval(() => res.write(': ping\n\n'), 15000)
    req.on('close', () => {
      clearInterval(ping)
      clients.delete(res)
    })
    return
  }

  if (req.method === 'GET' && pathname === '/history') {
    try {
      const days = Number(searchParams.get('days') ?? HISTORY_DAYS)
      json(res, 200, { sessions: await readHistory({ days }) })
    } catch (err) {
      json(res, 500, { error: String(err.message ?? err) })
    }
    return
  }

  if (pathname === '/healthz') {
    const nonce = searchParams.get('nonce')
    // Proof it knows this account's secret, so a session never reports to
    // another account's program on the port.
    json(res, 200, { ok: true, name: 'agent-office', ...(nonce && nonce.length <= 200 && { proof: proof(SECRET, nonce) }), version: VERSION, managed: MANAGED, pid: process.pid, demo: flag('demo'), chat: true, jobs: true, answers: true, resume: true, manage: true, autoUpdate: updates(), events: log.length, viewers: clients.size })
    return
  }

  if (req.method === 'POST' && pathname === '/shutdown') {
    // A custom header: a web page can't send it to another origin unasked.
    if (req.headers[CONTROL_HEADER] !== '1') return json(res, 403, { error: 'missing control header' })
    // One you started yourself (npx, node server.mjs) stays yours to stop,
    // unless you ran /office again, which asks for a restart.
    if (!MANAGED && req.headers[RESTART_HEADER] !== '1') return json(res, 409, { error: 'not started by the plugin' })
    // The live picture goes to the bridge taking over, so nothing resets.
    json(res, 200, { ok: true, events: replay() })
    console.log('[agent-office] stepping down for a newer bridge')
    for (const client of clients) client.end()
    // Closing stops listening at once; open connections get a moment to end.
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 1000).unref()
    return
  }

  if (req.method === 'GET') return serveStatic(res, pathname)
  res.writeHead(405).end()
}

// Last resort: log it and keep serving every session's office.
process.on('unhandledRejection', err => console.error('[agent-office] unhandled:', err?.stack ?? err))
process.on('uncaughtException', err => console.error('[agent-office] uncaught:', err?.stack ?? err))

let replaceUntil = 0

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    // Taking over: the old bridge is stepping down, so try again shortly.
    if (Date.now() < replaceUntil) return void setTimeout(() => server.listen(PORT, HOST), 50)
    // Another session's bridge already holds the port: that one serves us too.
    console.error(`[agent-office] port ${PORT} in use, assuming a bridge is already running`)
    process.exit(0)
  }
  // It couldn't listen at all: say why in plain words and stop.
  const why = err.code === 'EACCES' ? `this computer won't let it use port ${PORT} (try another with --port)` : err.message
  console.error(`[agent-office] couldn't start the office: ${why}`)
  process.exit(1)
})

server.on('listening', () => {
  console.log(`[agent-office] office on http://${HOST}:${PORT}${VERSION ? ` (${VERSION})` : ''}`)
  if (flag('demo')) startDemo(publish)
})

// Ask the bridge on the port to step down. This process is already running,
// so it gets the port before the old bridge's own session can start that one
// again.
// With --restart it takes over from any Agent Office bridge: one that
// can't step down (an older version, or one you started yourself before
// this could ask) is stopped (restart.mjs). Returns the events it hands over.
async function askToStepDown() {
  const restart = flag('restart')
  let pid
  try {
    const was = await fetch(`http://127.0.0.1:${PORT}/healthz`, { signal: AbortSignal.timeout(1500) }).then(r => r.json()).catch(() => null)
    pid = was?.pid
    const res = await fetch(`http://127.0.0.1:${PORT}/shutdown`, { method: 'POST', headers: { [CONTROL_HEADER]: '1', [SECRET_HEADER]: SECRET, ...(restart && { [RESTART_HEADER]: '1' }) } })
    if (res.ok) {
      replaceUntil = Date.now() + REPLACE_MS
      const body = await res.json().catch(() => ({}))
      return Array.isArray(body.events) ? body.events : []
    }
  } catch {
    // Nothing answers: the port is free, or held by something that isn't a bridge.
  }
  if (restart && await stopOldBridge(PORT, pid)) {
    console.log('[agent-office] stopped the older bridge on the port')
    replaceUntil = Date.now() + REPLACE_MS
  }
  return []
}

// ---------------------------------------------------------------------------
// Running in the background. The mod's children end when its session does,
// which took the office down with whichever session happened to start it.
// With --background this process starts the real bridge detached, its
// output in a log, and exits; that bridge runs until it's been idle a while.

const LOG_LIMIT_BYTES = 1024 * 1024
const IDLE_MS = Number(process.env.AGENT_OFFICE_IDLE_MS ?? 30 * 60 * 1000)

function logFile() {
  const dir = officeDir()
  mkdirSync(dir, { recursive: true, mode: 0o700 })
  const file = join(dir, 'bridge.log')
  // One older log is kept, so it never grows past about 2 MB.
  try { if (statSync(file).size > LOG_LIMIT_BYTES) renameSync(file, `${file}.1`) } catch {}
  return file
}

if (flag('background') && !flag('detached')) {
  const file = logFile()
  const out = openSync(file, 'a', 0o600)
  const argv = process.argv.slice(1).filter(a => a !== '--background')
  const child = spawn(process.execPath, [...argv, '--detached'], { detached: true, stdio: ['ignore', out, out], windowsHide: true, env: process.env })
  child.unref()
  console.log(`[agent-office] the office runs in the background (pid ${child.pid}); its log is ${file}`)
  process.exit(0)
}

let lastActivity = Date.now()
const busy = () => { lastActivity = Date.now() }
if (flag('detached')) {
  setInterval(() => {
    if (clients.size === 0 && Date.now() - lastActivity > IDLE_MS && !jobs.anyLive()) {
      console.log(`[agent-office] nobody watching and nothing reporting for ${Math.round(IDLE_MS / 60000)} minutes; stopping`)
      process.exit(0)
    }
  }, Math.min(60000, IDLE_MS)).unref()
}

if (flag('replace')) {
  const handed = await askToStepDown()
  if (handed.length) publish(handed)
}
server.listen(PORT, HOST)
