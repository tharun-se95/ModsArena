// The office: each project is a cozy room, each session a colorful critter
// on its own rug in front of a desk whose monitor glows while it works, and each subagent a smaller critter standing
// behind its session, tied to it by a thread. Tool calls make the caller
// hop and release a bead; a compaction sends a ripple across the room. The scene is reconciled from
// model.js every frame, so it never holds state the model doesn't.

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { makeCharacter, pose } from './character.js'
import { buildRoom, rug, desk, coffeeCorner, officeShell, FLOOR_TOP, WALL_H, COFFEE_W, COFFEE_D } from './office.js'
import { nodes, fill, sid, aid, idOf, WARN_AT } from './model.js'
import { beadColor, escapeHtml } from './words.js'


const ROW_DEPTH = 160 // one row: helpers, desk, the session, its label
const BACK_SPACE = 44 // along the back wall, for the shelf, window and plants
const BEHIND = 76 // from a session back to its farthest helpers
const IN_FRONT = 52 // from a session forward to the edge, room for its label
const SIDE_SPACE = 80
const OFFICE_MARGIN = 70 // open floor between the rooms and the office walls
const DESK_Z = -34
const ROOM_GAP = 96 // wide enough for the next room's sign to hang clear of this one
const SESSION_GAP = 185
// A room holds its sessions in a small grid, so a busy project stays
// compact instead of stretching into a long thin strip.
const gridCols = n => (n <= 2 ? Math.max(1, n) : n <= 4 ? 2 : 3)
const TILT = 0.78
// Figure sizes: a session stands about 40 units tall, a helper about 19.
const SS = 18
const AG = 9
const PAST_PER_PROJECT = 3
const PAST_ONLY_PROJECTS = 4
const BUSY_MS = 2500
// Eyes stay near-black in both themes, like the critters they're drawn from.
const EYE = new THREE.Color('#1c1a17')
// Critter colors, from CSS tokens. Sessions each get one from their id;
// subagents wear their type's.
const TINTS = ['coral', 'teal', 'mustard', 'lilac', 'sky', 'leaf', 'pink']
const AGENT_TINT = { Explore: 'sky', Plan: 'lilac', 'general-purpose': 'leaf', 'code-reviewer': 'pink', 'test-runner': 'mustard' }
const ROOMS = ['a', 'b', 'c', 'd', 'e', 'f']

export const pct = f => `${Math.round(f * 100)}%`
export const level = f => (f >= 0.85 ? 'crit' : f >= 0.6 ? 'warn' : 'ok')

// Your own agent types get a stable color from their name.
const hash = text => {
  let h = 0
  for (const c of String(text ?? '')) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}
export const tintOf = type => AGENT_TINT[type] ?? TINTS[hash(type) % TINTS.length]
export const sessionTint = id => TINTS[hash(id) % TINTS.length]
const roomOf = name => ROOMS[hash(name) % ROOMS.length]

// ---------------------------------------------------------------------------
// Scene

let stage, renderer, labels, scene, camera, controls, sun, floor
const palette = {}
const rooms = new Map() // project node id -> room view
const sessionViews = new Map() // session node id -> view
const agentViews = new Map() // agent node id -> view
const beads = []
const ripples = []
let selected = null
let hovered = null
let focusedProject = null
let layoutKey = ''
let onPick = () => {}
const v = new THREE.Vector3()

const clock = () => performance.now() / 1000

