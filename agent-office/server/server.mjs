#!/usr/bin/env node
// Agent Office bridge: takes events from Claude Code, streams them to the
// office page over Server-Sent Events. Node built-ins only, no install step.
//
//   node server.mjs [--port 7337] [--demo] [--history-days 14] [--managed] [--replace]
//
//   --managed   started by the plugin's mod, which may replace it after an update
//   --replace   take over the port from a managed bridge already holding it
//
//   POST /event    one event or an array (mod schema or classic hook stdin)
//   GET  /stream   SSE: replays the recent log and gauges, then every new event
//   GET  /history  past sessions read from ~/.claude/projects transcripts
//   GET  /healthz  liveness probe the mod uses before spawning a bridge, with
//                  this bridge's version, so a newer mod can replace it
//   POST /shutdown a newer bridge taking over the port (managed bridges only)
//   GET  /transcript?session=&agent=&after=   a conversation, read from its transcript
//   GET  /asset?session=&id=   a picture a session made or read, by the path its event named
//   POST /chat     a message for a session or subagent (the office page only)
//   POST /jobs     start a job from the front desk, in a project the office
//                  knows (the office page only; see jobs.mjs)
//   POST /jobs/stop   stop a job the front desk started (the office page only)
//   GET  /inbox?session=   a session's mod picking up its messages
//   GET  /         the office
//
// Every request must be addressed to the bridge itself, and chat needs the
// token only the office page gets (guard.mjs says why), and so do jobs.

import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, dirname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize, GAUGES, gaugeKey } from './normalize.mjs'
import { findProject } from './projects.mjs'
import { readHistory, tailContext } from './history.mjs'
import { startDemo, demoJob } from './demo.mjs'
import { refusal, newToken, tokenMatches, TOKEN_HEADER, INBOX_HEADER, CONTROL_HEADER } from './guard.mjs'
import * as chat from './chat.mjs'
import { createJobs } from './jobs.mjs'
import { findTranscript, readTranscript } from './transcript.mjs'

const args = process.argv.slice(2)
const flag = name => args.includes(`--${name}`)
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const PORT = Number(option('port', process.env.AGENT_OFFICE_PORT ?? 7337))
const HOST = option('host', '127.0.0.1')
const HISTORY_DAYS = Number(option('history-days', 14))
const LOG_LIMIT = 8000
// A fresh secret each run, handed to the office page in its HTML.
const TOKEN = newToken()
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
async function isKnown(dir) {
  if (knownDirs.has(dir)) return true
  // Past sessions count too; read them once, on demand.
  try {
    for (const s of await readHistory({ days: HISTORY_DAYS })) know(s.cwd, s.project?.id)
  } catch {}
  return knownDirs.has(dir)
}
const jobs = createJobs({ publish: events => publish(events), isKnown, demo: flag('demo') ? demoJob() : undefined })

function publish(events) {
  for (const raw of events) {
    const ev = enrich(raw)
    if (ev.kind === 'session.start') know(ev.cwd, ev.project?.id)
    if (ev.kind === 'chat.delivered') chat.settle(ev.id, ev.ok !== false)
    if (ev.kind === 'asset.add' && ev.type === 'image' && typeof ev.path === 'string' && isAbsolute(ev.path)) {
      pictures.set(`${ev.session}|${ev.id}`, ev.path)
      if (pictures.size > PICTURES_KEEP) pictures.delete(pictures.keys().next().value)
    }
    if (GAUGES.has(ev.kind)) gauges.set(gaugeKey(ev), ev)
    else log.push(ev)
    // A finished agent's last reading has nothing left to show.
    if (ev.kind === 'agent.end') gauges.delete(gaugeKey({ kind: 'agent.context', session: ev.session, agent: ev.agent }))
    const frame = `data: ${JSON.stringify(ev)}\n\n`
    for (const res of clients) res.write(frame)
  }
  if (log.length > LOG_LIMIT) log.splice(0, log.length - LOG_LIMIT)
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

async function serveStatic(res, pathname) {
  const rel = pathname === '/' ? 'index.html' : pathname.slice(1)
  if (rel.includes('..')) return void res.writeHead(400).end()
  try {
    let body = await readFile(join(PUBLIC, rel))
    // The page gets this run's chat token; no other origin can read it.
    if (rel === 'index.html') body = body.toString('utf8').replace('<meta name="agent-office-token" content="">', `<meta name="agent-office-token" content="${TOKEN}">`)
    // No caching: after a pull, a refresh always shows the current build.
    res.writeHead(200, { 'content-type': TYPES[extname(rel)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
}

const json = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost')
  const refused = refusal(req, PORT)
  if (refused) return json(res, 403, { error: refused })

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

  if (req.method === 'GET' && pathname === '/inbox') {
    // A custom header: a web page can't send it to another origin unasked.
    if (req.headers[INBOX_HEADER] !== '1') return json(res, 403, { error: 'missing inbox header' })
    json(res, 200, { messages: chat.take(searchParams.get('session') ?? '') })
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
    res.write(`event: replay\ndata: ${JSON.stringify([...log, ...gauges.values()])}\n\n`)
    clients.add(res)
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
    json(res, 200, { ok: true, name: 'agent-office', version: VERSION, managed: MANAGED, demo: flag('demo'), chat: true, jobs: true, events: log.length, viewers: clients.size })
    return
  }

  if (req.method === 'POST' && pathname === '/shutdown') {
    // A custom header: a web page can't send it to another origin unasked.
    if (req.headers[CONTROL_HEADER] !== '1') return json(res, 403, { error: 'missing control header' })
    // One you started yourself (npx, node server.mjs) stays yours to stop.
    if (!MANAGED) return json(res, 409, { error: 'not started by the plugin' })
    json(res, 200, { ok: true })
    console.log('[agent-office] stepping down for a newer bridge')
    for (const client of clients) client.end()
    // Closing stops listening at once; open connections get a moment to end.
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 1000).unref()
    return
  }

  if (req.method === 'GET') return serveStatic(res, pathname)
  res.writeHead(405).end()
})

let replaceUntil = 0

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    // Taking over: the old bridge is stepping down, so try again shortly.
    if (Date.now() < replaceUntil) return void setTimeout(() => server.listen(PORT, HOST), 50)
    // Another session's bridge already holds the port: that one serves us too.
    console.error(`[agent-office] port ${PORT} in use, assuming a bridge is already running`)
    process.exit(0)
  }
  throw err
})

server.on('listening', () => {
  console.log(`[agent-office] office on http://${HOST}:${PORT}${VERSION ? ` (${VERSION})` : ''}`)
  if (flag('demo')) startDemo(publish)
})

// Ask the bridge on the port to step down. This process is already running,
// so it gets the port before the old bridge's own session can start that one
// again.
async function askToStepDown() {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/shutdown`, { method: 'POST', headers: { [CONTROL_HEADER]: '1' } })
    if (res.ok) replaceUntil = Date.now() + REPLACE_MS
  } catch {
    // Nothing there: the port is free.
  }
}

if (flag('replace')) await askToStepDown()
server.listen(PORT, HOST)
