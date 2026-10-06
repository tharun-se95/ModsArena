import type { EngineInterface, Register } from 'claude-code'

// Streams this session's projects, agents, tool calls and context to the
// Agent Office bridge (server/server.mjs), which fans it out to the office
// page. `/office` opens the page (starting the bridge first if need be) and
// `/office status` says what's running. Messages you send from the office
// come back through the bridge's inbox: to the session as its next prompt,
// to a subagent as a message (see deliver()).
//
// Hooks run in a sandbox with no Node, so events are queued here and flushed
// over `$.http.fetch` on a timer: a tool call never waits on the bridge.

type ClusterEvent = { kind: string; [field: string]: unknown }

const SPAWN_TOOLS = new Set(['Agent', 'Task'])
const FLUSH_MS = 250
const INBOX_MS = 1000
const QUEUE_LIMIT = 2000
const RESPAWN_MS = 15000
const BRIDGE_WAIT_MS = 8000
const MIN_NODE = 18
const WELCOMED = 'welcomed'
// Gauges: only the newest reading per loop matters, so a queued one is replaced.
const GAUGES = new Set(['context.measure', 'agent.context'])

// Module state: a hot reload starts it over, which only costs queued events.
const link = {
  port: 7337,
  autoStart: true,
  session: 'unknown',
  queue: [] as ClusterEvent[],
  isFlushing: false,
  isBridgeUp: false,
  lastSpawnAt: 0,
  activeAgents: new Set<string>(),
  teammates: new Set<string>(),
  activeTools: 0,
  isCheckingInbox: false,
}

const bridgeUrl = () => `http://127.0.0.1:${link.port}`

export function summarize(input: Record<string, unknown>): string | undefined {
  const pick =
    input.command ?? input.file_path ?? input.notebook_path ?? input.pattern ??
    input.url ?? input.query ?? input.description ?? input.prompt
  if (typeof pick !== 'string') return undefined
  const line = pick.replace(/\s+/g, ' ').trim()
  return line.length > 90 ? `${line.slice(0, 87)}...` : line
}

// What a request was answered over: the context that loop holds right now.
// A turn's answer or a message, as one short line for the office.
export function clip(text: string | undefined, limit = 240): string | undefined {
  const line = (text ?? '').replace(/\s+/g, ' ').trim()
  if (!line) return undefined
  return line.length > limit ? `${line.slice(0, limit - 3)}...` : line
}

// Deliveries from outside this session: another session, the project's
// coordinator, a channel. A send between this session's own loops is seen
// at `session.send` instead, so it isn't counted twice.
const OUTSIDE = new Set(['peer', 'peer-send-message', 'projects-relay', 'channel', 'slack-ping', 'scheduled-trigger', 'bridge'])

export function contextTokens(usage: {
  input_tokens: number
  cache_read_input_tokens: number
  cache_creation_input_tokens: number
}): number {
  return usage.input_tokens + usage.cache_read_input_tokens + usage.cache_creation_input_tokens
}

export function projectOf(cwd: string, repo: { root: string; name: string | null; remote: string | null } | null) {
  const root = repo?.root ?? cwd
  const base = root.split(/[\\/]/).filter(Boolean).pop() ?? root
  return { id: root, name: repo?.name ?? base, remote: repo?.remote ?? null }
}

function emit(ev: ClusterEvent) {
  const stamped = { t: Date.now(), session: link.session, ...ev }
  if (GAUGES.has(ev.kind)) {
    const i = link.queue.findIndex(q => q.kind === ev.kind && q.agent === ev.agent)
    if (i >= 0) {
      link.queue[i] = stamped
      return
    }
  }
  link.queue.push(stamped)
  if (link.queue.length > QUEUE_LIMIT) link.queue.splice(0, link.queue.length - QUEUE_LIMIT)
}

function showStatus($: EngineInterface) {
  const agents = link.activeAgents.size
  const tools = link.activeTools
  $.ui.status(
    link.isBridgeUp && (agents > 0 || tools > 0)
      ? `◉ office ${agents} agent${agents === 1 ? '' : 's'} · ${tools} tool${tools === 1 ? '' : 's'}`
      : undefined,
  )
}

async function isHealthy($: EngineInterface) {
  try {
    return (await $.http.fetch(`${bridgeUrl()}/healthz`)).ok
  } catch {
    return false
  }
}