export function mount(el, { pick }) {
  stage = el
  onPick = pick
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(2, devicePixelRatio))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  stage.append(renderer.domElement)
  labels = new CSS2DRenderer()
  labels.domElement.className = 'labels'
  stage.append(labels.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(32, 1, 1, 6000)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minPolarAngle = 0.35
  controls.maxPolarAngle = 1.15
  controls.minDistance = 120
  controls.maxDistance = 4000
  controls.enablePan = false

  scene.add(new THREE.HemisphereLight('#ffffff', '#d8cfc2', 1.6))
  sun = new THREE.DirectionalLight('#fffaf2', 2.1)
  sun.position.set(-90, 220, 120)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.radius = 6
  sun.shadow.bias = -0.0005
  scene.add(sun, sun.target)

  floor = new THREE.Mesh(new THREE.PlaneGeometry(8000, 8000), new THREE.MeshStandardMaterial({ roughness: 1 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  readPalette()
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readPalette)
  new MutationObserver(readPalette).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  bindPointer()
  new ResizeObserver(fit).observe(stage)
  fit()
}

// Colors come from the page's tokens, so the scene follows light and dark.
function readPalette() {
  const css = getComputedStyle(document.documentElement)
  const keys = ['floor', 'line', 'ok', 'warn', 'crit', 'clay', 'thread', 'scene', 'wood', 'wood-dark', 'trim', 'pot', 'glow', 'window', 'gem',
    'desk', 'tile', 'counter', 'fridge', 'carpet', 'outer-wall', ...TINTS, ...ROOMS.map(r => `room-${r}`)]
  for (const k of keys) palette[k] = new THREE.Color(css.getPropertyValue(`--${k}`).trim() || '#888')
  scene.background = palette.scene
  floor.material.color.copy(palette.floor)
  // Rooms are rebuilt in the new colors on the next sync.
  for (const t of rooms.values()) { if (t.mesh) scene.remove(t.mesh); t.w = null }
  if (coffee) { scene.remove(coffee.group); coffee = null }
  if (shell) { scene.remove(shell); shell = null }
  layoutKey = ''
  for (const s of sessionViews.values()) {
    s.track.material.color.copy(palette.line)
    s.char.bulb.material.color.copy(palette.gem)
    s.char.bulb.material.emissive.copy(palette.gem)
    s.rug.material.color.copy(rugColor(s.tint, s.room))
    placeDesk(s)
    s.gaugeKey = ''
  }
  for (const a of agentViews.values()) a.char.accentMat.color.copy(accent(a.tint))
}

const accent = tint => palette[tint].clone().multiplyScalar(0.62)
const rugColor = (tint, room) => palette[tint].clone().lerp(palette[`room-${room}`] ?? palette.line, 0.62)

function roomColors(room) {
  return {
    wood: palette.wood, woodDark: palette['wood-dark'], wall: palette[`room-${room ?? 'a'}`], trim: palette.trim,
    pot: palette.coral.clone().lerp(palette['wood-dark'], 0.35), leaf: palette.leaf, shade: palette.trim, glow: palette.glow, sky: palette.window,
    window: palette.window, desk: palette.desk, tile: palette.tile, counter: palette.counter, fridge: palette.fridge,
    carpet: palette.carpet, outerWall: palette['outer-wall'],
    books: TINTS.map(t => palette[t]), mugs: TINTS.map(t => palette[t]),
  }
}

// Each session's desk sits behind its rug, monitor facing you.
function placeDesk(s) {
  if (s.desk) s.group.remove(s.desk.group)
  s.desk = desk(roomColors(s.room), palette[s.tint])
  s.desk.group.position.set(0, FLOOR_TOP, DESK_Z)
  s.desk.group.traverse(o => { if (o.isMesh) o.userData.pick = { kind: 'session', id: s.id } })
  s.group.add(s.desk.group)
}

// The shared coffee corner and the office around everything.
let coffee = null
let shell = null
let shellKey = ''

function ensureCoffee() {
  if (coffee) return coffee
  const c = coffeeCorner(roomColors('a'))
  coffee = { ...c, w: COFFEE_W, d: COFFEE_D, target: new THREE.Vector3(), center: new THREE.Vector3(), placed: false, label: label('<span class="pname">Coffee corner</span>', 'project coffee') }
  coffee.label.obj.position.set(-25, 66, -COFFEE_D / 2 + 14)
  coffee.group.add(coffee.label.obj)
  scene.add(coffee.group)
  return coffee
}

function ensureShell(W, D) {
  const key = `${Math.round(W)}x${Math.round(D)}`
  if (shell && key === shellKey) return
  if (shell) scene.remove(shell)
  shell = officeShell({ W, D, colors: roomColors('a') })
  shellKey = key
  scene.add(shell)
}

function label(html, cls) {
  const el = document.createElement('div')
  el.className = `tag ${cls}`
  el.innerHTML = html
  return { obj: new CSS2DObject(el), el }
}

function flatRing(inner, outer, color, theta = Math.PI * 2) {
  const m = new THREE.Mesh(
    new THREE.RingGeometry(inner, outer, 96, 1, Math.PI / 2, -theta),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true }),
  )
  m.rotation.x = -Math.PI / 2
  m.position.y = FLOOR_TOP + 0.9
  return m
}

