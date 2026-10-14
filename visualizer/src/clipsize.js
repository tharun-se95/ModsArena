// The right panel: one frame for the Projects directory and a thread's
// clipboard, which swap in it as you pick a thread or agent and go back.
// It runs the full height of the office and its width is yours: drag its
// left edge (mouse, pen or finger), or focus the grip and use the arrow
// keys; double-click the grip for the default width again.
// On a phone or a narrow window an open clipboard is a sheet along the
// bottom instead: drag its handle up or down. Both are remembered in this
// browser.
//
// The grips live beside #side, not in it, since panels.js rebuilds what's
// inside. The sizes are CSS variables on <html> (--panel-w, or --sheet-h
// for the sheet) that index.html lays the panel out from. While you drag,
// <html> has .clip-resizing, and the office holds still until you let go
// (main.js).

import { load, save } from './prefs.js'

export const PANEL_W = 480 // half as wide again as the old 320px directory
export const PANEL_MIN_W = 300
export const SHEET_MIN = 180
export const SHEET_SHARE = 0.72 // of the room between a phone's bars
export const STEP = 24 // one arrow key press
const GAP_SIDE = 16
const LEFT_PANEL = 290 + 32 // keep the notice card and tape uncovered

const finite = n => typeof n === 'number' && Number.isFinite(n)

// A panel width, kept on screen: no narrower than it can be read at, and
// never wider than leaves the left panel uncovered.
export function clampPanel(w, { vw }) {
  const maxW = Math.max(PANEL_MIN_W, Math.min(vw - GAP_SIDE * 2, vw - LEFT_PANEL - GAP_SIDE * 2))
  return Math.round(Math.min(maxW, Math.max(PANEL_MIN_W, finite(w) ? w : PANEL_W)))
}

// The panel hangs from the right: dragging its left edge left widens it.
export const dragPanel = (start, dx) => start - dx

// A width saved by an older version: the clipboard's own size, if you'd
// set one, else nothing (the default).
export const fromOld = old => (finite(old?.w) ? old.w : null)

// A phone sheet's height, as a share of the room between the bars, so it
// keeps its proportion when the phone turns. A strip of office stays
// visible above it.
export function clampSheet(share, room) {
  const min = Math.min(1, SHEET_MIN / Math.max(1, room))
  const max = Math.max(min, 1 - 72 / Math.max(1, room))
  return Math.min(max, Math.max(min, finite(share) ? share : SHEET_SHARE))
}

// The sheet hangs from the bottom: dragging up makes it taller.
export const dragSheet = (start, dy, room) => start - dy / Math.max(1, room)

// ---------------------------------------------------------------------------
// The page

const PHONE = '(max-width: 600px)'
const SHEET = '(max-width: 900px)' // where index.html makes it a sheet
let width = load('panel-width', null) ?? fromOld(load('clipboard-size', null))
let share = load('clipboard-sheet', SHEET_SHARE)

export function mountClipSize() {
  const side = document.getElementById('side')
  if (!side || typeof matchMedia !== 'function') return
  const root = document.documentElement
  const phone = matchMedia(PHONE)
  const viewport = () => ({ vw: innerWidth, vh: innerHeight })
  const small = matchMedia(SHEET)
  // The room a sheet has: between a phone's top bar and tab bar, or below
  // the top bar on a narrow window (index.html).
  const room = () => Math.max(1, innerHeight - (phone.matches ? 62 + 68 : 64 + 12))

  const grip = (cls, label) => {
    const el = document.createElement('div')
    el.className = `clip-grip ${cls}`
    el.tabIndex = 0
    el.setAttribute('role', 'separator')
    el.setAttribute('aria-label', label)
    el.hidden = true
    side.after(el)
    return el
  }
  const edge = grip('edge', 'Resize the panel: drag, or use the arrow keys')
  const handle = grip('sheet', 'Resize the sheet: drag, or use the up and down arrows')
  edge.setAttribute('aria-orientation', 'vertical')
  handle.setAttribute('aria-orientation', 'horizontal')

  function apply() {
    const open = side.classList.contains('clipboard')
    const sheet = small.matches
    const w = clampPanel(width, viewport())
    root.style.setProperty('--panel-w', `${w}px`)
    root.style.setProperty('--sheet-h', `${Math.round(clampSheet(share, room()) * room())}px`)
    edge.hidden = sheet
    handle.hidden = !open || !sheet
    if (open && sheet) root.dataset.sheet = ''
    else delete root.dataset.sheet
    edge.setAttribute('aria-valuenow', String(w))
    handle.setAttribute('aria-valuenow', String(Math.round(clampSheet(share, room()) * 100)))
  }

  function setWidth(next, keep) {
    width = clampPanel(next, viewport())
    if (keep) save('panel-width', width)
    apply()
  }
  function setSheet(next, keep) {
    share = clampSheet(next, room())
    if (keep) save('clipboard-sheet', share)
    apply()
  }

  // Dragging, with pointer capture so a fast drag can't slip off the grip.
  // The office holds still until the drag ends, then settles once.
  function drag(el, onMove) {
    el.addEventListener('pointerdown', e => {
      if (e.button !== 0) return
      e.preventDefault()
      el.setPointerCapture(e.pointerId)
      el.classList.add('dragging')
      root.classList.add('clip-resizing')
      const x0 = e.clientX, y0 = e.clientY
      const startW = clampPanel(width, viewport())
      const startShare = clampSheet(share, room())
      const move = ev => onMove(ev.clientX - x0, ev.clientY - y0, startW, startShare, false)
      const up = ev => {
        onMove(ev.clientX - x0, ev.clientY - y0, startW, startShare, true)
        el.classList.remove('dragging')
        root.classList.remove('clip-resizing')
        dispatchEvent(new Event('panel-resized'))
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerup', up)
        el.removeEventListener('pointercancel', up)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
    })
  }
  drag(edge, (dx, dy, start, _, keep) => setWidth(dragPanel(start, dx), keep))
  drag(handle, (dx, dy, _, start, keep) => setSheet(dragSheet(start, dy, room()), keep))

  // The keyboard: arrows grow and shrink it, Home puts it back.
  const keys = (el, onKey) => el.addEventListener('keydown', e => {
    const done = onKey(e.key, e.shiftKey ? STEP * 4 : STEP)
    if (done) { e.preventDefault(); e.stopPropagation() }
  })
  keys(edge, (key, step) => {
    const w = clampPanel(width, viewport())
    if (key === 'ArrowLeft') setWidth(w + step, true)
    else if (key === 'ArrowRight') setWidth(w - step, true)
    else if (key === 'Home') setWidth(null, true)
    else return false
    return true
  })
  keys(handle, (key, step) => {
    const s = clampSheet(share, room())
    if (key === 'ArrowUp') setSheet(s + step / room(), true)
    else if (key === 'ArrowDown') setSheet(s - step / room(), true)
    else if (key === 'Home') setSheet(SHEET_SHARE, true)
    else return false
    return true
  })
  edge.addEventListener('dblclick', () => setWidth(null, true))
  handle.addEventListener('dblclick', () => setSheet(SHEET_SHARE, true))

  new MutationObserver(apply).observe(side, { attributes: true, attributeFilter: ['class'] })
  addEventListener('resize', apply)
  small.addEventListener?.('change', apply)
  phone.addEventListener?.('change', apply)
  apply()
}
