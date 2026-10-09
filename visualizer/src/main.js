// Agent Office: your Claude Code sessions as colorful critters in a cozy
// office, one room per project, with their subagents around them. Fed by
// the bridge's Server-Sent Events and /history; words.js turns the same
// events into plain sentences.

import { startDemo, demoHistory, answerDemo } from '../../agent-office/server/demo.mjs'
import * as model from './model.js'
import * as words from './words.js'
import * as table from './table.js'
import * as panels from './panels.js'
import { unlock, isMuted, setMuted } from './sound.js'
import * as transcript from './transcript.js'
import * as snapshot from './snapshot.js'

const HISTORY_REFRESH_MS = 60000
const PANEL_REFRESH_MS = 700
const params = new URLSearchParams(location.search)
const isDemo = Boolean(window.AGENT_OFFICE_DEMO) || params.get('demo') === '1'

let showPast = true
let history = []
let selected = null

table.mount(document.getElementById('stage'), { pick })

function pick(id) {
  // Picking a critter (in the office, on a sticky note or in the directory)
  // opens its clipboard and glides to its room; clicking the floor or the
  // clipboard's back link puts the clipboard away.
  const n = id && model.nodes.get(id)
  selected = n && (n.kind === 'session' || n.kind === 'agent') ? id : null
  table.setSelected(selected)
  if (selected) table.focusOn(selected)
  refreshPanels()
}

// Frame the office in the space the floating panels leave free: a panel
// taller than half the stage claims its side, one wider than half claims
// the top or bottom.
const stageEl = document.getElementById('stage')
function measureInsets() {
  const W = stageEl.clientWidth, H = stageEl.clientHeight
  const insets = { left: 0, right: 0, top: 0, bottom: 0 }
  for (const el of document.querySelectorAll('.hud.left > *, #side, .topbar')) {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height || getComputedStyle(el).display === 'none') continue
    if (r.height > H * 0.5 && r.width < W * 0.5) {
      if (r.left + r.width / 2 < W / 2) insets.left = Math.max(insets.left, r.right + 12)
      else insets.right = Math.max(insets.right, W - r.left + 12)
    } else if (r.width > W * 0.5) {
      if (r.top + r.height / 2 < H / 2) insets.top = Math.max(insets.top, r.bottom + 8)
      else insets.bottom = Math.max(insets.bottom, H - r.top + 8)
    } else if (r.left + r.width / 2 < W / 2) {
      // A shorter panel on one side: still keep the office clear of it.
      insets.left = Math.max(insets.left, r.right + 12)
    } else {
      insets.right = Math.max(insets.right, W - r.left + 12)
    }
  }
  table.setInsets(insets)
}
const panelWatch = new ResizeObserver(measureInsets)
for (const el of document.querySelectorAll('.hud.left > *, #side, .topbar, #stage')) panelWatch.observe(el)

// The keyboard: j/k (or the arrows) walk the directory, thread by thread
// and agent by agent; 1-3 switch tabs; r replies; Esc goes up a level.
const isTyping = el => el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.isContentEditable)
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  if (isTyping(document.activeElement)) {
    if (e.key === 'Escape') document.activeElement.blur()
    return
  }
  if (e.key === 'Escape') {
    const n = selected && model.nodes.get(selected)
    const up = n?.kind === 'agent' ? model.lineage(n).at(-2) : null
    pick(up?.id ?? null)
    if (!up) table.focusOn(null)
    return
  }
  const step = { j: 1, ArrowDown: 1, k: -1, ArrowUp: -1 }[e.key]
  if (step) {
    const list = panels.order()
    if (!list.length) return
    const at = list.indexOf(selected)
    pick(list[at < 0 ? (step > 0 ? 0 : list.length - 1) : (at + step + list.length) % list.length])
    e.preventDefault()
    return
  }
  if (['1', '2', '3', '4'].includes(e.key)) panels.setTab(['transcript', 'outputs', 'team', 'details'][Number(e.key) - 1])
  else if (e.key === 'r' && panels.focusReply()) e.preventDefault()
})

// Sound: off until the page has been clicked or a key pressed (browsers
// insist), and the mute button remembers your choice.
const soundButton = document.getElementById('sound')
function showSound() {
  soundButton.setAttribute('aria-pressed', String(!isMuted()))
  soundButton.querySelector('span').textContent = isMuted() ? 'Sound off' : 'Sound on'
}
soundButton.addEventListener('click', () => { setMuted(!isMuted()); showSound() })
showSound()
for (const type of ['pointerdown', 'keydown']) addEventListener(type, unlock, { once: true })