// ---------------------------------------------------------------------------
// What goes on the table

const resting = n => n.past || n.status === 'done'
const recency = n => n.lastAt ?? n.endedAt ?? n.startedAt ?? 0

// Live sessions always; a few recent past ones per project when asked; and
// only the most recent projects that have nothing live.
function chooseSessions(showPast) {
  const byProject = new Map()
  for (const n of nodes.values()) {
    if (n.kind !== 'session' || !n.project) continue
    if (!byProject.has(n.project)) byProject.set(n.project, { live: [], past: [] })
    byProject.get(n.project)[resting(n) ? 'past' : 'live'].push(n)
  }
  const out = []
  for (const [project, { live, past }] of byProject) {
    live.sort((a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0))
    past.sort((a, b) => recency(b) - recency(a))
    const shown = [...live, ...(showPast ? past.slice(0, PAST_PER_PROJECT) : [])]
    if (!shown.length) continue
    const node = nodes.get(`p:${project}`)
    out.push({ id: `p:${project}`, name: node?.label ?? project, live: live.length, hidden: past.length - (showPast ? Math.min(past.length, PAST_PER_PROJECT) : 0), sessions: shown, recent: Math.max(...shown.map(recency)) })
  }
  const live = out.filter(p => p.live).sort((a, b) => a.name.localeCompare(b.name))
  const quiet = out.filter(p => !p.live).sort((a, b) => b.recent - a.recent).slice(0, PAST_ONLY_PROJECTS)
  return [...live, ...quiet]
}

function ensureRoom(p) {
  let t = rooms.get(p.id)
  if (!t) {
    t = { id: p.id, label: label('', 'project'), center: new THREE.Vector3(), target: new THREE.Vector3() }
    t.label.el.addEventListener('click', () => focusProject(focusedProject === p.id ? null : p.id))
    rooms.set(p.id, t)
  }
  const cols = gridCols(p.sessions.length)
  const w = cols * SESSION_GAP + SIDE_SPACE
  const d = BACK_SPACE + BEHIND + (Math.ceil(p.sessions.length / cols) - 1) * ROW_DEPTH + IN_FRONT
  t.cols = cols
  if (t.w !== w || t.d !== d) {
    if (t.mesh) scene.remove(t.mesh)
    t.mesh = buildRoom({ w, d, name: p.name, colors: roomColors(roomOf(p.name)) }).group
    t.mesh.position.copy(t.center)
    t.mesh.add(t.label.obj)
    scene.add(t.mesh)
    t.w = w
    t.d = d
  }
  // The room's name hangs as a sign over its back wall.
  t.label.obj.position.set(0, WALL_H + 10, -d / 2)
  const more = p.hidden > 0 ? `<span class="pmore">+${p.hidden} earlier</span>` : ''
  const html = `<span class="pname">${escapeHtml(p.name)}</span>${more}`
  if (t.html !== html) t.label.el.innerHTML = t.html = html
  t.label.el.classList.toggle('focused', focusedProject === p.id)
  return t
}

