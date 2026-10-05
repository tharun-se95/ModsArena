// The 3D cluster: a force-directed graph of Claude Code sessions (cores),
// subagents (satellites) and tool calls (transient leaves), fed by the
// bridge's Server-Sent Events stream.

import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const TOOL_LINGER_MS = 6000 // a finished tool stays visible this long
const FINISHED_AGENT_LIMIT = 12
const FEED_LIMIT = 60

const COLORS = {
  session: '#7fe7ff',
  sessionEnded: '#3b5560',
  agentPalette: ['#b48cff', '#4ef0a8', '#ff8ad8', '#ffd166', '#6ea8ff', '#ff9f5a'],
  agentDone: '#4a4a63',
  active: '#fff3a0',
  ok: '#4ef08a',
  error: '#ff4d6d',
}

const TOOL_FAMILIES = [
  [/^(Read|Grep|Glob|LS|NotebookRead)$/, '#6ea8ff'],
  [/^(Edit|Write|MultiEdit|NotebookEdit)$/, '#4ef0c8'],
  [/^Bash/, '#ff9f5a'],
  [/^Web/, '#ff8ad8'],
  [/^mcp__/, '#b48cff'],
  [/^(TodoWrite|Task\w+)$/, '#ffd166'],
]

const toolColor = tool => TOOL_FAMILIES.find(([re]) => re.test(tool))?.[1] ?? '#9aa4b8'
const agentColors = new Map()
const agentColor = type => {
  if (!agentColors.has(type)) {
    agentColors.set(type, COLORS.agentPalette[agentColors.size % COLORS.agentPalette.length])
  }
  return agentColors.get(type)
}

// ---------------------------------------------------------------------------
// Graph model

const nodes = new Map()
let links = []
let dirty = false
const stats = { calls: 0, errors: 0, spawned: 0 }

const sid = s => `s:${s}`
const aid = (s, a) => `a:${s}:${a}`
const tid = (s, t) => `t:${s}:${t}`
const ownerOf = ev => (ev.agent ? aid(ev.session, ev.agent) : sid(ev.session))

function addNode(node) {
  nodes.set(node.id, node)
  dirty = true
  return node
}

function addLink(source, target, kind) {
  links.push({ source, target, kind })
  dirty = true
}

function removeNode(id) {
  if (!nodes.delete(id)) return
  links = links.filter(l => idOf(l.source) !== id && idOf(l.target) !== id)
  dirty = true
}

const idOf = end => (typeof end === 'object' ? end.id : end)

function ensureSession(ev) {
  const id = sid(ev.session)
  return nodes.get(id) ?? addNode({
    id, kind: 'session', label: shortId(ev.session), session: ev.session,
    status: 'active', startedAt: ev.t, history: 0, context: null,
  })
}

function ensureAgent(ev, agent) {
  const id = aid(ev.session, agent)
  if (nodes.has(id)) return nodes.get(id)
  ensureSession(ev)
  const node = addNode({
    id, kind: 'agent', label: 'subagent', type: 'subagent', session: ev.session, agent,
    status: 'active', startedAt: ev.t, history: 0,
  })
  addLink(sid(ev.session), id, 'spawn')
  return node
}

function owner(ev) {
  return ev.agent ? ensureAgent(ev, ev.agent) : ensureSession(ev)
}

const shortId = s => (s.length > 14 ? `${s.slice(0, 8)}…` : s)

