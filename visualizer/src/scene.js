// What each node looks like and how it moves. Color carries meaning only:
// rings show how full a context window is (green, amber, red), glow shows
// work in progress, red shows failure. Labels are HTML, so they stay crisp
// and the same size at any zoom.

import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { TOOL_LINGER_MS, WARN_AT, fill, projectSummary, nodes } from './model.js'

export const COLORS = {
  accent: '#67e8f9',
  session: '#a5f3fc',
  past: '#64748b',
  done: '#475569',
  track: '#1c2638',
  ok: '#34d399',
  warn: '#fbbf24',
  crit: '#f87171',
  outline: '#26334a',
}
const AGENT_PALETTE = ['#a78bfa', '#7dd3fc', '#f0abfc', '#bef264', '#fdba74', '#5eead4']
const TOOL_FAMILIES = [
  [/^(Read|Grep|Glob|LS|NotebookRead)$/, '#7dd3fc'],
  [/^(Edit|Write|MultiEdit|NotebookEdit)$/, '#5eead4'],
  [/^Bash/, '#fdba74'],
  [/^Web/, '#f0abfc'],
  [/^mcp__/, '#a78bfa'],
]
export const toolColor = tool => TOOL_FAMILIES.find(([re]) => re.test(tool))?.[1] ?? '#94a3b8'
const agentColors = new Map()
export function agentColor(type) {
  if (!agentColors.has(type)) agentColors.set(type, AGENT_PALETTE[agentColors.size % AGENT_PALETTE.length])
  return agentColors.get(type)
}
export const fillColor = f => (f >= 0.85 ? COLORS.crit : f >= 0.6 ? COLORS.warn : COLORS.ok)

// Shared view state the scene reads each frame.
export const view = {
  selected: null, // node id
  hovered: null, // node id
  camera: null,
  onLabelClick: () => {},
  onLabelHover: () => {},
}

// The selected or hovered node and everything directly tied to it.
let related = new Set()
export function relatedTo(id, links) {
  const set = new Set()
  if (!id) return set
  set.add(id)
  const n = nodes.get(id)
  for (const l of links) {
    const s = typeof l.source === 'object' ? l.source.id : l.source
    const t = typeof l.target === 'object' ? l.target.id : l.target
    if (s === id) set.add(t)
    if (t === id) set.add(s)
  }
  if (n?.session) set.add(`s:${n.session}`)
  return set
}
export function setRelated(set) { related = set }
export const isRelated = id => related.has(id)
export const hasFocus = () => related.size > 0

const R = { session: 15, past: 9, agent: 7.5 }

function glow(color, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 0.85, roughness: 0.4, metalness: 0,
    transparent: true, opacity,
  })
}

function ring(radius, tube, color, opacity = 1, arc = Math.PI * 2) {
  return new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 10, 96, arc),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity }),
  )
}

// A large invisible sphere, so a click near a node counts as a click on it.
function hitArea(radius) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 8, 8),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  )
}

function label(n, cls) {
  const el = document.createElement('div')
  el.className = `node-label ${cls}`
  el.addEventListener('pointerdown', e => e.stopPropagation())
  el.addEventListener('click', e => { e.stopPropagation(); view.onLabelClick(n.id) })
  el.addEventListener('pointerenter', () => view.onLabelHover(n.id))
  el.addEventListener('pointerleave', () => view.onLabelHover(null))
  const obj = new CSS2DObject(el)
  return obj
}

export function buildObject(n) {
  const group = new THREE.Group()
  const parts = { group, fill: null, fillKey: '' }

  if (n.kind === 'project') {
    parts.outline = new THREE.Group()
    parts.label = label(n, 'project')
    group.add(parts.outline, parts.label)
  } else if (n.kind === 'session') {
    const r = n.past ? R.past : R.session
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(n.past ? 4 : 7, 32, 32), glow(n.past ? COLORS.past : COLORS.session))
    parts.track = ring(r, n.past ? 0.4 : 0.6, COLORS.track)
    parts.hit = hitArea(r + 8)
    parts.label = label(n, n.past ? 'session past' : 'session')
    parts.label.position.set(0, -(r + 9), 0)
    parts.radius = r
    group.add(parts.core, parts.track, parts.hit, parts.label)
  } else if (n.kind === 'agent') {
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(3.6, 24, 24), glow(agentColor(n.type)))
    parts.track = ring(R.agent, 0.35, COLORS.track)
    parts.hit = hitArea(R.agent + 6)
    parts.label = label(n, 'agent')
    parts.label.position.set(0, -(R.agent + 6), 0)
    parts.radius = R.agent
    group.add(parts.core, parts.track, parts.hit, parts.label)
  } else {
    parts.core = new THREE.Mesh(new THREE.OctahedronGeometry(1.7), glow(toolColor(n.tool)))
    group.add(parts.core)
  }
  // Labels live in the DOM; take them out when the node leaves the scene.
  group.addEventListener('removed', () => parts.label?.element.remove())
  n.parts = parts
  n.labelHtml = ''
  return group
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const pct = f => `${Math.round(f * 100)}%`

