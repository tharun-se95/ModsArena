// Little block critters: a soft-cornered body, stubby side arms, square
// eyes and short legs, in the caller's color. Each subagent type has its
// own build so you can tell them apart by shape, not just color. Built in unit space
// with feet at y = 0; the caller scales the root.

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { envelope } from './moods.js'

const cache = new Map()
const DOT_GEO = new THREE.SphereGeometry(1, 12, 10)
const DOT_MAT = new THREE.MeshStandardMaterial({ color: '#fbf6ec', roughness: 0.5 })
function box(w, h, d, r = 0.08) {
  const key = `${w}|${h}|${d}|${r}`
  if (!cache.has(key)) cache.set(key, new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2)))
  return cache.get(key)
}

// Proportions per build. `legs` is the count across the front.
const BUILDS = {
  session: { w: 2.1, h: 1.05, d: 1.15, legs: 4, legH: 0.7, eye: [0.24, 0.3], crown: 'gem' },
  'general-purpose': { w: 1.9, h: 0.95, d: 1.0, legs: 4, legH: 0.62, eye: [0.22, 0.28], crown: 'none' },
  Explore: { w: 2.1, h: 0.8, d: 1.0, legs: 4, legH: 0.5, eye: [0.28, 0.24], crown: 'periscope' },
  Plan: { w: 1.6, h: 1.3, d: 1.0, legs: 2, legH: 0.6, eye: [0.2, 0.26], crown: 'cap' },
  'code-reviewer': { w: 1.9, h: 1.0, d: 1.0, legs: 4, legH: 0.58, eye: [0.2, 0.22], crown: 'glasses' },
  'test-runner': { w: 2.0, h: 0.85, d: 0.95, legs: 6, legH: 0.55, eye: [0.2, 0.26], crown: 'antennae' },
}

