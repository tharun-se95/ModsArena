// The office: an open floor with carpet, windows and a coffee corner, and
// a cozy room for each project, cut away at the front like a dollhouse so
// you can look in. Each room has a wooden floor, three low walls in its own
// color, and a few things to make it lived in: a bookshelf, a window, a
// plant, a lamp, a picture. What a room holds is picked from
// its name, so the same project always looks the same.

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export const FLOOR_TOP = 2.4
export const WALL_H = 46
// Furniture is built at desk scale and enlarged to sit well beside the critters.
const PROP = 1.7
const WALL_T = 3

const rounded = (w, h, d, r = 0.8) => new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2))

// Surfaces are drawn once on canvases, in white and grays that each
// material's color tints. Each has a bump map from the same layout, so
// seams, grout and grain catch the light. Drawn large, and sampled with
// anisotropic filtering so the floor stays crisp at a glancing angle.
const ANISO = 16 // three clamps it to what the GPU allows

function canvasTexture(size, draw, color = true) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  draw(c.getContext('2d'), size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  t.anisotropy = ANISO
  return t
}

const gray = (v, a = 1) => `rgba(${v},${v},${v},${a})`

// Fine speckle, so flat color reads as a material up close.
function speckle(g, size, amount, rand) {
  const img = g.getImageData(0, 0, size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * amount
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  g.putImageData(img, 0, 0)
}

// Long grain lines with a slow wobble, drawn twice across the seam so the
// texture tiles.
function grain(g, x, y, w, h, rand, strength) {
  const lines = Math.round(h / 2.5)
  for (let i = 0; i < lines; i++) {
    const ly = y + rand() * h
    const amp = 0.6 + rand() * 2.2
    const freq = 0.004 + rand() * 0.012
    const phase = rand() * 10
    g.strokeStyle = gray(rand() < 0.5 ? 0 : 255, strength * (0.4 + rand()))
    g.lineWidth = 0.6 + rand() * 1.4
    g.beginPath()
    for (let px = 0; px <= w; px += 6) {
      const py = ly + Math.sin(px * freq + phase) * amp
      if (px === 0) g.moveTo(x + px, py)
      else g.lineTo(x + px, py)
    }
    g.stroke()
  }
}

// Planks in staggered rows, each a slightly different tone, with grain,
// the odd knot, and dark seams between them.
const PLANK_ROWS = 8
function plankLayout(size) {
  const rand = seeded('planks')
  const rowH = size / PLANK_ROWS
  const out = []
  for (let r = 0; r < PLANK_ROWS; r++) {
    let x = rand() * size
    const end = x + size
    while (x < end) {
      const len = Math.min(end - x, size * (0.3 + rand() * 0.4))
      out.push({ x, y: r * rowH, w: len, h: rowH, tone: 0.8 + rand() * 0.2, knot: rand() < 0.25 ? [rand(), rand()] : null, seed: rand() })
      x += len
    }
  }
  return out
}

function drawPlanks(g, size, bump) {
  const planks = plankLayout(size)
  g.fillStyle = gray(bump ? 128 : 255)
  g.fillRect(0, 0, size, size)
  for (const p of planks) {
    for (const dx of [0, -size]) {
      const x = p.x + dx
      if (x + p.w < 0 || x > size) continue
      const rand = seeded(p.seed)
      g.save()
      g.beginPath()
      g.rect(x, p.y, p.w, p.h)
      g.clip()
      if (!bump) {
        g.fillStyle = gray(Math.round(255 * p.tone))
        g.fillRect(x, p.y, p.w, p.h)
      }
      grain(g, x, p.y, p.w, p.h, rand, bump ? 0.2 : 0.13)
      if (p.knot) {
        const kx = x + p.knot[0] * p.w, ky = p.y + 0.2 * p.h + p.knot[1] * 0.6 * p.h
        for (let i = 4; i > 0; i--) {
          g.strokeStyle = gray(0, bump ? 0.18 : 0.08)
          g.lineWidth = 1.2
          g.beginPath()
          g.ellipse(kx, ky, i * 5, i * 2, 0, 0, Math.PI * 2)
          g.stroke()
        }
      }
      g.restore()
      // The seam at the plank's end, and along the top of the row.
      g.fillStyle = gray(0, bump ? 0.9 : 0.28)
      g.fillRect(x - 1, p.y, 2, p.h)
      g.fillRect(x, p.y, p.w, 2)
      if (!bump) {
        g.fillStyle = gray(255, 0.25)
        g.fillRect(x, p.y + 2, p.w, 1)
      }
    }
  }
  if (!bump) speckle(g, size, 6, seeded('planks-speckle'))
}

// Carpet tiles: a soft fiber noise, alternate tiles a shade apart, and
// fine seams.
function drawCarpet(g, size, bump) {
  const half = size / 2
  g.fillStyle = gray(bump ? 128 : 255)
  g.fillRect(0, 0, size, size)
  if (!bump) {
    g.fillStyle = gray(0, 0.035)
    g.fillRect(0, 0, half, half)
    g.fillRect(half, half, half, half)
  }
  speckle(g, size, bump ? 70 : 16, seeded('carpet'))
  g.fillStyle = gray(0, bump ? 0.7 : 0.1)
  for (const v of [0, half]) { g.fillRect(v, 0, 2, size); g.fillRect(0, v, size, 2) }
}

// Kitchen tiles: a glazed checkerboard with grout lines.
function drawChecker(g, size, bump) {
  const half = size / 2
  g.fillStyle = gray(bump ? 160 : 255)
  g.fillRect(0, 0, size, size)
  if (!bump) {
    g.fillStyle = gray(0, 0.14)
    g.fillRect(0, 0, half, half)
    g.fillRect(half, half, half, half)
    speckle(g, size, 5, seeded('checker'))
  }
  g.fillStyle = bump ? gray(0) : gray(120, 0.55)
  for (const v of [0, half]) { g.fillRect(v - 3, 0, 6, size); g.fillRect(0, v - 3, size, 6) }
}

// Grain alone, for furniture.
function drawWood(g, size, bump) {
  g.fillStyle = gray(bump ? 128 : 255)
  g.fillRect(0, 0, size, size)
  grain(g, 0, 0, size, size, seeded('wood'), bump ? 0.16 : 0.1)
  if (!bump) speckle(g, size, 5, seeded('wood-speckle'))
}

// A soft weave for upholstery.
function drawFabric(g, size, bump) {
  g.fillStyle = gray(bump ? 128 : 255)
  g.fillRect(0, 0, size, size)
  for (let i = 0; i < size; i += 4) {
    g.fillStyle = gray(0, bump ? 0.25 : 0.035)
    g.fillRect(i, 0, 1, size)
    g.fillRect(0, i, size, 1)
  }
  speckle(g, size, bump ? 40 : 10, seeded('fabric'))
}

const SURFACES = {
  planks: { draw: drawPlanks, size: 1024, unit: 72, roughness: 0.5, bump: 2.5 },
  carpet: { draw: drawCarpet, size: 512, unit: 70, roughness: 0.95, bump: 0.6 },
  checker: { draw: drawChecker, size: 512, unit: 40, roughness: 0.3, bump: 1.5 },
  wood: { draw: drawWood, size: 512, unit: 0, roughness: 0.5, bump: 0.5 },
  fabric: { draw: drawFabric, size: 256, unit: 0, roughness: 0.9, bump: 0.6 },
}
const drawn = {}
function surface(kind) {
  if (!drawn[kind]) {
    const { draw, size } = SURFACES[kind]
    drawn[kind] = { map: canvasTexture(size, (g, n) => draw(g, n, false)), bump: canvasTexture(size, (g, n) => draw(g, n, true), false) }
  }
  return drawn[kind]
}

export function floorMaterial(color, w, d, pattern = 'planks') {
  const { unit, roughness, bump } = SURFACES[pattern]
  const t = surface(pattern)
  const map = t.map.clone()
  const bumpMap = t.bump.clone()
  for (const m of [map, bumpMap]) {
    m.repeat.set(w / unit, d / unit)
    m.needsUpdate = true
  }
  return new THREE.MeshStandardMaterial({ color, map, bumpMap, bumpScale: bump, roughness })
}

// Wood and upholstery share one texture each, so pieces in the same color
// still merge in bake().
function surfaceMat(kind, color, extra = {}) {
  const { roughness, bump } = SURFACES[kind]
  const t = surface(kind)
  return new THREE.MeshStandardMaterial({ color, map: t.map, bumpMap: t.bump, bumpScale: bump, roughness, ...extra })
}
const woodMat = color => surfaceMat('wood', color)
const fabricMat = color => surfaceMat('fabric', color)

// Soft shade on the floor where it meets a wall, the way a real corner
// gathers shadow. Each strip is a flat gradient, dark against the wall and
// clear a little way out, in one mesh per piece so it costs one draw.
let fade = null
function fadeTexture() {
  if (fade) return fade
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 64
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 64)
  grad.addColorStop(0, '#fff')
  grad.addColorStop(0.35, '#6a6a6a')
  grad.addColorStop(1, '#000')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 64)
  fade = new THREE.CanvasTexture(c)
  return fade
}

