// The office: each project is a cozy room, each session a colorful critter
// on its own rug in front of a desk whose monitor glows while it works, and
// each subagent a smaller critter standing behind its session. Finished
// subagents walk over to the coffee corner for a break before they leave.
// The office keeps its own time: the windows follow your local hour, the
// clock on the wall ticks, plants sway and a robot vacuum makes its rounds.
//
// The scene is reconciled from model.js every frame, so it never holds
// state the model doesn't; walks and breaks are the only things it keeps.

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { makeCharacter, pose } from './character.js'
import {
  buildRoom, rug, desk, coffeeCorner, officeShell, glassMat, lampMat,
  FLOOR_TOP, WALL_H, COFFEE_W, COFFEE_D,
} from './office.js'
import { nodes, fill, sid, aid, WARN_AT } from './model.js'
import { beadColor, escapeHtml, activity, ago } from './words.js'
import { sound } from './sound.js'

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
const DOZE_MS = 120000 // a live session idle this long dozes off
const WALK_SPEED = 120
const BREAK_S = 10 // how long a finished helper lingers over coffee
const WAVE_S = 1.2
const MEET = 38 // critters closer than this on the move wave at each other
const PERSONAL = 21 // standing helpers keep at least this far apart
const DAMPING = 0.08 // of a drag's spin let go each frame, at 60 frames a second
const ZOOM_EASE = 1e-5 // of a wheel zoom still to go after a second
// Where helpers stand behind their session's desk: a row of five, a
// staggered row of four behind it, then either side of the session. All
// within the session's own patch of floor, so neighbours never mingle.
const SLOTS = [
  [0, -62], [-32, -62], [32, -62], [-64, -62], [64, -62],
  [-16, -90], [16, -90], [-48, -90], [48, -90],
  [-76, -4], [76, -4], [-76, 20], [76, 20],
]
const slotAt = slot => {
  const [x, z] = SLOTS[slot % SLOTS.length]
  const lap = Math.floor(slot / SLOTS.length)
  return [x + lap * 10, z + lap * 6]
}
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
// The wall color key of a project's room, for the directory's swatches.
export const roomKey = roomOf

// ---------------------------------------------------------------------------
// Scene

let stage, renderer, labels, scene, camera, controls, sun, sky, floor, bubble
const palette = {}
const rooms = new Map() // project node id -> room view
const sessionViews = new Map() // session node id -> view
const agentViews = new Map() // agent node id -> view
const beads = []
const ripples = []
const confetti = []
let selected = null
let hovered = null // the session under the pointer (or whose helper is)
let hoverPick = null // exactly what is under the pointer, for the bubble
let focusedProject = null
let layoutKey = ''
let onPick = () => {}
let mountedAt = 0
// The panels float over the canvas; the office is framed in what they
// leave free. Pixels from each edge of the stage.
let insets = { left: 0, right: 0, top: 0, bottom: 0 }
let camGoal = null // where the camera is gliding to, if anywhere
let zoomTo = null // the distance a wheel zoom is easing to, if any
let slowFrames = 0
let last = 0
let tick = 0
const v = new THREE.Vector3()

const clock = () => performance.now() / 1000

export function mount(el, { pick }) {
  stage = el
  onPick = pick
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(2, devicePixelRatio))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  // The light never moves, so the shadows only change as the critters do;
  // animate() redraws them every other frame instead of every frame.
  renderer.shadowMap.autoUpdate = false
  renderer.outputColorSpace = THREE.SRGBColorSpace
  stage.append(renderer.domElement)
  labels = new CSS2DRenderer()
  labels.domElement.className = 'labels'
  stage.append(labels.domElement)
  bubble = document.createElement('div')
  bubble.className = 'bubble'
  bubble.hidden = true
  stage.append(bubble)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(32, 1, 1, 6000)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = DAMPING
  controls.minPolarAngle = 0.35
  controls.maxPolarAngle = 1.15
  controls.minDistance = 120
  controls.maxDistance = 4000
  controls.enablePan = false
  // The wheel eases the camera in and out (see zoom()); the controls would
  // jump a step per wheel tick.
  controls.enableZoom = false
  // Taking the camera yourself stops any glide in progress.
  controls.addEventListener('start', () => { camGoal = null })
  renderer.domElement.addEventListener('wheel', wheel, { passive: false })

  sky = new THREE.HemisphereLight('#ffffff', '#d8cfc2', 1.6)
  scene.add(sky)
  sun = new THREE.DirectionalLight('#fffaf2', 2.1)
  sun.position.set(-90, 220, 120)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.radius = 6
  sun.shadow.bias = -0.0005
  scene.add(sun, sun.target)

  floor = new THREE.Mesh(new THREE.PlaneGeometry(8000, 8000), new THREE.MeshBasicMaterial())
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.2
  scene.add(floor)

  readPalette()
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readPalette)
  new MutationObserver(readPalette).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  bindPointer()
  new ResizeObserver(fit).observe(stage)
  fit()
  mountedAt = last = clock()
}

