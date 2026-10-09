// A short guided tour: six steps with a spotlight and a note, from the
// rooms to replying. It plays on its own the first time the office opens
// (remembered in localStorage), and the top bar's Tour button plays it
// again. On an empty office it brings in a few friendly sample critters to
// point at, and when your first real session walks in it hands over to it.
//
// Keys while it plays: → or Enter next, ← back, Esc skips. Under
// prefers-reduced-motion the spotlight jumps instead of gliding.
//
// ?tour=1 plays it on load whatever was remembered; ?tour=0 never does.
// A browser driven by automation (navigator.webdriver) doesn't get it on
// its own either, so screenshots of the office stay clean.

import * as model from './model.js'
import * as words from './words.js'
import { escapeHtml } from './words.js'

const KEY = 'agent-office-toured'
const SAMPLE = 'tour-' // sample sessions' ids start with this
const SAMPLE_PROJECT = { id: '/sample/your-project', name: 'your-project' }
const PAD = 10

// The steps. `at` names what the spotlight frames (resolved in place());
// `enter` sets the office up for the step first.
export const STEPS = [
  { title: 'Welcome to your office', body: 'Everything Claude Code is doing on this computer shows up here, as a cozy office. Here’s a one-minute look around.', at: null },
  { title: 'Each project gets a room', body: 'A project is a folder you work in. Its room gets its own color and furniture, so you can tell them apart at a glance.', at: 'room' },
  { title: 'Each critter is a conversation', body: 'Every Claude Code session is a critter at its own desk. It hops when it does something, and helpers it starts stand behind it. Hover one to see what it’s doing.', at: 'critter', enter: 'zoom' },
  { title: 'Waiting on you', body: 'When a session finishes and needs you, a note lands here, longest waiting first. Questions it asks show up here too, with buttons to answer.', at: 'board' },
  { title: 'The clipboard', body: 'Click any critter, note or line to open its clipboard: the conversation as it happens, what it made, its helpers, and the details.', at: 'side', enter: 'open' },
  { title: 'Reply without switching windows', body: 'Type here and press Enter: your message becomes the session’s next prompt. Press r any time to reply to whoever has waited longest.', at: 'reply', enter: 'open' },
]

// Where to put the note next to a spotlight: below it if there's room,
// else above, else beside, else over the bottom of the window. Pure, for
// the tests: rects are { left, top, width, height } in window pixels.
export function placeNote(hole, note, view, gap = 14) {
  const clampX = x => Math.max(12, Math.min(view.width - note.width - 12, x))
  const clampY = y => Math.max(12, Math.min(view.height - note.height - 12, y))
  if (!hole) return { left: clampX((view.width - note.width) / 2), top: clampY((view.height - note.height) / 2), side: 'center' }
  const cx = hole.left + hole.width / 2 - note.width / 2
  const cy = hole.top + hole.height / 2 - note.height / 2
  if (hole.top + hole.height + gap + note.height <= view.height - 12) return { left: clampX(cx), top: hole.top + hole.height + gap, side: 'below' }
  if (hole.top - gap - note.height >= 12) return { left: clampX(cx), top: hole.top - gap - note.height, side: 'above' }
  if (hole.left + hole.width + gap + note.width <= view.width - 12) return { left: hole.left + hole.width + gap, top: clampY(cy), side: 'right' }
  if (hole.left - gap - note.width >= 12) return { left: hole.left - gap - note.width, top: clampY(cy), side: 'left' }
  return { left: clampX(cx), top: view.height - note.height - 12, side: 'over' }
}

// Whether to play on load: asked for, or a first visit by a person.
export function shouldAutoStart({ param, seen, webdriver }) {
  if (param === '1') return true
  if (param === '0') return false
  return !seen && !webdriver
}

const remembered = () => { try { return localStorage.getItem(KEY) === '1' } catch { return false } }
const remember = () => { try { localStorage.setItem(KEY, '1') } catch {} }

// ---------------------------------------------------------------------------
// Sample critters, for an office with nobody in it yet

let samples = false
let sampleTimer = 0
let ctx = null // { pick, ingest, table }

