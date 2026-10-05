// The office: an open floor with carpet, windows and a coffee corner, and
// a cozy room for each project, cut away at the front like a dollhouse so
// you can look in. Each room has a wooden floor, three low walls in its own
// color, and a few things to make it lived in: a bookshelf, a window, a
// plant, a lamp, a picture. What a room holds is picked from
// its name, so the same project always looks the same.

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export const FLOOR_TOP = 2.4
export const WALL_H = 46
// Furniture is built at desk scale and enlarged to sit well beside the critters.
const PROP = 1.7
const WALL_T = 3

const rounded = (w, h, d, r = 0.8) => new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2))

// Wooden planks, drawn once and tinted by each material's color.
let planks = null
function plankTexture() {
  if (planks) return planks
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, 256, 256)
  for (let row = 0; row < 8; row++) {
    const y = row * 32
    g.fillStyle = `rgba(0,0,0,${0.03 + (row % 3) * 0.015})`
    g.fillRect(0, y, 256, 32)
    g.fillStyle = 'rgba(0,0,0,0.12)'
    g.fillRect(0, y, 256, 1.5)
    const off = (row * 97) % 256
    g.fillRect(off, y, 1.5, 32)
    g.fillRect((off + 128) % 256, y, 1.5, 32)
  }
  planks = new THREE.CanvasTexture(c)
  planks.wrapS = planks.wrapT = THREE.RepeatWrapping
  planks.colorSpace = THREE.SRGBColorSpace
  planks.anisotropy = 4
  return planks
}

// Carpet tiles (soft squares) and kitchen tiles (a checkerboard).
const patterns = {}
function tileTexture(kind) {
  if (patterns[kind]) return patterns[kind]
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, 128, 128)
  if (kind === 'checker') {
    g.fillStyle = 'rgba(0,0,0,0.13)'
    g.fillRect(0, 0, 64, 64)
    g.fillRect(64, 64, 64, 64)
  } else {
    g.fillStyle = 'rgba(0,0,0,0.04)'
    g.fillRect(0, 0, 64, 64)
    g.fillRect(64, 64, 64, 64)
    g.fillStyle = 'rgba(0,0,0,0.08)'
    for (const v of [0, 64]) { g.fillRect(v, 0, 1, 128); g.fillRect(0, v, 128, 1) }
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return (patterns[kind] = t)
}

export function floorMaterial(color, w, d, pattern = 'planks') {
  const map = (pattern === 'planks' ? plankTexture() : tileTexture(pattern)).clone()
  map.needsUpdate = true
  const unit = pattern === 'planks' ? 90 : pattern === 'checker' ? 40 : 70
  map.repeat.set(w / unit, d / unit)
  return new THREE.MeshStandardMaterial({ color, map, roughness: 0.8 })
}

function seeded(text) {
  let h = 2166136261
  for (const c of String(text)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra })

// Shared by every window and every lamp, so the time of day can repaint
// them all at once (see daylight() in table.js).
export const glassMat = new THREE.MeshStandardMaterial({ color: '#bfe3f7', emissive: '#bfe3f7', emissiveIntensity: 0.4, roughness: 0.15 })
export const lampMat = new THREE.MeshStandardMaterial({ color: '#fbf6ec', emissive: '#ffcf7a', emissiveIntensity: 0.55, side: THREE.DoubleSide, roughness: 0.6 })

function shadowed(obj) {
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  return obj
}

// ---------------------------------------------------------------------------
// Props, each standing on the floor at y = 0 of its own group.

function bookshelf(colors, rand) {
  const g = new THREE.Group()
  const wood = mat(colors.woodDark)
  const frame = new THREE.Mesh(rounded(44, 30, 11, 1), wood)
  frame.position.y = 15
  g.add(frame)
  for (const y of [4, 15.5]) {
    let x = -19
    while (x < 17) {
      const w = 2.2 + rand() * 2.2
      const h = 7 + rand() * 3
      const book = new THREE.Mesh(rounded(w, h, 7.5, 0.4), mat(colors.books[Math.floor(rand() * colors.books.length)]))
      book.position.set(x + w / 2, y + h / 2, 2.4)
      book.rotation.z = rand() < 0.12 ? 0.25 : 0
      g.add(book)
      x += w + 0.4
      if (rand() < 0.1) x += 4
    }
  }
  // Hollow it out by setting the shelves forward of the back board.
  frame.scale.z = 0.35
  frame.position.z = -3.5
  for (const y of [0.8, 12.6, 24.4, 29]) {
    const shelf = new THREE.Mesh(rounded(44, 1.6, 11, 0.4), wood)
    shelf.position.y = y
    g.add(shelf)
  }
  for (const x of [-21.2, 21.2]) {
    const side = new THREE.Mesh(rounded(1.6, 30, 11, 0.4), wood)
    side.position.set(x, 15, 0)
    g.add(side)
  }
  return shadowed(g)
}