// Colors come from the page's tokens, so the scene follows light and dark.
function readPalette() {
  const css = getComputedStyle(document.documentElement)
  const keys = ['floor', 'line', 'ok', 'warn', 'crit', 'clay', 'thread', 'scene', 'wood', 'wood-dark', 'trim', 'pot', 'glow', 'window', 'gem',
    'desk', 'tile', 'counter', 'fridge', 'carpet', 'outer-wall', 'night', 'dawn', 'dusk', ...TINTS, ...ROOMS.map(r => `room-${r}`)]
  for (const k of keys) palette[k] = new THREE.Color(css.getPropertyValue(`--${k}`).trim() || '#888')
  scene.background = palette.scene
  floor.material.color.copy(palette.scene)
  // Rooms, the coffee corner and the office are rebuilt in the new colors
  // on the next sync.
  for (const t of rooms.values()) { if (t.mesh) scene.remove(t.mesh); t.w = null }
  if (coffee) { scene.remove(coffee.group); coffee = null }
  if (shell) { scene.remove(shell.group); shell = null }
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
  daylightAt = -1
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

function label(html, cls) {
  const el = document.createElement('div')
  el.className = `tag ${cls}`
  el.innerHTML = html
  return { obj: new CSS2DObject(el), el }
}

// A small flag that floats over a critter: "zzz" while it sleeps, "!" when
// a tool fails.
function flag(cls, html) {
  const el = document.createElement('div')
  el.className = `flag ${cls}`
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
// The coffee corner and the office around everything

let coffee = null
let shell = null
let shellKey = ''
let vacuum = null

function ensureCoffee() {
  if (coffee) return coffee
  const c = coffeeCorner(roomColors('a'))
  coffee = { ...c, w: COFFEE_W, d: COFFEE_D, target: new THREE.Vector3(), center: new THREE.Vector3(), placed: false, taken: new Set(), label: label('<span class="pname">Coffee corner</span>', 'project coffee') }
  coffee.label.obj.position.set(-25, 62, -COFFEE_D / 2 + 14)
  coffee.group.add(coffee.label.obj)
  scene.add(coffee.group)
  return coffee
}

function ensureShell(W, D) {
  const key = `${Math.round(W)}x${Math.round(D)}`
  if (shell && key === shellKey) return
  if (shell) scene.remove(shell.group)
  shell = officeShell({ W, D, colors: roomColors('a') })
  shellKey = key
  scene.add(shell.group)
  ensureVacuum(W, D)
}

// A robot vacuum doing laps of the open floor around the rooms.
function ensureVacuum(W, D) {
  if (!vacuum) {
    const g = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CylinderGeometry(8, 8.4, 3, 28), new THREE.MeshStandardMaterial({ color: '#3b3a3f', roughness: 0.4 }))
    body.position.y = 1.9
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 0.6, 24), new THREE.MeshStandardMaterial({ color: '#56555c', roughness: 0.3 }))
    lid.position.y = 3.6
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 10), new THREE.MeshBasicMaterial({ color: '#56e39f' }))
    led.position.set(0, 3.7, 6)
    g.add(body, lid, led)
    g.traverse(o => { if (o.isMesh) o.castShadow = true })
    scene.add(g)
    vacuum = { group: g, led, i: 0 }
  }
  const x = W / 2 - 34
  const z = D / 2 - 34
  vacuum.loop = [new THREE.Vector3(-x, 0, z), new THREE.Vector3(x, 0, z), new THREE.Vector3(x, 0, -z + 30), new THREE.Vector3(-x, 0, -z + 30)]
  vacuum.group.position.copy(vacuum.loop[0])
  vacuum.i = 1
}

// ---------------------------------------------------------------------------
// What goes in the office

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
    const built = buildRoom({ w, d, name: p.name, colors: roomColors(roomOf(p.name)) })
    t.mesh = built.group
    t.plants = built.plants
    t.mesh.position.copy(t.center)
    t.mesh.add(t.label.obj)
    scene.add(t.mesh)
    t.w = w
    t.d = d
  }
  // The room's name hangs as a sign over its back wall.
  t.label.obj.position.set(0, WALL_H + 8, -d / 2)
  const more = p.hidden > 0 ? `<span class="pmore">+${p.hidden}</span>` : ''
  const html = `<span class="pname">${escapeHtml(p.name)}</span>${more}`
  if (t.html !== html) t.label.el.innerHTML = t.html = html
  t.label.el.classList.toggle('focused', focusedProject === p.id)
  return t
}

function ensureSession(n) {
  let s = sessionViews.get(n.id)
  if (s) return s
  s = { id: n.id, home: new THREE.Vector3(), group: new THREE.Group(), gaugeKey: '', placed: false }
  s.tint = sessionTint(n.session)
  s.room = roomOf(nodes.get(`p:${n.project}`)?.label ?? n.project)
  s.body = new THREE.Group() // the critter, which walks; the rest stays put
  s.char = makeCharacter({ build: 'session', bodyColor: palette[s.tint], inkColor: EYE, accentColor: palette.gem, pick: { kind: 'session', id: n.id } })
  s.char.root.scale.setScalar(SS)
  s.char.root.position.y = FLOOR_TOP
  s.body.add(s.char.root)
  s.rug = rug(rugColor(s.tint, s.room))
  s.track = flatRing(22, 23.6, palette.line)
  s.label = label('', 'session')
  s.label.obj.position.set(0, FLOOR_TOP, 32)
  s.label.el.addEventListener('click', () => onPick(n.id))
  s.label.el.addEventListener('pointerenter', () => { hovered = n.id; hoverPick = { kind: 'session', id: n.id } })
  s.label.el.addEventListener('pointerleave', () => { if (hovered === n.id) hovered = hoverPick = null })
  s.zzz = flag('zzz', '<i>z</i><i>z</i><i>z</i>')
  s.zzz.obj.position.set(10, FLOOR_TOP + SS * s.char.height + 4, 0)
  s.oops = flag('oops', '!')
  s.oops.obj.position.set(0, FLOOR_TOP + SS * s.char.height + 10, 0)
  s.body.add(s.zzz.obj, s.oops.obj)
  s.group.add(s.rug, s.track, s.body, s.label.obj)
  placeDesk(s)
  // A session that starts while you watch walks in through the office.
  s.walkIn = !resting(n) && clock() - mountedAt > 3
  scene.add(s.group)
  sessionViews.set(n.id, s)
  return s
}

