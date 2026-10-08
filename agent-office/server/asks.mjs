// Answers from the office to a question Claude Code is holding a turn for
// (AskUserQuestion) or a plan it wants approved (ExitPlanMode).
//
// The session's mod says an ask can be answered from the office by marking
// its ask.open `answerable`; the bridge keeps it open until its ask.close.
// The page posts an answer (POST /answer, token and all, like /chat); the
// mod, which keeps Claude Code's own dialog up the whole time, long-polls
// for it (GET /answer/wait) and hands it to the engine as the tool's
// result. Whichever comes first wins: the office or the terminal.

const ID = /^[\w-]{1,100}$/
const MAX_TEXT = 2000
const KEEP = 200
export const WAIT_MS = 15000
const OPEN_GRACE_MS = 5000

const open = new Map() // `${session}|${id}` -> { type, questions, answer?, waiters: Set }
const keyOf = (session, id) => `${session}|${id}`

// The bridge saw an event: an ask opening or closing.
export function track(ev) {
  if (ev.kind === 'ask.open' && ev.answerable === true && typeof ev.id === 'string') {
    open.set(keyOf(ev.session, ev.id), { type: ev.type ?? 'question', questions: Array.isArray(ev.questions) ? ev.questions : [], waiters: new Set() })
    if (open.size > KEEP) close(open.keys().next().value)
  } else if (ev.kind === 'ask.close' && typeof ev.id === 'string') {
    close(keyOf(ev.session, ev.id))
  }
}

function close(key) {
  const ask = open.get(key)
  if (!ask) return
  open.delete(key)
  for (const done of ask.waiters) done(undefined)
}

const text = v => (typeof v === 'string' && v.trim() ? v.trim().slice(0, MAX_TEXT) : undefined)

// What the page sent, checked against the ask it answers. A question takes
// `answers` (question text -> the option's label, or your own words) and
// maybe a `note`; a plan takes `{ choice: 'keep', note? }` (approving one
// switches Claude Code out of plan mode, which only Claude Code can do).
export function shape(ask, body) {
  if (ask.type === 'plan') {
    if (body.choice !== 'keep') return { error: 'a plan is approved in Claude Code; the office can only send it back' }
    return { answer: { choice: 'keep', ...(text(body.note) && { note: text(body.note) }) } }
  }
  const known = new Set(ask.questions.map(q => q?.question).filter(Boolean))
  const answers = {}
  for (const [q, a] of Object.entries(body.answers && typeof body.answers === 'object' ? body.answers : {})) {
    if (known.has(q) && text(a)) answers[q] = text(a)
  }
  if (!Object.keys(answers).length && !text(body.note)) return { error: 'no answer given' }
  return { answer: { answers, ...(text(body.note) && { note: text(body.note) }) } }
}

// The page's answer. Status codes for the bridge to send back.
export function answer(body) {
  if (!body || typeof body !== 'object') return { status: 400, error: 'expected an object' }
  const { session, id } = body
  if (typeof session !== 'string' || !ID.test(session) || typeof id !== 'string' || !ID.test(id)) return { status: 400, error: 'session and id must be ids' }
  const ask = open.get(keyOf(session, id))
  if (!ask) return { status: 404, error: 'that question is no longer open here; answer it in Claude Code' }
  if (ask.answer) return { status: 409, error: 'already answered' }
  const shaped = shape(ask, body)
  if (shaped.error) return { status: 400, error: shaped.error }
  ask.answer = shaped.answer
  for (const done of ask.waiters) done(shaped.answer)
  ask.waiters.clear()
  return { status: 200, answer: shaped.answer }
}

// The mod waiting for an answer: `{ answer }`, `{}` when none came within
// `ms` (it asks again), or `{ closed }`. The mod's ask.open can still be on
// its way (events are batched), so an unknown ask gets a moment to arrive.
export async function wait(session, id, ms = WAIT_MS, grace = OPEN_GRACE_MS) {
  for (const until = Date.now() + grace; !open.has(keyOf(session, id)) && Date.now() < until;) await new Promise(r => setTimeout(r, 100))
  const ask = open.get(keyOf(session, id))
  if (!ask) return Promise.resolve({ closed: true })
  if (ask.answer) return Promise.resolve({ answer: ask.answer })
  return new Promise(resolve => {
    const done = a => {
      clearTimeout(timer)
      ask.waiters.delete(done)
      resolve(a ? { answer: a } : open.has(keyOf(session, id)) ? {} : { closed: true })
    }
    const timer = setTimeout(() => done(undefined), ms)
    ask.waiters.add(done)
  })
}

// An answer as one line (the demo's sessions take it so).
export const line = a => (a.choice === 'keep' ? 'Kept planning' : [...Object.values(a.answers ?? {}), ...(a.note ? [a.note] : [])].join(' · '))

export const isOpen = (session, id) => open.has(keyOf(session, id))
export const reset = () => { for (const key of [...open.keys()]) close(key) }
