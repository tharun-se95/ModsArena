// The words around the table: a summary of right now, what needs a look,
// the moments so far, and a card per session that opens into its details.

import { nodes, fill, warnings, sid, WARN_AT } from './model.js'
import { moments, activity, lastAction, escapeHtml, quote, ago } from './words.js'
import { pct, level, tintOf, sessionTint } from './table.js'

const $ = sel => document.querySelector(sel)
const k = n => (n === undefined ? '—' : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1000)}k`)
const usd = n => (n === undefined ? undefined : `$${n.toFixed(2)}`)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const BUSY_MS = 2500

// Cards and details use the whole first prompt; the table keeps it short.
const title = n => n.prompts?.[0]?.text ?? n.label
const isLive = n => n.kind === 'session' && !n.past && n.status !== 'done'
const isBusy = (n, running) => running.has(n.id) || Date.now() - (n.lastAt ?? 0) < BUSY_MS

function liveHelpers(session) {
  return [...nodes.values()].filter(n => n.kind === 'agent' && n.session === session.session && n.status !== 'done')
}

function summary(running) {
  const live = [...nodes.values()].filter(isLive)
  if (!live.length) return ['Nothing is running right now.', 'Start a Claude Code session and it will appear on the table.']
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

function needsALook() {
  const full = warnings().map(n => {
    const host = n.kind === 'agent' ? nodes.get(sid(n.session)) : null
    return `<li><button data-pick="${escapeHtml(n.id)}"><span class="dot crit"></span>${escapeHtml(n.kind === 'agent' ? `${n.label} in ${quote(host?.label ?? '')}` : quote(n.label))} is ${pct(fill(n))} full</button></li>`
  })
  const failures = moments.filter(m => m.tone === 'bad' && Date.now() - m.t < 120000).slice(0, 3)
    .map(m => `<li class="muted"><button data-pick="${escapeHtml(m.target)}">${escapeHtml(m.text)}</button></li>`)
  return [...full, ...failures].join('') || '<li class="muted">Nothing needs you right now.</li>'
}

function sessionCard(n, running, selected) {
  const f = fill(n)
  const live = isLive(n)
  const helpers = live ? liveHelpers(n) : []
  const last = activity.get(n.id)?.actions[0]?.text ?? n.prompts?.at(-1)?.text
  const state = !live ? `ended ${ago(n.endedAt ?? n.lastAt)}` : isBusy(n, running) ? 'working' : 'waiting'
  return `
    <button class="scard ${live ? '' : 'past'} ${selected === n.id ? 'on' : ''}" data-pick="${escapeHtml(n.id)}">
      <span class="srow"><span class="stitle"><i class="dot ${sessionTint(n.session)}"></i>${escapeHtml(title(n))}</span>${n.context?.tokens ? `<span class="pct ${level(f)}">${pct(f)}</span>` : ''}</span>
      ${n.context?.tokens ? `<span class="meter"><span class="${level(f)}" style="width:${(f * 100).toFixed(1)}%"></span></span>` : ''}
      <span class="smeta">${escapeHtml(n.projectName ?? '')} · ${state}${helpers.length ? ` · ${helpers.length} helping` : ''}</span>
      ${last ? `<span class="slast">${escapeHtml(last)}</span>` : ''}
    </button>`
}

function sessionList(running, selected) {
  const sessions = [...nodes.values()].filter(n => n.kind === 'session')
  const live = sessions.filter(isLive).sort((a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0))
  const past = sessions.filter(n => !isLive(n)).sort((a, b) => (b.endedAt ?? b.lastAt ?? 0) - (a.endedAt ?? a.lastAt ?? 0)).slice(0, 8)
  return `
    <h2 class="sideh">Sessions</h2>
    ${live.map(n => sessionCard(n, running, selected)).join('') || '<p class="muted">No live sessions.</p>'}
    ${past.length ? `<h3>Earlier</h3>${past.map(n => sessionCard(n, running, selected)).join('')}` : ''}`
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
    ${n.context?.tokens ? `
      <div class="dgauge"><span class="big ${level(f)}">${pct(f)}</span><span>of its context window ${live ? 'is' : 'was'} in use${live && f >= WARN_AT ? '. It will compact soon.' : '.'}</span></div>
      <span class="meter"><span class="${level(f)}" style="width:${(f * 100).toFixed(1)}%"></span></span>
      <p class="dmeta">${k(n.context.tokens)} of ${k(n.context.window)} tokens${n.compactions?.length ? ` · compacted ${plural(n.compactions.length, 'time')}` : ''}</p>` : ''}
    ${facts ? `<p class="dmeta">${escapeHtml(facts)}</p>` : ''}
    ${live ? breakdown(n) + limits(n) : ''}
    <h3>${live ? 'Helping now' : 'Who helped'}</h3>
    ${helpers.map(a => line(`<i class="dot ${tintOf(a.type)}"></i>${escapeHtml(a.label ?? a.type)}`, live ? (a.context?.tokens ? `${pct(fill(a))} of its own window` : escapeHtml(a.description ?? '')) : escapeHtml(a.description ?? ''))).join('') || '<p class="muted">No subagents.</p>'}
    ${files.length ? `<h3>Files it has worked on</h3>${files.map(fileLine).join('')}` : ''}
    ${act?.actions.length ? `<h3>Recently</h3>${act.actions.slice(0, 8).map(x => line(escapeHtml(x.text), ago(x.t), x.ok ? '' : 'bad')).join('')}` : ''}
    ${n.prompts?.length ? `<h3>What you asked</h3>${[...n.prompts].reverse().slice(0, 6).map(p => line(escapeHtml(p.text), ago(p.t))).join('')}` : ''}`
}

function agentDetail(n) {
  const host = nodes.get(sid(n.session))
  const f = fill(n)
  return `
    <button class="back" data-pick="${escapeHtml(host?.id ?? '')}">← ${escapeHtml(host?.label ?? 'Session')}</button>
    <h2 class="dtitle"><i class="dot ${tintOf(n.type)}"></i>${escapeHtml(n.label)}</h2>
    <p class="dmeta">${escapeHtml(n.description ?? n.type)}</p>
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

// Re-render what changed. `selected` is a node id or null.
export function render({ running, selected, pick }) {
  patch($('#now'), summary(running).map(p => `<p>${p}</p>`).join(''))
  patch($('#look'), needsALook())
  patch($('#moments'), moments.slice(0, 12).map(m =>
    `<li class="${m.tone}"><span>${escapeHtml(m.text)}</span><time>${ago(m.t)}</time></li>`).join('') || '<li class="muted"><span>Quiet so far.</span></li>')
  const n = selected && nodes.get(selected)
  patch($('#side'), !n ? sessionList(running, selected) : n.kind === 'agent' ? agentDetail(n) : n.kind === 'session' ? sessionDetail(n) : sessionList(running, selected))
  for (const b of document.querySelectorAll('[data-pick]')) b.onclick = () => pick(b.dataset.pick || null)
  for (const b of document.querySelectorAll('[data-back]')) b.onclick = () => pick(null)
}
