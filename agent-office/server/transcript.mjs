// A session's (or subagent's) conversation, read from the transcript Claude
// Code keeps: ~/.claude/projects/<project>/<session>.jsonl, and a subagent's
// at <session>/subagents/agent-<id>.jsonl beside it. GET /transcript turns
// its rows into a short list of entries the office's transcript tab draws:
//
//   { kind: 'you', text, t }                what you typed
//   { kind: 'chat', text, t, from }         a message from the office (or another plugin)
//   { kind: 'say', text, t }                the model's reply
//   { kind: 'tool', id, name, summary, t }  a tool call...
//   { kind: 'result', id, ok, text }        ...and what came back
//   { kind: 'note', text, t }               compactions, notifications
//
// The page asks again with `after` (a byte offset) and gets only what's new.

import { open, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { projectsDir } from './history.mjs'
import { summarize } from './normalize.mjs'

const ID = /^[\w-]{1,100}$/
const FIRST_READ = 512 * 1024 // a long session opens at its last half megabyte
const TEXT_LIMIT = 4000
const RESULT_LIMIT = 800

const found = new Map() // session id -> its transcript path

// The transcript file for a session (or one of its subagents), or null.
export async function findTranscript(session, agent, root = projectsDir()) {
  if (!ID.test(session ?? '') || (agent !== undefined && !ID.test(agent))) return null
  let path = found.get(session)
  if (!path) {
    let dirs = []
    try { dirs = await readdir(root) } catch { return null }
    for (const dir of dirs) {
      const candidate = join(root, dir, `${session}.jsonl`)
      if (await stat(candidate).then(s => s.isFile(), () => false)) { path = candidate; break }
    }
    if (!path) return null
    found.set(session, path)
  }
  if (!agent) return path
  const sub = join(path.slice(0, -'.jsonl'.length), 'subagents', `agent-${agent}.jsonl`)
  return (await stat(sub).then(s => s.isFile(), () => false)) ? sub : null
}

const clip = (text, limit) => (text.length > limit ? `${text.slice(0, limit - 1)}…` : text)
const textOf = content => (typeof content === 'string' ? content
  : Array.isArray(content) ? content.filter(b => b.type === 'text').map(b => b.text).join('\n') : '')

// The entries one transcript row contributes (often none).
export function entriesOf(row) {
  const t = row.timestamp ? Date.parse(row.timestamp) : undefined
  const content = row.message?.content
  if (row.type === 'system' && row.subtype === 'compact_boundary') return [{ kind: 'note', text: 'Context compacted', t }]
  if (row.type === 'assistant' && Array.isArray(content)) {
    return content.flatMap(b => {
      if (b.type === 'text' && b.text?.trim()) return [{ kind: 'say', text: clip(b.text.trim(), TEXT_LIMIT), t }]
      if (b.type === 'tool_use') return [{ kind: 'tool', id: b.id, name: b.name, summary: summarize(b.input) ?? '', t }]
      return []
    })
  }
  if (row.type !== 'user' || row.isMeta || row.isCompactSummary) return []
  if (Array.isArray(content) && content.some(b => b.type === 'tool_result')) {
    return content.filter(b => b.type === 'tool_result').map(b => ({
      kind: 'result', id: b.tool_use_id, ok: !b.is_error, text: clip(textOf(b.content).trim(), RESULT_LIMIT),
    }))
  }
  const text = textOf(content).trim()
  if (!text) return []
  const origin = row.origin?.kind
  if (origin === 'plugin') return [{ kind: 'chat', text: clip(text, TEXT_LIMIT), t, from: row.origin.name ?? 'a plugin' }]
  if (origin === 'task-notification') return [{ kind: 'note', text: 'A background task reported in', t }]
  // Slash commands are stored as markup; show the command itself.
  const command = /<command-name>([^<]+)<\/command-name>/.exec(text)?.[1]
  if (command) return [{ kind: 'note', text: `Ran ${command.trim()}`, t }]
  if (text.startsWith('<')) return []
  if (origin === undefined || origin === 'human') return [{ kind: 'you', text: clip(text, TEXT_LIMIT), t }]
  return []
}

// Entries after byte `after` (or from the last half megabyte), and where to
// pick up next time. Only whole lines are read: a half-written last line
// waits for the next call.
export async function readTranscript(path, after) {
  const file = await open(path, 'r')
  try {
    const { size } = await file.stat()
    let start = Number.isFinite(after) && after >= 0 && after <= size ? after : Math.max(0, size - FIRST_READ)
    const fresh = !(Number.isFinite(after) && after >= 0 && after <= size)
    if (start >= size) return { entries: [], next: size, reset: fresh && after !== undefined }
    const buffer = Buffer.alloc(size - start)
    await file.read(buffer, 0, buffer.length, start)
    let text = buffer.toString('utf8')
    let skipped = 0
    if (fresh && start > 0) {
      // Opening mid-file: drop the partial first line.
      const cut = text.indexOf('\n') + 1
      skipped = Buffer.byteLength(text.slice(0, cut))
      text = text.slice(cut)
    }
    const end = text.lastIndexOf('\n') + 1
    const whole = text.slice(0, end)
    const entries = []
    for (const line of whole.split('\n')) {
      if (!line) continue
      try { entries.push(...entriesOf(JSON.parse(line))) } catch {}
    }
    return { entries, next: start + skipped + Buffer.byteLength(whole), reset: fresh && after !== undefined }
  } finally {
    await file.close()
  }
}