function dropSession(id) {
  const s = sessionViews.get(id)
  if (!s) return
  scene.remove(s.group)
  for (const el of [s.label.el, s.zzz.el, s.oops.el]) el.remove()
  sessionViews.delete(id)
  for (const [key, a] of agentViews) if (a.session === id) dropAgent(key)
}

function ensureAgent(n, s) {
  let a = agentViews.get(n.id)
  if (a) return a
  const taken = new Set([...agentViews.values()].filter(x => x.session === s.id && !x.gone && !x.endedAt).map(x => x.slot))
  let slot = 0
  while (taken.has(slot)) slot++
  const tint = tintOf(n.type)
  // A finished agent seen for the first time (on a replay) is already gone.
  const born = n.status === 'done' ? -Infinity : clock()
  a = { id: n.id, session: s.id, slot, tint, born, group: new THREE.Group(), gone: n.status === 'done' }
  a.char = makeCharacter({ build: n.type, bodyColor: palette[tint], inkColor: EYE, accentColor: accent(tint), pick: { kind: 'agent', id: n.id } })
  a.char.root.scale.setScalar(AG)
  a.oops = flag('oops small', '!')
  a.oops.obj.position.set(0, AG * a.char.height + 8, 0)
  a.group.add(a.char.root, a.oops.obj)
  a.group.visible = !a.gone
  scene.add(a.group)
  agentViews.set(n.id, a)
  // The session waves hello to a helper that arrives while you watch.
  if (!a.gone && clock() - mountedAt > 3) {
    s.waveAt = clock()
    sound.pop()
  }
  return a
}

function dropAgent(id) {
  const a = agentViews.get(id)
  if (!a) return
  scene.remove(a.group)
  a.oops.el.remove()
  if (a.spot !== undefined) coffee?.taken.delete(a.spot)
  agentViews.delete(id)
}

// ---------------------------------------------------------------------------
// Layout: rooms packed into rows, choosing the column count that lets the
// office fill the stage best. Positions ease, so a change never jumps.

function layout(list) {
  // The coffee corner is packed in with the rooms, last, so it always ends
  // a row and its right side is open to the office's side aisle.
  const items = [...list.map(p => rooms.get(p.id)), ensureCoffee()]
  // Pick the arrangement that fills the space the panels leave free.
  const sw = Math.max(1, (stage.clientWidth || 1) - insets.left - insets.right)
  const sh = Math.max(1, (stage.clientHeight || 1) - insets.top - insets.bottom)
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
      t.target.set(x + t.w / 2, 0, z + t.d / 2)
      if (!t.placed) { t.center.copy(t.target); t.placed = true }
      t.rowFront = z + rowD
      x += t.w + ROOM_GAP
    }
    z += rowD + ROOM_GAP
  }
  ensureShell(best.W, best.D)
  return { W: best.W, D: best.D }
}

let size = { W: 300, D: ROW_DEPTH }

// Frame every room, or the focused one, looking down across the floor and
// centered in the space the panels leave free. A view offset slides the
// picture so the office's center lands in the middle of that space; the
// distance is then pulled back until every corner fits inside it. The
// camera glides there unless `jump`.
function frame(jump = false) {
  const t = focusedProject && rooms.get(focusedProject)
  const w = t ? t.w : size.W
  const d = t ? t.d : size.D
  const c = t ? t.target : new THREE.Vector3()
  const W = stage.clientWidth || 1
  const H = stage.clientHeight || 1
  const box = {
    x0: Math.min(insets.left, W * 0.45), x1: W - Math.min(insets.right, W * 0.45),
    y0: Math.min(insets.top, H * 0.45), y1: H - Math.min(insets.bottom, H * 0.45),
  }
  const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2
  const hw = (box.x1 - box.x0) / 2, hh = (box.y1 - box.y0) / 2
  camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H)
  const vfov = (camera.fov * Math.PI) / 180
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * (hw / hh))
  let dist = Math.max((w + 50) / 2 / Math.tan(hfov / 2), (d * Math.sin(TILT) + 70) / 2 / Math.tan(vfov / 2)) * (H / (2 * hh))
  const corners = []
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2 + 30]) for (const y of [0, t ? WALL_H + 16 : 66]) corners.push(new THREE.Vector3(c.x + x, y, c.z + z))
  const keep = { pos: camera.position.clone(), quat: camera.quaternion.clone() }
  const target = new THREE.Vector3(c.x, 8, c.z)
  for (let i = 0; i < 5; i++) {
    camera.position.set(c.x, Math.sin(TILT) * dist, c.z + Math.cos(TILT) * dist)
    camera.lookAt(target)
    camera.updateMatrixWorld()
    const reach = Math.max(...corners.map(p => {
      const q = p.clone().project(camera)
      const sx = ((q.x + 1) / 2) * W, sy = ((1 - q.y) / 2) * H
      return Math.max(Math.abs(sx - cx) / (hw * 0.94), Math.abs(sy - cy) / (hh * 0.94))
    }))
    dist *= Math.max(0.6, reach)
  }
  const goal = { pos: new THREE.Vector3(c.x, Math.sin(TILT) * dist, c.z + Math.cos(TILT) * dist), target }
  if (jump || !framedOnce) {
    framedOnce = true
    camera.position.copy(goal.pos)
    controls.target.copy(goal.target)
    camGoal = null
  } else {
    camera.position.copy(keep.pos)
    camera.quaternion.copy(keep.quat)
    camGoal = goal
  }
  zoomTo = null
  controls.update()
  Object.assign(sun.shadow.camera, { left: -size.W / 2 - 80, right: size.W / 2 + 80, top: size.D / 2 + 100, bottom: -size.D / 2 - 100, near: 10, far: 900 })
  sun.shadow.camera.updateProjectionMatrix()
}
let framedOnce = false

