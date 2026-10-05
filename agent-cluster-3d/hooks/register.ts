import type { EngineInterface, Register } from 'claude-code'

// Streams this session's agent topology to the cluster-3d bridge
// (server/server.mjs), which fans it out to the 3D visualizer.
//
// Hooks run in a sandbox with no Node, so events are queued here and flushed
// over `$.http.fetch` on a timer: a tool call never waits on the bridge.

type ClusterEvent = { kind: string; [field: string]: unknown }

const SPAWN_TOOLS = new Set(['Agent', 'Task'])
const FLUSH_MS = 250
const QUEUE_LIMIT = 2000
const RESPAWN_MS = 15000

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

function emit(ev: ClusterEvent) {
  link.queue.push({ t: Date.now(), session: link.session, ...ev })
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

export const register: Register = (on, options) => {
  link.port = Number(options.port ?? 7337)
  link.autoStart = options.autoStart !== false

  on('session.start', async ($, e, next) => {
    const started = await next(e)
    link.session = await $.session.id()
    emit({ kind: 'session.start', cwd: e.cwd, model: await $.session.model() })

    link.isBridgeUp = await isHealthy($)
    if (!link.isBridgeUp && link.autoStart) startBridge($)

    await $.command.register({
      name: 'cluster3d',
      description: 'Open the live 3D cluster of this session\'s agents and tools.',
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
    emit({ kind: 'session.end' })
    await flush($)
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    emit({ kind: 'turn.start', turnId: e.turnId, text: summarize({ prompt: e.text }) })
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId !== undefined) {
      // A subagent's loop completing is the subagent finishing.
      emit({ kind: 'turn.complete', agent: e.agentId, turnId: e.turnId, durationMs: e.durationMs, reason: e.reason })
      emit({ kind: 'agent.end', agent: e.agentId })
      link.activeAgents.delete(e.agentId)
    } else {
      const usage = await $.session.usage().catch(() => undefined)
      const context = usage?.context
      emit({
        kind: 'turn.complete', turnId: e.turnId, durationMs: e.durationMs, reason: e.reason,
        ...(context && { context: { tokens: context.tokens, window: context.window, percent: context.percent } }),
      })
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
        description: e.description,
        model: spawned.model,
        background: e.background,
      })
      link.activeAgents.add(spawned.agentId)
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