function ensureSession(n) {
  let s = sessionViews.get(n.id)
  if (s) return s
  s = { id: n.id, home: new THREE.Vector3(), group: new THREE.Group(), slots: new Map(), gaugeKey: '', placed: false }
  s.tint = sessionTint(n.session)
  s.room = roomOf(nodes.get(`p:${n.project}`)?.label ?? n.project)
  s.char = makeCharacter({ build: 'session', bodyColor: palette[s.tint], inkColor: EYE, accentColor: palette.gem, pick: { kind: 'session', id: n.id } })
  s.rug = rug(rugColor(s.tint, s.room))
  s.group.add(s.rug)
  placeDesk(s)
  s.char.root.scale.setScalar(SS)
  s.char.root.position.y = FLOOR_TOP
  s.track = flatRing(22, 23.6, palette.line)
  s.label = label('', 'session')
  s.label.obj.position.set(0, FLOOR_TOP, 34)
  s.label.el.addEventListener('click', () => onPick(n.id))
  s.label.el.addEventListener('pointerenter', () => { hovered = n.id })
  s.label.el.addEventListener('pointerleave', () => { if (hovered === n.id) hovered = null })
  s.group.add(s.char.root, s.track, s.label.obj)
  scene.add(s.group)
  sessionViews.set(n.id, s)
  return s
}

function dropSession(id) {
  const s = sessionViews.get(id)
  if (!s) return
  scene.remove(s.group)
  s.label.el.remove()
  sessionViews.delete(id)
  for (const [aidKey, a] of agentViews) if (a.session === id) dropAgent(aidKey)
}

function ensureAgent(n, s) {
  let a = agentViews.get(n.id)
  if (a) return a
  const taken = new Set([...agentViews.values()].filter(x => x.session === s.id && !x.gone).map(x => x.slot))
  let slot = 0
  while (taken.has(slot)) slot++
  const tint = tintOf(n.type)
  // A finished agent seen for the first time (on a replay) is already gone.
  const born = n.status === 'done' ? -Infinity : clock()
  a = { id: n.id, session: s.id, slot, tint, born, group: new THREE.Group(), gone: n.status === 'done' }
  a.char = makeCharacter({ build: n.type, bodyColor: palette[tint], inkColor: EYE, accentColor: accent(tint), pick: { kind: 'agent', id: n.id } })
  a.char.root.scale.setScalar(AG)
  a.thread = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(Array.from({ length: 24 }, () => new THREE.Vector3())),
    new THREE.LineBasicMaterial({ color: palette.thread, transparent: true, opacity: 0.7 }),
  )
  a.label = label(escapeHtml(n.label ?? n.type), 'agent')
  a.label.obj.position.set(0, AG * (a.char.height + 0.45), 0)
  a.group.add(a.char.root, a.label.obj)
  a.group.visible = a.thread.visible = !a.gone
  scene.add(a.group, a.thread)
  agentViews.set(n.id, a)
  return a
}

function dropAgent(id) {
  const a = agentViews.get(id)
  if (!a) return
  scene.remove(a.group, a.thread)
  a.label.el.remove()
  agentViews.delete(id)
}

// ---------------------------------------------------------------------------
// Layout: rooms packed into rows, choosing the column count that lets the
// table fill the stage best. Positions ease, so a change never jumps.

function layout(list) {
  // The coffee corner is packed in with the rooms, last.
  const items = [...list.map(p => rooms.get(p.id)), ensureCoffee()]
  const sw = stage.clientWidth || 1
  const sh = stage.clientHeight || 1
  let best = null
  for (let cols = 1; cols <= items.length; cols++) {
    const rows = []
    for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols))
    const W = Math.max(...rows.map(r => r.reduce((a, t) => a + t.w, 0) + (r.length - 1) * ROOM_GAP)) + OFFICE_MARGIN * 2
    const D = rows.reduce((a, r) => a + Math.max(...r.map(t => t.d)), 0) + (rows.length - 1) * ROOM_GAP + OFFICE_MARGIN * 2
    const scale = Math.min(sw / (W + 60), sh / (D * Math.sin(TILT) + 80))
    if (!best || scale > best.scale) best = { cols, W, D, scale }
  }
  let z = -best.D / 2 + OFFICE_MARGIN
  for (let i = 0; i < items.length; i += best.cols) {
    const row = items.slice(i, i + best.cols)
    const rowD = Math.max(...row.map(t => t.d))
    const rowW = row.reduce((a, t) => a + t.w, 0) + (row.length - 1) * ROOM_GAP
    let x = -rowW / 2
    for (const t of row) {
      // Short items sit at the back of their row, against the window side.
      t.target.set(x + t.w / 2, 0, z + t.d / 2)
      if (!t.placed) { t.center.copy(t.target); t.placed = true }
      x += t.w + ROOM_GAP
    }
    z += rowD + ROOM_GAP
  }
  ensureShell(best.W, best.D)
  return { W: best.W, D: best.D }
}

