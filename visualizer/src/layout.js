// Fixed places for the structure: projects and sessions are pinned, so the
// cluster's core never drifts; only agents and tools move, around them.
//
// Each project and session takes the next slot on a golden-angle spiral the
// first time it is seen and keeps it, so a newcomer never reshuffles the rest.

const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const PROJECT_SPACING = 400
const LIVE_RING = { base: 95, step: 32, z: 0 }
const PAST_RING = { base: 200, step: 24, z: -60 }

const projectSlots = new Map() // projectId -> slot
const sessionSlots = new Map() // session node id -> { key, slot }
const nextSlot = new Map() // `${projectId}|live|past` -> next free slot

function spiral(slot, base, step) {
  const r = base + step * Math.sqrt(slot)
  const a = slot * GOLDEN
  return { x: r * Math.cos(a), y: r * Math.sin(a) }
}

function projectPosition(projectId) {
  if (!projectSlots.has(projectId)) projectSlots.set(projectId, projectSlots.size)
  const slot = projectSlots.get(projectId)
  if (slot === 0) return { x: 0, y: 0, z: 0 }
  const { x, y } = spiral(slot - 1, PROJECT_SPACING, PROJECT_SPACING * 0.35)
  return { x, y, z: 0 }
}

function sessionOffset(n) {
  const ring = n.past ? 'past' : 'live'
  const key = `${n.project}|${ring}`
  let held = sessionSlots.get(n.id)
  if (held?.key !== key) {
    const slot = nextSlot.get(key) ?? 0
    nextSlot.set(key, slot + 1)
    held = { key, slot }
    sessionSlots.set(n.id, held)
  }
  const spec = n.past ? PAST_RING : LIVE_RING
  const { x, y } = spiral(held.slot, spec.base, spec.step)
  return { x, y, z: spec.z }
}

function pin(n, p) {
  if (n.fx === p.x && n.fy === p.y && n.fz === p.z) return
  n.fx = n.x = p.x
  n.fy = n.y = p.y
  n.fz = n.z = p.z
}

function unpin(n) {
  n.fx = n.fy = n.fz = undefined
}

// A new agent or tool starts beside whoever made it, not at the origin.
function seed(n, nodes) {
  if (n.x !== undefined) return
  const anchor = nodes.get(n.kind === 'tool' ? n.owner : n.parent ?? `s:${n.session}`)
  if (anchor?.x === undefined) return
  const jitter = () => (Math.random() - 0.5) * 16
  n.x = anchor.x + jitter()
  n.y = anchor.y + jitter()
  n.z = anchor.z + jitter()
}

export function place(nodes) {
  for (const n of nodes.values()) {
    if (n.kind === 'project') {
      pin(n, projectPosition(n.projectId))
    } else if (n.kind === 'session') {
      if (!n.project) {
        unpin(n)
        continue
      }
      const base = projectPosition(n.project)
      const off = sessionOffset(n)
      pin(n, { x: base.x + off.x, y: base.y + off.y, z: base.z + off.z })
    } else {
      seed(n, nodes)
    }
  }
}
