// Rename a project or pick its icon, its room's wall color and its decor:
// a small card that opens from the icon on a room's sign or beside the
// project in the directory. What you choose is kept in this browser
// (names.js, looks.js) and shows at once; Reset goes back to the name the
// office made from the repository and the room it picked.

import { projectName, projectIcon, prettyProject, defaultIcon, setProject, isCustom, PICKS } from './names.js'
import { roomLook, setRoomLook } from './looks.js'
import { WALLS, DECOR } from './themes.js'
import { roomKey } from './table.js'

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

let card = null
let current = null // { id, raw, anchor }

function close() {
  if (!card || card.hidden) return
  card.hidden = true
  const back = current?.anchor
  current = null
  if (back?.isConnected) back.focus({ preventScroll: true })
}

function place(anchor) {
  const r = anchor?.getBoundingClientRect?.()
  const w = card.offsetWidth, h = card.offsetHeight
  const x = r ? r.left + r.width / 2 - w / 2 : innerWidth / 2 - w / 2
  const below = r ? r.bottom + 8 : innerHeight / 2 - h / 2
  const y = below + h > innerHeight - 8 && r ? r.top - h - 8 : below
  card.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, x))}px`
  card.style.top = `${Math.max(8, Math.min(innerHeight - h - 8, y))}px`
}

function draw() {
  const { id, raw } = current
  const icon = projectIcon(id, raw)
  const wall = roomKey(raw, id)
  const decor = roomLook(id).decor
  const changed = () => isCustom(id) || Object.keys(roomLook(id)).length > 0
  card.innerHTML = `
    <p class="eyebrow" id="pe-title">Name, icon and room</p>
    <form>
      <label class="pe-name"><span>Name</span><input name="name" maxlength="40" autocomplete="off" value="${esc(projectName(id, raw))}" placeholder="${esc(prettyProject(raw))}"></label>
      <div class="pe-icons" role="group" aria-label="Icon">${PICKS.map(p => `<button type="button" data-pick-icon="${p}" aria-pressed="${p === icon}" aria-label="Use ${p}">${p}</button>`).join('')}</div>
      <p class="pe-label" id="pe-walls">Walls</p>
      <div class="pe-swatches" role="group" aria-labelledby="pe-walls">${WALLS.map(w => `<button type="button" data-pick-wall="${w.id}" class="room-${w.id}" aria-pressed="${w.id === wall}" aria-label="${w.name} walls" title="${w.name}"></button>`).join('')}</div>
      <p class="pe-label" id="pe-decor">Decor</p>
      <div class="pe-decor" role="group" aria-labelledby="pe-decor">${DECOR.map(d => `<button type="button" data-pick-decor="${d.id}" aria-pressed="${d.id === decor}"><span aria-hidden="true">${d.icon}</span>${d.name}</button>`).join('')}</div>
      <p class="pe-from">From <code>${esc(raw)}</code></p>
      <div class="pe-actions">
        <button type="button" data-reset ${changed() ? '' : 'disabled'}>Reset</button>
        <button type="submit" class="primary">Done</button>
      </div>
    </form>`
  const form = card.querySelector('form')
  const name = form.elements.name
  const keep = (changes) => {
    const icon = card.querySelector('[aria-pressed="true"]')?.dataset.pickIcon
    const typed = name.value.trim()
    setProject(id, {
      name: typed && typed !== prettyProject(raw) ? typed : undefined,
      icon: icon && icon !== defaultIcon(raw) ? icon : undefined,
      ...changes,
    })
    card.querySelector('[data-reset]').disabled = !changed()
    document.dispatchEvent(new CustomEvent('office:names'))
  }
  // The room's look, kept apart from its name. Picking the decor it has
  // takes it away again.
  const restyle = (changes) => {
    setRoomLook(id, { ...roomLook(id), ...changes })
    card.querySelector('[data-reset]').disabled = !changed()
  }
  for (const b of card.querySelectorAll('[data-pick-wall]')) {
    b.addEventListener('click', () => {
      for (const o of card.querySelectorAll('[data-pick-wall]')) o.setAttribute('aria-pressed', String(o === b))
      restyle({ wall: b.dataset.pickWall })
    })
  }
  for (const b of card.querySelectorAll('[data-pick-decor]')) {
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true'
      for (const o of card.querySelectorAll('[data-pick-decor]')) o.setAttribute('aria-pressed', String(on && o === b))
      restyle({ decor: on ? b.dataset.pickDecor : undefined })
    })
  }
  name.addEventListener('input', () => keep())
  for (const b of card.querySelectorAll('[data-pick-icon]')) {
    b.addEventListener('click', () => {
      for (const o of card.querySelectorAll('[data-pick-icon]')) o.setAttribute('aria-pressed', String(o === b))
      keep()
    })
  }
  card.querySelector('[data-reset]').addEventListener('click', () => {
    setProject(id, {})
    setRoomLook(id, {})
    document.dispatchEvent(new CustomEvent('office:names'))
    draw()
    card.querySelector('input').focus()
  })
  form.addEventListener('submit', e => {
    e.preventDefault()
    keep()
    close()
  })
}

export function openProjectEditor(id, raw, anchor) {
  if (!card) {
    card = document.createElement('div')
    card.className = 'proj-edit paper'
    card.setAttribute('role', 'dialog')
    card.setAttribute('aria-labelledby', 'pe-title')
    card.hidden = true
    document.body.append(card)
    card.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      close()
    })
    addEventListener('pointerdown', e => {
      if (card.hidden || card.contains(e.target) || e.target.closest?.('[data-edit-project]')) return
      close()
    })
  }
  if (!card.hidden && current?.id === id) return close()
  current = { id, raw, anchor }
  draw()
  card.hidden = false
  place(anchor)
  const input = card.querySelector('input')
  input.focus()
  input.select()
}

document.addEventListener('office:project-edit', e => openProjectEditor(e.detail.id, e.detail.raw, e.detail.anchor))
