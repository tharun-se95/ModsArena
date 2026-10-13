// The crab critter: a little robot crab after the Claude Bot mascot sheets.
// A cream pill of a shell with orange chips and a spark on its belly, a
// glossy black visor in a raised rim whose glowing eyes are its face, two
// big eyes on short black necks, chunky pincers up front and three
// segmented legs a side, every joint a black rubber ring. Built in the classic
// critters' unit space (feet at y = 0, facing +z) so the office could
// scale and place it the same way.
//
// The face is a small canvas drawn onto the visor, redrawn only when the
// expression changes (setFace). Each kind of helper wears a kit
// (crab-kits.js): a backpack, a beret, glasses or headphones.
//
// Cheap to have many of: every rigid part (a leg, an arm, a palm, a kit) is
// built once, merged into one geometry per material and shared by every
// crab, so a crab is about 35 draw calls, not 130. crabPose() breathes, blinks, taps its legs
// and clacks its claws.

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export const SHELL = '#f3dfc6'
export const ORANGE = '#ef6a2e'
const UNDER = '#e6cdb0'
const SEAM = '#cfb193'
const RUBBER = '#26221f'
const INK = '#0b0c10'
const GLOW = '#dff3ff'
const HALO = '#5cb6ff'

// The shell is a superellipsoid (rounder than a box, squarer than an egg):
// radii, the bottom a little flatter than the top, and how square.
const R = { x: 1.15, y: 0.84, z: 1.0 }
const R_LOW = 0.66
const N = 2.35
const CY = 0.86
const HIP_Y = 0.66 // how high the legs join the shell

// Where a direction from the shell's centre (a unit vector) meets its
// surface, and the outward normal there, both relative to the centre.
function shellAt(dx, dy, dz, P = new THREE.Vector3(), Nrm = new THREE.Vector3()) {
  const ry = dy < 0 ? R_LOW : R.y
  const k = (Math.abs(dx) ** N + Math.abs(dy) ** N + Math.abs(dz) ** N) ** (1 / N)
  P.set(dx / k * R.x, dy / k * ry, dz / k * R.z)
  const g = (p, r) => Math.sign(p) * Math.abs(p / r) ** (N - 1) / r
  Nrm.set(g(P.x, R.x), g(P.y, ry), g(P.z, R.z)).normalize()
  return P
}

// A sphere's grid (and its UVs) bent onto the shell, pushed out by `lift`.
function shellGeometry(sphere, lift = 0) {
  const pos = sphere.attributes.position, nor = sphere.attributes.normal
  const P = new THREE.Vector3(), Nrm = new THREE.Vector3(), D = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    D.fromBufferAttribute(pos, i).normalize()
    shellAt(D.x, D.y, D.z, P, Nrm)
    P.addScaledVector(Nrm, lift)
    pos.setXYZ(i, P.x, P.y, P.z)
    nor.setXYZ(i, Nrm.x, Nrm.y, Nrm.z)
  }
  return sphere
}

// The shell's top at (x, z), and its side at (y, z), from its centre.
const topAt = (x, z) => R.y * Math.max(0, 1 - Math.abs(x / R.x) ** N - Math.abs(z / R.z) ** N) ** (1 / N)
const sideAt = (y, z) => R.x * Math.max(0, 1 - Math.abs(y / (y < 0 ? R_LOW : R.y)) ** N - Math.abs(z / R.z) ** N) ** (1 / N)

// The visor's patch of the shell, in sphere angles (phi round from the
// side, pi / 2 straight ahead; theta down from the top).
const VISOR = { pw: 1.95, ph: 1.04, tc: 1.38 }
const dirAt = (phi, theta) => new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta))

export const FACES = ['happy', 'blink', 'think', 'focused', 'surprised', 'laugh', 'sleepy', 'sad', 'love']

// A tube along `points` whose radius runs r0 -> r1 (plus a mid bulge),
// capped with spheres: fingers, legs and stalks.
function taper(points, r0, r1, mat, { bulge = 0, radial = 12, seg = 10, caps = true } = {}) {
  const curve = points.length === 2 ? new THREE.LineCurve3(...points) : new THREE.CatmullRomCurve3(points)
  const geo = new THREE.TubeGeometry(curve, seg, 1, radial, false)
  const pos = geo.attributes.position
  const P = new THREE.Vector3(), V = new THREE.Vector3()
  for (let i = 0; i <= seg; i++) {
    const u = i / seg
    curve.getPointAt(u, P)
    const r = r0 + (r1 - r0) * u + bulge * Math.sin(u * Math.PI)
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j
      V.fromBufferAttribute(pos, k).sub(P).multiplyScalar(r).add(P)
      pos.setXYZ(k, V.x, V.y, V.z)
    }
  }
  geo.computeVertexNormals()
  const g = new THREE.Group()
  g.add(new THREE.Mesh(geo, mat))
  for (const [p, r] of caps ? [[points[0], r0], [points.at(-1), r1]] : []) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.99, radial, 6), mat)
    cap.position.copy(p)
    g.add(cap)
  }
  return g
}

