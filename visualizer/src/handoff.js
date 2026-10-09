// Handing work around the office. Drag a letter from Waiting on you (a
// thread's last answer) or something a thread made (a deliverable card)
// onto any critter, and a note opens to send it there as a message, worded
// for whoever gets it. Each draggable also answers to H, for the keyboard,
// with a picker for who gets it. In a reply, @name sends it to that
// subagent of the thread instead (mentions.js).

import { nodes, sid, outputs, teamOf, agentState } from './model.js'
import { escapeHtml, quote } from './words.js'
import * as transcript from './transcript.js'

// ---------------------------------------------------------------------------
// Pure: what's handed off, and the words it goes with.

const KIND_WORDS = { image: 'picture', artifact: 'artifact', pr: 'pull request', link: 'link', file: 'file', plan: 'plan' }

// The message for `item`, a letter `{ kind: 'letter', from, text }` or an
// output `{ kind: 'output', output, from }` (`from` is the thread's title).
export function handoffText(item) {
  if (item.kind === 'letter') {
    return `Passing on what the thread ${quote(item.from ?? 'another thread')} said, in case it helps:\n\n${item.text}`
  }
  const o = item.output
  const what = KIND_WORDS[o.type] ?? 'output'
  const where = o.url ?? o.path
  return `Have a look at this ${what}${item.from ? ` from ${quote(item.from)}` : ''}: ${o.title}${where && where !== o.title ? ` (${where})` : ''}`
}

// Everyone who can take a message: live threads and their agents still
// around, threads first.
export function recipients(list) {
  const live = list.filter(n => n.kind === 'session' && !n.past && n.status !== 'done')
  const out = []
  for (const s of live) {
    out.push({ id: s.id, name: 'The thread itself', kind: 'session', group: s.label, thread: s.id })
    const walk = branch => branch.forEach(({ node, children }) => {
      if (agentState(node) !== 'done' && agentState(node) !== 'failed') {
        out.push({ id: node.id, name: node.description && node.description !== node.label ? `${node.label}: ${node.description}` : node.label, kind: 'agent', group: s.label, thread: s.id })
      }
      walk(children)
    })
    walk(teamOf(s))
  }
  return out
}

// ---------------------------------------------------------------------------
// What a drag carries: `office/handoff` holds "letter|<thread id>" or
// "output|<session>|<output id>".

export const MIME = 'application/x-agent-office-handoff'

export function itemOf(ref) {
  const [kind, a, ...rest] = (ref ?? '').split('|')
  if (kind === 'letter') {
    const n = nodes.get(a)
    return n?.answer?.text ? { kind, from: n.prompts?.[0]?.text ?? n.label, text: n.answer.text, source: n.id } : null
  }
  if (kind === 'output') {
    const id = rest.join('|')
    const o = outputs.find(x => x.session === a && x.id === id)
    const n = o && nodes.get(sid(o.session))
    return o ? { kind, output: o, from: n?.prompts?.[0]?.text ?? n?.label, source: n?.id } : null
  }
  return null
}

// ---------------------------------------------------------------------------
// The note that opens on a drop (or on H): who it's for, the words, Send.

let open = null // { ref, to, x, y, status? }
let pickAt = () => null // (clientX, clientY) -> critter id, from table.js
let hover = () => {}

const sheet = () => document.getElementById('handoff')

