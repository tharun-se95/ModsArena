// @mentions in a reply: type @ and the thread's agents come up by name;
// a reply that names one goes to that subagent instead of the thread, the
// way the clipboard's message box talks to an agent you've picked.

import { nodes, sid, teamOf, agentState } from './model.js'
import { escapeHtml } from './words.js'

// ---------------------------------------------------------------------------
// Pure

// A name as you'd type it after @: no spaces.
export const handle = name => (name ?? '').trim().replace(/\s+/g, '-')

// The word being typed after an @, up to the caret, or null.
export function typing(text, caret) {
  const m = /(^|\s)@([\w.-]*)$/.exec(text.slice(0, caret))
  return m ? { query: m[2], start: caret - m[2].length - 1 } : null
}

// Names starting with (then containing) what's typed, best first.
export function matches(people, query, limit = 6) {
  const q = query.toLowerCase()
  const starts = people.filter(p => handle(p.name).toLowerCase().startsWith(q))
  const within = people.filter(p => !starts.includes(p) && handle(p.name).toLowerCase().includes(q))
  return [...starts, ...within].slice(0, limit)
}

// Who a reply is for: the first @name of one of `people`, taken out of the
// text. `{ to, text }`, `to` undefined when it names nobody.
export function route(text, people) {
  const byLength = [...people].sort((a, b) => handle(b.name).length - handle(a.name).length)
  for (const p of byLength) {
    const re = new RegExp(`(^|\\s)@${handle(p.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[\\s,.:;!?])[,:]?`, 'i')
    if (re.test(text)) return { to: p, text: text.replace(re, '$1').replace(/\s{2,}/g, ' ').trim() }
  }
  return { to: undefined, text }
}

// ---------------------------------------------------------------------------
// The thread's agents, as people to mention.

export function peopleOf(n) {
  const host = n?.kind === 'session' ? n : n && nodes.get(sid(n.session))
  if (!host) return []
  const out = []
  const walk = branch => branch.forEach(({ node, children }) => {
    out.push({ id: node.id, name: node.label, state: agentState(node), description: node.description })
    walk(children)
  })
  walk(teamOf(host))
  // Ones still at work first.
  return out.sort((a, b) => (a.state === 'done') - (b.state === 'done'))
}

// Where a reply to `n` goes: `{ node, text }`.
export function resolve(n, text) {
  const { to, text: rest } = route(text, peopleOf(n))
  return to ? { node: nodes.get(to.id) ?? n, text: rest || text, to } : { node: n, text }
}

// ---------------------------------------------------------------------------
// The suggestion list under a textarea.

export function attach(field, nodeOf) {
  if (field.dataset.mentions) return
  field.dataset.mentions = '1'
  const list = document.createElement('ul')
  list.className = 'mentions'
  list.setAttribute('role', 'listbox')
  list.id = `mentions-${Math.random().toString(36).slice(2, 8)}`
  list.hidden = true
  field.setAttribute('aria-autocomplete', 'list')
  field.setAttribute('aria-controls', list.id)
  field.insertAdjacentElement('afterend', list)
  let shown = []
  let at = 0
  let word = null

  const hide = () => {
    list.hidden = true
    shown = []
    field.removeAttribute('aria-activedescendant')
  }
  const draw = () => {
    list.innerHTML = shown.map((p, i) => `<li role="option" id="${list.id}-${i}" aria-selected="${i === at}" data-i="${i}"><b>@${escapeHtml(handle(p.name))}</b>${p.description ? `<span>${escapeHtml(p.description)}</span>` : ''}${p.state === 'done' ? '<small>finished · resumes to answer</small>' : ''}</li>`).join('')
    list.hidden = !shown.length
    if (shown.length) field.setAttribute('aria-activedescendant', `${list.id}-${at}`)
  }
  const choose = i => {
    const p = shown[i]
    if (!p || !word) return
    const before = field.value.slice(0, word.start)
    const after = field.value.slice(field.selectionStart)
    const put = `@${handle(p.name)} `
    field.value = before + put + after.replace(/^\S*/, '')
    const caret = before.length + put.length
    field.setSelectionRange(caret, caret)
    field.dispatchEvent(new Event('input', { bubbles: true }))
    hide()
  }
  field.addEventListener('input', () => {
    word = typing(field.value, field.selectionStart)
    const n = nodeOf()
    shown = word && n ? matches(peopleOf(n), word.query) : []
    at = 0
    draw()
  })
  // Before the form's own Enter-to-send.
  field.addEventListener('keydown', e => {
    if (list.hidden) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      at = (at + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length
      draw()
    } else if ((e.key === 'Enter' || e.key === 'Tab') && !e.isComposing) {
      choose(at)
    } else if (e.key === 'Escape') {
      hide()
    } else {
      return
    }
    e.preventDefault()
    e.stopImmediatePropagation()
  }, true)
  list.addEventListener('pointerdown', e => {
    const li = e.target.closest('[data-i]')
    if (!li) return
    e.preventDefault()
    choose(Number(li.dataset.i))
  })
  field.addEventListener('blur', () => setTimeout(hide, 120))
}
