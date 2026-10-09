// The settings menu: a gear in the top bar that opens a small popover of
// toggles. Any module adds its own row, and the menu draws itself the
// first time one arrives:
//
//   settings.add({ id: 'reduce-motion', label: 'Reduce motion',
//     hint: 'No glides, hops or confetti', type: 'toggle',
//     get: () => on, set: value => { on = value } })
//
// `get` is read whenever the menu opens, so a row always shows the truth;
// `disabled` (a function, optional) greys a row out with its hint saying why.
// Rows keep the order they were added in.

import { escapeHtml } from './words.js'

const rows = []
let button = null
let menu = null

const GEAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 6.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.6 2.5h2.8l.4 2 1.5.8 1.9-.8 1.4 2.4-1.5 1.4v1.4l1.5 1.4-1.4 2.4-1.9-.8-1.5.8-.4 2H8.6l-.4-2-1.5-.8-1.9.8-1.4-2.4 1.5-1.4V8.3L3.4 6.9l1.4-2.4 1.9.8 1.5-.8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>'

function mount() {
  if (button) return
  const controls = document.querySelector('.topbar .controls')
  if (!controls) return
  button = document.createElement('button')
  button.type = 'button'
  button.className = 'gear'
  button.id = 'settings-open'
  button.title = 'Settings'
  button.setAttribute('aria-label', 'Settings')
  button.setAttribute('aria-haspopup', 'true')
  button.setAttribute('aria-expanded', 'false')
  button.setAttribute('aria-controls', 'settings')
  button.innerHTML = GEAR
  // Before the connection status, which stays last.
  controls.insertBefore(button, controls.querySelector('#conn'))
  menu = document.createElement('div')
  menu.className = 'hud paper settings'
  menu.id = 'settings'
  menu.setAttribute('role', 'group')
  menu.setAttribute('aria-label', 'Settings')
  menu.hidden = true
  document.querySelector('.stage-wrap')?.append(menu)
  button.addEventListener('click', () => (menu.hidden ? open() : close()))
  menu.addEventListener('change', e => {
    const row = rows.find(r => r.id === e.target.dataset.setting)
    if (!row) return
    row.set(e.target.checked)
    draw()
  })
  // Esc or a click elsewhere puts it away; Esc hands focus back to the gear.
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    close()
    button.focus()
  })
  addEventListener('pointerdown', e => {
    if (!menu.hidden && !menu.contains(e.target) && !button.contains(e.target)) close()
  })
}

function draw() {
  if (!menu) return
  menu.innerHTML = `<p class="eyebrow">Settings</p>${rows.map(r => {
    const off = r.disabled?.() ?? false
    return `<label class="set-row${off ? ' off' : ''}">
      <input type="checkbox" role="switch" data-setting="${escapeHtml(r.id)}" ${r.get() ? 'checked' : ''} ${off ? 'disabled' : ''}>
      <span><b>${escapeHtml(r.label)}</b>${r.hint ? `<small>${escapeHtml(typeof r.hint === 'function' ? r.hint() : r.hint)}</small>` : ''}</span>
    </label>`
  }).join('')}`
}

export function open() {
  mount()
  if (!menu) return
  draw()
  menu.hidden = false
  button.setAttribute('aria-expanded', 'true')
  menu.querySelector('input:not([disabled])')?.focus()
}

export function close() {
  if (!menu || menu.hidden) return
  menu.hidden = true
  button.setAttribute('aria-expanded', 'false')
}

// Add a row: { id, label, hint?, type: 'toggle', get, set, disabled? }.
// Adding a row with an id that's already there replaces it.
export function add(row) {
  if (row.type && row.type !== 'toggle') throw new Error(`settings: unknown type ${row.type}`)
  const at = rows.findIndex(r => r.id === row.id)
  if (at >= 0) rows[at] = row
  else rows.push(row)
  mount()
  if (menu && !menu.hidden) draw()
}

export const list = () => rows.map(r => ({ id: r.id, label: r.label, on: Boolean(r.get()) }))