function draw() {
  const el = sheet()
  if (!el) return
  if (!open) {
    el.hidden = true
    el.innerHTML = ''
    return
  }
  const item = itemOf(open.ref)
  if (!item) return close()
  const people = recipients([...nodes.values()]).filter(p => p.id !== item.source || item.kind === 'output')
  const to = nodes.get(open.to)
  el.hidden = false
  el.innerHTML = `
    <form class="handoff-card paper" aria-label="Hand it off">
      <p class="handoff-eyebrow"><i>✉</i>${item.kind === 'letter' ? 'Pass this letter on' : 'Hand this over'}</p>
      <label class="handoff-to">To
        <select name="to">${[...new Set(people.map(p => p.thread))].map(g => `<optgroup label="${escapeHtml(people.find(p => p.thread === g).group)}">${people.filter(p => p.thread === g).map(p => `<option value="${escapeHtml(p.id)}" ${p.id === open.to ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}</optgroup>`).join('')}</select>
      </label>
      <textarea name="text" rows="5" aria-label="The message">${escapeHtml(open.text ?? handoffText(item))}</textarea>
      <p class="handoff-hint">${to?.kind === 'agent' ? 'Goes straight to this agent while it works.' : 'Arrives as its next prompt, marked as from Agent Office.'}</p>
      ${open.status ? `<p class="handoff-status ${open.ok === false ? 'bad' : ''}" role="status">${escapeHtml(open.status)}</p>` : ''}
      <div class="handoff-row"><button type="button" data-handoff-close>Cancel</button><button type="submit" class="go">Send</button></div>
    </form>`
  // Placed by the drop, kept on screen.
  const card = el.firstElementChild
  const w = card.offsetWidth || 320
  const h = card.offsetHeight || 260
  card.style.left = `${Math.max(12, Math.min(innerWidth - w - 12, (open.x ?? innerWidth / 2) - w / 2))}px`
  card.style.top = `${Math.max(12, Math.min(innerHeight - h - 12, (open.y ?? innerHeight / 2) - h - 24))}px`
  const form = card
  form.text.oninput = () => { open.text = form.text.value }
  form.to.onchange = () => { open.to = form.to.value; draw() }
  form.querySelector('[data-handoff-close]').onclick = close
  form.onsubmit = async e => {
    e.preventDefault()
    const target = nodes.get(form.to.value)
    const text = form.text.value
    if (!target || !text.trim()) return
    open.status = 'Sending…'
    open.text = text
    draw()
    const result = await transcript.sendTo(target, text)
    if (!open) return
    if (result.ok) {
      open.status = `Sent to ${target.label}.`
      draw()
      setTimeout(close, 1400)
    } else {
      open.status = result.status
      open.ok = false
      draw()
    }
  }
  if (!open.focused) {
    open.focused = true
    form.querySelector('textarea').focus()
  }
}

export function start(ref, to, x, y) {
  if (!transcript.canMessage() || !itemOf(ref)) return
  const fallback = recipients([...nodes.values()]).find(p => p.id !== itemOf(ref).source)?.id
  open = { ref, to: to ?? fallback, x, y }
  draw()
}

function close() {
  const back = open?.trigger
  open = null
  draw()
  back?.focus?.()
}

export const isOpen = () => Boolean(open)

// ---------------------------------------------------------------------------
// Wiring: draggables anywhere on the page, the stage as the drop target.

export function listen({ stage, critterAt, setHover }) {
  pickAt = critterAt
  hover = setHover
  document.addEventListener('dragstart', e => {
    const el = e.target.closest?.('[data-handoff]')
    if (!el || !transcript.canMessage()) return
    e.dataTransfer.setData(MIME, el.dataset.handoff)
    e.dataTransfer.setData('text/plain', (() => { const item = itemOf(el.dataset.handoff); return item ? handoffText(item) : '' })())
    e.dataTransfer.effectAllowed = 'copy'
    document.body.classList.add('handing-off')
  })
  document.addEventListener('dragend', () => {
    document.body.classList.remove('handing-off')
    stage.classList.remove('drop-ok')
    hover(null)
  })
  stage.addEventListener('dragover', e => {
    if (!e.dataTransfer.types.includes(MIME)) return
    const id = pickAt(e.clientX, e.clientY)
    const ok = id && nodes.get(id) && (nodes.get(id).kind === 'session' || nodes.get(id).kind === 'agent')
    stage.classList.toggle('drop-ok', Boolean(ok))
    hover(ok ? id : null)
    if (ok) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  })
  stage.addEventListener('dragleave', e => {
    if (!stage.contains(e.relatedTarget)) { stage.classList.remove('drop-ok'); hover(null) }
  })
  stage.addEventListener('drop', e => {
    const ref = e.dataTransfer.getData(MIME)
    const id = pickAt(e.clientX, e.clientY)
    stage.classList.remove('drop-ok')
    hover(null)
    if (!ref || !id) return
    e.preventDefault()
    start(ref, id, e.clientX, e.clientY)
  })
  // H on a focused letter or output: the same note, with a picker.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      close()
      return
    }
    if ((e.key !== 'h' && e.key !== 'H') || e.metaKey || e.ctrlKey || e.altKey) return
    const el = document.activeElement?.closest?.('[data-handoff]')
    if (!el) return
    e.preventDefault()
    e.stopPropagation()
    const r = el.getBoundingClientRect()
    start(el.dataset.handoff, undefined, r.left + r.width / 2, r.top + 40)
    if (open) open.trigger = el
  }, true)
}
