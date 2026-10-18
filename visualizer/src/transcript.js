// The clipboard's Transcript tab: a session's or subagent's conversation,
// following its transcript live, and a box to message it.
//
// With a bridge behind the page, the conversation comes from GET
// /transcript (the session's own .jsonl file, read by the bridge) and a
// message goes to POST /chat with the token the page was served with (api.js); the
// session's mod delivers it. In the demo there's no bridge: the transcript
// is drawn from the sample activity and messages get a sample reply.

import { post, hasBridge } from './api.js'
import { nodes, sid, outputs } from './model.js'
import { activity, escapeHtml, ago } from './words.js'
import { markdown } from './markdown.js'
import { turnsOf, isLong } from './turns.js'
import { outputCard } from './assets.js'
import { describe, stepSummary } from './plain.js'
import { devView } from './prefs.js'
import * as mentions from './mentions.js'
import { who } from './critters.js'

const POLL_MS = 1500
const KEEP = 600
let demo = false

// main.js says whether this page plays sample activity.
export function setDemo(isDemo) {
  demo = isDemo
}
export const isDemo = () => demo

// What's open: one transcript at a time.
let view = null

const target = n => (n.kind === 'agent' ? { session: n.session, agent: n.agent } : { session: n.session })
const nameOf = n => (n.kind === 'agent' ? n.label : 'this session')

// ---------------------------------------------------------------------------
// Drawing

function bubble(entry, results) {
  const time = entry.t ? `<time>${ago(entry.t)}</time>` : ''
  switch (entry.kind) {
    case 'you':
      return `<div class="tx you"><p>${escapeHtml(entry.text)}</p>${time}</div>`
    case 'chat':
      return `<div class="tx you chat"><span class="tx-from">${entry.from === 'agent-office' ? 'From the office' : `From ${escapeHtml(entry.from)}`}</span><p>${escapeHtml(entry.text)}</p>${time}</div>`
    case 'say':
      // Claude's replies are markdown: drawn, not shown raw (markdown.js).
      return `<div class="tx say md">${markdown(entry.text)}${time}</div>`
    case 'note':
      return `<div class="tx note">${escapeHtml(entry.text)}</div>`
    // Claude Code couldn't answer: what went wrong and what to do.
    case 'problem':
      return `<div class="tx problem" role="alert"><b>${escapeHtml(entry.title)}</b><p>${escapeHtml(entry.fix)}</p><small>Claude Code said: ${escapeHtml(entry.line)}</small>${time}</div>`
    // What the work made, as the card the Outputs tab shows.
    case 'output':
      return `<div class="tx made ${entry.output.type}">${outputCard(entry.output)}</div>`
    // A checklist update (TodoWrite): where it stands, folded.
    case 'todo': {
      const done = entry.items.filter(i => i.status === 'completed').length
      const now = entry.items.find(i => i.status === 'in_progress')
      return `<details class="tx todo-snap"><summary><span class="todo-ring" style="--f:${(done / entry.items.length).toFixed(3)}"></span>${done === entry.items.length ? 'Checked off the last item' : `Checklist ${done}/${entry.items.length}${now ? `: ${escapeHtml(now.text)}` : ''}`}</summary><ol>${entry.items.map(i => `<li class="${i.status}"><i>${{ completed: '✓', in_progress: '✱' }[i.status] ?? '○'}</i>${escapeHtml(i.text)}</li>`).join('')}</ol></details>`
    }
    // A question it asked you (AskUserQuestion), and what you picked.
    case 'ask':
      return `<div class="tx asked"><p class="ask-eyebrow"><i class="ask-icon">${entry.type === 'permission' ? '>_' : entry.type === 'plan' ? '✎' : '?'}</i>${entry.type === 'permission' ? 'Asked to run' : entry.type === 'plan' ? 'Asked you to approve a plan' : 'Asked you'}</p><p>${escapeHtml(entry.text)}</p>${entry.answer ? `<span class="tx-answer">${escapeHtml(entry.answer)}</span>` : ''}${time}</div>`
    case 'tool': {
      const result = results.get(entry.id)
      const state = !result ? 'running' : result.ok ? 'ok' : 'bad'
      const head = `<i class="tx-dot ${state}"></i><b>${escapeHtml(entry.name)}</b> <span>${escapeHtml(entry.summary ?? '')}</span>`
      return result?.text
        ? `<details class="tx tool ${state}" data-id="${escapeHtml(entry.id)}"><summary>${head}</summary><pre>${escapeHtml(result.text)}</pre></details>`
        : `<div class="tx tool ${state}">${head}</div>`
    }
    default:
      return ''
  }
}

