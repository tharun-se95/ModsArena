// The office's paperwork: the notice card (right now, with a sticky note
// for each thing that needs a look), the tape of moments, and the
// directory of sessions by room, which turns into a clipboard for the
// session or subagent you pick.

import { nodes, fill, warnings, sid, WARN_AT } from './model.js'
import { moments, activity, lastAction, escapeHtml, quote, ago } from './words.js'
import { pct, level, tintOf, sessionTint, roomKey } from './table.js'
import * as transcript from './transcript.js'

const $ = sel => document.querySelector(sel)
const k = n => (n === undefined ? '—' : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1000)}k`)
const usd = n => (n === undefined ? undefined : `$${n.toFixed(2)}`)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const BUSY_MS = 2500

// Cards and details use the whole first prompt; the table keeps it short.
const title = n => n.prompts?.[0]?.text ?? n.label
const isLive = n => n.kind === 'session' && !n.past && n.status !== 'done'
const isBusy = (n, running) => running.has(n.id) || Date.now() - (n.lastAt ?? 0) < BUSY_MS

function helpersOf(session) {
  return [...nodes.values()].filter(n => n.kind === 'agent' && n.session === session.session)
}
const liveHelpers = session => helpersOf(session).filter(n => n.status !== 'done')

// A helper you can pick: its clipboard has its transcript and a message box,
// and a finished one is resumed to answer.
function helperLine(a, extra) {
  return `<button class="line pick" data-pick="${escapeHtml(a.id)}"><i class="dot ${tintOf(a.type)}"></i>${escapeHtml(a.label ?? a.type)}${extra ? `<span class="muted">· ${extra}</span>` : ''}</button>`
}

const asked = p => `${p.from ? `<span class="muted from">${p.from === 'agent-office' ? 'From the office' : `From ${escapeHtml(p.from)}`}</span>` : ''}${escapeHtml(p.text)}`

function summary(running) {
  const live = [...nodes.values()].filter(isLive)
  if (!live.length) return ['Nothing is running right now.', 'Start a Claude Code session and it will walk into the office.']
  const working = live.filter(n => isBusy(n, running)).length
  const helpers = [...nodes.values()].filter(n => n.kind === 'agent' && n.status === 'active').length
  const lead = working === live.length && live.length > 1 ? `All ${live.length}` : `${working} of ${live.length}`
  const verb = live.length === 1 ? (working ? 'Your session is working right now' : 'Your session is waiting for you') : `${lead} sessions are working right now`
  const parts = [`${verb}${helpers ? `, with ${plural(helpers, 'subagent')} helping` : ''}.`]
  const fullest = live.filter(n => n.context?.tokens).sort((a, b) => fill(b) - fill(a))[0]
  if (fullest && fill(fullest) >= WARN_AT) parts.push(`${quote(fullest.label)} is ${pct(fill(fullest))} full and will likely compact soon.`)
  else if (fullest) parts.push('Every context window still has room.')
  if (lastAction) {
    const host = nodes.get(lastAction.session)
    const text = lastAction.text.charAt(0).toLowerCase() + lastAction.text.slice(1)
    parts.push(`Most recently, ${escapeHtml(text)}${host && live.length > 1 ? ` in ${escapeHtml(quote(host.label))}` : ''}.`)
  }
  return parts
}

// Sticky notes: yellow for a context window nearly full, pink for a call
// that just failed. Each one takes you to the critter it's about.
function needsALook() {
  const full = warnings().map(n => {
    const host = n.kind === 'agent' ? nodes.get(sid(n.session)) : null
    return `<li class="warn"><button data-pick="${escapeHtml(n.id)}">${escapeHtml(n.kind === 'agent' ? `${n.label} in ${quote(host?.label ?? '')}` : quote(n.label))} is ${pct(fill(n))} full</button></li>`
  })
  const failures = moments.filter(m => m.tone === 'bad' && Date.now() - m.t < 120000).slice(0, 4 - Math.min(2, full.length))
    // A note is short: the session's name is already on the critter it points at.
    .map(m => `<li class="bad"><button data-pick="${escapeHtml(m.target)}">${escapeHtml(m.text.replace(/ in “[^”]*”\.$/, '.'))}</button></li>`)
  return [...full.slice(0, 2), ...failures].join('') || '<li class="calm"><span>Nothing needs you right now.</span></li>'
}

// One line in the directory: color, name, context, and what it's up to.
function entry(n, running, selected) {
  const f = fill(n)
  const live = isLive(n)
  const helpers = live ? liveHelpers(n).length : 0
  const last = activity.get(n.id)?.actions[0]?.text
  const state = !live ? `ended ${ago(n.endedAt ?? n.lastAt)}` : isBusy(n, running) ? (last ?? 'working') : 'waiting for you'
  return `
    <button class="entry ${live ? '' : 'past'} ${selected === n.id ? 'on' : ''}" data-pick="${escapeHtml(n.id)}" data-hover="${escapeHtml(n.id)}">
      <i class="dot ${sessionTint(n.session)}"></i>
      <span class="ename">${escapeHtml(title(n))}</span>
      ${n.context?.tokens ? `<span class="pct ${level(f)}">${pct(f)}</span>` : '<span></span>'}
      <span class="estate">${helpers ? `${plural(helpers, 'helper')} · ` : ''}${escapeHtml(state)}</span>
    </button>`
}

// The office directory: sessions by room, in each room's wall color.
function directory(running, selected) {
  const byRoom = new Map()
  for (const n of nodes.values()) {
    if (n.kind !== 'session') continue
    const key = n.projectName ?? 'Elsewhere'
    if (!byRoom.has(key)) byRoom.set(key, [])
    byRoom.get(key).push(n)
  }
  const rooms = [...byRoom].map(([name, list]) => {
    const live = list.filter(isLive).sort((a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0))
    const past = list.filter(n => !isLive(n)).sort((a, b) => (b.endedAt ?? b.lastAt ?? 0) - (a.endedAt ?? a.lastAt ?? 0)).slice(0, 3)
    return { name, live, past }
  }).sort((a, b) => (b.live.length > 0) - (a.live.length > 0) || a.name.localeCompare(b.name))
  const liveCount = rooms.reduce((a, r) => a + r.live.length, 0)
  return `
    <h2 class="sideh">Directory <small>${liveCount} live</small></h2>
    ${rooms.map(r => `
      <p class="room"><i class="room-${roomKey(r.name)}"></i>${escapeHtml(r.name)}</p>
      ${[...r.live, ...r.past].map(n => entry(n, running, selected)).join('')}`).join('') || '<p class="muted">No sessions yet.</p>'}`
}

function line(text, extra = '', cls = '') {
  return `<p class="line ${cls}">${text}${extra ? `<span class="muted">· ${extra}</span>` : ''}</p>`
}

function fileLine([path, f]) {
  const parts = [f.edits && plural(f.edits, 'edit'), f.reads && plural(f.reads, 'read')].filter(Boolean).join(', ')
  return `<p class="line mono" title="${escapeHtml(path)}">${escapeHtml(path.split(/[\\/]/).slice(-2).join('/'))}<span class="muted">· ${parts}</span></p>`
}

// What fills the window, from /context: the largest parts first.
function breakdown(n) {
  const cats = n.breakdown?.categories?.filter(c => c.kind === 'used' && c.tokens > 0)
  if (!cats?.length) return ''
  return `<h3>What fills it</h3>${[...cats].sort((a, b) => b.tokens - a.tokens).slice(0, 6)
    .map(c => line(escapeHtml(c.name), k(c.tokens))).join('')}`
}

function limits(n) {
  if (!n.rateLimits?.length) return ''
  return n.rateLimits.map(r => line(`${escapeHtml(r.kind.replace('_', ' '))} limit`, `${Math.round(r.percentUsed)}% used`)).join('')
}

function sessionDetail(n) {
  const f = fill(n)
  const live = isLive(n)
  const act = activity.get(n.id)
  const files = act ? [...act.files].sort((a, b) => (b[1].edits * 3 + b[1].reads) - (a[1].edits * 3 + a[1].reads)).slice(0, 8) : []
  const helpers = live ? liveHelpers(n) : (n.pastAgents ?? [])
  const finished = live ? helpersOf(n).filter(a => a.status === 'done').sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0)) : []
  const where = [n.projectName, n.gitBranch].filter(Boolean).join(' · ')
  const facts = [
    n.turns !== undefined && plural(n.turns, 'turn'),
    n.toolCalls !== undefined && plural(n.toolCalls, 'tool call'),
    n.errors && plural(n.errors, 'error'),
    usd(n.costUsd),
    n.model,
  ].filter(Boolean).join(' · ')
  return `
    <button class="back" data-back>← All sessions</button>
    <h2 class="dtitle"><i class="dot ${sessionTint(n.session)}"></i>${escapeHtml(title(n))}</h2>
    <p class="dmeta">${escapeHtml(where)}${live ? '' : ` · ended ${ago(n.endedAt ?? n.lastAt)}`}</p>
    <!--tabs-->
    ${n.context?.tokens ? `
      <div class="dgauge"><span class="big ${level(f)}">${pct(f)}</span><span>of its context window ${live ? 'is' : 'was'} in use${live && f >= WARN_AT ? '. It will compact soon.' : '.'}</span></div>
      <span class="meter"><span class="${level(f)}" style="width:${(f * 100).toFixed(1)}%"></span></span>
      <p class="dmeta">${k(n.context.tokens)} of ${k(n.context.window)} tokens${n.compactions?.length ? ` · compacted ${plural(n.compactions.length, 'time')}` : ''}</p>` : ''}
    ${facts ? `<p class="dmeta">${escapeHtml(facts)}</p>` : ''}
    ${live ? breakdown(n) + limits(n) : ''}
    <h3>${live ? 'Helping now' : 'Who helped'}</h3>
    ${live
      ? helpers.map(a => helperLine(a, a.context?.tokens ? `${pct(fill(a))} of its own window` : escapeHtml(a.description ?? ''))).join('') || '<p class="muted">No subagents.</p>'
      : helpers.map(a => line(`<i class="dot ${tintOf(a.type)}"></i>${escapeHtml(a.label ?? a.type)}`, escapeHtml(a.description ?? ''))).join('') || '<p class="muted">No subagents.</p>'}
    ${finished.length ? `<h3>Finished</h3>${finished.map(a => helperLine(a, `${escapeHtml(a.description ?? '')}${a.description ? ' · ' : ''}${ago(a.endedAt)}`)).join('')}` : ''}
    ${files.length ? `<h3>Files it has worked on</h3>${files.map(fileLine).join('')}` : ''}
    ${act?.actions.length ? `<h3>Recently</h3>${act.actions.slice(0, 8).map(x => line(escapeHtml(x.text), ago(x.t), x.ok ? '' : 'bad')).join('')}` : ''}
    ${n.prompts?.length ? `<h3>What you asked</h3>${[...n.prompts].reverse().slice(0, 6).map(p => line(asked(p), ago(p.t))).join('')}` : ''}`
}

function agentDetail(n) {
  const host = nodes.get(sid(n.session))
  const f = fill(n)
  return `
    <button class="back" data-pick="${escapeHtml(host?.id ?? '')}">← ${escapeHtml(host?.label ?? 'Session')}</button>
    <h2 class="dtitle"><i class="dot ${tintOf(n.type)}"></i>${escapeHtml(n.label)}</h2>
    <p class="dmeta">${escapeHtml(n.description ?? n.type)}</p>
    <!--tabs-->
    ${n.context?.tokens ? `
      <div class="dgauge"><span class="big ${level(f)}">${pct(f)}</span><span>of its own context window.</span></div>
      <span class="meter"><span class="${level(f)}" style="width:${(f * 100).toFixed(1)}%"></span></span>` : ''}
    <p class="dmeta">${escapeHtml([n.status === 'done' ? 'finished' : n.status === 'idle' ? 'waiting' : 'working', n.model, n.history ? plural(n.history, 'tool call') : '', n.teammate ? 'teammate' : n.background ? 'background' : ''].filter(Boolean).join(' · '))}</p>`
}

// Patch the DOM in place rather than replacing it, so a card under your
// pointer (or holding keyboard focus) survives the refresh and clicks land.
function morph(from, to) {
  if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName) {
    from.replaceWith(to)
    return
  }
  // A part another module draws (the transcript) is left to it, as long as
  // it's still for the same thing.
  if (from.nodeType === Node.ELEMENT_NODE && from.hasAttribute('data-keep') && from.getAttribute('data-keep') === to.getAttribute('data-keep')) return
  if (from.nodeType !== Node.ELEMENT_NODE) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue
    return
  }
  for (const { name } of [...from.attributes]) if (!to.hasAttribute(name)) from.removeAttribute(name)
  for (const { name, value } of [...to.attributes]) if (from.getAttribute(name) !== value) from.setAttribute(name, value)
  const next = [...to.childNodes]
  next.forEach((child, i) => {
    const have = from.childNodes[i]
    if (have) morph(have, child)
    else from.append(child)
  })
  while (from.childNodes.length > next.length) from.lastChild.remove()
}

function patch(el, html) {
  const fresh = el.cloneNode(false)
  fresh.innerHTML = html
  morph(el, fresh)
}

// The clipboard's two tabs: the details, or the conversation (transcript.js).
let tab = 'details'
let lastArgs = null

function withTabs(html, n) {
  const [head, body] = html.split('<!--tabs-->')
  const button = (name, label) => `<button type="button" role="tab" class="tab ${tab === name ? 'on' : ''}" aria-selected="${tab === name}" data-tab="${name}">${label}</button>`
  const tabs = `<div class="tabs" role="tablist">${button('details', 'Details')}${button('transcript', 'Transcript')}</div>`
  return head + tabs + (tab === 'details' ? body : `<div class="transcript" data-keep="${escapeHtml(n.id)}"></div>`)
}

// Re-render what changed. `selected` is a node id or null; `hover` shows
// a critter's bubble while its directory entry is under the pointer.
export function render(args) {
  lastArgs = args
  const { running, selected, pick, hover } = args
  patch($('#now'), summary(running).map(p => `<p>${p}</p>`).join(''))
  patch($('#look'), needsALook())
  patch($('#moments'), moments.slice(0, 12).map(m =>
    `<li class="${m.tone}"><span>${escapeHtml(m.text)}</span><time>${ago(m.t)}</time></li>`).join('') || '<li class="muted"><span>Quiet so far.</span></li>')
  const n = selected && nodes.get(selected)
  const detail = n && (n.kind === 'agent' || n.kind === 'session')
  $('#side').classList.toggle('clipboard', Boolean(detail))
  $('#side').classList.toggle('talking', Boolean(detail) && tab === 'transcript')
  patch($('#side'), !detail ? directory(running, selected) : withTabs(n.kind === 'agent' ? agentDetail(n) : sessionDetail(n), n))
  if (detail && tab === 'transcript') transcript.attach($('#side .transcript'), n)
  else transcript.detach()
  for (const b of document.querySelectorAll('[data-tab]')) b.onclick = () => { tab = b.dataset.tab; render(lastArgs) }
  for (const b of document.querySelectorAll('[data-pick]')) b.onclick = () => pick(b.dataset.pick || null)
  for (const b of document.querySelectorAll('[data-back]')) b.onclick = () => pick(null)
  for (const b of document.querySelectorAll('[data-hover]')) {
    b.onpointerenter = () => hover(b.dataset.hover)
    b.onpointerleave = () => hover(null)
  }
}