// The bridge runs on Node; say plainly when it's missing or too old.
export function nodeProblem(version: string | undefined): string | undefined {
  if (!version) return `Agent Office needs Node ${MIN_NODE} or newer to run its bridge, and \`node\` wasn't found. Install it from https://nodejs.org, then run /office again.`
  const major = Number(/^v?(\d+)/.exec(version.trim())?.[1] ?? 0)
  if (major < MIN_NODE) return `Agent Office needs Node ${MIN_NODE} or newer to run its bridge; this machine has ${version.trim()}. Update it from https://nodejs.org, then run /office again.`
  return undefined
}

async function nodeVersion($: EngineInterface) {
  const ran = await $.process.run(['node', '--version'], { timeoutMs: 5000 }).catch(() => undefined)
  return ran?.exitCode === 0 ? ran.stdout : undefined
}

// The child lives as long as this loop, which lives as long as the module.
function startBridge($: EngineInterface) {
  link.lastSpawnAt = Date.now()
  void (async () => {
    try {
      const child = $.process.spawn({
        argv: ['node', `${$.plugin.root}/server/server.mjs`, '--port', String(link.port)],
      })
      for await (const { text } of child) $.ui.log(text.trimEnd(), { to: 'debug' })
    } catch (err) {
      $.ui.log(`agent-office: bridge did not start: ${String(err)}`, { to: 'debug' })
    }
  })()
}

async function flush($: EngineInterface) {
  if (link.isFlushing || link.queue.length === 0) return
  link.isFlushing = true
  const batch = link.queue
  link.queue = []
  try {
    const res = await $.http.fetch(`${bridgeUrl()}/event`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(batch),
    })
    if (!res.ok) throw new Error(`bridge answered ${res.status}`)
    link.isBridgeUp = true
  } catch {
    // Keep the batch for the next tick; start a bridge if allowed.
    link.isBridgeUp = false
    link.queue = [...batch, ...link.queue].slice(-QUEUE_LIMIT)
    if (link.autoStart && Date.now() - link.lastSpawnAt > RESPAWN_MS) startBridge($)
  } finally {
    link.isFlushing = false
  }
}

// What `/office status` reports: the bridge, what it has seen, this session.
async function status($: EngineInterface) {
  const url = bridgeUrl()
  const lines: string[] = []
  try {
    const res = await $.http.fetch(`${url}/healthz`)
    const health = JSON.parse(res.text) as { events?: number; viewers?: number }
    lines.push(`Bridge: running on ${url}, ${health.events ?? 0} events so far, ${health.viewers ?? 0} page${health.viewers === 1 ? '' : 's'} open.`)
  } catch {
    const problem = nodeProblem(await nodeVersion($))
    lines.push(`Bridge: not running on ${url}.${problem ? ` ${problem}` : link.autoStart ? ' /office starts it.' : ` Start one with: node ${$.plugin.root}/server/server.mjs --port ${link.port}`}`)
  }
  lines.push(`This session: ${link.queue.length} event${link.queue.length === 1 ? '' : 's'} waiting to send, ${link.activeAgents.size} subagent${link.activeAgents.size === 1 ? '' : 's'} and ${link.activeTools} tool call${link.activeTools === 1 ? '' : 's'} in flight.`)
  return lines.join('\n')
}

const ENDED = new Set(['completed', 'failed', 'killed'])

// Where a subagent stands after a run: finished (and how), or still holding
// work, in which case it stays in the office.
async function settleAgent($: EngineInterface, agent: string) {
  const info = (await $.agent.list().catch(() => [])).find(a => a.id === agent)
  if (!info || ENDED.has(info.status)) {
    emit({ kind: 'agent.end', agent, ...(info && { status: info.status }) })
    link.activeAgents.delete(agent)
  } else {
    emit({ kind: info.status === 'idle' ? 'agent.idle' : 'agent.waiting', agent })
  }
  showStatus($)
}

type ChatMessage = { id: string; agent?: string; text: string }

// Messages from the office for this session. A session's message becomes
// its next prompt (the engine queues it until the session is free), framed
// as coming from this plugin; a subagent's goes to it directly, and a
// finished one is resumed to answer. Either way the office hears back.
export async function deliver($: EngineInterface, message: ChatMessage) {
  try {
    if (message.agent) {
      const sent = await $.session.send({ to: { agentId: message.agent }, text: message.text })
      emit({
        kind: 'chat.delivered', id: message.id, agent: message.agent, ok: sent.isDelivered,
        how: sent.isDelivered ? 'sent to the subagent' : sent.reason,
      })
    } else {
      // Resolves once the prompt has entered, which waits for the session to
      // be free: say it's queued now, and don't hold the inbox for it.
      emit({ kind: 'chat.delivered', id: message.id, ok: true, how: 'queued as the next prompt' })
      void $.prompt.submit({ text: message.text }).catch(err => {
        emit({ kind: 'chat.delivered', id: message.id, ok: false, how: String(err) })
      })
    }
  } catch (err) {
    emit({ kind: 'chat.delivered', id: message.id, agent: message.agent, ok: false, how: String(err) })
  }
}