let size = { W: 300, D: ROW_DEPTH }

// Frame every room, or the focused one, looking down across the floor:
// start from a fitted guess, then pull back until every corner of the
// table (and the critters on it) projects inside the view.
function frame() {
  const t = focusedProject && rooms.get(focusedProject)
  const w = t ? t.w : size.W
  const d = t ? t.d : size.D
  const c = t ? t.target : new THREE.Vector3()
  const aspect = stage.clientWidth / Math.max(1, stage.clientHeight)
  const vfov = (camera.fov * Math.PI) / 180
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect)
  let dist = Math.max((w + 50) / 2 / Math.tan(hfov / 2), (d * Math.sin(TILT) + 70) / 2 / Math.tan(vfov / 2))
  const corners = []
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2 + 30]) for (const y of [0, t ? WALL_H + 16 : 66]) corners.push(new THREE.Vector3(c.x + x, y, c.z + z))
  for (let i = 0; i < 4; i++) {
    camera.position.set(c.x, Math.sin(TILT) * dist, c.z + Math.cos(TILT) * dist)
    camera.lookAt(c.x, 8, c.z)
    camera.updateMatrixWorld()
    const reach = Math.max(...corners.map(p => { const q = p.clone().project(camera); return Math.max(Math.abs(q.x), Math.abs(q.y)) }))
    dist *= Math.max(0.7, reach / 0.92)
  }
  camera.position.set(c.x, Math.sin(TILT) * dist, c.z + Math.cos(TILT) * dist)
  controls.target.set(c.x, 8, c.z)
  controls.update()
  Object.assign(sun.shadow.camera, { left: -size.W / 2 - 80, right: size.W / 2 + 80, top: size.D / 2 + 100, bottom: -size.D / 2 - 100, near: 10, far: 900 })
  sun.shadow.camera.updateProjectionMatrix()
}

export function focusProject(id) {
  focusedProject = id && rooms.has(id) ? id : null
  frame()
}

function fit() {
  const w = stage.clientWidth, h = stage.clientHeight
  renderer.setSize(w, h)
  labels.setSize(w, h)
  camera.aspect = w / Math.max(1, h)
  camera.updateProjectionMatrix()
  layoutKey = ''
}

// ---------------------------------------------------------------------------
// Reconcile with the model

export function sync(showPast) {
  const list = chooseSessions(showPast)
  const shownSessions = new Set()
  for (const p of list) {
    ensureRoom(p)
    p.sessions.forEach(n => { shownSessions.add(n.id); ensureSession(n) })
  }
  for (const id of [...rooms.keys()]) {
    if (!list.some(p => p.id === id)) { scene.remove(rooms.get(id).mesh); rooms.get(id).label.el.remove(); rooms.delete(id) }
  }
  if (focusedProject && !rooms.has(focusedProject)) focusedProject = null
  for (const id of [...sessionViews.keys()]) if (!shownSessions.has(id)) dropSession(id)

  // Agents of live, shown sessions.
  const keepAgents = new Set()
  for (const n of nodes.values()) {
    if (n.kind !== 'agent') continue
    const s = sessionViews.get(sid(n.session))
    const host = s && nodes.get(s.id)
    if (!s || !host || resting(host)) continue
    ensureAgent(n, s)
    keepAgents.add(n.id)
  }
  for (const id of [...agentViews.keys()]) if (!keepAgents.has(id)) dropAgent(id)

  const key = list.map(p => `${p.id}:${p.sessions.map(n => n.id).join(',')}`).join('|') + `@${stage.clientWidth}x${stage.clientHeight}`
  if (key !== layoutKey) {
    layoutKey = key
    size = layout(list)
    for (const p of list) {
      const t = rooms.get(p.id)
      p.sessions.forEach((n, j) => {
        const s = sessionViews.get(n.id)
        const row = Math.floor(j / t.cols)
        const inRow = Math.min(t.cols, p.sessions.length - row * t.cols)
        const col = j % t.cols
        s.home.set(
          t.target.x - ((inRow - 1) * SESSION_GAP) / 2 + col * SESSION_GAP,
          0,
          t.target.z - t.d / 2 + BACK_SPACE + BEHIND + row * ROW_DEPTH,
        )
        if (!s.placed) { s.group.position.copy(s.home); s.placed = true }
      })
    }
    frame()
  }
  return list
}

