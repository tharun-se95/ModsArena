// The graph model: projects, sessions (live and past), agents and tool calls,
// built from bridge events and /history summaries. Rendering reads it; it
// knows nothing about Three.js.

import { unwrapPrompt, isEngineNote } from '../../agent-office/server/prompts.mjs'
import { goalTitle } from './names.js'

export const TOOL_LINGER_MS = 6000 // a finished tool stays visible this long
const FINISHED_AGENT_LIMIT = 12
const PROMPT_KEEP = 25
// An agent seen only through its tool calls (never spawned, like Claude
// Code's own helpers) leaves once it's been quiet this long.
const UNANNOUNCED_MS = 30000
// A prompt from /history and the same one from a live event: their clocks
// differ a little, and either text may be cut short.
const SAME_PROMPT_MS = 60000
const bare = s => s.replace(/\s+/g, ' ').replace(/(\.\.\.|…)$/, '').trim()
const samePrompt = (a, b) => {
  const [x, y] = [bare(a), bare(b)]
  return x.startsWith(y) || y.startsWith(x)
}
export const DEFAULT_WINDOW = 200000
export const WARN_AT = 0.8

export const nodes = new Map()
export let links = []
export const stats = { calls: 0, errors: 0 }
export const notices = [] // compactions and other moments, newest first
export const mail = [] // messages between loops, newest first: { t, session, from, to, fromName, toName, via, text }
const MAIL_KEEP = 60
// What the work produces and asks, newest first across the whole office:
// { id, t, session, agent?, type, title, url?, path?, src?, meta? }
//   type: image, artifact, pr, link, file, plan
export const outputs = []
const OUTPUTS_KEEP = 120
let dirty = true

export const isDirty = () => dirty
export const clean = () => { dirty = false }
export const touch = () => { dirty = true }

const pid = p => `p:${p}`
export const sid = s => `s:${s}`
export const aid = (s, a) => `a:${s}:${a}`
const tid = (s, t) => `t:${s}:${t}`
export const idOf = end => (typeof end === 'object' ? end.id : end)

function addNode(node) {
  nodes.set(node.id, node)
  dirty = true
  return node
}

function addLink(source, target, kind) {
  links.push({ source, target, kind })
  dirty = true
}

function removeLinksTo(id, kind) {
  links = links.filter(l => !(idOf(l.target) === id && l.kind === kind))
  dirty = true
}

export function removeNode(id) {
  if (!nodes.delete(id)) return
  links = links.filter(l => idOf(l.source) !== id && idOf(l.target) !== id)
  dirty = true
}

export function reset() {
  for (const [id, n] of nodes) if (n.kind !== 'project' && !n.past) nodes.delete(id)
  links = links.filter(l => nodes.has(idOf(l.source)) && nodes.has(idOf(l.target)))
  Object.assign(stats, { calls: 0, errors: 0 })
  notices.length = 0
  mail.length = 0
  outputs.length = 0
  dirty = true
}

// Context fill of a session or agent, 0..1, against its own window.
export function fill(n) {
  const ctx = n.context
  if (!ctx?.tokens) return 0
  return Math.min(1, ctx.tokens / (ctx.window || sessionWindow(n) || DEFAULT_WINDOW))
}

function sessionWindow(n) {
  return nodes.get(sid(n.session))?.context?.window
}

// A thread's short name is its goal, tidied up (names.js).
export const promptLabel = text => goalTitle(text, 26) || (text.length > 26 ? `${text.slice(0, 25)}…` : text)

export const shortId = s => (s.length > 14 ? `${s.slice(0, 8)}…` : s)

function ensureProject(project) {
  const id = pid(project.id)
  const node = nodes.get(id) ?? addNode({ id, kind: 'project', projectId: project.id, label: project.name })
  node.label = project.name
  node.remote = project.remote
  return node
}

