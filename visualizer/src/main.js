// Agent Office: your Claude Code sessions as colorful critters in a cozy
// office, one room per project, with their subagents around them. Fed by
// the bridge's Server-Sent Events and /history; words.js turns the same
// events into plain sentences.

import { startDemo, demoHistory, answerDemo, stopDemo } from '../../agent-office/server/demo.mjs'
import * as model from './model.js'
import * as words from './words.js'
import * as table from './table.js'
import * as panels from './panels.js'
import { unlock, isMuted, setMuted } from './sound.js'
import * as transcript from './transcript.js'
import * as recap from './recap.js'
import * as desk from './desk.js'
import * as settings from './settings.js'
import { mountClipSize } from './clipsize.js'
import { mountHelp } from './help.js'
import * as answering from './answer.js'
import * as actions from './actions.js'
import * as handoff from './handoff.js'
import * as snapshot from './snapshot.js'
import * as welcome from './welcome.js'
import * as tour from './tour.js'
import * as notify from './notify.js'
import * as spend from './spend.js'
import * as a11y from './a11y.js'
import * as motion from './motion.js'
import * as phone from './phone.js'
import * as power from './power.js'
import * as updates from './updates.js'

const HISTORY_REFRESH_MS = 60000
const PANEL_REFRESH_MS = 700
const params = new URLSearchParams(location.search)
// ?busy=1 plays a crowded demo in the page (about 12 threads and 25 agents)
// for checking the office stays smooth; demo-only, it never reads the bridge.
const isBusy = params.get('busy') === '1'
const isDemo = Boolean(window.AGENT_OFFICE_DEMO) || params.get('demo') === '1' || isBusy
// Previews (welcome.js): ?empty=1 keeps the office empty, ?offline=1 shows
// the lost-connection card.
const forceEmpty = params.get('empty') === '1'
// Whether the office has heard from its source yet: until then it isn't
// empty, only loading, and the greeter waits.
let heard = isDemo

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
  // On a phone, a thread you pick opens on the Projects view.
  if (selected && phone.isPhone()) phone.show('projects')
  refreshPanels()
}

// Frame the office in the space the floating panels leave free: a panel
// taller than half the stage claims its side, one wider than half claims
// the top or bottom.
const stageEl = document.getElementById('stage')
function measureInsets() {
  const W = stageEl.clientWidth, H = stageEl.clientHeight
  const insets = { left: 0, right: 0, top: 0, bottom: 0 }
  // The phone's little office in the Inbox has nothing over it.
  if (phone.isMini()) return table.setInsets(insets)
  for (const el of document.querySelectorAll('.hud.left > *, #side, .topbar, .phone-tabs')) {
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
  if (e.metaKey || e.ctrlKey || e.altKey || document.querySelector('dialog[open]')) return
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

// Developer view: plain words everywhere, or the raw tool lines.
settings.mountSettings(() => { transcript.redraw(); refreshPanels() })
// "What am I looking at?": the ? button and the ? key.
mountHelp()
// A project renamed or given a new icon.
document.addEventListener('office:names', () => refreshPanels())

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

// The clipboard's tabs answer the arrow keys.
addEventListener('keydown', a11y.tabKeys, true)

settings.add({
  id: 'reduce-motion', type: 'toggle', label: 'Reduce motion',
  hint: () => (motion.bySystem() ? 'On because your system asks for less motion' : 'No camera glides, hops, confetti or bobbing'),
  get: motion.reduced, set: motion.setReduced, disabled: motion.bySystem,
})

// The clipboard: bigger, and resizable (a sheet on narrow screens).
mountClipSize()

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

// Answering a question from the office (answer.js). The demo's sample
// sessions take any answer; a real session's question goes through the
// bridge when its mod is waiting for one, and Claude Code's own dialog
// stays up meanwhile.
const officeToken = document.querySelector('meta[name="agent-office-token"]')?.content || ''
answering.setRoute({
  can: ask => isDemo || transcript.isDemo() || (Boolean(officeToken) && ask.answerable === true && ['question', 'plan'].includes(ask.type)),
  canApprove: () => isDemo || transcript.isDemo(),
  send: async (ask, body) => {
    const session = ask.who?.session
    if (isDemo) {
      // Demo-only, with no bridge: the sample session takes the answer as one line.
      const ok = answerDemo(session, ask.id, body.say ?? answering.summary(ask, body))
      setTimeout(refreshPanels, 50)
      return ok ? { ok } : { ok, status: 'that question has moved on' }
    }
    const res = await fetch('/answer', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-agent-office-token': officeToken },
      body: JSON.stringify({ session, id: ask.id, ...body }),
    })
    const got = await res.json().catch(() => ({}))
    return res.ok ? { ok: true } : { ok: false, status: got.error ?? `the bridge answered ${res.status}` }
  },
})
answering.listen()

// Stop (actions.js): the session's mod ends its running turn.
actions.setStopper(async n => {
  if (isDemo) {
    stopDemo(n.session) // Demo-only, with no bridge
    return { ok: true }
  }
  const res = await fetch('/stop', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-agent-office-token': officeToken },
    body: JSON.stringify({ session: n.session }),
  })
  const got = await res.json().catch(() => ({}))
  return res.ok ? { ok: true } : { ok: false, status: got.error ?? `the bridge answered ${res.status}` }
})
actions.listen()
handoff.listen({ stage: stageEl, critterAt: table.critterAt, setHover: table.setHover })
const answer = { can: answering.canAnswer }