// Called by the page whenever the panels change size.
export function setInsets(next) {
  const same = ['left', 'right', 'top', 'bottom'].every(k => Math.abs((insets[k] ?? 0) - next[k]) < 2)
  insets = next
  if (!same) frame()
}

// Zoom to the room a session (or a subagent's session) works in, or back
// out to the whole office.
export function focusOn(id) {
  const n = id && nodes.get(id)
  const host = n?.kind === 'agent' ? nodes.get(sid(n.session)) : n
  focusProject(host?.project ? `p:${host.project}` : null)
}

// The directory's entries show the same bubble as hovering the critter.
export function setHover(id) {
  const n = id && nodes.get(id)
  hoverPick = n ? { kind: n.kind, id } : null
  hovered = n?.kind === 'session' ? id : null
}

export function focusProject(id) {
  const next = id && rooms.has(id) ? id : null
  if (next === focusedProject && camGoal) return
  focusedProject = next
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
// Walking. Critters keep to the aisles: out of their room's open front into
// the aisle in front of its row, along to the office's right-hand aisle,
// and up or down it, so they never cut through another room.

const aisleX = () => size.W / 2 - OFFICE_MARGIN / 2
const aisleZ = room => (room?.rowFront ?? room?.target.z ?? 0) + ROOM_GAP / 2

function walk(view, group, path, then) {
  view.walk = { group, path: path.map(p => p.clone()), then }
}

// Move along the path; true while still walking.
function stepWalk(view, dt) {
  const w = view.walk
  if (!w) return false
  let step = WALK_SPEED * dt
  while (step > 0 && w.path.length) {
    const to = w.path[0]
    const pos = w.group.position
    const dx = to.x - pos.x
    const dz = to.z - pos.z
    const dist = Math.hypot(dx, dz)
    if (dist > 0.01) {
      const heading = Math.atan2(dx, dz)
      let turn = heading - w.group.rotation.y
      turn = Math.atan2(Math.sin(turn), Math.cos(turn))
      w.group.rotation.y += turn * Math.min(1, dt * 10)
    }
    if (dist <= step) { pos.x = to.x; pos.z = to.z; step -= dist; w.path.shift() } else { pos.x += (dx / dist) * step; pos.z += (dz / dist) * step; step = 0 }
  }
  if (!w.path.length) {
    view.walk = null
    w.then?.()
    return false
  }
  return true
}

function roomOfSession(s) {
  const n = nodes.get(s.id)
  return n && rooms.get(`p:${n.project}`)
}

// A finished helper walks to a free spot in the coffee corner, picks up a
// mug, lingers, then heads home.
function startBreak(a, s) {
  const c = coffee
  const free = c ? c.spots.findIndex((_, i) => !c.taken.has(i)) : -1
  if (free < 0) { a.leaving = clock(); return }
  c.taken.add(free)
  a.spot = free
  const room = roomOfSession(s)
  const spot = c.target.clone().add(c.spots[free])
  // Each helper keeps to its own lane, so walkers don't stack up.
  const offset = ((hash(a.id) % 5) - 2) * 9
  const lane = aisleZ(room) + offset
  const x = aisleX() + offset
  const path = [
    new THREE.Vector3(a.group.position.x, 0, lane),
    new THREE.Vector3(x, 0, lane),
    new THREE.Vector3(x, 0, spot.z),
    spot,
  ]
  walk(a, a.group, path, () => {
    a.onBreak = clock()
    sound.clink()
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.32, 12), new THREE.MeshStandardMaterial({ color: palette.trim }))
    mug.position.set(0.45, -0.12, 0.2)
    a.char.arms[1].add(mug)
  })
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
        if (!s.placed) {
          s.group.position.copy(s.home)
          s.placed = true
          if (s.walkIn) {
            // In from the front of the office, up the right-hand aisle, and
            // along the aisle in front of its room to its desk.
            const x = aisleX()
            const lane = aisleZ(t)
            const local = p => p.sub(s.home)
            s.body.position.copy(local(new THREE.Vector3(x, 0, size.D / 2 + 20)))
            walk(s, s.body, [local(new THREE.Vector3(x, 0, lane)), local(new THREE.Vector3(s.home.x, 0, lane)), new THREE.Vector3(0, 0, 0)], () => { s.body.rotation.y = 0 })
          }
        }
      })
    }
    frame()
  }
  return list
}

// ---------------------------------------------------------------------------
// Moments from the event stream: hops, beads, ripples, confetti, and the
// "!" of a failed call.