function ball(r, mat, [x, y, z] = [0, 0, 0], [sx, sy, sz] = [1, 1, 1]) {
  // Small balls (joints, glints) need far fewer facets to look round.
  const m = new THREE.Mesh(r < 0.16 ? new THREE.SphereGeometry(r, 12, 8) : new THREE.SphereGeometry(r, 20, 14), mat)
  m.position.set(x, y, z)
  m.scale.set(sx, sy, sz)
  return m
}

const v = (x, y, z) => new THREE.Vector3(x, y, z)

// What kits are made of: the same for every crab, never tinted.
const std = o => { const m = new THREE.MeshStandardMaterial(o); m.userData.shared = true; return m }
const KIT = {
  leather: std({ color: '#86552f', roughness: 0.6 }),
  flap: std({ color: '#6c4325', roughness: 0.6 }),
  bedroll: std({ color: '#707046', roughness: 0.75 }),
  buckle: std({ color: '#d9c9a3', roughness: 0.35, metalness: 0.5 }),
  beret: std({ color: '#3f2d26', roughness: 0.85 }),
  frame: std({ color: '#2a201c', roughness: 0.35 }),
  lens: Object.assign(new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.12, depthWrite: false }), { userData: { shared: true } }),
  band: std({ color: '#3a2c26', roughness: 0.5 }),
  pad: std({ color: '#d8c3a5', roughness: 0.7 }),
}

// Rigid parts, built once: key -> [{ role, geometry }]. A part is built
// from meshes in the crab's own materials (`mats`) or the kit's; its
// meshes are merged into one geometry per material, so it's one draw call
// per material however many pieces it has, and every crab shares them.
const parts = new Map()
function baked(key, mats, build) {
  if (!parts.has(key)) {
    const g = build()
    g.updateMatrixWorld(true)
    const roleOf = m => Object.keys(mats).find(k => mats[k] === m) ?? `kit:${Object.keys(KIT).find(k => KIT[k] === m)}`
    const byRole = new Map()
    g.traverse(o => {
      if (!o.isMesh) return
      const copy = o.geometry.clone().applyMatrix4(o.matrixWorld)
      const role = roleOf(o.material)
      if (!byRole.has(role)) byRole.set(role, [])
      byRole.get(role).push(copy)
      o.geometry.dispose()
    })
    parts.set(key, [...byRole].map(([role, geos]) => {
      // Merging needs all indexed or none.
      const all = geos.some(x => !x.index) ? geos.map(x => (x.index ? x.toNonIndexed() : x)) : geos
      const merged = mergeGeometries(all)
      for (const x of geos) x.dispose()
      merged.userData.shared = true
      return { role, geometry: merged }
    }))
  }
  const out = new THREE.Group()
  for (const { role, geometry } of parts.get(key)) {
    out.add(new THREE.Mesh(geometry, role.startsWith('kit:') ? KIT[role.slice(4)] : mats[role]))
  }
  return out
}

// A small seeded random, so every crab wears the same speckles.
function rand(seed) {
  let s = seed >>> 0
  return () => ((s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x9e3779b9 >>> 0) / 4294967296)
}

// Eight rounded petals: the spark on its belly.
function spark(ctx, x, y, r, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = color
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4)
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.55, r * 0.16, r * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// The shell's skin, wrapped round the sphere's UVs, in two layers every
// crab shares: the cream base (darker underneath, with its seams) and the
// paint (orange chips over the top and sides, the spark low on the front,
// u = 0.25 facing +z), drawn white on clear so each crab tints it its own
// colour.
const SKIN_W = 1024, SKIN_H = 512
function canvasTexture(draw) {
  const c = document.createElement('canvas')
  c.width = SKIN_W
  c.height = SKIN_H
  draw(c.getContext('2d'), SKIN_W, SKIN_H)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.userData.shared = true
  return tex
}