function sampleEvents(now) {
  const at = (dt, session, ev) => ({ t: now + dt, session: `${SAMPLE}${session}`, ...ev })
  return [
    at(0, 'a', { kind: 'session.start', cwd: SAMPLE_PROJECT.id, model: 'claude-sonnet-5-5', project: SAMPLE_PROJECT }),
    at(1, 'a', { kind: 'turn.start', text: 'Tidy up the README' }),
    at(2, 'a', { kind: 'context.measure', context: { tokens: 46000, window: 200000 } }),
    at(3, 'a', { kind: 'turn.complete', reason: 'answer', answer: 'All tidy! I fixed the headings and two broken links. Want a screenshot at the top too?' }),
    at(10, 'b', { kind: 'session.start', cwd: SAMPLE_PROJECT.id, model: 'claude-sonnet-5-5', project: SAMPLE_PROJECT }),
    at(11, 'b', { kind: 'turn.start', text: 'Why are the tests slow?' }),
    at(12, 'b', { kind: 'context.measure', context: { tokens: 88000, window: 200000 } }),
    at(13, 'b', { kind: 'agent.spawn', agent: 'helper', type: 'Explore', description: 'Time each test file' }),
  ]
}

const sampleTools = [['Read', 'package.json'], ['Bash', 'npm test'], ['Grep', 'setTimeout'], ['Read', 'test/setup.js']]

function startSamples() {
  if (samples) return
  samples = true
  sampleEvents(Date.now()).forEach(ctx.ingest)
  // The working one keeps busy while the tour plays.
  let i = 0
  sampleTimer = setInterval(() => {
    const [tool, summary] = sampleTools[i % sampleTools.length]
    const agent = i % 2 ? 'helper' : undefined
    const id = `tour-tool-${i++}`
    const base = { session: `${SAMPLE}b`, ...(agent && { agent }) }
    ctx.ingest({ ...base, t: Date.now(), kind: 'tool.start', id, tool, summary })
    setTimeout(() => samples && ctx.ingest({ ...base, t: Date.now(), kind: 'tool.end', id, tool, ok: true }), 700)
  }, 1400)
}

// Take every trace of the samples back out of the office.
function stopSamples() {
  if (!samples) return
  samples = false
  clearInterval(sampleTimer)
  const isSample = s => typeof s === 'string' && s.startsWith(SAMPLE)
  for (const n of [...model.nodes.values()]) if (isSample(n.session)) model.removeNode(n.id)
  const project = `p:${SAMPLE_PROJECT.id}`
  if (!model.links.some(l => model.idOf(l.source) === project)) model.removeNode(project)
  for (const list of [model.mail, model.outputs, model.notices]) {
    for (let i = list.length - 1; i >= 0; i--) if (isSample(list[i].session) || String(list[i].target ?? '').includes(SAMPLE)) list.splice(i, 1)
  }
  for (let i = words.moments.length - 1; i >= 0; i--) if (String(words.moments[i].target ?? '').includes(SAMPLE)) words.moments.splice(i, 1)
  for (const id of [...words.activity.keys()]) if (id.includes(SAMPLE)) words.activity.delete(id)
  model.touch()
}

const isReal = n => n.kind === 'session' && !n.session.startsWith(SAMPLE)

// ---------------------------------------------------------------------------
// The overlay

let root = null
let step = -1
let raf = 0
let handedOff = null // a real session that walked in mid-tour
let lastFocus = null
let lastKey = ''
let startedAt = 0

const $ = sel => document.querySelector(sel)

function mountOverlay() {
  root = document.createElement('div')
  root.id = 'tour'
  root.hidden = true
  root.innerHTML = `
    <div class="tour-catch"></div>
    <div class="tour-hole"></div>
    <section class="tour-note paper" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <p class="tour-count eyebrow"></p>
      <h2 id="tour-title" class="tour-title"></h2>
      <p class="tour-body"></p>
      <div class="tour-dots" aria-hidden="true"></div>
      <div class="tour-actions">
        <button type="button" class="tour-skip">Skip tour</button>
        <button type="button" class="tour-back">Back</button>
        <button type="button" class="tour-next">Next</button>
      </div>
      <p class="tour-keys"><kbd>←</kbd> <kbd>→</kbd> to move · <kbd>Esc</kbd> to skip</p>
    </section>`
  document.body.append(root)
  root.querySelector('.tour-skip').onclick = () => end()
  root.querySelector('.tour-back').onclick = () => go(step - 1)
  root.querySelector('.tour-next').onclick = () => (step >= STEPS.length - 1 || handedOff ? end() : go(step + 1))
  root.querySelector('.tour-catch').onclick = () => root.querySelector('.tour-next').focus()
}