// `strips` are [length, width, x, z, toward], `toward` the side the wall is
// on: 'back' (-z), 'front' (+z), 'left' (-x) or 'right' (+x).
const TOWARD = { back: 0, left: Math.PI / 2, right: -Math.PI / 2, front: Math.PI }
function cornerShade(strips, y, opacity) {
  const geos = strips.map(([len, width, x, z, toward]) =>
    new THREE.PlaneGeometry(len, width).rotateX(-Math.PI / 2).rotateY(TOWARD[toward]).translate(x, y, z))
  const m = new THREE.Mesh(mergeGeometries(geos), new THREE.MeshBasicMaterial({ color: '#000', alphaMap: fadeTexture(), transparent: true, opacity, depthWrite: false }))
  for (const g of geos) g.dispose()
  return m
}

// Walls shade a little darker toward the floor, the way a corner gathers
// shadow, so they don't read as flat cards.
function shadeUp(geo, height) {
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const k = THREE.MathUtils.smoothstep(pos.getY(i) / height + 0.5, 0, 0.55)
    colors.fill(0.74 + 0.26 * k, i * 3, i * 3 + 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geo
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

// Every mesh costs a draw call each frame, and another for the shadow, so
// a full office of books, bars and table legs adds up to thousands. Once a
// piece is built, its still parts are merged into one mesh per look; `keep`
// holds the parts that move or get repainted, which stay as they are.
const SHARED = new Set([glassMat, lampMat])
const look = (o, m) => `${SHARED.has(m) ? m.uuid : `${m.type}|${m.color?.getHex()}|${m.emissive?.getHex()}|${m.emissiveIntensity}|${m.roughness}|${m.metalness}|${m.side}|${m.map?.uuid}|${m.bumpMap?.uuid}|${m.vertexColors}`}|${o.castShadow}|${o.receiveShadow}`

export function bake(root, keep = []) {
  root.updateMatrixWorld(true)
  const inverse = root.matrixWorld.clone().invert()
  const kept = new Set()
  for (const k of keep) k.traverse(o => kept.add(o))
  const looks = new Map()
  root.traverse(o => {
    if (!o.isMesh || kept.has(o) || o === root || o.children.length || Array.isArray(o.material) || o.material.transparent) return
    if (o.matrixWorld.determinant() < 0) return
    const key = look(o, o.material)
    if (!looks.has(key)) looks.set(key, [])
    looks.get(key).push(o)
  })
  for (const meshes of looks.values()) {
    if (meshes.length < 2) continue
    const geos = meshes.map(o => {
      const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()
      g.clearGroups()
      return g.applyMatrix4(inverse.clone().multiply(o.matrixWorld))
    })
    const names = Object.keys(geos[0].attributes).filter(n => geos.every(g => g.attributes[n]))
    for (const g of geos) for (const n of Object.keys(g.attributes)) if (!names.includes(n)) g.deleteAttribute(n)
    const merged = mergeGeometries(geos)
    for (const g of geos) g.dispose()
    if (!merged) continue
    const first = meshes[0]
    const one = new THREE.Mesh(merged, first.material)
    one.castShadow = first.castShadow
    one.receiveShadow = first.receiveShadow
    for (const o of meshes) o.removeFromParent()
    root.add(one)
  }
  return root
}

// ---------------------------------------------------------------------------
// Props, each standing on the floor at y = 0 of its own group.

function bookshelf(colors, rand) {
  const g = new THREE.Group()
  const wood = woodMat(colors.woodDark)
  const frame = new THREE.Mesh(rounded(44, 30, 11, 1), wood)
  frame.position.y = 15
  g.add(frame)
  for (const y of [4, 15.5]) {
    let x = -19
    while (x < 17) {
      const w = 2.2 + rand() * 2.2
      const h = 7 + rand() * 3
      const book = new THREE.Mesh(rounded(w, h, 7.5, 0.4), mat(colors.books[Math.floor(rand() * colors.books.length)], { roughness: 0.55 }))
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
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(5, 3.8, 8, 28), mat(colors.pot, { roughness: 0.35 }))
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
  return bake(shadowed(g))
}

function lamp(colors) {
  const g = new THREE.Group()
  const metal = mat(colors.woodDark, { roughness: 0.3, metalness: 0.6 })
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4, 1.2, 28), metal)
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
  const frame = mat(colors.trim, { roughness: 0.4 })
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
  const frame = new THREE.Mesh(rounded(14, 11, 1, 0.3), woodMat(colors.woodDark))
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
  const fabric = fabricMat(colors.books[Math.floor(rand() * colors.books.length)])
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

  const wallMat = mat(colors.wall, { roughness: 0.85, vertexColors: true })
  const trimMat = mat(colors.trim, { roughness: 0.4 })
  const walls = [
    [w + WALL_T * 2, 0, -d / 2 - WALL_T / 2, 'back'],
    [d, -w / 2 - WALL_T / 2, 0, 'side'],
    [d, w / 2 + WALL_T / 2, 0, 'side'],
  ]
  for (const [len, x, z, kind] of walls) {
    const geo = shadeUp(kind === 'back' ? rounded(len, WALL_H, WALL_T, 0.6) : rounded(WALL_T, WALL_H, len, 0.6), WALL_H)
    const wall = new THREE.Mesh(geo, wallMat)
    wall.position.set(x, WALL_H / 2, z)
    wall.castShadow = wall.receiveShadow = true
    const cap = new THREE.Mesh(kind === 'back' ? rounded(len + 1, 1.6, WALL_T + 1.2, 0.4) : rounded(WALL_T + 1.2, 1.6, len + 1, 0.4), trimMat)
    cap.position.set(x, WALL_H + 0.6, z)
    // A touch longer than its wall, so their ends never share a plane and
    // flicker where the room is cut open at the front.
    const skirting = new THREE.Mesh(kind === 'back' ? rounded(len + 0.6, 2.4, WALL_T + 0.8, 0.3) : rounded(WALL_T + 0.8, 2.4, len + 0.6, 0.3), trimMat)
    skirting.position.set(x, FLOOR_TOP + 1.2, z)
    room.add(wall, cap, skirting)
  }

  const IN = 16, OUT = 14, T = WALL_T
  room.add(
    cornerShade([
      [w, IN, 0, -d / 2 + IN / 2, 'back'],
      [d, IN, -w / 2 + IN / 2, 0, 'left'],
      [d, IN, w / 2 - IN / 2, 0, 'right'],
    ], FLOOR_TOP + 0.08, 0.32),
    cornerShade([
      [w + 2 * T, OUT, 0, -d / 2 - T - OUT / 2, 'front'],
      [w, OUT, 0, d / 2 + OUT / 2, 'back'],
      [d + T, OUT, -w / 2 - T - OUT / 2, -T / 2, 'right'],
      [d + T, OUT, w / 2 + T + OUT / 2, -T / 2, 'left'],
    ], 0.48, 0.22),
  )

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

  const plants = plantsIn(room)
  bake(room, plants)
  return { group: room, floor, wallMat, plants }
}

const plantsIn = group => {
  const out = []
  group.traverse(o => { if (o.userData.plant !== undefined) out.push(o) })
  return out
}

// A rug under each session: a soft oval in a lighter shade of its color.
export function rug(color) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 0.6, 64), fabricMat(color))
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
  const wood = woodMat(colors.woodDark)
  const top = new THREE.Mesh(rounded(58, 2.6, 22, 0.8), woodMat(colors.desk))
  top.position.y = 17
  g.add(top)
  for (const x of [-26, 26]) {
    const leg = new THREE.Mesh(rounded(3, 16, 18, 0.6), wood)
    leg.position.set(x, 8, 0)
    g.add(leg)
  }
  const bezel = mat('#2b2a2e', { roughness: 0.3, metalness: 0.4 })
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

  const keyboard = new THREE.Mesh(rounded(18, 1, 6, 0.4), mat(colors.trim, { roughness: 0.45 }))
  keyboard.position.set(-3, 18.8, 5)
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2, 4.4, 24), mat(tint, { roughness: 0.25 }))
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
  // What the screen shows instead of code for a while: a picture the
  // session just made, or a big "?" while it waits on your answer.
  let shown = null // { img, until } or { ask, color }
  function showImage(img, until) {
    shown = { img, until }
    lastState = ''
  }
  function showAsk(kind, color) {
    const key = kind ? `${kind}|${color}` : null
    if ((shown?.askKey ?? null) === key && !(shown?.img)) return
    if (shown?.img && !kind) return
    shown = kind ? { ask: kind, color, askKey: key } : null
    lastState = ''
  }
  function drawShown(t) {
    if (shown.img) {
      ctx.fillStyle = '#1f2433'
      ctx.fillRect(0, 0, 160, 96)
      const { img } = shown
      const k = Math.min(160 / img.width, 96 / img.height)
      ctx.drawImage(img, (160 - img.width * k) / 2, (96 - img.height * k) / 2, img.width * k, img.height * k)
    } else {
      ctx.fillStyle = shown.color
      ctx.fillRect(0, 0, 160, 96)
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 64px Georgia, serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const wobble = Math.sin(t * 3) * 3
      ctx.fillText(shown.ask === 'permission' ? '>_' : shown.ask === 'plan' ? '✎' : '?', 80, 50 + wobble)
    }
    texture.needsUpdate = true
  }
  // `state` is 'busy', 'idle' or 'off'; busy screens scroll.
  function draw(t, state, accent) {
    if (shown?.img && t > shown.until) { shown = null; lastState = '' }
    if (shown && state !== 'off') {
      if (t - lastDraw < 0.1) return
      lastDraw = t
      drawShown(t)
      return
    }
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
  // A picture frame by the monitor holds the latest picture the session
  // made; an outbox tray on the other side stacks what it delivered.
  const photoCanvas = document.createElement('canvas')
  photoCanvas.width = 128
  photoCanvas.height = 84
  const photoTex = new THREE.CanvasTexture(photoCanvas)
  photoTex.colorSpace = THREE.SRGBColorSpace
  const photo = new THREE.Group()
  const photoBack = new THREE.Mesh(rounded(13, 9.4, 1, 0.4), mat(colors.trim, { roughness: 0.5 }))
  const photoFace = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 8), new THREE.MeshBasicMaterial({ map: photoTex, toneMapped: false }))
  photoFace.position.z = 0.55
  photo.add(photoBack, photoFace)
  photo.position.set(-22, 23.6, 1)
  photo.rotation.set(-0.18, 0.3, 0)
  photo.visible = false
  g.add(photo)
  function setPhoto(img) {
    const pc = photoCanvas.getContext('2d')
    const k = Math.max(128 / img.width, 84 / img.height)
    pc.drawImage(img, (128 - img.width * k) / 2, (84 - img.height * k) / 2, img.width * k, img.height * k)
    photoTex.needsUpdate = true
    photo.visible = true
  }
  const tray = new THREE.Group()
  const trayBase = new THREE.Mesh(rounded(11, 1.6, 8, 0.4), mat(colors.woodDark, { roughness: 0.6 }))
  trayBase.position.y = 0.8
  tray.add(trayBase)
  tray.position.set(21, 18.3, -5)
  tray.visible = false
  g.add(tray)
  const sheets = []
  // `colors` of what was delivered, newest last: one sheet each, up to six.
  function setTray(list) {
    for (const m of sheets) { tray.remove(m); m.material.dispose() }
    sheets.length = 0
    list.slice(-6).forEach((color, i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(9, 0.45, 6.4), new THREE.MeshStandardMaterial({ color, roughness: 0.8 }))
      m.position.set((i % 2 ? 0.4 : -0.3), 1.9 + i * 0.5, (i % 3) * 0.2)
      m.rotation.y = ((i * 37) % 9 - 4) * 0.03
      m.castShadow = true
      tray.add(m)
      sheets.push(m)
    })
    tray.visible = list.length > 0
  }
  shadowed(photo)
  photoFace.castShadow = photoFace.receiveShadow = false
  bake(g, [screen, mug, ...wisps, photo, tray])
  return { group: g, draw, steam, mug, showImage, showAsk, setPhoto, setTray }
}