let skin = null
function skins() {
  if (skin) return skin
  const base = canvasTexture((ctx, W, H) => {
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, SHELL)
    g.addColorStop(0.55, SHELL)
    g.addColorStop(1, UNDER)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    // Seams: one round the lower hull, one down the middle of the back.
    ctx.fillStyle = SEAM
    ctx.fillRect(0, 2.22 / Math.PI * H, W, 3)
    ctx.fillRect(0.75 * W - 1.5, 0.12 * H, 3, (2.22 / Math.PI - 0.12) * H)
  })
  const paint = canvasTexture((ctx, W, H) => {
    const r = rand(7)
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 70; i++) {
      const u = r(), th = 0.3 + r() * 1.9 // latitude, from the top
      // Keep the visor and the spark clear.
      if (Math.abs(u - 0.25) < 0.17 && th > 0.7) continue
      const y = th / Math.PI * H
      const stretch = 1 / Math.max(0.35, Math.sin(th)) // the sphere pinches toward the top
      const size = 2 + r() * r() * 14
      ctx.globalAlpha = 0.5 + r() * 0.45
      ctx.beginPath()
      // A blob of a few overlapping dabs, like chipped paint.
      for (let k = 0; k < 3; k++) {
        ctx.ellipse(u * W + (r() - 0.5) * size * stretch, y + (r() - 0.5) * size, size * stretch * (0.5 + r() * 0.6), size * (0.4 + r() * 0.5), r() * 3, 0, Math.PI * 2)
      }
      ctx.fill()
    }
    ctx.globalAlpha = 1
    // The spark, squeezed to undo the UV stretch at that latitude.
    ctx.save()
    ctx.translate(0.25 * W, 2.0 / Math.PI * H)
    ctx.scale(1 / Math.sin(2.0) * 0.55, 1)
    spark(ctx, 0, 0, 44, '#ffffff')
    ctx.restore()
  })
  // The bent shell and visor are the same for every crab too.
  const { pw, ph, tc } = VISOR
  const shellGeo = shellGeometry(new THREE.SphereGeometry(1, 56, 36))
  const paintGeo = shellGeometry(new THREE.SphereGeometry(1, 56, 36), 0.003)
  const visorGeo = shellGeometry(new THREE.SphereGeometry(1, 40, 24, Math.PI / 2 - pw / 2, pw, tc - ph / 2, ph), 0.008)
  for (const g of [shellGeo, paintGeo, visorGeo]) g.userData.shared = true
  skin = { base, paint, shellGeo, paintGeo, visorGeo }
  return skin
}

// The visor: a rounded black faceplate with the eyes drawn on in glowing
// strokes. Everything outside the plate is clear (alphaTest trims it).
const FW = 512, FH = 280
const PLATE = { x: 10, y: 10, w: FW - 20, h: FH - 20, r: 120 }
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function stroke(ctx, path, width = 30) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  // A wide soft halo, then the bright core.
  for (const [w, color, blur] of [[width * 1.6, 'rgba(92,182,255,0.35)', 30], [width, GLOW, 18]]) {
    ctx.lineWidth = w
    ctx.strokeStyle = color
    ctx.shadowColor = HALO
    ctx.shadowBlur = blur
    ctx.beginPath()
    path()
    ctx.stroke()
  }
  ctx.shadowBlur = 0
}

function fillGlow(ctx, path) {
  ctx.fillStyle = GLOW
  ctx.shadowColor = HALO
  ctx.shadowBlur = 26
  ctx.beginPath()
  path()
  ctx.fill()
  ctx.shadowBlur = 0
}

// The faint little smile under its eyes.
function smile(ctx, Y) {
  ctx.lineCap = 'round'
  ctx.lineWidth = 5
  ctx.strokeStyle = 'rgba(150,190,225,0.35)'
  ctx.beginPath()
  ctx.arc(FW / 2, Y + 18, 22, Math.PI * 0.2, Math.PI * 0.8)
  ctx.stroke()
}

