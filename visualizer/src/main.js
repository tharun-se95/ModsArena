// The 3D cluster: projects hold sessions (live and past), sessions run
// subagents, agents run tools, and every session and agent wears a gauge of
// its context window. Fed by the bridge's Server-Sent Events and /history.

import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { startDemo, demoHistory } from '../../agent-cluster-3d/server/demo.mjs'
import * as model from './model.js'
import { buildObject, animate, view, relatedTo, setRelated, isRelated, hasFocus, toolColor, COLORS } from './scene.js'
import * as hud from './hud.js'
import { place, boundsOf, SESSION_CELL } from './layout.js'

const HISTORY_REFRESH_MS = 60000
const params = new URLSearchParams(location.search)
const isDemo = Boolean(window.CLUSTER_DEMO) || params.get('demo') === '1'
const store = {
  get: key => { try { return localStorage.getItem(key) } catch { return null } },
  set: (key, value) => { try { localStorage.setItem(key, value) } catch { /* private mode */ } },
}

let projectFilter = ''
let filterChosen = false
let showPast = store.get('cluster.past') !== '0'
let history = []

// ---------------------------------------------------------------------------
// Graph

const stage = document.getElementById('stage')
const graph = ForceGraph3D({ controlType: 'orbit', extraRenderers: [new CSS2DRenderer()] })(stage)
  .width(stage.clientWidth)
  .height(stage.clientHeight)
  .backgroundColor('#070a12')
  .showNavInfo(false)
  .nodeId('id')
  .nodeLabel(n => (n.kind === 'tool' ? `<div class="tip"><b style="color:${toolColor(n.tool)}">${hud.escapeHtml(n.tool)}</b> ${hud.escapeHtml(n.summary ?? '')}</div>` : ''))
  .nodeThreeObject(n => buildObject(n))
  .linkVisibility(l => l.kind !== 'project')
  .linkColor(l => linkColor(l))
  .linkWidth(l => (l.kind === 'spawn' ? 0.6 : 0))
  .linkOpacity(1)
  .linkDirectionalParticles(l => (l.kind === 'spawn' && isLinkActive(l) ? 2 : 0))
  .linkDirectionalParticleSpeed(0.008)
  .linkDirectionalParticleWidth(1.6)
  .linkDirectionalParticleColor(() => COLORS.accent)
  .onNodeClick(n => onNodeClick(n))
  .onNodeHover(n => setHovered(n?.id ?? null))
  .onBackgroundClick(() => setSelected(null))
  // The layout is fixed, so a drag always moves the camera, never a node.
  .enableNodeDrag(false)

// Every node is pinned by layout.js; the simulation has nothing to move.
graph.d3Force('center', null)
graph.d3Force('charge').strength(0)
graph.d3Force('link').strength(0)

const controls = graph.controls()
controls.zoomToCursor = true
controls.enableDamping = true
controls.dampingFactor = 0.09
controls.rotateSpeed = 0.55
controls.screenSpacePanning = true
controls.minDistance = 90
controls.maxDistance = 7000
// Keep the layout facing you: up to ~50° of tilt either way, never edge-on.
controls.minPolarAngle = Math.PI / 2 - 0.85
controls.maxPolarAngle = Math.PI / 2 + 0.85
controls.minAzimuthAngle = -0.85
controls.maxAzimuthAngle = 0.85
let lastCameraTouch = 0
controls.addEventListener('start', () => { lastCameraTouch = Date.now() })

view.camera = graph.camera()

// ?bloom=0 turns the glow off for GPUs that struggle with post-processing.
const bloom = params.get('bloom') === '0'
  ? null
  : new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), 0.55, 0.35, 0.55)
if (bloom) graph.postProcessingComposer().addPass(bloom)
// Paint the background in the scene so the bloom composer keeps it dark.
graph.scene().background = new THREE.Color('#070a12')
graph.scene().add(new THREE.AmbientLight(0x8899bb, 1.1))

function isLinkActive(l) {
  const target = model.nodes.get(model.idOf(l.target))
  return target?.status === 'active' && !target.past
}

function linkColor(l) {
  const s = model.idOf(l.source)
  const t = model.idOf(l.target)
  if (hasFocus()) return isRelated(s) && isRelated(t) ? 'rgba(103,232,249,0.85)' : 'rgba(100,116,139,0.08)'
  return l.kind === 'spawn' ? 'rgba(148,163,184,0.38)' : 'rgba(148,163,184,0.22)'
}

// ---------------------------------------------------------------------------
// Selection and hover: nothing moves; the rest of the scene steps back.

