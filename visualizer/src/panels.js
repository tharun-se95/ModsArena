// The office's paperwork, laid out the way Claude organizes work: projects
// hold threads (sessions), a thread has its lead (the main conversation)
// and the agents it spawned, nested.
//
//   waiting on you (left)  threads whose next move is yours, with their last
//                          answer and a box to reply right there
//   activity (left)        the moments so far, messages between agents among them
//   projects (right)       every project's threads and their live team,
//                          which turns into a clipboard for the thread or
//                          agent you pick: Conversation, Team, Details

import { nodes, outputs, fill, warnings, sid, WARN_AT, threadState, agentState, teamOf, lineage, mailOf } from './model.js'
import { moments, activity, escapeHtml, quote, ago } from './words.js'
import { pct, level, tintOf, sessionTint, roomKey } from './table.js'
import * as transcript from './transcript.js'
import * as assets from './assets.js'
import { who } from './names.js'
import * as milestones from './milestones.js'

const $ = sel => document.querySelector(sel)
const k = n => (n === undefined ? '—' : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1000)}k`)
const usd = n => (n === undefined ? undefined : `$${n.toFixed(2)}`)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const INBOX_KEEP = 4
const PAST_PER_PROJECT = 3

// Cards and details use the whole first prompt; the table keeps it short.
const title = n => n.prompts?.[0]?.text ?? n.label
const isLive = n => n.kind === 'session' && !n.past && n.status !== 'done'

const STATE_WORDS = {
  working: 'Working', waiting: 'Waiting on you', asking: 'Needs your answer', stuck: 'Needs a look', ended: 'Ended',
  idle: 'Idle', done: 'Done', failed: 'Stopped',
}
const pill = state => `<span class="pill ${state}">${STATE_WORDS[state]}</span>`

const asked = p => `${p.from ? `<span class="muted from">${p.from === 'agent-office' ? 'From the office' : `From ${escapeHtml(p.from)}`}</span>` : ''}${escapeHtml(p.text)}`

// ---------------------------------------------------------------------------
// The order threads are listed in, shared by the directory and j/k.

function projectsList() {
  const byProject = new Map()
  for (const n of nodes.values()) {
    if (n.kind !== 'session') continue
    const key = n.projectName ?? 'Elsewhere'
    if (!byProject.has(key)) byProject.set(key, [])
    byProject.get(key).push(n)
  }
  return [...byProject].map(([name, list]) => {
    const live = list.filter(isLive).sort((a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0))
    const past = list.filter(n => !isLive(n)).sort((a, b) => (b.endedAt ?? b.lastAt ?? 0) - (a.endedAt ?? a.lastAt ?? 0)).slice(0, PAST_PER_PROJECT)
    return { name, live, past }
  }).sort((a, b) => (b.live.length > 0) - (a.live.length > 0) || a.name.localeCompare(b.name))
}

// Every thread and agent in directory order, for moving with the keyboard.
export function order() {
  const out = []
  const walk = branch => branch.forEach(({ node, children }) => { out.push(node.id); walk(children) })
  for (const p of projectsList()) {
    for (const n of [...p.live, ...p.past]) {
      out.push(n.id)
      if (isLive(n)) walk(teamOf(n))
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Waiting on you: threads whose next move is yours, longest waiting first.

function inboxThreads(running) {
  return [...nodes.values()]
    .filter(n => isLive(n) && ['asking', 'waiting', 'stuck'].includes(threadState(n, running)))
    // A turn held on a question comes first: nothing moves until you answer.
    .sort((a, b) => (threadState(b, running) === 'asking') - (threadState(a, running) === 'asking') ||
      (a.answeredAt ?? a.startedAt ?? 0) - (b.answeredAt ?? b.startedAt ?? 0))
}

function headline(running) {
  const live = [...nodes.values()].filter(isLive)
  if (!live.length) return 'Nothing is running. Start a Claude Code session and it walks into the office.'
  const yours = live.filter(n => threadState(n, running) !== 'working').length
  const working = live.length - yours
  const agents = [...nodes.values()].filter(n => n.kind === 'agent' && agentState(n) === 'working').length
  const helping = agents ? `, with ${plural(agents, 'agent')} helping` : ''
  if (!yours) return `${live.length === 1 ? 'Your thread is' : `All ${live.length} threads are`} working${helping}.`
  if (!working) return `${live.length === 1 ? 'Your thread is' : `All ${live.length} threads are`} waiting on you.`
  return `${yours} waiting on you, ${working} working${helping}.`
}

let answerable = () => false

function cardInfo(n, running) {
  const state = threadState(n, running)
  if (state === 'asking') {
    const [first, ...more] = assets.asksFor(n)
    return `
    <button class="card-head" data-pick="${escapeHtml(n.id)}" data-hover="${escapeHtml(n.id)}" title="Open the conversation">
      <span class="card-where"><i class="dot ${sessionTint(n.session)}"></i>${escapeHtml(n.projectName ?? 'Elsewhere')}${n.thread ? '<span class="badge">thread</span>' : ''}<time>${ago(first.t)}</time></span>
      <b>${escapeHtml(title(n))}</b>
    </button>
    ${assets.askCard(first, { answerable: answerable(), compact: true })}
    ${more.length ? `<p class="ask-more">${plural(more.length, 'more question')} after this one</p>` : ''}`
  }
  const said = n.answer?.text
  const blurb = state === 'stuck'
    ? (n.lastReason === 'aborted' ? 'You stopped its last turn.' : n.lastReason === 'refusal' ? 'Its last turn ended on a refusal.' : 'Its last turn ended on an error.')
    : state === 'working' ? 'Back at work.'
      : said ? quote(said) : n.turns ? 'Done with your last request.' : 'Ready for its first prompt.'
  return `
    <button class="card-head" data-pick="${escapeHtml(n.id)}" data-hover="${escapeHtml(n.id)}" title="Open the conversation">
      <span class="card-where"><i class="dot ${sessionTint(n.session)}"></i>${escapeHtml(n.projectName ?? 'Elsewhere')}${n.thread ? '<span class="badge">thread</span>' : ''}<time>${ago(n.answeredAt ?? n.startedAt)}</time></span>
      <b>${escapeHtml(title(n))}</b>
      ${assets.progress(n)}
      <span class="card-said">${escapeHtml(blurb)}</span>
    </button>`
}

const drafts = new Map() // node id -> unsent reply text
const sending = new Map() // node id -> { ok, status }

function cardElement(n) {
  const li = document.createElement('li')
  li.className = 'card'
  li.dataset.card = n.id
  li.innerHTML = `
    <div class="card-info"></div>
    <form class="card-reply">
      <textarea rows="1" aria-label="Reply to ${escapeHtml(title(n))}" placeholder="Reply…"></textarea>
      <button type="submit" aria-label="Send">↵</button>
      <p class="card-status" hidden></p>
    </form>`
  const form = li.querySelector('form')
  const field = form.querySelector('textarea')
  field.value = drafts.get(n.id) ?? ''
  field.addEventListener('input', () => drafts.set(n.id, field.value))
  field.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault()
      form.requestSubmit()
    }
  })
  form.addEventListener('submit', async e => {
    e.preventDefault()
    const node = nodes.get(n.id)
    const text = field.value
    if (!node || !text.trim()) return
    field.value = ''
    drafts.delete(n.id)
    sending.set(n.id, { status: 'Sending…' })
    showStatus(li, n.id)
    const result = await transcript.sendTo(node, text)
    sending.set(n.id, result)
    showStatus(li, n.id)
    if (!result.ok) {
      field.value = text
      drafts.set(n.id, text)
    }
  })
  return li
}

function showStatus(li, id) {
  const s = sending.get(id)
  const el = li.querySelector('.card-status')
  el.hidden = !s
  if (!s) return
  el.textContent = s.status
  el.classList.toggle('bad', s.ok === false)
}

// Keyed by thread so a reply you're typing stays with its thread when the
// list changes around it.
function renderInbox(running) {
  const list = $('#inbox')
  const threads = inboxThreads(running)
  const shown = threads.slice(0, INBOX_KEEP)
  const want = new Set(shown.map(n => n.id))
  for (const li of [...list.querySelectorAll('[data-card]')]) {
    const keep = nodes.has(li.dataset.card) && (want.has(li.dataset.card) || li.contains(document.activeElement) || li.querySelector('textarea')?.value)
    if (!keep) {
      li.remove()
      sending.delete(li.dataset.card)
    }
  }
  list.querySelector('.calm')?.remove()
  shown.forEach((n, i) => {
    let li = list.querySelector(`[data-card="${CSS.escape(n.id)}"]`)
    if (!li) li = cardElement(n)
    if (list.children[i] !== li && !li.contains(document.activeElement)) list.insertBefore(li, list.children[i] ?? null)
    li.classList.remove('gone')
    li.classList.toggle('stuck', threadState(n, running) === 'stuck')
    li.classList.toggle('asking', threadState(n, running) === 'asking')
    patch(li.querySelector('.card-info'), cardInfo(n, running))
    // A question is answered with its options, not a reply.
    li.querySelector('form').hidden = !transcript.canMessage() || threadState(n, running) === 'asking'
  })
  // A thread you're still replying to that went back to work keeps its
  // card, dimmed, until you're done with it.
  for (const li of list.querySelectorAll('[data-card]')) {
    if (want.has(li.dataset.card)) continue
    li.classList.add('gone')
    patch(li.querySelector('.card-info'), cardInfo(nodes.get(li.dataset.card), running))
  }
  if (!list.children.length) list.insertAdjacentHTML('beforeend', '<li class="calm">Nothing is waiting on you. Threads land here when they answer.</li>')
  const more = threads.length - shown.length
  patch($('#inbox-more'), more > 0 ? `<button data-pick="${escapeHtml(threads[INBOX_KEEP].id)}">${plural(more, 'more thread')} waiting</button>` : '')
  patch($('#inbox-count'), threads.length ? String(threads.length) : '')
}

// Context windows close to full, one line each.
function fullWindows() {
  return warnings().slice(0, 3).map(n => {
    const host = n.kind === 'agent' ? nodes.get(sid(n.session)) : null
    const name = n.kind === 'agent' ? `${n.label} in ${quote(host?.label ?? '')}` : quote(n.label)
    return `<li><button data-pick="${escapeHtml(n.id)}"><span class="pct ${level(fill(n))}">${pct(fill(n))}</span> ${escapeHtml(name)} will compact soon</button></li>`
  }).join('')
}

// ---------------------------------------------------------------------------
// Activity: every moment, or only messages, or only problems.

let feed = 'all'
const FEEDS = { all: () => true, mail: m => m.tone === 'mail', bad: m => m.tone === 'bad' }

function activityList() {
  const list = moments.filter(FEEDS[feed]).slice(0, 14)
  const empty = { all: 'Quiet so far.', mail: 'No messages between agents yet.', bad: 'Nothing has gone wrong.' }[feed]
  return list.map(m => `<li class="${m.tone}"><button data-pick="${escapeHtml(m.target ?? '')}"><span>${escapeHtml(m.text)}</span><time>${ago(m.t)}</time></button></li>`).join('') ||
    `<li class="muted"><span>${empty}</span></li>`
}

// ---------------------------------------------------------------------------
// The projects directory

function agentRow(a, depth) {
  const f = fill(a)
  const state = agentState(a)
  return `
    <button class="agent-row ${state}" style="--depth:${depth}" data-pick="${escapeHtml(a.id)}" data-hover="${escapeHtml(a.id)}">
      <i class="dot ${tintOf(a.type)}"></i>
      <span class="aname">${escapeHtml(who(a).title)}${a.description && a.description !== a.label ? `<span class="muted"> · ${escapeHtml(a.description)}</span>` : ''}</span>
      <span class="astate">${a.mailAt && Date.now() - a.mailAt < 8000 ? '<i class="env" title="Just got a message">✉</i>' : ''}${state === 'working' && a.context?.tokens ? `<span class="pct ${level(f)}">${pct(f)}</span>` : `<i class="sdot ${state}" title="${STATE_WORDS[state]}"></i>`}</span>
    </button>`
}

const countAll = branch => branch.reduce((sum, b) => sum + 1 + countAll(b.children), 0)

// A thread's live team, nested under its lead; finished ones fold away.
function teamRows(n, depth = 1) {
  let finished = 0
  const rows = []
  const walk = (branch, d) => {
    for (const { node, children } of branch) {
      if (agentState(node) === 'done') {
        finished += 1 + countAll(children)
        continue
      }
      rows.push(agentRow(node, d))
      walk(children, d + 1)
    }
  }
  walk(teamOf(n), depth)
  if (finished) rows.push(`<p class="folded" style="--depth:${depth}">${plural(finished, 'agent')} finished</p>`)
  return rows.join('')
}

function threadRow(n, running, selected) {
  const live = isLive(n)
  const state = threadState(n, running)
  const f = fill(n)
  const doing = !live ? `ended ${ago(n.endedAt ?? n.lastAt)}`
    : state === 'asking' ? `asks: ${assets.asksFor(n)[0]?.questions?.[0]?.question ?? assets.asksFor(n)[0]?.summary ?? 'a plan to approve'}`
    : state === 'working' ? (n.todos?.find(i => i.status === 'in_progress')?.text ?? activity.get(n.id)?.actions[0]?.text ?? 'working')
      : state === 'stuck' ? 'its last turn didn’t finish'
        : n.answer?.text ? `said ${quote(n.answer.text)}` : 'ready for you'
  return `
    <div class="thread ${live ? '' : 'past'} ${selected === n.id ? 'on' : ''}">
      <button class="entry" data-pick="${escapeHtml(n.id)}" data-hover="${escapeHtml(n.id)}">
        <i class="dot ${sessionTint(n.session)}"></i>
        <span class="ename">${escapeHtml(title(n))}${n.thread ? '<span class="badge" title="A claude.ai project’s coordinator handed this session its work">thread</span>' : ''}</span>
        ${live ? pill(state) : n.context?.tokens ? `<span class="pct ${level(f)}">${pct(f)}</span>` : '<span></span>'}
        ${live ? assets.progress(n) : ''}
        <span class="estate">${escapeHtml(who(n).name)} · ${live && n.context?.tokens ? `<span class="pct ${level(f)}">${pct(f)}</span> · ` : ''}${escapeHtml(doing)}</span>
      </button>
      ${live ? teamRows(n) : ''}
    </div>`
}

function directory(running, selected) {
  const projects = projectsList()
  const live = projects.flatMap(p => p.live)
  const working = live.filter(n => threadState(n, running) === 'working').length
  return `
    <h2 class="sideh">Projects <small>${live.length ? `${working} working · ${live.length - working} with you` : 'none live'}</small></h2>
    ${projects.map(p => `
      <section class="project">
        <p class="room"><i class="room-${roomKey(p.name)}"></i>${escapeHtml(p.name)}<small>${p.live.length ? plural(p.live.length, 'thread') : 'earlier'}</small></p>
        ${p.live.map(n => threadRow(n, running, selected)).join('')}
        ${p.past.length ? `${p.live.length ? '<p class="earlier">Earlier</p>' : ''}${p.past.map(n => threadRow(n, running, selected)).join('')}` : ''}
      </section>`).join('') || '<p class="muted">No sessions yet. Start Claude Code anywhere and it appears here.</p>'}`
}

// ---------------------------------------------------------------------------
// The clipboard for one thread or agent

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

function gauge(n, live, whose) {
  if (!n.context?.tokens) return ''
  const f = fill(n)
  return `
    <div class="dgauge"><span class="big ${level(f)}">${pct(f)}</span><span>of ${whose} context window ${live ? 'is' : 'was'} in use${live && f >= WARN_AT ? '. It will compact soon.' : '.'}</span></div>
    <span class="meter"><span class="${level(f)}" style="width:${(f * 100).toFixed(1)}%"></span></span>
    <p class="dmeta">${k(n.context.tokens)} of ${k(n.context.window)} tokens${n.compactions?.length ? ` · compacted ${plural(n.compactions.length, 'time')}` : ''}</p>`
}

// Project › thread › agent › agent, each a way back up.
function crumbs(n) {
  const chain = lineage(n)
  const parts = [`<button data-back>${escapeHtml(chain[0]?.projectName ?? 'Projects')}</button>`]
  chain.slice(0, -1).forEach(x => parts.push(`<button data-pick="${escapeHtml(x.id)}">${escapeHtml(x.kind === 'agent' ? who(x).name : x.label)}</button>`))
  return `<nav class="crumbs" aria-label="Where this is">${parts.join('<span aria-hidden="true">›</span>')}</nav>`
}

function messagesFor(n) {
  const host = n.kind === 'session' ? n : nodes.get(sid(n.session))
  const list = mailOf(host).filter(m => n.kind === 'session' || m.from === n.id || m.to === n.id).slice(0, 5)
  if (!list.length) return ''
  return `<h3>Messages</h3>${list.map(m => `
    <p class="mail"><b>${escapeHtml(m.fromName ?? 'Someone')} → ${escapeHtml(m.toName ?? 'someone')}</b>${m.text ? `<span>${escapeHtml(m.text)}</span>` : ''}<time>${ago(m.t)}</time></p>`).join('')}`
}

// The Team tab: the lead, then everyone it spawned, nested.
function teamTab(n, running) {
  const host = n.kind === 'session' ? n : nodes.get(sid(n.session))
  if (!host) return ''
  if (!isLive(host)) {
    const helpers = host.pastAgents ?? []
    return `<h3>Who helped</h3>${helpers.map(a => line(`<i class="dot ${tintOf(a.type)}"></i>${escapeHtml(a.label ?? a.type)}`, escapeHtml(a.description ?? ''))).join('') || '<p class="muted">No subagents.</p>'}`
  }
  const rows = []
  const walk = (branch, d) => branch.forEach(({ node, children }) => {
    const state = agentState(node)
    const kind = [node.teammate ? 'teammate' : node.fork ? 'fork' : node.background ? 'background' : '', node.name ? '' : node.type].filter(Boolean).join(' · ')
    rows.push(`
      <button class="member ${node.id === n.id ? 'on' : ''}" style="--depth:${d}" data-pick="${escapeHtml(node.id)}" data-hover="${escapeHtml(node.id)}">
        <i class="dot ${tintOf(node.type)}"></i>
        <span class="mname">${escapeHtml(who(node).title)}${kind ? `<small>${escapeHtml(kind)}</small>` : ''}</span>
        ${pill(state)}
        <span class="mdesc">${escapeHtml(node.description ?? '')}${node.context?.tokens ? ` · ${pct(fill(node))} of its window` : ''}</span>
      </button>`)
    walk(children, d + 1)
  })
  walk(teamOf(host), 1)
  return `
    <button class="member lead ${host.id === n.id ? 'on' : ''}" style="--depth:0" data-pick="${escapeHtml(host.id)}">
      <i class="dot ${sessionTint(host.session)}"></i>
      <span class="mname">${escapeHtml(who(host).title)}<small>the main conversation</small></span>
      ${pill(threadState(host, running))}
      <span class="mdesc">${host.model ? escapeHtml(host.model) : ''}</span>
    </button>
    ${rows.join('') || '<p class="muted">No agents yet. When the lead hands work off, its agents appear here.</p>'}
    ${messagesFor(n)}`
}

function sessionDetails(n) {
  const live = isLive(n)
  const act = activity.get(n.id)
  const files = act ? [...act.files].sort((a, b) => (b[1].edits * 3 + b[1].reads) - (a[1].edits * 3 + a[1].reads)).slice(0, 8) : []
  const facts = [
    n.turns !== undefined && plural(n.turns, 'turn'),
    n.toolCalls !== undefined && plural(n.toolCalls, 'tool call'),
    n.errors && plural(n.errors, 'error'),
    usd(n.costUsd),
    n.model,
  ].filter(Boolean).join(' · ')
  return `
    ${gauge(n, live, 'its')}
    ${facts ? `<p class="dmeta">${escapeHtml(facts)}</p>` : ''}
    ${live ? breakdown(n) + limits(n) : ''}
    ${files.length ? `<h3>Files it has worked on</h3>${files.map(fileLine).join('')}` : ''}
    ${act?.actions.length ? `<h3>Recently</h3>${act.actions.slice(0, 8).map(x => line(escapeHtml(x.text), ago(x.t), x.ok ? '' : 'bad')).join('')}` : ''}
    ${n.prompts?.length ? `<h3>What you asked</h3>${[...n.prompts].reverse().slice(0, 6).map(p => line(asked(p), ago(p.t))).join('')}` : ''}
    ${projectMilestones(n)}`
}

// What the thread's project has reached so far, and how close the rest are.
const day = t => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
function projectMilestones(n) {
  if (!n.project) return ''
  const list = milestones.progress(milestones.mine(), n.project)
  const got = list.filter(m => m.at).length
  return `<h3>Milestones <small class="muted">${escapeHtml(n.projectName ?? '')} · ${got} of ${list.length}</small></h3>
    <ul class="milestones">${list.map(m => `
      <li class="${m.at ? 'got' : ''}"><i aria-hidden="true">${m.at ? '★' : '☆'}</i><span>${escapeHtml(m.title)}${m.note ? `<small>${escapeHtml(m.note)}</small>` : ''}</span><time>${m.at ? day(m.at) : m.goal > 1 ? `${m.have.toLocaleString()} of ${m.goal.toLocaleString()}` : 'not yet'}</time></li>`).join('')}
    </ul>`
}

function agentDetails(n) {
  const facts = [n.model, n.history ? plural(n.history, 'tool call') : '', n.cwd ? `in ${n.cwd}` : ''].filter(Boolean).join(' · ')
  return `
    ${gauge(n, agentState(n) !== 'done', 'its own')}
    ${facts ? `<p class="dmeta">${escapeHtml(facts)}</p>` : ''}
    ${n.answer?.text ? `<h3>Last report</h3><p class="line">${escapeHtml(n.answer.text)}</p>` : ''}`
}

function head(n, running) {
  const isAgent = n.kind === 'agent'
  const state = isAgent ? agentState(n) : threadState(n, running)
  const sub = isAgent
    ? [n.description, n.teammateId ?? (n.teammate ? 'teammate' : ''), n.fork ? 'fork of its parent' : n.background ? 'in the background' : ''].filter(Boolean).join(' · ')
    : [who(n).title, n.thread ? 'Thread of a claude.ai project' : '', n.gitBranch, isLive(n) ? '' : `ended ${ago(n.endedAt ?? n.lastAt)}`].filter(Boolean).join(' · ')
  return `
    ${crumbs(n)}
    <h2 class="dtitle"><i class="dot ${isAgent ? tintOf(n.type) : sessionTint(n.session)}"></i>${escapeHtml(isAgent ? who(n).title : title(n))}</h2>
    <p class="dmeta">${pill(state)} ${escapeHtml(sub)}</p>`
}

// ---------------------------------------------------------------------------
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

// The clipboard's tabs. The conversation comes first: talking to a thread
// is what you open one for.
const TABS = [['transcript', 'Conversation'], ['outputs', 'Outputs'], ['team', 'Team'], ['details', 'Details']]
let tab = 'transcript'
let lastArgs = null

export function setTab(name) {
  if (!TABS.some(([t]) => t === name)) return
  tab = name
  if (lastArgs) render(lastArgs)
}

function clipboard(n, running) {
  const host = n.kind === 'session' ? n : nodes.get(sid(n.session))
  const teamSize = host && isLive(host) ? countAll(teamOf(host)) : (host?.pastAgents?.length ?? 0)
  const made = assets.outputCount(n)
  const count = name => (name === 'team' && teamSize ? `<small>${teamSize}</small>` : name === 'outputs' && made ? `<small>${made}</small>` : '')
  const button = ([name, label], i) => `<button type="button" role="tab" class="tab ${tab === name ? 'on' : ''}" aria-selected="${tab === name}" data-tab="${name}" title="${label} (${i + 1})">${label}${count(name)}</button>`
  // Above the conversation: what it's holding for you, then where it is in
  // its checklist.
  const asks = assets.asksFor(host ?? n).filter(a => n.kind === 'session' || a.who?.id === n.id)
  const pinned = asks.map(a => assets.askCard(a, { answerable: answerable() })).join('') + assets.checklist(n, { open: !asks.length })
  const body = tab === 'transcript' ? `${pinned ? `<div class="pinned">${pinned}</div>` : ''}<div class="transcript" data-keep="${escapeHtml(n.id)}"></div>`
    : tab === 'outputs' ? assets.outputsTab(n)
      : tab === 'team' ? teamTab(n, running)
      : n.kind === 'agent' ? agentDetails(n) : sessionDetails(n)
  return `${head(n, running)}<div class="tabs" role="tablist">${TABS.map(button).join('')}</div>${body}`
}

// Re-render what changed. `selected` is a node id or null; `hover` shows
// a critter's bubble while its directory entry is under the pointer.
let libraryOpen = false
let zoomed = null
document.addEventListener('office:zoom', e => { zoomed = e.detail; if (lastArgs) render(lastArgs) })
addEventListener('keydown', e => { if (e.key === 'Escape' && (zoomed || libraryOpen)) { if (zoomed) zoomed = null; else libraryOpen = false; if (lastArgs) render(lastArgs) } })

export function render(args) {
  lastArgs = args
  const { running, selected, pick, hover, answer } = args
  answerable = () => Boolean(answer?.can())
  patch($('#now'), `<p>${escapeHtml(headline(running))}</p>`)
  renderInbox(running)
  patch($('#full'), fullWindows())
  for (const b of document.querySelectorAll('[data-feed]')) b.classList.toggle('on', b.dataset.feed === feed)
  patch($('#moments'), activityList())
  const n = selected && nodes.get(selected)
  const detail = n && (n.kind === 'agent' || n.kind === 'session')
  $('#side').classList.toggle('clipboard', Boolean(detail))
  $('#side').classList.toggle('talking', Boolean(detail) && tab === 'transcript')
  patch($('#side'), !detail ? directory(running, selected) : clipboard(n, running))
  if (detail && tab === 'transcript') transcript.attach($('#side .transcript'), n)
  else transcript.detach()
  // The Library drawer and the lightbox.
  const made = outputs.filter(o => o.type !== 'file').length
  patch($('#library-count'), String(made || ''))
  $('#library').hidden = !libraryOpen
  if (libraryOpen) patch($('#library'), assets.library())
  $('#lightbox').hidden = !zoomed
  if (zoomed) patch($('#lightbox'), assets.lightbox(zoomed))
  for (const b of document.querySelectorAll('[data-tab]')) b.onclick = () => setTab(b.dataset.tab)
  for (const b of document.querySelectorAll('[data-feed]')) b.onclick = () => { feed = b.dataset.feed; render(lastArgs) }
  for (const b of document.querySelectorAll('[data-pick]')) b.onclick = () => b.dataset.pick && pick(b.dataset.pick)
  for (const b of document.querySelectorAll('[data-back]')) b.onclick = () => pick(null)
  $('#library-open').onclick = () => { libraryOpen = !libraryOpen; render(lastArgs) }
  $('#lightbox').onclick = () => { zoomed = null; render(lastArgs) }
  for (const b of document.querySelectorAll('[data-library]')) b.onclick = () => { libraryOpen = false; render(lastArgs) }
  for (const b of document.querySelectorAll('[data-shelf]')) b.onclick = () => { assets.setShelf(b.dataset.shelf); render(lastArgs) }
  for (const b of document.querySelectorAll('[data-zoom]')) b.onclick = e => { e.preventDefault(); zoomed = b.dataset.zoom; render(lastArgs) }
  for (const b of document.querySelectorAll('[data-answer]')) {
    b.onclick = e => {
      e.stopPropagation()
      const [session, id] = b.dataset.answer.split('|')
      answer?.send(session, id, b.dataset.label)
      b.classList.add('picked')
    }
  }
  for (const b of document.querySelectorAll('[data-hover]')) {
    b.onpointerenter = () => hover(b.dataset.hover)
    b.onpointerleave = () => hover(null)
  }
}

// `r`: reply to what's open, or to the thread that has waited longest.
export function focusReply() {
  if (lastArgs?.selected) {
    if (tab !== 'transcript') setTab('transcript')
    return transcript.focusComposer()
  }
  const field = document.querySelector('#inbox .card:not(.gone) textarea')
  field?.focus()
  return Boolean(field)
}