const handlers = {
  'session.start'(ev) {
    const node = ensureSession(ev)
    node.status = 'active'
    node.cwd = ev.cwd
    node.model = ev.model
    if (ev.cwd) node.label = ev.cwd.split(/[\\/]/).filter(Boolean).pop() ?? node.label
      },
  'session.end'(ev) {
    const node = ensureSession(ev)
    node.status = 'done'
    node.endedAt = ev.t
  },
  'turn.start'(ev) {
    const node = owner(ev)
    node.pulseAt = ev.t
    node.prompt = ev.text
  },
  'turn.complete'(ev) {
    const node = owner(ev)
    if (ev.context?.window) node.context = ev.context
  },
  'agent.spawn'(ev) {
    ensureSession(ev)
    const id = aid(ev.session, ev.agent)
    const parent = ev.parent ? ensureAgent(ev, ev.parent).id : sid(ev.session)
    let node = nodes.get(id)
    if (!node) {
      node = addNode({ id, kind: 'agent', session: ev.session, agent: ev.agent, history: 0 })
      addLink(parent, id, 'spawn')
    }
    Object.assign(node, {
      label: ev.type, type: ev.type, description: ev.description, model: ev.model,
      background: ev.background, status: 'active', startedAt: ev.t,
    })
    stats.spawned++
    nodes.get(parent).pulseAt = ev.t
  },
  'agent.end'(ev) {
    const node = nodes.get(aid(ev.session, ev.agent))
    if (!node) return
    node.status = 'done'
    node.endedAt = ev.t
    trimFinishedAgents()
  },
  'tool.start'(ev) {
    const own = owner(ev)
    const id = tid(ev.session, ev.id)
    if (nodes.has(id)) return
    addNode({
      id, kind: 'tool', label: ev.tool, tool: ev.tool, summary: ev.summary,
      session: ev.session, owner: own.id, status: 'active', startedAt: ev.t,
    })
    addLink(own.id, id, 'tool')
    stats.calls++
  },
  'tool.end'(ev) {
    const node = nodes.get(tid(ev.session, ev.id))
    if (!node) return
    node.status = ev.ok ? 'ok' : 'error'
    node.endedAt = ev.t
    if (!ev.ok) stats.errors++
    const own = nodes.get(node.owner)
    if (own) own.history++
  },
}

function trimFinishedAgents() {
  const finished = [...nodes.values()]
    .filter(n => n.kind === 'agent' && n.status === 'done')
    .sort((a, b) => a.endedAt - b.endedAt)
  for (const n of finished.slice(0, Math.max(0, finished.length - FINISHED_AGENT_LIMIT))) removeNode(n.id)
}

function apply(ev) {
  handlers[ev.kind]?.(ev)
}

// Finished tools fold into their owner's history ring.
function sweep(now) {
  for (const n of nodes.values()) {
    if (n.kind === 'tool' && n.endedAt && now - n.endedAt > TOOL_LINGER_MS) removeNode(n.id)
  }
}

// ---------------------------------------------------------------------------
// Rendering

const stage = document.getElementById('graph')
const graph = ForceGraph3D({ controlType: 'orbit' })(stage)
  .width(stage.clientWidth)
  .height(stage.clientHeight)
  .backgroundColor('#05060d')
  .showNavInfo(false)
  .nodeId('id')
  .nodeLabel(n => tooltip(n))
  .nodeThreeObject(n => buildObject(n))
  .linkColor(l => (l.kind === 'spawn' ? 'rgba(180,140,255,0.55)' : 'rgba(120,170,255,0.25)'))
  .linkWidth(l => (l.kind === 'spawn' ? 0.8 : 0.25))
  .linkCurvature(l => (l.kind === 'spawn' ? 0.25 : 0))
  .linkDirectionalParticles(l => (isLinkActive(l) ? (l.kind === 'spawn' ? 4 : 2) : 0))
  .linkDirectionalParticleSpeed(l => (l.kind === 'spawn' ? 0.006 : 0.02))
  .linkDirectionalParticleWidth(l => (l.kind === 'spawn' ? 2.2 : 1.4))
  .linkDirectionalParticleColor(l => (l.kind === 'spawn' ? '#d7c2ff' : '#bfe3ff'))
  .onNodeClick(n => focus(n))
  .onBackgroundClick(() => showDetail(null))

graph.d3Force('charge').strength(n => (n.kind === 'session' ? -260 : n.kind === 'agent' ? -120 : -25))
graph.d3Force('link').distance(l => (l.kind === 'spawn' ? 70 : 22))

// ?bloom=0 turns the glow off for GPUs that struggle with post-processing.
const bloom = new URLSearchParams(location.search).get('bloom') === '0'
  ? null
  : new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), 1.1, 0.5, 0.35)
if (bloom) graph.postProcessingComposer().addPass(bloom)
// Paint the background in the scene so the bloom composer keeps it dark.
graph.scene().background = new THREE.Color('#05060d')
graph.scene().add(new THREE.AmbientLight(0x8899bb, 1.2))
graph.cameraPosition({ z: 320 })

function isLinkActive(l) {
  const target = nodes.get(idOf(l.target))
  return target?.status === 'active'
}

function tooltip(n) {
  const lines = [`<b>${escapeHtml(n.label)}</b> <i>${n.kind}</i>`]
  if (n.description) lines.push(escapeHtml(n.description))
  if (n.summary) lines.push(`<code>${escapeHtml(n.summary)}</code>`)
  if (n.status) lines.push(`status: ${n.status}`)
  return `<div class="tip">${lines.join('<br>')}</div>`
}