let hovered = null
let selected = null

function refreshFocus() {
  view.hovered = hovered
  view.selected = selected
  setRelated(relatedTo(hovered ?? selected, model.links))
  graph.linkColor(graph.linkColor())
  stage.style.cursor = hovered ? 'pointer' : ''
}

function setHovered(id) {
  if (id === hovered) return
  hovered = id
  refreshFocus()
}

function setSelected(id) {
  selected = id
  hud.select(id)
  hud.renderCard(pick)
  refreshFocus()
}

let lastClick = { id: null, at: 0 }
function onNodeClick(n) {
  const now = Date.now()
  const isDouble = lastClick.id === n.id && now - lastClick.at < 350
  lastClick = { id: n.id, at: now }
  setSelected(n.id)
  if (isDouble) focusOn(n)
}

// Glide to a comfortable distance in front of a node, still head-on.
function focusOn(n) {
  if (n.fx === undefined) return
  const distance = { project: 0, session: 620, agent: 340, tool: 260 }[n.kind]
  if (n.kind === 'project' && n.bounds) return frameBounds(boundsOf([n]))
  lastCameraTouch = Date.now()
  graph.cameraPosition({ x: n.fx, y: n.fy, z: n.fz + distance }, { x: n.fx, y: n.fy, z: n.fz }, 900)
}

// From a list, the attention card or a label: select it, showing its project.
function pick(id) {
  const n = model.nodes.get(id)
  if (!n) return
  const project = model.projectOf(n)
  if (projectFilter && project !== projectFilter) setFilter('')
  setSelected(id)
}

view.onLabelClick = id => {
  const n = model.nodes.get(id)
  if (n) onNodeClick(n)
}
view.onLabelHover = id => setHovered(id)

// ---------------------------------------------------------------------------
// Framing: fit what is shown, head-on, centred, with the orbit around it.

function frameBounds(b, ms = 900) {
  if (!b) return
  const fov = (graph.camera().fov * Math.PI) / 180
  const aspect = stage.clientWidth / Math.max(1, stage.clientHeight)
  const distance = Math.max(b.height * 1.08, (b.width * 1.08) / aspect) / 2 / Math.tan(fov / 2)
  graph.cameraPosition({ x: b.cx, y: b.cy, z: Math.max(380, distance) }, { x: b.cx, y: b.cy, z: 0 }, ms)
}

function frame(ms) {
  frameBounds(boundsOf(model.visible(projectFilter, showPast).nodes), ms)
}

function resetView() {
  lastCameraTouch = 0
  frame()
}

function setFilter(value, remember = true) {
  projectFilter = value ?? ''
  filterChosen = true
  if (remember) store.set('cluster.project', projectFilter)
  if (selected && projectFilter && model.projectOf(model.nodes.get(selected) ?? {}) !== projectFilter) setSelected(null)
  framedKey = ''
  model.touch()
  hud.renderChips(projectFilter, setFilter)
  hud.renderFeed(projectFilter, true)
}

// Labels are fixed-size HTML, so give a session's name only the room its
// cell has on screen at this zoom; far out, names give way to the number.
let nameRoom = 0
function fitLabels() {
  const camera = graph.camera()
  const distance = camera.position.distanceTo(controls.target)
  const pxPerUnit = stage.clientHeight / (2 * distance * Math.tan((camera.fov * Math.PI) / 360))
  const room = Math.round(Math.min(220, SESSION_CELL * pxPerUnit - 70))
  if (Math.abs(room - nameRoom) < 4) return
  nameRoom = room
  stage.style.setProperty('--name-room', `${Math.max(0, room)}px`)
  stage.classList.toggle('names-off', room < 36)
}

// ---------------------------------------------------------------------------
// Render loop

let particlesKey = ''
let framedKey = ''

function render() {
  const now = Date.now()
  model.sweep(now)
  if (model.isDirty()) {
    model.clean()
    const shown = model.visible(projectFilter, showPast)
    place(shown, stage.clientHeight > stage.clientWidth * 1.1)
    graph.graphData(shown)
    if (selected && !model.nodes.has(selected)) setSelected(null)
    // Re-frame when the structure grows or shrinks, unless you have moved the
    // camera in the last 15 seconds: then your view is left alone.
    const key = `${projectFilter}|${showPast}|${shown.nodes.filter(n => n.kind === 'session' || n.kind === 'project').length}`
    if (key !== framedKey) {
      if (framedKey === '' || now - lastCameraTouch > 15000) setTimeout(() => frame(), 60)
      framedKey = key
    }
  }
  fitLabels()
  animate(model.nodes.values(), now)
  const key = model.links.filter(isLinkActive).map(l => model.idOf(l.target)).join('|')
  if (key !== particlesKey) {
    particlesKey = key
    graph.linkDirectionalParticles(graph.linkDirectionalParticles())
  }
  requestAnimationFrame(render)
}

