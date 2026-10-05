// Where everything sits. Nothing is left to physics: every node is pinned to
// a place computed from stable slots, so the view never drifts and a newcomer
// takes the next free place without moving anything else.
//
//   projects   on a grid of large cells, in the order they were first seen
//   sessions   on a grid inside their project (live first, past in a row below)
//   subagents  on fixed rings around their session; nested ones around their parent
//   tools      in a tight ring around whoever runs them

import { nodes } from './model.js'

export const SESSION_CELL = 290
const SESSION_COLS = 3
const PAST_CELL = 120
const PAST_COLS = 7
const PROJECT_GAP = 140
const AGENT_RINGS = [{ r: 92, slots: 8 }, { r: 132, slots: 12 }, { r: 172, slots: 16 }]
const CHILD_R = 34
const CHILD_SLOTS = 6
const TOOL_R = { session: 30, agent: 15 }
const TOOL_SLOTS = 8

// A key keeps the slot it was first given within its group.
const slots = new Map()
function slotOf(group, key) {
  let g = slots.get(group)
  if (!g) slots.set(group, (g = new Map()))
  if (!g.has(key)) g.set(key, g.size)
  return g.get(key)
}

// Agents and tools come and go: each keeps the lowest slot that no sibling
// on the map holds, so rings stay compact and a departure frees its place.
const freeSlots = new Map()
function freeSlot(n, siblings) {
  if (freeSlots.has(n.id)) return freeSlots.get(n.id)
  const taken = new Set(siblings.map(s => freeSlots.get(s.id)))
  let slot = 0
  while (taken.has(slot)) slot++
  freeSlots.set(n.id, slot)
  return slot
}

const polar = (r, a) => ({ x: r * Math.cos(a), y: r * Math.sin(a) })

function pin(n, x, y, z = 0) {
  n.fx = n.x = x
  n.fy = n.y = y
  n.fz = n.z = z
}

function ringPosition(slot) {
  let rest = slot
  for (const [i, ring] of AGENT_RINGS.entries()) {
    if (rest < ring.slots) {
      // From the top, clockwise; outer rings sit between the inner ones.
      const step = (Math.PI * 2) / ring.slots
      return polar(ring.r, Math.PI / 2 - rest * step - (i ? step / 2 : 0))
    }
    rest -= ring.slots
  }
  const last = AGENT_RINGS.at(-1)
  return polar(last.r + 40, Math.PI / 2 - rest * 0.35)
}

// A project's own size: its session grid plus the row of past sessions.
function projectSize(liveCount, pastCount, portrait) {
  // A project with nothing live only needs room for its past sessions.
  const maxCols = portrait ? 1 : SESSION_COLS
  const cols = Math.max(1, Math.min(maxCols, liveCount || 1))
  const rows = Math.ceil(liveCount / maxCols)
  const pastRows = Math.ceil(pastCount / PAST_COLS)
  const width = Math.max(rows ? cols * SESSION_CELL : 0, Math.min(pastCount, PAST_COLS) * PAST_CELL, PAST_CELL * 2)
  const height = rows * SESSION_CELL + (pastRows ? pastRows * PAST_CELL + (rows ? 40 : 0) : 0) || PAST_CELL
  return { width, height, cols, rows }
}

