// The 3D cluster: projects hold sessions (live and past), sessions spawn
// subagents, agents run tools, and every session and agent wears a ring of
// its context window. Fed by the bridge's Server-Sent Events and /history.

import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { startDemo, demoHistory } from '../../agent-cluster-3d/server/demo.mjs'
import * as model from './model.js'
import { buildObject, animate, buildLink, updateLink } from './scene.js'
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
  // Edges are gradient beams from parent to child (scene.js).
  .linkThreeObject(l => buildLink(l))
  .linkPositionUpdate((line, ends, l) => updateLink(line, ends, l))
  .linkDirectionalParticles(l => (isLinkActive(l) ? LINK_STYLE[l.kind].particles : 0))
  .linkDirectionalParticleSpeed(l => (l.kind === 'spawn' ? 0.007 : 0.02))
  .linkDirectionalParticleWidth(l => (l.kind === 'spawn' ? 1.6 : 1))
  .linkDirectionalParticleColor(() => '#eaf6ff')
  .onNodeClick(n => select(n))
  .onBackgroundClick(() => hud.showDetail(null, pick))

// Light only flows along an edge while its child is working.
const LINK_STYLE = {
  project: { particles: 0 },
  spawn: { particles: 3 },
  tool: { particles: 1 },
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
  : new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), 0.9, 0.45, 0.86)
if (bloom) graph.postProcessingComposer().addPass(bloom)
// Paint the background in the scene so the bloom composer keeps it dark.
graph.scene().background = new THREE.Color('#05060d')
graph.scene().add(new THREE.AmbientLight(0x8899bb, 1.2))
graph.cameraPosition({ z: 520 })

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

function select(n) {
  const distance = { project: 260, session: 150 }[n.kind] ?? 80
  const ratio = 1 + distance / Math.hypot(n.x || 1, n.y || 1, n.z || 1)
  graph.cameraPosition({ x: n.x * ratio, y: n.y * ratio, z: n.z * ratio }, n, 1200)
  hud.showDetail(n, pick)
}

function pick(id) {
  const n = model.nodes.get(id)
  if (!n) return
  // A node outside the filtered project brings its project into view.
  const project = n.kind === 'project' ? n.projectId : model.nodes.get(model.sid(n.session))?.project
  if (projectFilter && project !== projectFilter) setFilter('')
  setTimeout(() => select(n), 50)
}

// ---------------------------------------------------------------------------
// Render loop

let particlesKey = ''

function render() {
  const now = Date.now()
  model.sweep(now)
  if (model.isDirty()) {
    model.clean()
    place(model.nodes)
    graph.graphData(model.visible(projectFilter))
    // A new project widens the structure: frame it once.
    const count = model.projects().length
    if (count !== framedProjects) {
      framedProjects = count
      setTimeout(() => frame(), 100)
    }
  }
  animate(model.nodes.values(), now, graph.camera())
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

// Frame the pinned structure (projects and sessions), which does not move,
// rather than everything, so busy agents never pull the camera around.
function frame(ms = 900) {
  const core = model.visible(projectFilter).nodes.filter(n => n.fx !== undefined)
  if (!core.length) return
  const lo = [Infinity, Infinity, Infinity]
  const hi = [-Infinity, -Infinity, -Infinity]
  for (const n of core) {
    ;[n.fx, n.fy, n.fz].forEach((v, i) => { lo[i] = Math.min(lo[i], v); hi[i] = Math.max(hi[i], v) })
  }
  const c = lo.map((v, i) => (v + hi[i]) / 2)
  const extent = Math.max(hi[0] - lo[0], hi[1] - lo[1], 160) + 180
  const fov = (graph.camera().fov * Math.PI) / 180
  const distance = extent / 2 / Math.tan(fov / 2)
  graph.cameraPosition({ x: c[0], y: c[1], z: c[2] + distance }, { x: c[0], y: c[1], z: c[2] }, ms)
}

let framedProjects = 0

function setFilter(value) {
  projectFilter = value
  document.getElementById('project-filter').value = value
  model.touch()
  setTimeout(() => frame(), 100)
}

document.getElementById('project-filter').addEventListener('change', e => setFilter(e.target.value))
document.getElementById('show-past').addEventListener('change', e => {
  showPast = e.target.checked
  model.applyHistory(history, showPast)
})
document.getElementById('detail-close').addEventListener('click', () => hud.showDetail(null, pick))

addEventListener('resize', () => {
  graph.width(stage.clientWidth).height(stage.clientHeight)
  bloom?.setSize(stage.clientWidth, stage.clientHeight)
})

setInterval(() => {
  hud.refreshStats()
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
  model.applyHistory(history, showPast)
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
    model.applyHistory(history, showPast)
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