export function drawFace(ctx, face = 'happy') {
  ctx.clearRect(0, 0, FW, FH)
  ctx.save()
  roundRect(ctx, PLATE.x, PLATE.y, PLATE.w, PLATE.h, PLATE.r)
  const g = ctx.createRadialGradient(FW * 0.5, FH * 0.45, 20, FW * 0.5, FH * 0.5, FW * 0.6)
  g.addColorStop(0, '#16110f')
  g.addColorStop(1, '#040303')
  ctx.fillStyle = g
  ctx.fill()
  ctx.clip()

  const L = FW * 0.31, Rt = FW * 0.69, Y = FH * 0.47, r = 52
  const both = fn => { fn(L, -1); fn(Rt, 1) }
  if (face === 'happy') {
    both(x => stroke(ctx, () => ctx.arc(x, Y + 22, r, Math.PI * 1.1, Math.PI * 1.9)))
    smile(ctx, Y)
  } else if (face === 'blink') {
    both(x => stroke(ctx, () => { ctx.moveTo(x - 34, Y); ctx.lineTo(x + 34, Y) }))
  } else if (face === 'think') {
    // Looking up and off to one side, one brow raised.
    both((x, s) => stroke(ctx, () => ctx.arc(x + 16, Y + 6 - (s > 0 ? 10 : 0), r * 0.85, Math.PI * 1.12, Math.PI * 1.88)))
  } else if (face === 'focused') {
    // Flat brows over open eyes.
    both(x => {
      stroke(ctx, () => { ctx.moveTo(x - 38, Y - 30); ctx.lineTo(x + 38, Y - 30) })
      stroke(ctx, () => ctx.arc(x, Y - 18, 36, Math.PI * 0.15, Math.PI * 0.85))
    })
  } else if (face === 'surprised') {
    both(x => stroke(ctx, () => ctx.arc(x, Y, 32, 0, Math.PI * 2), 20))
  } else if (face === 'laugh') {
    both((x, s) => stroke(ctx, () => { ctx.moveTo(x + s * 30, Y - 30); ctx.lineTo(x - s * 26, Y); ctx.lineTo(x + s * 30, Y + 30) }))
  } else if (face === 'sleepy') {
    both(x => stroke(ctx, () => ctx.arc(x, Y - 16, 38, Math.PI * 0.18, Math.PI * 0.82)))
  } else if (face === 'sad') {
    // Brows tipped up in the middle over low, flat eyes.
    both((x, s) => {
      stroke(ctx, () => { ctx.moveTo(x - s * 40, Y - 22); ctx.lineTo(x + s * 30, Y - 40) })
      stroke(ctx, () => ctx.arc(x, Y - 4, 30, Math.PI * 0.2, Math.PI * 0.8))
    })
  } else if (face === 'love') {
    both(x => fillGlow(ctx, () => {
      const s = 1.15
      ctx.moveTo(x, Y + 30 * s)
      ctx.bezierCurveTo(x - 50 * s, Y - 4 * s, x - 30 * s, Y - 44 * s, x, Y - 18 * s)
      ctx.bezierCurveTo(x + 30 * s, Y - 44 * s, x + 50 * s, Y - 4 * s, x, Y + 30 * s)
    }))
  }

  if (face === 'love' || face === 'laugh') smile(ctx, Y)

  // A soft sheen across the top of the glass.
  const sheen = ctx.createLinearGradient(0, 0, 0, FH * 0.4)
  sheen.addColorStop(0, 'rgba(255,255,255,0.10)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, FW, FH * 0.4)
  ctx.restore()
}

// A rounded segment from a to b (a capsule that can taper).
const seg = (a, b, r0, r1, mat, opts) => taper([a, b], r0, r1, mat, { seg: 5, radial: 10, ...opts })

// One leg, hip at the origin (high on the shell's side): a stubby thigh
// out, a black knee, a fat shin dropping nearly straight down, a black
// ankle and a short blunt tip on the floor.
function leg(side, dz, mats) {
  const g = new THREE.Group()
  const knee = v(side * 0.24, 0.06, dz * 0.15)
  const ankle = v(side * 0.44, -0.3, dz * 0.3)
  const foot = v(side * 0.54, -HIP_Y + 0.02, dz * 0.38)
  g.add(ball(0.15, mats.rubber))
  g.add(seg(v(side * 0.04, 0.02, 0), knee.clone().multiplyScalar(0.8), 0.17, 0.16, mats.orange, { bulge: 0.03 }))
  g.add(ball(0.13, mats.rubber, knee.toArray()))
  g.add(seg(knee.clone().lerp(ankle, 0.22), ankle.clone().lerp(knee, 0.16), 0.16, 0.14, mats.orange, { bulge: 0.035 }))
  g.add(ball(0.11, mats.rubber, ankle.toArray()))
  g.add(seg(ankle.clone().lerp(foot, 0.2), foot, 0.13, 0.04, mats.orange, { bulge: 0.025 }))
  return g
}

// One pincer arm, pivoting at the shoulder: a reach out from the side of
// the shell through black rubber joints, then a big crab claw
// hanging down beside the body, tips on the floor, its fixed finger
// curling to meet the hinged one (`finger`).
function claw(side, mats) {
  const pivot = new THREE.Group()
  pivot.userData.side = side
  const elbow = v(side * 0.2, 0.02, 0.03)
  const wrist = v(side * 0.46, -0.02, 0.06)
  pivot.add(baked(`arm${side}`, mats, () => {
    const g = new THREE.Group()
    g.add(ball(0.13, mats.rubber))
    g.add(seg(v(0, 0, 0).lerp(elbow, 0.2), elbow.clone().lerp(v(0, 0, 0), 0.15), 0.13, 0.13, mats.orange, { bulge: 0.02 }))
    g.add(ball(0.12, mats.rubber, elbow.toArray()))
    g.add(seg(elbow.clone().lerp(wrist, 0.18), wrist.clone().lerp(elbow, 0.12), 0.14, 0.16, mats.orange, { bulge: 0.02 }))
    g.add(ball(0.15, mats.rubber, wrist.toArray()))
    return g
  }))

  const hand = new THREE.Group()
  hand.position.copy(wrist)
  // Fingers pointing down, the pincer opening inward and a little forward
  // so the gap shows from the front.
  hand.rotation.order = 'YXZ'
  hand.rotation.set(Math.PI / 2 - 0.25, -side * (Math.PI / 2 - 0.5), 0)
  hand.scale.setScalar(1.2)
  // The palm, a fat rounded block, and the fixed finger along the bottom,
  // curling up at the tip.
  hand.add(baked('palm', mats, () => {
    const g = new THREE.Group()
    g.add(ball(0.3, mats.orange, [0, 0.02, 0.24], [0.8, 1, 1.15]))
    g.add(taper([v(0, -0.1, 0.42), v(0, -0.13, 0.6), v(0, -0.06, 0.76), v(0, 0.06, 0.84)], 0.17, 0.04, mats.orange, { bulge: 0.03, seg: 18 }))
    return g
  }))
  // Hinged finger along the top, curling down to meet it.
  const finger = new THREE.Group()
  finger.position.set(0, 0.14, 0.4)
  finger.add(baked('finger', mats, () => taper([v(0, 0, 0), v(0, 0.07, 0.18), v(0, 0.02, 0.34), v(0, -0.1, 0.44)], 0.17, 0.04, mats.orange, { bulge: 0.03, seg: 18 })))
  hand.add(finger)
  pivot.add(hand)
  pivot.userData.finger = finger
  pivot.userData.hand = hand
  return pivot
}

// One eye on a short black neck: orange socket, cream white, glossy
// black pupil with a glint. Pivots at its base.
function eyestalk(side, mats) {
  const g = new THREE.Group()
  g.add(baked('neck', mats, () => seg(v(0, -0.04, 0), v(0, 0.1, 0.02), 0.075, 0.07, mats.rubber)))
  const eye = new THREE.Group()
  eye.position.set(0, 0.3, 0.04)
  eye.add(baked('eye', mats, () => {
    const e = new THREE.Group()
    e.add(ball(0.27, mats.orange))
    e.add(ball(0.235, mats.cream, [0, 0, 0.075]))
    e.add(ball(0.165, mats.pupil, [0, 0, 0.22], [1, 1, 0.7]))
    e.add(ball(0.05, mats.glint, [-0.06, 0.07, 0.33]))
    return e
  }))
  eye.rotation.y = side * 0.18
  g.add(eye)
  g.userData.eye = eye
  return g
}

// The raised cream rim round the visor: a tube along the faceplate's
// rounded edge, carried onto the shell.
function visorRim(mat) {
  const { pw, ph, tc } = VISOR
  const pts = []
  const { x, y, w, h, r } = PLATE
  // Walk the rounded rectangle in canvas pixels.
  const corners = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]]
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= 12; i++) {
      const a = a0 + (i / 12) * (Math.PI / 2)
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }
  }
  const P = new THREE.Vector3(), Nrm = new THREE.Vector3()
  const path = pts.map(([px, py]) => {
    const d = dirAt(Math.PI / 2 - pw / 2 + (px / FW) * pw, tc - ph / 2 + (py / FH) * ph)
    shellAt(d.x, d.y, d.z, P, Nrm)
    return P.clone().addScaledVector(Nrm, 0.015)
  })
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path, true), 120, 0.055, 8, true)
  return new THREE.Mesh(geo, mat)
}