// Snapshot: a framed picture of the office, saved to your computer.
const snapButton = document.getElementById('snapshot')
snapButton?.addEventListener('click', async () => {
  const css = getComputedStyle(document.documentElement)
  const colors = Object.fromEntries(['paper', 'scene', 'ink', 'muted', 'accent', 'line'].map(k => [k, css.getPropertyValue(`--${k}`).trim()]))
  const live = [...model.nodes.values()].filter(n => n.kind === 'session' && !n.past && n.status !== 'done').length
  const agents = [...model.nodes.values()].filter(n => n.kind === 'agent' && n.status !== 'done').length
  const detail = [live && `${live} thread${live === 1 ? '' : 's'}`, agents && `${agents} agent${agents === 1 ? '' : 's'} at work`].filter(Boolean).join(' · ')
  const saved = await snapshot.save(snapshot.frame({ ...table.capture(), colors, detail }))
  const label = snapButton.querySelector('span')
  label.textContent = saved ? 'Saved' : 'Couldn’t save'
  setTimeout(() => { label.textContent = 'Snapshot' }, 2200)
})

const pastToggle = document.getElementById('show-past')
pastToggle.addEventListener('change', () => {
  showPast = pastToggle.checked
  model.applyHistory(history, showPast)
})

// ---------------------------------------------------------------------------
// Loop

function running() {
  const owners = new Set()
  for (const n of model.nodes.values()) if (n.kind === 'tool' && n.status === 'active') owners.add(n.owner)
  return owners
}

// Answering a question from the office. The demo's sample sessions take
// the answer; a real session is answered in Claude Code for now, so the
// office only shows what it's waiting on.
const answer = {
  can: () => isDemo,
  send: (session, id, label) => {
    answerDemo(session, id, label)
    setTimeout(refreshPanels, 50)
  },
}

function refreshPanels() {
  if (selected && !model.nodes.has(selected)) selected = null
  panels.render({ running: running(), selected, pick, hover: table.setHover, answer })
}

function frame() {
  model.sweep(Date.now())
  table.sync(showPast)
  table.animate()
  requestAnimationFrame(frame)
}

setInterval(refreshPanels, PANEL_REFRESH_MS)

// ---------------------------------------------------------------------------
// Sources

function ingest(ev) {
  model.apply(ev)
  words.ingest(ev)
  table.pulse(ev)
  transcript.onEvent(ev)
}

document.addEventListener('office:event', e => ingest(e.detail))

async function loadHistory() {
  try {
    history = isDemo ? demoHistory() : (await (await fetch('/history')).json()).sessions ?? []
  } catch {
    history = []
  }
  model.applyHistory(history, showPast)
}

function setStatus(text, state) {
  const el = document.getElementById('conn')
  el.querySelector('span').textContent = text
  el.className = `status ${state}`
}

function connect() {
  const source = new EventSource('/stream')
  source.addEventListener('open', () => setStatus('Live', 'live'))
  source.addEventListener('replay', msg => {
    // A fresh replay: start over so a reconnect never doubles anything.
    model.reset()
    words.reset()
    for (const ev of JSON.parse(msg.data)) {
      model.apply(ev)
      words.ingest(ev)
    }
    model.applyHistory(history, showPast)
    refreshPanels()
  })
  source.addEventListener('message', msg => ingest(JSON.parse(msg.data)))
  source.addEventListener('error', () => setStatus('Reconnecting…', 'down'))
}

// A page with no bridge behind it (the hosted preview) plays the same
// synthetic activity as `server.mjs --demo`.
function playDemo() {
  setStatus('Sample activity', 'live')
  startDemo(events => events.forEach(ingest))
}

// A bridge started with --demo has sample sessions and no transcripts on
// disk: its transcript tab plays the demo's too.
transcript.setDemo(isDemo)
if (!isDemo) {
  fetch('/healthz').then(r => r.json()).then(h => { if (h.demo) transcript.setDemo(true) }).catch(() => {})
}

await loadHistory()
setInterval(loadHistory, HISTORY_REFRESH_MS)
if (isDemo) playDemo()
else connect()
refreshPanels()
requestAnimationFrame(frame)
// ?debug exposes the model to the console.
if (params.has('debug')) window.cluster = { model, words, table }
