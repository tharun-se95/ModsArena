// How each kind of node looks and moves. One visual family, ranked by size:
// a project is a gravity well, a session a holographic core, a subagent a
// smaller core in its type's color, a tool call a spark. Context is always
// the same gauge: green, then amber past 60%, red past 85%.

import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import { TOOL_LINGER_MS, DEFAULT_WINDOW, WARN_AT, fill } from './model.js'

export const COLORS = {
  project: '#a8b8d8',
  session: '#7fe7ff',
  sessionEnded: '#4a6572',
  past: '#6b7d9c',
  agentPalette: ['#b48cff', '#4ef0a8', '#ff8ad8', '#ffd166', '#6ea8ff', '#ff9f5a'],
  agentDone: '#56607a',
  ok: '#4ef08a',
  warn: '#ffd166',
  error: '#ff4d6d',
  track: '#1a2536',
}

// The /context categories, in a stable order of hues; messages stand out.
export const CATEGORY_COLORS = {
  'System prompt': '#8b9cff',
  'System tools': '#6ea8ff',
  'MCP tools': '#b48cff',
  'Custom agents': '#ff8ad8',
  'Memory files': '#ff9f5a',
  Skills: '#ffd166',
  Messages: '#7fe7ff',
}
const FALLBACK_CATEGORY = ['#9aa4b8', '#c3a6ff', '#7bd8c0', '#e3b6ff']

export function categoryColor(name, i = 0) {
  return CATEGORY_COLORS[name] ?? FALLBACK_CATEGORY[i % FALLBACK_CATEGORY.length]
}

const TOOL_FAMILIES = [
  [/^(Read|Grep|Glob|LS|NotebookRead)$/, '#6ea8ff'],
  [/^(Edit|Write|MultiEdit|NotebookEdit)$/, '#4ef0c8'],
  [/^Bash/, '#ff9f5a'],
  [/^Web/, '#ff8ad8'],
  [/^mcp__/, '#b48cff'],
  [/^(TodoWrite|Task\w+)$/, '#ffd166'],
]

export const toolColor = tool => TOOL_FAMILIES.find(([re]) => re.test(tool))?.[1] ?? '#9aa4b8'
const agentColors = new Map()
export const agentColor = type => {
  if (!agentColors.has(type)) {
    agentColors.set(type, COLORS.agentPalette[agentColors.size % COLORS.agentPalette.length])
  }
  return agentColors.get(type)
}

export const fillColor = f => (f >= 0.85 ? COLORS.error : f >= 0.6 ? COLORS.warn : COLORS.ok)

export function baseColor(n) {
  if (n.kind === 'project') return COLORS.project
  if (n.kind === 'session') return n.past ? COLORS.past : n.status === 'done' ? COLORS.sessionEnded : COLORS.session
  if (n.kind === 'agent') return n.status === 'done' ? COLORS.agentDone : agentColor(n.type)
  if (n.status === 'ok') return COLORS.ok
  if (n.status === 'error') return COLORS.error
  return toolColor(n.tool)
}

// The arcs of a session's context, by /context category, for the panel's bar.
export function segments(n) {
  const window = n.context?.window || n.breakdown?.window || DEFAULT_WINDOW
  const live = n.context?.tokens
  const cats = n.breakdown?.categories?.filter(c => c.kind === 'used')
  if (n.kind === 'session' && !n.past && cats?.length) {
    const fixed = cats.filter(c => c.name !== 'Messages')
    const fixedSum = fixed.reduce((s, c) => s + c.tokens, 0)
    const messages = live !== undefined ? Math.max(0, live - fixedSum) : cats.find(c => c.name === 'Messages')?.tokens ?? 0
    return [...fixed, { name: 'Messages', tokens: messages }]
      .map((c, i) => ({ name: c.name, share: c.tokens / window, color: categoryColor(c.name, i) }))
      .filter(s => s.share > 0.002)
  }
  const f = fill(n)
  return f > 0 ? [{ name: 'Context', share: f, color: fillColor(f) }] : []
}

// ---------------------------------------------------------------------------
// Materials