// Where the visor's eyes sit (canvas x, as a fraction across the plate) on
// the shell, pushed `lift` out along it, and the outward normal there.
function onVisor(fx, fy, lift) {
  const { pw, ph, tc } = VISOR
  const d = dirAt(Math.PI / 2 - pw / 2 + fx * pw, tc - ph / 2 + fy * ph)
  const P = new THREE.Vector3(), Nrm = new THREE.Vector3()
  shellAt(d.x, d.y, d.z, P, Nrm)
  return { at: P.addScaledVector(Nrm, lift), normal: Nrm }
}

// The kits, in the shell's space (its centre at the origin, facing +z).
const KIT_BUILDS = {
  // Explorer: a leather backpack with a flap, a buckle and a bedroll on top.
  backpack() {
    const g = new THREE.Group()
    const pack = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.8, 0.42, 4, 0.14), KIT.leather)
    pack.position.set(0, 0.02, -R.z - 0.1)
    const flap = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.36, 0.1, 3, 0.05), KIT.flap)
    flap.position.set(0, 0.24, -R.z - 0.33)
    const buckle = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.12, 0.04, 2, 0.02), KIT.buckle)
    buckle.position.set(0, 0.1, -R.z - 0.39)
    const pocket = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.28, 0.12, 3, 0.05), KIT.flap)
    pocket.position.set(0, -0.2, -R.z - 0.33)
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.0, 20), KIT.bedroll)
    roll.rotation.z = Math.PI / 2
    roll.position.set(0, 0.5, -R.z + 0.02)
    for (const x of [-0.3, 0.3]) {
      const tie = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.025, 6, 20), KIT.flap)
      tie.rotation.y = Math.PI / 2
      tie.position.set(x, 0.5, -R.z + 0.02)
      g.add(tie)
    }
    // Straps over the shell's shoulders, to the front.
    for (const x of [-0.42, 0.42]) {
      const strap = taper([v(x, 0.35, -R.z - 0.05), v(x, topAt(x, -0.5) + 0.02, -0.5), v(x, topAt(x, 0) + 0.02, 0), v(x * 1.05, topAt(x, 0.2) - 0.05, 0.22)], 0.035, 0.035, KIT.flap, { radial: 8, seg: 18 })
      g.add(strap)
    }
    g.add(pack, flap, buckle, pocket, roll)
    return g
  },
  // Creative: a soft beret, tipped back and to one side, with its stalk.
  beret() {
    const g = new THREE.Group()
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.74, 32, 16), KIT.beret)
    cap.scale.set(1, 0.3, 1)
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.07, 10, 36), KIT.beret)
    band.rotation.x = Math.PI / 2
    band.position.y = -0.06
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.14, 8), KIT.beret)
    stalk.position.y = 0.26
    g.add(cap, band, stalk)
    g.position.set(-0.05, topAt(-0.05, -0.18) + 0.05, -0.18)
    g.rotation.set(-0.15, 0, 0.2)
    const outer = new THREE.Group()
    outer.add(g)
    return outer
  },
  // Coder: big round glasses over the visor's eyes, with a bridge and arms.
  glasses() {
    const g = new THREE.Group()
    const centres = [0.31, 0.69].map(fx => onVisor(fx, 0.47, 0.07))
    for (const { at, normal } of centres) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.05, 12, 40), KIT.frame)
      ring.position.copy(at)
      ring.lookAt(at.clone().add(normal))
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.26, 32), KIT.lens)
      lens.position.copy(at)
      lens.lookAt(at.clone().add(normal))
      g.add(ring, lens)
    }
    const [a, b] = centres.map(c => c.at)
    const mid = a.clone().lerp(b, 0.5).add(v(0, 0.06, 0.03))
    g.add(taper([a.clone().add(v(0.24, 0.05, 0)), mid, b.clone().add(v(-0.24, 0.05, 0))], 0.035, 0.035, KIT.frame, { radial: 8, seg: 10 }))
    // Arms back along the shell's sides.
    for (const [c, s] of [[a, -1], [b, 1]]) {
      const start = c.clone().add(v(s * 0.26, 0.04, -0.04))
      const back = onVisor(s < 0 ? -0.08 : 1.08, 0.38, 0.03).at
      g.add(taper([start, back], 0.03, 0.03, KIT.frame, { radial: 8, seg: 6 }))
    }
    return g
  },
  // Focus: headphones, the band over the shell behind its eyes, cups on
  // its sides.
  headphones() {
    const g = new THREE.Group()
    const z = -0.42
    const pts = []
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI * (i / 24)
      const x = Math.cos(a) * 1.02
      pts.push(v(x, Math.max(0.05, topAt(Math.min(Math.abs(x), R.x * 0.98), z)) + 0.07 * Math.sin(a) + 0.04, z))
    }
    g.add(taper(pts, 0.065, 0.065, KIT.band, { radial: 10, seg: 40 }))
    for (const side of [-1, 1]) {
      const x = side * (sideAt(0.08, z) + 0.06)
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.16, 28), KIT.band)
      cup.rotation.z = Math.PI / 2
      cup.position.set(x, 0.08, z)
      const pad = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.07, 10, 28), KIT.pad)
      pad.rotation.y = Math.PI / 2
      pad.position.set(x - side * 0.08, 0.08, z)
      g.add(cup, pad)
    }
    return g
  },
}

