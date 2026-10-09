// A thread's critter color: the dot beside its name on the clipboard opens
// a small card of ten colors that read on every office theme (themes.js).
// The pick is kept in this browser (looks.js) and the critter, its rug, its
// mug and every dot for it change at once; Reset goes back to the color
// the office gave it.

import { CRITTERS } from './themes.js'
import { critterColor, setCritterColor } from './looks.js'
import { sessionTint } from './table.js'

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

let card = null
let current = null // { session, name, anchor }

function close() {
  if (!card || card.hidden) return
  card.hidden = true
  const back = current?.anchor
  current = null
  if (back?.isConnected) back.focus({ preventScroll: true })
}

function place(anchor) {
  const r = anchor.getBoundingClientRect()
  const w = card.offsetWidth, h = card.offsetHeight
  const below = r.bottom + 8
  const y = below + h > innerHeight - 8 ? r.top - h - 8 : below
  card.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, r.left - 12))}px`
  card.style.top = `${Math.max(8, Math.min(innerHeight - h - 8, y))}px`
}

function draw() {
  const { session, name } = current
  const now = sessionTint(session)
  card.innerHTML = `
    <p class="eyebrow" id="cc-title">${esc(name)}’s color</p>
    <div class="pe-swatches" role="group" aria-labelledby="cc-title">${CRITTERS.map(c => `<button type="button" data-pick-critter="${c.id}" style="background:var(--${c.id})" aria-pressed="${c.id === now}" aria-label="${c.name}" title="${c.name}"></button>`).join('')}</div>
    <div class="pe-actions">
      <button type="button" data-reset ${critterColor(session) ? '' : 'disabled'}>Reset</button>
      <button type="button" class="primary" data-done>Done</button>
    </div>`
  for (const b of card.querySelectorAll('[data-pick-critter]')) {
    b.addEventListener('click', () => {
      setCritterColor(session, b.dataset.pickCritter)
      draw()
      card.querySelector(`[data-pick-critter="${b.dataset.pickCritter}"]`).focus()
    })
  }
  card.querySelector('[data-reset]').addEventListener('click', () => {
    setCritterColor(session, null)
    draw()
    card.querySelector('[aria-pressed="true"]')?.focus()
  })
  card.querySelector('[data-done]').addEventListener('click', close)
}

export function openCritterColor(session, name, anchor) {
  if (!card) {
    card = document.createElement('div')
    card.className = 'proj-edit critter-edit paper'
    card.setAttribute('role', 'dialog')
    card.setAttribute('aria-labelledby', 'cc-title')
    card.hidden = true
    document.body.append(card)
    card.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      close()
    })
    addEventListener('pointerdown', e => {
      if (card.hidden || card.contains(e.target) || e.target.closest?.('[data-critter-color]')) return
      close()
    })
  }
  if (!card.hidden && current?.session === session) return close()
  current = { session, name, anchor }
  draw()
  card.hidden = false
  place(anchor)
  card.querySelector('[aria-pressed="true"]')?.focus()
}

document.addEventListener('click', e => {
  const b = e.target.closest?.('[data-critter-color]')
  if (b) openCritterColor(b.dataset.critterColor, b.dataset.name || 'This critter', b)
})