function headOf(id) {
  const a = agentViews.get(id)
  if (a && !a.gone) return a.group.position.clone().add(v.set(0, AG * a.char.height, 0))
  const s = sessionViews.get(id)
  if (s) return s.group.position.clone().add(s.body.position).add(v.set(0, FLOOR_TOP + SS * s.char.height, 0))
  return null
}

function addBead(from, color) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1.7, 16, 16), new THREE.MeshStandardMaterial({ color, roughness: 0.5, transparent: true }))
  m.castShadow = true
  m.position.copy(from)
  scene.add(m)
  beads.push({ m, born: clock(), from: from.clone(), drift: new THREE.Vector3((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6) })
}

// A little burst of colored paper when a session finishes a turn.
function addConfetti(from) {
  const geo = new THREE.BoxGeometry(1.6, 0.3, 1)
  for (let i = 0; i < 18; i++) {
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: palette[TINTS[i % TINTS.length]], transparent: true }))
    m.position.copy(from)
    scene.add(m)
    const a = Math.random() * Math.PI * 2
    const sp = 14 + Math.random() * 18
    confetti.push({ m, born: clock(), vel: new THREE.Vector3(Math.cos(a) * sp, 34 + Math.random() * 22, Math.sin(a) * sp), spin: new THREE.Vector3(Math.random() * 9, Math.random() * 9, Math.random() * 9) })
  }
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
      sound.keys()
    } else {
      view.failAt = t
      sound.bonk()
    }
    const from = headOf(owner)
    if (from) addBead(from, ev.kind === 'tool.end' ? palette.crit : palette[beadColor(ev.tool)] ?? palette.line)
  } else if (ev.kind === 'context.compact' && session && !ev.agent) {
    const r = flatRing(23, 24, palette[session.tint])
    r.position.x = session.group.position.x
    r.position.z = session.group.position.z
    scene.add(r)
    ripples.push({ r, born: t })
    sound.hush()
  } else if (ev.kind === 'turn.start' && session && !ev.agent) {
    session.hopAt = t
  } else if (ev.kind === 'turn.complete' && session && !ev.agent) {
    const from = headOf(session.id)
    if (from) addConfetti(from)
    sound.chime()
  }
}

// ---------------------------------------------------------------------------
// The time of day, from your clock: the windows' sky, the lamps and the sun.

let daylightAt = -1
const KEYS = [[0, 'night'], [5.5, 'night'], [7, 'dawn'], [9, 'window'], [16.5, 'window'], [18.5, 'dawn'], [19.5, 'dusk'], [21, 'night'], [24, 'night']]

function daylight(now) {
  if (now - daylightAt < 5) return
  daylightAt = now
  const d = new Date()
  const h = d.getHours() + d.getMinutes() / 60
  let i = 0
  while (KEYS[i + 1][0] <= h) i++
  const [h0, c0] = KEYS[i]
  const [h1, c1] = KEYS[i + 1]
  const k = (h - h0) / Math.max(0.01, h1 - h0)
  const color = palette[c0].clone().lerp(palette[c1], k)
  glassMat.color.copy(color)
  glassMat.emissive.copy(color)
  // How dark it is outside: 0 by day, 1 at night.
  const dark = c0 === 'night' && c1 === 'night' ? 1 : c0 === 'window' && c1 === 'window' ? 0 : (c0 === 'night' ? 1 - k : c1 === 'night' ? k : 0.4)
  glassMat.emissiveIntensity = 0.45 - dark * 0.15
  lampMat.emissive.copy(palette.glow)
  lampMat.emissiveIntensity = 0.45 + dark * 1.1
  sun.intensity = 2.1 - dark * 0.7
  sun.color.set('#fffaf2').lerp(new THREE.Color('#c9d4ff'), dark * 0.6)
  sky.intensity = 1.6 - dark * 0.35
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

// A short wobble and a "!" after a failed call.
function oops(view, char, el, now) {
  const k = view.failAt ? (now - view.failAt) / 1.4 : 1
  char.rig.rotation.z = k < 1 ? Math.sin(now * 38) * 0.09 * (1 - k) : 0
  el.classList.toggle('on', k < 1)
}

// One arm up and waving.
function waving(view, char, now) {
  const k = view.waveAt ? (now - view.waveAt) / WAVE_S : 1
  if (k >= 1) return
  const arm = char.arms[0]
  arm.rotation.x = 0
  arm.rotation.z = -(2.1 + Math.sin(now * 16) * 0.35) * Math.sin(Math.min(1, k * 4) * Math.PI / 2)
}

// Critters on the move (walking in, off to coffee, or on their break) wave
// when they pass each other, once per pair every so often.
const greeted = new Map()
function greetings(now) {
  const movers = []
  for (const a of agentViews.values()) {
    if (a.gone || a.leaving || !a.endedAt || !(a.walk || a.onBreak)) continue
    movers.push({ view: a, pos: a.group.position, walking: !!a.walk })
  }
  for (const s of sessionViews.values()) {
    if (s.walk) movers.push({ view: s, pos: s.group.position.clone().add(s.body.position), walking: true })
  }
  for (let i = 0; i < movers.length; i++) {
    for (let j = i + 1; j < movers.length; j++) {
      const a = movers[i], b = movers[j]
      if (!a.walking && !b.walking) continue
      if (Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) > MEET) continue
      const key = a.view.id < b.view.id ? `${a.view.id}|${b.view.id}` : `${b.view.id}|${a.view.id}`
      if (now - (greeted.get(key) ?? -99) < 12) continue
      greeted.set(key, now)
      a.view.waveAt = b.view.waveAt = now
      sound.hello()
    }
  }
  if (greeted.size > 200) greeted.clear()
}

