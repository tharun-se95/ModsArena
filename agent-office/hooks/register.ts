import type { EngineInterface, Register } from 'claude-code'

// Streams this session's projects, agents, tool calls and context to the
// Agent Office bridge (server/server.mjs), which fans it out to the office
// page. `/office` opens the page (starting the bridge first if need be),
// `/office status` says what's running, and `/office auto-update` lets new
// versions arrive on their own (server/autoupdate.mjs does the writing).
// Messages you send from the office come back through the bridge's inbox:
// to the session as its next prompt, to a subagent as a message, or Stop,
// which ends the running turn (see deliver()).
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
// When the toast last offered auto-update, and whether you said no to it.
const UPDATES_OFFERED = 'updatesOfferedAt'
const UPDATES_DECLINED = 'updatesDeclined'
const OFFER_EVERY_MS = 7 * 24 * 60 * 60 * 1000
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
  version: undefined as string | undefined,
  // The main loop's running turn, which Stop in the office ends.
  turnId: undefined as string | undefined,
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

// Stamped with the session when sent, not now: the engine can report (a
// context reading, say) before session.start has told us whose it is.
function emit(ev: ClusterEvent) {
  const stamped = { t: Date.now(), ...ev }
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

type Health = { ok?: boolean; version?: string; managed?: boolean; events?: number; viewers?: number }

// What the bridge on the port says about itself, or undefined if none answers.
async function health($: EngineInterface): Promise<Health | undefined> {
  try {
    const res = await $.http.fetch(`${bridgeUrl()}/healthz`)
    if (!res.ok) return undefined
    try {
      return JSON.parse(res.text) as Health
    } catch {
      return { ok: true }
    }
  } catch {
    return undefined
  }
}

const isHealthy = async ($: EngineInterface) => (await health($)) !== undefined

// Whether version `a` is newer than `b` (plain x.y.z).
export function isNewer(a: string, b: string): boolean {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0)
    if (d !== 0) return d > 0
  }
  return false
}

// This copy's version, from its own plugin.json.
async function ownVersion($: EngineInterface) {
  if (link.version === undefined) {
    try {
      link.version = (JSON.parse(await $.fs.read(`${$.plugin.root}/.claude-plugin/plugin.json`)) as { version?: string }).version
    } catch {
      link.version = undefined
    }
  }
  return link.version
}

// A bridge this plugin started from an older copy: the bridge outlives the
// session that started it, so after an update it would go on serving the old
// page. Bridges people start themselves (npx, node server.mjs) are left alone.
export function isStale(found: Health | undefined, mine: string | undefined) {
  return Boolean(found?.managed && found.version && mine && isNewer(mine, found.version))
}

// The bridge runs on Node; say plainly when it's missing or too old.
export function nodeProblem(version: string | undefined): string | undefined {
  const fix = 'Install the LTS version from https://nodejs.org, then restart Claude Code and run /office again.'
  if (!version) return `Agent Office needs Node ${MIN_NODE} or newer, a free program it runs on, and this computer doesn't have it. ${fix}`
  const major = Number(/^v?(\d+)/.exec(version.trim())?.[1] ?? 0)
  if (major < MIN_NODE) return `Agent Office needs Node ${MIN_NODE} or newer, a free program it runs on; this computer has an older one (${version.trim()}). ${fix}`
  return undefined
}

async function nodeVersion($: EngineInterface) {
  const ran = await $.process.run(['node', '--version'], { timeoutMs: 5000 }).catch(() => undefined)
  return ran?.exitCode === 0 ? ran.stdout : undefined
}

// The child lives as long as this loop, which lives as long as the module.
// With `replace`, it asks a stale bridge on the port to step down and takes over.
function startBridge($: EngineInterface, replace = false) {
  link.lastSpawnAt = Date.now()
  void (async () => {
    try {
      const child = $.process.spawn({
        argv: ['node', `${$.plugin.root}/server/server.mjs`, '--port', String(link.port), '--managed', ...(replace ? ['--replace'] : [])],
      })
      for await (const { text } of child) $.ui.log(text.trimEnd(), { to: 'debug' })
    } catch (err) {
      $.ui.log(`agent-office: bridge did not start: ${String(err)}`, { to: 'debug' })
    }
  })()
}

