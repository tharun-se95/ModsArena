// Removed from the office: projects, threads and agents you've put away.
// Nothing is deleted: the office just stops showing them, remembered in this
// browser, and Settings lists them to bring back. (Deleting for good is a
// separate choice, manage.js.)
//
//   { kind: 'project' | 'session' | 'agent', key, label, t, project?, session?, agent? }
//
// Keys: `p|<project id>`, `s|<session>`, `a|<session>|<agent>`. A removed
// project takes its threads with it, a removed thread its agents.
// The pure part (createRemoved) is tested on its own.

export const KEEP = 200

export const keyOf = item => item.kind === 'project' ? `p|${item.project}`
  : item.kind === 'session' ? `s|${item.session}` : `a|${item.session}|${item.agent}`

export function createRemoved(saved = []) {
  const items = new Map()
  for (const it of Array.isArray(saved) ? saved : []) {
    if (!it || !['project', 'session', 'agent'].includes(it.kind)) continue
    items.set(keyOf(it), { ...it, key: keyOf(it) })
  }
  // Which project each thread is in, from its start and from /history.
  const projectOf = new Map()

  const note = (session, project) => { if (session && project) projectOf.set(session, project) }

  // Whether an event belongs to something removed. Notes a thread's project
  // as it goes, so its later events follow.
  function hides(ev) {
    if (!ev?.session) return false
    if (ev.kind === 'session.start') note(ev.session, ev.project?.id ?? ev.cwd)
    if (items.has(`s|${ev.session}`)) return true
    if (ev.agent && items.has(`a|${ev.session}|${ev.agent}`)) return true
    const project = projectOf.get(ev.session)
    return Boolean(project && items.has(`p|${project}`))
  }

  // Whether a past session from /history is removed.
  function hidesPast(s) {
    note(s.session, s.project?.id)
    return items.has(`s|${s.session}`) || items.has(`p|${s.project?.id}`)
  }

  function add(item) {
    const it = { ...item, key: keyOf(item), t: item.t ?? Date.now() }
    items.delete(it.key)
    items.set(it.key, it)
    while (items.size > KEEP) items.delete(items.keys().next().value)
    return it
  }

  const restore = key => items.delete(key)
  const list = () => [...items.values()].reverse()
  const has = key => items.has(key)
  const toJSON = () => [...items.values()]

  return { hides, hidesPast, add, restore, list, has, note, toJSON }
}
