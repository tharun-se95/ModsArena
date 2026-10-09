// Robot crabs in Three.js: the five designs from the crab studio (Bot,
// Mini, Tank, Retro, Sleek), built in the classic critters' unit space
// (feet at y = 0, facing +z) so the office scales and places them the same
// way. robots.js says which robot each helper is and which face it shows.
//
// Cheap to have many of: each design (with its accessory) is built once as
// a template, every rigid part merged into one skinned geometry per
// material, so a robot is about six draw calls however many joints it has.
// Each robot gets its own bones, its own colour materials and its own
// small screen texture, redrawn only when its face changes. A plain box
// stands in for it when the office asks what's under the pointer.

import * as THREE from 'three'
import { robotFor, stateOf, faceFor, FACES, moveOf } from './robots.js'
import { envelope } from './moods.js'

const T = THREE
const v3 = (x, y, z) => new T.Vector3(x, y, z)
const WHITE = '#fbf6ec', JOINT = '#e9e5df', CHARCOAL = '#2a2827', GEM = '#f2c14e'
const IDENTITY = new T.Matrix4()
const NO_OPTS = {}

// Materials every robot shares (the neutral parts: joints, undersides,
// bezels). Marked shared so nothing in the office frees them.
let S = null
function shared() {
  if (S) return S
  const std = o => { const m = new T.MeshStandardMaterial(o); m.userData.shared = true; return m }
  S = {
    joint: std({ color: JOINT, roughness: 0.4, envMapIntensity: 0.7 }),
    charcoal: std({ color: CHARCOAL, roughness: 0.55, envMapIntensity: 0.5 }),
    bezel: std({ color: '#0a0a0b', roughness: 0.35, envMapIntensity: 0.35 }),
    steel: std({ color: '#c9c6c0', roughness: 0.35, metalness: 0.4, envMapIntensity: 0.9 }),
    cream: std({ color: '#efe5cf', roughness: 0.45, envMapIntensity: 0.6 }),
    chrome: std({ color: '#d8d6d0', roughness: 0.2, metalness: 0.7, envMapIntensity: 1.1 }),
    pearl: std({ color: '#f1f0ec', roughness: 0.25, envMapIntensity: 0.8 }),
    dark: std({ color: '#232427', roughness: 0.4, envMapIntensity: 0.6 }),
    porthole: std({ color: '#0b0c0b', roughness: 0.3 }),
    frame: std({ color: '#3b3530', roughness: 0.35 }),
    white: std({ color: WHITE, roughness: 0.18, envMapIntensity: 0.9 }),
    glass: std({ color: '#d8ecff', roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false }),
    dome: std({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.12, depthWrite: false }),
    dot: std({ color: WHITE, roughness: 0.5 }),
    pick: Object.assign(new T.MeshBasicMaterial({ visible: false }), { userData: { shared: true } }),
  }
  return S
}
const DOT_GEO = new T.SphereGeometry(1, 12, 10)
DOT_GEO.userData.shared = true

// Stand-ins for the per-robot materials while a template is built.
const ROLE = { body: { role: 'body' }, accent: { role: 'accent' } }

// ---------------------------------------------------------------------------
// Geometry helpers (from the studio). Everything made here is merged into
// a template and then freed, except the few meshes a template keeps.

let made = [] // geometries made while building the current template
const track = g => { made.push(g); return g }
let sphereCache = new Map()
function sphere(r, ws = 24, hs = 18) {
  const k = `${r}|${ws}|${hs}`
  if (!sphereCache.has(k)) sphereCache.set(k, track(new T.SphereGeometry(r, ws, hs)))
  return sphereCache.get(k)
}
function mesh(geo, mat, pos, scale, rot) {
  const m = new T.Mesh(geo, mat)
  track(geo)
  if (pos) m.position.copy(pos)
  if (scale) m.scale.set(scale[0], scale[1], scale[2])
  if (rot) m.rotation.set(rot[0], rot[1], rot[2])
  return m
}
const bone = tag => { const b = new T.Bone(); if (tag) b.userData.tag = tag; return b }
function tagged(obj, tag) {
  let found = null
  obj.traverse(o => { if (!found && o.userData.tag === tag) found = o })
  return found
}

function taper(points, r0, r1, mat, { radial = 14, seg = 12, bulge = 0, capA = true, capB = true } = {}) {
  const g = new T.Group()
  const curve = points.length === 2 ? new T.LineCurve3(points[0], points[1]) : new T.CatmullRomCurve3(points)
  const geo = new T.TubeGeometry(curve, seg, 1, radial, false)
  const pos = geo.attributes.position
  const P = new T.Vector3(), V = new T.Vector3()
  for (let i = 0; i <= seg; i++) {
    const u = i / seg
    curve.getPointAt(u, P)
    const r = r0 + (r1 - r0) * u + bulge * Math.sin(u * Math.PI)
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j
      V.fromBufferAttribute(pos, idx).sub(P).multiplyScalar(r).add(P)
      pos.setXYZ(idx, V.x, V.y, V.z)
    }
  }
  geo.computeVertexNormals()
  g.add(mesh(geo, mat))
  if (capA) g.add(mesh(sphere(r0 * 0.995, radial + 2, Math.max(8, radial)), mat, points[0]))
  if (capB) g.add(mesh(sphere(r1 * 0.995, radial + 2, Math.max(8, radial)), mat, points[points.length - 1]))
  return g
}

function roundBox(w, h, d, r, s = 5) {
  const geo = new T.BoxGeometry(w, h, d, s, s, s)
  const p = geo.attributes.position, n = geo.attributes.normal
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r
  const v = new T.Vector3(), c = new T.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    c.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)))
    v.sub(c)
    if (v.lengthSq() > 1e-9) { v.normalize(); n.setXYZ(i, v.x, v.y, v.z); v.multiplyScalar(r).add(c); p.setXYZ(i, v.x, v.y, v.z) }
  }
  return geo
}

