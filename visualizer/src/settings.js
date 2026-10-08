// The top bar's settings: a small menu under the gear. For now it holds
// Developer view, which brings back the raw tool lines everywhere.

import { devView, setDevView } from './prefs.js'

export function mountSettings(onChange) {
  const open = document.getElementById('settings-open')
  const pop = document.getElementById('settings')
  const dev = document.getElementById('dev-view')
  if (!open || !pop || !dev) return
  const show = on => {
    pop.hidden = !on
    open.setAttribute('aria-expanded', String(on))
  }
  const mark = () => {
    dev.checked = devView()
    document.body.classList.toggle('dev', devView())
  }
  mark()
  open.addEventListener('click', () => show(pop.hidden))
  dev.addEventListener('change', () => {
    setDevView(dev.checked)
    mark()
    onChange?.()
  })
  // Esc or a click elsewhere puts it away; Esc here doesn't also leave the
  // thread you have open.
  pop.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    show(false)
    open.focus()
  })
  addEventListener('pointerdown', e => {
    if (!pop.hidden && !pop.contains(e.target) && !open.contains(e.target)) show(false)
  })
}