// A run of tool calls between two things said, as one readable step
// ("Looked through 6 files and ran the tests") that opens to the raw lines.
// Developer view shows the raw lines on their own, as before.
// A call with no result yet is still running only at the end of the
// conversation; earlier, its result is just out of view.
// What a run of calls did, in words: done so far, then what it's doing now.
function callsOf(tools, results, last) {
  return tools.map(e => ({ tool: e.name, summary: e.summary, ok: results.get(e.id)?.ok ?? (last ? undefined : true) }))
}
function stepText(calls) {
  const running = calls.some(c => c.ok === undefined)
  const finished = calls.filter(c => c.ok !== undefined)
  const current = calls.find(c => c.ok === undefined)
  const now = current && describe(current.tool, current.summary).now
  return !running ? stepSummary(calls)
    : finished.length ? `${stepSummary(finished)}, now ${now.charAt(0).toLowerCase()}${now.slice(1)}` : now
}
const stateOf = calls => (calls.some(c => c.ok === undefined) ? 'running' : calls.at(-1)?.ok === false ? 'bad' : 'ok')
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

function stepBubble(tools, results, last) {
  const calls = callsOf(tools, results, last)
  const state = stateOf(calls)
  const bumps = calls.filter(c => c.ok === false).length
  const meta = [calls.length > 1 ? `${calls.length} steps` : '', bumps && state !== 'bad' ? plural(bumps, 'bump') : ''].filter(Boolean).join(' · ')
  return `<details class="tx steps ${state}" data-id="steps-${escapeHtml(tools[0].id)}"><summary><i class="tx-dot ${state}"></i><span class="step-text">${escapeHtml(stepText(calls))}</span>${meta ? `<small>${meta}</small>` : ''}</summary><div class="step-lines">${tools.map(e => bubble(e, results)).join('')}</div></details>`
}

// A turn's work, folded to one line: everything it did, in words, and how
// many steps and notes. Open, it's the notes Claude wrote along the way
// and each run of calls as before. Open by itself while the turn runs.
function workBlock(work, results, running, key, answered) {
  const tools = work.filter(e => e.kind === 'tool')
  const notes = work.filter(e => e.kind === 'say')
  const calls = callsOf(tools, results, running)
  // A bump along the way of a turn that went on to answer isn't a failure.
  const state = running ? 'running' : answered || !tools.length ? 'ok' : stateOf(calls)
  const bumps = calls.filter(c => c.ok === false).length
  const text = tools.length ? stepText(calls) : `Wrote ${plural(notes.length, 'note')} along the way`
  const meta = [tools.length ? plural(tools.length, 'step') : '', notes.length && tools.length ? plural(notes.length, 'note') : '', bumps ? plural(bumps, 'bump') : ''].filter(Boolean).join(' · ')
  const inner = []
  let run = []
  const flush = last => { if (run.length) inner.push(stepBubble(run, results, last)); run = [] }
  work.forEach((e, i) => {
    if (e.kind === 'tool') { run.push(e); return }
    flush(false)
    inner.push(e.kind === 'say' ? `<div class="tx narr md">${markdown(e.text)}</div>` : bubble(e, results))
  })
  flush(running)
  return `<details class="tx work ${state}" data-id="${escapeHtml(key)}"${running ? ' open' : ''}><summary><i class="tx-dot ${state}"></i><span class="step-text">${escapeHtml(text)}</span>${meta ? `<small>${meta}</small>` : ''}</summary><div class="work-lines">${inner.join('')}</div></details>`
}

// Its answer, in full; an earlier long one folds to its opening lines
// until you ask for the rest.
function replyBlock(reply, isLatest) {
  const id = `reply-${reply.t ?? ''}-${reply.text.length}`
  const folded = !isLatest && isLong(reply) && !view?.expanded.has(id)
  const time = reply.t ? `<time>${ago(reply.t)}</time>` : ''
  const body = `<div class="tx say md reply${folded ? ' folded' : ''}">${markdown(reply.text)}${time}</div>`
  // The button sits outside the faded answer, so the fade doesn't take it too.
  return folded ? `<div class="reply-wrap">${body}<button type="button" class="tx-more" data-expand="${escapeHtml(id)}">Show all</button></div>` : body
}