// Standing helpers nudge apart so nobody stands inside anybody else.
function makeRoom() {
  const standing = [...agentViews.values()].filter(a => !a.gone && !a.walk && !a.leaving && a.settled)
  for (let i = 0; i < standing.length; i++) {
    for (let j = i + 1; j < standing.length; j++) {
      const p = standing[i].group.position, q = standing[j].group.position
      const dx = q.x - p.x, dz = q.z - p.z
      const d = Math.hypot(dx, dz) || 0.01
      if (d >= PERSONAL) continue
      const push = (PERSONAL - d) / 2
      p.x -= (dx / d) * push; p.z -= (dz / d) * push
      q.x += (dx / d) * push; q.z += (dz / d) * push
    }
  }
}

export function animate() {
  const now = clock()
  const dt = Math.min(0.1, now - last)
  last = now
  const wall = Date.now()
  // Who has a tool running right now.
  const running = new Set()
  for (const n of nodes.values()) if (n.kind === 'tool' && n.status === 'active') running.add(n.owner)

  daylight(now)
  for (const t of rooms.values()) {
    t.center.lerp(t.target, 0.12)
    t.mesh.position.copy(t.center)
    for (const p of t.plants ?? []) p.rotation.z = Math.sin(now * 0.8 + p.userData.plant) * 0.035
  }
  if (coffee) {
    coffee.center.lerp(coffee.target, 0.12)
    coffee.group.position.copy(coffee.center)
    coffee.animate(now)
  }
  if (shell) {
    for (const p of shell.plants) p.rotation.z = Math.sin(now * 0.7 + p.userData.plant) * 0.03
    const d = new Date()
    const secs = d.getSeconds() + d.getMilliseconds() / 1000
    shell.clock.second.rotation.z = -(secs / 60) * Math.PI * 2
    shell.clock.minute.rotation.z = -((d.getMinutes() + secs / 60) / 60) * Math.PI * 2
    shell.clock.hour.rotation.z = -(((d.getHours() % 12) + d.getMinutes() / 60) / 12) * Math.PI * 2
  }
  if (vacuum?.loop) {
    const to = vacuum.loop[vacuum.i]
    const g = vacuum.group
    const dx = to.x - g.position.x
    const dz = to.z - g.position.z
    const dist = Math.hypot(dx, dz)
    const step = 22 * dt
    if (dist <= step) { vacuum.i = (vacuum.i + 1) % vacuum.loop.length } else {
      g.position.x += (dx / dist) * step
      g.position.z += (dz / dist) * step
      let turn = Math.atan2(dx, dz) - g.rotation.y
      turn = Math.atan2(Math.sin(turn), Math.cos(turn))
      g.rotation.y += turn * Math.min(1, dt * 4)
    }
    vacuum.led.visible = Math.floor(now * 2) % 2 === 0
  }

  for (const s of sessionViews.values()) {
    const n = nodes.get(s.id)
    if (!n) continue
    s.group.position.lerp(s.home, 0.12)
    const asleep = resting(n)
    const f = fill(n)
    const walking = stepWalk(s, dt)
    const working = running.has(s.id) || wall - (n.lastAt ?? 0) < BUSY_MS
    const busy = asleep ? 0 : walking || working ? 1 : Math.max(0, 1 - (now - (s.lastAt ?? -9)) / 2.5)
    const dozing = asleep || (!working && !walking && wall - (n.lastAt ?? n.startedAt ?? wall) > DOZE_MS)
    const helper = s.lookAt && agentViews.get(s.lookAt)
    const look = helper && !helper.endedAt ? Math.atan2(helper.group.position.x - s.group.position.x, helper.group.position.z - s.group.position.z) : 0
    pose(s.char, now, {
      busy,
      look: walking ? 0 : Math.max(-0.45, Math.min(0.45, look * 0.3)),
      hop: s.hopAt ? (now - s.hopAt) / 0.35 : 1,
      alarm: !asleep && !walking && f >= WARN_AT,
      asleep: dozing,
    })
    oops(s, s.char, s.oops.el, now)
    waving(s, s.char, now)
    // A resting critter fades toward the floor's color.
    s.char.bodyMat.color.copy(palette[s.tint]).lerp(palette.line, asleep ? 0.6 : 0)
    s.char.bulb.visible = !asleep
    s.zzz.el.classList.toggle('on', dozing && !walking)
    s.desk.draw(now, asleep ? 'off' : busy > 0.5 && !walking ? 'busy' : 'idle', `#${palette[s.tint].getHexString()}`)
    s.desk.steam(now, !asleep && working)
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
    if (n.status === 'done' && !a.endedAt) {
      a.endedAt = now
      // A wave goodbye (and one back from the session), then off to coffee.
      if (!a.gone) { a.waveAt = now; s.waveAt = now + 0.2; a.departAt = now + 0.9 }
    }
    if (a.gone) continue
    if (a.departAt && now >= a.departAt) { a.departAt = null; startBreak(a, s) }
    oops(a, a.char, a.oops.el, now)
    const walking = stepWalk(a, dt)

    if (a.endedAt) {
      // On the way to coffee, on a break, then off home.
      if (!walking && a.onBreak && !a.leaving && now - a.onBreak > BREAK_S) a.leaving = now
      pose(a.char, now + a.slot, { busy: walking ? 1 : 0, hop: 1 })
      waving(a, a.char, now)
      if (a.onBreak && !a.leaving) {
        const table = coffee.target.clone().add(coffee.tableAt)
        const face = Math.atan2(table.x - a.group.position.x, table.z - a.group.position.z)
        a.group.rotation.y += Math.atan2(Math.sin(face - a.group.rotation.y), Math.cos(face - a.group.rotation.y)) * Math.min(1, dt * 6)
        // The mug arm rests forward, with a sip now and then.
        const sip = Math.sin((now - a.onBreak) * 1.3) > 0.85
        a.char.arms[1].rotation.x = sip ? -1.3 : -0.5
        a.char.arms[1].rotation.z = 0.35
      }
      if (a.leaving) {
        const k = Math.min(1, (now - a.leaving) / 1.6)
        a.group.scale.setScalar(Math.max(0.01, 1 - k))
        if (k >= 1) {
          a.gone = true
          a.group.visible = false
          if (a.spot !== undefined) coffee?.taken.delete(a.spot)
        }
      }
      continue
    }

    const [sx, sz] = slotAt(a.slot)
    const target = new THREE.Vector3(s.group.position.x + sx, FLOOR_TOP, s.group.position.z + sz)
    const grow = Math.min(1, (now - a.born) / 0.6)
    a.group.rotation.y = Math.atan2(s.group.position.x - a.group.position.x, s.group.position.z - a.group.position.z) * 0.45
    pose(a.char, now + a.slot, {
      busy: n.status === 'active' && (running.has(a.id) || now - (a.lastAt ?? -9) < 1.5) ? 1 : 0,
      hop: a.hopAt ? (now - a.hopAt) / 0.3 : 1,
      alarm: n.status === 'active' && fill(n) >= WARN_AT,
    })
    waving(a, a.char, now)
    a.group.scale.setScalar(Math.max(0.01, grow < 1 ? grow * (1 + 0.2 * Math.sin(grow * Math.PI)) : 1))
    // New helpers drop in from above.
    target.y = FLOOR_TOP + (1 - grow) * (1 - grow) * 40
    a.group.position.lerp(target, grow < 1 || !a.settled ? 1 : 0.1)
    a.settled = true
  }

  if (tick % 3 === 0) greetings(now)
  makeRoom()

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
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i], k = (now - c.born) / 1.5
    if (k >= 1) { scene.remove(c.m); c.m.material.dispose(); confetti.splice(i, 1); continue }
    c.vel.y -= 70 * dt
    c.m.position.addScaledVector(c.vel, dt)
    if (c.m.position.y < FLOOR_TOP + 0.4) { c.m.position.y = FLOOR_TOP + 0.4; c.vel.multiplyScalar(0.3) }
    c.m.rotation.x += c.spin.x * dt
    c.m.rotation.y += c.spin.y * dt
    c.m.material.opacity = 1 - k * k
  }

  if (camGoal) {
    const k = 1 - Math.pow(0.002, dt)
    camera.position.lerp(camGoal.pos, k)
    controls.target.lerp(camGoal.target, k)
    if (camera.position.distanceTo(camGoal.pos) < 0.5) camGoal = null
  }
  zoom(dt)
  // A drag's spin slows by the same amount each second, however fast the
  // frames come.
  controls.dampingFactor = 1 - Math.pow(1 - DAMPING, dt * 60)
  controls.update()
  if (tick % 2 === 0) renderer.shadowMap.needsUpdate = true
  sharpness(now, dt)
  renderer.render(scene, camera)
  labels.render(scene, camera)
  placeBubble(tick % 10 === 1)
  if ((tick++ % 6) === 0) declutter()
}