function labelHtml(n) {
  if (n.kind === 'project') {
    const s = projectSummary(n.projectId)
    const fullest = s.live ? `<span class="fill" style="color:${fillColor(s.fullest)}">${pct(s.fullest)}</span>` : ''
    return `<div class="pl"><b>${esc(n.label)}</b><span class="meta">${s.live} live · ${s.agents} agent${s.agents === 1 ? '' : 's'}</span>${fullest}${s.attention ? '<span class="dot crit"></span>' : ''}</div>`
  }
  const f = fill(n)
  const value = n.context?.tokens ? `<span class="fill" style="color:${fillColor(f)}">${pct(f)}</span>` : ''
  const state = n.past ? 'past' : n.status === 'active' ? 'live' : n.status
  return `<span class="dot ${state}"></span><span class="name">${esc(n.label)}</span>${value}`
}

function updateFill(n) {
  const f = fill(n)
  const key = f ? `${fillColor(f)}:${f.toFixed(3)}` : ''
  if (key === n.parts.fillKey) return
  n.parts.fillKey = key
  if (n.parts.fill) {
    n.parts.group.remove(n.parts.fill)
    n.parts.fill.geometry.dispose()
    n.parts.fill = null
  }
  if (!f) return
  const tube = n.kind === 'session' && !n.past ? 1.5 : 0.9
  const arc = Math.max(0.05, Math.PI * 2 * f)
  n.parts.fill = ring(n.parts.radius, tube, fillColor(f), 1, arc)
  // Fill clockwise from the top, like a gauge.
  n.parts.fill.rotation.z = Math.PI / 2 - arc
  n.parts.group.add(n.parts.fill)
}

function updateOutline(n) {
  const b = n.bounds
  if (!b) return
  const key = `${b.width}x${b.height}`
  if (key === n.parts.outlineKey) return
  n.parts.outlineKey = key
  const pad = 24
  const w = b.width + pad * 2
  const h = b.height + pad * 2
  const r = 18
  const shape = new THREE.Shape()
  const x = -pad
  const y = pad
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y - r)
  shape.lineTo(x + w, y - h + r); shape.quadraticCurveTo(x + w, y - h, x + w - r, y - h)
  shape.lineTo(x + r, y - h); shape.quadraticCurveTo(x, y - h, x, y - h + r)
  shape.lineTo(x, y - r); shape.quadraticCurveTo(x, y, x + r, y)
  for (const c of [...n.parts.outline.children]) { n.parts.outline.remove(c); c.geometry.dispose() }
  const plate = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: '#0c1322', transparent: true, opacity: 0.55, depthWrite: false }))
  plate.position.z = -6
  const edge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(shape.getPoints(12)), new THREE.LineBasicMaterial({ color: COLORS.outline, transparent: true, opacity: 0.9 }))
  edge.position.z = -5
  // The plate is backdrop: the mouse passes through it to the field.
  plate.raycast = () => {}
  edge.raycast = () => {}
  n.parts.outline.add(plate, edge)
  n.parts.label.position.set(-pad + 4, pad + 16, 0)
}

function setHalo(n, on, now) {
  const p = n.parts
  if (on && !p.halo) {
    p.halo = ring(p.radius + 5, 0.6, COLORS.crit, 0.7)
    p.group.add(p.halo)
  } else if (!on && p.halo) {
    p.group.remove(p.halo); p.halo.geometry.dispose(); p.halo = null
  }
  if (p.halo) {
    const t = (Math.sin(now / 500) + 1) / 2
    p.halo.material.opacity = 0.25 + 0.5 * t
    p.halo.scale.setScalar(1 + 0.06 * t)
  }
}

