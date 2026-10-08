// What the work asks and makes, drawn for the panels: the questions Claude
// Code is holding a turn for (AskUserQuestion, a plan to approve, a tool to
// allow), a thread's checklist (TodoWrite or its tasks), and its outputs
// (images, artifacts, pull requests, files, plans), plus the Library: every
// output in the office in one drawer, and a lightbox for pictures.
//
// The shapes mirror how Claude shows them elsewhere: a question with its
// header chip and options, like Claude Code's dialog and a claude.ai
// project's decision card; a checklist of ✓ ✱ ○ rows, like a project
// thread's status; outputs as cards, like a project's Library.

import { nodes, sid, outputs, openAsks, toolName } from './model.js'

export { toolName }
import { escapeHtml, ago } from './words.js'
import { projectName } from './names.js'

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// How a picture gets to the page: the demo carries its own; a real one is
// served by the bridge from the path the session wrote or read.
export const srcOf = o => o.src ?? (o.path ? `/asset?${new URLSearchParams({ session: o.session, id: o.id })}` : '')

// ---------------------------------------------------------------------------
// Questions


const ASK_EYEBROW = { question: 'Asks you', permission: 'Wants to run', plan: 'Plan to approve' }

// One open ask as a card. `answerable` says whether its buttons answer it
// from here; when they can't, they say where to answer.
export function askCard(ask, { answerable, compact = false } = {}) {
  const who = ask.who?.kind === 'agent' ? `<span class="ask-who">${escapeHtml(ask.who.label)}</span>` : ''
  const key = `${ask.who?.session ?? ''}|${ask.id}`
  const button = (label, sub = '', cls = '') => answerable
    ? `<button type="button" class="ask-opt ${cls}" data-answer="${escapeHtml(key)}" data-label="${escapeHtml(label)}"><b>${escapeHtml(label)}</b>${sub ? `<span>${escapeHtml(sub)}</span>` : ''}</button>`
    : `<span class="ask-opt ${cls}"><b>${escapeHtml(label)}</b>${sub ? `<span>${escapeHtml(sub)}</span>` : ''}</span>`
  let body = ''
  if (ask.type === 'question') {
    body = (ask.questions ?? []).map(q => {
      const previews = q.options.some(o => o.preview)
      return `
      <div class="ask-q">
        <p class="ask-text"><span class="chip">${escapeHtml(q.header)}</span>${escapeHtml(q.question)}</p>
        <div class="ask-opts ${previews && !compact ? 'previews' : ''}">${q.options.map((o, i) => previews && !compact
          ? `<${answerable ? 'button type="button"' : 'span'} class="ask-opt pic ${i === 0 ? 'rec' : ''}" ${answerable ? `data-answer="${escapeHtml(key)}" data-label="${escapeHtml(o.label)}"` : ''}><img alt="" src="${escapeHtml(o.preview ?? '')}"><b>${escapeHtml(o.label)}</b></${answerable ? 'button' : 'span'}>`
          : button(o.label, compact ? '' : o.description, i === 0 ? 'rec' : '')).join('')}</div>
      </div>`
    }).join('')
  } else if (ask.type === 'permission') {
    body = `<p class="ask-text"><code>${escapeHtml(toolName(ask.tool))}</code> ${escapeHtml(ask.summary ?? '')}</p>
      <div class="ask-opts row">${button('Allow', '', 'rec')}${button('Deny', '', 'no')}</div>`
  } else if (ask.type === 'plan') {
    const lines = (ask.plan ?? '').split('\n').filter(l => l.trim()).slice(0, compact ? 3 : 8)
    body = `<div class="ask-plan">${lines.map(l => /^#/.test(l) ? `<b>${escapeHtml(l.replace(/^#+\s*/, ''))}</b>` : `<span>${escapeHtml(l)}</span>`).join('')}</div>
      <div class="ask-opts row">${button('Approve', '', 'rec')}${button('Keep planning', '', 'no')}</div>`
  }
  return `
    <div class="ask ${ask.type}">
      <p class="ask-eyebrow"><i class="ask-icon">${ask.type === 'permission' ? '>_' : ask.type === 'plan' ? '✎' : '?'}</i>${ASK_EYEBROW[ask.type] ?? 'Asks you'}${who}<time>${ago(ask.t)}</time></p>
      ${body}
      ${answerable ? '' : '<p class="ask-where">Answer it in Claude Code; the office shows it so you know it’s waiting.</p>'}
    </div>`
}

export function asksFor(sessionNode) {
  return openAsks(sessionNode)
}

// ---------------------------------------------------------------------------
// The checklist: ✓ done, ✱ in progress, ○ not started.

const MARK = { completed: '✓', in_progress: '✱', pending: '○' }

export function checklist(n, { open = true } = {}) {
  const items = n.todos
  if (!items?.length) return ''
  const done = items.filter(i => i.status === 'completed').length
  const now = items.find(i => i.status === 'in_progress')
  return `
    <details class="todo" ${open ? 'open' : ''} data-todo="${escapeHtml(n.id)}">
      <summary>
        <span class="todo-ring" style="--f:${(done / items.length).toFixed(3)}"></span>
        <b>${done === items.length ? 'All done' : escapeHtml(now?.active ?? now?.text ?? 'Up next')}</b>
        <span class="todo-count">${done}/${items.length}</span>
      </summary>
      <ol>${items.map(i => `<li class="${i.status}"><i>${MARK[i.status] ?? '○'}</i>${escapeHtml(i.text)}</li>`).join('')}</ol>
    </details>`
}

// A one-line progress strip for cards and the directory.
export function progress(n) {
  const items = n.todos
  if (!items?.length) return ''
  const done = items.filter(i => i.status === 'completed').length
  return `<span class="todo-bar" title="${done} of ${items.length} done">${items.map(i => `<i class="${i.status}"></i>`).join('')}</span>`
}

// ---------------------------------------------------------------------------
// Outputs

const KIND = {
  image: ['Image', '▣'], artifact: ['Artifact', '◈'], pr: ['Pull request', '⇡'], link: ['Link', '↗'],
  file: ['File', '▤'], plan: ['Plan', '✎'],
}

const hostOf = url => { try { return new URL(url).host.replace(/^www\./, '') } catch { return '' } }

export function outputCard(o, { withThread = false } = {}) {
  const [kind, icon] = KIND[o.type] ?? ['Output', '•']
  const thread = withThread ? nodes.get(sid(o.session)) : null
  const where = [thread?.label, o.agent ? nodes.get(`a:${o.session}:${o.agent}`)?.label : ''].filter(Boolean).join(' · ')
  if (o.type === 'image') {
    return `<button type="button" class="out pic" data-zoom="${escapeHtml(o.session)}|${escapeHtml(o.id)}" title="${escapeHtml(o.title)}">
      <img alt="${escapeHtml(o.title)}" src="${escapeHtml(srcOf(o))}" loading="lazy">
      <span>${escapeHtml(o.title)}</span>${where ? `<small>${escapeHtml(where)}</small>` : ''}</button>`
  }
  const stats = o.meta?.additions !== undefined ? `<span class="diff"><ins>+${o.meta.additions}</ins> <del>−${o.meta.deletions ?? 0}</del></span>` : ''
  const sub = [o.type === 'file' ? o.path : o.url ? hostOf(o.url) : '', where].filter(Boolean).join(' · ')
  const tag = o.url ? 'a' : o.type === 'plan' ? 'button' : 'div'
  const attrs = o.url ? `href="${escapeHtml(o.url)}" target="_blank" rel="noopener"` : o.type === 'plan' ? `type="button" data-zoom="${escapeHtml(o.session)}|${escapeHtml(o.id)}"` : ''
  return `<${tag} class="out ${o.type}" ${attrs}>
    <i class="out-icon">${icon}</i>
    <span class="out-main"><b>${escapeHtml(o.title)}</b><small>${escapeHtml(kind)}${o.meta?.state ? ` · ${escapeHtml(o.meta.state)}` : ''}${sub ? ` · ${escapeHtml(sub)}` : ''}</small></span>
    ${stats || `<time>${ago(o.t)}</time>`}
  </${tag}>`
}

// The clipboard's Outputs tab: pictures first, then what was delivered,
// then the files it changed.
export function outputsTab(n) {
  const host = n.kind === 'session' ? n : nodes.get(sid(n.session))
  const mine = outputs.filter(o => o.session === host?.session && (n.kind === 'session' || o.agent === n.agent))
  if (!mine.length && !n.todos?.length) return '<p class="muted">Nothing made yet. Pictures, artifacts, pull requests and changed files land here as they happen.</p>'
  const images = mine.filter(o => o.type === 'image')
  const shipped = mine.filter(o => ['artifact', 'pr', 'link', 'plan'].includes(o.type))
  const files = mine.filter(o => o.type === 'file')
  const adds = files.reduce((s, f) => s + (f.meta?.additions ?? 0), 0)
  const dels = files.reduce((s, f) => s + (f.meta?.deletions ?? 0), 0)
  return `
    ${checklist(n, { open: true })}
    ${shipped.length ? `<h3>Delivered</h3><div class="outs">${shipped.map(o => outputCard(o)).join('')}</div>` : ''}
    ${images.length ? `<h3>Pictures <small>${images.length}</small></h3><div class="gallery">${images.slice(0, 9).map(o => outputCard(o)).join('')}</div>` : ''}
    ${files.length ? `<h3>Files changed <small><ins>+${adds}</ins> <del>−${dels}</del></small></h3><div class="outs files">${files.slice(0, 8).map(o => outputCard(o)).join('')}</div>` : ''}`
}

export const outputCount = n => outputs.filter(o => o.session === n.session && (n.kind === 'session' || o.agent === n.agent) && o.type !== 'file').length

// ---------------------------------------------------------------------------
// The Library: everything every thread has made, by kind.

let shelf = 'all'
const SHELVES = [['all', 'All'], ['image', 'Pictures'], ['shipped', 'Artifacts & PRs'], ['file', 'Files'], ['plan', 'Plans']]
const onShelf = o => shelf === 'all' ? o.type !== 'file'
  : shelf === 'shipped' ? ['artifact', 'pr', 'link'].includes(o.type) : o.type === shelf

export function library() {
  const list = outputs.filter(onShelf)
  const byThread = new Map()
  for (const o of list) {
    if (!byThread.has(o.session)) byThread.set(o.session, [])
    byThread.get(o.session).push(o)
  }
  const groups = [...byThread].map(([session, items]) => {
    const n = nodes.get(sid(session))
    const pics = items.filter(o => o.type === 'image')
    const rest = items.filter(o => o.type !== 'image')
    return `<section class="lib-group">
      <p class="lib-thread"><span>${escapeHtml(n?.project ? projectName(n.project, n.projectName) : n?.projectName ?? '')}</span><button type="button" data-pick="${escapeHtml(sid(session))}">${escapeHtml(n?.label ?? session)}</button></p>
      ${pics.length ? `<div class="gallery">${pics.slice(0, 6).map(o => outputCard(o)).join('')}</div>` : ''}
      ${rest.length ? `<div class="outs">${rest.slice(0, 8).map(o => outputCard(o)).join('')}</div>` : ''}
    </section>`
  }).join('')
  return `
    <header class="lib-head">
      <h2>Library <small>${plural(outputs.filter(o => o.type !== 'file').length, 'output')}</small></h2>
      <button type="button" class="lib-close" data-library="close" aria-label="Close the library">×</button>
    </header>
    <div class="feeds lib-shelves" role="group" aria-label="Show">${SHELVES.map(([k, label]) => `<button type="button" data-shelf="${k}" class="${shelf === k ? 'on' : ''}">${label}</button>`).join('')}</div>
    <div class="lib-body">${groups || '<p class="muted">Nothing on this shelf yet.</p>'}</div>`
}

export function setShelf(name) {
  shelf = name
}

// ---------------------------------------------------------------------------
// The lightbox: a picture (or a plan) full size.

export function lightbox(key) {
  const [session, id] = key.split('|')
  const o = outputs.find(x => x.session === session && x.id === id)
  if (!o) return ''
  const n = nodes.get(sid(session))
  const body = o.type === 'plan'
    ? `<article class="lb-plan">${(o.text ?? '').split('\n').map(l => /^#/.test(l) ? `<h3>${escapeHtml(l.replace(/^#+\s*/, ''))}</h3>` : l.trim() ? `<p>${escapeHtml(l)}</p>` : '').join('')}</article>`
    : `<img alt="${escapeHtml(o.title)}" src="${escapeHtml(srcOf(o))}">`
  return `<figure class="lb-frame paper">${body}<figcaption><b>${escapeHtml(o.title)}</b><span>${escapeHtml([n?.label, o.path, ago(o.t)].filter(Boolean).join(' · '))}</span></figcaption></figure>`
}