export function place(view, portrait = false) {
  const all = view.nodes
  const byId = new Map(all.map(n => [n.id, n]))
  // Free a slot only when its node is gone, not when a filter hides it.
  for (const id of freeSlots.keys()) if (!nodes.has(id)) freeSlots.delete(id)

  const projects = all.filter(n => n.kind === 'project')
    .sort((a, b) => slotOf('project', a.projectId) - slotOf('project', b.projectId))
  const sessions = all.filter(n => n.kind === 'session')

  // Projects left to right, wrapping into rows; each row as tall as its tallest.
  const sizes = new Map()
  for (const p of projects) {
    const mine = sessions.filter(s => s.project === p.projectId)
    const live = mine.filter(s => !s.past)
    const past = mine.filter(s => s.past)
    // Slots are taken in first-seen order, so a project keeps its arrangement.
    live.forEach(s => slotOf(`live|${p.projectId}`, s.id))
    past.forEach(s => slotOf(`past|${p.projectId}`, s.id))
    // Positions follow first-seen order, packed: a session that left frees its place.
    const byOrder = (group, list) => list.sort((a, b) => slotOf(group, a.id) - slotOf(group, b.id))
    byOrder(`live|${p.projectId}`, live).forEach((s, i) => { s.place = i })
    byOrder(`past|${p.projectId}`, past).forEach((s, i) => { s.place = i })
    sizes.set(p.id, projectSize(live.length, past.length, portrait))
  }
  // Portrait screens stack projects; wide ones spread them into a grid.
  const perRow = portrait ? 1 : Math.max(1, Math.ceil(Math.sqrt(projects.length)))
  let y = 0
  for (let i = 0; i < projects.length; i += perRow) {
    const row = projects.slice(i, i + perRow)
    let x = 0
    let tallest = 0
    for (const p of row) {
      const size = sizes.get(p.id)
      // The project node marks the top-left of its area; bounds go to the scene.
      pin(p, x, y)
      p.bounds = { x, y, width: size.width, height: size.height }
      x += size.width + PROJECT_GAP
      tallest = Math.max(tallest, size.height)
    }
    y -= tallest + PROJECT_GAP + 60
  }

  for (const s of sessions) {
    const p = byId.get(`p:${s.project}`)
    if (!p) continue
    const { cols, rows } = sizes.get(p.id)
    if (s.past) {
      const slot = s.place
      pin(s,
        p.bounds.x + PAST_CELL / 2 + (slot % PAST_COLS) * PAST_CELL,
        p.bounds.y - rows * SESSION_CELL - (rows ? 40 : 0) - PAST_CELL / 2 - Math.floor(slot / PAST_COLS) * PAST_CELL)
    } else {
      const slot = s.place
      pin(s,
        p.bounds.x + SESSION_CELL / 2 + (slot % cols) * SESSION_CELL,
        p.bounds.y - SESSION_CELL / 2 - Math.floor(slot / cols) * SESSION_CELL)
    }
  }

  // Agents: parents before children, so a nested ring has a centre to sit on.
  const agents = all.filter(n => n.kind === 'agent')
  const placed = new Set()
  const placeAgent = a => {
    if (placed.has(a.id)) return
    placed.add(a.id)
    const parent = byId.get(a.parent)
    if (parent?.kind === 'agent') {
      placeAgent(parent)
      if (parent.fx === undefined) return
      const slot = freeSlot(a, agents.filter(o => o !== a && o.parent === parent.id))
      const step = (Math.PI * 2) / CHILD_SLOTS
      const p = polar(CHILD_R + Math.floor(slot / CHILD_SLOTS) * 16, Math.PI / 2 - (slot % CHILD_SLOTS) * step + step / 2)
      pin(a, parent.fx + p.x, parent.fy + p.y, 2)
      return
    }
    const session = byId.get(`s:${a.session}`)
    if (session?.fx === undefined) return
    const siblings = agents.filter(o => o !== a && o.session === a.session && byId.get(o.parent)?.kind !== 'agent')
    const p = ringPosition(freeSlot(a, siblings))
    pin(a, session.fx + p.x, session.fy + p.y, 1)
  }
  agents.forEach(placeAgent)

  const tools = all.filter(n => n.kind === 'tool')
  for (const t of tools) {
    const owner = byId.get(t.owner)
    if (owner?.fx === undefined) continue
    const slot = freeSlot(t, tools.filter(o => o.owner === t.owner && o !== t))
    const r = (owner.kind === 'session' ? TOOL_R.session : TOOL_R.agent) + Math.floor(slot / TOOL_SLOTS) * 7
    const p = polar(r, Math.PI / 4 - (slot % TOOL_SLOTS) * ((Math.PI * 2) / TOOL_SLOTS))
    pin(t, owner.fx + p.x, owner.fy + p.y, 3)
  }
}

// The area a set of nodes covers, with room for agent rings around sessions.
export function boundsOf(nodes) {
  const pts = nodes.filter(n => n.fx !== undefined && (n.kind === 'session' || n.kind === 'project'))
  if (!pts.length) return null
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (const n of pts) {
    if (n.kind === 'project' && n.bounds) {
      x0 = Math.min(x0, n.bounds.x); x1 = Math.max(x1, n.bounds.x + n.bounds.width)
      y1 = Math.max(y1, n.bounds.y + 50); y0 = Math.min(y0, n.bounds.y - n.bounds.height)
    } else {
      x0 = Math.min(x0, n.fx - 140); x1 = Math.max(x1, n.fx + 140)
      y0 = Math.min(y0, n.fy - 140); y1 = Math.max(y1, n.fy + 140)
    }
  }
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, width: x1 - x0, height: y1 - y0 }
}
