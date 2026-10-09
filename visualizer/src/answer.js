// Answering from the office: what you picked on a question card (or in a
// critter's speech bubble) and the words you typed, until it's sent.
//
// A real session's question is answered through the bridge (POST /answer)
// when its mod marked it `answerable`; Claude Code's own dialog stays up
// meanwhile, and whichever is answered first wins. A plan can only be sent
// back from here: approving one switches Claude Code out of plan mode,
// which only Claude Code can do. The demo answers everything itself.
//
// Buttons carry data-ans (what they do) and data-key (which ask); one
// listener on the document handles them all, so a card redrawn under your
// pointer still answers.

const drafts = new Map() // ask key -> { picks: { [question index]: label[] }, status?, ok? }
const asks = new Map() // ask key -> the ask, as last drawn

export const keyOf = ask => `${ask.who?.session ?? ask.session ?? ''}|${ask.id}`

// ---------------------------------------------------------------------------
// Pure: picks in, the bridge's answer out.

// Pick an option: a single-choice question holds one, a multi-select many.
export function toggle(picks, qi, label, isMulti) {
  const had = picks[qi] ?? []
  const next = isMulti ? (had.includes(label) ? had.filter(l => l !== label) : [...had, label]) : [label]
  return { ...picks, [qi]: next }
}

// Ready to send: every question has a pick, or there are your own words.
export function isReady(ask, picks, note = '') {
  if (note.trim()) return true
  const qs = ask.questions ?? []
  return qs.length > 0 && qs.every((q, i) => picks[i]?.length)
}

// What goes to the bridge: answers keyed by question, as Claude Code keys
// them (several picks comma-joined, as its dialog joins them).
export function payload(ask, picks, note = '') {
  if (ask.type === 'plan') return { choice: 'keep', ...(note.trim() && { note: note.trim() }) }
  const answers = {}
  ;(ask.questions ?? []).forEach((q, i) => { if (picks[i]?.length) answers[q.question] = picks[i].join(', ') })
  return { answers, ...(note.trim() && { note: note.trim() }) }
}

// One line for what was answered, as the office shows it afterwards.
export function summary(ask, body) {
  if (body.choice === 'keep') return 'Kept planning'
  const said = Object.values(body.answers ?? {})
  return [...said, ...(body.note ? [body.note] : [])].join(' · ')
}

// The choices worth putting in a bubble: one question, a single answer.
export function bubbleOptions(ask) {
  const q = ask.type === 'question' && ask.questions?.length === 1 ? ask.questions[0] : null
  return q && !q.multiSelect ? q.options.map(o => o.label).slice(0, 4) : undefined
}

// ---------------------------------------------------------------------------
// State the cards draw from

const draft = key => {
  if (!drafts.has(key)) drafts.set(key, { picks: {} })
  return drafts.get(key)
}
export const isPicked = (key, qi, label) => Boolean(drafts.get(key)?.picks[qi]?.includes(label))
export const statusOf = key => drafts.get(key)
export const remember = ask => { asks.set(keyOf(ask), ask) }

// The page (main.js) says how an answer is sent and whether an ask can be.
let route = { can: () => false, send: async () => ({ ok: false }) }
export function setRoute(r) {
  route = r
}
export const canAnswer = ask => Boolean(ask && route.can(ask))
// Demo-only: the sample sessions' plans can be approved from here too.
export const canApprove = ask => Boolean(ask && route.canApprove?.(ask))

const noteOf = key => document.querySelector(`[data-ans-note="${CSS.escape(key)}"]`)?.value ?? ''

async function send(key, body) {
  const ask = asks.get(key)
  const d = draft(key)
  if (!ask || d.status === 'Sending…') return
  d.status = 'Sending…'
  d.ok = undefined
  changed()
  const result = await route.send(ask, body).catch(err => ({ ok: false, status: String(err.message ?? err) }))
  d.ok = result.ok
  d.status = result.ok ? `Sent: ${summary(ask, body)}. Claude carries on.` : `Not sent: ${result.status ?? 'the bridge said no'}. You can still answer in Claude Code.`
  changed()
}

const changed = () => document.dispatchEvent(new CustomEvent('office:answered'))

function onClick(e) {
  const b = e.target.closest?.('[data-ans]')
  if (!b) return
  e.preventDefault()
  e.stopPropagation()
  const key = b.dataset.key
  const ask = asks.get(key)
  if (!ask) return
  const d = draft(key)
  switch (b.dataset.ans) {
    case 'pick': {
      const qi = Number(b.dataset.q ?? 0)
      const q = ask.questions?.[qi]
      d.picks = toggle(d.picks, qi, b.dataset.label, Boolean(q?.multiSelect))
      // One question, one choice: that's the answer.
      if (ask.questions?.length === 1 && !q?.multiSelect) void send(key, payload(ask, d.picks, noteOf(key)))
      else changed()
      break
    }
    case 'send':
      if (isReady(ask, d.picks, noteOf(key))) void send(key, payload(ask, d.picks, noteOf(key)))
      break
    case 'keep':
      void send(key, payload(ask, {}, noteOf(key)))
      break
    // Demo-only: the sample sessions take any word for an answer.
    case 'say':
      void send(key, { say: b.dataset.label })
      break
  }
}

function onKey(e) {
  const field = e.target.closest?.('[data-ans-note]')
  if (!field || e.key !== 'Enter' || e.isComposing) return
  e.preventDefault()
  const key = field.dataset.ansNote
  const ask = asks.get(key)
  if (!ask) return
  if (ask.type === 'plan') void send(key, payload(ask, {}, field.value))
  else if (isReady(ask, draft(key).picks, field.value)) void send(key, payload(ask, draft(key).picks, field.value))
}

let isListening = false
export function listen() {
  if (isListening) return
  isListening = true
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKey)
}
