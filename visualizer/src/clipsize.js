// The clipboard's size: bigger by default, and yours to change. Drag its
// left edge or bottom-left corner (mouse, pen or finger), or focus a grip
// and use the arrow keys; double-click a grip for the default size again.
// On a phone or a narrow window the clipboard is a sheet along the bottom:
// drag its handle up or down. Both sizes are remembered in this browser.
//
// The grips live beside #side, not in it, since panels.js rebuilds what's
// inside. The size is two CSS variables on <html> (--clip-w, --clip-h, or
// --sheet-h for the sheet) that index.html lays the clipboard out from.

import { load, save } from './prefs.js'

export const CLIP_W = 416 // about 1.3 times the directory's 320px
export const CLIP_MIN_W = 300
export const CLIP_MIN_H = 260
export const CLIP_H = 720
export const SHEET_MIN = 180
export const SHEET_SHARE = 0.72 // of the room between a phone's bars
export const STEP = 24 // one arrow key press
const GAP_TOP = 74 // the top bar, and the clip that sticks up
const GAP_BOTTOM = 16
const GAP_SIDE = 16
const LEFT_PANEL = 290 + 32 // keep the notice card and tape uncovered

const finite = n => typeof n === 'number' && Number.isFinite(n)

// A desktop clipboard size, kept on screen: no narrower or shorter than it
// can be read at, and never wider than leaves the left panel uncovered.
export function clampClip(size, { vw, vh }) {
  const maxW = Math.max(CLIP_MIN_W, Math.min(vw - GAP_SIDE * 2, vw - LEFT_PANEL - GAP_SIDE * 2))
  const maxH = Math.max(CLIP_MIN_H, vh - GAP_TOP - GAP_BOTTOM)
  const w = finite(size?.w) ? size.w : CLIP_W
  const h = finite(size?.h) ? size.h : CLIP_H
  return {
    w: Math.round(Math.min(maxW, Math.max(CLIP_MIN_W, w))),
    h: Math.round(Math.min(maxH, Math.max(CLIP_MIN_H, h))),
  }
}

// A phone sheet's height, as a share of the room between the bars, so it
// keeps its proportion when the phone turns. A strip of office stays
// visible above it.
export function clampSheet(share, room) {
  const min = Math.min(1, SHEET_MIN / Math.max(1, room))
  const max = Math.max(min, 1 - 72 / Math.max(1, room))
  return Math.min(max, Math.max(min, finite(share) ? share : SHEET_SHARE))
}

// Where a drag lands: the clipboard hangs from the top right, so dragging
// left widens it and dragging down makes it taller.
export const dragClip = (start, dx, dy, edge) => ({ w: start.w - dx, h: edge === 'corner' ? start.h + dy : start.h })

// The sheet hangs from the bottom: dragging up makes it taller.
export const dragSheet = (start, dy, room) => start - dy / Math.max(1, room)

// ---------------------------------------------------------------------------
// The page

const PHONE = '(max-width: 600px)'
const SHEET = '(max-width: 900px)' // where index.html makes it a sheet
let saved = load('clipboard-size', null)
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
  const edge = grip('edge', 'Resize the clipboard: drag, or use the arrow keys')
  const corner = grip('corner', 'Resize the clipboard: drag, or use the arrow keys')
  const handle = grip('sheet', 'Resize the sheet: drag, or use the up and down arrows')
  edge.setAttribute('aria-orientation', 'vertical')
  handle.setAttribute('aria-orientation', 'horizontal')

  function apply() {
    const open = side.classList.contains('clipboard')
    const sheet = small.matches
    const size = clampClip(saved, viewport())
    root.style.setProperty('--clip-w', `${size.w}px`)
    root.style.setProperty('--clip-h', `${size.h}px`)
    root.style.setProperty('--sheet-h', `${Math.round(clampSheet(share, room()) * room())}px`)
    edge.hidden = corner.hidden = !open || sheet
    handle.hidden = !open || !sheet
    if (open && sheet) root.dataset.sheet = ''
    else delete root.dataset.sheet
    edge.setAttribute('aria-valuenow', String(size.w))
    handle.setAttribute('aria-valuenow', String(Math.round(clampSheet(share, room()) * 100)))
  }

  function setClip(next, keep) {
    saved = clampClip(next, viewport())
    if (keep) save('clipboard-size', saved)
    apply()
  }
  function setSheet(next, keep) {
    share = clampSheet(next, room())
    if (keep) save('clipboard-sheet', share)
    apply()
  }

  // Dragging, with pointer capture so a fast drag can't slip off the grip.
  function drag(el, onMove) {
    el.addEventListener('pointerdown', e => {
      if (e.button !== 0) return
      e.preventDefault()
      el.setPointerCapture(e.pointerId)
      el.classList.add('dragging')
      root.classList.add('clip-resizing')
      const x0 = e.clientX, y0 = e.clientY
      const startClip = clampClip(saved, viewport())
      const startShare = clampSheet(share, room())
      const move = ev => onMove(ev.clientX - x0, ev.clientY - y0, startClip, startShare, false)
      const up = ev => {
        onMove(ev.clientX - x0, ev.clientY - y0, startClip, startShare, true)
        el.classList.remove('dragging')
        root.classList.remove('clip-resizing')
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerup', up)
        el.removeEventListener('pointercancel', up)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
    })
  }
  drag(edge, (dx, dy, start, _, keep) => setClip(dragClip(start, dx, dy, 'edge'), keep))
  drag(corner, (dx, dy, start, _, keep) => setClip(dragClip(start, dx, dy, 'corner'), keep))
  drag(handle, (dx, dy, _, start, keep) => setSheet(dragSheet(start, dy, room()), keep))

  // The keyboard: arrows grow and shrink it, Home puts it back.
  const keys = (el, onKey) => el.addEventListener('keydown', e => {
    const done = onKey(e.key, e.shiftKey ? STEP * 4 : STEP)
    if (done) { e.preventDefault(); e.stopPropagation() }
  })
  const clipKeys = (key, step) => {
    const s = clampClip(saved, viewport())
    if (key === 'ArrowLeft') setClip({ ...s, w: s.w + step }, true)
    else if (key === 'ArrowRight') setClip({ ...s, w: s.w - step }, true)
    else if (key === 'ArrowDown') setClip({ ...s, h: s.h + step }, true)
    else if (key === 'ArrowUp') setClip({ ...s, h: s.h - step }, true)
    else if (key === 'Home') setClip(null, true)
    else return false
    return true
  }
  keys(edge, clipKeys)
  keys(corner, clipKeys)
  keys(handle, (key, step) => {
    const s = clampSheet(share, room())
    if (key === 'ArrowUp') setSheet(s + step / room(), true)
    else if (key === 'ArrowDown') setSheet(s - step / room(), true)
    else if (key === 'Home') setSheet(SHEET_SHARE, true)
    else return false
    return true
  })
  for (const el of [edge, corner]) el.addEventListener('dblclick', () => setClip(null, true))
  handle.addEventListener('dblclick', () => setSheet(SHEET_SHARE, true))

  new MutationObserver(apply).observe(side, { attributes: true, attributeFilter: ['class'] })
  addEventListener('resize', apply)
  small.addEventListener?.('change', apply)
  phone.addEventListener?.('change', apply)
  apply()
}
