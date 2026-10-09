// The office in words, for screen readers and keyboards: the 3D scene's
// text alternative (a list of every live thread and what it's doing, one
// button each, hidden until you tab into it), and a polite announcement
// when a new letter lands in Waiting on you.
//
// The list and the announcement are written only when their words change,
// so a screen reader isn't read the same thing every refresh.

import { nodes, fill, threadState, agentState, openAsks } from './model.js'
import { quote } from './words.js'

const isLive = n => n.kind === 'session' && !n.past && n.status !== 'done'
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const title = n => n.prompts?.[0]?.text ?? n.label

const SAYS = {
  working: 'working', waiting: 'waiting on you', asking: 'needs your answer', stuck: 'needs a look', ended: 'ended',
}

// One thread as a sentence: what it is, where, its state, its helpers and
// how full its context window is.
export function describe(n, { state, helpers = 0, percent } = {}) {
  const parts = [`${title(n)}, in ${n.projectName ?? 'another folder'}: ${SAYS[state] ?? state}`]
  if (helpers) parts.push(`${plural(helpers, 'agent')} helping`)
  if (percent !== undefined) parts.push(`context ${percent}% full`)
  return `${parts.join(', ')}.`
}

// A new letter, in a few words: whose it is and what it's waiting on.
export function letter(n, state, { question } = {}) {
  if (state === 'asking') return `New letter: ${title(n)} asks: ${question ?? 'a question for you'}`
  if (state === 'stuck') return `New letter: ${title(n)} needs a look. Its last turn didn’t finish.`
  return `New letter: ${title(n)} is waiting on you.${n.answer?.text ? ` It said ${quote(n.answer.text.slice(0, 140))}` : ''}`
}

// Threads that weren't waiting on you last time and are now, in order.
export function arrivals(before, now) {
  return now.filter(id => !before.has(id))
}

const WAITING = new Set(['asking', 'waiting', 'stuck'])
const WARMUP_MS = 4000

let seen = null // thread ids waiting on you at the last refresh (null before the first)
let listText = ''

export function render({ running, pick }) {
  if (typeof document === 'undefined') return
  const live = [...nodes.values()].filter(isLive)
  const states = new Map(live.map(n => [n.id, threadState(n, running)]))

  // The announcement: only letters that arrived since the last refresh.
  const waiting = live.filter(n => WAITING.has(states.get(n.id))).map(n => n.id)
  // The first few seconds are the office filling in, not news.
  if (seen && performance.now() > WARMUP_MS) {
    const fresh = arrivals(seen, waiting).map(id => {
      const n = nodes.get(id)
      const ask = openAsks(n)[0]
      return letter(n, states.get(id), { question: ask?.questions?.[0]?.question ?? (ask?.type === 'permission' ? 'may it run a command?' : ask?.type === 'plan' ? 'a plan to approve' : undefined) })
    })
    if (fresh.length) {
      const el = document.getElementById('announce')
      if (el) el.textContent = fresh.join(' ')
    }
  }
  seen = new Set(waiting)

  // The list: one button per live thread, by project.
  const list = document.getElementById('scene-list-items')
  if (!list) return
  const rows = live
    .sort((a, b) => (a.projectName ?? '').localeCompare(b.projectName ?? '') || (a.startedAt ?? 0) - (b.startedAt ?? 0))
    .map(n => {
      const helpers = [...nodes.values()].filter(x => x.kind === 'agent' && x.session === n.session && agentState(x) === 'working').length
      const percent = n.context?.tokens ? Math.round(fill(n) * 100) : undefined
      return { id: n.id, text: describe(n, { state: states.get(n.id), helpers, percent }) }
    })
  const text = rows.map(r => `${r.id}\u0000${r.text}`).join('\n')
  if (text === listText) return
  listText = text
  // Keyed, so the button holding focus stays put while its words change.
  const keep = new Map([...list.querySelectorAll('button[data-id]')].map(b => [b.dataset.id, b.parentElement]))
  rows.forEach((r, i) => {
    let li = keep.get(r.id)
    keep.delete(r.id)
    if (!li) {
      li = document.createElement('li')
      const b = document.createElement('button')
      b.type = 'button'
      b.dataset.id = r.id
      b.addEventListener('click', () => pick(b.dataset.id))
      li.append(b)
    }
    const b = li.firstChild
    if (b.textContent !== r.text) b.textContent = r.text
    if (list.children[i] !== li) list.insertBefore(li, list.children[i] ?? null)
  })
  for (const li of keep.values()) li.remove()
  const empty = document.getElementById('scene-list-empty')
  if (empty) empty.hidden = rows.length > 0
}

// The clipboard's tabs follow the ARIA tabs pattern: the arrow keys (and
// Home and End) move between them, and only the open one is in the Tab order.
export function tabKeys(e) {
  const tab = e.target.closest?.('[role="tab"]')
  if (!tab) return
  const tabs = [...tab.parentElement.querySelectorAll('[role="tab"]')]
  const at = tabs.indexOf(tab)
  const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: tabs.length - 1 }[e.key]
  if (to === undefined) return
  e.preventDefault()
  e.stopPropagation()
  const next = tabs[(to + tabs.length) % tabs.length]
  next.click()
  // The tabs are redrawn by the click; find the new one by name.
  requestAnimationFrame(() => document.querySelector(`[role="tab"][data-tab="${next.dataset.tab}"]`)?.focus())
}