export function makeCharacter({ build = 'general-purpose', bodyColor, inkColor, accentColor, pick }) {
  const b = BUILDS[build] ?? BUILDS['general-purpose']
  const root = new THREE.Group()
  const rig = new THREE.Group()
  root.add(rig)

  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.42 })
  const inkMat = new THREE.MeshStandardMaterial({ color: inkColor, roughness: 0.2 })
  const accentMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.3 })

  // Legs: short blocks along the underside, front and back rows.
  const legs = []
  const legW = Math.min(0.26, (b.w * 0.8) / (b.legs * 1.6))
  for (let i = 0; i < b.legs; i++) {
    const x = (i - (b.legs - 1) / 2) * ((b.w * 0.78) / Math.max(1, b.legs - 1))
    const leg = new THREE.Mesh(box(legW, b.legH + 0.1, b.d * 0.3, 0.04), bodyMat)
    leg.position.set(b.legs === 2 ? x * 0.7 : x, b.legH / 2, 0)
    leg.userData.phase = i % 2 ? Math.PI : 0
    legs.push(leg)
  }

  // The body sits on the legs; everything above hangs off `top`.
  const top = new THREE.Group()
  top.position.y = b.legH
  const body = new THREE.Mesh(box(b.w, b.h, b.d, 0.14), bodyMat)
  body.position.y = b.h / 2

  // Stubby arms out each side, pivoting at the shoulder.
  const arms = [-1, 1].map(side => {
    const pivot = new THREE.Group()
    pivot.position.set(side * (b.w / 2), b.h * 0.58, 0)
    const arm = new THREE.Mesh(box(0.42, 0.32, b.d * 0.42, 0.06), bodyMat)
    arm.position.x = side * 0.19
    pivot.add(arm)
    pivot.userData.side = side
    return pivot
  })

  // Square eyes, set high and wide.
  const [ew, eh] = b.eye
  const eyes = [-1, 1].map(side => {
    const e = new THREE.Mesh(box(ew, eh, 0.06, 0.02), inkMat)
    e.position.set(side * b.w * 0.25, b.h * 0.64, b.d / 2 + 0.01)
    return e
  })
  top.add(body, ...arms, ...eyes)

  // Per-build crown: the bit that makes each one recognisable.
  let bulb = null
  let height = b.legH + b.h
  if (b.crown === 'gem') {
    // Sessions carry a small spinning gem that glows while they work.
    bulb = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.2, roughness: 0.3, flatShading: true }))
    bulb.position.y = b.h + 0.55
    bulb.scale.y = 1.35
    top.add(bulb)
    height += 0.95
  } else if (b.crown === 'periscope') {
    const stalk = new THREE.Mesh(box(0.12, 0.5, 0.12, 0.04), inkMat)
    stalk.position.set(b.w * 0.28, b.h + 0.25, 0)
    const lens = new THREE.Mesh(box(0.3, 0.2, 0.3, 0.06), accentMat)
    lens.position.set(b.w * 0.28, b.h + 0.58, 0.05)
    top.add(stalk, lens)
    height += 0.7
  } else if (b.crown === 'cap') {
    const cap = new THREE.Mesh(box(b.w * 0.9, 0.14, b.d * 1.05, 0.04), accentMat)
    cap.position.y = b.h + 0.07
    const brim = new THREE.Mesh(box(b.w * 0.6, 0.06, 0.4, 0.03), accentMat)
    brim.position.set(0, b.h + 0.03, b.d / 2 + 0.15)
    top.add(cap, brim)
    height += 0.15
  } else if (b.crown === 'glasses') {
    for (const side of [-1, 1]) {
      const frame = new THREE.Mesh(box(ew + 0.16, eh + 0.14, 0.05, 0.03), accentMat)
      frame.position.set(side * b.w * 0.25, b.h * 0.64, b.d / 2 + 0.005)
      top.add(frame)
    }
    const bridge = new THREE.Mesh(box(b.w * 0.2, 0.05, 0.05, 0.02), accentMat)
    bridge.position.set(0, b.h * 0.68, b.d / 2 + 0.02)
    top.add(bridge)
    for (const e of eyes) e.position.z += 0.03
  } else if (b.crown === 'antennae') {
    for (const side of [-1, 1]) {
      const stalk = new THREE.Mesh(box(0.08, 0.36, 0.08, 0.03), inkMat)
      stalk.position.set(side * b.w * 0.2, b.h + 0.16, 0)
      stalk.rotation.z = -side * 0.35
      const tip = new THREE.Mesh(box(0.16, 0.16, 0.16, 0.05), accentMat)
      tip.position.set(side * (b.w * 0.2 + 0.12), b.h + 0.36, 0)
      top.add(stalk, tip)
    }
    height += 0.45
  }

  // Thought dots, rising beside its head while it thinks. Every critter
  // shares the one geometry and material.
  const dots = new THREE.Group()
  dots.position.set(b.w * 0.42, b.h + 0.25, 0)
  dots.visible = false
  ;[0.13, 0.18, 0.24].forEach((r, i) => {
    const dot = new THREE.Mesh(DOT_GEO, DOT_MAT)
    dot.scale.setScalar(r)
    dot.position.set(i * 0.22, i * 0.3, 0)
    dot.userData.r = r
    dots.add(dot)
  })
  top.add(dots)

  rig.add(top, ...legs)
  root.traverse(o => {
    if (o.isMesh) {
      o.castShadow = o.parent !== dots
      if (pick) o.userData.pick = pick
    }
  })
  // The eyes sit on the body's face, so their shadow would never show.
  for (const e of eyes) e.castShadow = false

  return {
    root, rig, top, eyes, arms, legs, bulb, bodyMat, inkMat, accentMat, height, dots,
    seed: Math.random() * 10,
    blinkAt: 1 + Math.random() * 3,
  }
}

