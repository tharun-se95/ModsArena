// Rename a project or pick its icon: a small card that opens from the icon
// on a room's sign or beside the project in the directory. What you choose
// is kept in this browser (names.js); Reset goes back to the name the
// office made from the repository.

import { projectName, projectIcon, prettyProject, defaultIcon, setProject, isCustom, PICKS } from './names.js'

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
  card.innerHTML = `
    <p class="eyebrow" id="pe-title">Name and icon</p>
    <form>
      <label class="pe-name"><span>Name</span><input name="name" maxlength="40" autocomplete="off" value="${esc(projectName(id, raw))}" placeholder="${esc(prettyProject(raw))}"></label>
      <div class="pe-icons" role="group" aria-label="Icon">${PICKS.map(p => `<button type="button" data-pick-icon="${p}" aria-pressed="${p === icon}" aria-label="Use ${p}">${p}</button>`).join('')}</div>
      <p class="pe-from">From <code>${esc(raw)}</code></p>
      <div class="pe-actions">
        <button type="button" data-reset ${isCustom(id) ? '' : 'disabled'}>Reset</button>
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
    card.querySelector('[data-reset]').disabled = !isCustom(id)
    document.dispatchEvent(new CustomEvent('office:names'))
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
