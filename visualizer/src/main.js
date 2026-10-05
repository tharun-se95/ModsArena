// The 3D cluster: projects hold sessions (live and past), sessions spawn
// subagents, agents run tools, and every session and agent wears a ring of
// its context window. Fed by the bridge's Server-Sent Events and /history.

import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { startDemo, demoHistory } from '../../agent-cluster-3d/server/demo.mjs'
import * as model from './model.js'
import { buildObject, animate, view } from './scene.js'
import * as hud from './hud.js'
import { place } from './layout.js'

const HISTORY_REFRESH_MS = 60000
const params = new URLSearchParams(location.search)
const isDemo = Boolean(window.CLUSTER_DEMO) || params.get('demo') === '1'

let projectFilter = ''
let showPast = true
let history = []

// ---------------------------------------------------------------------------
// Graph

const stage = document.getElementById('graph')
const graph = ForceGraph3D({ controlType: 'orbit' })(stage)
  .width(stage.clientWidth)
  .height(stage.clientHeight)
  .backgroundColor('#05060d')
  .showNavInfo(false)
  .nodeId('id')
  .nodeLabel(n => tooltip(n))
  .nodeThreeObject(n => buildObject(n))
  .linkColor(l => LINK_STYLE[l.kind].color)
  .linkWidth(l => LINK_STYLE[l.kind].width)
  .linkDirectionalParticles(l => (isLinkActive(l) ? LINK_STYLE[l.kind].particles : 0))
  .linkDirectionalParticleSpeed(l => (l.kind === 'spawn' ? 0.006 : 0.02))
  .linkDirectionalParticleWidth(l => (l.kind === 'spawn' ? 2.2 : 1.4))
  .linkDirectionalParticleColor(l => (l.kind === 'spawn' ? '#d7c2ff' : '#bfe3ff'))
  .onNodeClick(n => onNodeClick(n))
  .onBackgroundClick(() => hud.showDetail(null, pick))

const LINK_STYLE = {
  project: { color: 'rgba(143,163,199,0.18)', width: 0.4, particles: 0 },
  spawn: { color: 'rgba(180,140,255,0.55)', width: 0.8, particles: 4 },
  tool: { color: 'rgba(120,170,255,0.25)', width: 0.25, particles: 2 },
}

// Projects and sessions are pinned (layout.js); only agents and tools move.
// No centering force, so new nodes never drag the whole cluster around, and
// repulsion stays local so a busy session does not push its neighbours.
graph.d3Force('center', null)
graph.d3Force('charge').strength(n => (n.kind === 'agent' ? -90 : n.kind === 'tool' ? -18 : -140)).distanceMax(160)
graph.d3Force('link').distance(l => ({ spawn: 55 })[l.kind] ?? 18)
graph.d3VelocityDecay(0.55)

// ?bloom=0 turns the glow off for GPUs that struggle with post-processing.
const bloom = params.get('bloom') === '0'
  ? null
  : new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), 0.75, 0.4, 0.45)
if (bloom) graph.postProcessingComposer().addPass(bloom)
// Paint the background in the scene so the bloom composer keeps it dark.
graph.scene().background = new THREE.Color('#05060d')
graph.scene().add(new THREE.AmbientLight(0x8899bb, 1.2))
graph.cameraPosition({ z: 520 })

// ---------------------------------------------------------------------------
// View mode. 3D: look at the layout head-on and orbit freely. 2.5D: a fixed
// camera tilted down onto the layout as onto a floor, with a grid under it;
// drag pans and scroll zooms, so the picture never turns over.

const TILT = (55 * Math.PI) / 180 // from straight on toward looking down
const MODE_KEY = 'agent-cluster-3d:view-mode'
let mode = '3d'
try {
  if (localStorage.getItem(MODE_KEY) === '2.5d') mode = '2.5d'
} catch {
  // No storage (a private window, a preview): stay with the default.
}

// The floor is sized to the structure on each framing, so it ends just past
// the content instead of running off to the horizon.
let floor = makeFloor(1200)
function makeFloor(size) {
  const cells = Math.max(8, Math.round(size / 60))
  const grid = new THREE.GridHelper(cells * 60, cells, 0x2a4566, 0x16243a)
  grid.rotation.x = Math.PI / 2
  grid.material.transparent = true
  grid.material.opacity = 0.7
  grid.material.depthWrite = false
  graph.scene().add(grid)
  return grid
}

function cameraFor(target, distance) {
  if (mode === '3d') return { x: target.x, y: target.y, z: target.z + distance }
  return { x: target.x, y: target.y - distance * Math.sin(TILT), z: target.z + distance * Math.cos(TILT) }
}