async function checkInbox($: EngineInterface) {
  if (link.isCheckingInbox || !link.isBridgeUp || link.session === 'unknown') return
  link.isCheckingInbox = true
  try {
    const res = await $.http.fetch(`${bridgeUrl()}/inbox?session=${encodeURIComponent(link.session)}`, {
      headers: { 'x-agent-office-inbox': '1' },
    })
    if (!res.ok) return
    const { messages } = JSON.parse(res.text) as { messages?: ChatMessage[] }
    for (const message of messages ?? []) await deliver($, message)
  } catch {
    // The bridge went away; flush() notices and restarts it.
  } finally {
    link.isCheckingInbox = false
  }
}

async function openBrowser($: EngineInterface) {
  const url = bridgeUrl()
  for (const argv of [['open', url], ['xdg-open', url], ['cmd', '/c', 'start', url]]) {
    const ran = await $.process.run(argv, { timeoutMs: 5000 }).catch(() => undefined)
    if (ran?.exitCode === 0) return true
  }
  return false
}

// The /context breakdown: what fills the main window, row by row.
async function sendBreakdown($: EngineInterface) {
  const usage = await $.session.usage({ breakdown: 'summary' }).catch(() => undefined)
  const breakdown = usage?.context.breakdown
  if (!breakdown) return
  emit({
    kind: 'context.breakdown',
    window: breakdown.rawMaxTokens,
    used: breakdown.totalTokens,
    categories: breakdown.categories
      .filter(c => !c.isDeferred)
      .map(c => ({ name: c.name, tokens: c.tokens, kind: c.kind })),
  })
}