// ---------------------------------------------------------------------------
// The checklist easel: a small whiteboard on a stand beside a session's
// desk, its rows ticked off as the session works through them.

export function easel(colors) {
  const g = new THREE.Group()
  const wood = mat(colors.woodDark, { roughness: 0.6 })
  for (const x of [-9, 9]) {
    const leg = new THREE.Mesh(rounded(1.6, 44, 1.6, 0.5), wood)
    leg.position.set(x, 22, 0)
    leg.rotation.z = x < 0 ? 0.06 : -0.06
    g.add(leg)
  }
  const back = new THREE.Mesh(rounded(1.4, 40, 1.4, 0.5), wood)
  back.position.set(0, 20, -6)
  back.rotation.x = -0.28
  g.add(back)
  const frame = new THREE.Mesh(rounded(26, 30, 1.6, 0.8), mat(colors.trim, { roughness: 0.4 }))
  frame.position.set(0, 30, 0.6)
  g.add(frame)
  const ledge = new THREE.Mesh(rounded(24, 1.2, 3, 0.4), wood)
  ledge.position.set(0, 14.6, 1.6)
  const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5, 10), mat('#b85c3c'))
  marker.rotation.z = Math.PI / 2
  marker.position.set(5, 15.6, 1.8)
  g.add(ledge, marker)
  const canvas = document.createElement('canvas')
  canvas.width = 192
  canvas.height = 224
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  const board = new THREE.Mesh(new THREE.PlaneGeometry(24, 28), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
  board.position.set(0, 30, 1.45)
  g.add(board)
  shadowed(g)
  board.castShadow = board.receiveShadow = false
  const ctx = canvas.getContext('2d')
  let key = ''
  // `items` as TodoWrite gives them; `accent` the session's own color.
  function draw(items, accent, t) {
    const now = items.findIndex(i => i.status === 'in_progress')
    const blink = now >= 0 && Math.floor(t * 2) % 2
    const k = `${items.map(i => i.status + i.text).join('|')}|${accent}|${blink}`
    if (k === key) return
    key = k
    ctx.fillStyle = '#fdfcf8'
    ctx.fillRect(0, 0, 192, 224)
    const done = items.filter(i => i.status === 'completed').length
    ctx.fillStyle = '#2b2a2e'
    ctx.font = '600 19px Georgia, serif'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('To do', 12, 28)
    ctx.font = '500 15px ui-monospace, Menlo, monospace'
    ctx.fillStyle = '#8a8378'
    ctx.textAlign = 'right'
    ctx.fillText(`${done}/${items.length}`, 180, 28)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#e6dfd3'
    ctx.fillRect(12, 38, 168, 6)
    ctx.fillStyle = '#5f8a68'
    ctx.fillRect(12, 38, 168 * (items.length ? done / items.length : 0), 6)
    items.slice(0, 6).forEach((item, i) => {
      const y = 70 + i * 26
      const isDone = item.status === 'completed'
      const isNow = item.status === 'in_progress'
      ctx.strokeStyle = isDone ? '#5f8a68' : isNow ? accent : '#b8afa2'
      ctx.lineWidth = 2.5
      ctx.strokeRect(12, y - 13, 15, 15)
      if (isDone) {
        ctx.beginPath()
        ctx.moveTo(14, y - 6); ctx.lineTo(19, y - 1); ctx.lineTo(27, y - 14)
        ctx.stroke()
      } else if (isNow && blink) {
        ctx.fillStyle = accent
        ctx.fillRect(16, y - 9, 7, 7)
      }
      ctx.font = `${isNow ? 600 : 400} 15px -apple-system, "Segoe UI", sans-serif`
      ctx.fillStyle = isDone ? '#a39b90' : '#2b2a2e'
      let text = item.text
      while (ctx.measureText(text).width > 146 && text.length > 4) text = `${text.slice(0, -2)}…`.replace(/……$/, '…')
      ctx.fillText(text, 34, y)
      if (isDone) {
        ctx.strokeStyle = '#a39b90'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(34, y - 5); ctx.lineTo(34 + ctx.measureText(text).width, y - 5)
        ctx.stroke()
      }
    })
    texture.needsUpdate = true
  }
  bake(g, [board])
  return { group: g, draw }
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
  const counter = new THREE.Mesh(rounded(120, 22, 24, 1), mat(colors.counter, { roughness: 0.45 }))
  counter.position.set(-25, 11, back)
  const worktop = new THREE.Mesh(rounded(124, 2.4, 26, 0.6), woodMat(colors.woodDark))
  worktop.position.set(-25, 23, back)
  g.add(counter, worktop)
  for (const x of [-70, -40, -10, 20]) {
    const handle = new THREE.Mesh(rounded(6, 1, 1, 0.3), mat(colors.trim, { roughness: 0.25, metalness: 0.7 }))
    handle.position.set(x, 18, back + 12.4)
    g.add(handle)
  }

  // The machine: a body, a spout, a red light, a cup waiting under it.
  const machine = new THREE.Group()
  const body = new THREE.Mesh(rounded(20, 24, 15, 2), mat('#3a3633', { roughness: 0.25, metalness: 0.5 }))
  body.position.y = 12
  const hood = new THREE.Mesh(rounded(20, 4, 18, 1), mat('#4a4541', { roughness: 0.25, metalness: 0.6 }))
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
    const m = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2, 4.6, 24), mat(c, { roughness: 0.25 }))
    m.position.set(-28 + i * 6.5, 26.5, back + 5 - (i % 2) * 4)
    g.add(m)
  })
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 9, 18), mat(colors.window, { transparent: true, opacity: 0.75, roughness: 0.2 }))
  jar.position.set(18, 29, back - 2)
  g.add(jar)

  const fridge = new THREE.Mesh(rounded(28, 60, 24, 2), mat(colors.fridge, { roughness: 0.3 }))
  fridge.position.set(55, 30, back)
  const fhandle = new THREE.Mesh(rounded(1.6, 14, 1.6, 0.5), mat('#9a948c', { roughness: 0.2, metalness: 0.8 }))
  fhandle.position.set(44, 40, back + 12.6)
  g.add(fridge, fhandle)

  // A round table with stools, and a mug or two left on it.
  const table = new THREE.Group()
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 2.4, 48), woodMat(colors.desk))
  tableTop.position.y = 20
  const post = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 19, 16), woodMat(colors.woodDark))
  post.position.y = 10
  const base = new THREE.Mesh(new THREE.CylinderGeometry(8, 9, 1.4, 32), woodMat(colors.woodDark))
  base.position.y = 0.7
  table.add(tableTop, post, base)
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i - 1) * 1.6 + Math.PI
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(6, 5.4, 12, 28), fabricMat(colors.mugs[(i * 2 + 1) % colors.mugs.length]))
    stool.position.set(Math.cos(a) * 28, 6, Math.sin(a) * 28)
    table.add(stool)
  }
  for (let i = 0; i < 2; i++) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2, 4.4, 24), mat(colors.mugs[(i * 3) % colors.mugs.length], { roughness: 0.25 }))
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
  bake(g, puffs)
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

  const wallMat = mat(colors.outerWall, { roughness: 0.9, vertexColors: true })
  const trimMat = mat(colors.trim, { roughness: 0.4 })
  const glass = glassMat
  const T = 5
  for (const [len, x, z, alongX] of [[W + T * 2, 0, -D / 2 - T / 2, true], [D, -W / 2 - T / 2, 0, false], [D, W / 2 + T / 2, 0, false]]) {
    const wall = new THREE.Mesh(shadeUp(alongX ? rounded(len, SHELL_H, T, 1) : rounded(T, SHELL_H, len, 1), SHELL_H), wallMat)
    wall.position.set(x, SHELL_H / 2, z)
    wall.receiveShadow = wall.castShadow = true
    const cap = new THREE.Mesh(alongX ? rounded(len + 2, 2.4, T + 2, 0.6) : rounded(T + 2, 2.4, len + 2, 0.6), trimMat)
    cap.position.set(x, SHELL_H + 1, z)
    g.add(wall, cap)
  }
  const S = 30
  g.add(cornerShade([
    [W, S, 0, -D / 2 + S / 2, 'back'],
    [D, S, -W / 2 + S / 2, 0, 'left'],
    [D, S, W / 2 - S / 2, 0, 'right'],
  ], 0.45, 0.28))
  // Tall windows along the back wall.
  const panes = Math.max(2, Math.floor(W / 110))
  for (let i = 0; i < panes; i++) {
    const x = -W / 2 + (W / panes) * (i + 0.5)
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(56, 36), glass)
    // Clear of the wall, so the two never fight over which is in front.
    pane.position.set(x, 34, -D / 2 + 0.8)
    g.add(pane)
    for (const [fx, fy, fw, fh] of [[0, 52.5, 60, 2.4], [0, 15.5, 62, 3], [-29, 34, 2.4, 38], [29, 34, 2.4, 38], [0, 34, 1.6, 36]]) {
      const bar = new THREE.Mesh(rounded(fw, fh, 2, 0.4), trimMat)
      bar.position.set(x + fx, fy, -D / 2 + 1.4)
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
  const stand = new THREE.Mesh(rounded(14, 26, 14, 1.5), mat(colors.fridge, { roughness: 0.3 }))
  stand.position.y = 13
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 16, 20), mat(colors.sky, { transparent: true, opacity: 0.7, roughness: 0.1 }))
  bottle.position.y = 34
  cooler.add(stand, bottle)
  cooler.position.set(W / 2 - 16, 0.4, D / 2 - 22)
  g.add(cooler)
  // A wall clock between the first two windows, showing your local time.
  const face = new THREE.Group()
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 1.6, 48), woodMat(colors.woodDark))
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
  const plants = plantsIn(g)
  bake(g, [...plants, hour, minute, second])
  return { group: g, plants, clock: { hour, minute, second } }
}