function setMode(next) {
  mode = next
  try {
    localStorage.setItem(MODE_KEY, mode)
  } catch {
    // Remembering is a convenience only.
  }
  const controls = graph.controls()
  const flat = mode === '2.5d'
  controls.enableRotate = !flat
  controls.screenSpacePanning = true
  controls.mouseButtons = flat
    ? { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
    : { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
  controls.touches = flat
    ? { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }
    : { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }
  floor.visible = flat
  for (const b of document.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', String(b.dataset.mode === mode))
  frame()
}

function isLinkActive(l) {
  const target = model.nodes.get(model.idOf(l.target))
  return target?.status === 'active' && !target.past
}

function tooltip(n) {
  const lines = [`<b>${hud.escapeHtml(n.label)}</b> <i>${n.past ? 'past session' : n.kind}</i>`]
  if (n.description) lines.push(hud.escapeHtml(n.description))
  if (n.summary) lines.push(`<code>${hud.escapeHtml(n.summary)}</code>`)
  if (n.context?.tokens) lines.push(`context ${Math.round(model.fill(n) * 100)}% · ${Math.round(n.context.tokens / 1000)}k tokens`)
  return `<div class="tip">${lines.join('<br>')}</div>`
}

const projectOf = n => (n.kind === 'project' ? n.projectId : model.nodes.get(model.sid(n.session))?.project)

// Look at a node head-on from in front; everything lies near the z = 0 plane.
function lookAt(n, distance) {
  const target = { x: n.fx ?? n.x, y: n.fy ?? n.y, z: n.fz ?? n.z }
  graph.cameraPosition(cameraFor(target, distance), target, 1000)
}

function select(n) {
  hud.showDetail(n, pick)
  if (n.kind === 'session') lookAt(n, 520)
  else if (n.kind === 'agent') lookAt(n, 260)
}

// From the overview, a project or session opens that project's own view.
function onNodeClick(n) {
  if (!projectFilter && n.kind === 'project') return setFilter(n.projectId, n)
  if (!projectFilter && n.kind === 'session') return setFilter(n.project, n)
  select(n)
}

function pick(id) {
  const n = model.nodes.get(id)
  if (!n) return
  const project = projectOf(n)
  if (n.kind === 'project') return setFilter(project, n)
  if (project !== projectFilter) return setFilter(project, n)
  select(n)
}

// ---------------------------------------------------------------------------
// Render loop

let particlesKey = ''

function render() {
  const now = Date.now()
  model.sweep(now)
  if (model.isDirty()) {
    model.clean()
    const shown = model.visible(projectFilter, showPast)
    place(model.nodes, shown, projectFilter, stage.clientHeight > stage.clientWidth * 1.15)
    graph.graphData(shown)
    // Frame again only when the structure itself grows or shrinks.
    const structure = `${projectFilter}|${shown.nodes.filter(n => n.kind !== 'agent' && n.kind !== 'tool').length}`
    if (structure !== framedStructure) {
      framedStructure = structure
      setTimeout(() => frame(), 60)
    }
  }
  animate(model.nodes.values(), now)
  // Re-evaluate particle counts only when the set of active links changes.
  const key = model.links.filter(isLinkActive).map(l => model.idOf(l.target)).join('|')
  if (key !== particlesKey) {
    particlesKey = key
    graph.linkDirectionalParticles(graph.linkDirectionalParticles())
  }
  requestAnimationFrame(render)
}

// ---------------------------------------------------------------------------
// Controls

// Frame the structure (projects and sessions in the overview, sessions in a
// project view) with room for the agent rings, never the busy parts.
function frame(ms = 900) {
  const core = model.visible(projectFilter, showPast).nodes
    .filter(n => n.fx !== undefined && (n.kind === 'session' || n.kind === 'project'))
  if (!core.length) return
  const lo = [Infinity, Infinity]
  const hi = [-Infinity, -Infinity]
  for (const n of core) {
    lo[0] = Math.min(lo[0], n.fx); hi[0] = Math.max(hi[0], n.fx)
    lo[1] = Math.min(lo[1], n.fy); hi[1] = Math.max(hi[1], n.fy)
  }
  const margin = projectFilter ? 330 : 240
  const w = hi[0] - lo[0] + margin
  const h = hi[1] - lo[1] + margin
  const fov = (graph.camera().fov * Math.PI) / 180
  const aspect = stage.clientWidth / Math.max(1, stage.clientHeight)
  const distance = Math.max(h, w / aspect) / 2 / Math.tan(fov / 2)
  const c = { x: (lo[0] + hi[0]) / 2, y: (lo[1] + hi[1]) / 2, z: 0 }
  // Tilted, the layout's depth is foreshortened, so it can come a little closer.
  graph.cameraPosition(cameraFor(c, mode === '3d' ? distance : distance * 0.92), c, ms)
  const visible = floor.visible
  graph.scene().remove(floor)
  floor.geometry.dispose()
  floor = makeFloor(Math.max(w, h) + 300)
  floor.visible = visible
  floor.position.set(c.x, c.y, -12)
}

let framedStructure = ''

function setFilter(value, focus) {
  projectFilter = value ?? ''
  view.overview = !projectFilter
  document.getElementById('project-filter').value = projectFilter
  hud.setViewTitle(projectFilter ? model.nodes.get(`p:${projectFilter}`)?.label ?? projectFilter : '')
  hud.showDetail(focus ?? null, pick)
  framedStructure = ''
  model.touch()
}

document.getElementById('project-filter').addEventListener('change', e => setFilter(e.target.value))
document.getElementById('show-past').addEventListener('change', e => {
  showPast = e.target.checked
  model.touch()
})
document.getElementById('detail-close').addEventListener('click', () => hud.showDetail(null, pick))
document.getElementById('back').addEventListener('click', () => setFilter(''))
for (const b of document.querySelectorAll('[data-mode]')) b.addEventListener('click', () => setMode(b.dataset.mode))
addEventListener('keydown', e => {
  if (e.target.closest?.('input, select, textarea')) return
  if (e.key === 'Escape' && projectFilter) setFilter('')
  if (e.key === 'v') setMode(mode === '3d' ? '2.5d' : '3d')
})
setMode(mode)

// On a narrow screen the panels stack above and below the view, so the
// canvas takes exactly the gap between them instead of hiding under them.
function fitStage() {
  if (innerWidth <= 760) {
    const top = document.querySelector('header').getBoundingClientRect().bottom + 8
    const bottom = innerHeight - document.getElementById('side').getBoundingClientRect().top + 8
    stage.style.top = `${top}px`
    stage.style.bottom = `${bottom}px`
  } else {
    stage.style.top = stage.style.bottom = ''
  }
  graph.width(stage.clientWidth).height(stage.clientHeight)
  bloom?.setSize(stage.clientWidth, stage.clientHeight)
}

// Phones start with the activity panel folded to one line.
const side = document.getElementById('side')
const sideToggle = document.getElementById('side-toggle')
if (innerWidth <= 760) side.classList.add('collapsed')
sideToggle.addEventListener('click', () => {
  const isOpen = side.classList.toggle('collapsed') === false
  sideToggle.setAttribute('aria-expanded', String(isOpen))
  fitStage()
  framedStructure = ''
  model.touch()
})

let wasPortrait = null
addEventListener('resize', () => {
  fitStage()
  // Turning the screen re-lays sessions as a row or a column.
  const portrait = stage.clientHeight > stage.clientWidth
  if (portrait !== wasPortrait) {
    wasPortrait = portrait
    framedStructure = ''
    model.touch()
  }
})
fitStage()

setInterval(() => {
  hud.refreshStats(projectFilter)
  hud.refreshProjects(projectFilter, setFilter)
  hud.refreshAlerts(pick)
  hud.renderDetail(pick)
}, 700)

// ---------------------------------------------------------------------------
// Sources

function ingest(ev) {
  model.apply(ev)
  hud.feedLine(ev)
}

async function loadHistory() {
  try {
    history = isDemo ? demoHistory() : (await (await fetch('/history')).json()).sessions ?? []
  } catch {
    history = []
  }
  model.applyHistory(history, true)
}

function connect() {
  const status = document.getElementById('conn')
  const source = new EventSource('/stream')
  source.addEventListener('open', () => {
    status.textContent = 'live'
    status.className = 'live'
  })
  source.addEventListener('replay', msg => {
    // A fresh replay: start over so a reconnect never doubles the graph.
    model.reset()
    hud.clearFeed()
    const events = JSON.parse(msg.data)
    for (const ev of events) model.apply(ev)
    for (const ev of events.slice(-60)) hud.feedLine(ev)
    model.applyHistory(history, true)
  })
  source.addEventListener('message', msg => ingest(JSON.parse(msg.data)))
  source.addEventListener('error', () => {
    status.textContent = 'reconnecting…'
    status.className = 'down'
  })
}

// A page with no bridge behind it (the hosted preview) plays the same
// synthetic activity as `server.mjs --demo`.
function playDemo() {
  const status = document.getElementById('conn')
  status.textContent = 'demo'
  status.className = 'live'
  startDemo(events => events.forEach(ingest))
}

await loadHistory()
setInterval(loadHistory, HISTORY_REFRESH_MS)
if (isDemo) playDemo()
else connect()
requestAnimationFrame(render)
// ?debug exposes the model and graph to the console.
if (params.has('debug')) window.cluster = { model, graph }

