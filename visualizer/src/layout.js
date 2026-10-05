// Where everything sits. Nothing is left to the physics simulation: every
// node is pinned to a place computed from stable slots, so the view never
// drifts, and a newcomer takes the next free place without moving the rest.
//
// Overview (no project chosen): projects on a grid, each with its sessions
// on a ring around it. Project view: that project's live sessions in a row,
// past sessions in a smaller row beneath, each session's agents on a ring
// around it, nested agents around their parent, tools close to their owner.

const PROJECT_GAP = 360
const OVERVIEW_LIVE_R = 70
const OVERVIEW_PAST_R = 115
const SESSION_GAP = 340
const PAST_GAP = 150
const PAST_ROW_Y = -300
const AGENT_RINGS = [{ r: 105, slots: 8 }, { r: 150, slots: 12 }, { r: 195, slots: 16 }]
const CHILD_R = 42
const CHILD_SLOTS = 6
const TOOL_R = { session: 36, agent: 16 }
const TOOL_SLOTS = 8

// Stable slots: a key keeps the slot it was first given.
const slots = new Map()
function slotOf(group, key) {
  let g = slots.get(group)
  if (!g) slots.set(group, (g = new Map()))
  if (!g.has(key)) g.set(key, g.size)
  return g.get(key)
}

// Tools come and go: each takes the lowest slot no live sibling holds.
const toolSlots = new Map()
function toolSlot(n, siblings) {
  if (toolSlots.has(n.id)) return toolSlots.get(n.id)
  const taken = new Set(siblings.map(s => toolSlots.get(s.id)))
  let slot = 0
  while (taken.has(slot)) slot++
  toolSlots.set(n.id, slot)
  return slot
}

const polar = (r, a) => ({ x: r * Math.cos(a), y: r * Math.sin(a) })
const add = (p, q, z = 0) => ({ x: p.x + q.x, y: p.y + q.y, z: (p.z ?? 0) + z })

function pin(n, p) {
  n.fx = n.x = p.x
  n.fy = n.y = p.y
  n.fz = n.z = p.z ?? 0
}

function agentRingPosition(slot) {
  let rest = slot
  for (const ring of AGENT_RINGS) {
    if (rest < ring.slots) {
      // Start at the top and go clockwise; offset outer rings by half a step.
      const step = (Math.PI * 2) / ring.slots
      const offset = ring === AGENT_RINGS[0] ? 0 : step / 2
      return polar(ring.r, Math.PI / 2 - rest * step - offset)
    }
    rest -= ring.slots
  }
  const last = AGENT_RINGS.at(-1)
  return polar(last.r + 40, Math.PI / 2 - rest * 0.4)
}

function overview(nodes, all, portrait) {
  const projects = all.filter(n => n.kind === 'project')
  const cols = portrait ? 1 : Math.max(1, Math.ceil(Math.sqrt(projects.length)))
  const order = projects.map(p => slotOf('project', p.projectId)).sort((a, b) => a - b)
  for (const p of projects) {
    // Grid cells follow first-seen order, compacted to the projects shown.
    const i = order.indexOf(slotOf('project', p.projectId))
    pin(p, { x: (i % cols) * PROJECT_GAP * 1.4, y: -Math.floor(i / cols) * PROJECT_GAP, z: 0 })
  }
  for (const s of all.filter(n => n.kind === 'session')) {
    const p = nodes.get(`p:${s.project}`)
    if (!p) continue
    const ring = s.past ? 'past' : 'live'
    const slot = slotOf(`ov|${s.project}|${ring}`, s.id)
    const r = s.past ? OVERVIEW_PAST_R : OVERVIEW_LIVE_R
    const count = s.past ? 10 : 6
    pin(s, add(p, polar(r + Math.floor(slot / count) * 24, Math.PI / 2 - (slot % count) * ((Math.PI * 2) / count))))
  }
}

function projectView(nodes, all, projectId, portrait) {
  // A row on a wide screen, a column on a tall one; past sessions alongside.
  const at = (main, cross) => (portrait ? { x: cross, y: -main, z: 0 } : { x: main, y: cross, z: 0 })
  const sessions = all.filter(n => n.kind === 'session')
  for (const s of sessions) {
    if (s.past) {
      const slot = slotOf(`past|${projectId}`, s.id)
      pin(s, portrait ? at(slot * PAST_GAP, -PAST_ROW_Y * 0.8) : at(slot * PAST_GAP, PAST_ROW_Y))
    } else {
      const slot = slotOf(`live|${projectId}`, s.id)
      pin(s, at(slot * SESSION_GAP, 0))
    }
  }

  // Agents: top-level ones on rings around their session, nested ones
  // around their parent agent. Parents are placed before children.
  const agents = all.filter(n => n.kind === 'agent')
  const placed = new Set()
  const placeAgent = a => {
    if (placed.has(a.id)) return
    placed.add(a.id)
    const parent = nodes.get(a.parent)
    if (parent?.kind === 'agent' && agents.includes(parent)) {
      placeAgent(parent)
      const slot = slotOf(`child|${parent.id}`, a.id)
      const step = (Math.PI * 2) / CHILD_SLOTS
      pin(a, add(parent, polar(CHILD_R + Math.floor(slot / CHILD_SLOTS) * 18, Math.PI / 2 - (slot % CHILD_SLOTS) * step + step / 2), 4))
    } else {
      const session = nodes.get(`s:${a.session}`)
      if (!session) return
      pin(a, add(session, agentRingPosition(slotOf(`agent|${session.id}`, a.id)), 2))
    }
  }
  agents.forEach(placeAgent)

  // Tools: a small ring right around whoever runs them.
  const tools = all.filter(n => n.kind === 'tool')
  for (const t of tools) {
    const owner = nodes.get(t.owner)
    if (owner?.fx === undefined) continue
    const siblings = tools.filter(o => o.owner === t.owner && o !== t)
    const slot = toolSlot(t, siblings)
    const r = (owner.kind === 'session' ? TOOL_R.session : TOOL_R.agent) + Math.floor(slot / TOOL_SLOTS) * 8
    pin(t, add(owner, polar(r, Math.PI / 4 - (slot % TOOL_SLOTS) * ((Math.PI * 2) / TOOL_SLOTS)), 6))
  }
}

export function place(nodes, view, projectFilter, portrait = false) {
  for (const id of toolSlots.keys()) if (!nodes.has(id)) toolSlots.delete(id)
  if (projectFilter) projectView(nodes, view.nodes, projectFilter, portrait)
  else overview(nodes, view.nodes, portrait)
}
