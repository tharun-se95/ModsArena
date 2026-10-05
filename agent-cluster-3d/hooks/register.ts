import type { EngineInterface, Register } from 'claude-code'

// Streams this session's projects, agents, tool calls and context to the
// cluster-3d bridge (server/server.mjs), which fans it out to the visualizer.
//
// Hooks run in a sandbox with no Node, so events are queued here and flushed
// over `$.http.fetch` on a timer: a tool call never waits on the bridge.

type ClusterEvent = { kind: string; [field: string]: unknown }

const SPAWN_TOOLS = new Set(['Agent', 'Task'])
const FLUSH_MS = 250
const QUEUE_LIMIT = 2000
const RESPAWN_MS = 15000
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
      ? `◉ cluster ${agents} agent${agents === 1 ? '' : 's'} · ${tools} tool${tools === 1 ? '' : 's'}`
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
      $.ui.log(`agent-cluster-3d: bridge did not start: ${String(err)}`, { to: 'debug' })
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
      name: 'cluster3d',
      description: 'Open the live 3D cluster of your projects, sessions, agents and context.',
    })
    $.clock.every(FLUSH_MS, () => void flush($))
    return started
  })

  on('command.run', { command: 'cluster3d' }, async $ => {
    const url = bridgeUrl()
    if (!(await isHealthy($))) {
      if (!link.autoStart) return { text: `No bridge on ${url}. Start it with: node ${$.plugin.root}/server/server.mjs` }
      startBridge($)
      return { text: `Starting the bridge on ${url}; run /cluster3d again in a moment.` }
    }
    const isOpened = await openBrowser($)
    return { text: isOpened ? `Opened the visualizer at ${url}` : `Visualizer: ${url}` }
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
    emit({ kind: 'turn.complete', agent, turnId: e.turnId, durationMs: e.durationMs, reason: e.reason })
    if (agent === undefined) {
      await sendBreakdown($)
    } else if (link.teammates.has(agent)) {
      // A teammate waits for its next message rather than ending.
      emit({ kind: 'agent.idle', agent })
    } else {
      // A subagent's loop completing is the subagent finishing.
      emit({ kind: 'agent.end', agent })
      link.activeAgents.delete(agent)
    }
    showStatus($)
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