function plant(colors, rand) {
  const g = new THREE.Group()
  g.userData.plant = rand() * 10 // a phase for its sway
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(5, 3.8, 8, 20), mat(colors.pot))
  pot.position.y = 4
  g.add(pot)
  const leaf = mat(colors.leaf, { roughness: 0.6 })
  const n = 5 + Math.floor(rand() * 3)
  for (let i = 0; i < n; i++) {
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(3.4 + rand() * 2, 0), leaf)
    const a = (i / n) * Math.PI * 2
    blob.position.set(Math.cos(a) * 3, 11 + rand() * 9, Math.sin(a) * 3)
    blob.scale.y = 1.3
    g.add(blob)
  }
  return shadowed(g)
}

function lamp(colors) {
  const g = new THREE.Group()
  const metal = mat(colors.woodDark)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4, 1.2, 20), metal)
  base.position.y = 0.6
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 26, 8), metal)
  pole.position.y = 13
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 6, 7, 24, 1, true), lampMat)
  shade.position.y = 28
  g.add(base, pole, shade)
  shadowed(g)
  shade.castShadow = false
  return g
}

function windowPane(colors, w) {
  const g = new THREE.Group()
  const frame = mat(colors.trim)
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, 15), glassMat)
  glass.position.set(0, 18, 0.3)
  g.add(glass)
  for (const [x, y, fw, fh] of [[0, 25.8, w + 2, 1.6], [0, 10.2, w + 3, 1.8], [-w / 2 - 0.4, 18, 1.6, 17], [w / 2 + 0.4, 18, 1.6, 17], [0, 18, 1, 15], [0, 18, w, 1]]) {
    const bar = new THREE.Mesh(rounded(fw, fh, 1.6, 0.3), frame)
    bar.position.set(x, y, 0.9)
    g.add(bar)
  }
  return g
}

function picture(colors, rand) {
  const g = new THREE.Group()
  const frame = new THREE.Mesh(rounded(14, 11, 1, 0.3), mat(colors.woodDark))
  frame.position.set(0, 20, 0.6)
  const art = new THREE.Mesh(new THREE.PlaneGeometry(11, 8), mat(colors.books[Math.floor(rand() * colors.books.length)]))
  art.position.set(0, 20, 1.15)
  const sun = new THREE.Mesh(new THREE.CircleGeometry(1.8, 20), mat(colors.trim))
  sun.position.set(2.5, 21, 1.2)
  g.add(frame, art, sun)
  return g
}

function couch(colors, rand) {
  const g = new THREE.Group()
  const fabric = mat(colors.books[Math.floor(rand() * colors.books.length)], { roughness: 0.9 })
  const seat = new THREE.Mesh(rounded(30, 6, 13, 2.5), fabric)
  seat.position.y = 5
  const back = new THREE.Mesh(rounded(30, 10, 4, 2), fabric)
  back.position.set(0, 10, -5)
  const arms = [-1, 1].map(s => {
    const a = new THREE.Mesh(rounded(4, 9, 13, 2), fabric)
    a.position.set(s * 15, 6.5, 0)
    return a
  })
  g.add(seat, back, ...arms)
  return shadowed(g)
}

// ---------------------------------------------------------------------------
// A room: `w` by `d`, centered on its group, open at the front (+z).