// Per-frame pose. `busy` is 0..1 (how recently it acted), `look` an angle
// to turn toward, `hop` 0..1 a one-shot jump when it calls a tool, and
// `asleep` closes its eyes for good.
export function pose(c, t, { busy = 0, look = 0, hop = 0, alarm = false, asleep = false } = {}) {
  const breathe = Math.sin(t * (asleep ? 0.9 : 2) + c.seed) * 0.02
  const jump = Math.sin(Math.min(1, hop) * Math.PI) * 0.5
  c.rig.position.y = jump
  c.top.scale.set(1 + breathe * 0.5, 1 - breathe, 1 + breathe * 0.5)
  c.top.position.y = c.legs[0].position.y * 2 + busy * Math.abs(Math.sin(t * 8 + c.seed)) * 0.06

  // Turn toward what it is watching.
  c.rig.rotation.y += (look - c.rig.rotation.y) * 0.08
  c.top.rotation.z = busy * Math.sin(t * 4 + c.seed) * 0.04

  // Legs patter while working; tuck up in a jump.
  for (const leg of c.legs) {
    leg.rotation.x = busy * Math.sin(t * 14 + leg.userData.phase) * 0.35
    leg.scale.y = 1 - jump * 0.4
  }

  // Arms wave while working, shoot up when its context is nearly full.
  for (const p of c.arms) {
    const s = p.userData.side
    const wave = busy * Math.sin(t * 9 + c.seed + (s > 0 ? Math.PI : 0)) * 0.35
    p.rotation.z = s * (alarm ? 1.1 + Math.sin(t * 7) * 0.2 : wave + jump * 0.7)
  }

  // Blink every few seconds.
  if (t > c.blinkAt + 0.14) c.blinkAt = t + 2 + Math.random() * 4
  // A resting critter (a past session) keeps its eyes shut.
  const closed = asleep || (t > c.blinkAt && t < c.blinkAt + 0.14)
  for (const e of c.eyes) e.scale.y = closed ? 0.15 : 1

  if (c.bulb) {
    c.bulb.rotation.y = t * (0.6 + busy * 2.4)
    c.bulb.position.y = c.bulb.userData.y ??= c.bulb.position.y
    c.bulb.position.y += Math.sin(t * 2 + c.seed) * 0.06
    c.bulb.material.emissiveIntensity = 0.15 + busy * (0.55 + 0.35 * Math.sin(t * 8))
  }
}

// A mood on top of the pose (moods.js says which): call it right after
// pose(). `still` (prefers-reduced-motion) keeps the shapes and drops the
// bouncing.
export function emote(c, t, mood, still = false) {
  const kind = mood?.kind
  c.dots.visible = kind === 'think'
  c.top.rotation.x = 0
  for (const e of c.eyes) e.scale.x = 1
  if (!kind) return
  const k = mood.k
  if (kind === 'think') {
    // One dot after another swells, like an ellipsis typing itself.
    c.dots.children.forEach((d, i) => d.scale.setScalar(d.userData.r * (still ? 1 : 1 + 0.35 * Math.max(0, Math.sin((k - i / 3) * Math.PI * 2)))))
    return
  }
  const e = envelope(k)
  if (kind === 'cheer') {
    // Both arms up, eyes squeezed happy, and a bounce or two.
    for (const p of c.arms) p.rotation.z = p.userData.side * (1.25 + (still ? 0 : Math.sin(t * 18) * 0.2)) * e
    for (const eye of c.eyes) eye.scale.y = 1 - 0.55 * e
    if (!still) c.rig.position.y += Math.abs(Math.sin(k * Math.PI * 3)) * 0.35 * e
  } else if (kind === 'sulk') {
    // A slump: leaning forward, arms hanging, eyes low.
    c.top.rotation.x = 0.28 * e
    c.top.position.y -= 0.08 * e
    for (const p of c.arms) p.rotation.z = p.userData.side * -0.15 * e
    for (const eye of c.eyes) eye.scale.y = Math.min(eye.scale.y, 1 - 0.55 * e)
  } else if (kind === 'perk') {
    // Looks up at you, eyes wide, with a little hop.
    c.top.rotation.x = -0.22 * e
    for (const eye of c.eyes) { eye.scale.y = 1 + 0.3 * e; eye.scale.x = 1 + 0.15 * e }
    if (!still) c.rig.position.y += Math.sin(Math.min(1, k * 2.5) * Math.PI) * 0.25
  } else if (kind === 'yawn') {
    // A slow stretch, arms up and eyes shut.
    c.top.rotation.x = -0.18 * e
    c.top.scale.y *= 1 + 0.06 * e
    for (const p of c.arms) p.rotation.z = p.userData.side * 1.05 * e
    for (const eye of c.eyes) eye.scale.y = 1 - 0.85 * e
  }
}