function baseColor(n) {
  if (n.kind === 'session') return n.status === 'done' ? COLORS.sessionEnded : COLORS.session
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

function buildObject(n) {
  const group = new THREE.Group()
  const color = baseColor(n)
  const parts = { group }

  if (n.kind === 'session') {
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(9, 32, 32), glowMaterial(color))
    parts.shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(15, 1),
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35 }),
    )
    parts.ringTrack = new THREE.Mesh(
      new THREE.TorusGeometry(21, 0.35, 8, 96),
      new THREE.MeshBasicMaterial({ color: '#1d2a3a' }),
    )
    group.add(parts.core, parts.shell, parts.ringTrack)
    parts.label = label(n.label, 6, '#e8fbff', 26)
    group.add(parts.label)
  } else if (n.kind === 'agent') {
    parts.core = new THREE.Mesh(new THREE.SphereGeometry(5, 24, 24), glowMaterial(color))
    parts.history = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.5, 8, 64),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 }),
    )
    group.add(parts.core, parts.history)
    parts.label = label(n.label, 4, '#f0e8ff', 14)
    group.add(parts.label)
  } else {
    parts.core = new THREE.Mesh(new THREE.OctahedronGeometry(2.2), glowMaterial(color))
    group.add(parts.core)
  }

  n.parts = parts
  n.shownColor = color
  return group
}

function label(text, height, color, y) {
  const sprite = new SpriteText(text, height, color)
  sprite.fontFace = 'ui-monospace, SFMono-Regular, Menlo, monospace'
  sprite.backgroundColor = 'rgba(5,6,13,0.4)'
  sprite.material.transparent = true
  sprite.padding = 1.5
  sprite.borderRadius = 2
  sprite.position.y = y
  return sprite
}

function setColor(n, color) {
  if (n.shownColor === color) return
  n.shownColor = color
  const m = n.parts.core.material
  m.color.set(color)
  m.emissive.set(color)
  n.parts.history?.material.color.set(color)
}

function updateContextRing(n) {
  const pct = n.context?.window ? Math.min(1, (n.context.tokens ?? 0) / n.context.window) : 0
  if (n.parts.contextPct === pct) return
  n.parts.contextPct = pct
  if (n.parts.ring) {
    n.parts.group.remove(n.parts.ring)
    n.parts.ring.geometry.dispose()
  }
  if (pct <= 0) return
  const color = pct > 0.85 ? COLORS.error : pct > 0.6 ? '#ffd166' : COLORS.session
  n.parts.ring = new THREE.Mesh(
    new THREE.TorusGeometry(21, 1.1, 8, 96, Math.PI * 2 * pct),
    new THREE.MeshBasicMaterial({ color }),
  )
  n.parts.ring.rotation.z = Math.PI / 2
  n.parts.group.add(n.parts.ring)
}

