// "What am I looking at?": the ? button in the top bar (or the ? key) lays
// labels over the office itself, each pointing at what it explains: a
// critter, its energy ring, the beads, a helper, a bubble, a room, the
// coffee corner and the panels. Esc, a click anywhere or the button puts
// them away. It's a dialog: focus moves into it and back out, and the
// labels are a list a screen reader reads in order.

import { landmarks } from './table.js'

// What each label says. `at` names where it points: a landmark from the
// office (table.js) or a selector for something on the page.
const NOTES = [
  { at: 'critter', title: 'A thread', text: 'One of your Claude Code sessions. It hops when it does something, and its screen scrolls while it works.' },
  { at: 'ring', title: 'Its energy', text: 'The ring fills as its memory of the conversation fills. Near the top it needs a break: it tidies up and carries on.' },
  { at: 'beads', title: 'Beads', text: 'One floats up for each thing it does: blue reading, coral changing, green searching, yellow commands. Red is a bump.' },
  { at: 'helper', title: 'A helper', text: 'A smaller critter it brought in for part of the job. When it’s done it goes for coffee.' },
  { at: '.bubbles .bub', title: 'A bubble', text: 'What it says, shows you or asks you. Questions wait for your answer.' },
  { at: 'sign', title: 'A room', text: 'Each project gets a room. Click the sign to zoom in, or its icon to rename it.' },
  { at: 'coffee', title: 'The coffee corner', text: 'Where helpers take a break once their work is done.' },
  { at: '.board', title: 'Waiting on you', text: 'Threads whose next move is yours. Answer or reply right here.' },
  { at: '.tape', title: 'Activity', text: 'What got finished, made and asked. Small bumps fold into one quiet line.' },
  { at: '#side', title: 'Your projects', text: 'Every thread and its helpers. Click one to read the conversation and see what it made.' },
  { at: '#settings-open', title: 'Settings', text: 'Sound, alerts, past sessions, a snapshot to share, the tour, and Developer view for the raw commands and numbers.' },
]

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const CARD_W = 210
const GAP = 22

let root = null
let opener = null

const isOpen = () => Boolean(root && !root.hidden)

// Where a note points, or null when that thing isn't on screen.
function target(at, marks) {
  if (at in marks) return marks[at] || null
  const el = document.querySelector(at)
  const r = el?.getBoundingClientRect()
  if (!r?.width || !r.height || getComputedStyle(el).display === 'none') return null
  // A panel is pointed at from its inner edge, a button from its middle.
  const big = r.width > 160 && r.height > 120
  const x = !big ? r.left + r.width / 2 : r.left + r.width / 2 < innerWidth / 2 ? r.right - 18 : r.left + 18
  return { x, y: big ? r.top + Math.min(r.height / 2, 90) : r.top + r.height / 2, panel: big }
}

const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

// Put each card near what it points at, clear of the other cards and pins.
function layout(items, header) {
  const placed = [header]
  const pins = items.map(i => ({ x: i.at.x - 14, y: i.at.y - 14, w: 28, h: 28 }))
  for (const item of items) {
    const { x, y } = item.at
    const w = item.w, h = item.h
    const left = x < innerWidth / 2
    const tries = [
      [left ? x + GAP : x - GAP - w, y - h - GAP], [left ? x + GAP : x - GAP - w, y + GAP],
      [left ? x - GAP - w : x + GAP, y - h - GAP], [left ? x - GAP - w : x + GAP, y + GAP],
      [left ? x + GAP + 8 : x - GAP - 8 - w, y - h / 2], [x - w / 2, y + GAP + 6], [x - w / 2, y - h - GAP - 6],
    ].map(([cx, cy]) => ({ x: Math.max(8, Math.min(innerWidth - w - 8, cx)), y: Math.max(8, Math.min(innerHeight - h - 8, cy)), w, h }))
    const cost = box => placed.filter(p => overlaps(p, box)).length * 10 + pins.filter(p => overlaps(p, box)).length * 3 +
      Math.hypot(box.x + w / 2 - x, box.y + h / 2 - y) / 400
    const best = tries.reduce((a, b) => (cost(b) < cost(a) ? b : a))
    item.box = best
    placed.push(best)
  }
}