function refreshPanels() {
  if (selected && !model.nodes.has(selected)) selected = null
  const now = running()
  // Spend first: the directory shows each project's.
  spend.update(history)
  phone.render()
  panels.render({ running: now, selected, pick, hover: table.setHover, answer })
  a11y.render({ running: now, pick })
  recap.tick(now)
  notify.update(now)
  welcome.showEmpty(heard && ![...model.nodes.values()].some(n => n.kind === 'session'), { hasPast: history.length > 0 })
}

// ?debug keeps the last 600 frames' main-thread cost (ms) for profiling.
const frameCost = params.has('debug') ? [] : null

// A tab you can't see draws nothing; "Save battery" draws 30 frames a
// second (power.js). The loop starts again when the tab comes back.
let rafId = 0
let lastFrame = -Infinity

function frame(t) {
  rafId = requestAnimationFrame(frame)
  if (!power.due(t, lastFrame, power.budget().fps)) return
  // Nothing to draw while the phone shows Projects over the office.
  if (!phone.sceneShown()) return
  lastFrame = t
  const t0 = frameCost && performance.now()
  model.sweep(Date.now())
  table.sync(showPast)
  table.animate()
  if (frameCost) { frameCost.push(performance.now() - t0); if (frameCost.length > 600) frameCost.shift() }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(rafId)
    rafId = 0
  } else if (!rafId) {
    rafId = requestAnimationFrame(frame)
    refreshPanels()
  }
})

setInterval(() => { if (!document.hidden) refreshPanels() }, PANEL_REFRESH_MS)

settings.add({
  id: 'low-power', type: 'toggle', label: 'Save battery',
  hint: 'Draws 30 frames a second, a little softer, with simpler shadows',
  get: power.isSaving, set: power.setSaving,
})
power.onChange(table.setPower)
// Updates: automatic, when the bridge can switch it.
if (!isDemo) void updates.mount()

// ---------------------------------------------------------------------------
// Sources

function ingest(ev) {
  model.apply(ev)
  words.ingest(ev)
  table.pulse(ev)
  transcript.onEvent(ev)
  desk.onEvent(ev)
}

document.addEventListener('office:event', e => ingest(e.detail))

async function loadHistory() {
  try {
    history = forceEmpty ? [] : isDemo ? demoHistory() : (await (await fetch('/history')).json()).sessions ?? []
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
  source.addEventListener('open', () => { setStatus('Live', 'live'); welcome.found() })
  source.addEventListener('replay', msg => {
    heard = true
    if (forceEmpty) return refreshPanels()
    // A fresh replay: start over so a reconnect never doubles anything.
    model.reset()
    words.reset()
    desk.reset()
    for (const ev of JSON.parse(msg.data)) {
      model.apply(ev)
      words.ingest(ev)
      desk.onEvent(ev, true)
    }
    model.applyHistory(history, showPast)
    refreshPanels()
  })
  source.addEventListener('message', msg => forceEmpty || ingest(JSON.parse(msg.data)))
  source.addEventListener('error', () => {
    setStatus('Reconnecting…', 'down')
    // The browser retries on its own while it can; the office retries too,
    // with a calm card, so a stopped bridge never leaves a frozen page.
    welcome.lost(() => { source.close(); connect() })
  })
}

// A page with no bridge behind it (the hosted preview) plays the same
// synthetic activity as `server.mjs --demo`.
function playDemo() {
  setStatus('Sample activity', 'live')
  startDemo(events => events.forEach(ingest), { busy: isBusy })
}

// The front desk: new jobs from the office. Without a bridge (the hosted
// preview) it plays them itself; a demo bridge plays them for it.
let bridgeDemo = false
desk.mount({ ingest, pick, isDemo: () => isDemo, bridgeDemo: () => bridgeDemo })

// A bridge started with --demo has sample sessions and no transcripts on
// disk: its transcript tab plays the demo's too.
transcript.setDemo(isDemo)
recap.mount({ onPick: pick, demo: isDemo })
if (!isDemo) {
  fetch('/healthz').then(r => r.json()).then(h => { if (h.demo) { transcript.setDemo(true); recap.setDemo(); bridgeDemo = true } }).catch(() => {})
}

// Alerts: the tab's count and, if you turn them on, desktop alerts.
notify.mount({ pick })
// Spend today, in plain words, with an optional daily limit.
spend.mount()
// The guided tour: on its own the first time, and from the top bar.
tour.mount({ pick, ingest, table })

phone.mount({ changed: () => { measureInsets(); refreshPanels() } })
await loadHistory()
setInterval(loadHistory, HISTORY_REFRESH_MS)
if (params.get('offline') === '1') {
  setStatus('Reconnecting…', 'down')
  welcome.lost()
} else if (!isDemo) connect()
else if (forceEmpty) setStatus('Preview', 'live')
else playDemo()
refreshPanels()
if (!document.hidden) rafId = requestAnimationFrame(frame)
// ?debug exposes the model to the console.
if (params.has('debug')) window.cluster = { model, words, table, frameCost }
