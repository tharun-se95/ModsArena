// The settings menu: the gear in the top bar opens a small popover with the
// office's secondary controls (snapshot, alerts, sound, past sessions, the
// tour; each wired up by its own module), Developer view, and toggles any
// module adds for itself:
//
//   settings.add({ id: 'reduce-motion', label: 'Reduce motion',
//     hint: 'No glides, hops or confetti', type: 'toggle',
//     get: () => on, set: value => { on = value } })
//
// `get` is read whenever the menu opens, so a row always shows the truth;
// `disabled` (a function, optional) greys a row out with its hint saying why.
// Added rows keep the order they were added in, under Developer view.

import { devView, setDevView } from './prefs.js'
import { escapeHtml } from './words.js'

const rows = []
let button = null
let menu = null
let slot = null

function bind() {
  if (menu) return true
  if (button) return false
  button = document.getElementById('settings-open')
  const pop = document.getElementById('settings')
  if (!button || !pop) return false
  menu = pop
  slot = menu.querySelector('.set-rows') ?? menu.appendChild(Object.assign(document.createElement('div'), { className: 'set-rows' }))
  button.setAttribute('aria-haspopup', 'true')
  button.addEventListener('click', () => (menu.hidden ? open() : close()))
  slot.addEventListener('change', e => {
    const row = rows.find(r => r.id === e.target.dataset.setting)
    if (!row) return
    row.set(e.target.checked)
    draw()
  })
  // What opens something of its own (the alerts panel, the tour) puts the
  // menu away; the toggles and Snapshot (it says "Saved") leave it open.
  menu.addEventListener('click', e => {
    if (e.target.closest('#alerts-open, #tour-open')) close()
  })
  // Esc or a click elsewhere puts it away; Esc here doesn't also leave the
  // thread you have open, and hands focus back to the gear.
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    close()
    button.focus()
  })
  addEventListener('pointerdown', e => {
    if (!menu.hidden && !menu.contains(e.target) && !button.contains(e.target)) close()
  })
  return true
}

function draw() {
  if (!slot) return
  slot.innerHTML = rows.map(r => {
    const off = r.disabled?.() ?? false
    const hint = typeof r.hint === 'function' ? r.hint() : r.hint
    return `<label class="switch set-row${off ? ' off' : ''}">
      <input type="checkbox" role="switch" data-setting="${escapeHtml(r.id)}" ${r.get() ? 'checked' : ''} ${off ? 'disabled' : ''}>
      <span><b>${escapeHtml(r.label)}</b>${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</span>
    </label>`
  }).join('')
}

export function open() {
  if (!bind()) return
  draw()
  menu.hidden = false
  button.setAttribute('aria-expanded', 'true')
  menu.querySelector('button, input:not([disabled])')?.focus()
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
  if (bind()) draw()
}

export const list = () => rows.map(r => ({ id: r.id, label: r.label, on: Boolean(r.get()) }))

// Developer view: plain words everywhere, or the raw tool lines.
export function mountSettings(onChange) {
  if (!bind()) return
  const dev = document.getElementById('dev-view')
  if (!dev) return
  const mark = () => {
    dev.checked = devView()
    document.body.classList.toggle('dev', devView())
  }
  mark()
  dev.addEventListener('change', () => {
    setDevView(dev.checked)
    mark()
    onChange?.()
  })
}