async function flush($: EngineInterface) {
  if (link.isFlushing || link.queue.length === 0 || link.session === 'unknown') return
  link.isFlushing = true
  const batch = link.queue.map(ev => ({ session: link.session, ...ev }))
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

// ---------------------------------------------------------------------------
// Auto-update. Claude Code keeps the switch in your user settings; the
// bridge's server/autoupdate.mjs reads and writes it (backing the file up
// first and changing that one key), run here with Node like the bridge.

export type Updates = { state: 'on' | 'off' | 'missing'; pending?: boolean; text: string; summary: string; error?: string }

async function updates($: EngineInterface, verb: 'status' | 'on' | 'off'): Promise<Updates | undefined> {
  const ran = await $.process.run(['node', `${$.plugin.root}/server/autoupdate.mjs`, verb, '--json'], { timeoutMs: 10000 }).catch(() => undefined)
  try {
    return ran ? (JSON.parse(ran.stdout) as Updates) : undefined
  } catch {
    return undefined
  }
}

// `/office <words>`: what to do, or undefined for words it doesn't know.
export function parseOffice(args: string | undefined): { verb: 'open' | 'status' | 'auto-update'; on?: boolean } | undefined {
  const [verb = 'open', value, ...rest] = (args ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean)
  if ((verb === 'open' || verb === 'status') && value === undefined) return { verb }
  if (verb !== 'auto-update' && verb !== 'autoupdate') return undefined
  if (rest.length || (value !== undefined && value !== 'on' && value !== 'off')) return undefined
  return { verb: 'auto-update', on: value !== 'off' }
}

export const OFFICE_USAGE = 'Usage: /office (open the office), /office status, or /office auto-update [on | off]'

// The once-per-machine welcome, offering auto-update while it's off.
export function welcomeText(state: Updates['state'] | undefined) {
  return `Agent Office is on. Type /office to watch your sessions at work.${state === 'off' ? ' To get new versions on their own, type /office auto-update.' : ''}`
}
export const OFFER_TEXT = 'Agent Office: new versions don\'t arrive on their own yet. Type /office auto-update to turn that on (or /office auto-update off to stop this reminder).'

// The welcome, once per machine; after that the offer at most once a week,
// while auto-update is off and you haven't said no to it.
async function offerUpdates($: EngineInterface, isWelcome: boolean) {
  const now = await $.clock.now()
  const isDeclined = Boolean(await $.store.get(UPDATES_DECLINED).catch(() => true))
  const offeredAt = Number((await $.store.get(UPDATES_OFFERED).catch(() => now)) ?? 0)
  const isDue = !isDeclined && now - offeredAt >= OFFER_EVERY_MS
  const found = isWelcome || isDue ? await updates($, 'status') : undefined
  const isOffered = found?.state === 'off' && (isWelcome ? !isDeclined : isDue)
  if (isWelcome) $.ui.toast(welcomeText(isOffered ? 'off' : undefined), { timeoutMs: 12000 })
  else if (isOffered) $.ui.toast(OFFER_TEXT, { timeoutMs: 12000 })
  if (isOffered) await $.store.set(UPDATES_OFFERED, now).catch(() => undefined)
}

// What `/office status` reports: the bridge, what it has seen, this session.
async function status($: EngineInterface) {
  const url = bridgeUrl()
  const lines: string[] = []
  const found = await health($)
  const mine = await ownVersion($)
  if (found) {
    lines.push(`Bridge: running on ${url}${found.version ? ` (${found.version})` : ''}, ${found.events ?? 0} events so far, ${found.viewers ?? 0} page${found.viewers === 1 ? '' : 's'} open.`)
    if (isStale(found, mine)) lines.push(`It's from an older Agent Office than this one (${mine}); /office restarts it.`)
    else if (mine && !found.version) lines.push(`It's from an older Agent Office than this one (${mine}). It stops when the session that started it ends.`)
  } else {
    const problem = nodeProblem(await nodeVersion($))
    lines.push(`Bridge: not running on ${url}.${problem ? ` ${problem}` : link.autoStart ? ' /office starts it.' : ` Start one with: node ${$.plugin.root}/server/server.mjs --port ${link.port}`}`)
  }
  const now = await updates($, 'status')
  if (now) lines.push(now.summary)
  lines.push(`This session: ${link.queue.length} event${link.queue.length === 1 ? '' : 's'} waiting to send, ${link.activeAgents.size} subagent${link.activeAgents.size === 1 ? '' : 's'} and ${link.activeTools} tool call${link.activeTools === 1 ? '' : 's'} in flight.`)
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// What the work asks and makes: the checklist (TodoWrite, or the Task tools'
// list), questions Claude Code holds a turn for (AskUserQuestion, a plan to
// approve), and outputs (pictures, files, artifacts, pull requests).

type Todo = { text: string; status: string; active?: string }
const tasks = new Map<string, Map<string, Todo>>() // loop ('' for main) -> task id -> task
const PICTURE = /\.(png|jpe?g|gif|webp|svg)$/i
const FILE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit'])
const PR_URL = /https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+/

const str = (v: unknown) => (typeof v === 'string' ? v : undefined)
const fileName = (path: string) => path.split(/[\\/]/).pop() ?? path

// Additions and deletions from a file tool's patch.
export function diffStats(result: Record<string, unknown> | undefined) {
  const git = result?.gitDiff as { additions?: number; deletions?: number } | undefined
  if (git?.additions !== undefined) return { additions: git.additions, deletions: git.deletions ?? 0 }
  const hunks = result?.structuredPatch as { lines?: string[] }[] | undefined
  if (!Array.isArray(hunks)) return undefined
  let additions = 0
  let deletions = 0
  for (const h of hunks) for (const l of h.lines ?? []) {
    if (l.startsWith('+')) additions++
    else if (l.startsWith('-')) deletions++
  }
  return { additions, deletions }
}

// What a question was answered with, as one line.
export function answerOf(result: Record<string, unknown> | undefined) {
  const answers = result?.answers
  if (!answers || typeof answers !== 'object') return undefined
  return clip(Object.values(answers as Record<string, unknown>).map(a => (Array.isArray(a) ? a.join(', ') : String(a))).join(' · '), 120)
}

// Before the tool runs: a checklist written, a question or plan put to you.
export function beforeTool(e: Record<string, unknown>): ClusterEvent[] {
  const agent = str(e.agentId)
  const id = str(e.tool_use_id) ?? `${e.tool}-${Date.now()}`
  if (e.tool === 'TodoWrite' && Array.isArray(e.todos)) {
    const items = (e.todos as { content?: string; status?: string; activeForm?: string }[])
      .map(t => ({ text: clip(t.content, 120) ?? '', status: t.status ?? 'pending', active: clip(t.activeForm, 120) }))
    return [{ kind: 'todo.update', agent, items }]
  }
  if (e.tool === 'AskUserQuestion' && Array.isArray(e.questions)) {
    const questions = (e.questions as Record<string, unknown>[]).map(q => ({
      header: clip(str(q.header), 24), question: clip(str(q.question), 300), multiSelect: q.multiSelect === true,
      options: (Array.isArray(q.options) ? q.options as Record<string, unknown>[] : []).map(o => ({ label: clip(str(o.label), 60), description: clip(str(o.description), 160) })),
    }))
    return [{ kind: 'ask.open', agent, id, type: 'question', questions }]
  }
  if (e.tool === 'ExitPlanMode') return [{ kind: 'ask.open', agent, id, type: 'plan', plan: str(e.plan)?.slice(0, 4000) }]
  return []
}

// After it ran: the question answered, the list's new state, what was made.
export function afterTool(e: Record<string, unknown>, ran: { result?: unknown; text?: string; deny?: string; isError?: boolean } | undefined): ClusterEvent[] {
  const agent = str(e.agentId)
  const id = str(e.tool_use_id) ?? `${e.tool}-${Date.now()}`
  const ok = ran !== undefined && ran.deny === undefined && ran.isError !== true
  const result = (ran?.result && typeof ran.result === 'object' ? ran.result : undefined) as Record<string, unknown> | undefined
  const out: ClusterEvent[] = []
  if (e.tool === 'AskUserQuestion') out.push({ kind: 'ask.close', agent, id, answer: ok ? answerOf(result) : 'Not answered' })
  if (e.tool === 'ExitPlanMode') {
    out.push({ kind: 'ask.close', agent, id, answer: ok ? 'Approved' : 'Kept planning' })
    const plan = str(result?.plan) ?? str(e.plan)
    if (ok && plan) out.push({ kind: 'asset.add', agent, id: `plan-${id}`, type: 'plan', title: clip(plan.replace(/^#+\s*/gm, '').split('\n').find(l => l.trim()), 80) ?? 'Plan', text: plan.slice(0, 4000) })
  }
  if (!ok) return out
  // The Task tools keep a list per loop; the office gets it whole.
  if (e.tool === 'TaskCreate' || e.tool === 'TaskUpdate') {
    const loop = agent ?? ''
    if (!tasks.has(loop)) tasks.set(loop, new Map())
    const list = tasks.get(loop)!
    if (e.tool === 'TaskCreate') {
      const task = result?.task as { id?: string } | undefined
      if (task?.id) list.set(task.id, { text: clip(str(e.subject), 120) ?? '', status: 'pending', active: clip(str(e.activeForm), 120) })
    } else {
      const taskId = str(e.taskId) ?? ''
      const had = list.get(taskId)
      if (e.status === 'deleted') list.delete(taskId)
      else if (had || e.subject) list.set(taskId, { ...(had ?? { text: '', status: 'pending' }), ...(str(e.subject) && { text: clip(str(e.subject), 120)! }), ...(str(e.status) && { status: str(e.status)! }) })
    }
    out.push({ kind: 'todo.update', agent, items: [...list.values()] })
  }
  const path = str(e.file_path) ?? str(e.notebook_path)
  if (FILE_TOOLS.has(String(e.tool)) && path) {
    out.push(PICTURE.test(path)
      ? { kind: 'asset.add', agent, id: `img-${path}`, type: 'image', title: fileName(path), path }
      : { kind: 'asset.add', agent, id: `file-${path}`, type: 'file', title: fileName(path), path, meta: diffStats(result) })
  }
  if (e.tool === 'Read' && path && result?.type === 'image') out.push({ kind: 'asset.add', agent, id: `img-${path}`, type: 'image', title: fileName(path), path })
  if (e.tool === 'SendUserFile' && Array.isArray(result?.attachments)) {
    for (const a of result!.attachments as { path?: string; isImage?: boolean }[]) {
      if (a.path) out.push({ kind: 'asset.add', agent, id: `${a.isImage ? 'img' : 'file'}-${a.path}`, type: a.isImage ? 'image' : 'file', title: str(e.caption) ?? fileName(a.path), path: a.path })
    }
  }
  if (e.tool === 'Artifact' && str(result?.url)) out.push({ kind: 'asset.add', agent, id: `artifact-${result!.url}`, type: 'artifact', title: str(result?.title) ?? str(e.title) ?? 'Artifact', url: result!.url })
  if (/create_pull_request$/.test(String(e.tool))) {
    const url = PR_URL.exec(ran?.text ?? '')?.[0]
    if (url) out.push({ kind: 'asset.add', agent, id: `pr-${url}`, type: 'pr', title: clip(str(e.title), 120) ?? url, url, meta: { state: e.draft ? 'draft' : 'open' } })
  }
  return out
}

// ---------------------------------------------------------------------------
// Answering from the office. Claude Code's own dialog stays up the whole
// time; meanwhile the hook asks the bridge, a long poll at a time, whether
// you answered on the office page. Whichever answer comes first is the
// tool's: an office answer returned while the dialog is pending makes the
// engine take the dialog down. Approving a plan also switches Claude Code
// out of plan mode, which a plugin can't do, so the office can only send a
// plan back ("keep planning"); approving stays in the terminal.

const ANSWERABLE = new Set(['AskUserQuestion', 'ExitPlanMode'])
// How long the office keeps offering to answer one ask; after that only the
// terminal can, as before.
const OFFICE_ANSWER_MS = 30 * 60 * 1000
const WAIT_FAILURES = 3

type OfficeAnswer = { answers?: Record<string, string>; note?: string; choice?: string }

// The tool's result for an answer given in the office: a question's
// answers, keyed by question as Claude Code's dialog keys them; a plan sent
// back as a refusal that says why. A note fills any question left open, or
// reaches the model after the result.
export function officeResult(e: Record<string, unknown>, answer: OfficeAnswer) {
  const note = clip(answer.note, 2000)
  if (e.tool === 'ExitPlanMode') {
    return { deny: `The user read your plan in Agent Office and wants you to keep planning before you start.${note ? ` Their note: ${note}` : ''}` }
  }
  const questions = (Array.isArray(e.questions) ? e.questions : []) as { question: string }[]
  const answers: Record<string, string> = {}
  for (const q of questions) {
    const given = answer.answers?.[q.question] ?? note
    if (given) answers[q.question] = given
  }
  const isNoteUsed = note !== undefined && questions.some(q => answer.answers?.[q.question] === undefined)
  return {
    result: { questions, answers },
    ...(note && !isNoteUsed && { context: [`The user also wrote, answering from Agent Office: ${note}`] }),
  }
}

// Wait for the office's answer: undefined when the terminal answered first
// (`settled`), the ask closed, the bridge stopped answering or time ran out.
async function officeAnswer($: EngineInterface, id: string, settled: { isDone: boolean }) {
  const until = Date.now() + OFFICE_ANSWER_MS
  let failures = 0
  while (!settled.isDone && Date.now() < until) {
    try {
      const res = await $.http.fetch(`${bridgeUrl()}/answer/wait?${new URLSearchParams({ session: link.session, id })}`, {
        headers: { 'x-agent-office-inbox': '1' },
      })
      if (!res.ok) return undefined // a bridge from before answers existed
      const got = JSON.parse(res.text) as { answer?: OfficeAnswer; closed?: boolean }
      if (got.closed) return undefined
      if (got.answer) return got.answer
      failures = 0
    } catch {
      if (++failures >= WAIT_FAILURES) return undefined
    }
  }
  return undefined
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

type ChatMessage = { id: string; agent?: string; text: string; action?: string }

// Messages from the office for this session. A session's message becomes
// its next prompt (the engine queues it until the session is free), framed
// as coming from this plugin; a subagent's goes to it directly, and a
// finished one is resumed to answer. Either way the office hears back.
export async function deliver($: EngineInterface, message: ChatMessage) {
  try {
    if (message.action === 'stop') {
      // Stop from the office: end the running turn, as Esc would.
      const turnId = link.turnId
      if (!turnId) return emit({ kind: 'chat.delivered', id: message.id, ok: false, how: 'nothing was running' })
      await $.turn.abort({ turnId })
      emit({ kind: 'chat.delivered', id: message.id, ok: true, how: 'stopped its turn' })
    } else if (message.agent) {
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

    const found = await health($)
    link.isBridgeUp = found !== undefined
    if (!link.isBridgeUp && link.autoStart) startBridge($)
    // After an update, swap out the old bridge, unless someone is watching it.
    else if (link.autoStart && isStale(found, await ownVersion($)) && !found?.viewers) startBridge($, true)

    await $.command.register({
      name: 'office',
      description: 'Open Agent Office, the live view of your sessions and subagents (`/office status` to check on it, `/office auto-update` for new versions on their own).',
    })
    $.clock.every(FLUSH_MS, () => void flush($))
    $.clock.every(INBOX_MS, () => void checkInbox($))

    // Once per machine: say how to open it, and offer auto-update while
    // it's off (then now and again, until it's on or you say no).
    const isWelcome = !(await $.store.get(WELCOMED).catch(() => true))
    if (isWelcome) await $.store.set(WELCOMED, true).catch(() => undefined)
    void offerUpdates($, isWelcome)
    return started
  })

  on('command.run', { command: 'office' }, async ($, e) => {
    const url = bridgeUrl()
    const asked = parseOffice(e.args)
    if (!asked) return { text: OFFICE_USAGE }
    if (asked.verb === 'status') return { text: await status($) }
    if (asked.verb === 'auto-update') {
      const problem = nodeProblem(await nodeVersion($))
      if (problem) return { text: problem }
      const result = await updates($, asked.on ? 'on' : 'off')
      if (!result) return { text: `Couldn't change auto-update. Try it from /plugin → Marketplaces → modsarena.` }
      // Saying off on purpose stops the reminder; on makes it moot.
      if (result.state !== 'missing') await $.store.set(UPDATES_DECLINED, !asked.on).catch(() => undefined)
      return { text: result.text }
    }

    const found = await health($)
    const mine = await ownVersion($)
    const isOutdated = link.autoStart && isStale(found, mine)
    if (!found || isOutdated) {
      if (!link.autoStart) return { text: `No bridge on ${url}. Start one with: node ${$.plugin.root}/server/server.mjs --port ${link.port}` }
      const problem = nodeProblem(await nodeVersion($))
      if (problem) return { text: problem }
      startBridge($, isOutdated)
      // Wait for this copy's bridge to answer, then carry on and open the page.
      const until = Date.now() + BRIDGE_WAIT_MS
      const isReady = async () => {
        const now = await health($)
        return now !== undefined && !isStale(now, mine)
      }
      while (!(await isReady())) {
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
    link.turnId = e.turnId
    emit({ kind: 'turn.start', turnId: e.turnId, text: summarize({ prompt: e.text }) })
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const agent = e.agentId
    emit({ kind: 'turn.complete', agent, turnId: e.turnId, durationMs: e.durationMs, reason: e.reason, answer: clip(e.answer) })
    if (agent === undefined) {
      if (link.turnId === e.turnId) link.turnId = undefined
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
    const fields = e as unknown as Record<string, unknown>
    emit({ kind: 'tool.start', ...base, summary: summarize(fields) })
    // A question or plan the office may answer, while the bridge is there to carry it.
    const isAnswerable = ANSWERABLE.has(String(e.tool)) && link.isBridgeUp && link.session !== 'unknown' && typeof e.tool_use_id === 'string'
    for (const ev of beforeTool(fields)) emit(ev.kind === 'ask.open' && isAnswerable ? { ...ev, answerable: true } : ev)
    link.activeTools++
    showStatus($)
    let ok = false
    let ran: Awaited<ReturnType<typeof next>> | undefined
    try {
      let answer: NonNullable<typeof ran>
      if (isAnswerable) {
        // The terminal's dialog and the office, side by side.
        const settled = { isDone: false }
        const core = next(e)
        core.then(() => { settled.isDone = true }, () => { settled.isDone = true })
        const office = officeAnswer($, e.tool_use_id, settled).then(a => (a ? officeResult(fields, a) as typeof answer : core))
        answer = await Promise.race([core, office])
        settled.isDone = true
      } else {
        answer = await next(e)
      }
      ran = answer
      ok = answer.deny === undefined && answer.isError !== true
      return answer
    } finally {
      link.activeTools--
      emit({ kind: 'tool.end', ...base, ok })
      for (const ev of afterTool(fields, ran as Parameters<typeof afterTool>[1])) emit(ev)
      showStatus($)
    }
  })
}
