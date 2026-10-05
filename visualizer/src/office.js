// The office floor: each project gets a cozy room, cut away at the front
// like a dollhouse so you can look in. A wooden floor, three low walls in
// the room's own color, and a few things to make it lived in: a bookshelf,
// a window, a plant, a lamp, a picture. What a room holds is picked from
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

export function floorMaterial(color, w, d) {
  const map = plankTexture().clone()
  map.needsUpdate = true
  map.repeat.set(w / 90, d / 90)
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
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(3.4, 6, 7, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: colors.shade, emissive: colors.glow, emissiveIntensity: 0.55, side: THREE.DoubleSide, roughness: 0.6 }),
  )
  shade.position.y = 28
  g.add(base, pole, shade)
  shadowed(g)
  shade.castShadow = false
  return g
}

function windowPane(colors, w) {
  const g = new THREE.Group()
  const frame = mat(colors.trim)
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, 15), new THREE.MeshStandardMaterial({ color: colors.sky, emissive: colors.sky, emissiveIntensity: 0.35, roughness: 0.2 }))
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

  return { group: room, floor, wallMat }
}

// A rug under each session: a soft oval in a lighter shade of its color.
export function rug(color) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 0.6, 48), mat(color, { roughness: 1 }))
  m.scale.z = 0.82
  m.position.y = FLOOR_TOP + 0.3
  m.receiveShadow = true
  return m
}