// The conversation as turns (turns.js): what you said, the work folded to
// a line, anything it made or asked, then its answer. Developer view shows
// every entry on its own, as before.
function drawEntries(shown, results) {
  if (devView()) return shown.map(e => bubble(e, results)).join('')
  const turns = turnsOf(shown, results)
  return turns.map((t, i) => {
    const isLatest = i === turns.length - 1
    const key = `work-${t.prompt?.t ?? ''}-${t.work[0]?.id ?? t.work[0]?.t ?? i}`
    const parts = [
      t.prompt ? bubble(t.prompt, results) : '',
      t.work.length ? workBlock(t.work, results, t.running, key, Boolean(t.reply)) : '',
      ...t.extras.map(e => bubble(e, results)),
      t.reply ? replyBlock(t.reply, isLatest) : '',
    ].join('')
    return parts ? `<section class="turn">${parts}</section>` : ''
  }).join('')
}

// Developer view changed: draw again in the other voice.
export function redraw() {
  if (!view) return
  view.html = null
  draw()
}

function pendingBubble(p) {
  return `<div class="tx you chat pending ${p.ok === false ? 'failed' : ''}"><span class="tx-from">From the office</span><p>${escapeHtml(p.text)}</p><span class="tx-status">${escapeHtml(p.status)}</span></div>`
}

function draw() {
  if (!view?.root.isConnected) return
  const log = view.root.querySelector('.tx-log')
  const nearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 60
  const results = new Map(view.entries.filter(e => e.kind === 'result').map(e => [e.id, e]))
  const shown = view.entries.filter(e => e.kind !== 'result')
  const html = (drawEntries(shown, results) + view.pending.map(pendingBubble).join('')) ||
    `<p class="tx-empty">${escapeHtml(view.empty)}</p>`
  if (html === view.html) return
  view.html = html
  // Keep any tool call you opened open across the redraw.
  const open = new Set([...log.querySelectorAll('details[open]')].map(d => d.dataset.id))
  log.innerHTML = html
  for (const d of log.querySelectorAll('details')) if (open.has(d.dataset.id)) d.open = true
  if (nearBottom || view.firstDraw) log.scrollTop = log.scrollHeight
  view.firstDraw = false
}

// ---------------------------------------------------------------------------
// Where the conversation comes from

async function poll() {
  const v = view
  if (!v?.root.isConnected) return stop()
  if (demo) {
    v.entries = demoEntries(nodes.get(v.id))
    draw()
    return
  }
  if (v.isPolling) return
  v.isPolling = true
  const { session, agent } = v.target
  const query = new URLSearchParams({ session, ...(agent ? { agent } : {}), ...(v.next !== undefined ? { after: String(v.next) } : {}) })
  try {
    const res = await fetch(`/transcript?${query}`)
    if (res.status === 404) {
      v.empty = 'No transcript yet. It appears once Claude Code has written the first turn.'
    } else if (res.ok) {
      const { entries, next, reset } = await res.json()
      if (reset) v.entries = []
      v.entries = [...v.entries, ...entries].slice(-KEEP)
      v.next = next
      // A message we sent shows up in the transcript: drop its placeholder.
      // Matched loosely, in case Claude Code frames it in words of its own.
      // A resumed session's message comes back as an ordinary prompt.
      for (const e of entries) if (e.kind === 'chat' || e.kind === 'you') v.pending = v.pending.filter(p => p.text !== e.text && !e.text.includes(p.text))
      v.empty = 'Nothing said yet.'
    }
  } catch {
    v.empty = 'The bridge isn\'t answering. Is it still running?'
  } finally {
    v.isPolling = false
  }
  // Only draw if this is still the transcript on show.
  if (view === v) draw()
}

function stop() {
  if (view?.timer) clearInterval(view.timer)
  view = null
}