// ---------------------------------------------------------------------------
// Moments from the event stream: hops, beads and ripples

function headOf(id) {
  const a = agentViews.get(id)
  if (a && !a.gone) return a.group.position.clone().add(v.set(0, AG * a.char.height, 0))
  const s = sessionViews.get(id)
  if (s) return s.group.position.clone().add(v.set(0, FLOOR_TOP + SS * s.char.height, 0))
  return null
}

function addBead(from, color) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1.7, 16, 16), new THREE.MeshStandardMaterial({ color, roughness: 0.5, transparent: true }))
  m.castShadow = true
  m.position.copy(from)
  scene.add(m)
  beads.push({ m, born: clock(), from: from.clone(), drift: new THREE.Vector3((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6) })
}

export function pulse(ev) {
  const t = clock()
  const owner = ev.agent ? aid(ev.session, ev.agent) : sid(ev.session)
  const session = sessionViews.get(sid(ev.session))
  if (ev.kind === 'tool.start' || (ev.kind === 'tool.end' && !ev.ok)) {
    const view = agentViews.get(owner) ?? session
    if (!view) return
    if (ev.kind === 'tool.start') {
      view.hopAt = t
      view.lastAt = t
      if (session) session.lookAt = ev.agent ? owner : null
    }
    const from = headOf(owner)
    if (from) addBead(from, ev.kind === 'tool.end' ? palette.crit : palette[beadColor(ev.tool)] ?? palette.line)
  } else if (ev.kind === 'context.compact' && session && !ev.agent) {
    const r = flatRing(23, 24, palette[session.tint])
    r.position.x = session.group.position.x
    r.position.z = session.group.position.z
    scene.add(r)
    ripples.push({ r, born: t })
  } else if (ev.kind === 'turn.start' && session && !ev.agent) {
    session.hopAt = t
  }
}

// ---------------------------------------------------------------------------
// Each frame

function updateGauge(s, f) {
  const key = `${level(f)}:${f.toFixed(3)}`
  if (key === s.gaugeKey) return
  s.gaugeKey = key
  if (s.gauge) s.group.remove(s.gauge)
  s.gauge = f > 0 ? flatRing(14.6, 16.6, palette[level(f)], Math.max(0.05, Math.PI * 2 * f)) : null
  if (s.gauge) { s.gauge.position.y += 0.05; s.group.add(s.gauge) }
}