// ---------------------------------------------------------------------------
// Page controls

document.getElementById('reset-view').addEventListener('click', resetView)
document.getElementById('card-close').addEventListener('click', () => setSelected(null))
document.getElementById('card-focus').addEventListener('click', () => {
  const n = model.nodes.get(selected)
  if (n) focusOn(n)
})
const pastToggle = document.getElementById('show-past')
pastToggle.checked = showPast
pastToggle.addEventListener('change', () => {
  showPast = pastToggle.checked
  store.set('cluster.past', showPast ? '1' : '0')
  framedKey = ''
  model.touch()
})
document.getElementById('legend-toggle').addEventListener('click', e => {
  const legend = document.getElementById('legend')
  const open = legend.classList.toggle('open')
  e.currentTarget.setAttribute('aria-expanded', String(open))
})
addEventListener('keydown', e => {
  if (e.target.closest?.('input, select, textarea')) return
  if (e.key === 'Escape') setSelected(null)
  if (e.key === 'r' || e.key === 'R') resetView()
  if (e.key === 'f' || e.key === 'F') { const n = model.nodes.get(selected); if (n) focusOn(n) }
})
hud.bindFeed(() => projectFilter)

// Phones: the side column is a bottom sheet that starts folded, and the
// canvas takes the space between the top bar and the sheet.
const sheet = document.getElementById('side')
const sheetToggle = document.getElementById('sheet-toggle')
const isNarrow = () => innerWidth <= 760
if (isNarrow()) sheet.classList.add('folded')
sheetToggle.addEventListener('click', () => {
  const open = sheet.classList.toggle('folded') === false
  sheetToggle.setAttribute('aria-expanded', String(open))
  fitStage()
})

function fitStage() {
  graph.width(stage.clientWidth).height(stage.clientHeight)
  bloom?.setSize(stage.clientWidth, stage.clientHeight)
}
addEventListener('resize', () => { fitStage(); framedKey = ''; model.touch() })
new ResizeObserver(fitStage).observe(stage)

// The HUD refreshes on its own clock: steady, never per event.
setInterval(() => {
  // Open where the work is: your last project, else the busiest one.
  if (!filterChosen && model.projects().length) {
    const stored = store.get('cluster.project')
    const known = stored !== null && (stored === '' || model.projects().some(p => p.projectId === stored))
    setFilter(known ? stored : model.projects().length > 1 ? model.busiestProject() ?? '' : '', false)
  }
  hud.renderChips(projectFilter, setFilter)
  hud.renderStats(projectFilter)
  hud.renderAttention(projectFilter, pick)
  hud.renderCard(pick)
}, 600)
setInterval(() => hud.renderFeed(projectFilter), 500)

// ---------------------------------------------------------------------------
// Sources

function ingest(ev) {
  model.apply(ev)
  hud.feedPush(ev)
}

async function loadHistory() {
  try {
    history = isDemo ? demoHistory() : (await (await fetch('/history')).json()).sessions ?? []
  } catch {
    history = []
  }
  model.applyHistory(history, true)
}

function setConnection(state, text) {
  const el = document.getElementById('conn')
  el.dataset.state = state
  el.querySelector('span').textContent = text
}

function connect() {
  const source = new EventSource('/stream')
  source.addEventListener('open', () => setConnection('live', 'Live'))
  source.addEventListener('replay', msg => {
    // A fresh replay: start over so a reconnect never doubles the graph.
    model.reset()
    const events = JSON.parse(msg.data)
    for (const ev of events) model.apply(ev)
    hud.feedReset(events)
    model.applyHistory(history, true)
  })
  source.addEventListener('message', msg => ingest(JSON.parse(msg.data)))
  source.addEventListener('error', () => setConnection('down', 'Reconnecting'))
}

// A page with no bridge behind it (the hosted preview) plays the same
// synthetic activity as `server.mjs --demo`.
function playDemo() {
  setConnection('live', 'Demo')
  startDemo(events => events.forEach(ingest))
}

await loadHistory()
setInterval(loadHistory, HISTORY_REFRESH_MS)
if (isDemo) playDemo()
else connect()
requestAnimationFrame(render)
// ?debug exposes the model and graph to the console.
if (params.has('debug')) window.cluster = { model, graph, view }
