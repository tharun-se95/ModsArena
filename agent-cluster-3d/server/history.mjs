// Past sessions, read from the transcripts Claude Code keeps under
// ~/.claude/projects/<project>/<session>.jsonl (and a session's subagents
// under <session>/subagents/*.jsonl). Summaries are cached by file mtime.

import { createReadStream } from 'node:fs'
import { open, readdir, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, join } from 'node:path'
import { createInterface } from 'node:readline'
import { findProject } from './projects.mjs'

const SPAWN_TOOLS = new Set(['Agent', 'Task'])
const PROMPT_KEEP = 25
const cache = new Map()

export const projectsDir = () =>
  join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude'), 'projects')

const contextOf = usage =>
  usage ? (usage.input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0) : undefined

// The window a transcript ran in is not recorded; a 1M model says so in its id,
// and a reading past 200k can only have come from a 1M window.
export const windowFor = (model, tokens) =>
  /\[1m\]|-1m\b/i.test(model ?? '') || (tokens ?? 0) > 200000 ? 1000000 : 200000

function promptText(entry) {
  if (entry.type !== 'user' || entry.isMeta || entry.isSidechain) return undefined
  if (entry.origin && entry.origin.kind !== 'human') return undefined
  const content = entry.message?.content
  const text = typeof content === 'string'
    ? content
    : Array.isArray(content) && content.every(b => b.type === 'text')
      ? content.map(b => b.text).join(' ')
      : undefined
  if (!text || text.startsWith('<')) return undefined
  const line = text.replace(/\s+/g, ' ').trim()
  return line.length > 140 ? `${line.slice(0, 137)}...` : line
}

async function forEachEntry(path, fn) {
  const lines = createInterface({ input: createReadStream(path), crlfDelay: Infinity })
  for await (const line of lines) {
    if (!line) continue
    try {
      fn(JSON.parse(line))
    } catch {
      // A half-written last line or a foreign row: skip it.
    }
  }
}

async function summarizeSubagent(path) {
  const agent = { id: basename(path, '.jsonl').replace(/^agent-/, ''), tools: 0, context: undefined, model: undefined, startedAt: undefined }
  await forEachEntry(path, e => {
    if (e.timestamp) agent.startedAt ??= Date.parse(e.timestamp)
    if (e.type !== 'assistant') return
    const usage = contextOf(e.message?.usage)
    if (usage) agent.context = usage
    agent.model = e.message?.model ?? agent.model
    for (const b of e.message?.content ?? []) if (b.type === 'tool_use') agent.tools++
  })
  return agent
}

export async function summarizeTranscript(path) {
  const s = {
    session: basename(path, '.jsonl'),
    cwd: undefined, gitBranch: undefined, model: undefined,
    startedAt: undefined, endedAt: undefined,
    prompts: [], turns: 0, toolCalls: 0, errors: 0, tools: {},
    agents: [], compactions: [], context: undefined, costUsd: undefined,
  }
  await forEachEntry(path, e => {
    const t = e.timestamp ? Date.parse(e.timestamp) : undefined
    if (t) {
      s.startedAt ??= t
      s.endedAt = t
    }
    s.cwd ??= e.cwd
    if (e.gitBranch) s.gitBranch = e.gitBranch
    if (e.type === 'cost-state' && typeof e.totalCostUSD === 'number') s.costUsd = e.totalCostUSD

    if (e.type === 'system' && e.subtype === 'compact_boundary') {
      s.compactions.push({ t, trigger: e.compactMetadata?.trigger, before: e.compactMetadata?.preTokens })
    }

    const prompt = promptText(e)
    if (prompt) {
      s.turns++
      s.prompts.push({ t, text: prompt })
      if (s.prompts.length > PROMPT_KEEP) s.prompts.shift()
    }

    if (e.type === 'user' && Array.isArray(e.message?.content)) {
      for (const b of e.message.content) if (b.type === 'tool_result' && b.is_error) s.errors++
    }

    if (e.type === 'assistant' && !e.isSidechain) {
      s.model = e.message?.model ?? s.model
      const usage = contextOf(e.message?.usage)
      if (usage) s.context = usage
      for (const b of e.message?.content ?? []) {
        if (b.type !== 'tool_use') continue
        if (SPAWN_TOOLS.has(b.name)) {
          s.agents.push({ type: b.input?.subagent_type ?? 'general-purpose', description: b.input?.description, t })
        } else {
          s.toolCalls++
          s.tools[b.name] = (s.tools[b.name] ?? 0) + 1
        }
      }
    }
  })

  // Newer builds keep each subagent's transcript beside the session's.
  const subDir = join(path.slice(0, -'.jsonl'.length), 'subagents')
  const files = await readdir(subDir).catch(() => [])
  const subagents = await Promise.all(files.filter(f => f.endsWith('.jsonl')).map(f => summarizeSubagent(join(subDir, f))))
  // Agent calls are in spawn order; pair each with the run that started next.
  subagents.sort((a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0))
  s.agents.forEach((a, i) => Object.assign(a, subagents[i] ?? {}))
  for (const extra of subagents.slice(s.agents.length)) s.agents.push({ type: 'subagent', ...extra })

  s.window = windowFor(s.model, s.context)
  s.project = findProject(s.cwd)
  return s
}

async function cachedSummary(path) {
  const info = await stat(path)
  const hit = cache.get(path)
  if (hit && hit.mtimeMs === info.mtimeMs && hit.size === info.size) return hit.summary
  const summary = await summarizeTranscript(path)
  cache.set(path, { mtimeMs: info.mtimeMs, size: info.size, summary })
  return summary
}

// Recent sessions, newest first: at most `perProject` per project folder,
// none older than `days`.
export async function readHistory({ days = 14, perProject = 12 } = {}) {
  const root = projectsDir()
  const since = Date.now() - days * 86400000
  const dirs = await readdir(root, { withFileTypes: true }).catch(() => [])
  const sessions = []
  for (const dir of dirs) {
    if (!dir.isDirectory()) continue
    const folder = join(root, dir.name)
    const files = await readdir(folder).catch(() => [])
    const recent = []
    for (const f of files) {
      if (!f.endsWith('.jsonl')) continue
      const info = await stat(join(folder, f)).catch(() => null)
      if (info && info.mtimeMs >= since) recent.push({ path: join(folder, f), mtimeMs: info.mtimeMs })
    }
    recent.sort((a, b) => b.mtimeMs - a.mtimeMs)
    for (const { path } of recent.slice(0, perProject)) {
      const summary = await cachedSummary(path).catch(() => null)
      if (summary && summary.turns > 0) sessions.push(summary)
    }
  }
  sessions.sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0))
  return sessions
}

// The context a transcript's newest main-loop request was answered over, read
// from its tail: what settings hooks (which carry `transcript_path`) can know.
export async function tailContext(path, bytes = 262144) {
  let handle
  try {
    handle = await open(path, 'r')
    const { size } = await handle.stat()
    const start = Math.max(0, size - bytes)
    const buf = Buffer.alloc(size - start)
    await handle.read(buf, 0, buf.length, start)
    const lines = buf.toString('utf8').split('\n').reverse()
    for (const line of lines) {
      if (!line.includes('"assistant"')) continue
      try {
        const e = JSON.parse(line)
        const tokens = e.type === 'assistant' && !e.isSidechain ? contextOf(e.message?.usage) : undefined
        if (tokens) return { tokens, window: windowFor(e.message?.model, tokens), model: e.message?.model }
      } catch {
        // The cut first line: keep looking.
      }
    }
  } catch {
    return undefined
  } finally {
    await handle?.close()
  }
  return undefined
}