// The session the steps point at: a real one if there is any (a live one
// waiting on you first), else a sample.
function featured() {
  const sessions = [...model.nodes.values()].filter(n => n.kind === 'session')
  if (handedOff && model.nodes.has(handedOff)) return model.nodes.get(handedOff)
  const live = sessions.filter(n => !n.past && n.status !== 'done')
  return live.find(n => n.answer) ?? live[0] ?? sessions[0] ?? null
}

// A box around a piece of the 3D office, in window pixels.
function project3d(corners) {
  const { camera, stage } = ctx.table.debug
  if (!camera || !stage) return null
  const r = stage.getBoundingClientRect()
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const c of corners) {
    const p = c.clone().project(camera)
    if (p.z > 1) continue
    const x = r.left + ((p.x + 1) / 2) * r.width
    const y = r.top + ((1 - p.y) / 2) * r.height
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
  }
  if (!Number.isFinite(x0)) return null
  return { left: x0, top: y0, width: x1 - x0, height: y1 - y0 }
}

// The corners of a box standing on `center`. Vectors are made like the
// scene's own (the camera's class), so this module needs no Three.js of
// its own and its pure parts test without one.
function box(center, hw, hd, h) {
  const V = ctx.table.debug.camera.position.constructor
  const out = []
  for (const x of [-hw, hw]) for (const z of [-hd, hd]) for (const y of [0, h]) out.push(new V(center.x + x, center.y + y, center.z + z))
  return out
}

const rectOf = el => {
  if (!el || !el.isConnected || el.closest('[hidden]')) return null
  const r = el.getBoundingClientRect()
  return r.width && r.height ? { left: r.left, top: r.top, width: r.width, height: r.height } : null
}

// What a step's spotlight frames, right now.
function target(at) {
  const n = featured()
  const { rooms, sessionViews } = ctx.table.debug
  if (at === 'room') {
    const room = n && rooms.get(`p:${n.project}`)
    if (!room?.mesh || !room.w) return null
    return project3d(box(room.mesh.position, room.w / 2, room.d / 2, 46))
  }
  if (at === 'critter') {
    const view = n && sessionViews.get(n.id)
    if (!view) return null
    // Its desk and rug, where it sits (or is walking to, when it's new).
    return project3d(box(view.group.position, 18, 14, 34))
  }
  if (at === 'board') return rectOf($('.hud.left .board'))
  if (at === 'side') return rectOf($('#side'))
  if (at === 'reply') return rectOf($('#side .tx-compose')) ?? rectOf($('#inbox .card:not(.gone)')) ?? rectOf($('#side'))
  return null
}

function enter(s) {
  const n = featured()
  if (!n) return
  if (s.enter === 'open') ctx.pick(n.id)
  else {
    ctx.pick(null)
    if (s.enter === 'zoom') ctx.table.focusOn(n.id)
    else ctx.table.focusOn(null)
  }
}

function draw() {
  const s = handedOff ? HANDOFF : STEPS[step]
  root.querySelector('.tour-count').textContent = handedOff ? 'Your office' : `${step + 1} of ${STEPS.length}`
  root.querySelector('.tour-title').textContent = s.title
  root.querySelector('.tour-body').innerHTML = escapeHtml(s.body)
  root.querySelector('.tour-dots').innerHTML = handedOff ? '' : STEPS.map((_, i) => `<i class="${i === step ? 'on' : i < step ? 'past' : ''}"></i>`).join('')
  root.querySelector('.tour-back').hidden = step === 0 || Boolean(handedOff)
  root.querySelector('.tour-skip').hidden = step === STEPS.length - 1 || Boolean(handedOff)
  root.querySelector('.tour-keys').hidden = Boolean(handedOff)
  root.querySelector('.tour-next').textContent = handedOff ? 'Say hi' : step === 0 ? 'Show me around' : step === STEPS.length - 1 ? 'Start exploring' : 'Next'
}

const HANDOFF = { title: 'Your first session just walked in!', body: 'That one’s real. The sample critters have gone home, and the office is all yours. Click your session any time to follow along.', at: 'critter' }