export function animate() {
  const now = clock()
  const wall = Date.now()
  // Who has a tool running right now.
  const running = new Set()
  for (const n of nodes.values()) if (n.kind === 'tool' && n.status === 'active') running.add(n.owner)

  for (const t of rooms.values()) {
    t.center.lerp(t.target, 0.12)
    t.mesh.position.copy(t.center)
  }
  if (coffee) {
    coffee.center.lerp(coffee.target, 0.12)
    coffee.group.position.copy(coffee.center)
    coffee.animate(now)
  }

  for (const s of sessionViews.values()) {
    const n = nodes.get(s.id)
    if (!n) continue
    s.group.position.lerp(s.home, 0.12)
    const asleep = resting(n)
    const f = fill(n)
    const busy = asleep ? 0 : running.has(s.id) || wall - (n.lastAt ?? 0) < BUSY_MS ? 1 : Math.max(0, 1 - (now - (s.lastAt ?? -9)) / 2.5)
    const look = s.lookAt && agentViews.get(s.lookAt) ? Math.atan2(agentViews.get(s.lookAt).group.position.x - s.group.position.x, agentViews.get(s.lookAt).group.position.z - s.group.position.z) : 0
    pose(s.char, now, {
      busy,
      look: Math.max(-0.45, Math.min(0.45, look * 0.3)),
      hop: s.hopAt ? (now - s.hopAt) / 0.35 : 1,
      alarm: !asleep && f >= WARN_AT,
      asleep,
    })
    // A resting critter fades toward the table.
    s.char.bodyMat.color.copy(palette[s.tint]).lerp(palette.line, asleep ? 0.6 : 0)
    s.char.bulb.visible = !asleep
    s.desk.draw(now, asleep ? 'off' : busy > 0.5 ? 'busy' : 'idle', `#${palette[s.tint].getHexString()}`)
    updateGauge(s, f)
    const warn = !asleep && f >= WARN_AT
    if (warn && !s.alarm) { s.alarm = flatRing(26.5, 27.5, palette.crit); s.group.add(s.alarm) }
    if (!warn && s.alarm) { s.group.remove(s.alarm); s.alarm = null }
    if (s.alarm) s.alarm.material.opacity = 0.35 + 0.45 * (Math.sin(now * 3) + 1) / 2
    const html = `<span class="sname">${escapeHtml(n.label)}</span>${n.context?.tokens ? `<span class="pct ${level(f)}">${pct(f)}</span>` : ''}`
    if (s.html !== html) s.label.el.innerHTML = s.html = html
    s.label.el.classList.toggle('selected', selected === s.id)
    s.label.el.classList.toggle('past', asleep)
  }

  for (const a of agentViews.values()) {
    const n = nodes.get(a.id)
    const s = sessionViews.get(a.session)
    if (!n || !s) continue
    if (n.status === 'done' && !a.endedAt) a.endedAt = now
    if (a.gone) continue
    // Helpers stand in half circles behind their session, five to a ring.
    const ring = Math.floor(a.slot / 5)
    const ang = -Math.PI / 2 + ((a.slot % 5) - 2) * 0.62 + (ring % 2) * 0.31
    const r = 1 + ring * 0.4
    const target = new THREE.Vector3(s.group.position.x + Math.cos(ang) * 74 * r, FLOOR_TOP, s.group.position.z + Math.sin(ang) * 62 * r)
    const grow = Math.min(1, (now - a.born) / 0.6)
    a.group.rotation.y = Math.atan2(s.group.position.x - a.group.position.x, s.group.position.z - a.group.position.z) * 0.45
    pose(a.char, now + a.slot, {
      busy: n.status === 'active' && (running.has(a.id) || now - (a.lastAt ?? -9) < 1.5) ? 1 : 0,
      hop: a.hopAt ? (now - a.hopAt) / 0.3 : 1,
      alarm: n.status === 'active' && fill(n) >= WARN_AT,
    })
    if (a.endedAt) {
      const k = Math.min(1, (now - a.endedAt) / 3)
      a.char.bodyMat.color.copy(palette[a.tint]).lerp(palette.line, k)
      a.group.scale.setScalar(Math.max(0.01, 1 - k * 0.9))
      a.thread.material.opacity = 0.7 * (1 - k)
      a.label.el.style.opacity = String(1 - k)
      if (k >= 1) { a.gone = true; a.group.visible = a.thread.visible = false; continue }
    } else {
      a.char.bodyMat.color.copy(palette[a.tint])
      a.group.scale.setScalar(Math.max(0.01, grow < 1 ? grow * (1 + 0.2 * Math.sin(grow * Math.PI)) : 1))
      // New helpers drop in from above.
      target.y = FLOOR_TOP + (1 - grow) * (1 - grow) * 40
    }
    a.group.position.lerp(target, grow < 1 || !a.settled ? 1 : 0.1)
    a.settled = true
    // The thread: a soft arc from the parent's head (its session, or the
    // agent that started it) to this helper's head.
    const parent = agentViews.get(idOf(n.parent))
    const top = parent && !parent.gone
      ? parent.group.position.clone().add(new THREE.Vector3(0, AG * (parent.char.height - 0.1), 0))
      : s.group.position.clone().add(new THREE.Vector3(0, FLOOR_TOP + SS * (s.char.height - 0.3), 0))
    const end = a.group.position.clone().add(new THREE.Vector3(0, AG * (a.char.height - 0.1) * a.group.scale.y, 0))
    const mid = top.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 12, 0))
    a.thread.geometry.setFromPoints(new THREE.QuadraticBezierCurve3(top, mid, end).getPoints(23))
    // Helper names show for the session you are looking at, so the
    // overview stays quiet.
    const focus = hovered === s.id || selected === s.id || selected === a.id
    a.label.el.style.visibility = focus ? 'visible' : 'hidden'
    a.label.el.classList.toggle('selected', selected === a.id)
  }

  for (let i = beads.length - 1; i >= 0; i--) {
    const b = beads[i], k = (now - b.born) / 1.6
    if (k >= 1) { scene.remove(b.m); b.m.geometry.dispose(); b.m.material.dispose(); beads.splice(i, 1); continue }
    b.m.position.copy(b.from).addScaledVector(b.drift, k).add(v.set(0, k * 16, 0))
    b.m.material.opacity = 1 - k * k
  }
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i], k = (now - r.born) / 1.8
    if (k >= 1) { scene.remove(r.r); ripples.splice(i, 1); continue }
    r.r.scale.setScalar(1 + k * 2.2)
    r.r.material.opacity = 1 - k
  }

  controls.update()
  renderer.render(scene, camera)
  labels.render(scene, camera)
  if ((tick++ % 12) === 0) declutter()
}