// The wheel (or a trackpad pinch) sets where to zoom to, by as much as the
// controls would have, and each frame eases the camera part of the way.
function wheel(e) {
  e.preventDefault()
  camGoal = null
  let dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1)
  if (e.ctrlKey) dy *= 10
  const from = zoomTo ?? camera.position.distanceTo(controls.target)
  zoomTo = THREE.MathUtils.clamp(from * Math.pow(0.95, -dy * 0.01), controls.minDistance, controls.maxDistance)
}

function zoom(dt) {
  if (zoomTo === null) return
  v.subVectors(camera.position, controls.target)
  const d = v.length()
  const next = Math.abs(zoomTo / d - 1) < 0.001 ? zoomTo : d * Math.pow(zoomTo / d, 1 - Math.pow(ZOOM_EASE, dt))
  camera.position.copy(controls.target).add(v.setLength(next))
  if (next === zoomTo) zoomTo = null
}

// A big, sharp screen can ask more of the GPU than it draws smoothly. When
// frames keep running long, draw at a lower resolution, a step at a time.
function sharpness(now, dt) {
  if (now - mountedAt < 3 || dt >= 0.1) return
  slowFrames = dt > 1 / 40 ? slowFrames + 1 : Math.max(0, slowFrames - 1)
  if (slowFrames < 90 || renderer.getPixelRatio() <= 1) return
  renderer.setPixelRatio(Math.max(1, renderer.getPixelRatio() - 0.5))
  slowFrames = 0
}