function setSelectionRing(n, on) {
  const p = n.parts
  if (on && !p.sel) {
    p.sel = ring(p.radius + (p.halo ? 10 : 6), 0.35, '#ffffff', 0.9)
    p.group.add(p.sel)
  } else if (!on && p.sel) {
    p.group.remove(p.sel); p.sel.geometry.dispose(); p.sel = null
  }
}

// A compaction: a ring that bursts outward and fades.
function updateWave(n, now) {
  const p = n.parts
  const age = n.compactAt ? now - n.compactAt : Infinity
  if (age < 1600) {
    if (!p.wave) { p.wave = ring(p.radius, 0.6, '#ffffff', 0.8); p.group.add(p.wave) }
    const k = age / 1600
    p.wave.scale.setScalar(1 + k * 2.2)
    p.wave.material.opacity = 0.8 * (1 - k)
  } else if (p.wave) {
    p.group.remove(p.wave); p.wave.geometry.dispose(); p.wave = null
  }
}

const tmp = new THREE.Vector3()
const AGENT_LABEL_DISTANCE = 900 // agent labels show once the camera is this close

export function animate(list, now) {
  const focus = hasFocus()
  for (const n of list) {
    const p = n.parts
    if (!p) continue
    const dim = focus && !isRelated(n.id)

    if (p.label) {
      const html = labelHtml(n)
      if (html !== n.labelHtml) { n.labelHtml = html; p.label.element.innerHTML = html }
      let show = true
      if (n.kind === 'agent') {
        const near = view.camera && view.camera.position.distanceTo(p.group.getWorldPosition(tmp)) < AGENT_LABEL_DISTANCE
        show = near || isRelated(n.id)
      }
      p.label.visible = show
      const el = p.label.element
      el.classList.toggle('dim', dim)
      el.classList.toggle('selected', view.selected === n.id)
      el.classList.toggle('done', n.status === 'done')
    }

    if (n.kind === 'project') { updateOutline(n); continue }

    const opacity = dim ? 0.18 : n.status === 'done' ? 0.35 : 1
    p.core.material.opacity = opacity
    if (p.fill) p.fill.material.opacity = dim ? 0.2 : 1
    p.track && (p.track.material.opacity = dim ? 0.3 : 1)

    if (n.kind === 'session' || n.kind === 'agent') {
      updateFill(n)
      setHalo(n, !n.past && n.status !== 'done' && fill(n) >= WARN_AT, now)
      setSelectionRing(n, view.selected === n.id)
      updateWave(n, now)
      // Work in progress breathes; quiet loops sit still.
      const busy = n.status === 'active' && !n.past
      const sincePulse = n.pulseAt ? now - n.pulseAt : Infinity
      const pulse = sincePulse < 900 ? 1 + 0.3 * Math.sin((sincePulse / 900) * Math.PI) : 1
      const breathe = busy ? 1 + 0.06 * Math.sin(now / 320) : 1
      p.core.scale.setScalar(pulse * breathe)
      p.core.material.emissiveIntensity = busy ? 0.9 : 0.35
      if (n.kind === 'agent') {
        const color = n.status === 'done' ? COLORS.done : agentColor(n.type)
        if (p.core.material.userData.color !== color) {
          p.core.material.userData.color = color
          p.core.material.color.set(color); p.core.material.emissive.set(color)
        }
      }
    } else if (n.kind === 'tool') {
      const color = n.status === 'ok' ? COLORS.ok : n.status === 'error' ? COLORS.crit : toolColor(n.tool)
      if (p.core.material.userData.color !== color) {
        p.core.material.userData.color = color
        p.core.material.color.set(color); p.core.material.emissive.set(color)
      }
      p.core.rotation.y += n.status === 'active' ? 0.08 : 0.01
      if (n.endedAt) {
        const fade = 1 - Math.min(1, (now - n.endedAt) / TOOL_LINGER_MS)
        p.group.scale.setScalar(0.5 + 0.6 * fade)
        p.core.material.opacity = (dim ? 0.15 : 1) * (0.2 + 0.8 * fade)
      } else {
        p.core.material.emissiveIntensity = 0.7 + 0.5 * Math.abs(Math.sin(now / 200))
      }
    }
  }
}
