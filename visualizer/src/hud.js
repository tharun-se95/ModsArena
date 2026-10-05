// Everything around the 3D field: project chips, the stat strip, what needs
// attention, the activity feed and the selection card.

import {
  nodes, notices, fill, warnings, projects, sessionsOf, sid, aid, projectOf, projectSummary, WARN_AT,
} from './model.js'
import { fillColor, toolColor, agentColor, COLORS } from './scene.js'
import { CATEGORY_COLORS } from './palette.js'

const $ = sel => document.querySelector(sel)

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}
const esc = escapeHtml
const k = n => (n === undefined ? '—' : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1000)}k`)
const pct = f => `${Math.round(f * 100)}%`
const usd = n => (n === undefined ? '—' : `$${n.toFixed(2)}`)
const clock = t => (t ? new Date(t).toLocaleTimeString([], { hour12: false }) : '')
function ago(t) {
  if (!t) return ''
  const s = Math.max(0, Math.round((Date.now() - t) / 1000))
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}

const inView = (n, filter) => !filter || projectOf(n) === filter

// ---------------------------------------------------------------------------
// Project chips and stats

export function renderChips(filter, onPick) {
  const list = projects()
  const items = [
    { id: '', name: 'All projects', live: list.reduce((s, p) => s + projectSummary(p.projectId).live, 0), attention: warnings().length > 0 },
    ...list.map(p => ({ id: p.projectId, name: p.label, ...projectSummary(p.projectId) })),
  ]
  const html = items.map(c => `
    <button type="button" class="chip" data-project="${esc(c.id)}" aria-pressed="${c.id === filter}">
      ${c.attention ? '<span class="dot crit" title="Needs attention"></span>' : ''}
      <span class="chip-name">${esc(c.name)}</span>
      <span class="chip-count">${c.live}</span>
    </button>`).join('')
  const bar = $('#chips')
  if (bar.dataset.html !== html) {
    bar.dataset.html = html
    bar.innerHTML = html
    for (const b of bar.querySelectorAll('.chip')) b.onclick = () => onPick(b.dataset.project)
  }
}

export function renderStats(filter) {
  const all = [...nodes.values()].filter(n => inView(n, filter))
  $('#stat-live').textContent = all.filter(n => n.kind === 'session' && !n.past && n.status === 'active').length
  $('#stat-agents').textContent = all.filter(n => n.kind === 'agent' && n.status === 'active').length
  $('#stat-tools').textContent = all.filter(n => n.kind === 'tool' && n.status === 'active').length
  const attention = warnings().filter(n => inView(n, filter)).length
  $('#stat-attention').textContent = attention
  $('#stat-attention').closest('.stat').classList.toggle('alert', attention > 0)
}

// ---------------------------------------------------------------------------
// Needs attention: full windows first, then the last minute's compactions

const COMPACTION_SHOW_MS = 60000

export function renderAttention(filter, onPick) {
  const warn = warnings().filter(n => inView(n, filter)).map(n => {
    const f = fill(n)
    const where = n.kind === 'agent' ? (nodes.get(sid(n.session))?.label ?? '') : (n.projectName ?? '')
    return `
      <li class="warn-row">
        <button type="button" class="row-btn" data-target="${esc(n.id)}">
          <span class="row-main"><span class="name">${esc(n.label)}</span><span class="value" style="color:${fillColor(f)}">${pct(f)}</span></span>
          <span class="meter"><span style="width:${(f * 100).toFixed(1)}%;background:${fillColor(f)}"></span><i style="left:${WARN_AT * 100}%"></i></span>
          <span class="row-sub">${n.kind === 'agent' ? 'subagent in ' : ''}${esc(where)} · ${k(n.context?.tokens)} of ${k(n.context?.window)}</span>
        </button>
      </li>`
  })
  const now = Date.now()
  const recent = notices
    .filter(x => now - x.t < COMPACTION_SHOW_MS && inView(nodes.get(x.target) ?? {}, filter))
    .slice(0, 3)
    .map(x => `
      <li class="note-row" style="opacity:${(1 - ((now - x.t) / COMPACTION_SHOW_MS) * 0.7).toFixed(2)}">
        <button type="button" class="row-btn" data-target="${esc(x.target)}"><span class="icon">⟳</span><span class="note">${esc(x.text)}</span><time>${ago(x.t)}</time></button>
      </li>`)
  const body = [...warn, ...recent].join('') || '<li class="empty">All clear. Nothing is near its context limit.</li>'
  const list = $('#attention-list')
  if (list.dataset.html !== body) {
    list.dataset.html = body
    list.innerHTML = body
    for (const b of list.querySelectorAll('[data-target]')) b.onclick = () => onPick(b.dataset.target)
  }
  $('#attention-count').textContent = warn.length
  $('#attention').classList.toggle('has-warnings', warn.length > 0)
  $('#sheet-summary').textContent = warn.length ? `${warn.length} need${warn.length === 1 ? 's' : ''} attention` : 'All clear'
}

// ---------------------------------------------------------------------------
// Activity: batched, filtered by project, pausable

const FEED_KEEP = 300
const FEED_SHOW = 60
const feed = { events: [], pending: false, paused: false, mode: 'all' }

const isProblem = ev => (ev.kind === 'tool.end' && !ev.ok) || ev.kind === 'context.compact'

function lineFor(ev) {
  const session = nodes.get(sid(ev.session))
  const agent = ev.agent ? nodes.get(aid(ev.session, ev.agent)) : null
  const who = `<span class="who"><span class="s">${esc(session?.label ?? 'session')}</span>${agent ? `<span class="sep">›</span><span class="a" style="color:${agentColor(agent.type)}">${esc(agent.label)}</span>` : ''}</span>`
  let what
  switch (ev.kind) {
    case 'tool.start': what = `<span class="tool" style="color:${toolColor(ev.tool)}">${esc(ev.tool)}</span> <span class="arg">${esc(ev.summary ?? '')}</span>`; break
    case 'tool.end': if (ev.ok) return null; what = `<span class="bad">${esc(ev.tool)} failed</span>`; break
    case 'agent.spawn': what = `<span class="spawn">started ${esc(ev.type)}</span> <span class="arg">${esc(ev.description ?? '')}</span>`; break
    case 'agent.end': what = '<span class="muted">finished</span>'; break
    case 'turn.start': what = `<span class="prompt">prompt</span> <span class="arg">${esc(ev.text ?? '')}</span>`; break
    case 'session.start': what = '<span class="prompt">session started</span>'; break
    case 'session.end': what = '<span class="muted">session ended</span>'; break
    case 'context.compact': what = `<span class="warn">compacted</span> <span class="arg">${ev.before ? `${k(ev.before)} → ${k(ev.after)}` : esc(ev.trigger)}</span>`; break
    default: return null
  }
  return `<li class="${isProblem(ev) ? 'problem' : ''}"><time>${clock(ev.t)}</time>${who}<span class="what">${what}</span></li>`
}

export function feedPush(ev) {
  feed.events.push(ev)
  if (feed.events.length > FEED_KEEP) feed.events.splice(0, feed.events.length - FEED_KEEP)
  feed.pending = true
}

export function feedReset(events = []) {
  feed.events = events.slice(-FEED_KEEP)
  feed.pending = true
}

export function renderFeed(filter, force = false) {
  if ((!feed.pending && !force) || feed.paused) return
  feed.pending = false
  const lines = []
  for (let i = feed.events.length - 1; i >= 0 && lines.length < FEED_SHOW; i--) {
    const ev = feed.events[i]
    if (filter && projectOf(nodes.get(sid(ev.session)) ?? {}) !== filter) continue
    if (feed.mode === 'problems' && !isProblem(ev)) continue
    const line = lineFor(ev)
    if (line) lines.push(line)
  }
  $('#feed').innerHTML = lines.join('') || `<li class="empty">${feed.mode === 'problems' ? 'No failures or compactions yet.' : 'Waiting for activity…'}</li>`
}

export function bindFeed(getFilter) {
  const list = $('#feed')
  list.addEventListener('pointerenter', () => { feed.paused = true; $('#feed-state').hidden = false })
  list.addEventListener('pointerleave', () => { feed.paused = false; $('#feed-state').hidden = true; renderFeed(getFilter(), true) })
  for (const b of document.querySelectorAll('[data-feed-mode]')) {
    b.onclick = () => {
      feed.mode = b.dataset.feedMode
      for (const o of document.querySelectorAll('[data-feed-mode]')) o.setAttribute('aria-pressed', String(o === b))
      renderFeed(getFilter(), true)
    }
  }
}

// ---------------------------------------------------------------------------
// Selection card

function gauge(n) {
  const f = fill(n)
  const size = 64
  const r = 27
  const c = 2 * Math.PI * r
  const known = Boolean(n.context?.tokens)
  return `
    <div class="gauge">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
        <circle cx="32" cy="32" r="${r}" fill="none" stroke="${COLORS.track}" stroke-width="6"/>
        ${known ? `<circle cx="32" cy="32" r="${r}" fill="none" stroke="${fillColor(f)}" stroke-width="6" stroke-linecap="round"
          stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 32 32)"/>` : ''}
      </svg>
      <div class="gauge-text">
        <b style="color:${known ? fillColor(f) : 'inherit'}">${known ? pct(f) : '—'}</b>
        <span>${known ? `${k(n.context.tokens)} of ${k(n.context.window)} tokens` : 'No context reading yet'}</span>
      </div>
    </div>`
}

function breakdown(n) {
  const cats = n.breakdown?.categories
  if (!cats?.length || n.past) return ''
  const window = n.context?.window ?? n.breakdown.window
  const used = cats.filter(c => c.kind === 'used')
  const fixed = used.filter(c => c.name !== 'Messages').reduce((s, c) => s + c.tokens, 0)
  const live = n.context?.tokens
  const rows = used.map(c => ({ ...c, tokens: c.name === 'Messages' && live !== undefined ? Math.max(0, live - fixed) : c.tokens }))
  const rest = cats.filter(c => c.kind !== 'used')
  const color = (c, i) => CATEGORY_COLORS[c.name] ?? ['#94a3b8', '#c4b5fd', '#99f6e4'][i % 3]
  const bar = rows.map((c, i) => `<span style="width:${((c.tokens / window) * 100).toFixed(2)}%;background:${color(c, i)}" title="${esc(c.name)}"></span>`).join('')
  return `
    <section>
      <h4>What fills it</h4>
      <div class="stack">${bar}<i style="left:${WARN_AT * 100}%"></i></div>
      <ul class="cats">${[...rows, ...rest].map((c, i) => `
        <li><i style="background:${c.kind === 'free' ? 'transparent' : c.kind === 'buffer' ? '#334155' : color(c, i)}"></i><span>${esc(c.name)}</span><b>${k(c.tokens)}</b></li>`).join('')}
      </ul>
    </section>`
}

function facts(pairs) {
  const shown = pairs.filter(([, v]) => v !== undefined && v !== null && v !== '')
  return `<dl class="facts">${shown.map(([key, v]) => `<div><dt>${key}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`
}

function list(title, items, count = items.length) {
  if (!items.length) return ''
  return `<section><h4>${title} <small>${count}</small></h4><ul class="rows">${items.join('')}</ul></section>`
}

function sessionCard(n) {
  const agents = [...nodes.values()].filter(a => a.kind === 'agent' && a.session === n.session && a.status !== 'done')
  const finished = n.past ? (n.pastAgents ?? []) : (n.finishedAgents ?? [])
  return `
    ${gauge(n)}
    ${breakdown(n)}
    ${facts([
      ['Turns', n.turns], ['Tool calls', n.toolCalls], ['Errors', n.errors], ['Cost', usd(n.costUsd)],
      ['Model', n.model], ['Branch', n.gitBranch], ['Started', n.startedAt ? `${clock(n.startedAt)} · ${ago(n.startedAt)}` : undefined],
      ['Last activity', ago(n.lastAt)],
    ])}
    ${(n.rateLimits ?? []).length ? `<section><h4>Rate limits</h4>${n.rateLimits.map(r => `
      <div class="limit"><span>${esc(r.kind.replace('_', ' '))}</span><span class="meter"><span style="width:${r.percentUsed}%;background:${fillColor(r.percentUsed / 100)}"></span></span><b>${Math.round(r.percentUsed)}%</b></div>`).join('')}</section>` : ''}
    ${list('Working subagents', agents.map(a => `
      <li><button type="button" class="row-btn" data-target="${esc(a.id)}"><span class="dot" style="background:${agentColor(a.type)}"></span><span class="name">${esc(a.label)}</span><span class="value" style="color:${fillColor(fill(a))}">${a.context?.tokens ? pct(fill(a)) : ''}</span></button></li>`))}
    ${list('Finished subagents', finished.slice(0, 10).map(a => `
      <li><span class="name">${esc(a.type)}</span><span class="muted">${esc(a.description ?? '')}</span><span class="value muted">${a.tools ?? 0} tools${a.context ? ` · ${k(a.context)}` : ''}</span></li>`), finished.length)}
    ${list('Compactions', [...(n.compactions ?? [])].reverse().map(c => `
      <li><time>${clock(c.t)}</time><span>${esc(c.trigger ?? '')}</span><span class="value">${c.before ? `${k(c.before)} → ${c.after !== undefined ? k(c.after) : '?'}` : ''}</span></li>`))}
    ${list('Prompts', [...(n.prompts ?? [])].reverse().map(p => `<li class="prompt-row"><time>${clock(p.t)}</time><span>${esc(p.text)}</span></li>`))}`
}

function agentCard(n) {
  const parent = nodes.get(n.parent)
  return `
    ${gauge(n)}
    ${facts([
      ['Type', n.type], ['Task', n.description], ['Model', n.model], ['Tools done', n.history],
      ['Started by', parent?.label], ['Runs', n.teammate ? 'as a teammate' : n.background ? 'in the background' : 'in the foreground'],
      ['Started', n.startedAt ? `${clock(n.startedAt)} · ${ago(n.startedAt)}` : undefined],
    ])}
    ${list('Compactions', [...(n.compactions ?? [])].reverse().map(c => `<li><time>${clock(c.t)}</time><span>${esc(c.trigger ?? '')}</span></li>`))}`
}

function projectCard(n) {
  const s = projectSummary(n.projectId)
  const sessions = sessionsOf(n.projectId)
  return `
    ${facts([['Live sessions', s.live], ['Working agents', s.agents], ['Past sessions', s.past], ['Cost shown', usd(s.cost)], ['Folder', n.projectId]])}
    ${list('Sessions', sessions.map(x => `
      <li><button type="button" class="row-btn" data-target="${esc(x.id)}">
        <span class="dot ${x.past ? 'past' : x.status === 'active' ? 'live' : x.status}"></span><span class="name">${esc(x.label)}</span>
        <span class="value" style="color:${fillColor(fill(x))}">${x.context?.tokens ? pct(fill(x)) : ''}</span><time>${ago(x.lastAt)}</time>
      </button></li>`))}`
}

function toolCard(n) {
  return facts([['Tool', n.tool], ['Input', n.summary], ['Run by', nodes.get(n.owner)?.label], ['Started', clock(n.startedAt)], ['Result', n.status === 'active' ? 'running' : n.status]])
}

let selected = null
let lastHtml = ''

export function select(id) { selected = id; lastHtml = '' }
export const selectedId = () => selected

export function renderCard(onPick) {
  const card = $('#card')
  const n = selected && nodes.get(selected)
  document.body.classList.toggle('inspecting', Boolean(n))
  if (!n) { card.hidden = true; return }
  const kind = n.kind === 'session' ? (n.past ? 'Past session' : 'Session') : n.kind === 'agent' ? 'Subagent' : n.kind === 'project' ? 'Project' : 'Tool call'
  const state = n.past ? 'past' : n.status === 'active' ? 'live' : n.status ?? ''
  const sub = n.kind === 'session' ? (n.projectName ?? n.cwd) : n.kind === 'agent' ? n.description : n.kind === 'project' ? n.remote : n.summary
  const body = n.kind === 'session' ? sessionCard(n) : n.kind === 'agent' ? agentCard(n) : n.kind === 'project' ? projectCard(n) : toolCard(n)
  const html = `
    <header>
      <span class="kind">${kind}${n.kind !== 'project' ? ` <span class="pill ${state}">${state === 'active' ? 'live' : state}</span>` : ''}</span>
      <h3>${esc(n.label)}</h3>
      ${sub ? `<p class="sub">${esc(sub)}</p>` : ''}
    </header>
    <div class="card-body">${body}</div>`
  if (html !== lastHtml) {
    lastHtml = html
    const scroll = card.querySelector('.card-scroll')
    const top = scroll.scrollTop
    scroll.innerHTML = html
    scroll.scrollTop = top
    for (const b of card.querySelectorAll('[data-target]')) b.onclick = () => onPick(b.dataset.target)
  }
  card.hidden = false
}