function place() {
  if (!root || root.hidden) return
  // A real session arriving takes over from the samples. One that was
  // there all along (the office was still loading) just replaces them.
  const real = samples && [...model.nodes.values()].find(isReal)
  if (real && (real.past || (real.startedAt ?? 0) < startedAt)) {
    stopSamples()
    enter(STEPS[step])
  } else if (real) {
    handedOff = real.id
    stopSamples()
    draw()
    ctx.pick(null)
    ctx.table.focusOn(handedOff)
    root.querySelector('.tour-next').focus()
  }
  // A fresh replay from the bridge (a reconnect) starts the office over:
  // bring the samples back in.
  if (samples && !model.nodes.has(model.sid(`${SAMPLE}a`))) sampleEvents(Date.now()).forEach(ctx.ingest)
  const s = handedOff ? HANDOFF : STEPS[step]
  const hole = s.at ? target(s.at) : null
  const padded = hole && {
    left: Math.max(4, hole.left - PAD), top: Math.max(4, hole.top - PAD),
    width: Math.min(innerWidth - 8, hole.width + PAD * 2), height: Math.min(innerHeight - 8, hole.height + PAD * 2),
  }
  const holeEl = root.querySelector('.tour-hole')
  if (holeEl.classList.contains('none') !== !padded) holeEl.classList.toggle('none', !padded)
  const note = root.querySelector('.tour-note')
  const size = { width: note.offsetWidth, height: note.offsetHeight }
  const spot = placeNote(padded, size, { width: innerWidth, height: innerHeight })
  // Only touch the page when something moved: a camera glide moves the
  // spotlight every frame, a still office not at all.
  const key = JSON.stringify([padded && Object.values(padded).map(Math.round), Math.round(spot.left), Math.round(spot.top)])
  if (key !== lastKey) {
    lastKey = key
    if (padded) Object.assign(holeEl.style, { left: `${padded.left}px`, top: `${padded.top}px`, width: `${padded.width}px`, height: `${padded.height}px` })
    note.style.left = `${spot.left}px`
    note.style.top = `${spot.top}px`
    note.dataset.side = spot.side
  }
  raf = requestAnimationFrame(place)
}

function go(i) {
  if (i < 0 || i >= STEPS.length) return
  step = i
  enter(STEPS[i])
  draw()
  root.querySelector('.tour-next').focus()
}

export function start() {
  if (!root) mountOverlay()
  if (!root.hidden) return
  remember()
  lastFocus = document.activeElement
  handedOff = null
  startedAt = Date.now()
  if (![...model.nodes.values()].some(n => n.kind === 'session')) startSamples()
  root.hidden = false
  document.documentElement.classList.add('touring')
  go(0)
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(place)
}

export function end() {
  if (!root || root.hidden) return
  root.hidden = true
  document.documentElement.classList.remove('touring')
  cancelAnimationFrame(raf)
  const sampled = samples
  stopSamples()
  if (handedOff) {
    // Say hi: open the session that just arrived.
    ctx.pick(handedOff)
  } else if (sampled) {
    ctx.pick(null)
    ctx.table.focusOn(null)
  }
  handedOff = null
  step = -1
  ;(lastFocus?.isConnected ? lastFocus : $('#tour-open'))?.focus()
}

export const isOpen = () => Boolean(root && !root.hidden)

// Keys while the tour plays, ahead of the office's own (capture phase).
function onKey(e) {
  if (!isOpen()) return
  const stop = () => { e.preventDefault(); e.stopPropagation() }
  if (e.key === 'Escape') { stop(); end() }
  else if (e.key === 'ArrowRight') { stop(); root.querySelector('.tour-next').click() }
  else if (e.key === 'ArrowLeft') { stop(); if (!handedOff) go(step - 1) }
  else if (e.key === 'Tab') {
    // Keep focus inside the note.
    const items = [...root.querySelectorAll('.tour-actions button:not([hidden])')]
    const at = items.indexOf(document.activeElement)
    stop()
    items[(at + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus()
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (!root.contains(document.activeElement)) { stop(); root.querySelector('.tour-next').click() }
  } else if (!e.metaKey && !e.ctrlKey && !e.altKey) stop()
}

// `pick` opens a clipboard, `ingest` feeds an event into the office, and
// `table` is the scene (for where things are on screen).
export function mount({ pick, ingest, table }) {
  ctx = { pick, ingest, table }
  $('#tour-open')?.addEventListener('click', start)
  addEventListener('keydown', onKey, true)
  const params = new URLSearchParams(location.search)
  if (shouldAutoStart({ param: params.get('tour'), seen: remembered(), webdriver: navigator.webdriver })) {
    // Once the office is live (the stream has opened, or the demo plays),
    // give it a moment to draw what it has.
    const wait = () => (document.querySelector('#conn.live') ? setTimeout(start, 900) : setTimeout(wait, 300))
    wait()
  }
}