function setProject(session, project) {
  if (!project || session.project === project.id) return
  ensureProject(project)
  removeLinksTo(session.id, 'project')
  session.project = project.id
  session.projectName = project.name
  addLink(pid(project.id), session.id, 'project')
}

function ensureSession(ev) {
  const id = sid(ev.session)
  const existing = nodes.get(id)
  if (existing) {
    if (existing.past) {
      // A past session resumed: it is live again.
      existing.past = false
      existing.status = 'active'
      dirty = true
    }
    return existing
  }
  return addNode({
    id, kind: 'session', label: shortId(ev.session), session: ev.session, status: 'active',
    startedAt: ev.t, lastAt: ev.t, history: 0, prompts: [], compactions: [], turns: 0,
    toolCalls: 0, errors: 0,
  })
}

function ensureAgent(ev, agent) {
  const id = aid(ev.session, agent)
  if (nodes.has(id)) return nodes.get(id)
  ensureSession(ev)
  const node = addNode({
    id, kind: 'agent', label: 'subagent', type: 'subagent', session: ev.session, agent,
    status: 'active', startedAt: ev.t, history: 0, compactions: [],
  })
  addLink(sid(ev.session), id, 'spawn')
  return node
}

const owner = ev => (ev.agent ? ensureAgent(ev, ev.agent) : ensureSession(ev))

function notice(ev, text, level, target) {
  notices.unshift({ t: ev.t, text, level, target })
  if (notices.length > 30) notices.pop()
}

const k = n => `${Math.round(n / 1000)}k`

// Messages that come from outside the session have no sender loop here.
const OUTSIDE = { 'projects-relay': 'Project coordinator', peer: 'Another session', 'peer-send-message': 'Another session', channel: 'A channel', 'slack-ping': 'Slack', 'scheduled-trigger': 'A routine', bridge: 'You, remotely' }
const isOutside = via => via in OUTSIDE
const outsideName = via => OUTSIDE[via]