// Room signs come first. A session label under a sign steps aside, and
// when session labels collide, the less important one drops its name and
// keeps only its percentage: the selected or hovered session first, then
// live sessions, then past ones.
let tick = 0
function declutter() {
  const rank = s => {
    const n = nodes.get(s.id)
    return (selected === s.id || hovered === s.id ? 0 : n && !resting(n) ? 1 : 2) * 1e13 - recency(n ?? {})
  }
  const overlaps = (r, list) => list.some(p => r.left < p.right + 4 && r.right > p.left - 4 && r.top < p.bottom + 2 && r.bottom > p.top - 2)
  const signs = [...rooms.values(), ...(coffee ? [coffee] : [])].map(t => t.label.el.getBoundingClientRect())
  const placed = []
  for (const s of [...sessionViews.values()].sort((a, b) => rank(a) - rank(b))) {
    const el = s.label.el
    el.classList.remove('crowded', 'covered')
    const mine = selected === s.id || hovered === s.id
    if (!mine && overlaps(el.getBoundingClientRect(), signs)) { el.classList.add('covered'); continue }
    if (!mine && overlaps(el.getBoundingClientRect(), placed)) el.classList.add('crowded')
    placed.push(el.getBoundingClientRect())
  }
}

export function setSelected(id) {
  selected = id
}

// ---------------------------------------------------------------------------
// Pointer: click a critter to select it, hover to show its helpers' names.

function bindPointer() {
  const ray = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const hit = e => {
    const r = renderer.domElement.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(pointer, camera)
    return ray.intersectObjects(scene.children, true).find(h => h.object.userData.pick && h.object.visible)?.object.userData.pick
  }
  let downAt = null
  renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY] })
  renderer.domElement.addEventListener('pointerup', e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 4) return
    onPick(hit(e)?.id ?? null)
  })
  renderer.domElement.addEventListener('pointermove', e => {
    if (e.buttons) return
    const p = hit(e)
    hovered = !p ? null : p.kind === 'session' ? p.id : agentViews.get(p.id)?.session ?? null
    renderer.domElement.style.cursor = p ? 'pointer' : ''
  })
}