// A glass orb: transparent in the middle, glowing at the rim.
const ORB_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`
const ORB_FRAGMENT = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uRim;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
    vec3 c = uColor * (0.18 + f * uRim);
    gl_FragColor = vec4(c, uOpacity * (0.22 + f * 0.9));
  }`

function orbMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 1 }, uRim: { value: 1.6 } },
    vertexShader: ORB_VERTEX,
    fragmentShader: ORB_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

let glowTexture
function glowMap() {
  if (glowTexture) return glowTexture
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.2, 'rgba(255,255,255,0.55)')
  grd.addColorStop(0.55, 'rgba(255,255,255,0.12)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  glowTexture = new THREE.CanvasTexture(c)
  return glowTexture
}

function glow(color, size, opacity = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowMap(), color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending,
  }))
  s.scale.setScalar(size)
  return s
}

function solid(radius, color) {
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshBasicMaterial({ color, transparent: true }))
}

function ring(radius, tube, color, arc = Math.PI * 2, opacity = 1) {
  return new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 128, arc),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
  )
}

// A thin dashed circle: the activity orbit around a working session.
function dashedCircle(radius, color, dashes = 24) {
  const pts = []
  for (let i = 0; i < dashes; i++) {
    const a0 = (i / dashes) * Math.PI * 2
    const a1 = a0 + (Math.PI * 2) / dashes * 0.45
    pts.push(new THREE.Vector3(Math.cos(a0) * radius, Math.sin(a0) * radius, 0), new THREE.Vector3(Math.cos(a1) * radius, Math.sin(a1) * radius, 0))
  }
  return new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5, depthWrite: false }),
  )
}

function label(text, height, color, y, weight = 500) {
  const sprite = new SpriteText(text, height, color)
  sprite.fontFace = '-apple-system, "Segoe UI", system-ui, sans-serif'
  sprite.fontWeight = String(weight)
  sprite.backgroundColor = 'rgba(6, 9, 18, 0.72)'
  sprite.padding = [2.2, 1.2]
  sprite.borderRadius = 3
  sprite.position.y = y
  sprite.material.transparent = true
  sprite.material.depthWrite = false
  return sprite
}

// ---------------------------------------------------------------------------
// Building each kind

const SIZE = {
  session: { orb: 9, core: 3.4, halo: 46, gauge: 15.5, orbit: 21 },
  past: { orb: 5, core: 1.8, halo: 18, gauge: 8.5 },
  agent: { orb: 4.4, core: 1.6, halo: 20, gauge: 7.5 },
}

export function buildObject(n) {
  const group = new THREE.Group()
  const color = baseColor(n)
  const parts = { group, born: performance.now() }

  if (n.kind === 'project') {
    // A gravity well: a soft disc of light with two tilted orbit rings.
    parts.halo = glow(color, 120, 0.16)
    parts.seed = solid(2.2, '#f1f5ff')
    parts.seedGlow = glow('#dbe7ff', 22, 0.8)
    parts.orbits = new THREE.Group()
    const a = ring(26, 0.18, color, Math.PI * 2, 0.5)
    const b = ring(38, 0.14, color, Math.PI * 2, 0.28)
    a.rotation.x = 1.15
    b.rotation.set(1.3, 0.5, 0)
    parts.orbits.add(a, b)
    parts.label = label(n.label.toUpperCase(), 6.5, '#aab7cf', -50, 650)
    group.add(parts.halo, parts.orbits, parts.seedGlow, parts.seed, parts.label)
  } else if (n.kind === 'session' || n.kind === 'agent') {
    const size = n.kind === 'agent' ? SIZE.agent : n.past ? SIZE.past : SIZE.session
    parts.size = size
    parts.halo = glow(color, size.halo, n.past ? 0.25 : 0.55)
    parts.orb = new THREE.Mesh(new THREE.SphereGeometry(size.orb, 40, 40), orbMaterial(color))
    parts.core = solid(size.core, '#ffffff')
    parts.track = ring(size.gauge, n.kind === 'session' && !n.past ? 0.45 : 0.3, COLORS.track)
    parts.gaugeKey = ''
    group.add(parts.halo, parts.orb, parts.core, parts.track)
    if (n.kind === 'session' && !n.past) {
      parts.orbit = dashedCircle(size.orbit, color)
      group.add(parts.orbit)
    }
    const text = n.kind === 'session' ? 6 : 3.8
    parts.label = label(n.label, n.past ? 3.4 : text, n.kind === 'session' ? '#bcd3dc' : '#c4bdd6', -(size.gauge + text * 0.9 + 3), n.kind === 'session' ? 650 : 500)
    group.add(parts.label)
    // Subagents arrive with a small pop.
    if (n.kind === 'agent') group.scale.setScalar(0.01)
  } else {
    // A tool call: a spark that bursts green or red when it finishes.
    parts.halo = glow(color, 8, 0.9)
    parts.core = solid(0.9, '#ffffff')
    group.add(parts.halo, parts.core)
  }

  n.parts = parts
  n.shownColor = undefined
  return group
}