const handlers = {
  'session.start'(ev) {
    const node = ensureSession(ev)
    Object.assign(node, { status: 'active', cwd: ev.cwd, model: ev.model, startedAt: node.startedAt ?? ev.t })
    setProject(node, ev.project)
  },
  'session.end'(ev) {
    const node = ensureSession(ev)
    node.status = 'done'
    node.endedAt = ev.t
    node.endReason = ev.reason
  },
  'turn.start'(ev) {
    const node = owner(ev)
    node.pulseAt = ev.t
    if (node.kind === 'session') {
      node.turnOpen = true
      node.turnAt = ev.t
      node.lastReason = undefined
    }
    if (node.kind === 'session' && ev.text) {
      node.turns++
      // A background task reporting in isn't something you asked.
      if (isEngineNote(ev.text)) return
      const { text, from } = unwrapPrompt(ev.text)
      // A session the page first met in /history already has this prompt.
      if (node.prompts.some(p => !p.live && Math.abs(p.t - ev.t) < SAME_PROMPT_MS && samePrompt(p.text, text))) return
      // Sessions are named by what they were first asked, as /resume lists them.
      if (!node.prompts.length) node.label = promptLabel(text)
      node.prompts.push({ t: ev.t, text, from, live: true })
      if (node.prompts.length > PROMPT_KEEP) node.prompts.shift()
    }
  },
  'turn.complete'(ev) {
    // A reading for an agent no longer shown must not bring it back.
    if (ev.agent && !nodes.has(aid(ev.session, ev.agent))) return
    const node = owner(ev)
    if (ev.context?.window) node.context = ev.context
    if (ev.answer) node.answer = { t: ev.t, text: ev.answer }
    if (node.kind === 'session') {
      node.turnOpen = false
      node.lastReason = ev.reason
      node.answeredAt = ev.t
    }
  },
  'session.thread'(ev) {
    ensureSession(ev).thread = true
  },
  'agent.message'(ev) {
    ensureSession(ev)
    const toAgent = ev.to ?? [...nodes.values()].find(n => n.kind === 'agent' && n.session === ev.session && n.name && n.name === ev.toName)?.agent
    const from = ev.from ? aid(ev.session, ev.from) : isOutside(ev.via) ? null : sid(ev.session)
    const to = toAgent ? aid(ev.session, toAgent) : ev.toName ? null : sid(ev.session)
    // Names as they were: a finished agent leaves the office, its mail stays.
    const nameOf = id => (nodes.get(id)?.kind === 'session' ? 'Lead' : nodes.get(id)?.label)
    mail.unshift({
      t: ev.t, session: ev.session, via: ev.via, text: ev.text, from, to,
      fromName: ev.fromName ?? (from ? nameOf(from) : outsideName(ev.via)),
      toName: ev.toName ?? (to ? nameOf(to) : undefined),
    })
    if (mail.length > MAIL_KEEP) mail.pop()
    const target = to && nodes.get(to)
    if (target) target.mailAt = ev.t
  },
  'context.measure'(ev) {
    const node = ensureSession(ev)
    node.context = { ...node.context, ...ev.context }
    if (ev.costUsd !== undefined) node.costUsd = ev.costUsd
    if (ev.rateLimits) node.rateLimits = ev.rateLimits
  },
  'context.breakdown'(ev) {
    const node = ensureSession(ev)
    node.breakdown = { window: ev.window, used: ev.used, categories: ev.categories }
    node.context = { ...node.context, window: ev.window, tokens: node.context?.tokens ?? ev.used }
  },
  'agent.context'(ev) {
    // A reading for an agent no longer shown must not bring it back.
    if (ev.agent && !nodes.has(aid(ev.session, ev.agent))) return
    const node = owner(ev)
    const window = ev.window ?? node.context?.window ?? sessionWindow(node) ?? DEFAULT_WINDOW
    node.context = { ...node.context, tokens: ev.tokens, window }
    if (ev.model) node.model = ev.model
  },
  'context.compact'(ev) {
    const node = owner(ev)
    const entry = { t: ev.t, trigger: ev.trigger, before: ev.before, after: ev.after }
    node.compactions.push(entry)
    node.compactAt = ev.t
    if (ev.after !== undefined) node.context = { ...node.context, tokens: ev.after }
    const span = ev.before ? ` ${k(ev.before)} → ${ev.after !== undefined ? k(ev.after) : '?'}` : ''
    notice(ev, `${node.label} compacted (${ev.trigger})${span}`, 'compact', node.id)
  },
  'agent.spawn'(ev) {
    ensureSession(ev)
    const id = aid(ev.session, ev.agent)
    const parent = ev.parent ? ensureAgent(ev, ev.parent).id : sid(ev.session)
    let node = nodes.get(id)
    if (!node) {
      node = addNode({ id, kind: 'agent', session: ev.session, agent: ev.agent, history: 0, compactions: [] })
      addLink(parent, id, 'spawn')
    }
    Object.assign(node, {
      label: ev.name || ev.type, name: ev.name, type: ev.type, description: ev.description, model: ev.model,
      background: ev.background, teammate: ev.teammate, teammateId: ev.teammateId, fork: ev.fork, cwd: ev.cwd,
      parent, status: 'active', startedAt: ev.t,
      announced: true,
    })
    nodes.get(parent).pulseAt = ev.t
  },
  'agent.idle'(ev) {
    const node = nodes.get(aid(ev.session, ev.agent))
    if (node) node.status = 'idle'
  },
  'agent.waiting'(ev) {
    const node = nodes.get(aid(ev.session, ev.agent))
    if (node) node.status = 'waiting'
  },
  'agent.end'(ev) {
    const node = nodes.get(aid(ev.session, ev.agent))
    if (!node) return
    node.status = 'done'
    node.endStatus = ev.status
    node.endedAt = ev.t
    trimFinishedAgents()
  },
  // A checklist, whole each time (TodoWrite sends the full list; the mod
  // keeps TaskCreate/TaskUpdate's tasks and sends them the same way).
  'todo.update'(ev) {
    const node = owner(ev)
    node.todos = (ev.items ?? []).map(i => ({ text: i.text, status: i.status, active: i.active }))
    node.todosAt = ev.t
    // The conversation shows a snapshot when an item is checked off.
    const done = node.todos.filter(i => i.status === 'completed').length
    if (done !== node.todosDone) {
      node.todosDone = done
      if (!done) return
      node.todosLog = [...(node.todosLog ?? []).slice(-12), { kind: 'todo', items: node.todos, t: ev.t }]
    }
  },
  // Claude Code waiting on you mid-turn: a question (AskUserQuestion), a
  // plan to approve (ExitPlanMode) or a tool to allow.
  'ask.open'(ev) {
    const node = owner(ev)
    node.asks = (node.asks ?? []).filter(a => a.id !== ev.id)
    node.asks.push({ id: ev.id, t: ev.t, type: ev.type ?? 'question', questions: ev.questions, tool: ev.tool, summary: ev.summary, plan: ev.plan })
    node.askAt = ev.t
    if (ev.type === 'plan' && ev.plan) addOutput(ev, { id: `plan-${ev.id}`, type: 'plan', title: firstLine(ev.plan), text: ev.plan })
  },
  'ask.close'(ev) {
    const node = owner(ev)
    const ask = node.asks?.find(a => a.id === ev.id)
    node.asks = (node.asks ?? []).filter(a => a.id !== ev.id)
    if (!ask) return
    const text = ask.type === 'question' ? ask.questions?.map(q => q.question).join(' ') : ask.type === 'plan' ? firstLine(ask.plan ?? '') : `${toolName(ask.tool)} ${ask.summary ?? ''}`.trim()
    node.answered = [...(node.answered ?? []).slice(-12), { kind: 'ask', type: ask.type, text, answer: ev.answer, t: ask.t }]
  },
  'asset.add'(ev) {
    addOutput(ev, ev)
  },
  'tool.start'(ev) {
    const own = owner(ev)
    // A finished or waiting subagent at work again: it was resumed.
    if (own.kind === 'agent' && own.status !== 'active') own.status = 'active'
    const id = tid(ev.session, ev.id)
    if (nodes.has(id)) return
    addNode({
      id, kind: 'tool', label: ev.tool, tool: ev.tool, summary: ev.summary,
      session: ev.session, owner: own.id, status: 'active', startedAt: ev.t,
    })
    addLink(own.id, id, 'tool')
    own.lastAt = ev.t
    stats.calls++
    const session = nodes.get(sid(ev.session))
    session.toolCalls++
    session.lastAt = ev.t
  },
  'tool.end'(ev) {
    const node = nodes.get(tid(ev.session, ev.id))
    if (!node) return
    node.status = ev.ok ? 'ok' : 'error'
    node.endedAt = ev.t
    if (!ev.ok) {
      stats.errors++
      nodes.get(sid(ev.session)).errors++
    }
    const own = nodes.get(node.owner)
    if (own) {
      own.history++
      if (own.kind === 'agent') own.lastAt = ev.t
    }
  },
}