export function buildRoom({ w, d, name, colors }) {
  const rand = seeded(name)
  const room = new THREE.Group()

  const floor = new THREE.Mesh(rounded(w, FLOOR_TOP, d, 0.6), floorMaterial(colors.wood, w, d))
  floor.position.y = FLOOR_TOP / 2
  floor.receiveShadow = true
  room.add(floor)

  const wallMat = mat(colors.wall, { roughness: 0.92 })
  const trimMat = mat(colors.trim)
  const walls = [
    [w + WALL_T * 2, 0, -d / 2 - WALL_T / 2, 'back'],
    [d, -w / 2 - WALL_T / 2, 0, 'side'],
    [d, w / 2 + WALL_T / 2, 0, 'side'],
  ]
  for (const [len, x, z, kind] of walls) {
    const geo = kind === 'back' ? rounded(len, WALL_H, WALL_T, 0.6) : rounded(WALL_T, WALL_H, len, 0.6)
    const wall = new THREE.Mesh(geo, wallMat)
    wall.position.set(x, WALL_H / 2, z)
    wall.castShadow = wall.receiveShadow = true
    const cap = new THREE.Mesh(kind === 'back' ? rounded(len + 1, 1.6, WALL_T + 1.2, 0.4) : rounded(WALL_T + 1.2, 1.6, len + 1, 0.4), trimMat)
    cap.position.set(x, WALL_H + 0.6, z)
    const skirting = new THREE.Mesh(kind === 'back' ? rounded(len, 2.4, WALL_T + 0.8, 0.3) : rounded(WALL_T + 0.8, 2.4, len, 0.3), trimMat)
    skirting.position.set(x, FLOOR_TOP + 1.2, z)
    room.add(wall, cap, skirting)
  }

  // Along the back wall, left to right: a shelf, a window or a picture,
  // and a plant in the corner; a lamp in a front corner, and a couch when
  // there's room for one.
  const back = -d / 2 + 1
  const place = (obj, x, y, z, scale = PROP) => {
    obj.scale.setScalar(scale)
    obj.position.set(x, y, z)
    room.add(obj)
  }
  place(bookshelf(colors, rand), -w / 2 + 48 + rand() * 10, FLOOR_TOP, back + 9.5)
  place(windowPane(colors, Math.min(46, w * 0.12)), w * 0.02, -8, back)
  if (w > 300) place(picture(colors, rand), w * 0.24, -6, back)
  place(plant(colors, rand), w / 2 - 18, FLOOR_TOP, back + 16)
  place(plant(colors, rand), -w / 2 + 16, FLOOR_TOP, d / 2 - 20, PROP * 0.8)
  place(lamp(colors), w / 2 - 16, FLOOR_TOP, d / 2 - 18, PROP * 0.9)
  if (w > 380 && rand() < 0.8) place(couch(colors, rand), w * 0.27, FLOOR_TOP, back + 18)

  return { group: room, floor, wallMat, plants: plantsIn(room) }
}

const plantsIn = group => {
  const out = []
  group.traverse(o => { if (o.userData.plant !== undefined) out.push(o) })
  return out
}

// A rug under each session: a soft oval in a lighter shade of its color.
export function rug(color) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 0.6, 48), mat(color, { roughness: 1 }))
  m.scale.z = 0.82
  m.position.y = FLOOR_TOP + 0.3
  m.receiveShadow = true
  return m
}

// ---------------------------------------------------------------------------
// A desk behind each session: a wooden top, a keyboard, a mug in the
// session's color, and a monitor facing you. The screen is drawn on a small
// canvas, scrolling lines of code while the session works and dimming when
// it waits. Built at world scale, centered on its group, front at +z.

const SYNTAX = ['#7cc4ff', '#f6a6c1', '#ffd479', '#a7e3a1', '#c9b6ff', '#e8e2d6']

