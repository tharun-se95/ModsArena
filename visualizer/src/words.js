// Plain-language reading of the event stream: what each session has been
// doing, the files it touched, and the moments worth telling you about.
// Pure bookkeeping over model.js; it knows nothing about Three.js.

import { nodes, sid, aid, mail } from './model.js'

const ACTION_KEEP = 12
const MOMENT_KEEP = 40

export const moments = [] // newest first: { t, text, tone, target }
export const activity = new Map() // session node id -> { actions, files }
export let lastAction = null // { session, text }

export function reset() {
  moments.length = 0
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

function moment(ev, text, tone = '', target = sid(ev.session)) {
  moments.unshift({ t: ev.t, text, tone, target })
  if (moments.length > MOMENT_KEEP) moments.pop()
}

function record(ev) {
  const id = sid(ev.session)
  let a = activity.get(id)
  if (!a) activity.set(id, a = { actions: [], files: new Map() })
  return a
}

const pending = new Map() // tool id -> { summary, tool }

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
      const text = `${who(ev)} ${phrase(start.tool ?? ev.tool, start.summary, ev.ok)}`
      const a = record(ev)
      a.actions.unshift({ t: ev.t, text, ok: ev.ok })
      if (a.actions.length > ACTION_KEEP) a.actions.pop()
      const fam = family(start.tool ?? ev.tool)
      if (fam.file && start.summary) {
        const f = a.files.get(start.summary) ?? { reads: 0, edits: 0, t: 0 }
        if (fam.file === 'edit') f.edits++
        else f.reads++
        f.t = ev.t
        a.files.set(start.summary, f)
      }
      lastAction = { session: sid(ev.session), text }
      if (!ev.ok) moment(ev, `${text} in ${quote(sessionName(ev.session))}.`, 'bad')
      break
    }
    case 'agent.spawn':
      moment(ev, `${quote(sessionName(ev.session))} started ${/^[aeiou]/i.test(ev.type ?? '') ? 'an' : 'a'} ${ev.name || ev.type} subagent${ev.description ? `: ${ev.description}` : ''}.`, '', aid(ev.session, ev.agent))
      break
    case 'agent.end': {
      const n = nodes.get(aid(ev.session, ev.agent))
      if (n) moment(ev, n.endStatus === 'failed' || n.endStatus === 'killed'
        ? `${n.label} stopped before finishing its work for ${quote(sessionName(ev.session))}.`
        : `${n.label} finished its work for ${quote(sessionName(ev.session))}.`, n.endStatus === 'failed' ? 'bad' : '')
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
      moment(ev, `${ev.agent ? who(ev) : quote(sessionName(ev.session))} compacted its context and has room again.`, 'note')
      break
    case 'session.start':
      moment(ev, `A session started in ${ev.project?.name ?? 'a new folder'}.`)
      break
    case 'session.end':
      moment(ev, `${quote(sessionName(ev.session))} ended.`)
      break
    case 'chat.sent':
      moment(ev, `You messaged ${ev.agent ? (nodes.get(aid(ev.session, ev.agent))?.label ?? 'a subagent') : quote(sessionName(ev.session))}.`, 'note', ev.agent ? aid(ev.session, ev.agent) : sid(ev.session))
      break
    case 'chat.delivered':
      if (ev.ok === false) moment(ev, `Your message to ${ev.agent ? (nodes.get(aid(ev.session, ev.agent))?.label ?? 'a subagent') : quote(sessionName(ev.session))} couldn't be delivered${ev.how ? `: ${ev.how}` : ''}.`, 'bad', ev.agent ? aid(ev.session, ev.agent) : sid(ev.session))
      break
  }
}

export function ago(t, now = Date.now()) {
  if (!t) return ''
  const s = Math.max(0, Math.round((now - t) / 1000))
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}
