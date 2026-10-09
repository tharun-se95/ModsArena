// The top bar's settings: a small menu under the gear with the office's
// secondary controls (snapshot, alerts, sound, past sessions, the tour; each
// wired up by its own module) and Developer view, which brings back the raw
// tool lines everywhere.

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
  // What opens something of its own (the alerts panel, the tour) puts the
  // menu away; the toggles and Snapshot (it says "Saved") leave it open.
  pop.addEventListener('click', e => {
    if (e.target.closest('#alerts-open, #tour-open')) show(false)
  })
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
