#!/usr/bin/env node
// Agent Office bridge: takes events from Claude Code, streams them to the
// office page over Server-Sent Events. Node built-ins only, no install step.
//
//   node server.mjs [--port 7337] [--demo] [--history-days 14]
//
//   POST /event    one event or an array (mod schema or classic hook stdin)
//   GET  /stream   SSE: replays the recent log and gauges, then every new event
//   GET  /history  past sessions read from ~/.claude/projects transcripts
//   GET  /healthz  liveness probe the mod uses before spawning a bridge
//   GET  /transcript?session=&agent=&after=   a conversation, read from its transcript
//   POST /chat     a message for a session or subagent (the office page only)
//   GET  /inbox?session=   a session's mod picking up its messages
//   GET  /         the office
//
// Every request must be addressed to the bridge itself, and chat needs the
// token only the office page gets (guard.mjs says why).

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize, GAUGES, gaugeKey } from './normalize.mjs'
import { findProject } from './projects.mjs'
import { readHistory, tailContext } from './history.mjs'
import { startDemo } from './demo.mjs'
import { refusal, newToken, tokenMatches, TOKEN_HEADER, INBOX_HEADER } from './guard.mjs'
import * as chat from './chat.mjs'
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
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), 'public')
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
}

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

function publish(events) {
  for (const raw of events) {
    const ev = enrich(raw)
    if (ev.kind === 'chat.delivered') chat.settle(ev.id, ev.ok !== false)
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
    json(res, 200, { ok: true, name: 'agent-office', demo: flag('demo'), chat: true, events: log.length, viewers: clients.size })
    return
  }

  if (req.method === 'GET') return serveStatic(res, pathname)
  res.writeHead(405).end()
})

server.on('error', err => {
  // Another session's bridge already holds the port: that one serves us too.
  if (err.code === 'EADDRINUSE') {
    console.error(`[agent-office] port ${PORT} in use, assuming a bridge is already running`)
    process.exit(0)
  }
  throw err
})

server.listen(PORT, HOST, () => {
  console.log(`[agent-office] office on http://${HOST}:${PORT}`)
  if (flag('demo')) startDemo(publish)
})