// The shell: a dome over an outline R(θ) (θ from +x; the front, +z, is π/2).
function shellShape(o) {
  const R = th => (o.outline ? o.outline(th) : 1)
  const height = (th, rho) => o.h * Math.pow(Math.max(0, 1 - Math.pow(rho, o.p ?? 2)), o.q ?? 0.5)
  const point = (th, rho, y) => v3(Math.cos(th) * o.rx * R(th) * rho, y ?? height(th, rho), Math.sin(th) * o.rz * R(th) * rho)
  const surf = (th, rho) => {
    const e = 0.004
    const p = point(th, rho)
    const a = point(th + e, rho).sub(p), b = point(th, Math.min(1, rho + e)).sub(point(th, rho - e))
    const n = rho < 0.02 ? v3(0, 1, 0) : new T.Vector3().crossVectors(b, a).normalize()
    if (n.y < 0 && rho < 0.99) n.negate()
    return { p, n }
  }
  function build(part) {
    const segT = o.segT ?? 96
    const rows = part === 'top'
      ? Array.from({ length: o.segR ?? 24 }, (_, k) => ({ rho: 1 - k / (o.segR ?? 24), y: null }))
      : (o.underRows ?? [[1, 0], [0.985, -0.3], [0.94, -0.65], [0.85, -0.9], [0.68, -1], [0.35, -1]]).map(([rho, f]) => ({ rho, y: f * o.d }))
    const verts = [], idx = []
    rows.forEach(r => { for (let i = 0; i < segT; i++) { const th = (i / segT) * Math.PI * 2; const pt = point(th, r.rho, r.y); verts.push(pt.x, pt.y, pt.z) } })
    const centre = verts.length / 3
    verts.push(0, part === 'top' ? height(0, 0) : -o.d, 0)
    for (let k = 0; k < rows.length - 1; k++) for (let i = 0; i < segT; i++) {
      const a = k * segT + i, b = k * segT + (i + 1) % segT, c = (k + 1) * segT + i, d = (k + 1) * segT + (i + 1) % segT
      if (part === 'top') idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c)
    }
    const last = (rows.length - 1) * segT
    for (let i = 0; i < segT; i++) { const a = last + i, b = last + (i + 1) % segT; if (part === 'top') idx.push(a, centre, b); else idx.push(a, b, centre) }
    const g = new T.BufferGeometry()
    g.setAttribute('position', new T.Float32BufferAttribute(verts, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
  }
  return { o, point, surf, height, top: () => build('top'), under: () => build('under') }
}
const sqOutline = n => th => Math.pow(Math.pow(Math.abs(Math.cos(th)), n) + Math.pow(Math.abs(Math.sin(th)), n), -1 / n)
function rhoAt(sh, th, y) { let a = 0, b = 1; for (let i = 0; i < 30; i++) { const mid = (a + b) / 2; if (sh.height(th, mid) > y) a = mid; else b = mid } return (a + b) / 2 }
// A strip that follows the shell between heights y0..y1 (Sleek's light band).
function bandGeo(sh, th0, th1, y0, y1, off = 0.006, nT = 48, nY = 6) {
  const pos = [], uv = [], idx = []
  for (let j = 0; j <= nY; j++) for (let i = 0; i <= nT; i++) {
    const th = th1 + (th0 - th1) * (i / nT), y = y0 + (y1 - y0) * (j / nY)
    const s = sh.surf(th, rhoAt(sh, th, y))
    const p = s.p.addScaledVector(s.n, off)
    pos.push(p.x, p.y, p.z); uv.push(i / nT, j / nY)
  }
  for (let j = 0; j < nY; j++) for (let i = 0; i < nT; i++) { const a = j * (nT + 1) + i, b = a + 1, c = a + nT + 1, d = c + 1; idx.push(a, b, c, b, d, c) }
  const geo = new T.BufferGeometry()
  geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals()
  return geo
}
function onFront(sh, obj, y, out = 0.01, th = Math.PI / 2) {
  const s = sh.surf(th, rhoAt(sh, th, y))
  obj.position.copy(s.p).addScaledVector(s.n, out)
  obj.lookAt(obj.position.clone().add(s.n))
}

// Leg: hip (yaw) -> lift (raise, about z) -> upper along +x -> knee -> lower.
function makeLeg(side, hipPos, dirTh, o, i) {
  const hip = bone(), lift = bone(), knee = bone()
  hip.position.copy(hipPos)
  hip.rotation.y = -dirTh
  hip.add(lift)
  const a1 = o.up
  lift.rotation.z = a1
  const kH = hipPos.y + o.L1 * Math.sin(a1)
  const a2 = o.a2 ?? 0.95
  const L2 = kH / Math.sin(a2)
  lift.add(o.upper(o.L1))
  knee.position.x = o.L1
  knee.rotation.z = -a1 - a2
  lift.add(knee)
  knee.add(o.lower(L2, a2))
  hip.userData.leg = { side, a1, a2, yaw: -dirTh, i }
  return hip
}

function makeArm(side, shoulderPos, o) {
  const shoulder = bone(), elbow = bone(), wrist = bone()
  shoulder.position.copy(shoulderPos)
  shoulder.rotation.order = 'XYZ'
  const yaw = side * o.yaw
  shoulder.rotation.y = yaw
  shoulder.rotation.x = o.raise ?? 0
  shoulder.add(o.upper())
  elbow.position.z = o.L1
  elbow.rotation.y = -side * o.bend
  elbow.rotation.x = o.elbowX ?? 0
  shoulder.add(elbow)
  elbow.add(o.fore())
  wrist.position.z = o.L2
  wrist.rotation.y = -side * (o.wristYaw ?? 0.2)
  wrist.rotation.z = -side * (o.roll ?? 0.5)
  elbow.add(wrist)
  const claw = o.claw(side)
  wrist.add(claw.group)
  claw.finger.userData.tag = 'finger'
  claw.hold.userData.tag = 'hold'
  shoulder.userData.arm = { side, yaw, raise: o.raise ?? 0, bend: o.bend, open: claw.open, wz: wrist.rotation.z }
  return shoulder
}

// A pincer along +z: palm, fixed lower finger, moving upper finger.
function pincer(o) {
  const group = new T.Group()
  group.add(mesh(sphere(1, 28, 20), o.palmMat ?? ROLE.body, v3(0, 0, o.pl * 0.5), [o.pw, o.ph, o.pl * 0.62]))
  const fMat = o.fingerMat ?? ROLE.body
  group.add(taper(o.fixed, o.fr0, o.fr1, fMat, { radial: 12, seg: 10 }))
  const finger = bone()
  finger.position.copy(o.hinge)
  finger.add(taper(o.moving, o.mr0, o.mr1, fMat, { radial: 12, seg: 10 }))
  group.add(finger)
  const hold = bone(); hold.position.set(0, 0, o.pl * 0.9); group.add(hold)
  return { group, finger, open: o.open, hold }
}

// ---------------------------------------------------------------------------
// The five designs. Each returns { shell, legs, arms, top, face, visor, sh }
// where `face` sets its screen's canvas and `visor` is where glasses go.

const B = ROLE.body
const BUILD = {}

BUILD.bot = function () {
  const s = shared()
  const rimY = 0.6
  const sh = shellShape({
    rx: 0.98, rz: 0.84, h: 0.42, d: 0.26, p: 3.2, q: 0.42, segR: 22, segT: 88, outline: sqOutline(3.6),
    underRows: [[1, 0], [0.995, -0.35], [0.985, -0.75], [0.955, -0.95], [0.88, -1], [0.4, -1]],
  })
  const shell = bone('shell'); shell.position.y = rimY
  shell.add(mesh(sh.top(), B), mesh(sh.under(), s.charcoal))
  const visor = new T.Group(); visor.position.set(0, 0.06, 0.8); visor.rotation.x = -0.08
  visor.add(mesh(roundBox(1.08, 0.42, 0.08, 0.13, 4), s.bezel))
  visor.add(screen(new T.PlaneGeometry(0.94, 0.33), v3(0, 0, 0.041)))
  shell.add(visor)
  const bar = (len, w, h, r = 0.075) => { const g = new T.Group(); g.add(mesh(roundBox(len, h, w, r, 3), B, v3(len / 2, 0, 0))); return g }
  const capGeo = new Map()
  const cap = (r, len) => { const k = `${r}|${len}`; if (!capGeo.has(k)) capGeo.set(k, new T.CylinderGeometry(r, r, len, 16)); return mesh(capGeo.get(k), s.joint, null, null, [Math.PI / 2, 0, 0]) }
  const legs = []
  for (const side of [-1, 1]) [[0.36, 0.42], [-0.08, 0.02], [-0.5, -0.38]].forEach(([z, th], i) => {
    legs.push(makeLeg(side, v3(side * 0.86, rimY - 0.1, z), side > 0 ? th : Math.PI - th, {
      up: 1.05, L1: 0.5, a2: 1.22,
      upper: L => { const g = bar(L, 0.21, 0.2); g.add(cap(0.125, 0.25)); const k = cap(0.12, 0.25); k.position.x = L; g.add(k); return g },
      lower: L => { const g = bar(L * 0.8, 0.19, 0.18, 0.07); g.add(mesh(roundBox(L * 0.26, 0.2, 0.21, 0.085, 3), s.charcoal, v3(L * 0.88, 0, 0))); return g },
    }, i))
  })
  const arms = [-1, 1].map(side => makeArm(side, v3(side * 0.6, rimY - 0.06, 0.66), {
    yaw: 0.75, bend: 1.0, L1: 0.36, L2: 0.32, raise: -0.08, roll: 0.55, wristYaw: 0.2,
    upper: () => { const g = new T.Group(); g.add(mesh(roundBox(0.19, 0.19, 0.36, 0.07, 3), B, v3(0, 0, 0.18))); const c0 = mesh(new T.CylinderGeometry(0.12, 0.12, 0.24, 16), s.joint, null, null, [0, 0, Math.PI / 2]); g.add(c0); const c1 = c0.clone(); c1.position.z = 0.36; g.add(c1); return g },
    fore: () => mesh(roundBox(0.18, 0.18, 0.34, 0.07, 3), B, v3(0, 0, 0.17)),
    claw: () => {
      const group = new T.Group()
      group.add(mesh(roundBox(0.34, 0.32, 0.4, 0.12, 4), B, v3(0, 0, 0.16)))
      const jaw = dir => {
        const g = new T.Group()
        g.add(mesh(roundBox(0.26, 0.13, 0.4, 0.06, 3), B, v3(0, 0, 0.2)))
        g.add(mesh(roundBox(0.22, 0.12, 0.2, 0.055, 3), B, v3(0, -dir * 0.035, 0.43), null, [dir * 0.55, 0, 0]))
        g.add(mesh(roundBox(0.2, 0.04, 0.36, 0.018, 2), s.joint, v3(0, -dir * 0.065, 0.2)))
        return g
      }
      const low = jaw(-1); low.position.set(0, -0.1, 0.3); low.rotation.x = -0.1; group.add(low)
      const finger = bone(); finger.position.set(0, 0.08, 0.3)
      const up = jaw(1); up.rotation.x = 0.1; finger.add(up)
      group.add(finger)
      const hold = bone(); hold.position.set(0, 0, 0.5); group.add(hold)
      return { group, finger, open: 0.7, hold }
    },
  }))
  return { shell, legs, arms, top: rimY + sh.height(0, 0), sh, rimY, visor, eyeX: 0.155, eyeR: 0.105, face: { w: 256, h: 90, dx: 50, k: 1, lw: 12 }, rough: 0.62, env: 0.3, tone: 0.9 }
}

BUILD.mini = function () {
  const s = shared()
  const rimY = 0.46
  const sh = shellShape({ rx: 0.8, rz: 0.72, h: 0.6, d: 0.24, p: 2.6, q: 0.5, segR: 22, segT: 80, outline: sqOutline(2.8),
    underRows: [[1, 0], [0.99, -0.4], [0.96, -0.8], [0.88, -1], [0.4, -1]] })
  const shell = bone('shell'); shell.position.y = rimY
  shell.add(mesh(sh.top(), B), mesh(sh.under(), s.charcoal))
  const visor = new T.Group()
  visor.add(mesh(roundBox(1.08, 0.56, 0.1, 0.2, 4), s.bezel))
  visor.add(screen(new T.PlaneGeometry(0.96, 0.45), v3(0, 0, 0.051)))
  onFront(sh, visor, 0.2, -0.01)
  shell.add(visor)
  const legs = []
  for (const side of [-1, 1]) [[0.28, 0.4], [-0.08, 0], [-0.42, -0.4]].forEach(([z, th], i) => {
    legs.push(makeLeg(side, v3(side * 0.66, rimY - 0.08, z), side > 0 ? th : Math.PI - th, {
      up: 0.7, L1: 0.28, a2: 1.05,
      upper: L => { const g = new T.Group(); g.add(mesh(roundBox(L, 0.21, 0.22, 0.09, 3), B, v3(L / 2, 0, 0))); g.add(mesh(new T.CylinderGeometry(0.12, 0.12, 0.25, 16), s.joint, null, null, [Math.PI / 2, 0, 0])); g.add(mesh(new T.CylinderGeometry(0.115, 0.115, 0.24, 16), s.joint, v3(L, 0, 0), null, [Math.PI / 2, 0, 0])); return g },
      lower: L => { const g = new T.Group(); g.add(mesh(roundBox(L * 0.75, 0.2, 0.21, 0.09, 3), B, v3(L * 0.38, 0, 0))); g.add(mesh(sphere(0.14, 16, 12), s.charcoal, v3(L * 0.86, 0, 0), [1, 0.9, 1])); return g },
    }, i))
  })
  const arms = [-1, 1].map(side => makeArm(side, v3(side * 0.5, rimY - 0.04, 0.54), {
    yaw: 0.8, bend: 1.0, L1: 0.24, L2: 0.22, raise: -0.06, roll: 0.3, wristYaw: 0.25,
    upper: () => { const g = new T.Group(); g.add(mesh(roundBox(0.18, 0.18, 0.24, 0.08, 3), B, v3(0, 0, 0.12))); g.add(mesh(sphere(0.12, 16, 12), s.joint)); return g },
    fore: () => { const g = new T.Group(); g.add(mesh(sphere(0.11, 16, 12), s.joint)); g.add(mesh(roundBox(0.17, 0.17, 0.22, 0.08, 3), B, v3(0, 0, 0.11))); return g },
    claw: () => {
      const group = new T.Group()
      group.add(mesh(sphere(0.33, 24, 18), B, v3(0, 0, 0.2), [1, 0.92, 1.05]))
      group.add(mesh(sphere(0.21, 20, 14), B, v3(0, -0.1, 0.46), [1.05, 0.62, 1.25]))
      group.add(mesh(sphere(0.18, 18, 12), s.joint, v3(0, -0.04, 0.47), [1.0, 0.28, 1.15]))
      const finger = bone(); finger.position.set(0, 0.12, 0.26)
      finger.add(mesh(sphere(0.2, 20, 14), B, v3(0, 0, 0.21), [1.0, 0.6, 1.25]))
      finger.add(mesh(sphere(0.17, 18, 12), s.joint, v3(0, -0.07, 0.22), [0.95, 0.26, 1.1]))
      group.add(finger)
      const hold = bone(); hold.position.set(0, 0.02, 0.5); group.add(hold)
      return { group, finger, open: 0.75, hold }
    },
  }))
  return { shell, legs, arms, top: rimY + sh.height(0, 0), sh, rimY, visor, eyeX: 0.2, eyeR: 0.15, face: { w: 256, h: 120, dx: 56, k: 1.45, lw: 15 }, rough: 0.5, env: 0.45, tone: 1 }
}

BUILD.tank = function () {
  const s = shared()
  const rimY = 0.42
  const sh = shellShape({ rx: 1.28, rz: 0.86, h: 0.3, d: 0.22, p: 7, q: 0.32, segR: 24, segT: 112, outline: sqOutline(5),
    underRows: [[1, 0], [0.995, -0.45], [0.985, -0.85], [0.95, -1], [0.4, -1]] })
  const shell = bone('shell'); shell.position.y = rimY
  shell.add(mesh(sh.top(), B), mesh(sh.under(), s.charcoal))
  // Panel seams and bolts on the flat top.
  const y = sh.height(0, 0) + 0.004
  shell.add(mesh(roundBox(1.9, 0.014, 0.03, 0.006, 1), ROLE.accent, v3(0, y, 0.1)))
  for (const side of [-1, 1]) shell.add(mesh(roundBox(0.03, 0.014, 1.2, 0.006, 1), ROLE.accent, v3(side * 0.46, y, -0.05)))
  const bolt = new T.CylinderGeometry(0.035, 0.035, 0.02, 10)
  for (const [bx, bz] of [[-0.8, 0.42], [0.8, 0.42], [-0.8, -0.42], [0.8, -0.42], [0, 0.42], [0, -0.5], [-0.3, -0.25], [0.3, -0.25]]) shell.add(mesh(bolt, s.steel, v3(bx, sh.height(Math.atan2(bz, bx), 0.5) + 0.006, bz)))
  const visor = new T.Group(); visor.position.set(0, 0.04, 0.86)
  visor.add(mesh(roundBox(1.46, 0.24, 0.07, 0.08, 3), s.bezel))
  visor.add(screen(new T.PlaneGeometry(1.34, 0.17), v3(0, 0, 0.036)))
  shell.add(visor)
  const legs = []
  for (const side of [-1, 1]) [[0.36, 0.38], [-0.06, 0], [-0.46, -0.36]].forEach(([z, th], i) => {
    legs.push(makeLeg(side, v3(side * 1.1, rimY - 0.1, z), side > 0 ? th : Math.PI - th, {
      up: 0.62, L1: 0.36, a2: 1.15,
      upper: L => { const g = new T.Group(); g.add(mesh(roundBox(L + 0.06, 0.24, 0.26, 0.06, 3), B, v3(L / 2, 0, 0))); g.add(mesh(new T.CylinderGeometry(0.1, 0.1, 0.3, 14), s.steel, v3(L, 0, 0), null, [Math.PI / 2, 0, 0])); return g },
      lower: (L, a2) => { const g = new T.Group(); g.add(mesh(roundBox(L * 0.8, 0.22, 0.24, 0.06, 3), B, v3(L * 0.4, 0, 0))); g.add(mesh(roundBox(0.34, 0.14, 0.34, 0.05, 3), s.charcoal, v3(L * 0.93, -0.02, 0), null, [0, 0, a2])); return g },
    }, i))
  })
  const blockClaw = () => {
    const group = new T.Group()
    group.add(mesh(roundBox(0.36, 0.32, 0.38, 0.07, 3), B, v3(0, 0, 0.16)))
    group.add(mesh(roundBox(0.3, 0.13, 0.42, 0.04, 3), B, v3(0, -0.1, 0.5)))
    group.add(mesh(roundBox(0.26, 0.04, 0.38, 0.015, 2), s.steel, v3(0, -0.035, 0.5)))
    const finger = bone(); finger.position.set(0, 0.07, 0.3)
    finger.add(mesh(roundBox(0.3, 0.12, 0.42, 0.04, 3), B, v3(0, 0.02, 0.2)))
    finger.add(mesh(roundBox(0.26, 0.04, 0.38, 0.015, 2), s.steel, v3(0, -0.04, 0.2)))
    group.add(finger)
    const hold = bone(); hold.position.set(0, 0, 0.5); group.add(hold)
    return { group, finger, open: 0.55, hold }
  }
  const arms = [-1, 1].map(side => makeArm(side, v3(side * 0.78, rimY - 0.04, 0.72), {
    yaw: 0.7, bend: 1.0, L1: 0.3, L2: 0.28, raise: -0.05, roll: 0.3, wristYaw: 0.2,
    upper: () => { const g = new T.Group(); g.add(mesh(roundBox(0.2, 0.2, 0.3, 0.06, 3), B, v3(0, 0, 0.15))); g.add(mesh(new T.CylinderGeometry(0.12, 0.12, 0.26, 14), s.steel, null, null, [0, 0, Math.PI / 2])); return g },
    fore: () => mesh(roundBox(0.2, 0.2, 0.3, 0.06, 3), B, v3(0, 0, 0.14)),
    claw: blockClaw,
  }))
  // A fiddler: the right claw is big, the left one small.
  arms[1].scale.setScalar(1.45); arms[0].scale.setScalar(0.78)
  return { shell, legs, arms, top: rimY + sh.height(0, 0), sh, rimY, visor, eyeX: 0.25, eyeR: 0.1, face: { w: 384, h: 64, dx: 70, k: 0.95, lw: 10 }, rough: 0.5, env: 0.45, tone: 1 }
}

BUILD.retro = function () {
  const s = shared()
  const rimY = 0.56
  const sh = shellShape({ rx: 0.98, rz: 0.84, h: 0.56, d: 0.26, p: 2.2, q: 0.62, segR: 22, segT: 88, outline: sqOutline(2.6),
    underRows: [[1, 0], [0.99, -0.4], [0.97, -0.8], [0.9, -1], [0.4, -1]] })
  const shell = bone('shell'); shell.position.y = rimY
  // Cream panels with the critter's colour as trim.
  shell.add(mesh(sh.top(), s.cream), mesh(sh.under(), B))
  shell.add(mesh(bandGeo(sh, -Math.PI / 2 - 0.12, -Math.PI / 2 + 0.12, 0.05, sh.height(0, 0) - 0.001, 0.004, 6, 12), B))
  shell.add(mesh(bandGeo(sh, Math.PI / 2 - 0.12, Math.PI / 2 + 0.12, 0.42, sh.height(0, 0) - 0.001, 0.004, 6, 12), B))
  const visor = new T.Group()
  visor.add(mesh(new T.TorusGeometry(0.27, 0.055, 12, 36), B))
  visor.add(mesh(new T.CircleGeometry(0.26, 36), s.porthole, v3(0, 0, -0.01)))
  visor.add(screen(new T.CircleGeometry(0.235, 36), v3(0, 0, 0.004)))
  const dome = mesh(new T.SphereGeometry(0.24, 24, 8, 0, Math.PI * 2, 0, 0.5), s.dome, v3(0, 0, -0.2), null, [Math.PI / 2, 0, 0])
  dome.userData.keep = 'dome'
  visor.add(dome)
  onFront(sh, visor, 0.25, 0.02)
  shell.add(visor)
  const top = sh.height(0, 0)
  shell.add(mesh(new T.CylinderGeometry(0.03, 0.04, 0.2, 10), s.chrome, v3(0, top + 0.09, -0.15)))
  shell.add(mesh(sphere(0.075, 14, 10), B, v3(0, top + 0.21, -0.15)))
  const ribs = (r, n, x0) => { const g = new T.Group(); for (let k = 0; k < n; k++) g.add(mesh(new T.CylinderGeometry(r, r, 0.035, 16), k % 2 ? s.cream : B, v3(x0 + k * 0.045, 0, 0), null, [0, 0, Math.PI / 2])); return g }
  const legs = []
  for (const side of [-1, 1]) [[0.3, 0.4], [-0.08, 0], [-0.44, -0.4]].forEach(([z, th], i) => {
    legs.push(makeLeg(side, v3(side * 0.84, rimY - 0.12, z), side > 0 ? th : Math.PI - th, {
      up: 0.8, L1: 0.44, a2: 1.05,
      upper: L => { const g = taper([v3(0.12, 0, 0), v3(L - 0.08, 0, 0)], 0.1, 0.1, s.cream, { seg: 2, radial: 14 }); g.add(ribs(0.14, 4, 0.0)); g.add(ribs(0.135, 4, L - 0.08)); return g },
      lower: L => { const g = taper([v3(0.1, 0, 0), v3(L * 0.84, 0, 0)], 0.095, 0.08, s.cream, { seg: 2, radial: 14 }); g.add(mesh(sphere(0.135, 16, 12), B, v3(L * 0.92, 0, 0), [0.8, 1, 1])); return g },
    }, i))
  })
  const arms = [-1, 1].map(side => makeArm(side, v3(side * 0.6, rimY - 0.06, 0.66), {
    yaw: 0.75, bend: 1.0, L1: 0.34, L2: 0.3, raise: -0.08, roll: 0.45, wristYaw: 0.2,
    upper: () => { const g = taper([v3(0, 0, 0.1), v3(0, 0, 0.3)], 0.07, 0.07, s.cream, { seg: 2, radial: 14 }); const r = ribs(0.11, 3, 0); r.rotation.y = -Math.PI / 2; g.add(r); const r2 = ribs(0.1, 3, 0); r2.rotation.y = -Math.PI / 2; r2.position.z = 0.28; g.add(r2); return g },
    fore: () => taper([v3(0, 0, 0.06), v3(0, 0, 0.3)], 0.07, 0.08, s.cream, { seg: 2, radial: 14 }),
    claw: () => pincer({
      pw: 0.3, ph: 0.28, pl: 0.56, palmMat: s.cream, fingerMat: B,
      fixed: [v3(0, -0.09, 0.38), v3(0, -0.1, 0.6), v3(0, -0.03, 0.8), v3(0, 0.03, 0.85)], fr0: 0.1, fr1: 0.06,
      hinge: v3(0, 0.11, 0.38),
      moving: [v3(0, 0, 0), v3(0, 0.03, 0.22), v3(0, -0.04, 0.4), v3(0, -0.09, 0.45)], mr0: 0.095, mr1: 0.055,
      open: 0.6,
    }),
  }))
  return { shell, legs, arms, top: rimY + top + 0.12, sh, rimY, visor, eyeX: 0.085, eyeR: 0.07, face: { w: 160, h: 160, dx: 34, k: 0.95, lw: 11, round: true, scan: true }, rough: 0.45, env: 0.55, tone: 1 }
}

BUILD.sleek = function () {
  const s = shared()
  const rimY = 0.52
  const sh = shellShape({ rx: 1.0, rz: 0.84, h: 0.5, d: 0.22, p: 2.0, q: 0.55, segR: 24, segT: 96, outline: th => sqOutline(2.3)(th) * (1 + 0.05 * Math.sin(th)),
    underRows: [[1, 0], [0.98, -0.45], [0.92, -0.85], [0.8, -1], [0.4, -1]] })
  const shell = bone('shell'); shell.position.y = rimY
  shell.add(mesh(sh.top(), B), mesh(sh.under(), s.dark))
  // The dark band round the front is its screen: the eyes glow in it.
  shell.add(screen(bandGeo(sh, Math.PI / 2 - 1.2, Math.PI / 2 + 1.2, 0.05, 0.2, 0.006, 40, 4), null))
  const visor = new T.Group(); onFront(sh, visor, 0.125, 0.02); shell.add(visor)
  const legs = []
  for (const side of [-1, 1]) [[0.3, 0.42], [-0.1, 0], [-0.46, -0.4]].forEach(([z, th], i) => {
    legs.push(makeLeg(side, v3(side * 0.82, rimY - 0.1, z), side > 0 ? th : Math.PI - th, {
      up: 0.68, L1: 0.46, a2: 0.98,
      upper: L => { const g = taper([v3(0, 0, 0), v3(L, 0, 0)], 0.115, 0.1, B, { seg: 3, radial: 14 }); g.add(mesh(sphere(0.135, 16, 12), s.pearl)); g.add(mesh(sphere(0.125, 16, 12), s.pearl, v3(L, 0, 0))); return g },
      lower: L => { const g = taper([v3(0, 0, 0), v3(L * 0.5, 0.06, 0), v3(L * 0.97, 0, 0)], 0.1, 0.07, B, { seg: 8, radial: 14, bulge: 0.015 }); g.add(mesh(sphere(0.08, 12, 10), s.dark, v3(L * 0.97, 0, 0))); return g },
    }, i))
  })
  const arms = [-1, 1].map(side => makeArm(side, v3(side * 0.6, rimY - 0.05, 0.64), {
    yaw: 0.78, bend: 1.05, L1: 0.34, L2: 0.32, raise: -0.08, roll: 0.45, wristYaw: 0.2,
    upper: () => { const g = taper([v3(0, 0, 0), v3(0, 0, 0.34)], 0.085, 0.08, B, { seg: 3, radial: 14 }); g.add(mesh(sphere(0.11, 16, 12), s.pearl)); g.add(mesh(sphere(0.1, 16, 12), s.pearl, v3(0, 0, 0.34))); return g },
    fore: () => taper([v3(0, 0, 0), v3(0, 0, 0.32)], 0.08, 0.1, B, { seg: 3, radial: 14 }),
    claw: () => pincer({
      pw: 0.24, ph: 0.22, pl: 0.62,
      fixed: [v3(0, -0.06, 0.4), v3(0, -0.07, 0.62), v3(0, -0.02, 0.8), v3(0, 0.02, 0.84)], fr0: 0.085, fr1: 0.03,
      hinge: v3(0, 0.08, 0.42),
      moving: [v3(0, 0, 0), v3(0, 0.03, 0.22), v3(0, -0.03, 0.38), v3(0, -0.06, 0.42)], mr0: 0.08, mr1: 0.028,
      open: 0.55,
    }),
  }))
  return { shell, legs, arms, top: rimY + sh.height(0, 0), sh, rimY, visor, eyeX: 0.2, eyeR: 0.09, face: { w: 512, h: 64, dx: 58, k: 0.62, lw: 7, bg: '#0c0d10' }, rough: 0.3, env: 0.6, tone: 1 }
}

// The screen: a mesh each robot keeps with its own face texture.
function screen(geo, pos) {
  const m = mesh(geo, null, pos)
  m.userData.keep = 'screen'
  return m
}

// ---------------------------------------------------------------------------
// Accessories, one per kind of helper, kept small.

function accessorize(kind, b, root) {
  const s = shared()
  if (kind === 'lead') {
    // The lead's gem floats over it, as on the classic critters.
    const gem = mesh(new T.OctahedronGeometry(0.17, 0), null, v3(0, b.top + 0.42, 0), [1, 1.35, 1])
    gem.userData.keep = 'gem'
    root.add(gem)
    return b.top + 0.42 + 0.24
  }
  if (kind === 'plan') {
    const cap = new T.Group(); cap.position.set(0, b.top - b.rimY - 0.05, -0.2); cap.rotation.x = -0.12; cap.scale.setScalar(0.8)
    cap.add(mesh(new T.SphereGeometry(0.4, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), ROLE.accent, null, [1, 0.6, 1]))
    cap.add(mesh(new T.CylinderGeometry(0.3, 0.3, 0.04, 24, 1, false, -Math.PI / 2, Math.PI), ROLE.accent, v3(0, 0.01, 0.2), [1, 1, 1.3]))
    cap.add(mesh(sphere(0.055, 10, 8), s.white, v3(0, 0.24, 0)))
    b.shell.add(cap)
    return b.top + 0.2
  }
  if (kind === 'test') {
    for (const side of [-1, 1]) {
      const at = b.sh.surf(Math.PI / 2 - side * 0.9, 0.3)
      const base = at.p.clone().add(v3(0, -0.03, -0.1))
      const tip = base.clone().add(v3(side * 0.24, 0.46, 0.04))
      b.shell.add(taper([base, base.clone().add(v3(side * 0.05, 0.27, 0.06)), tip], 0.028, 0.02, s.frame, { radial: 6, seg: 6 }))
      b.shell.add(mesh(sphere(0.07, 12, 8), ROLE.accent, tip))
    }
    return b.top + 0.5
  }
  if (kind === 'review') {
    // Reading glasses on its screen.
    for (const side of [-1, 1]) b.visor.add(mesh(new T.TorusGeometry(b.eyeR, 0.022, 8, 24), s.frame, v3(side * b.eyeX, 0, 0.07)))
    b.visor.add(mesh(new T.CylinderGeometry(0.016, 0.016, Math.max(0.04, 2 * (b.eyeX - b.eyeR)), 8), s.frame, v3(0, 0.03, 0.07), null, [0, 0, Math.PI / 2]))
    return b.top
  }
  if (kind === 'research') {
    // A magnifier held up in its right claw.
    const hold = tagged(b.arms[1], 'hold')
    const mg = new T.Group(); mg.rotation.x = 0.2; mg.scale.setScalar(0.75)
    mg.add(mesh(new T.CylinderGeometry(0.035, 0.04, 0.32, 8), s.frame, v3(0, 0.12, 0)))
    const lens = new T.Group(); lens.position.set(0, 0.5, 0)
    lens.add(mesh(new T.TorusGeometry(0.22, 0.04, 10, 28), s.frame))
    const glass = mesh(new T.CircleGeometry(0.21, 28), s.glass)
    glass.userData.keep = 'glass'
    lens.add(glass)
    mg.add(lens)
    hold.add(mg)
    return b.top
  }
  return b.top
}

// ---------------------------------------------------------------------------
// Templates: one per design and accessory, shared by every robot built
// from it while the robot style is on.

const templates = new Map()

function template(variant, accessory) {
  const key = `${variant}|${accessory ?? ''}`
  let tpl = templates.get(key)
  if (tpl) return tpl
  made = []
  sphereCache = new Map()
  const b = BUILD[variant]()
  // The tree: body (bobs and breathes) > shell, legs, arms.
  const body = bone('body')
  body.add(b.shell, ...b.legs, ...b.arms)
  const top = accessorize(accessory, b, body)
  body.updateMatrixWorld(true)
  const box = new T.Box3().setFromObject(body)

  // Every bone gets a name, so a robot's own copy can find its bones.
  const bones = []
  body.traverse(o => { if (o.isBone) { o.name = `b${bones.length}`; bones.push(o) } })
  const index = new Map(bones.map((x, i) => [x, i]))

  // Every mesh not kept is merged, by material, into one skinned geometry.
  const groups = new Map()
  const kept = new Set()
  const drop = []
  body.traverse(o => {
    if (!o.isMesh) return
    if (o.userData.keep) { kept.add(o.geometry); return }
    let p = o.parent
    while (!p.isBone) p = p.parent
    const mat = o.material
    if (!groups.has(mat)) groups.set(mat, [])
    groups.get(mat).push({ geo: o.geometry, matrix: o.matrixWorld.clone(), bone: index.get(p) })
    drop.push(o)
  })
  for (const o of drop) o.removeFromParent()
  prune(body)

  const parts = []
  for (const [mat, list] of groups) {
    const geometry = merge(list)
    geometry.userData.shared = true
    parts.push({ role: mat.role ?? null, material: mat.role ? null : mat, geometry })
  }
  for (const g of made) if (!kept.has(g)) g.dispose()
  made = []
  sphereCache = new Map()
  for (const g of kept) g.userData.shared = true

  const size = box.getSize(new T.Vector3()), centre = box.getCenter(new T.Vector3())
  // Generous, so a robot mid-hop or waving a claw never gets culled.
  const sphereB = box.getBoundingSphere(new T.Sphere())
  sphereB.radius *= 1.6
  // What the pointer hits: its shell and claws, not the far reach of its legs.
  const pick = new T.BoxGeometry(size.x * 0.8, size.y, size.z * 0.9)
  pick.translate(centre.x, centre.y, centre.z)
  pick.userData.shared = true

  tpl = {
    key, variant, accessory, body, bones: bones.map(x => x.name), inverses: bones.map(x => x.matrixWorld.clone().invert()),
    // A clone takes its rotations from the quaternion, which turns a yaw
    // past 90° into a flip about x and z: each robot puts these back.
    rest: bones.map(x => x.rotation.clone()),
    parts, kept: [...kept], sphere: sphereB, pick, top: b.top, height: Math.max(top, box.max.y),
    face: b.face, rough: b.rough, env: b.env, tone: b.tone, users: 0,
    dots: [0.55, b.top + 0.3, 0],
  }
  templates.set(key, tpl)
  return tpl
}

// Drop the groups left empty once their meshes were merged.
function prune(o) {
  for (const c of [...o.children]) prune(c)
  if (!o.isBone && !o.isMesh && o.parent && !o.children.length) o.removeFromParent()
}

// One indexed geometry from many, each moved by its matrix and bound
// wholly to one bone.
function merge(list) {
  let vCount = 0, iCount = 0
  for (const { geo } of list) {
    vCount += geo.attributes.position.count
    iCount += geo.index ? geo.index.count : geo.attributes.position.count
  }
  const pos = new Float32Array(vCount * 3), nor = new Float32Array(vCount * 3)
  const skinI = new Uint16Array(vCount * 4), skinW = new Float32Array(vCount * 4)
  const idx = vCount > 65535 ? new Uint32Array(iCount) : new Uint16Array(iCount)
  const p = new T.Vector3(), n = new T.Vector3(), nm = new T.Matrix3()
  let vo = 0, io = 0
  for (const { geo, matrix, bone: bi } of list) {
    if (!geo.attributes.normal) geo.computeVertexNormals()
    const P = geo.attributes.position, N = geo.attributes.normal
    nm.getNormalMatrix(matrix)
    for (let i = 0; i < P.count; i++) {
      p.fromBufferAttribute(P, i).applyMatrix4(matrix)
      n.fromBufferAttribute(N, i).applyMatrix3(nm).normalize()
      pos.set([p.x, p.y, p.z], (vo + i) * 3)
      nor.set([n.x, n.y, n.z], (vo + i) * 3)
      skinI[(vo + i) * 4] = bi
      skinW[(vo + i) * 4] = 1
    }
    if (geo.index) for (let i = 0; i < geo.index.count; i++) idx[io + i] = geo.index.getX(i) + vo
    else for (let i = 0; i < P.count; i++) idx[io + i] = i + vo
    // A mirrored part (a negative scale) would face inward: flip its winding.
    if (matrix.determinant() < 0) for (let i = io; i < io + (geo.index ? geo.index.count : P.count); i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t }
    io += geo.index ? geo.index.count : P.count
    vo += P.count
  }
  const g = new T.BufferGeometry()
  g.setAttribute('position', new T.BufferAttribute(pos, 3))
  g.setAttribute('normal', new T.BufferAttribute(nor, 3))
  g.setAttribute('skinIndex', new T.BufferAttribute(skinI, 4))
  g.setAttribute('skinWeight', new T.BufferAttribute(skinW, 4))
  g.setIndex(new T.BufferAttribute(idx, 1))
  g.computeBoundingSphere()
  return g
}

// Free every template no robot is using (after switching back to classic).
export function trimRobots() {
  for (const [key, tpl] of templates) {
    if (tpl.users > 0) continue
    for (const p of tpl.parts) p.geometry.dispose()
    for (const g of tpl.kept) g.dispose()
    tpl.pick.dispose()
    templates.delete(key)
  }
}


// ---------------------------------------------------------------------------
// The screen face: a small canvas drawn with the studio's glyphs, at about
// half the studio's resolution (plenty at office size).

const FACE_SCALE = 0.6
function makeFace(o) {
  const q = FACE_SCALE
  const W = Math.round((o.w ?? 256) * q), H = Math.round((o.h ?? 90) * q)
  const dx = (o.dx ?? 50) * q, k = (o.k ?? 1) * q, lw = (o.lw ?? 12) * q
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const g = cv.getContext('2d')
  const tex = new T.CanvasTexture(cv)
  tex.colorSpace = T.SRGBColorSpace
  tex.anisotropy = 4
  function draw(name) {
    const f = FACES[name] ?? FACES.happy
    g.save()
    g.fillStyle = o.bg ?? '#0b0b0d'; g.fillRect(0, 0, W, H)
    if (o.round) { const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); gr.addColorStop(0, '#1c2420'); gr.addColorStop(1, '#070908'); g.fillStyle = gr; g.fillRect(0, 0, W, H) }
    const sheen = g.createLinearGradient(0, 0, 0, H); sheen.addColorStop(0, 'rgba(255,255,255,0.06)'); sheen.addColorStop(0.5, 'rgba(255,255,255,0)')
    g.fillStyle = sheen; g.fillRect(0, 0, W, H)
    if (o.scan) { g.fillStyle = 'rgba(255,255,255,0.035)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1.5) }
    g.strokeStyle = g.fillStyle = '#ffffff'
    g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'
    g.shadowColor = 'rgba(255,255,255,0.9)'; g.shadowBlur = lw * 0.85
    for (const s of [-1, 1]) {
      const x = W / 2 + s * dx + f.ox * k, y = H / 2 + f.oy * k
      g.beginPath()
      if (f.glyph === 'happy') { g.moveTo(x - 19 * k, y + 9 * k); g.lineTo(x, y - 11 * k); g.lineTo(x + 19 * k, y + 9 * k) }
      else if (f.glyph === 'work') { g.moveTo(x - 17 * k, y); g.lineTo(x + 17 * k, y); g.moveTo(x, y - 17 * k); g.lineTo(x, y + 17 * k) }
      else if (f.glyph === 'blink') { g.moveTo(x - 19 * k, y + 3 * k); g.lineTo(x + 19 * k, y + 3 * k) }
      else if (f.glyph === 'wow') { g.arc(x, y, 15 * k, 0, Math.PI * 2) }
      else if (f.glyph === 'cheer') { const d = -s; g.moveTo(x - d * 16 * k, y - 15 * k); g.lineTo(x + d * 14 * k, y); g.lineTo(x - d * 16 * k, y + 15 * k) }
      else if (f.glyph === 'look') { g.arc(x, y, 11 * k, 0, Math.PI * 2); g.fill(); continue }
      g.stroke()
    }
    g.restore()
    tex.needsUpdate = true
  }
  return { tex, draw }
}

// ---------------------------------------------------------------------------
// A robot

export function makeRobot({ build = 'general-purpose', bodyColor, inkColor, accentColor, pick }) {
  const { variant, accessory } = robotFor(build)
  const tpl = template(variant, accessory)
  tpl.users++
  const s = shared()
  const root = new T.Group()
  const rig = new T.Group()
  root.add(rig)
  const body = tpl.body.clone(true)
  rig.add(body)
  const byName = new Map()
  body.traverse(o => { if (o.isBone) byName.set(o.name, o) })
  const own = tpl.bones.map(n => byName.get(n))
  own.forEach((b, i) => b.rotation.copy(tpl.rest[i]))
  const skeleton = new T.Skeleton(own, tpl.inverses)

  const bodyMat = new T.MeshStandardMaterial({ color: bodyColor, roughness: tpl.rough, envMapIntensity: tpl.env })
  const accentMat = new T.MeshStandardMaterial({ color: accentColor, roughness: 0.35, envMapIntensity: 0.6 })
  const face = makeFace(tpl.face)
  const screenMat = new T.MeshStandardMaterial({ map: face.tex, emissiveMap: face.tex, emissive: '#ffffff', emissiveIntensity: 1.1, roughness: 0.15, envMapIntensity: 0.6, side: variant === 'sleek' ? T.DoubleSide : T.FrontSide })
  let bulb = null
  body.traverse(o => {
    if (!o.isMesh) return
    if (o.userData.keep === 'screen') o.material = screenMat
    else if (o.userData.keep === 'gem') {
      o.material = new T.MeshStandardMaterial({ color: accentColor ?? GEM, emissive: accentColor ?? GEM, emissiveIntensity: 0.25, roughness: 0.25, flatShading: true })
      o.castShadow = true
      bulb = o
    }
  })
  for (const part of tpl.parts) {
    const m = new T.SkinnedMesh(part.geometry, part.role === 'body' ? bodyMat : part.role === 'accent' ? accentMat : part.material)
    m.bind(skeleton, IDENTITY)
    m.boundingSphere = tpl.sphere
    m.raycast = () => {}
    m.castShadow = true
    body.add(m)
  }
  // What the pointer hits.
  const proxy = new T.Mesh(tpl.pick, s.pick)
  body.add(proxy)

  // Thought dots, like the classic critters'.
  const dots = new T.Group()
  dots.position.fromArray(tpl.dots)
  dots.visible = false
  ;[0.11, 0.15, 0.2].forEach((r, i) => {
    const d = new T.Mesh(DOT_GEO, s.dot)
    d.scale.setScalar(r)
    d.position.set(i * 0.24, i * 0.3, 0)
    d.userData.r = r
    dots.add(d)
  })
  body.add(dots)
  root.traverse(o => { if (o.isMesh && pick) o.userData.pick = pick })
  for (const o of [proxy, ...dots.children]) o.castShadow = false

  const legs = []
  const arms = []
  body.traverse(o => {
    if (o.userData.leg) {
      const lift = o.children.find(x => x.isBone)
      legs.push({ hip: o, lift, knee: lift.children.find(x => x.isBone), ...o.userData.leg })
    }
    if (o.userData.arm) {
      const elbow = o.children.find(x => x.isBone)
      const wrist = elbow.children.find(x => x.isBone)
      arms.push({ shoulder: o, elbow, wrist, finger: tagged(o, 'finger'), hold: tagged(o, 'hold'), ...o.userData.arm })
    }
  })
  arms.sort((a, b) => a.side - b.side)

  const c = {
    style: 'robot', build, variant, accessory, pick, tpl, inkColor,
    root, rig, body, shell: tagged(body, 'shell'), skeleton, legs, arms, dots, bulb,
    bodyMat, accentMat, screenMat, face, faceKey: '',
    height: tpl.height, top: tpl.top, hold: [0, 0.1, 0],
    seed: Math.random() * 10, blinkAt: 1 + Math.random() * 3, gait: Math.random() * 6, side: 0,
    clawT: arms.map(() => ({ raise: 0, yaw: 0, bend: 0, open: 0, roll: 0 })),
    legT: legs.map(() => ({ lift: 0, swing: 0, knee: 0 })),
    o: NO_OPTS, t: 0, wall: 0,
  }
  c.gemY = bulb?.position.y ?? 0
  setFace(c, 'happy')
  return c
}

function setFace(c, key) {
  if (key === c.faceKey) return
  c.faceKey = key
  c.face.draw(key)
}

export function disposeRobot(c) {
  if (c.disposed) return
  c.disposed = true
  c.root.removeFromParent()
  for (const m of [c.bodyMat, c.accentMat, c.screenMat, c.bulb?.material]) m?.dispose()
  c.face.tex.dispose()
  c.skeleton.dispose()
  c.tpl.users--
}

// Pose: the office calls pose() then emote() each frame. pose() notes
// what it's told; emote() knows the mood too, so it does the posing.
export function robotPose(c, t, opts = NO_OPTS) {
  c.t = t
  c.o = opts
}

const clamp01 = x => Math.max(0, Math.min(1, x))

export function robotEmote(c, now, mood, still = false) {
  const o = c.o, t = c.t
  const wall = performance.now() / 1000
  const dt = Math.min(0.1, Math.max(0, wall - (c.wall || wall)))
  c.wall = wall
  const ease = (obj, axis, target, k) => { obj[axis] += (target - obj[axis]) * (1 - Math.exp(-k * dt)) }
  const S = still ? 0.25 : 1
  const busy = o.busy ?? 0
  const state = stateOf({ asleep: o.asleep, walk: o.walk, asking: o.asking, busy, mood })
  const move = moveOf(state)
  const env = mood?.kind ? envelope(mood.k) : 0

  let bodyY = 0, bodyRX = 0, bodyRZ = 0, rigY = 0
  const breathe = Math.sin(t * (move === 'rest' ? 0.9 : 2.1) + c.seed) * 0.022 * S
  let sy = 1 + breathe
  const claw = c.clawT, legs = c.legT
  c.arms.forEach((a, i) => { const cl = claw[i]; cl.raise = a.raise; cl.yaw = a.yaw; cl.bend = 0; cl.open = 0; cl.roll = 0 })
  for (const l of legs) { l.lift = 0; l.swing = 0; l.knee = 0 }
  c.dots.visible = false
  const left = claw[0], right = claw[claw.length - 1]

  if (move === 'idle') {
    const fid = Math.pow(Math.max(0, Math.sin(t * 0.9 + c.seed)), 12)
    left.open = 0.15 + 0.85 * fid
    left.raise += -0.15 * fid * S
    right.open = 0.1 + 0.3 * Math.pow(Math.max(0, Math.sin(t * 0.7 + 2 + c.seed)), 10)
    claw.forEach((cl, i) => { cl.yaw += Math.sin(t * 1.2 + i * 2 + c.seed) * 0.05 * S })
    bodyRZ = Math.sin(t * 0.8 + c.seed) * 0.015 * S
    if (state === 'perk') {
      // You just answered: it looks up, with a little hop.
      bodyRX = -0.12 * env
      if (!still) rigY = Math.sin(clamp01(mood.k * 2.5) * Math.PI) * 0.18
    } else if (state === 'yawn') {
      // A slow stretch, claws up and wide.
      for (const cl of claw) { cl.raise = cl.raise + (-1.0 - cl.raise) * env; cl.open = 0.8 * env }
      bodyRX = -0.1 * env
    }
  } else if (move === 'walk') {
    // A sideways robotic scuttle: legs lift in a stepped, servo-like beat.
    c.gait += dt * 13 * (still ? 0.4 : 1)
    c.legs.forEach((l, i) => {
      const ph = c.gait + (l.i % 2 ? Math.PI : 0) + (l.side > 0 ? Math.PI : 0)
      const up = clamp01(Math.sin(ph) * 2.2)
      legs[i].lift = up * 0.32 * S
      legs[i].knee = -up * 0.25 * S
      legs[i].swing = Math.tanh(Math.cos(ph) * 3) * 0.22 * S * l.side
    })
    bodyY = Math.round(Math.abs(Math.sin(c.gait)) * 3) / 3 * 0.04 * S
    bodyRZ = Math.sin(c.gait * 2) * 0.02 * S
    claw.forEach((cl, i) => { cl.raise += -0.08 + Math.sin(c.gait + i) * 0.05 * S; cl.open = 0.15 })
  } else if (move === 'work') {
    // Claw clack: both claws forward, snapping in turn.
    claw.forEach((cl, i) => {
      cl.raise += 0.18
      cl.yaw += -0.12
      cl.open = Math.max(0, Math.sin(t * 13 + i * Math.PI + c.seed)) * (still ? 0.6 : 1)
      cl.bend = 0.12
    })
    bodyY = Math.abs(Math.sin(t * 6.5 + c.seed)) * 0.03 * S
    bodyRX = 0.07
  } else if (move === 'think') {
    // One claw up near the chin, tapping; eyes up on its screen.
    // (beside its screen, so the face still shows)
    right.raise = -0.75
    right.yaw += 0.15
    right.bend = 0.2
    const tap = Math.pow(Math.abs(Math.sin(t * 3.4)), 3)
    right.raise += -0.12 * tap * S
    right.open = 0.15 + 0.2 * tap
    left.open = 0.05
    bodyRX = -0.08
    bodyRZ = 0.05
    c.dots.visible = true
    c.dots.children.forEach((d, i) => d.scale.setScalar(d.userData.r * (still ? 1 : 1 + 0.35 * Math.max(0, Math.sin(((mood?.k ?? 0) - i / 3) * Math.PI * 2)))))
  } else if (move === 'cheer') {
    // A little jump (they're Jumpers), claws up and clacking.
    const hop = Math.abs(Math.sin(t * 4.2))
    rigY = still ? 0 : Math.pow(hop, 1.4) * 0.5 * env
    claw.forEach((cl, i) => {
      cl.raise = cl.raise + (-1.25 + (still ? 0 : Math.sin(t * 9 + i * Math.PI) * 0.15) - cl.raise) * env
      cl.yaw = cl.yaw * (1 - 0.45 * env)
      cl.open = (0.5 + 0.5 * Math.sin(t * 12 + i)) * env
      cl.bend = -0.25 * env
    })
    for (const l of legs) { l.lift = rigY * 0.9; l.knee = -rigY * 0.6 }
    bodyRX = -0.12 * env
    sy = 1 + (still ? 0 : (1 - hop) * 0.05 * env)
  } else if (move === 'wait') {
    // Waiting on you: one claw up, waving.
    left.raise = -1.3
    left.yaw = left.yaw * 0.35 + (still ? 0 : Math.sin(t * 6) * 0.35)
    left.bend = -0.2
    left.open = 0.55 + 0.45 * Math.sin(t * 6 + 1)
    left.roll = Math.sin(t * 6) * 0.3 * S
    right.open = 0.1
    bodyRZ = -0.08
    bodyRX = -0.06
  } else if (move === 'sulk') {
    // A slump: tipped forward, claws down and shut.
    bodyRX = 0.2 * env
    bodyY = -0.06 * env
    for (const cl of claw) { cl.raise += 0.3 * env; cl.open = 0 }
  } else if (move === 'rest') {
    // A past session: settled low, claws tucked.
    bodyY = -0.06
    for (const cl of claw) { cl.raise += 0.2; cl.open = 0 }
  }

  // A tool call: a quick clack of both claws and a bob.
  const hop = o.hop ?? 1
  if (hop < 1 && move !== 'cheer') {
    const snap = Math.sin(clamp01(hop) * Math.PI)
    for (const cl of claw) cl.open = Math.max(cl.open, snap)
    rigY += snap * 0.1 * S
  }
  // Context nearly full: both claws straight up, snapping.
  if (o.alarm) {
    claw.forEach((cl, i) => {
      cl.raise = -1.2 + (still ? 0 : Math.sin(t * 7 + i) * 0.15)
      cl.open = 0.6 * Math.abs(Math.sin(t * 14 + i))
    })
  }

  // Apply, easing toward the targets.
  c.rig.position.y = rigY
  ease(c.body.position, 'y', bodyY, 20)
  ease(c.body.rotation, 'x', bodyRX, 6)
  ease(c.body.rotation, 'z', bodyRZ, 6)
  // On the move it turns side-on, so it scuttles crab-wise.
  c.side += ((o.walk ? 1 : 0) - c.side) * (1 - Math.exp(-6 * dt))
  ease(c.rig.rotation, 'y', (o.look ?? 0) + c.side * Math.PI / 2, 8)
  if (c.shell) c.shell.scale.set(1 - breathe * 0.4, sy, 1 - breathe * 0.4)
  c.arms.forEach((a, i) => {
    const cl = claw[i]
    ease(a.shoulder.rotation, 'x', cl.raise, 14)
    ease(a.shoulder.rotation, 'y', cl.yaw, 14)
    ease(a.elbow.rotation, 'y', -a.side * (a.bend + cl.bend), 14)
    ease(a.wrist.rotation, 'z', a.wz + cl.roll, 14)
    ease(a.finger.rotation, 'x', -cl.open * a.open, 30)
  })
  c.legs.forEach((l, i) => {
    ease(l.lift.rotation, 'z', l.a1 + legs[i].lift, 30)
    ease(l.knee.rotation, 'z', -l.a1 - l.a2 + legs[i].knee, 30)
    ease(l.hip.rotation, 'y', l.yaw + legs[i].swing, 30)
  })

  // The face: drawn only when it changes.
  if (t > c.blinkAt + 0.14) c.blinkAt = t + 1.8 + Math.random() * 3.5
  const blinking = t > c.blinkAt && t < c.blinkAt + 0.14
  setFace(c, faceFor(state, t, blinking))
  c.screenMat.emissiveIntensity = state === 'asleep' ? 0.35 : 1.1

  if (c.bulb) {
    c.bulb.rotation.y = t * (0.6 + busy * 2.4)
    c.bulb.position.y = c.gemY + Math.sin(t * 2 + c.seed) * 0.05 * S
    c.bulb.material.emissiveIntensity = 0.15 + busy * (0.55 + 0.35 * Math.sin(t * 8))
  }
}

// One claw up and waving hello or goodbye (amount 0..1), after the pose.
export function robotWave(c, amount, now) {
  const a = c.arms[0]
  a.shoulder.rotation.x = a.raise + (-1.35 - a.raise) * amount
  a.shoulder.rotation.y = a.yaw * (1 - 0.6 * amount) + Math.sin(now * 16) * 0.35 * amount
  a.finger.rotation.x = -(0.5 + 0.5 * Math.sin(now * 16)) * a.open * amount
}

// On a coffee break: the mug claw forward, raised for a sip now and then.
export function robotSip(c, sipping) {
  const a = c.arms[c.arms.length - 1]
  a.shoulder.rotation.x = sipping ? -0.95 : -0.35
  a.shoulder.rotation.y = a.yaw * 0.5
  a.finger.rotation.x = -0.5 * a.open
}

export function robotHold(c, obj) {
  const a = c.arms[c.arms.length - 1]
  a.hold.add(obj)
  obj.position.set(0, 0.1, 0)
  obj.rotation.set(0, 0, 0)
}