// ---------------------------------------------------------------------------
// The front desk: a reception counter by the office's front door, where
// new work comes in. A curved counter with a service bell, a stack of job
// tickets and a little lamp, and a doormat where newcomers step in. Built
// around its own origin, the counter's front facing +z; `bell` rings.

export const FRONT_W = 96

export function frontDesk(colors) {
  const g = new THREE.Group()
  const rand = seeded('front desk')
  // The counter: a low body and a worktop, its ends turned back a little.
  const body = mat(colors.counter, { roughness: 0.45 })
  const top = woodMat(colors.woodDark)
  const pieces = [[0, 0, 64, 0], [-40, -9, 22, -0.55], [40, -9, 22, 0.55]]
  for (const [x, z, w, turn] of pieces) {
    const part = new THREE.Mesh(rounded(w, 24, 16, 1.2), body)
    part.position.set(x, 12, z)
    part.rotation.y = turn
    const slab = new THREE.Mesh(rounded(w + 3, 2.4, 19, 0.6), top)
    slab.position.set(x, 25.2, z - 1)
    slab.rotation.y = turn
    g.add(part, slab)
  }
  // A trim stripe along the front, in the office's accent.
  const stripe = new THREE.Mesh(rounded(60, 3, 1, 0.4), mat(colors.accent, { roughness: 0.5 }))
  stripe.position.set(0, 17, 8.2)
  g.add(stripe)
  // The bell, a stack of tickets and a lamp.
  const bell = new THREE.Group()
  const dome = new THREE.Mesh(new THREE.SphereGeometry(3.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat('#d9b25a', { roughness: 0.2, metalness: 0.85 }))
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(4, 4.2, 0.8, 20), mat('#2b2a2e', { roughness: 0.4 }))
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.8, 10, 10), mat('#d9b25a', { roughness: 0.2, metalness: 0.85 }))
  plate.position.y = 0.4
  dome.position.y = 0.8
  knob.position.y = 4.2
  bell.add(plate, dome, knob)
  bell.position.set(16, 26.4, 0)
  g.add(bell)
  colors.mugs.slice(0, 4).forEach((c, i) => {
    const card = new THREE.Mesh(rounded(9, 0.5, 6, 0.2), mat(i % 2 ? colors.trim : c, { roughness: 0.8 }))
    card.position.set(-8 + (rand() - 0.5), 26.6 + i * 0.6, 1 + (rand() - 0.5))
    card.rotation.y = (rand() - 0.5) * 0.5
    g.add(card)
  })
  const lamp = new THREE.Group()
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 8), mat('#2b2a2e'))
  stem.position.y = 5
  const shade = new THREE.Mesh(new THREE.ConeGeometry(4, 4.4, 20, 1, true), lampMat)
  shade.position.y = 11
  lamp.add(stem, shade)
  lamp.position.set(-28, 26.4, -4)
  g.add(lamp)
  const leafy = plant(colors, rand)
  leafy.scale.setScalar(PROP * 0.9)
  leafy.position.set(-62, 0.4, -6)
  g.add(leafy)
  shadowed(g)
  // The doormat by the door, to the counter's right, where newcomers step in.
  const mat_ = new THREE.Mesh(rounded(26, 0.6, 16, 0.4), fabricMat(colors.woodDark))
  mat_.position.set(FRONT_W / 2 + 26, 0.8, 14)
  mat_.receiveShadow = true
  g.add(mat_)
  const plants = plantsIn(g)
  bake(g, [bell, ...plants])
  return { group: g, bell, plants }
}
