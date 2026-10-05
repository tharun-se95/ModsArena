// Three.js objects for each node kind, and their per-frame animation.

import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import { TOOL_LINGER_MS, DEFAULT_WINDOW, WARN_AT, fill, projectSummary } from './model.js'

// Which view is drawn: the overview hides everything but projects and sessions.
export const view = { overview: true }

export const COLORS = {
  project: '#8fa3c7',
  session: '#7fe7ff',
  sessionEnded: '#3b5560',
  past: '#5d6f8f',
  agentPalette: ['#b48cff', '#4ef0a8', '#ff8ad8', '#ffd166', '#6ea8ff', '#ff9f5a'],
  agentDone: '#4a4a63',
  ok: '#4ef08a',
  warn: '#ffd166',
  error: '#ff4d6d',
  track: '#1d2a3a',
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

function glowMaterial(color, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 0.9, roughness: 0.35, metalness: 0.1,
    transparent: opacity < 1, opacity,
  })
}

function label(text, height, color, y) {
  const sprite = new SpriteText(text, height, color)
  sprite.fontFace = 'ui-monospace, SFMono-Regular, Menlo, monospace'
  sprite.backgroundColor = 'rgba(5,6,13,0.4)'
  sprite.padding = 1.5
  sprite.borderRadius = 2
  sprite.position.y = y
  sprite.material.transparent = true
  return sprite
}

function ring(radius, tube, color, arc = Math.PI * 2, opacity = 1) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 96, arc),
    new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }),
  )
  return mesh
}

const RADIUS = { session: 21, past: 12, agent: 9 }

export function buildObject(n) {
  const group = new THREE.Group()
  const color = baseColor(n)
  const parts = { group, rings: new THREE.Group() }
  group.add(parts.rings)

  if (n.kind === 'project') {
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(6, 20, 20), glowMaterial(color, 0.8))
    parts.track = ring(30, 0.4, color, Math.PI * 2, 0.35)
    parts.label = label(n.label, 13, '#dbe6f7', -155)
    group.add(parts.core, parts.track, parts.label)
  } else if (n.kind === 'session' && n.past) {
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(5, 20, 20), glowMaterial(color, 0.75))
    parts.track = ring(RADIUS.past, 0.25, COLORS.track)
    parts.label = label(n.label, 5, '#9fb0cc', -21)
    group.add(parts.core, parts.track, parts.label)
  } else if (n.kind === 'session') {
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(9, 32, 32), glowMaterial(color))
    parts.shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(15, 1),
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35 }),
    )
    parts.track = ring(RADIUS.session, 0.35, COLORS.track)
    parts.label = label(n.label, 7, '#e8fbff', -34)
    group.add(parts.core, parts.shell, parts.track, parts.label)
  } else if (n.kind === 'agent') {
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(4.5, 24, 24), glowMaterial(color))
    parts.track = ring(RADIUS.agent, 0.3, COLORS.track)
    parts.label = label(n.label, 4.6, '#f0e8ff', -15)
    group.add(parts.core, parts.track, parts.label)
  } else {
    parts.core = new THREE.Mesh(new THREE.OctahedronGeometry(1.8), glowMaterial(color))
    group.add(parts.core)
  }

  n.parts = parts
  n.shownColor = color
  n.ringKey = undefined
  return group
}

function setColor(n, color) {
  if (n.shownColor === color) return
  n.shownColor = color
  const m = n.parts.core.material
  m.color.set(color)
  if (m.emissive) m.emissive.set(color)
}

// The arcs a context ring is drawn from: the /context categories when the
// session has a breakdown (messages kept live from the newest reading),
// else one arc of the fill colored by how close it is to the limit.
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

function updateRings(n) {
  if (n.kind !== 'session' && n.kind !== 'agent') return
  const segs = segments(n)
  const key = segs.map(s => `${s.color}:${s.share.toFixed(3)}`).join('|')
  if (key === n.ringKey) return
  n.ringKey = key
  const { rings } = n.parts
  for (const m of [...rings.children]) {
    rings.remove(m)
    m.geometry.dispose()
  }
  const radius = n.past ? RADIUS.past : RADIUS[n.kind]
  const tube = n.kind === 'session' && !n.past ? 1.1 : 0.7
  let start = 0
  for (const s of segs) {
    const arc = Math.min(Math.PI * 2 - start, Math.PI * 2 * s.share)
    if (arc <= 0) break
    const m = ring(radius, tube, s.color, arc)
    m.rotation.z = Math.PI / 2 - start - arc
    rings.add(m)
    start += arc
  }
}

