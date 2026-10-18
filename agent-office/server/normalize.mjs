// Turns whatever reaches POST /event into the visualizer's event schema.
//
// Two producers feed the bridge:
//   - the Claude Code mod (hooks/register.ts), which already speaks the schema
//     below and marks each event with a `kind`;
//   - classic settings hooks (fallback/settings.json), which pipe Claude Code's
//     hook stdin as-is: `{ hook_event_name, session_id, tool_name, ... }`.
//
// The schema (every event also carries `t`, ms since epoch, and `session`):
//   session.start  { cwd?, model?, project? { id, name, remote } }
//   session.end    { reason?, resumeId? }
//   turn.start     { agent?, turnId?, text? }
//   turn.complete  { agent?, turnId?, durationMs?, reason?, context?, answer? }
//   agent.spawn    { agent, parent?, type, name?, description?, model?, background?,
//                    teammate?, teammateId?, fork?, cwd? }
//   agent.end      { agent, status? }             completed, failed or killed
//   tool.start     { agent?, id, tool, summary? }
//   tool.end       { agent?, id, tool, ok }
//   agent.idle     { agent }                      a teammate waiting for mail
//   agent.waiting  { agent }                      a subagent holding background work
//   agent.message  { from?, to?, toName?, fromName?, via, text? }
//                  one loop messaging another; no `from` or `to` is the main
//                  loop; `via` says how (model, plugin, projects-relay, peer...)
//   session.thread {}                             a claude.ai project's coordinator
//                                                 handed this session work
// Gauges (the bridge keeps only the newest per session and agent):
//   context.measure   { context { tokens?, window, percent? }, costUsd?, rateLimits? }
//   context.breakdown { window, used, categories [{ name, tokens, kind }] }
//   agent.context     { agent?, tokens, window?, model? }   one request's input
// And:
//   context.compact   { agent?, trigger, before?, after? }
//   chat.sent         { agent?, id, text }       the office sent a message (the bridge emits it)
//   chat.delivered    { agent?, id, ok, how? }   the session's mod handed it over

const KINDS = new Set([
  'session.start', 'session.end', 'turn.start', 'turn.complete',
  'agent.spawn', 'agent.end', 'agent.idle', 'agent.waiting', 'agent.message', 'session.thread',
  'tool.start', 'tool.end',
  'context.measure', 'context.breakdown', 'context.compact', 'agent.context',
  'chat.sent', 'chat.delivered',
  'todo.update', 'ask.open', 'ask.close', 'asset.add',
])

export const GAUGES = new Set(['context.measure', 'context.breakdown', 'agent.context'])
export const gaugeKey = ev => `${ev.kind}|${ev.session}|${ev.agent ?? ''}`

// Agent spawning tools: the spawn itself is drawn as a satellite, not a tool leaf.
const SPAWN_TOOLS = new Set(['Agent', 'Task'])

export function summarize(input) {
  if (!input || typeof input !== 'object') return undefined
  const pick =
    input.command ?? input.file_path ?? input.notebook_path ?? input.pattern ??
    input.url ?? input.query ?? input.description ?? input.prompt
  if (typeof pick !== 'string') return undefined
  const line = pick.replace(/\s+/g, ' ').trim()
  return line.length > 90 ? `${line.slice(0, 87)}...` : line
}