function applyColor(n, color) {
  if (n.shownColor === color) return
  n.shownColor = color
  const p = n.parts
  p.halo?.material.color.set(color)
  p.orb?.material.uniforms.uColor.value.set(color)
  p.orbit?.material.color.set(color)
}

// The context gauge: one arc from the top, clockwise, colored by fill.
function updateGauge(n) {
  const p = n.parts
  const f = fill(n)
  const key = f ? `${fillColor(f)}:${f.toFixed(3)}` : ''
  if (key === p.gaugeKey) return
  p.gaugeKey = key
  if (p.gauge) { p.group.remove(p.gauge); p.gauge.geometry.dispose(); p.gauge = null }
  if (!f) return
  const arc = Math.max(0.06, Math.PI * 2 * f)
  const tube = n.kind === 'session' && !n.past ? 1.25 : 0.75
  p.gauge = ring(p.size.gauge, tube, fillColor(f), arc)
  p.gauge.rotation.z = Math.PI / 2 - arc
  p.group.add(p.gauge)
}

function updateWarning(n, now) {
  const p = n.parts
  const isWarn = !n.past && n.status !== 'done' && fill(n) >= WARN_AT
  if (isWarn && !p.alarm) {
    p.alarm = ring(p.size.gauge + 3.5, 0.35, COLORS.error, Math.PI * 2, 0.8)
    p.group.add(p.alarm)
  } else if (!isWarn && p.alarm) {
    p.group.remove(p.alarm); p.alarm.geometry.dispose(); p.alarm = null
  }
  if (p.alarm) {
    const t = (Math.sin(now / 420) + 1) / 2
    p.alarm.material.opacity = 0.25 + 0.6 * t
    p.alarm.scale.setScalar(1 + 0.05 * t)
  }
}

// A compaction: a bright ring bursting outward from the gauge.
function updateWave(n, now) {
  const p = n.parts
  const age = n.compactAt ? now - n.compactAt : Infinity
  if (age < 1600) {
    if (!p.wave) { p.wave = ring(p.size.gauge, 0.7, '#ffffff', Math.PI * 2, 0.9); p.group.add(p.wave) }
    const k = age / 1600
    p.wave.scale.setScalar(1 + k * 2.4)
    p.wave.material.opacity = 0.9 * (1 - k) * (1 - k)
  } else if (p.wave) {
    p.group.remove(p.wave); p.wave.geometry.dispose(); p.wave = null
  }
}

const ACTIVE_MS = 3000 // a session counts as working for this long after a tool call