// From the pin to the nearest point on its card.
function leader(item) {
  const { x, y } = item.at
  const b = item.box
  const px = Math.max(b.x, Math.min(b.x + b.w, x)), py = Math.max(b.y, Math.min(b.y + b.h, y))
  return `<line x1="${x}" y1="${y}" x2="${px}" y2="${py}"/>`
}

function draw() {
  const marks = landmarks()
  const items = NOTES.map(n => ({ ...n, at: target(n.at, marks) })).filter(n => n.at)
  const narrow = innerWidth < 700
  root.classList.toggle('narrow', narrow)
  root.innerHTML = `
    <div class="help-head paper">
      <h2 id="help-title">What am I looking at?</h2>
      <p>${items.length ? 'Here’s what each part of the office means.' : 'The office fills in as your sessions work.'} Press <kbd>Esc</kbd> or click anywhere to go back.</p>
      <button type="button" class="help-close" data-help-close>Got it</button>
    </div>
    <svg class="help-lines" aria-hidden="true"></svg>
    <ol class="help-notes">${items.map((n, i) => `<li class="help-note paper"><span class="help-num" aria-hidden="true">${i + 1}</span><b>${esc(n.title)}</b> ${esc(n.text)}</li>`).join('')}</ol>
    ${items.map((n, i) => `<span class="help-pin" aria-hidden="true" style="left:${n.at.x}px;top:${n.at.y}px">${i + 1}</span>`).join('')}`
  if (narrow) {
    // The list sits over the bottom of the screen: a pin it covers would
    // only clutter it.
    const cover = [root.querySelector('.help-head'), root.querySelector('.help-notes')].map(el => el.getBoundingClientRect())
    for (const pin of root.querySelectorAll('.help-pin')) {
      const r = pin.getBoundingClientRect()
      if (cover.some(c => overlaps({ x: r.left, y: r.top, w: r.width, h: r.height }, { x: c.left, y: c.top, w: c.width, h: c.height }))) pin.hidden = true
    }
    return
  }
  const head = root.querySelector('.help-head').getBoundingClientRect()
  const cards = [...root.querySelectorAll('.help-note')]
  items.forEach((n, i) => { n.w = CARD_W; n.h = cards[i].offsetHeight })
  layout(items, { x: head.left - 8, y: head.top - 8, w: head.width + 16, h: head.height + 16 })
  items.forEach((n, i) => Object.assign(cards[i].style, { left: `${n.box.x}px`, top: `${n.box.y}px` }))
  root.querySelector('.help-lines').innerHTML = items.map(leader).join('')
}

function open() {
  if (!root) {
    root = document.createElement('div')
    root.id = 'help'
    root.className = 'help'
    root.setAttribute('role', 'dialog')
    root.setAttribute('aria-modal', 'true')
    root.setAttribute('aria-labelledby', 'help-title')
    root.hidden = true
    document.body.append(root)
    // A click anywhere (the Got it button included) puts it away.
    root.addEventListener('click', close)
  }
  opener = document.activeElement
  root.hidden = false
  draw()
  document.getElementById('help-open')?.setAttribute('aria-expanded', 'true')
  root.querySelector('[data-help-close]').focus()
}

function close() {
  if (!isOpen()) return
  root.hidden = true
  document.getElementById('help-open')?.setAttribute('aria-expanded', 'false')
  if (opener?.isConnected) opener.focus()
  opener = null
}

const toggle = () => (isOpen() ? close() : open())
const isTyping = el => el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.isContentEditable)

export function mountHelp() {
  document.getElementById('help-open')?.addEventListener('click', e => {
    e.stopPropagation()
    toggle()
  })
  // Ahead of the page's own keys, so Esc closes this and nothing else.
  addEventListener('keydown', e => {
    if (isOpen()) {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault()
        e.stopImmediatePropagation()
        close()
      } else if (e.key === 'Tab') {
        // The only thing to reach inside is the Got it button.
        e.preventDefault()
        root.querySelector('[data-help-close]').focus()
      } else {
        e.stopImmediatePropagation()
      }
      return
    }
    if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(document.activeElement)) {
      e.preventDefault()
      e.stopImmediatePropagation()
      open()
    }
  }, true)
  addEventListener('resize', () => { if (isOpen()) draw() })
}
