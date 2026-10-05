// The HTML around the 3D view: stats, the project filter, alerts, the
// activity feed and the detail panel for whatever node is selected.

import {
  nodes, stats, notices, fill, warnings, projects, sessionsOf, sid, aid, WARN_AT,
} from './model.js'
import { categoryColor, fillColor, segments, toolColor } from './scene.js'

const FEED_LIMIT = 60
const $ = sel => document.querySelector(sel)

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

const k = n => (n === undefined ? '—' : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1000)}k`)
const pct = f => `${Math.round(f * 100)}%`
const usd = n => (n === undefined ? '—' : `$${n.toFixed(2)}`)
const clock = t => (t ? new Date(t).toLocaleTimeString([], { hour12: false }) : '')
function ago(t) {
  if (!t) return ''
  const s = Math.round((Date.now() - t) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}

// ---------------------------------------------------------------------------
// Feed

const who = ev => (ev.agent ? (nodes.get(aid(ev.session, ev.agent))?.label ?? 'subagent') : (nodes.get(sid(ev.session))?.label ?? 'lead'))

export function feedLine(ev) {
  let text
  switch (ev.kind) {
    case 'tool.start': text = `<span style="color:${toolColor(ev.tool)}">${escapeHtml(ev.tool)}</span> ${escapeHtml(ev.summary ?? '')}`; break
    case 'tool.end': if (ev.ok) return; text = `<span class="err">✕ ${escapeHtml(ev.tool)} failed</span>`; break
    case 'agent.spawn': text = `<span class="spawn">⇢ spawned ${escapeHtml(ev.type)}</span> ${escapeHtml(ev.description ?? '')}`; break
    case 'agent.end': text = '<span class="dim">✓ finished</span>'; break
    case 'turn.start': text = `<span class="turn">▸ prompt</span> ${escapeHtml(ev.text ?? '')}`; break
    case 'session.start': text = `<span class="turn">● session started</span> ${escapeHtml(ev.project?.name ?? ev.cwd ?? '')}`; break
    case 'session.end': text = '<span class="dim">○ session ended</span>'; break
    case 'context.compact': text = `<span class="warn">⟳ compacted</span> ${ev.before ? `${k(ev.before)} → ${k(ev.after)}` : ev.trigger}`; break
    default: return
  }
  const li = document.createElement('li')
  li.innerHTML = `<time>${clock(ev.t)}</time><b>${escapeHtml(who(ev))}</b> ${text}`
  $('#feed').prepend(li)
  while ($('#feed').children.length > FEED_LIMIT) $('#feed').lastChild.remove()
}

export const clearFeed = () => $('#feed').replaceChildren()

// ---------------------------------------------------------------------------
// Stats, filter and alerts

export function refreshStats() {
  const all = [...nodes.values()]
  const live = all.filter(n => n.kind === 'session' && !n.past && n.status === 'active')
  $('#stat-projects').textContent = projects().length
  $('#stat-sessions').textContent = live.length
  $('#stat-agents').textContent = all.filter(n => n.kind === 'agent' && n.status === 'active').length
  $('#stat-tools').textContent = all.filter(n => n.kind === 'tool' && n.status === 'active').length
  $('#stat-calls').textContent = stats.calls
  $('#stat-cost').textContent = usd(live.reduce((s, n) => s + (n.costUsd ?? 0), 0))
}

export function refreshProjects(current, onChange) {
  const select = $('#project-filter')
  const options = [['', 'All projects'], ...projects().map(p => [p.projectId, p.label])]
  const signature = options.map(o => o.join('=')).join('|')
  if (select.dataset.signature !== signature) {
    select.dataset.signature = signature
    select.innerHTML = options.map(([v, l]) => `<option value="${escapeHtml(v)}">${escapeHtml(l)}</option>`).join('')
    select.value = options.some(([v]) => v === current) ? current : ''
    if (select.value !== current) onChange(select.value)
  }
}

export function refreshAlerts(onPick) {
  const warn = warnings().map(n => ({
    level: 'warn', target: n.id,
    text: `${n.label} at ${pct(fill(n))} of its context window`,
  }))
  const recent = notices.filter(x => Date.now() - x.t < 10 * 60000).slice(0, 6)
  const items = [...warn, ...recent]
  const box = $('#alerts')
  box.hidden = items.length === 0
  $('#alert-count').textContent = items.length
  $('#alert-list').innerHTML = items.map(a =>
    `<li><button type="button" class="link ${a.level}" data-target="${escapeHtml(a.target)}">${escapeHtml(a.text)}</button>${a.t ? `<time>${ago(a.t)}</time>` : ''}</li>`,
  ).join('')
  for (const b of box.querySelectorAll('[data-target]')) b.onclick = () => onPick(b.dataset.target)
}

// ---------------------------------------------------------------------------
// Detail panel

function meter(n) {
  const f = fill(n)
  if (!n.context?.tokens) return '<p class="dim">No context reading yet.</p>'
  const segs = segments(n)
  const bar = segs.map(s => `<span style="width:${(s.share * 100).toFixed(2)}%;background:${s.color}" title="${escapeHtml(s.name)}"></span>`).join('')
  const marker = `<i style="left:${WARN_AT * 100}%"></i>`
  return `
    <div class="meter">
      <b style="color:${fillColor(f)}">${pct(f)}</b>
      <span>${k(n.context.tokens)} of ${k(n.context.window)} tokens</span>
    </div>
    <div class="bar">${bar}${marker}</div>`
}

function breakdownList(n) {
  const cats = n.breakdown?.categories
  if (!cats?.length || n.past) return ''
  // Used rows as the ring draws them (messages kept live), then buffer and free.
  const window = n.context?.window ?? n.breakdown.window
  const used = segments(n).map(s => ({ name: s.name, tokens: s.share * window, color: s.color }))
  const rest = cats.filter(c => c.kind !== 'used').map((c, i) => ({
    name: c.name, tokens: c.tokens, color: c.kind === 'free' ? 'transparent' : categoryColor(c.name, i + used.length),
  }))
  return `<h4>What fills it</h4><ul class="cats">${[...used, ...rest].map(c =>
    `<li><i style="background:${c.color}"></i><span>${escapeHtml(c.name)}</span><b>${k(c.tokens)}</b></li>`).join('')}</ul>`
}

function rows(pairs) {
  const shown = pairs.filter(([, v]) => v !== undefined && v !== null && v !== '')
  return `<dl>${shown.map(([key, v]) => `<dt>${key}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>`
}

function compactionList(list) {
  if (!list?.length) return ''
  return `<h4>Compactions <small>${list.length}</small></h4><ul class="plain">${[...list].reverse().map(c =>
    `<li><time>${clock(c.t)}</time>${escapeHtml(c.trigger ?? '')} ${c.before ? `${k(c.before)} → ${c.after !== undefined ? k(c.after) : '?'}` : ''}</li>`).join('')}</ul>`
}

function promptList(list) {
  if (!list?.length) return ''
  return `<h4>Prompts <small>${list.length}</small></h4><ol class="prompts">${[...list].reverse().map(p =>
    `<li><time>${clock(p.t)}</time>${escapeHtml(p.text)}</li>`).join('')}</ol>`
}

function rateLimits(list) {
  if (!list?.length) return ''
  return `<h4>Rate limits</h4>${list.map(r => `
    <div class="limit"><span>${escapeHtml(r.kind.replace('_', ' '))}</span>
      <div class="bar small"><span style="width:${r.percentUsed}%;background:${fillColor(r.percentUsed / 100)}"></span></div>
      <b>${Math.round(r.percentUsed)}%</b></div>`).join('')}`
}

function agentList(session) {
  if (session.past) {
    const list = session.pastAgents ?? []
    if (!list.length) return ''
    return `<h4>Subagents <small>${list.length}</small></h4><ul class="plain">${list.map(a =>
      `<li><b>${escapeHtml(a.type)}</b> ${escapeHtml(a.description ?? '')}${a.context ? ` <span class="dim">${k(a.context)} ctx</span>` : ''}</li>`).join('')}</ul>`
  }
  const agents = [...nodes.values()].filter(n => n.kind === 'agent' && n.session === session.session)
  if (!agents.length) return ''
  return `<h4>Subagents <small>${agents.length}</small></h4><ul class="plain">${agents.map(a =>
    `<li><button type="button" class="link" data-target="${escapeHtml(a.id)}">${escapeHtml(a.label)}</button> <span class="pill ${a.status}">${a.status}</span>${a.context?.tokens ? ` <span style="color:${fillColor(fill(a))}">${pct(fill(a))}</span>` : ''}</li>`).join('')}</ul>`
}

const statusPill = n => {
  const state = n.past ? 'past' : n.status
  return `<span class="pill ${state}">${state === 'active' ? 'live' : state}</span>`
}

function sessionDetail(n) {
  const project = n.projectName ? `${n.projectName}${n.gitBranch ? ` · ${n.gitBranch}` : ''}` : n.cwd
  return `
    <h3>${escapeHtml(n.label)} ${statusPill(n)}</h3>
    <p class="sub">${escapeHtml(project ?? '')}</p>
    ${meter(n)}
    ${breakdownList(n)}
    ${rows([
      ['turns', n.turns], ['tool calls', n.toolCalls], ['errors', n.errors], ['cost', usd(n.costUsd)],
      ['model', n.model], ['started', n.startedAt ? `${clock(n.startedAt)} (${ago(n.startedAt)})` : undefined],
      ['last activity', ago(n.lastAt)], ['session', n.session],
    ])}
    ${rateLimits(n.rateLimits)}
    ${compactionList(n.compactions)}
    ${agentList(n)}
    ${promptList(n.prompts)}`
}

function agentDetail(n) {
  const parent = nodes.get(n.parent)
  return `
    <h3>${escapeHtml(n.label)} ${statusPill(n)}</h3>
    <p class="sub">${escapeHtml(n.description ?? '')}</p>
    ${meter(n)}
    ${rows([
      ['type', n.type], ['model', n.model], ['tools done', n.history],
      ['spawned by', parent?.label], ['mode', n.teammate ? 'teammate' : n.background ? 'background' : 'foreground'],
      ['started', clock(n.startedAt)], ['id', n.agent],
    ])}
    ${compactionList(n.compactions)}`
}

function projectDetail(n) {
  const sessions = sessionsOf(n.projectId)
  const cost = sessions.reduce((s, x) => s + (x.costUsd ?? 0), 0)
  return `
    <h3>${escapeHtml(n.label)}</h3>
    <p class="sub">${escapeHtml(n.projectId)}</p>
    ${rows([['live sessions', sessions.filter(s => !s.past && s.status === 'active').length], ['past sessions', sessions.filter(s => s.past).length], ['cost (shown)', usd(cost)]])}
    <h4>Sessions</h4>
    <ul class="sessions">${sessions.map(s => `
      <li><button type="button" class="link" data-target="${escapeHtml(s.id)}">${escapeHtml(s.label)}</button>
        ${statusPill(s)}
        <span class="ctx" style="color:${fillColor(fill(s))}">${s.context?.tokens ? pct(fill(s)) : ''}</span>
        <time>${ago(s.lastAt)}</time></li>`).join('')}</ul>`
}

function toolDetail(n) {
  return `<h3>${escapeHtml(n.tool)} ${statusPill(n)}</h3>${rows([['input', n.summary], ['started', clock(n.startedAt)], ['by', nodes.get(n.owner)?.label]])}`
}

let selected = null

export function showDetail(n, onPick) {
  selected = n?.id ?? null
  renderDetail(onPick)
}

export function renderDetail(onPick) {
  const panel = $('#detail')
  const n = selected && nodes.get(selected)
  if (!n) {
    panel.hidden = true
    return
  }
  const html = n.kind === 'session' ? sessionDetail(n)
    : n.kind === 'agent' ? agentDetail(n)
      : n.kind === 'project' ? projectDetail(n)
        : toolDetail(n)
  if (panel.dataset.html !== html) {
    panel.dataset.html = html
    panel.querySelector('.body').innerHTML = html
    for (const b of panel.querySelectorAll('[data-target]')) b.onclick = () => onPick(b.dataset.target)
  }
  panel.hidden = false
}