export function makeCrab({ orange = ORANGE, pick, face = 'happy', kit: kitName = 'none' } = {}) {
  const mats = {
    shell: new THREE.MeshPhysicalMaterial({ map: skins().base, roughness: 0.4, clearcoat: 0.3, clearcoatRoughness: 0.35 }),
    paint: new THREE.MeshStandardMaterial({ map: skins().paint, roughness: 0.35, transparent: true, depthWrite: false }),
    rim: new THREE.MeshPhysicalMaterial({ color: SHELL, roughness: 0.4, clearcoat: 0.3, clearcoatRoughness: 0.35 }),
    orange: new THREE.MeshPhysicalMaterial({ color: orange, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
    rubber: new THREE.MeshStandardMaterial({ color: RUBBER, roughness: 0.55 }),
    cream: new THREE.MeshStandardMaterial({ color: '#fbf1e2', roughness: 0.3 }),
    pupil: new THREE.MeshPhysicalMaterial({ color: '#070708', roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04 }),
    glint: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  }
  // The paint chips follow the orange parts' colour: one Color, shared.
  mats.paint.color = mats.orange.color

  const root = new THREE.Group()
  const rig = new THREE.Group()
  root.add(rig)
  const top = new THREE.Group() // the shell and all it carries
  rig.add(top)
  const body = new THREE.Group()
  body.position.y = CY
  top.add(body)

  const shell = new THREE.Mesh(skins().shellGeo, mats.shell)
  const paint = new THREE.Mesh(skins().paintGeo, mats.paint)
  body.add(shell, paint, baked('rim', mats, () => visorRim(mats.rim)))

  // The visor: its patch of the shell, a hair proud of it, inside the rim.
  const canvas = document.createElement('canvas')
  canvas.width = FW
  canvas.height = FH
  const faceTex = new THREE.CanvasTexture(canvas)
  faceTex.colorSpace = THREE.SRGBColorSpace
  faceTex.anisotropy = 4
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: '#666666', map: faceTex, emissiveMap: faceTex, emissive: '#ffffff', emissiveIntensity: 1.3,
    roughness: 0.45, envMapIntensity: 0.5, clearcoat: 1, clearcoatRoughness: 0.06, alphaTest: 0.5,
  })
  const visor = new THREE.Mesh(skins().visorGeo, visorMat)
  body.add(visor)

  // Eyes on the top front corners of the shell.
  const stalks = [-1, 1].map(side => {
    const s = eyestalk(side, mats)
    const x = side * 0.55, z = 0.3
    s.position.set(x, topAt(x, z) - 0.02, z)
    s.rotation.z = -side * 0.1
    body.add(s)
    return s
  })

  // Pincers out from the middle of each side, standing clear of the body.
  const arms = [-1, 1].map(side => {
    const a = claw(side, mats)
    a.position.set(side * (sideAt(0.12, 0.05) - 0.04), 0.12, 0.05)
    body.add(a)
    return a
  })

  // Its kit, if it wears one (the lead's gem is the office's to add).
  if (KIT_BUILDS[kitName]) body.add(baked(`kit:${kitName}`, mats, KIT_BUILDS[kitName]))

  // Three legs a side, high on the shell: one ahead of the claw, two behind.
  const legs = []
  for (const side of [-1, 1]) {
    ;[0.48, -0.3, -0.64].forEach((z, i) => {
      const l = baked(`leg${side}${i}`, mats, () => leg(side, z, mats))
      l.position.set(side * (sideAt(HIP_Y - CY, z) - 0.06), HIP_Y, z)
      l.userData.side = side
      l.userData.phase = (i + (side > 0 ? 1 : 0)) % 2 ? Math.PI : 0
      legs.push(l)
      rig.add(l)
    })
  }

  root.traverse(o => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    if (pick) o.userData.pick = pick
  })
  visor.castShadow = paint.castShadow = false

  const c = {
    root, rig, top, shell, visor, stalks, arms, legs, mats, visorMat,
    faceCtx: canvas.getContext('2d'), faceTex, face: null, mood: face,
    height: CY + R.y + 0.65,
    seed: Math.random() * 10,
    blinkAt: 1 + Math.random() * 3,
  }
  setFace(c, face)
  return c
}