export function animate(nodes, now, camera) {
  for (const n of nodes) {
    const p = n.parts
    if (!p) continue
    applyColor(n, baseColor(n))
    if (p.label && p.label.text !== (n.kind === 'project' ? n.label.toUpperCase() : n.label)) {
      p.label.text = n.kind === 'project' ? n.label.toUpperCase() : n.label
    }

    if (n.kind === 'project') {
      p.orbits.rotation.z += 0.0016
      p.orbits.children[1].rotation.z -= 0.0011
      p.seedGlow.material.opacity = 0.65 + 0.15 * Math.sin(now / 900)
      continue
    }

    if (n.kind === 'session' || n.kind === 'agent') {
      // Rings face the camera, so a gauge always reads as a gauge.
      if (camera) for (const r of [p.track, p.gauge, p.alarm, p.wave, p.orbit]) r?.quaternion.copy(camera.quaternion)
      updateGauge(n)
      updateWarning(n, now)
      updateWave(n, now)
      const done = n.status === 'done'
      const sincePulse = n.pulseAt ? now - n.pulseAt : Infinity
      const pulse = sincePulse < 1100 ? 1 + 0.28 * Math.sin((sincePulse / 1100) * Math.PI) : 1
      p.orb.material.uniforms.uOpacity.value = done ? 0.45 : 1
      p.orb.material.uniforms.uRim.value = done ? 0.9 : 1.6 + 0.25 * Math.sin(now / 700)
      p.core.visible = !done
      p.core.scale.setScalar(pulse)
      p.halo.material.opacity = done || n.past ? 0.18 : 0.5 + 0.08 * Math.sin(now / 800)
      p.label.material.opacity = done || n.past ? 0.5 : 1

      if (n.kind === 'session' && p.orbit) {
        const working = !n.past && n.status === 'active' && n.lastAt && now - n.lastAt < ACTIVE_MS
        p.orbit.visible = Boolean(working)
        p.orbit.rotateZ(0.012)
      }
      if (n.kind === 'agent') {
        // Pop in on spawn, settle smaller when finished.
        const age = Math.min(1, (performance.now() - p.born) / 520)
        const pop = age < 1 ? 1 + Math.sin(age * Math.PI) * 0.25 - (1 - age) : 1
        const breathe = done ? 0.72 : 1 + 0.05 * Math.sin(now / 300)
        p.group.scale.setScalar(Math.max(0.01, pop * breathe))
      }
    } else if (n.kind === 'tool') {
      if (n.status === 'active') {
        p.halo.material.opacity = 0.6 + 0.35 * Math.abs(Math.sin(now / 160))
        p.halo.scale.setScalar(7.5 + 1.5 * Math.sin(now / 160))
      } else if (n.endedAt) {
        const k = Math.min(1, (now - n.endedAt) / TOOL_LINGER_MS)
        const burst = Math.min(1, (now - n.endedAt) / 450)
        p.halo.scale.setScalar(8 + burst * 10 * (1 - k))
        p.halo.material.opacity = 0.95 * (1 - k)
        p.core.material.opacity = 1 - k
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Edges: a beam that blends from the parent's color into the child's.

const LINK_LOOK = {
  project: { opacity: 0.16 },
  spawn: { opacity: 0.7 },
  tool: { opacity: 0.32 },
}

export function buildLink(l) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(6), 3))
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: LINK_LOOK[l.kind].opacity, depthWrite: false, blending: THREE.AdditiveBlending,
  }))
  line.userData.colorKey = ''
  return line
}

const tmpA = new THREE.Color()
const tmpB = new THREE.Color()
export function updateLink(line, { start, end }, l) {
  const pos = line.geometry.attributes.position
  pos.array.set([start.x, start.y, start.z, end.x, end.y, end.z])
  pos.needsUpdate = true
  const source = typeof l.source === 'object' ? l.source : null
  const target = typeof l.target === 'object' ? l.target : null
  const a = source ? baseColor(source) : '#94a3b8'
  const b = target ? baseColor(target) : '#94a3b8'
  const key = `${a}|${b}`
  if (key !== line.userData.colorKey) {
    line.userData.colorKey = key
    tmpA.set(a); tmpB.set(b)
    line.geometry.attributes.color.array.set([tmpA.r, tmpA.g, tmpA.b, tmpB.r, tmpB.g, tmpB.b])
    line.geometry.attributes.color.needsUpdate = true
  }
  // A finished child's edge fades with it.
  const fading = target?.status === 'done' || target?.past
  line.material.opacity = LINK_LOOK[l.kind].opacity * (fading ? 0.35 : 1)
  return true
}