// A transcript made from the sample activity: what was asked, the tool
// calls in plain words, and the replies sent from the demo's message box.
function demoEntries(n) {
  if (!n) return []
  const host = nodes.get(sid(n.session))
  const actions = [...(activity.get(sid(n.session))?.actions ?? [])].reverse()
  const mine = actions.filter(a => (n.kind === 'agent' ? a.agent === n.agent : !a.agent))
  const entries = n.kind === 'agent'
    ? [{ kind: 'you', text: n.description ?? `Help with ${host?.label ?? 'the session'}`, t: n.startedAt }]
    : (n.prompts ?? []).map(p => ({ kind: 'you', text: p.text, t: p.t }))
  mine.forEach(a => {
    // Keyed by when it happened, so an opened step stays open as more arrive.
    const id = `demo-${n.id}-${a.t}-${a.tool}`
    entries.push({ kind: 'tool', id, name: a.tool, summary: a.summary ?? '', t: a.t })
    entries.push({ kind: 'result', id, ok: a.ok, text: a.ok ? '' : 'Something went wrong (sample activity).' })
  })
  // Its last reply, as Claude wrote it (markdown).
  if (n.answer?.problem) entries.push({ ...n.answer.problem, cause: n.answer.problem.kind, kind: 'problem', t: n.answer.t })
  else if (n.answer?.text) entries.push({ kind: 'say', text: n.answer.text, t: n.answer.t })
  // What it made, and what it asked you, where they happened.
  for (const o of outputs) {
    if (o.session !== n.session || (n.kind === 'agent' ? o.agent !== n.agent : o.agent) || o.type === 'plan') continue
    entries.push({ kind: 'output', output: o, t: o.t })
  }
  for (const a of n.answered ?? []) entries.push(a)
  if (n.todosLog) entries.push(...n.todosLog)
  entries.push(...(demoReplies.get(n.id) ?? []))
  return entries.sort((a, b) => (a.t ?? 0) - (b.t ?? 0))
}

const demoReplies = new Map()

// ---------------------------------------------------------------------------
// Sending

async function send(text) {
  const n = nodes.get(view.id)
  if (!n || !text.trim()) return
  const pending = { text: text.trim(), status: 'Sending…' }
  view.pending.push(pending)
  draw()
  // @name: to that agent of the thread instead (mentions.js). It answers in
  // its own conversation, so the note here just says where it went.
  const to = n.kind === 'session' ? mentions.resolve(n, text) : { node: n }
  if (view.mode === 'resume') {
    pending.status = 'Picking it up again…'
    draw()
    const result = await resume(n, pending.text)
    pending.ok = result.ok
    pending.status = result.status
    // The demo has it in its own conversation already.
    if (result.ok && !hasBridge() && view) {
      view.pending = view.pending.filter(p => p !== pending)
      view.entries = demoEntries(n)
    }
    draw()
    return
  }
  if (to.node !== n) {
    const result = await sendTo(to.node, to.text)
    pending.ok = result.ok
    pending.status = result.ok ? `Sent to ${to.node.label}. Its answer shows in its own conversation.` : result.status
    draw()
    return
  }
  if (demo) {
    // The demo has no bridge to announce it: tell the page ourselves.
    document.dispatchEvent(new CustomEvent('office:event', { detail: { kind: 'chat.sent', t: Date.now(), ...view.target, text: pending.text } }))
    const id = view.id
    setTimeout(() => {
      pending.status = 'Queued as the next prompt'
      draw()
    }, 500)
    setTimeout(() => {
      const list = demoReplies.get(id) ?? []
      list.push({ kind: 'chat', text: pending.text, from: 'agent-office', t: Date.now() })
      list.push({ kind: 'say', text: 'Got it. (This is the demo: nothing really runs, but in your own office the session reads this as its next prompt and answers here.)', t: Date.now() + 1 })
      demoReplies.set(id, list)
      if (view?.id === id) {
        view.pending = view.pending.filter(p => p !== pending)
        view.entries = demoEntries(n)
        draw()
      }
    }, 1800)
    return
  }
  try {
    const res = await post('/chat', { ...view.target, text: pending.text })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error ?? `the bridge answered ${res.status}`)
    pending.id = body.id
    pending.status = 'Waiting for the session to pick it up'
  } catch (err) {
    pending.ok = false
    pending.status = `Not sent: ${err.message}`
  }
  draw()
}

// The bridge's chat events: how a message we sent is getting on.
export function onEvent(ev) {
  if (!view || (ev.kind !== 'chat.delivered')) return
  const p = view.pending.find(x => x.id === ev.id)
  if (!p) return
  p.ok = ev.ok !== false
  p.status = p.ok ? capitalize(ev.how ?? 'Delivered') : `Couldn't deliver it: ${ev.how ?? 'unknown reason'}`
  draw()
}

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

