// An office that grows: each project earns milestones as its threads work
// (the first thing made, the first pull request, 100 tool calls…), and each
// one adds to its room: a trophy on the shelf, a poster, a neon sign, a
// bigger plant. Counted from what the office sees, and remembered in this
// browser (localStorage), so a room keeps its trophies across reloads.
//
// Counting is per thread and only ever goes up (the most it has seen), so a
// reconnect that replays every event, or /history telling it again, never
// counts the same work twice. Pure apart from load() and save().

const KEY = 'agent-office-milestones'
const KEEP_THREADS = 300 // per project; older threads fold into one tally

// In the order a project usually reaches them. `key` is what's counted,
// `goal` how many, `adds` what it puts in the room.
export const MILESTONES = [
  { id: 'first-output', title: 'First thing made', key: 'outputs', goal: 1, adds: 'A trophy for the shelf.' },
  { id: 'first-picture', title: 'First picture', key: 'pictures', goal: 1, adds: 'A poster went up.', decor: 'poster' },
  { id: 'first-pr', title: 'First pull request', key: 'prs', goal: 1, adds: 'A neon sign lit up.', decor: 'neon' },
  { id: 'turns-10', title: '10 requests', key: 'turns', goal: 10, adds: 'The plant grew.', decor: 'plant' },
  { id: 'tools-100', title: '100 tool calls', key: 'tools', goal: 100, adds: 'Another trophy.' },
  { id: 'first-team', title: 'First agent team', key: 'team', goal: 2, adds: 'Another trophy.', note: 'two or more agents on one thread' },
  { id: 'threads-5', title: '5 threads', key: 'threads', goal: 5, adds: 'Another trophy.' },
  { id: 'tools-1000', title: '1,000 tool calls', key: 'tools', goal: 1000, adds: 'The plant grew again.', decor: 'plant' },
]
export const COUNTS = ['turns', 'tools', 'outputs', 'pictures', 'prs', 'team']
// Summed across threads, except a team, which is the biggest one seen.
const BIGGEST = new Set(['team'])

export const empty = () => ({ v: 1, projects: {} })

function entry(store, project) {
  return (store.projects[project] ??= { threads: {}, folded: { count: 0 }, unlocked: {} })
}

// Remember what one thread has done so far. True when anything went up.
export function record(store, project, thread, counts) {
  const p = entry(store, project)
  const had = p.threads[thread]
  const now = had ?? {}
  let changed = !had
  for (const k of COUNTS) {
    const v = Math.max(now[k] ?? 0, counts[k] ?? 0)
    if (v !== (now[k] ?? 0)) changed = true
    now[k] = v
  }
  if (!had) {
    p.threads[thread] = now
    fold(p)
  }
  return changed
}

// A project with a long past keeps its newest threads one by one and the
// rest as a single tally.
function fold(p) {
  const ids = Object.keys(p.threads)
  for (const id of ids.slice(0, Math.max(0, ids.length - KEEP_THREADS))) {
    const t = p.threads[id]
    for (const k of COUNTS) p.folded[k] = BIGGEST.has(k) ? Math.max(p.folded[k] ?? 0, t[k]) : (p.folded[k] ?? 0) + t[k]
    p.folded.count++
    delete p.threads[id]
  }
}

export function totals(store, project) {
  const p = store.projects[project]
  const out = { threads: 0 }
  for (const k of COUNTS) out[k] = p?.folded[k] ?? 0
  if (!p) return out
  out.threads = p.folded.count + Object.keys(p.threads).length
  for (const t of Object.values(p.threads)) {
    for (const k of COUNTS) out[k] = BIGGEST.has(k) ? Math.max(out[k], t[k]) : out[k] + t[k]
  }
  return out
}

// Mark what a project has newly reached; returns those milestones.
export function check(store, project, at = Date.now()) {
  const p = entry(store, project)
  const have = totals(store, project)
  const fresh = []
  for (const m of MILESTONES) {
    if (p.unlocked[m.id] || have[m.key] < m.goal) continue
    p.unlocked[m.id] = at
    fresh.push(m)
  }
  return fresh
}

// Every milestone with where the project stands on it, for the Details tab.
export function progress(store, project) {
  const p = store.projects[project]
  const have = totals(store, project)
  return MILESTONES.map(m => ({ ...m, at: p?.unlocked[m.id], have: Math.min(have[m.key], m.goal) }))
}

// What the room shows: trophies on the shelf, and the bigger pieces.
export function decorOf(store, project) {
  const got = MILESTONES.filter(m => store.projects[project]?.unlocked[m.id])
  return {
    trophies: got.length,
    poster: got.some(m => m.decor === 'poster'),
    neon: got.some(m => m.decor === 'neon'),
    plant: got.filter(m => m.decor === 'plant').length,
  }
}

export function load(storage = globalThis.localStorage) {
  try {
    const raw = JSON.parse(storage.getItem(KEY))
    if (raw?.v === 1 && raw.projects) return raw
  } catch {}
  return empty()
}

// This browser's milestones, loaded once and shared by the scene and the
// panels.
let current = null
export const mine = () => (current ??= load())

export function save(store, storage = globalThis.localStorage) {
  try { storage.setItem(KEY, JSON.stringify(store)) } catch {}
}