// A tool as people say it: mcp__github__create_pull_request is "GitHub:
// create pull request".
export function toolName(tool) {
  const mcp = /^mcp__(.+?)__(.+)$/.exec(tool ?? '')
  if (!mcp) return tool ?? 'a tool'
  const server = mcp[1].replace(/^plugin_\w+_/, '').replace(/[-_]/g, ' ')
  return `${server.charAt(0).toUpperCase()}${server.slice(1)}: ${mcp[2].replace(/_/g, ' ')}`
}

const firstLine = text => text.replace(/^#+\s*/gm, '').split('\n').find(l => l.trim())?.trim().slice(0, 80) ?? 'Plan'

function addOutput(ev, item) {
  const own = owner(ev)
  const out = {
    id: item.id, t: ev.t, session: ev.session, ...(ev.agent && { agent: ev.agent }),
    type: item.type, title: item.title, url: item.url, path: item.path, src: item.src, text: item.text, meta: item.meta,
  }
  const at = outputs.findIndex(o => o.session === out.session && o.id === out.id)
  if (at >= 0) outputs.splice(at, 1)
  outputs.unshift(out)
  if (outputs.length > OUTPUTS_KEEP) outputs.pop()
  own.outputAt = ev.t
  const host = nodes.get(sid(ev.session))
  if (host) host.outputAt = ev.t
}

// What one thread (and its agents) has made, newest first.
export const outputsOf = sessionNode => outputs.filter(o => o.session === sessionNode.session)

// Everything a thread or agent is waiting on you for, oldest first.
export const asksOf = n => n.asks ?? []
export const openAsks = sessionNode => [...nodes.values()]
  .filter(x => (x.kind === 'session' || x.kind === 'agent') && x.session === sessionNode.session && x.asks?.length)
  .flatMap(x => x.asks.map(a => ({ ...a, who: x })))
  .sort((a, b) => a.t - b.t)

function trimFinishedAgents() {
  const finished = [...nodes.values()]
    .filter(n => n.kind === 'agent' && n.status === 'done')
    .sort((a, b) => a.endedAt - b.endedAt)
  for (const n of finished.slice(0, Math.max(0, finished.length - FINISHED_AGENT_LIMIT))) removeNode(n.id)
}

export function apply(ev) {
  handlers[ev.kind]?.(ev)
}

// Finished tools fold into their owner's history ring, and an agent that
// was never spawned goes once it's quiet: nothing will say it has ended.
export function sweep(now) {
  for (const n of nodes.values()) {
    if (n.kind === 'tool' && n.endedAt && now - n.endedAt > TOOL_LINGER_MS) removeNode(n.id)
  }
  for (const n of nodes.values()) {
    if (n.kind !== 'agent' || n.announced || n.status === 'done' || now - (n.lastAt ?? n.startedAt ?? 0) < UNANNOUNCED_MS) continue
    if (!links.some(l => idOf(l.source) === n.id && l.kind === 'tool')) removeNode(n.id)
  }
}

// Past sessions from /history: a live session only borrows what it lacks.
export function applyHistory(summaries, show) {
  const seen = new Set()
  for (const s of summaries) {
    const id = sid(s.session)
    seen.add(id)
    const live = nodes.get(id)
    if (live && !live.past) {
      if (!live.prompts.length && s.prompts.length) {
        live.prompts = s.prompts
        live.label = promptLabel(s.prompts[0].text)
      }
      if (!live.compactions.length) live.compactions = s.compactions
      live.costUsd ??= s.costUsd
      live.gitBranch ??= s.gitBranch
      if (!live.project) setProject(live, s.project)
      continue
    }
    if (!show) {
      if (live) removeNode(id)
      continue
    }
    const node = live ?? addNode({ id, kind: 'session', session: s.session, past: true, history: 0 })
    Object.assign(node, {
      label: s.prompts[0]?.text ? promptLabel(s.prompts[0].text) : shortId(s.session),
      status: 'past', past: true, cwd: s.cwd, model: s.model, gitBranch: s.gitBranch,
      startedAt: s.startedAt, endedAt: s.endedAt, lastAt: s.endedAt, prompts: s.prompts,
      turns: s.turns, toolCalls: s.toolCalls, errors: s.errors, tools: s.tools,
      pastAgents: s.agents, compactions: s.compactions, costUsd: s.costUsd,
      context: s.context ? { tokens: s.context, window: s.window } : undefined,
    })
    setProject(node, s.project)
  }
  for (const n of [...nodes.values()]) {
    if (n.past && !seen.has(n.id)) removeNode(n.id)
  }
  // A project with nothing left in it goes too.
  for (const n of [...nodes.values()]) {
    if (n.kind === 'project' && !links.some(l => idOf(l.source) === n.id)) removeNode(n.id)
  }
  dirty = true
}

// Which nodes the current project filter shows.
export function visible(projectFilter) {
  const all = [...nodes.values()]
  if (!projectFilter) return { nodes: all, links: [...links] }
  const keep = new Set()
  for (const n of all) {
    const project = n.kind === 'project' ? n.projectId : nodes.get(sid(n.session))?.project
    if (project === projectFilter) keep.add(n.id)
  }
  return {
    nodes: all.filter(n => keep.has(n.id)),
    links: links.filter(l => keep.has(idOf(l.source)) && keep.has(idOf(l.target))),
  }
}

export function projects() {
  return [...nodes.values()].filter(n => n.kind === 'project').sort((a, b) => a.label.localeCompare(b.label))
}

export function sessionsOf(projectId) {
  return [...nodes.values()]
    .filter(n => n.kind === 'session' && n.project === projectId)
    .sort((a, b) => Number(a.past) - Number(b.past) || (b.lastAt ?? 0) - (a.lastAt ?? 0))
}

export function warnings() {
  return [...nodes.values()]
    .filter(n => (n.kind === 'session' || n.kind === 'agent') && !n.past && n.status !== 'done' && fill(n) >= WARN_AT)
    .sort((a, b) => fill(b) - fill(a))
}

// ---------------------------------------------------------------------------
// The shape Claude gives work: a project holds threads (sessions), a thread
// has its lead (the main loop) and the agents it spawned, nested.

export const BUSY_MS = 2500

// Where a thread stands, in the words claude.ai's Overview uses:
//   working   a turn is running or a tool just ran
//   waiting   it answered and the next move is yours
//   asking    mid-turn, but Claude Code is holding it for you: a question,
//             a plan to approve or a tool to allow
//   stuck     its last turn ended on an error, a refusal or an interrupt
//   ended     the session is over (or is a past one)
export function threadState(n, running = new Set()) {
  if (n.past || n.status === 'done') return 'ended'
  if (n.kind === 'session' && openAsks(n).length) return 'asking'
  if (n.turnOpen || running.has(n.id) || Date.now() - (n.lastAt ?? 0) < BUSY_MS) return 'working'
  if (n.lastReason && n.lastReason !== 'answer') return 'stuck'
  return 'waiting'
}

// An agent: working, waiting (on its own background work), idle (a
// teammate between turns), done or failed.
export function agentState(n) {
  if (n.status === 'done') return n.endStatus === 'failed' || n.endStatus === 'killed' ? 'failed' : 'done'
  if (n.status === 'idle') return 'idle'
  if (n.status === 'waiting') return 'waiting'
  return 'working'
}

// A thread's agents as a tree under its lead: [{ node, children }].
export function teamOf(sessionNode) {
  const agents = [...nodes.values()].filter(n => n.kind === 'agent' && n.session === sessionNode.session)
  const byParent = new Map()
  for (const a of agents) {
    const parent = a.parent ?? sessionNode.id
    if (!byParent.has(parent)) byParent.set(parent, [])
    byParent.get(parent).push(a)
  }
  const grow = id => (byParent.get(id) ?? [])
    .sort((a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0))
    .map(node => ({ node, children: grow(node.id) }))
  return grow(sessionNode.id)
}

// Who stands above a node: its thread, then each agent down to it.
export function lineage(n) {
  const chain = []
  let at = n
  while (at && at.kind === 'agent') {
    chain.unshift(at)
    at = nodes.get(at.parent ?? sid(at.session))
  }
  if (at) chain.unshift(at)
  return chain
}

export const mailOf = sessionNode => mail.filter(m => m.session === sessionNode.session)