function fromClassic(p, now) {
  const session = String(p.session_id ?? 'unknown')
  const agent = p.agent_id ? String(p.agent_id) : undefined
  const base = { t: now, session, ...(agent && { agent }) }
  switch (p.hook_event_name) {
    case 'SessionStart':
      return [{ ...base, kind: 'session.start', cwd: p.cwd, model: p.model }]
    case 'SessionEnd':
      return [{ ...base, kind: 'session.end' }]
    case 'UserPromptSubmit':
      return [{ ...base, kind: 'turn.start', text: summarize({ prompt: p.prompt }) }]
    case 'Stop':
      return [{ ...base, kind: 'turn.complete', reason: 'answer' }]
    case 'SubagentStart':
      return [{
        ...base, kind: 'agent.spawn', agent: String(p.agent_id ?? p.tool_use_id ?? now),
        type: p.agent_type ?? 'subagent',
      }]
    case 'PreCompact':
      return [{ ...base, kind: 'context.compact', trigger: p.trigger ?? 'auto' }]
    case 'SubagentStop':
      return [{ ...base, kind: 'agent.end', agent: String(p.agent_id ?? '') }]
    case 'PreToolUse':
    case 'PostToolUse':
    case 'PostToolUseFailure': {
      if (SPAWN_TOOLS.has(p.tool_name)) return []
      const id = String(p.tool_use_id ?? `${p.tool_name}-${now}`)
      if (p.hook_event_name === 'PreToolUse') {
        return [{ ...base, kind: 'tool.start', id, tool: p.tool_name, summary: summarize(p.tool_input) }]
      }
      const failed = p.hook_event_name === 'PostToolUseFailure' ||
        p.tool_response?.is_error === true || p.tool_response?.success === false
      return [{ ...base, kind: 'tool.end', id, tool: p.tool_name, ok: !failed }]
    }
    default:
      return []
  }
}

// What the bridge keeps of an event, whoever sent it: plain values only
// (strings capped, numbers finite, lists and nesting bounded), ids that are
// ids, a `type` from its kind's list, links that are web links, picture
// paths that are absolute, and no picture data (only the bridge serves
// pictures, from /asset). The page escapes everything it shows too; this is
// so nothing odd ever reaches it, or the log every page replays.
const ID = /^[\w.:@-]{1,160}$/
const ID_FIELDS = ['agent', 'parent', 'id', 'turnId', 'job', 'from', 'to']
const TYPES = {
  'asset.add': new Set(['image', 'artifact', 'pr', 'link', 'file', 'plan']),
  'ask.open': new Set(['question', 'plan', 'permission']),
}
const TEXT_MAX = 20000
const LIST_MAX = 200
const KEYS_MAX = 100
const DEPTH_MAX = 6

function plainValue(v, depth) {
  if (typeof v === 'string') return v.length > TEXT_MAX ? v.slice(0, TEXT_MAX) : v
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined
  if (typeof v === 'boolean' || v === null) return v
  if (depth >= DEPTH_MAX || typeof v !== 'object') return undefined
  if (Array.isArray(v)) return v.slice(0, LIST_MAX).map(x => plainValue(x, depth + 1)).filter(x => x !== undefined)
  const out = {}
  for (const [k, x] of Object.entries(v).slice(0, KEYS_MAX)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue
    const kept = plainValue(x, depth + 1)
    if (kept !== undefined) out[k] = kept
  }
  return out
}

export function clean(p, now = Date.now()) {
  if (!KINDS.has(p?.kind) || typeof p.session !== 'string' || !ID.test(p.session)) return undefined
  const ev = plainValue(p, 0)
  ev.t = typeof p.t === 'number' && Number.isFinite(p.t) ? p.t : now
  for (const k of ID_FIELDS) if (k in ev && !(typeof ev[k] === 'string' && ID.test(ev[k]))) delete ev[k]
  const types = TYPES[ev.kind]
  if (types && !types.has(ev.type)) return undefined
  if ('url' in ev && !(typeof ev.url === 'string' && /^https?:\/\/[^\s"'<>]+$/i.test(ev.url))) delete ev.url
  if ('path' in ev && !(typeof ev.path === 'string' && /^(\/|[A-Za-z]:[\\/])/.test(ev.path))) delete ev.path
  delete ev.src
  return ev
}

export function normalize(payload, now = Date.now()) {
  const items = Array.isArray(payload) ? payload : [payload]
  const out = []
  for (const p of items) {
    if (!p || typeof p !== 'object') continue
    const found = typeof p.hook_event_name === 'string' ? fromClassic(p, now) : [p]
    for (const ev of found) {
      const kept = clean(ev, now)
      if (kept) out.push(kept)
    }
  }
  return out
}
