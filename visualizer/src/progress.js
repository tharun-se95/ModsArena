// A thread's checklist as something you can read at a glance: "3 of 7
// done" and a bar that fills, in the directory, on the clipboard and on
// the easel by its desk. Pure; it knows nothing about the page.

import { escapeHtml } from './words.js'

// `todos` as TodoWrite gives them. Null when there's no checklist.
export function progressOf(todos) {
  if (!todos?.length) return null
  const total = todos.length
  const done = todos.filter(i => i.status === 'completed').length
  const now = todos.find(i => i.status === 'in_progress')
  return {
    done, total, frac: done / total, now: now ? now.active ?? now.text : undefined,
    finished: done === total,
    words: done === total ? (total === 1 ? 'Done' : `All ${total} done`) : `${done} of ${total} done`,
  }
}

// The bar and its words, for a directory row, a card or the clipboard.
// `big` adds what it's on now, for the clipboard's header.
export function progressHtml(todos, { big = false } = {}) {
  const p = progressOf(todos)
  if (!p) return ''
  const pct = Math.round(p.frac * 100)
  return `<span class="prog ${big ? 'big' : ''} ${p.finished ? 'all' : ''}">
    <span class="prog-bar" role="progressbar" aria-label="Checklist" aria-valuemin="0" aria-valuemax="${p.total}" aria-valuenow="${p.done}" aria-valuetext="${p.words}"><i style="width:${pct}%"></i></span>
    <span class="prog-words"><b>${p.words}</b>${big && p.now && !p.finished ? ` · now: ${escapeHtml(p.now)}` : ''}</span>
  </span>`
}