// A message sent from outside the transcript (the inbox's reply box): the
// same route, without a transcript open. Resolves to { ok, status }.
export async function sendTo(n, text) {
  if (!n || !text.trim()) return { ok: false, status: 'Nothing to send' }
  if (demo) {
    document.dispatchEvent(new CustomEvent('office:event', { detail: { kind: 'chat.sent', t: Date.now(), ...target(n), text: text.trim() } }))
    const list = demoReplies.get(n.id) ?? []
    list.push({ kind: 'chat', text: text.trim(), from: 'agent-office', t: Date.now() })
    demoReplies.set(n.id, list)
    return { ok: true, status: 'Queued as the next prompt' }
  }
  if (!hasBridge()) return { ok: false, status: 'Messaging needs the office opened from its bridge (run /office)' }
  try {
    const res = await post('/chat', { ...target(n), text: text.trim() })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error ?? `the bridge answered ${res.status}`)
    return { ok: true, status: 'Sent. It arrives as the next prompt' }
  } catch (err) {
    return { ok: false, status: `Not sent: ${err.message}` }
  }
}

// A message from a quick action (actions.js): into the open conversation
// when it's this one's, so it shows there with its progress; else as from
// the inbox.
export async function say(n, text) {
  if (view?.id === n.id && view.root.isConnected) {
    await send(text)
    const last = view?.pending.at(-1)
    return last?.ok === false ? { ok: false, status: last.status } : { ok: true }
  }
  return sendTo(n, text)
}

export const canMessage = () => demo || hasBridge()

// Whether a thread has ended: a message to it picks it up again (resume).
export const hasEnded = n => n?.kind === 'session' && (n.past || n.status === 'done')

// Talk to a session that has ended: the bridge picks it up again in the
// background (`claude --bg --resume`), in its own folder, with this as its
// next prompt, and its critter comes back to its desk to answer.
// Resolves to { ok, status }.
export async function resume(n, text) {
  if (!n || !text.trim()) return { ok: false, status: 'Nothing to send' }
  if (!hasBridge()) {
    if (!demo) return { ok: false, status: 'Picking it up again needs the office opened from its bridge (run /office)' }
    // Demo only, with no bridge: the front desk plays it (desk.js).
    document.dispatchEvent(new CustomEvent('office:resume-demo', { detail: { session: n.session, dir: n.project ?? n.cwd, text: text.trim() } }))
    const list = demoReplies.get(n.id) ?? []
    list.push({ kind: 'you', text: text.trim(), t: Date.now() })
    demoReplies.set(n.id, list)
    return { ok: true, status: 'Picked up again in the background. It answers here.' }
  }
  try {
    // `dir` only for a demo bridge, which has no transcript to read it from.
    const res = await post('/resume', { session: n.session, text: text.trim(), dir: n.project ?? n.cwd })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error ?? `the bridge answered ${res.status}`)
    return { ok: true, status: 'Picked up again in the background. It answers here.' }
  } catch (err) {
    return { ok: false, status: `Couldn’t pick it up again: ${err.message}` }
  }
}

// A message from anywhere in the office: to a live thread as its next
// prompt, to an ended one by picking it up again.
export const talk = (n, text) => (hasEnded(n) ? resume(n, text) : say(n, text))

// Put the cursor in the open transcript's message box, if there is one.
export function focusComposer() {
  const field = view?.root.querySelector('.tx-compose textarea')
  field?.focus()
  return Boolean(field)
}

// ---------------------------------------------------------------------------
// Mounting into the clipboard

// What the message box says, or why there isn't one.
function composer(n) {
  if (!demo && !hasBridge()) return { off: 'Messaging needs the office opened from its bridge (run /office).' }
  if (hasEnded(n)) {
    return { resume: true, state: 'Ended · picks up again', placeholder: 'Message it to pick it up again…', hint: 'Picks it up again in the background · uses tokens', more: 'It has ended: this picks it up again in the background, in its own folder, and it answers here. That uses tokens.' }
  }
  if (n.kind === 'agent' && n.status === 'done') {
    return { state: 'Finished', placeholder: `Message ${n.label}…`, hint: 'Resumes it to answer · uses tokens', more: 'It has finished: a message resumes it to answer, which uses tokens.' }
  }
  if (n.kind === 'agent') return { state: 'Live', placeholder: `Message ${n.label}…`, hint: 'Goes straight to this agent', more: 'Goes straight to this subagent while it works.' }
  return { state: 'Live', placeholder: 'Message this session…', hint: 'Arrives as its next prompt · @ picks an agent', more: 'Arrives as its next prompt, marked as from Agent Office. Tool approvals still happen in Claude Code.' }
}