// Room signs come first. A session label under a sign steps aside, and
// when session labels collide, the less important one drops its name and
// keeps only its percentage: the selected or hovered session first, then
// live sessions, then past ones.
function declutter() {
  const rank = s => {
    const n = nodes.get(s.id)
    return (selected === s.id || hovered === s.id ? 0 : n && !resting(n) ? 1 : 2) * 1e13 - recency(n ?? {})
  }
  const overlaps = (r, list) => list.some(p => r.left < p.right + 4 && r.right > p.left - 4 && r.top < p.bottom + 2 && r.bottom > p.top - 2)
  // Room signs, and the hover bubble while it's up, outrank every name.
  const signs = [...rooms.values(), ...(coffee ? [coffee] : [])].map(t => t.label.el.getBoundingClientRect())
  if (!bubble.hidden) signs.push(bubble.getBoundingClientRect())
  const placed = []
  for (const s of [...sessionViews.values()].sort((a, b) => rank(a) - rank(b))) {
    const el = s.label.el
    el.classList.remove('crowded', 'covered')
    const mine = selected === s.id || (hovered === s.id && bubble.hidden)
    // The bubble already names the critter it's over.
    if (hoverPick?.id === s.id && !bubble.hidden) { el.classList.add('covered'); continue }
    if (!mine && overlaps(el.getBoundingClientRect(), signs)) { el.classList.add('covered'); continue }
    if (!mine && overlaps(el.getBoundingClientRect(), placed)) el.classList.add('crowded')
    placed.push(el.getBoundingClientRect())
  }
  const over = bubble.hidden ? null : bubble.getBoundingClientRect()
  for (const t of [...rooms.values(), ...(coffee ? [coffee] : [])]) {
    t.label.el.classList.toggle('covered', Boolean(over && overlaps(t.label.el.getBoundingClientRect(), [over])))
  }
}

export function setSelected(id) {
  selected = id
}

// ---------------------------------------------------------------------------
// The hover bubble: who this is and what it's doing.

function runningTool(id) {
  for (const n of nodes.values()) if (n.kind === 'tool' && n.status === 'active' && n.owner === id) return n
  return null
}

const k = n => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1000)}k`)
const row = (name, value) => (value ? `<div><dt>${name}</dt><dd>${escapeHtml(value)}</dd></div>` : '')

function bubbleFor(pick) {
  const n = nodes.get(pick.id)
  if (!n) return ''
  const tool = runningTool(n.id)
  const doing = tool ? `${tool.tool}${tool.summary ? ` ${tool.summary}` : ''}` : ''
  const ctx = n.context?.tokens ? `${pct(fill(n))} · ${k(n.context.tokens)} of ${k(n.context.window)}` : ''
  if (n.kind === 'agent') {
    const host = nodes.get(sid(n.session))
    const view = agentViews.get(n.id)
    const status = n.status !== 'done' ? (n.status === 'idle' ? 'waiting' : 'working')
      : view?.walk ? 'finished, heading for coffee' : view?.onBreak && !view.leaving ? 'finished, on a coffee break' : 'finished'
    return `<b><i class="dot ${tintOf(n.type)}"></i>${escapeHtml(n.label)}</b>
      ${n.description ? `<p>${escapeHtml(n.description)}</p>` : ''}
      <dl>${row('status', status)}${row('doing', doing)}${row('context', ctx)}${row('model', n.model)}${row('tool calls', n.history ? String(n.history) : '')}${row('for', host?.label)}</dl>`
  }
  const live = !resting(n)
  const helpers = [...nodes.values()].filter(x => x.kind === 'agent' && x.session === n.session && x.status !== 'done').length
  const lastDone = activity.get(n.id)?.actions[0]
  const status = !live ? `ended ${ago(n.endedAt ?? n.lastAt)}` : tool || Date.now() - (n.lastAt ?? 0) < BUSY_MS ? 'working' : `waiting · last active ${ago(n.lastAt)}`
  return `<b><i class="dot ${sessionTint(n.session)}"></i>${escapeHtml(n.prompts?.[0]?.text ?? n.label)}</b>
    <p>${escapeHtml([n.projectName, n.gitBranch].filter(Boolean).join(' · '))}</p>
    <dl>${row('status', status)}${row('doing', doing || (lastDone ? lastDone.text : ''))}${row('context', ctx)}${row('helpers', helpers ? String(helpers) : '')}${row('model', n.model)}${row('cost', n.costUsd !== undefined ? `$${n.costUsd.toFixed(2)}` : '')}</dl>`
}

function placeBubble(refresh) {
  if (!hoverPick) { bubble.hidden = true; return }
  const head = headOf(hoverPick.id)
  if (!head) { bubble.hidden = true; return }
  if (refresh || bubble.hidden) bubble.innerHTML = bubbleFor(hoverPick)
  const p = head.add(v.set(0, hoverPick.kind === 'agent' ? 6 : 10, 0)).project(camera)
  bubble.style.left = `${((p.x + 1) / 2) * stage.clientWidth}px`
  bubble.style.top = `${((1 - p.y) / 2) * stage.clientHeight}px`
  bubble.hidden = false
}

// ---------------------------------------------------------------------------
// Pointer: click a critter to select it, hover for its bubble.

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
    if (e.buttons) { hoverPick = null; return }
    const p = hit(e)
    hoverPick = p ?? null
    hovered = !p ? null : p.kind === 'session' ? p.id : agentViews.get(p.id)?.session ?? null
    renderer.domElement.style.cursor = p ? 'pointer' : ''
  })
  renderer.domElement.addEventListener('pointerleave', () => { hoverPick = null; hovered = null })
}
// ?debug reaches these through window.cluster.table.debug.
export const debug = { get renderer() { return renderer }, sessionViews, agentViews, rooms, get camera() { return camera }, get stage() { return stage }, get controls() { return controls }, get coffee() { return coffee }, greeted }
