// A team with names: every critter gets a friendly first name and a role,
// so "general-purpose · Write regression tests" reads as "Femi the Builder".
// The name comes from the session or agent id alone, so it stays the same
// across reloads and on every page that shows it. Pure: no DOM, no Three.js.

// Short, warm, easy to say, from many places. Kept unique.
export const NAMES = [
  'Mika', 'Juno', 'Ravi', 'Aiko', 'Nia', 'Theo', 'Lena', 'Omar', 'Priya', 'Kofi',
  'Sana', 'Milo', 'Ines', 'Tariq', 'Yuki', 'Ada', 'Bruno', 'Cleo', 'Dev', 'Elif',
  'Femi', 'Gia', 'Hana', 'Ivo', 'Jada', 'Kai', 'Lumi', 'Mateo', 'Noor', 'Olu',
  'Pia', 'Quinn', 'Rumi', 'Sol', 'Tavi', 'Uma', 'Wren', 'Yara', 'Zuri', 'Arlo',
  'Bea', 'Chidi', 'Dara', 'Esme', 'Fern', 'Ilan', 'Kenji', 'Lila', 'Mira', 'Nico',
  'Remy', 'Suki', 'Tomas', 'Ama', 'Bodhi', 'Rafa', 'Anouk', 'Leif', 'Maya', 'Oren',
  'Tala', 'Vera', 'Ezra', 'Luca',
]

// What each kind of critter does, in a word.
const ROLES = {
  session: 'Lead',
  Explore: 'Researcher',
  Plan: 'Planner',
  'code-reviewer': 'Reviewer',
  'test-runner': 'Tester',
  'general-purpose': 'Builder',
}

// FNV-1a, so ids that differ by one character still land far apart.
function hash(text) {
  let h = 0x811c9dc5
  for (const c of String(text ?? '')) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

export const nameFor = id => NAMES[hash(id) % NAMES.length]

export const roleOf = type => ROLES[type] ?? (type ? 'Helper' : 'Lead')

// Names already given out in each thread, so its team never has two of the
// same: session -> Map(agent -> name). Agents are named in the order the
// office first meets them, which is the event order, so every page agrees.
const given = new Map()

function agentName(session, agent) {
  if (!given.has(session)) given.set(session, new Map())
  const team = given.get(session)
  if (team.has(agent)) return team.get(agent)
  const taken = new Set([nameFor(session), ...team.values()])
  const start = hash(`${session}|${agent}`) % NAMES.length
  let name = NAMES[start]
  for (let i = 1; i < NAMES.length && taken.has(name); i++) name = NAMES[(start + i) % NAMES.length]
  team.set(agent, name)
  return name
}

// Who a session or agent node is: { name, role, title }. An agent its lead
// named (a teammate called "scout") keeps that name.
export function who(n) {
  if (!n) return { name: '', role: '', title: '' }
  if (n.kind === 'session') {
    const name = nameFor(n.session)
    return { name, role: 'Lead', title: `${name} the Lead` }
  }
  const role = roleOf(n.type)
  const name = n.name || agentName(n.session, n.agent)
  return { name, role, title: `${name} the ${role}` }
}