export function desk(colors, tint) {
  const g = new THREE.Group()
  const wood = mat(colors.woodDark)
  const top = new THREE.Mesh(rounded(58, 2.6, 22, 0.8), mat(colors.desk))
  top.position.y = 17
  g.add(top)
  for (const x of [-26, 26]) {
    const leg = new THREE.Mesh(rounded(3, 16, 18, 0.6), wood)
    leg.position.set(x, 8, 0)
    g.add(leg)
  }
  const bezel = mat('#2b2a2e', { roughness: 0.5 })
  const stand = new THREE.Mesh(rounded(3, 6, 3, 0.6), bezel)
  stand.position.set(0, 21, -5)
  const foot = new THREE.Mesh(rounded(11, 1, 7, 0.4), bezel)
  foot.position.set(0, 18.8, -5)
  const frame = new THREE.Mesh(rounded(34, 21, 2, 1), bezel)
  frame.position.set(0, 34, -5)
  g.add(stand, foot, frame)

  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 96
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  // Unlit, so the screen glows whatever the room's light.
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(31, 18), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
  screen.position.set(0, 34, -3.9)
  g.add(screen)

  const keyboard = new THREE.Mesh(rounded(18, 1, 6, 0.4), mat(colors.trim))
  keyboard.position.set(-3, 18.8, 5)
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2, 4.4, 16), mat(tint))
  mug.position.set(20, 20.6, 4)
  g.add(keyboard, mug)
  shadowed(g)
  screen.castShadow = screen.receiveShadow = false

  const ctx = canvas.getContext('2d')
  const lines = Array.from({ length: 40 }, (_, i) => ({
    indent: [0, 1, 2, 1, 2, 3, 1, 0][i % 8] * 10,
    parts: Array.from({ length: 1 + ((i * 7) % 4) }, (_, j) => ({ w: 8 + ((i * 13 + j * 29) % 36), c: SYNTAX[(i + j * 3) % SYNTAX.length] })),
  }))
  let scroll = 0
  let lastDraw = -1
  let lastState = ''
  // `state` is 'busy', 'idle' or 'off'; busy screens scroll.
  function draw(t, state, accent) {
    if (state !== 'busy' && state === lastState) return
    if (state === 'busy' && t - lastDraw < 0.12) return
    lastDraw = t
    lastState = state
    ctx.fillStyle = state === 'off' ? '#141416' : '#1f2433'
    ctx.fillRect(0, 0, 160, 96)
    if (state === 'off') { texture.needsUpdate = true; return }
    ctx.fillStyle = accent
    ctx.fillRect(0, 0, 160, 7)
    ctx.globalAlpha = state === 'busy' ? 1 : 0.55
    if (state === 'busy') scroll = (scroll + 1) % lines.length
    for (let row = 0; row < 9; row++) {
      const line = lines[(row + scroll) % lines.length]
      let x = 8 + line.indent
      for (const part of line.parts) {
        ctx.fillStyle = part.c
        ctx.fillRect(x, 13 + row * 9, part.w, 4)
        x += part.w + 4
      }
    }
    if (state === 'busy' && Math.floor(t * 3) % 2) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(8, 13 + 8 * 9, 5, 5)
    }
    ctx.globalAlpha = 1
    texture.needsUpdate = true
  }
  // Two wisps over the mug while the session works.
  const wisps = [0, 0.5].map(offset => {
    const p = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 10), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }))
    p.userData.offset = offset
    g.add(p)
    return p
  })
  function steam(t, on) {
    for (const p of wisps) {
      const k = (t * 0.5 + p.userData.offset) % 1
      p.position.set(20 + Math.sin(k * 7 + p.userData.offset * 5), 23 + k * 10, 4)
      p.scale.setScalar(0.6 + k)
      p.material.opacity = on ? 0.5 * (1 - k) * Math.min(1, k * 5) : 0
    }
  }
  return { group: g, draw, steam, mug }
}

// ---------------------------------------------------------------------------
// The coffee corner: a counter with a coffee machine (steaming), mugs and a
// fridge, and a little round table with stools. One for the whole floor.

export const COFFEE_W = 180
export const COFFEE_D = 150