// The message box, the way Claude Code's own looks: who it goes to on a
// chip above, the words in a rounded box with the send key inside it, and
// a quiet line of hints under it.
const SEND_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 4.5v6.2a1.8 1.8 0 0 1-1.8 1.8H5"/><path d="M8.2 9.2 4.8 12.5l3.4 3.3"/></svg>'

function composeHtml(n, box) {
  const to = who(n)
  const what = n.kind === 'agent' ? (n.description || n.label) : n.label
  return `<form class="tx-compose${box.resume ? ' resume' : ''}">
    <div class="tx-to" title="${escapeHtml(box.more)}">
      <i class="tx-dot" aria-hidden="true"></i>
      <b>${escapeHtml(to.name)}</b>
      <span class="tx-what">${escapeHtml(what ?? '')}</span>
      <em class="tx-state">${escapeHtml(box.state)}</em>
    </div>
    <div class="tx-box">
      <textarea rows="1" placeholder="${escapeHtml(box.placeholder)}" aria-label="${escapeHtml(box.placeholder)}"></textarea>
      <button type="submit" class="tx-send" aria-label="Send" title="Send (Enter)" disabled>${SEND_ICON}</button>
    </div>
    <p class="tx-bar"><span class="tx-hint" title="${escapeHtml(box.more)}">${escapeHtml(box.hint)}</span><span class="tx-keys" title="Enter sends, Shift+Enter starts a new line"><kbd>↵</kbd> send <kbd>⇧↵</kbd> new line</span></p>
  </form>`
}

// The box grows with what you write, up to a few lines.
function fit(field) {
  field.style.height = 'auto'
  field.style.height = `${Math.min(field.scrollHeight, 160)}px`
}

// Put the transcript for node `n` into `root` (the tab's holder), or keep
// the one already there.
export function attach(root, n) {
  if (!root || !n) return
  const box = composer(n)
  const mode = box.off ? 'off' : box.resume ? 'resume' : 'chat'
  if (view?.id === n.id && view.root === root && view.mode === mode) return
  // The same thread, ended or picked up again: keep what you were typing,
  // and what you just sent.
  const same = view?.id === n.id ? view : null
  const typed = same?.root.querySelector('.tx-compose textarea')?.value
  stop()
  root.innerHTML = `
    <div class="tx-log" role="log" aria-live="polite" aria-label="Conversation with ${escapeHtml(nameOf(n))}"></div>
    ${box.off ? `<p class="tx-off">${escapeHtml(box.off)}</p>` : composeHtml(n, box)}`
  view = { id: n.id, root, mode, target: target(n), entries: same?.entries ?? [], pending: same?.pending ?? [], next: same?.next, empty: 'Reading the transcript…', firstDraw: true, expanded: same?.expanded ?? new Set() }
  // "Show all" on a folded answer: it stays open as the conversation updates.
  root.querySelector('.tx-log').addEventListener('click', e => {
    const more = e.target.closest('[data-expand]')
    if (!more || !view) return
    view.expanded.add(more.dataset.expand)
    view.html = null
    draw()
  })
  // A picture in the conversation opens in the lightbox (panels.js).
  root.querySelector('.tx-log').addEventListener('click', e => {
    const zoom = e.target.closest('[data-zoom]')
    if (!zoom) return
    e.preventDefault()
    document.dispatchEvent(new CustomEvent('office:zoom', { detail: zoom.dataset.zoom }))
  })
  const form = root.querySelector('form')
  const field = form?.querySelector('textarea')
  const sendKey = form?.querySelector('.tx-send')
  const sync = () => { fit(field); sendKey.disabled = !field.value.trim() }
  if (field && typed) field.value = typed
  field?.addEventListener('input', sync)
  if (field) requestAnimationFrame(sync)
  if (field && n.kind === 'session' && mode === 'chat') mentions.attach(field, () => nodes.get(n.id))
  form?.addEventListener('submit', e => {
    e.preventDefault()
    const text = field.value
    field.value = ''
    sync()
    void send(text)
  })
  field?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault()
      form.requestSubmit()
    }
  })
  draw()
  void poll()
  view.timer = setInterval(() => { if (!document.hidden) void poll() }, POLL_MS)
}

export const detach = stop
