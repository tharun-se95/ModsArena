// A conversation, read in turns: each thing you (or the office) said
// starts one, and in it Claude works (its running notes, its tool calls,
// its checklist) and then answers. The transcript tab folds the work into
// one line and shows the answer in full, so a long session reads as
// question, answer, question, answer. Pure: entries in, turns out.
//
//   { prompt, work: [...], extras: [...], reply, running }
//
// `work` is what folds: notes Claude wrote along the way ('say' entries
// before its answer), tool calls and checklist updates. `extras` stay in
// view: what it made, what it asked you, and notes like "Context
// compacted". `reply` is its answer: its last words in the turn, said after
// its last tool call. `running` is true while the turn's last tool call
// has no result yet (only ever the last turn).

const SPOKEN = new Set(['you', 'chat'])
const WORK = new Set(['say', 'tool', 'todo'])

export function turnsOf(entries, results = new Map()) {
  const turns = []
  let cur = null
  for (const e of entries) {
    if (SPOKEN.has(e.kind) || !cur) {
      if (cur) turns.push(cur)
      cur = { prompt: SPOKEN.has(e.kind) ? e : null, body: [] }
      if (SPOKEN.has(e.kind)) continue
    }
    cur.body.push(e)
  }
  if (cur) turns.push(cur)
  return turns.map((t, i) => {
    const lastTool = t.body.findLastIndex(e => e.kind === 'tool')
    const lastSay = t.body.findLastIndex(e => e.kind === 'say')
    const replyAt = lastSay > lastTool ? lastSay : -1
    const work = t.body.filter((e, k) => WORK.has(e.kind) && k !== replyAt)
    const extras = t.body.filter(e => !WORK.has(e.kind))
    const isLast = i === turns.length - 1
    const running = isLast && lastTool !== -1 && !results.has(t.body[lastTool].id) && replyAt === -1
    return { prompt: t.prompt, work, extras, reply: replyAt === -1 ? null : t.body[replyAt], running }
  })
}

// An answer long enough to fold when it isn't the latest one.
export const LONG_REPLY = 700
export const isLong = reply => (reply?.text?.length ?? 0) > LONG_REPLY