export function coffeeCorner(colors) {
  const g = new THREE.Group()
  const rand = seeded('coffee')
  const tiles = new THREE.Mesh(rounded(COFFEE_W, 1.4, COFFEE_D, 0.6), floorMaterial(colors.tile, COFFEE_W, COFFEE_D, 'checker'))
  tiles.position.y = 0.7
  tiles.receiveShadow = true
  g.add(tiles)

  const back = -COFFEE_D / 2 + 14
  const counter = new THREE.Mesh(rounded(120, 22, 24, 1), mat(colors.counter))
  counter.position.set(-25, 11, back)
  const worktop = new THREE.Mesh(rounded(124, 2.4, 26, 0.6), mat(colors.woodDark))
  worktop.position.set(-25, 23, back)
  g.add(counter, worktop)
  for (const x of [-70, -40, -10, 20]) {
    const handle = new THREE.Mesh(rounded(6, 1, 1, 0.3), mat(colors.trim))
    handle.position.set(x, 18, back + 12.4)
    g.add(handle)
  }

  // The machine: a body, a spout, a red light, a cup waiting under it.
  const machine = new THREE.Group()
  const body = new THREE.Mesh(rounded(20, 24, 15, 2), mat('#3a3633', { roughness: 0.4 }))
  body.position.y = 12
  const hood = new THREE.Mesh(rounded(20, 4, 18, 1), mat('#4a4541'))
  hood.position.set(0, 23, 1.5)
  const light = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), new THREE.MeshBasicMaterial({ color: '#ff6a4d' }))
  light.position.set(6, 17, 7.6)
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2, 4.4, 16), mat(colors.trim))
  cup.position.set(-2, 3, 8.5)
  machine.add(body, hood, light, cup)
  machine.position.set(-55, 24.2, back - 1)
  g.add(machine)

  // Mugs in every color, a jar and a kettle.
  colors.mugs.forEach((c, i) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2, 4.6, 14), mat(c))
    m.position.set(-28 + i * 6.5, 26.5, back + 5 - (i % 2) * 4)
    g.add(m)
  })
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 9, 18), mat(colors.window, { transparent: true, opacity: 0.75, roughness: 0.2 }))
  jar.position.set(18, 29, back - 2)
  g.add(jar)

  const fridge = new THREE.Mesh(rounded(28, 60, 24, 2), mat(colors.fridge))
  fridge.position.set(55, 30, back)
  const fhandle = new THREE.Mesh(rounded(1.6, 14, 1.6, 0.5), mat('#9a948c'))
  fhandle.position.set(44, 40, back + 12.6)
  g.add(fridge, fhandle)

  // A round table with stools, and a mug or two left on it.
  const table = new THREE.Group()
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 2.4, 32), mat(colors.desk))
  tableTop.position.y = 20
  const post = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 19, 10), mat(colors.woodDark))
  post.position.y = 10
  const base = new THREE.Mesh(new THREE.CylinderGeometry(8, 9, 1.4, 20), mat(colors.woodDark))
  base.position.y = 0.7
  table.add(tableTop, post, base)
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i - 1) * 1.6 + Math.PI
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(6, 5.4, 12, 18), mat(colors.mugs[(i * 2 + 1) % colors.mugs.length]))
    stool.position.set(Math.cos(a) * 28, 6, Math.sin(a) * 28)
    table.add(stool)
  }
  for (let i = 0; i < 2; i++) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2, 4.4, 14), mat(colors.mugs[(i * 3) % colors.mugs.length]))
    m.position.set(-6 + i * 11, 23.4, 3 - i * 6)
    table.add(m)
  }
  table.position.set(-10, 1.4, 38)
  g.add(table)

  const leafy = plant(colors, rand)
  leafy.scale.setScalar(PROP)
  leafy.position.set(COFFEE_W / 2 - 14, 1.4, COFFEE_D / 2 - 18)
  g.add(leafy)
  shadowed(g)
  tiles.castShadow = false
  light.castShadow = false

  // Steam: a few soft puffs rising from the machine on a loop.
  const steamMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5, depthWrite: false })
  const puffs = Array.from({ length: 5 }, (_, i) => {
    const p = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 12), steamMat.clone())
    p.userData.offset = i / 5
    g.add(p)
    return p
  })
  const origin = new THREE.Vector3(-57, 24.2 + 27, back + 2)
  function animate(t) {
    for (const p of puffs) {
      const k = (t * 0.35 + p.userData.offset) % 1
      p.position.set(origin.x + Math.sin(k * 6 + p.userData.offset * 9) * 2.5, origin.y + k * 22, origin.z)
      p.scale.setScalar(0.6 + k * 1.4)
      p.material.opacity = 0.45 * (1 - k) * Math.min(1, k * 6)
    }
  }
  // Where a critter on its break can stand: around the table, then along
  // the counter. Local to the corner, on its floor.
  const spots = [
    ...[0.25, 1.0, 1.75, 2.5, -0.5, 3.4].map(a => new THREE.Vector3(-10 + Math.cos(a) * 38, 1.4, 38 + Math.sin(a) * 30)),
    ...[-62, -30, 2].map(x => new THREE.Vector3(x, 1.4, back + 34)),
  ]
  const tableAt = new THREE.Vector3(-10, 1.4, 38)
  return { group: g, animate, spots, tableAt }
}

// ---------------------------------------------------------------------------
// The office around everything: carpet tiles, an outer wall along the back
// and sides with a row of windows, plants in the corners and a water cooler.

const SHELL_H = 64

