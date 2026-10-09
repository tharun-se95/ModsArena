// Today in the office: what the day came to, from what the page already
// knows since local midnight. What shipped, which threads wrapped up, what
// waits on you, who helped, and how much work it took, in plain words.
// Pure; recap.js draws it, copies it and saves it as a picture.

export const startOfDay = now => {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`
const title = n => n.prompts?.[0]?.text ?? n.label ?? 'A thread'

const DOCS = ['artifact', 'plan', 'link']
const WAITING = { asking: 'needs your answer', waiting: 'is waiting on your reply', stuck: 'stopped on a problem' }

// `nodes` the model's nodes, `outputs` and `helpers` its lists, `stateOf`
// threadState for a live thread.
export function todayRecap({ nodes, outputs, helpers = [], now = Date.now(), stateOf }) {
  const day = startOfDay(now)
  const sessions = [...nodes].filter(n => n.kind === 'session')
  const threadOf = session => sessions.find(n => n.session === session)
  const live = n => !n.past && n.status !== 'done'
  // A thread counts today if it is live or ended today.
  const today = sessions.filter(n => live(n) || (n.endedAt ?? n.lastAt ?? 0) >= day)
  const made = outputs.filter(o => o.t >= day)
  const shipped = made.filter(o => o.type !== 'file')
  const files = new Map()
  for (const o of made) if (o.type === 'file') files.set(o.path ?? o.id, o)
  const waiting = today.filter(live)
    .map(n => ({ n, state: stateOf?.(n) }))
    .filter(x => x.state in WAITING)
    .map(({ n, state }) => ({ id: n.id, title: title(n), project: n.projectName, state, words: WAITING[state] }))
  // A thread waiting on you isn't wrapped up yet, whatever its checklist says.
  const yours = new Set(waiting.map(w => w.id))
  const finished = today.filter(n => !yours.has(n.id) && (!live(n) ||
    (n.todos?.length && n.todos.every(i => i.status === 'completed') && stateOf?.(n) !== 'working')))
  const byType = new Map()
  for (const h of helpers) if (h.t >= day) byType.set(h.type, (byType.get(h.type) ?? 0) + 1)
  const sum = key => today.reduce((s, n) => s + (n[key] ?? 0), 0)
  return {
    day,
    shipped: shipped.map(o => ({ type: o.type, title: o.title, url: o.url, session: o.session, thread: title(threadOf(o.session) ?? {}) })),
    prs: shipped.filter(o => o.type === 'pr').length,
    docs: shipped.filter(o => DOCS.includes(o.type)).length,
    pictures: shipped.filter(o => o.type === 'image').length,
    files: files.size,
    added: [...files.values()].reduce((s, o) => s + (o.meta?.additions ?? 0), 0),
    removed: [...files.values()].reduce((s, o) => s + (o.meta?.deletions ?? 0), 0),
    finished: finished.map(n => ({ id: n.id, title: title(n), project: n.projectName })),
    waiting,
    helpers: [...byType].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count || a.type.localeCompare(b.type)),
    threads: today.length,
    asked: today.reduce((s, n) => s + (n.prompts ?? []).filter(p => p.t >= day).length, 0),
    turns: sum('turns'),
    toolCalls: sum('toolCalls'),
    errors: sum('errors'),
  }
}

// One sentence for the top of the card.
export function headline(r) {
  const bits = []
  const things = r.shipped.length
  if (things) bits.push(`${plural(things, 'thing')} shipped`)
  if (r.finished.length) bits.push(`${plural(r.finished.length, 'thread')} wrapped up`)
  if (!bits.length) return r.threads ? 'Nothing shipped yet today, but the work is moving.' : 'A quiet day so far.'
  const lead = things >= 5 || r.finished.length >= 3 ? 'A good day: ' : ''
  const said = bits.join(' and ')
  return `${lead}${lead ? said : said.charAt(0).toUpperCase() + said.slice(1)}.`
}

// What shipped, counted by kind: "2 pull requests, 3 docs and 4 pictures".
export function shippedWords(r) {
  const parts = [
    r.prs && plural(r.prs, 'pull request'), r.docs && plural(r.docs, 'doc'),
    r.pictures && plural(r.pictures, 'picture'),
  ].filter(Boolean)
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0] ?? ''
  const files = r.files ? `${list ? '; ' : ''}${plural(r.files, 'file')} changed${r.added || r.removed ? ` (+${r.added} −${r.removed} lines)` : ''}` : ''
  return `${list}${files}` || 'Nothing yet.'
}

// Who helped: "Explore ×3, Plan ×2".
export function helperWords(r) {
  if (!r.helpers.length) return 'No helpers today; the threads did it on their own.'
  const total = r.helpers.reduce((s, h) => s + h.count, 0)
  return `${plural(total, 'helper')}: ${r.helpers.map(h => (h.count > 1 ? `${h.type} ×${h.count}` : h.type)).join(', ')}.`
}

// The work it took, the way you'd tell a friend.
export function effortWords(r) {
  if (!r.threads) return 'No threads ran today.'
  const asked = r.asked ? `You asked for ${plural(r.asked, 'thing')} across ${plural(r.threads, 'thread')}` : `${plural(r.threads, 'thread')} ran`
  const turns = r.turns ? `, in ${plural(r.turns, 'back-and-forth', 'back-and-forths')}` : ''
  const steps = r.toolCalls ? ` Claude took ${plural(r.toolCalls, 'step')} to do it: reading, editing, searching and running things` : ''
  const snags = r.toolCalls && r.errors ? `; ${r.errors} hit a snag along the way.` : r.toolCalls ? '.' : ''
  return `${asked}${turns}.${steps}${snags}`
}

export const dateWords = day => new Date(day).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

// The whole recap as plain text, to paste anywhere.
export function recapText(r) {
  const lines = [`Today in the office: ${dateWords(r.day)}`, headline(r), '']
  lines.push('What shipped', `  ${shippedWords(r)}`)
  for (const o of r.shipped.filter(o => o.type !== 'image').slice(0, 12)) lines.push(`  - ${o.title}${o.url ? ` (${o.url})` : ''}`)
  lines.push('', 'Wrapped up')
  lines.push(...(r.finished.length ? r.finished.map(f => `  - ${f.title}`) : ['  Nothing yet.']))
  lines.push('', 'Waiting on you')
  lines.push(...(r.waiting.length ? r.waiting.map(w => `  - ${w.title} ${w.words}`) : ['  Nothing. You’re all caught up.']))
  lines.push('', 'Who helped', `  ${helperWords(r)}`, '', 'The work', `  ${effortWords(r)}`)
  return lines.join('\n')
}

// Does the day look done? Something got done, nothing has worked for a
// while (less of a while in the evening), and it hasn't offered yet today.
export const QUIET_MS = 10 * 60000
export const EVENING_QUIET_MS = 2 * 60000
export function windingDown(r, { now = Date.now(), lastBusyAt = 0, offeredDay = null } = {}) {
  if (offeredDay === r.day) return false
  if (!r.shipped.length && !r.finished.length) return false
  const quiet = now - lastBusyAt
  return quiet >= QUIET_MS || (new Date(now).getHours() >= 17 && quiet >= EVENING_QUIET_MS)
}