export const register: Register = (on, options) => {
  link.port = Number(options.port ?? 7337)
  link.autoStart = options.autoStart !== false

  on('session.start', async ($, e, next) => {
    const started = await next(e)
    link.session = await $.session.id()
    const repo = await $.session.repo().catch(() => null)
    emit({
      kind: 'session.start',
      cwd: e.cwd,
      model: await $.session.model(),
      project: projectOf(e.cwd, repo),
    })

    link.isBridgeUp = await isHealthy($)
    if (!link.isBridgeUp && link.autoStart) startBridge($)

    await $.command.register({
      name: 'office',
      description: 'Open Agent Office, the live view of your sessions and subagents (`/office status` to check on it).',
    })
    $.clock.every(FLUSH_MS, () => void flush($))
    $.clock.every(INBOX_MS, () => void checkInbox($))

    // Once per machine: say how to open it.
    if (!(await $.store.get(WELCOMED).catch(() => true))) {
      await $.store.set(WELCOMED, true).catch(() => undefined)
      $.ui.toast('Agent Office is on. Type /office to watch your sessions at work.', { timeoutMs: 8000 })
    }
    return started
  })

  on('command.run', { command: 'office' }, async ($, e) => {
    const url = bridgeUrl()
    const arg = (e.args ?? '').trim().toLowerCase()
    if (arg === 'status') return { text: await status($) }
    if (arg && arg !== 'open') return { text: 'Usage: /office (open the office) or /office status' }

    if (!(await isHealthy($))) {
      if (!link.autoStart) return { text: `No bridge on ${url}. Start one with: node ${$.plugin.root}/server/server.mjs --port ${link.port}` }
      const problem = nodeProblem(await nodeVersion($))
      if (problem) return { text: problem }
      startBridge($)
      // Wait for it to answer, then carry on and open the page.
      const until = Date.now() + BRIDGE_WAIT_MS
      while (!(await isHealthy($))) {
        if (Date.now() > until) return { text: `The bridge didn't answer on ${url}. Is port ${link.port} taken by something else? Try /office status, or set another port in this plugin's options.` }
        await $.clock.sleep(250)
      }
      link.isBridgeUp = true
    }
    const isOpened = await openBrowser($)
    return { text: isOpened ? `Opened Agent Office at ${url}` : `Agent Office is at ${url}` }
  })

  on('session.end', async ($, e, next) => {
    emit({ kind: 'session.end', reason: e.reason, resumeId: e.resume.id })
    await flush($)
    return next(e)
  })

  // The live meter: fires whenever the window, the cost or the limits move.
  on('session.measure', async ($, e, next) => {
    const measured = await next(e)
    emit({
      kind: 'context.measure',
      context: { tokens: e.context.tokens, window: e.context.window, percent: e.context.percent },
      ...(e.cost && { costUsd: e.cost.usd }),
      rateLimits: e.rateLimits.map(r => ({ kind: r.kind, percentUsed: r.percentUsed, resetsAt: r.resetsAt })),
    })
    return measured
  })

  on('session.compact', async ($, e, next) => {
    const compacted = await next(e)
    if (compacted.skip === undefined && e.trigger !== 'precompute') {
      emit({
        kind: 'context.compact',
        agent: e.agentId,
        trigger: e.trigger,
        before: compacted.tokensBefore,
        after: compacted.tokensAfter,
      })
      if (e.agentId === undefined) await sendBreakdown($)
    }
    return compacted
  })

  // One model request: its input is what that loop's context holds now.
  on('turn.step', async function* ($, e, next) {
    const step = yield* next(e)
    if (step?.usage) {
      emit({
        kind: 'agent.context',
        agent: e.agentId,
        tokens: contextTokens(step.usage),
        model: step.usage.model,
      })
    }
    return step
  })

  on('turn.start', async ($, e, next) => {
    emit({ kind: 'turn.start', turnId: e.turnId, text: summarize({ prompt: e.text }) })
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const agent = e.agentId
    emit({ kind: 'turn.complete', agent, turnId: e.turnId, durationMs: e.durationMs, reason: e.reason, answer: clip(e.answer) })
    if (agent === undefined) {
      await sendBreakdown($)
    } else if (link.teammates.has(agent)) {
      // A teammate waits for its next message rather than ending.
      emit({ kind: 'agent.idle', agent })
    } else {
      // A subagent's run ending: ask the engine where its loop stands, since
      // one still holding background work or a plan isn't finished.
      void settleAgent($, agent)
    }
    showStatus($)
    return next(e)
  })

  // A delivery from outside: the project's coordinator handing this thread
  // work, another session, a channel. It marks a project thread as one.
  on('session.receive', async ($, e, next) => {
    const kind = e.origin.kind
    if (kind === 'projects-relay') emit({ kind: 'session.thread' })
    const isOwnTeam = (kind === 'peer' || kind === 'coordinator') && 'isVerified' in e.origin && e.origin.isVerified
    if (OUTSIDE.has(kind) || ((kind === 'peer' || kind === 'coordinator') && !isOwnTeam)) {
      emit({
        kind: 'agent.message', to: e.agentId, via: kind,
        fromName: 'teammate' in e.origin ? e.origin.teammate : undefined,
        text: clip(e.text, 160),
      })
    }
    return next(e)
  })

  // One of this session's loops messaging another (SendMessage), or a
  // plugin doing so: who talks to whom.
  on('session.send', async ($, e, next) => {
    const sent = await next(e)
    // The office's own messages are already on the page as chat.
    if (e.origin.kind === 'plugin' && e.origin.name === $.plugin.name) return sent
    if (sent.isDelivered !== true) return sent
    emit({
      kind: 'agent.message', from: e.agentId, via: e.origin.kind,
      ...(link.activeAgents.has(e.to) ? { to: e.to } : { toName: e.to }),
      text: clip(e.text, 160),
    })
    return sent
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.origin.kind === 'projects-relay') emit({ kind: 'session.thread' })
    return next(e)
  })

  on('agent.spawn', async ($, e, next) => {
    const spawned = await next(e)
    if (spawned.agentId !== undefined) {
      emit({
        kind: 'agent.spawn',
        agent: spawned.agentId,
        parent: e.parentAgentId,
        type: e.subagentType,
        name: e.name,
        description: e.description,
        model: spawned.model,
        background: e.background,
        teammate: e.isTeammate === true,
        ...(spawned.teammateId && { teammateId: spawned.teammateId }),
        ...(e.fork && { fork: true }),
        ...(e.cwd && { cwd: e.cwd }),
      })
      link.activeAgents.add(spawned.agentId)
      if (e.isTeammate) link.teammates.add(spawned.agentId)
      showStatus($)
    }
    return spawned
  })

  on('tool.call', async ($, e, next) => {
    if (SPAWN_TOOLS.has(String(e.tool))) return next(e)

    const base = { agent: e.agentId, id: e.tool_use_id, tool: e.tool }
    emit({ kind: 'tool.start', ...base, summary: summarize(e as unknown as Record<string, unknown>) })
    link.activeTools++
    showStatus($)
    let ok = false
    try {
      const ran = await next(e)
      ok = ran.deny === undefined && ran.isError !== true
      return ran
    } finally {
      link.activeTools--
      emit({ kind: 'tool.end', ...base, ok })
      showStatus($)
    }
  })
}
