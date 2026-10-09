// Plain-language reading of the event stream: what each session has been
// doing, the files it touched, and the moments worth telling you about.
// Pure bookkeeping over model.js; it knows nothing about Three.js.

import { nodes, sid, aid, mail } from './model.js'
import { describe } from './plain.js'
import { devView } from './prefs.js'
import { projectName } from './names.js'
import { who as critter } from './critters.js'

const ACTION_KEEP = 30
const MOMENT_KEEP = 40

export const moments = [] // newest first: { t, text, tone, target }
export const activity = new Map() // session node id -> { actions, files }
export let lastAction = null // { session, text }

export function reset() {
  moments.length = 0
  turnOf.clear()
  activity.clear()
  lastAction = null
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

export const quote = s => `“${s}”`
const base = path => String(path).split(/[\\/]/).filter(Boolean).pop() ?? path

// Families of tools, by what they do to your work. `bead` names the
// palette color of the small bead a call releases on the table.
const FAMILIES = [
  { test: t => ['Read', 'NotebookRead'].includes(t), done: 'read', try: 'read', bead: 'sky', file: 'read' },
  { test: t => ['Edit', 'MultiEdit', 'Write', 'NotebookEdit'].includes(t), done: 'edited', try: 'edit', bead: 'coral', file: 'edit' },
  { test: t => ['Grep', 'Glob', 'LS'].includes(t), done: 'searched for', try: 'search for', bead: 'leaf' },
  { test: t => ['WebFetch', 'WebSearch'].includes(t), done: 'looked up', try: 'look up', bead: 'lilac' },
  { test: t => ['Bash', 'BashOutput', 'PowerShell'].includes(t), done: 'ran', try: 'run', bead: 'mustard' },
  { test: t => ['Task', 'Agent'].includes(t), done: 'handed off', try: 'hand off', bead: 'teal' },
  { test: t => t === 'TodoWrite', done: 'updated its todo list', try: 'update its todo list', bead: 'line', bare: true },
  { test: t => t.startsWith('mcp__'), mcp: true, bead: 'lilac' },
]

export function family(tool) {
  return FAMILIES.find(f => f.test(tool ?? '')) ?? { done: 'used', try: 'use', bead: 'line', other: true }
}

export const beadColor = tool => family(tool).bead

// "read session.ts", "ran npm test", "used github's list_pull_requests".
function phrase(tool, summary, ok) {
  const f = family(tool)
  if (f.mcp) {
    const [, server, name] = tool.split('__')
    return `${ok ? 'used' : 'couldn’t use'} ${server}’s ${name ?? 'tool'}`
  }
  if (f.bare) return ok ? f.done : `couldn’t ${f.try}`
  const what = f.file && summary ? base(summary) : summary ?? (f.other ? tool : '')
  const target = f.other ? `${tool}${summary ? ` on ${summary}` : ''}` : what
  return `${ok ? f.done : `couldn’t ${f.try}`} ${target}`.trim()
}

const sessionName = session => nodes.get(sid(session))?.label ?? 'A session'
const who = ev => (ev.agent ? (nodes.get(aid(ev.session, ev.agent))?.label ?? 'A subagent') : 'The session')
// The same, by the critter's first name, for the plain-words lines.
const named = ev => {
  const n = ev.agent && nodes.get(aid(ev.session, ev.agent))
  return n ? critter(n).name : ev.agent ? 'A helper' : 'The session'
}

// `raw` is how Developer view says the same moment, when it differs.
//
// Tones keep the feed calm: outcomes lead (`done` finished, `made`
// something, `ask` asked you), `bumps` folds the errors Claude worked past
// into one quiet line per turn, `quiet` is the comings and goings, and
// only real blockers (`block`: a turn that ended on an error, a question
// waiting on you) turn red, until they're dealt with.
function moment(ev, text, tone = '', target = sid(ev.session), raw, extra) {
  const m = { t: ev.t, text, tone, target, ...(raw && { raw }), ...extra }
  moments.unshift(m)
  if (moments.length > MOMENT_KEEP) moments.pop()
  return m
}

const byKey = key => moments.find(m => m.key === key)

// Move a moment back to the top, as of now.
function bump(m, t) {
  moments.splice(moments.indexOf(m), 1)
  moments.unshift(m)
  m.t = t
}

const turnOf = new Map() // session -> its current turn's number
const clipText = (text, n) => {
  const line = String(text).replace(/\s+/g, ' ').trim()
  return line.length > n ? `${line.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : line
}

// What the work makes, as the feed says it.
const MADE = { image: 'a picture', artifact: 'a page', pr: 'a pull request', link: 'a link' }

// A failed call: one more bump on this turn's quiet line.
function bumped(ev, action, raw) {
  const key = `bumps:${ev.session}:${turnOf.get(ev.session) ?? 0}`
  let m = byKey(key)
  if (!m) m = moment(ev, '', 'bumps', sid(ev.session), undefined, { key, bumps: [] })
  else bump(m, ev.t)
  m.bumps.unshift({ t: ev.t, text: action.plain, raw })
  if (m.bumps.length > 12) m.bumps.pop()
  const n = m.bumps.length
  m.text = `${n === 1 ? 'A bump' : `${n} bumps`} along the way in ${quote(sessionName(ev.session))}`
}

function record(ev) {
  const id = sid(ev.session)
  let a = activity.get(id)
  if (!a) activity.set(id, a = { actions: [], files: new Map() })
  return a
}

const pending = new Map() // tool id -> { summary, tool }

const lower = s => s.charAt(0).toLowerCase() + s.slice(1)

// What a finished call says in plain words: "Checked the tests" for the
// session itself, "Explore read the sign-in code" for one of its agents.
function plainDone(ev, tool, summary) {
  const d = describe(tool, summary)
  const said = ev.ok ? d.done : d.fail
  return ev.agent ? `${named(ev)} ${lower(said)}` : said
}

// An action as the page shows it: plain words, or the raw line in
// Developer view.
export const say = action => (devView() ? action.text : action.plain ?? action.text)

// What a session or agent is doing this moment, from its running tool:
// "Checking the tests" (or "Bash npm test" in Developer view), or null.
export function doingNow(id) {
  for (const n of nodes.values()) {
    if (n.kind !== 'tool' || n.status !== 'active' || n.owner !== id) continue
    return devView() ? `${n.tool}${n.summary ? ` ${n.summary}` : ''}` : describe(n.tool, n.summary).now
  }
  return null
}

// Read one event after model.apply() has seen it.
export function ingest(ev) {
  switch (ev.kind) {
    case 'tool.start': {
      pending.set(`${ev.session}:${ev.id}`, { tool: ev.tool, summary: ev.summary })
      if (pending.size > 500) pending.delete(pending.keys().next().value)
      break
    }
    case 'tool.end': {
      const key = `${ev.session}:${ev.id}`
      const start = pending.get(key) ?? { tool: ev.tool }
      pending.delete(key)
      const tool = start.tool ?? ev.tool
      const text = `${who(ev)} ${phrase(tool, start.summary, ev.ok)}`
      const a = record(ev)
      a.actions.unshift({ t: ev.t, text, plain: plainDone(ev, tool, start.summary), ok: ev.ok, tool, summary: start.summary, agent: ev.agent })
      if (a.actions.length > ACTION_KEEP) a.actions.pop()
      const fam = family(start.tool ?? ev.tool)
      if (fam.file && start.summary) {
        const f = a.files.get(start.summary) ?? { reads: 0, edits: 0, t: 0 }
        if (fam.file === 'edit') f.edits++
        else f.reads++
        f.t = ev.t
        a.files.set(start.summary, f)
      }
      lastAction = { session: sid(ev.session), text, plain: a.actions[0].plain }
      if (!ev.ok) bumped(ev, a.actions[0], text)
      break
    }
    case 'agent.spawn':
      moment(ev, `${quote(sessionName(ev.session))} brought in ${critter({ kind: 'agent', session: ev.session, agent: ev.agent, type: ev.type, name: ev.name }).title}${ev.description ? ` to ${lower(ev.description)}` : ''}.`, 'quiet', aid(ev.session, ev.agent),
        `${quote(sessionName(ev.session))} started ${/^[aeiou]/i.test(ev.type ?? '') ? 'an' : 'a'} ${ev.name || ev.type} subagent${ev.description ? `: ${ev.description}` : ''}.`)
      break
    case 'agent.end': {
      const n = nodes.get(aid(ev.session, ev.agent))
      if (n) {
        const stopped = n.endStatus === 'failed' || n.endStatus === 'killed'
        const end = name => stopped
          ? `${name} stopped before finishing its work for ${quote(sessionName(ev.session))}.`
          : `${name} finished its work for ${quote(sessionName(ev.session))}.`
        // Its name in plain view; its agent type in Developer view.
        moment(ev, end(critter(n).title), 'quiet', undefined, end(n.label))
      }
      break
    }
    case 'agent.message': {
      const m = mail[0]
      if (!m || m.t !== ev.t || m.session !== ev.session) break
      const from = m.fromName === 'Lead' ? 'The lead' : m.fromName ?? 'Someone'
      const to = m.toName === 'Lead' ? quote(sessionName(ev.session)) : m.toName ?? 'someone'
      moment(ev, `${from} → ${to}${m.text ? `: ${m.text}` : ''}`, 'mail', m.to ?? m.from ?? sid(ev.session))
      break
    }
    case 'session.thread': {
      const n = nodes.get(sid(ev.session))
      if (n && !n.threadAnnounced) {
        n.threadAnnounced = true
        moment(ev, `${quote(sessionName(ev.session))} is working as a thread of a claude.ai project.`, 'mail')
      }
      break
    }
    case 'context.compact':
      moment(ev, `${ev.agent ? named(ev) : quote(sessionName(ev.session))} tidied up its memory and has room again.`, 'quiet', undefined,
        `${ev.agent ? who(ev) : quote(sessionName(ev.session))} compacted its context and has room again.`)
      break
    case 'session.start':
      moment(ev, `A session started in ${ev.project ? projectName(ev.project.id, ev.project.name) : 'a new folder'}.`, 'quiet')
      break
    case 'session.end':
      moment(ev, `${quote(sessionName(ev.session))} ended.`, 'quiet')
      break
    case 'turn.start': {
      if (ev.agent) break
      turnOf.set(ev.session, (turnOf.get(ev.session) ?? 0) + 1)
      // Back at work: a blocker from its last turn is dealt with.
      const stuck = byKey(`stuck:${ev.session}`)
      if (stuck) { stuck.tone = 'cleared'; stuck.key = undefined }
      break
    }
    case 'turn.complete': {
      if (ev.agent) break
      const name = quote(sessionName(ev.session))
      if (ev.reason === 'answer' || !ev.reason) {
        moment(ev, `${name} finished${ev.answer ? `: ${clipText(ev.answer, 110)}` : '.'}`, 'done')
      } else if (ev.reason === 'aborted') {
        moment(ev, `You stopped ${name}.`, 'quiet')
      } else {
        moment(ev, `${name} stopped on ${ev.reason === 'refusal' ? 'a refusal' : 'an error'} and needs a look.`, 'block', undefined, undefined, { key: `stuck:${ev.session}` })
      }
      break
    }
    case 'asset.add': {
      if (!MADE[ev.type]) break
      const key = `made:${ev.session}:${ev.id}`
      if (byKey(key)) break
      const made = name => `${name} made ${MADE[ev.type]}${ev.title ? `: ${clipText(ev.title, 70)}` : '.'}`
      moment(ev, made(ev.agent ? named(ev) : quote(sessionName(ev.session))), 'made', ev.agent ? aid(ev.session, ev.agent) : sid(ev.session), ev.agent ? made(who(ev)) : undefined, { key })
      break
    }
    case 'ask.open': {
      const asks = name => ev.type === 'permission' ? `${name} is waiting for your OK to go on.`
        : ev.type === 'plan' ? `${name} has a plan for you to approve.`
          : `${name} asked you: ${clipText(ev.questions?.[0]?.question ?? 'a question', 90)}`
      moment(ev, asks(ev.agent ? named(ev) : quote(sessionName(ev.session))), 'block', ev.agent ? aid(ev.session, ev.agent) : sid(ev.session), ev.agent ? asks(who(ev)) : undefined, { key: `ask:${ev.session}:${ev.id}`, ask: true })
      break
    }
    case 'ask.close': {
      const m = byKey(`ask:${ev.session}:${ev.id}`)
      if (!m) break
      m.tone = 'ask'
      m.key = undefined
      if (ev.answer) m.answer = String(ev.answer)
      break
    }
    case 'chat.sent':
      moment(ev, `You messaged ${ev.agent ? (nodes.get(aid(ev.session, ev.agent))?.label ?? 'a subagent') : quote(sessionName(ev.session))}.`, 'quiet', ev.agent ? aid(ev.session, ev.agent) : sid(ev.session))
      break
    case 'stop.sent':
      moment(ev, `You asked ${quote(sessionName(ev.session))} to stop.`, 'note', sid(ev.session))
      break
    case 'chat.delivered':
      if (ev.ok === false) moment(ev, `Your message to ${ev.agent ? (nodes.get(aid(ev.session, ev.agent))?.label ?? 'a subagent') : quote(sessionName(ev.session))} couldn't be delivered${ev.how ? `: ${ev.how}` : ''}.`, 'bad', ev.agent ? aid(ev.session, ev.agent) : sid(ev.session))
      break
  }
}

// A moment as the page shows it.
export const momentText = m => (devView() && m.raw ? m.raw : m.text)

export function ago(t, now = Date.now()) {
  if (!t) return ''
  const s = Math.max(0, Math.round((now - t) / 1000))
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}