export function officeShell({ W, D, colors }) {
  const g = new THREE.Group()
  const carpet = new THREE.Mesh(new THREE.BoxGeometry(W, 0.4, D), floorMaterial(colors.carpet, W, D, 'carpet'))
  carpet.position.y = 0.2
  carpet.receiveShadow = true
  g.add(carpet)

  const wallMat = mat(colors.outerWall, { roughness: 0.95 })
  const trimMat = mat(colors.trim)
  const glass = glassMat
  const T = 5
  for (const [len, x, z, alongX] of [[W + T * 2, 0, -D / 2 - T / 2, true], [D, -W / 2 - T / 2, 0, false], [D, W / 2 + T / 2, 0, false]]) {
    const wall = new THREE.Mesh(alongX ? rounded(len, SHELL_H, T, 1) : rounded(T, SHELL_H, len, 1), wallMat)
    wall.position.set(x, SHELL_H / 2, z)
    wall.receiveShadow = wall.castShadow = true
    const cap = new THREE.Mesh(alongX ? rounded(len + 2, 2.4, T + 2, 0.6) : rounded(T + 2, 2.4, len + 2, 0.6), trimMat)
    cap.position.set(x, SHELL_H + 1, z)
    g.add(wall, cap)
  }
  // Tall windows along the back wall.
  const panes = Math.max(2, Math.floor(W / 110))
  for (let i = 0; i < panes; i++) {
    const x = -W / 2 + (W / panes) * (i + 0.5)
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(56, 36), glass)
    pane.position.set(x, 34, -D / 2 + 0.2)
    g.add(pane)
    for (const [fx, fy, fw, fh] of [[0, 52.5, 60, 2.4], [0, 15.5, 62, 3], [-29, 34, 2.4, 38], [29, 34, 2.4, 38], [0, 34, 1.6, 36]]) {
      const bar = new THREE.Mesh(rounded(fw, fh, 2, 0.4), trimMat)
      bar.position.set(x + fx, fy, -D / 2 + 1)
      g.add(bar)
    }
  }
  const rand = seeded('office')
  for (const [x, z] of [[-W / 2 + 18, -D / 2 + 18], [W / 2 - 18, -D / 2 + 18], [-W / 2 + 18, D / 2 - 18]]) {
    const p = plant(colors, rand)
    p.scale.setScalar(PROP * 1.3)
    p.position.set(x, 0.4, z)
    g.add(p)
  }
  // A water cooler by the right wall, near the front.
  const cooler = new THREE.Group()
  const stand = new THREE.Mesh(rounded(14, 26, 14, 1.5), mat(colors.fridge))
  stand.position.y = 13
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 16, 20), mat(colors.sky, { transparent: true, opacity: 0.7, roughness: 0.1 }))
  bottle.position.y = 34
  cooler.add(stand, bottle)
  cooler.position.set(W / 2 - 16, 0.4, D / 2 - 22)
  g.add(cooler)
  // A wall clock between the first two windows, showing your local time.
  const face = new THREE.Group()
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 1.6, 32), mat(colors.woodDark))
  rim.rotation.x = Math.PI / 2
  const dial = new THREE.Mesh(new THREE.CircleGeometry(7.8, 32), mat(colors.trim))
  dial.position.z = 0.9
  face.add(rim, dial)
  for (let i = 0; i < 12; i++) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.6, i % 3 ? 1 : 1.8, 0.2), mat('#2b2a2e'))
    const a = (i / 12) * Math.PI * 2
    tick.position.set(Math.sin(a) * 6.6, Math.cos(a) * 6.6, 1)
    tick.rotation.z = -a
    face.add(tick)
  }
  const hand = (len, width, color) => {
    const pivot = new THREE.Group()
    const bar = new THREE.Mesh(new THREE.BoxGeometry(width, len, 0.3), mat(color))
    bar.position.y = len / 2 - 0.6
    pivot.add(bar)
    pivot.position.z = 1.2
    face.add(pivot)
    return pivot
  }
  const hour = hand(4.4, 1, '#2b2a2e')
  const minute = hand(6.4, 0.6, '#2b2a2e')
  const second = hand(6.8, 0.25, '#e0573f')
  face.position.set(-W / 2 + W / panes, 46, -D / 2 + 1.2)
  g.add(face)

  shadowed(g)
  carpet.castShadow = false
  return { group: g, plants: plantsIn(g), clock: { hour, minute, second } }
}