// Shows an expression on the visor (one of FACES); redrawn only on change.
export function setFace(c, face) {
  if (c.face === face) return
  c.face = face
  drawFace(c.faceCtx, face)
  c.faceTex.needsUpdate = true
}

// Per-frame pose: `busy` 0..1 taps the legs and clacks the claws, `look`
// turns it, `hop` 0..1 is a one-shot jump, `asleep` keeps its eyes shut,
// `walk` is a sideways scuttle, `alarm` (its context nearly full) throws
// both claws up. Its resting expression is c.mood. With `apply` false the
// face it would show is left in c.want, for crabEmote() to have the last
// word (so the visor isn't redrawn twice a frame).
export function crabPose(c, t, { busy = 0, look = 0, hop = 0, asleep = false, walk = false, alarm = false, apply = true } = {}) {
  const breathe = Math.sin(t * (asleep ? 0.9 : 2) + c.seed) * 0.015
  const jump = Math.sin(Math.min(1, hop) * Math.PI) * 0.45
  c.rig.position.y = jump
  c.rig.rotation.y += (look - c.rig.rotation.y) * 0.08
  c.top.scale.set(1 + breathe, 1 - breathe, 1 + breathe)
  c.top.position.y = busy * Math.abs(Math.sin(t * 8 + c.seed)) * 0.04
  c.top.rotation.z = (walk ? Math.sin(t * 12) * 0.05 : 0) + busy * Math.sin(t * 4 + c.seed) * 0.03

  const pace = walk ? 16 : 12
  for (const l of c.legs) {
    const k = Math.max(busy, walk ? 1 : 0)
    l.rotation.z = l.userData.side * k * Math.sin(t * pace + l.userData.phase) * 0.18
    l.rotation.y = k * Math.cos(t * pace + l.userData.phase) * 0.12
  }

  // Claws held up a little, swaying; they clack while it works.
  for (const a of c.arms) {
    const s = a.userData.side
    a.rotation.x = -0.15 + Math.sin(t * 1.6 + c.seed + s) * 0.04
    a.rotation.z = s * (alarm ? 2.3 + Math.sin(t * 7) * 0.2 : jump * 0.8)
    const open = busy ? 0.15 + 0.2 * Math.max(0, Math.sin(t * 10 + s)) : 0.12
    a.userData.finger.rotation.x = -open
  }

  // Eyestalks sway and the eyes peer about.
  for (const s of c.stalks) {
    const side = s.position.x > 0 ? 1 : -1
    s.rotation.x = Math.sin(t * 1.3 + c.seed + side) * 0.06
    s.userData.eye.rotation.x = Math.sin(t * 0.7 + c.seed) * 0.08
  }

  if (t > c.blinkAt + 0.14) c.blinkAt = t + 2 + Math.random() * 4
  const closed = asleep || (t > c.blinkAt && t < c.blinkAt + 0.14)
  c.want = asleep ? 'sleepy' : closed ? 'blink' : alarm ? 'surprised' : c.mood
  if (apply) setFace(c, c.want)
}