function animate(now) {
  for (const n of nodes.values()) {
    if (!n.parts) continue
    const { core, shell, history, group } = n.parts
    setColor(n, baseColor(n))
    const { label: tag } = n.parts
    if (tag) {
      if (tag.text !== n.label) tag.text = n.label
      tag.material.opacity = n.status === 'done' ? 0.35 : 1
    }

    const sincePulse = n.pulseAt ? now - n.pulseAt : Infinity
    const pulse = sincePulse < 1200 ? 1 + 0.35 * Math.sin((sincePulse / 1200) * Math.PI) : 1

    if (n.kind === 'session') {
      shell.rotation.y += 0.004
      shell.rotation.x += 0.0015
      core.scale.setScalar(pulse)
      updateContextRing(n)
    } else if (n.kind === 'agent') {
      const breathe = n.status === 'active' ? 1 + 0.08 * Math.sin(now / 260) : 0.7
      core.scale.setScalar(breathe * pulse)
      const r = 1 + Math.log2(1 + n.history) * 0.18
      history.scale.setScalar(r)
      history.rotation.x += 0.01
      history.rotation.y += 0.006
    } else {
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

let particlesKey = ''

function render() {
  const now = Date.now()
  sweep(now)
  if (dirty) {
    dirty = false
    graph.graphData({ nodes: [...nodes.values()], links: [...links] })
  }
  animate(now)
  // Re-evaluate particle counts only when the set of active links changes.
  const key = links.filter(isLinkActive).map(l => idOf(l.target)).join('|')
  if (key !== particlesKey) {
    particlesKey = key
    graph.linkDirectionalParticles(graph.linkDirectionalParticles())
  }
  requestAnimationFrame(render)
}

// ---------------------------------------------------------------------------
// HUD

const $ = sel => document.querySelector(sel)
const feed = $('#feed')

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

function feedLine(ev) {
  const time = new Date(ev.t).toLocaleTimeString([], { hour12: false })
  const who = ev.agent ? (nodes.get(aid(ev.session, ev.agent))?.label ?? 'subagent') : 'lead'
  let text
  switch (ev.kind) {
    case 'tool.start': text = `<span style="color:${toolColor(ev.tool)}">${escapeHtml(ev.tool)}</span> ${escapeHtml(ev.summary ?? '')}`; break
    case 'tool.end': if (ev.ok) return; text = `<span class="err">✕ ${escapeHtml(ev.tool)} failed</span>`; break
    case 'agent.spawn': text = `<span class="spawn">⇢ spawned ${escapeHtml(ev.type)}</span> ${escapeHtml(ev.description ?? '')}`; break
    case 'agent.end': text = '<span class="dim">✓ finished</span>'; break
    case 'turn.start': text = `<span class="turn">▸ prompt</span> ${escapeHtml(ev.text ?? '')}`; break
    case 'session.start': text = `<span class="turn">● session started</span> ${escapeHtml(ev.cwd ?? '')}`; break
    case 'session.end': text = '<span class="dim">○ session ended</span>'; break
    default: return
  }
  const li = document.createElement('li')
  li.innerHTML = `<time>${time}</time><b>${escapeHtml(who)}</b> ${text}`
  feed.prepend(li)
  while (feed.children.length > FEED_LIMIT) feed.lastChild.remove()
}

function refreshStats() {
  const all = [...nodes.values()]
  const count = (kind, status) => all.filter(n => n.kind === kind && (!status || n.status === status)).length
  $('#stat-sessions').textContent = count('session', 'active')
  $('#stat-agents').textContent = count('agent', 'active')
  $('#stat-tools').textContent = count('tool', 'active')
  $('#stat-calls').textContent = stats.calls
  $('#stat-errors').textContent = stats.errors
  const ctx = all.find(n => n.kind === 'session' && n.context)?.context
  $('#stat-context').textContent = ctx?.window ? `${Math.round(((ctx.tokens ?? 0) / ctx.window) * 100)}%` : '—'
}

function focus(n) {
  const distance = n.kind === 'session' ? 140 : 80
  const ratio = 1 + distance / Math.hypot(n.x || 1, n.y || 1, n.z || 1)
  graph.cameraPosition({ x: n.x * ratio, y: n.y * ratio, z: n.z * ratio }, n, 1200)
  showDetail(n)
}

function showDetail(n) {
  const panel = $('#detail')
  if (!n) return void panel.classList.add('hidden')
  const rows = [
    ['kind', n.kind], ['status', n.status], ['type', n.type], ['tool', n.tool],
    ['model', n.model], ['cwd', n.cwd], ['task', n.description], ['input', n.summary],
    ['prompt', n.prompt], ['calls done', n.kind !== 'tool' ? n.history : undefined],
    ['context', n.context?.window ? `${n.context.tokens?.toLocaleString()} / ${n.context.window.toLocaleString()} tokens` : undefined],
    ['id', n.agent ?? n.session],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '')
  panel.innerHTML = `<h3>${escapeHtml(n.label)}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>`
  panel.classList.remove('hidden')
}

// ---------------------------------------------------------------------------
// Stream

function connect() {
  const status = $('#conn')
  const source = new EventSource('/stream')
  source.addEventListener('open', () => {
    status.textContent = 'live'
    status.className = 'live'
  })
  source.addEventListener('replay', msg => {
    // A fresh replay: start over so a reconnect never doubles the graph.
    nodes.clear()
    links = []
    Object.assign(stats, { calls: 0, errors: 0, spawned: 0 })
    feed.replaceChildren()
    for (const ev of JSON.parse(msg.data)) apply(ev)
    for (const ev of JSON.parse(msg.data).slice(-FEED_LIMIT)) feedLine(ev)
    dirty = true
  })
  source.addEventListener('message', msg => {
    const ev = JSON.parse(msg.data)
    apply(ev)
    feedLine(ev)
  })
  source.addEventListener('error', () => {
    status.textContent = 'reconnecting…'
    status.className = 'down'
  })
}

addEventListener('resize', () => {
  graph.width(stage.clientWidth).height(stage.clientHeight)
  bloom?.setSize(stage.clientWidth, stage.clientHeight)
})

setInterval(refreshStats, 500)
connect()
requestAnimationFrame(render)
