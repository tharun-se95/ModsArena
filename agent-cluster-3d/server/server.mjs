#!/usr/bin/env node
// Claude Cluster 3D bridge: takes events from Claude Code, streams them to the
// 3D visualizer over Server-Sent Events. Node built-ins only, no install step.
//
//   node server.mjs [--port 7337] [--demo]
//
//   POST /event    one event or an array (mod schema or classic hook stdin)
//   GET  /stream   SSE: replays the recent log, then every new event
//   GET  /healthz  liveness probe the mod uses before spawning a bridge
//   GET  /         the visualizer

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize } from './normalize.mjs'
import { startDemo } from './demo.mjs'

const args = process.argv.slice(2)
const flag = name => args.includes(`--${name}`)
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const PORT = Number(option('port', process.env.CLUSTER3D_PORT ?? 7337))
const HOST = option('host', '127.0.0.1')
const LOG_LIMIT = 5000
const MAX_BODY = 1024 * 1024
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), 'public')
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
}

const log = []
const clients = new Set()

function publish(events) {
  for (const ev of events) {
    log.push(ev)
    const frame = `data: ${JSON.stringify(ev)}\n\n`
    for (const res of clients) res.write(frame)
  }
  if (log.length > LOG_LIMIT) log.splice(0, log.length - LOG_LIMIT)
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
    const body = await readFile(join(PUBLIC, rel))
    res.writeHead(200, { 'content-type': TYPES[extname(rel)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')

  if (req.method === 'POST' && pathname === '/event') {
    try {
      const events = normalize(JSON.parse(await readBody(req)))
      publish(events)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ accepted: events.length }))
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
    res.write(`event: replay\ndata: ${JSON.stringify(log)}\n\n`)
    clients.add(res)
    const ping = setInterval(() => res.write(': ping\n\n'), 15000)
    req.on('close', () => {
      clearInterval(ping)
      clients.delete(res)
    })
    return
  }

  if (pathname === '/healthz') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, name: 'agent-cluster-3d', events: log.length, viewers: clients.size }))
    return
  }

  if (req.method === 'GET') return serveStatic(res, pathname)
  res.writeHead(405).end()
})

server.on('error', err => {
  // Another session's bridge already holds the port: that one serves us too.
  if (err.code === 'EADDRINUSE') {
    console.error(`[cluster-3d] port ${PORT} in use, assuming a bridge is already running`)
    process.exit(0)
  }
  throw err
})

server.listen(PORT, HOST, () => {
  console.log(`[cluster-3d] visualizer on http://${HOST}:${PORT}`)
  if (flag('demo')) startDemo(publish)
})
