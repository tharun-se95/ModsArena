// The crab critter: a little robot crab after the Claude Bot mascot sheets.
// A cream dome shell with orange speckles and a spark on its belly, a
// glossy black visor whose glowing eyes are its face, two orange eyestalks,
// big pincers up front and three jointed legs a side. Built in the classic
// critters' unit space (feet at y = 0, facing +z) so the office could
// scale and place it the same way.
//
// The face is a small canvas drawn onto the visor, redrawn only when the
// expression changes (setFace). crabPose() breathes, blinks, taps its legs
// and clacks its claws.

import * as THREE from 'three'

export const SHELL = '#f2e3cc'
export const ORANGE = '#ef6a2e'
const UNDER = '#dcc8ac'
const INK = '#0b0c10'
const GLOW = '#dff3ff'
const HALO = '#5cb6ff'

// Shell radii and where its centre sits.
const R = { x: 1.08, y: 0.8, z: 0.95 }
const CY = 0.9

export const FACES = ['happy', 'blink', 'think', 'focused', 'surprised', 'laugh', 'sleepy', 'love']

// A tube along `points` whose radius runs r0 -> r1 (plus a mid bulge),
// capped with spheres: fingers, legs and stalks.
function taper(points, r0, r1, mat, { bulge = 0, radial = 16, seg = 14 } = {}) {
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
  for (const [p, r] of [[points[0], r0], [points.at(-1), r1]]) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.99, radial, 10), mat)
    cap.position.copy(p)
    g.add(cap)
  }
  return g
}

function ball(r, mat, [x, y, z] = [0, 0, 0], [sx, sy, sz] = [1, 1, 1]) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), mat)
  m.position.set(x, y, z)
  m.scale.set(sx, sy, sz)
  return m
}

const v = (x, y, z) => new THREE.Vector3(x, y, z)

// A small seeded random, so every crab wears the same speckles.
function rand(seed) {
  let s = seed >>> 0
  return () => ((s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x9e3779b9 >>> 0) / 4294967296)
}