function updateHalo(n, now) {
  const isWarn = !n.past && n.status !== 'done' && fill(n) >= WARN_AT
  const { parts } = n
  if (isWarn && !parts.halo) {
    const r = (n.kind === 'session' ? RADIUS.session : RADIUS.agent) + 4
    parts.halo = ring(r, 0.5, COLORS.error, Math.PI * 2, 0.8)
    parts.group.add(parts.halo)
  } else if (!isWarn && parts.halo) {
    parts.group.remove(parts.halo)
    parts.halo.geometry.dispose()
    parts.halo = undefined
  }
  if (parts.halo) {
    parts.halo.material.opacity = 0.35 + 0.45 * Math.abs(Math.sin(now / 420))
    parts.halo.scale.setScalar(1 + 0.04 * Math.sin(now / 420))
  }
}

// A compaction: a ring that bursts outward from the loop and fades.
function updateShockwave(n, now) {
  const { parts } = n
  const age = n.compactAt ? now - n.compactAt : Infinity
  if (age < 1600) {
    if (!parts.wave) {
      parts.wave = ring(n.kind === 'session' ? RADIUS.session : RADIUS.agent, 0.8, '#ffffff', Math.PI * 2, 0.9)
      parts.group.add(parts.wave)
    }
    const p = age / 1600
    parts.wave.scale.setScalar(1 + p * 2.6)
    parts.wave.material.opacity = 0.9 * (1 - p)
  } else if (parts.wave) {
    parts.group.remove(parts.wave)
    parts.wave.geometry.dispose()
    parts.wave = undefined
  }
}

function labelText(n) {
  if (n.kind !== 'project') return n.label
  const s = projectSummary(n.projectId)
  const parts = [`${s.live} live`]
  if (s.agents) parts.push(`${s.agents} agent${s.agents === 1 ? '' : 's'}`)
  if (s.live) parts.push(`fullest ${Math.round(s.fullest * 100)}%`)
  return `${n.label}\n${parts.join(' · ')}`
}

export function animate(nodes, now) {
  for (const n of nodes) {
    if (!n.parts) continue
    const { core, shell, rings, group, label: tag } = n.parts
    setColor(n, baseColor(n))
    if (tag) {
      const text = labelText(n)
      if (tag.text !== text) tag.text = text
      // Session names would crowd the overview; projects speak for them there.
      tag.visible = !(view.overview && n.kind === 'session')
      tag.material.opacity = n.status === 'done' || n.past ? 0.45 : 1
    }

    const sincePulse = n.pulseAt ? now - n.pulseAt : Infinity
    const pulse = sincePulse < 1200 ? 1 + 0.35 * Math.sin((sincePulse / 1200) * Math.PI) : 1

    if (n.kind === 'project') {
      const { fullest } = projectSummary(n.projectId)
      setColor(n, fullest >= WARN_AT ? COLORS.error : COLORS.project)
      continue
    }
    if (n.kind === 'session' || n.kind === 'agent') {
      updateRings(n)
      updateHalo(n, now)
      updateShockwave(n, now)
    }
    if (n.kind === 'session') {
      if (shell) {
        shell.rotation.y += 0.004
        shell.rotation.x += 0.0015
      }
      core.scale.setScalar(pulse)
    } else if (n.kind === 'agent') {
      const breathe = n.status === 'active' ? 1 + 0.08 * Math.sin(now / 260) : 0.7
      core.scale.setScalar(breathe * pulse)
    } else if (n.kind === 'tool') {
      core.rotation.y += n.status === 'active' ? 0.12 : 0.02
      if (n.status === 'active') {
        core.material.emissiveIntensity = 0.8 + 0.6 * Math.abs(Math.sin(now / 150))
      } else if (n.endedAt) {
        const fade = 1 - Math.min(1, (now - n.endedAt) / TOOL_LINGER_MS)
        group.scale.setScalar(0.4 + 0.8 * fade)
        core.material.emissiveIntensity = 0.3 + fade
      }
    }
  }
}