// What each mood (moods.js) shows on the visor.
const MOOD_FACES = { think: 'think', cheer: 'laugh', sulk: 'sad', perk: 'surprised', yawn: 'sleepy' }

// A mood on top of the pose (call right after crabPose with apply: false):
// its face, and its claws and shell. `envelope` (moods.js) eases it in and
// out; `still` keeps the shapes and drops the bouncing.
export function crabEmote(c, t, mood, envelope, still = false) {
  const kind = mood?.kind
  if (c.dots) c.dots.visible = kind === 'think'
  c.top.rotation.x = 0
  if (!kind) return setFace(c, c.want ?? c.mood)
  const k = mood.k
  if (kind === 'think') {
    // One dot after another swells, like an ellipsis typing itself.
    c.dots?.children.forEach((d, i) => d.scale.setScalar(d.userData.r * (still ? 1 : 1 + 0.35 * Math.max(0, Math.sin((k - i / 3) * Math.PI * 2)))))
    return setFace(c, c.want === 'blink' ? 'blink' : 'think')
  }
  const e = envelope(k)
  setFace(c, e > 0.25 ? MOOD_FACES[kind] : c.want ?? c.mood)
  if (kind === 'cheer') {
    // Both claws up, clacking, and a bounce or two.
    for (const a of c.arms) {
      a.rotation.z = a.userData.side * (2.3 + (still ? 0 : Math.sin(t * 18) * 0.2)) * e
      a.userData.finger.rotation.x = -0.15 - 0.25 * Math.max(0, Math.sin(t * 20)) * e
    }
    if (!still) c.rig.position.y += Math.abs(Math.sin(k * Math.PI * 3)) * 0.4 * e
  } else if (kind === 'sulk') {
    // A slump: tipping forward, claws on the floor.
    c.top.rotation.x = 0.22 * e
    c.top.position.y -= 0.06 * e
  } else if (kind === 'perk') {
    // Looks up at you with a little hop.
    c.top.rotation.x = -0.2 * e
    if (!still) c.rig.position.y += Math.sin(Math.min(1, k * 2.5) * Math.PI) * 0.3
  } else if (kind === 'yawn') {
    // A slow stretch, claws up.
    c.top.rotation.x = -0.15 * e
    for (const a of c.arms) a.rotation.z = a.userData.side * 1.4 * e
  }
}