// Ten rounded petals: the spark on its belly.
function spark(ctx, x, y, r, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = color
  for (let i = 0; i < 10; i++) {
    ctx.rotate(Math.PI / 5)
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.55, r * 0.13, r * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// The shell's skin, wrapped round the sphere's UVs: cream fading darker
// underneath, orange speckles over the top and sides, the spark low on
// the front (u = 0.25 faces +z).
function shellTexture(orange) {
  const W = 1024, H = 512
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, SHELL)
  g.addColorStop(0.55, SHELL)
  g.addColorStop(1, UNDER)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  const r = rand(7)
  ctx.fillStyle = orange
  for (let i = 0; i < 46; i++) {
    const u = r(), th = 0.35 + r() * 1.55 // latitude, from the top
    // Keep the visor and the spark clear.
    const du = Math.abs(u - 0.25)
    if (du < 0.16 && th > 0.75) continue
    const y = th / Math.PI * H
    const stretch = 1 / Math.max(0.35, Math.sin(th)) // the sphere pinches toward the top
    const size = 4 + r() * r() * 22
    ctx.globalAlpha = 0.55 + r() * 0.4
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
  ctx.translate(0.25 * W, 2.28 / Math.PI * H)
  ctx.scale(1 / Math.sin(2.28) * (R.y / R.x) * 0.95, 1)
  spark(ctx, 0, 0, 40, orange)
  ctx.restore()

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

// The visor: a rounded black faceplate with the eyes drawn on in glowing
// strokes. Everything outside the plate is clear (alphaTest trims it).
const FW = 512, FH = 300
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function stroke(ctx, path, width = 24) {
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

export function drawFace(ctx, face = 'happy') {
  ctx.clearRect(0, 0, FW, FH)
  ctx.save()
  roundRect(ctx, 6, 6, FW - 12, FH - 12, 118)
  const g = ctx.createRadialGradient(FW * 0.5, FH * 0.42, 20, FW * 0.5, FH * 0.5, FW * 0.6)
  g.addColorStop(0, '#14171d')
  g.addColorStop(1, '#030305')
  ctx.fillStyle = g
  ctx.fill()
  ctx.clip()

  const L = FW * 0.33, Rt = FW * 0.67, Y = FH * 0.5, r = 46
  const both = fn => { fn(L, -1); fn(Rt, 1) }
  if (face === 'happy') {
    both(x => stroke(ctx, () => ctx.arc(x, Y + 18, r, Math.PI * 1.12, Math.PI * 1.88)))
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
  } else if (face === 'love') {
    both(x => fillGlow(ctx, () => {
      const s = 1.15
      ctx.moveTo(x, Y + 30 * s)
      ctx.bezierCurveTo(x - 50 * s, Y - 4 * s, x - 30 * s, Y - 44 * s, x, Y - 18 * s)
      ctx.bezierCurveTo(x + 30 * s, Y - 44 * s, x + 50 * s, Y - 4 * s, x, Y + 30 * s)
    }))
  }

  // A soft sheen across the top of the glass.
  const sheen = ctx.createLinearGradient(0, 0, 0, FH * 0.4)
  sheen.addColorStop(0, 'rgba(255,255,255,0.10)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, FW, FH * 0.4)
  ctx.restore()
}

// One leg: hip -> knee -> foot, in the leg's own space (hip at the origin).
function leg(side, dz, mats) {
  const g = new THREE.Group()
  const knee = v(side * 0.42, 0.14, dz * 0.4)
  const foot = v(side * 0.62, -0.46, dz)
  g.add(taper([v(0, 0, 0), v(side * 0.22, 0.12, dz * 0.2), knee], 0.14, 0.12, mats.orange))
  g.add(ball(0.12, mats.joint, knee.toArray()))
  g.add(taper([knee, v(side * 0.58, -0.08, dz * 0.75), foot], 0.12, 0.035, mats.orange, { bulge: 0.025 }))
  return g
}

// One pincer arm, pivoting at the shoulder. Returns the pivot; the upper
// finger (`finger`) opens and closes.
function claw(side, mats) {
  const pivot = new THREE.Group()
  pivot.userData.side = side
  const elbow = v(side * 0.28, -0.18, 0.22)
  const wrist = v(side * 0.3, -0.12, 0.5)
  pivot.add(taper([v(0, 0, 0), elbow], 0.13, 0.12, mats.orange))
  pivot.add(ball(0.13, mats.joint, elbow.toArray()))
  pivot.add(taper([elbow, wrist], 0.12, 0.15, mats.orange))

  // The hand: a fat palm, a fixed lower jaw and a hinged upper finger,
  // tipped in toward the middle.
  const hand = new THREE.Group()
  hand.position.copy(wrist)
  hand.rotation.set(-0.15, -side * 0.35, -side * 0.25)
  hand.add(ball(0.33, mats.orange, [0, 0, 0.18], [1, 0.92, 1.2]))
  const jaw = taper([v(0, -0.1, 0.38), v(0, -0.08, 0.6), v(-side * 0.05, 0.03, 0.8)], 0.17, 0.035, mats.orange, { bulge: 0.03 })
  hand.add(jaw)
  const finger = new THREE.Group()
  finger.position.set(0, 0.13, 0.36)
  finger.add(taper([v(0, 0, 0), v(0, 0.07, 0.24), v(-side * 0.04, -0.07, 0.48)], 0.16, 0.03, mats.orange, { bulge: 0.035 }))
  hand.add(finger)
  pivot.add(hand)
  pivot.userData.finger = finger
  pivot.userData.hand = hand
  return pivot
}

// One eyestalk with its eye: orange socket, cream white, glossy black
// pupil with a glint. Pivots at its base.
function eyestalk(side, mats) {
  const g = new THREE.Group()
  g.add(taper([v(0, 0, 0), v(side * 0.02, 0.14, 0.02), v(side * 0.04, 0.24, 0.04)], 0.1, 0.085, mats.orange))
  const eye = new THREE.Group()
  eye.position.set(side * 0.05, 0.4, 0.06)
  eye.add(ball(0.23, mats.orange))
  eye.add(ball(0.2, mats.cream, [0, 0, 0.065]))
  eye.add(ball(0.165, mats.pupil, [0, 0, 0.14], [1, 1, 0.85]))
  eye.add(ball(0.045, mats.glint, [-0.06, 0.065, 0.27]))
  eye.rotation.y = side * 0.12
  g.add(eye)
  g.userData.eye = eye
  return g
}

export function makeCrab({ orange = ORANGE, pick, face = 'happy' } = {}) {
  const mats = {
    shell: new THREE.MeshPhysicalMaterial({ map: shellTexture(orange), roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.3 }),
    under: new THREE.MeshStandardMaterial({ color: UNDER, roughness: 0.55 }),
    orange: new THREE.MeshPhysicalMaterial({ color: orange, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
    joint: new THREE.MeshStandardMaterial({ color: '#c94d1d', roughness: 0.4 }),
    cream: new THREE.MeshStandardMaterial({ color: '#fbf3e6', roughness: 0.3 }),
    pupil: new THREE.MeshPhysicalMaterial({ color: '#08080a', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
    glint: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  }

  const root = new THREE.Group()
  const rig = new THREE.Group()
  root.add(rig)
  const top = new THREE.Group() // the shell and all it carries
  rig.add(top)

  // Shell and belly.
  const shell = ball(1, mats.shell, [0, CY, 0], [R.x, R.y, R.z])
  const belly = ball(1, mats.under, [0, CY - 0.36, 0], [R.x * 0.82, 0.32, R.z * 0.8])
  top.add(shell, belly)

  // The visor: a patch of a slightly bigger shell across the front.
  const canvas = document.createElement('canvas')
  canvas.width = FW
  canvas.height = FH
  const faceTex = new THREE.CanvasTexture(canvas)
  faceTex.colorSpace = THREE.SRGBColorSpace
  faceTex.anisotropy = 4
  const visorMat = new THREE.MeshPhysicalMaterial({
    map: faceTex, emissiveMap: faceTex, emissive: '#ffffff', emissiveIntensity: 1.25,
    roughness: 0.6, envMapIntensity: 0.1, specularIntensity: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.05, alphaTest: 0.5,
  })
  const pw = 1.9, ph = 1.08, tc = 1.42
  const visor = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32, Math.PI / 2 - pw / 2, pw, tc - ph / 2, ph), visorMat)
  visor.position.y = CY
  visor.scale.set(R.x * 1.012, R.y * 1.012, R.z * 1.012)
  top.add(visor)

  // Eyestalks on top of the shell.
  const stalks = [-1, 1].map(side => {
    const s = eyestalk(side, mats)
    s.position.set(side * 0.4, CY + 0.66, 0.12)
    s.rotation.z = -side * 0.12
    return s
  })
  top.add(...stalks)

  // Pincers out front at the shoulders.
  const arms = [-1, 1].map(side => {
    const a = claw(side, mats)
    a.position.set(side * 0.88, CY - 0.18, 0.32)
    return a
  })
  top.add(...arms)

  // Three legs a side, splayed front to back.
  const legs = []
  for (const side of [-1, 1]) {
    ;[0.36, 0, -0.38].forEach((z, i) => {
      const l = leg(side, z * 0.9, mats)
      l.position.set(side * 0.72, 0.46, z)
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
  visor.castShadow = false

  const c = {
    root, rig, top, shell, visor, stalks, arms, legs, mats, visorMat,
    faceCtx: canvas.getContext('2d'), faceTex, face: null, mood: face,
    height: CY + 1.3,
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
// `walk` is a sideways scuttle. Its resting expression is c.mood.
export function crabPose(c, t, { busy = 0, look = 0, hop = 0, asleep = false, walk = false } = {}) {
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
    a.rotation.z = s * jump * 0.8
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
  setFace(c, asleep ? 'sleepy' : closed ? 'blink' : c.mood)
}
