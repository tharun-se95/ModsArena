// The clipboard's Transcript tab: a session's or subagent's conversation,
// following its transcript live, and a box to message it.
//
// With a bridge behind the page, the conversation comes from GET
// /transcript (the session's own .jsonl file, read by the bridge) and a
// message goes to POST /chat with the token the page was served with; the
// session's mod delivers it. In the demo there's no bridge: the transcript
// is drawn from the sample activity and messages get a sample reply.

import { nodes, sid, outputs } from './model.js'
import { activity, escapeHtml, ago } from './words.js'
import { outputCard } from './assets.js'

const POLL_MS = 1500
const KEEP = 600
const token = document.querySelector('meta[name="agent-office-token"]')?.content || ''
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
      return `<div class="tx say"><p>${escapeHtml(entry.text)}</p>${time}</div>`
    case 'note':
      return `<div class="tx note">${escapeHtml(entry.text)}</div>`
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

function pendingBubble(p) {
  return `<div class="tx you chat pending ${p.ok === false ? 'failed' : ''}"><span class="tx-from">From the office</span><p>${escapeHtml(p.text)}</p><span class="tx-status">${escapeHtml(p.status)}</span></div>`
}

function draw() {
  if (!view?.root.isConnected) return
  const log = view.root.querySelector('.tx-log')
  const nearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 60
  const results = new Map(view.entries.filter(e => e.kind === 'result').map(e => [e.id, e]))
  const shown = view.entries.filter(e => e.kind !== 'result')
  const html = (shown.map(e => bubble(e, results)).join('') + view.pending.map(pendingBubble).join('')) ||
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
      for (const e of entries) if (e.kind === 'chat') v.pending = v.pending.filter(p => p.text !== e.text && !e.text.includes(p.text))
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
  const mine = n.kind === 'agent'
    ? actions.filter(a => a.text.startsWith(n.label))
    : actions
  const entries = n.kind === 'agent'
    ? [{ kind: 'you', text: n.description ?? `Help with ${host?.label ?? 'the session'}`, t: n.startedAt }]
    : (n.prompts ?? []).map(p => ({ kind: 'you', text: p.text, t: p.t }))
  mine.forEach((a, i) => {
    const id = `demo-${n.id}-${a.t}-${i}`
    // "Explore searched for X": who did it in bold, then what.
    const [who, what] = a.text.startsWith('The session ') ? ['session', a.text.slice(12)] : [a.text.split(' ')[0], a.text.split(' ').slice(1).join(' ')]
    entries.push({ kind: 'tool', id, name: who, summary: what, t: a.t })
    entries.push({ kind: 'result', id, ok: a.ok, text: a.ok ? '' : 'Something went wrong (sample activity).' })
  })
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
  if (demo) {
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
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-agent-office-token': token },
      body: JSON.stringify({ ...view.target, text: pending.text }),
    })
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
    const list = demoReplies.get(n.id) ?? []
    list.push({ kind: 'chat', text: text.trim(), from: 'agent-office', t: Date.now() })
    demoReplies.set(n.id, list)
    return { ok: true, status: 'Queued as the next prompt' }
  }
  if (!token) return { ok: false, status: 'Messaging needs the office opened from its bridge (run /office)' }
  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-agent-office-token': token },
      body: JSON.stringify({ ...target(n), text: text.trim() }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error ?? `the bridge answered ${res.status}`)
    return { ok: true, status: 'Sent. It arrives as the next prompt' }
  } catch (err) {
    return { ok: false, status: `Not sent: ${err.message}` }
  }
}

export const canMessage = () => demo || Boolean(token)

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
  if (!demo && !token) return { off: 'Messaging needs the office opened from its bridge (run /office).' }
  if (n.kind === 'session' && (n.past || n.status === 'done')) return { off: 'This session has ended. Resume it in Claude Code to talk to it again.' }
  if (n.kind === 'agent' && n.status === 'done') {
    return { placeholder: `Message ${n.label}…`, hint: 'It has finished: a message resumes it to answer, which uses tokens.' }
  }
  if (n.kind === 'agent') return { placeholder: `Message ${n.label}…`, hint: 'Goes straight to this subagent while it works.' }
  return { placeholder: 'Message this session…', hint: 'Arrives as its next prompt, marked as from Agent Office. Tool approvals still happen in Claude Code.' }
}

// Put the transcript for node `n` into `root` (the tab's holder), or keep
// the one already there.
export function attach(root, n) {
  if (!root || !n) return
  if (view?.id === n.id && view.root === root) return
  stop()
  const box = composer(n)
  root.innerHTML = `
    <div class="tx-log" role="log" aria-live="polite" aria-label="Conversation with ${escapeHtml(nameOf(n))}"></div>
    ${box.off
      ? `<p class="tx-off">${escapeHtml(box.off)}</p>`
      : `<form class="tx-compose">
          <textarea rows="2" placeholder="${escapeHtml(box.placeholder)}" aria-label="${escapeHtml(box.placeholder)}"></textarea>
          <button type="submit">Send</button>
          <p class="tx-hint">${escapeHtml(box.hint)} Enter sends, Shift+Enter starts a new line.</p>
        </form>`}`
  view = { id: n.id, root, target: target(n), entries: [], pending: [], next: undefined, empty: 'Reading the transcript…', firstDraw: true }
  // A picture in the conversation opens in the lightbox (panels.js).
  root.querySelector('.tx-log').addEventListener('click', e => {
    const zoom = e.target.closest('[data-zoom]')
    if (!zoom) return
    e.preventDefault()
    document.dispatchEvent(new CustomEvent('office:zoom', { detail: zoom.dataset.zoom }))
  })
  const form = root.querySelector('form')
  const field = form?.querySelector('textarea')
  form?.addEventListener('submit', e => {
    e.preventDefault()
    const text = field.value
    field.value = ''
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
