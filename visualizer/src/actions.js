// Quick actions on a thread or agent, under its name on the clipboard:
// "Wrap up" and "Explain what you did" send a well-worded message the way
// the message box does; "Stop" ends the turn a session is running, as Esc
// would in Claude Code (its mod calls the engine's turn abort). Stop asks
// once more before it acts, and there's none for a single subagent: a
// plugin can't stop one on its own.

import { nodes } from './model.js'
import { escapeHtml } from './words.js'
import * as transcript from './transcript.js'

export const PROMPTS = {
  wrap: 'Please wrap up: finish the step you’re on, don’t start anything new, then tell me in a few plain sentences what’s done, what isn’t, and anything I need to decide.',
  explain: 'Please explain what you did in plain words, for someone who isn’t a developer: what you changed, why, and how I can check it. Keep it short.',
}

const CONFIRM_MS = 4000
const notes = new Map() // node id -> { text, ok? }
let armed = null // { id, until }: Stop pressed once

// Which actions a thread or agent offers, by where it stands.
export function offered(n, state) {
  if (!n || ['ended', 'done', 'failed'].includes(state)) return []
  const list = ['explain', 'wrap']
  if (n.kind === 'session' && (state === 'working' || state === 'asking')) list.push('stop')
  return list
}

const LABELS = { wrap: 'Wrap up', explain: 'Explain what you did', stop: 'Stop' }
const TITLES = {
  wrap: 'Ask it to finish the step it’s on and sum up',
  explain: 'Ask it to explain its work in plain words',
  stop: 'End the turn it’s running, like pressing Esc in Claude Code',
}

export function bar(n, state) {
  if (!transcript.canMessage()) return ''
  const list = offered(n, state)
  if (!list.length) return ''
  const isArmed = armed?.id === n.id && Date.now() < armed.until
  const note = notes.get(n.id)
  return `
    <div class="quick" role="group" aria-label="Quick actions">
      ${list.map(a => `<button type="button" class="quick-${a} ${a === 'stop' && isArmed ? 'armed' : ''}" data-act="${a}" data-node="${escapeHtml(n.id)}" title="${escapeHtml(TITLES[a])}">${a === 'stop' && isArmed ? 'Stop now?' : LABELS[a]}</button>`).join('')}
    </div>
    ${note ? `<p class="quick-note ${note.ok === false ? 'bad' : ''}" role="status">${escapeHtml(note.text)}</p>` : ''}`
}

// The page (main.js) says how Stop reaches a session.
let stopper = async () => ({ ok: false, status: 'Stop isn’t available here' })
export function setStopper(fn) {
  stopper = fn
}

const changed = () => document.dispatchEvent(new CustomEvent('office:refresh'))

async function act(kind, n) {
  if (kind === 'stop') {
    if (!(armed?.id === n.id && Date.now() < armed.until)) {
      armed = { id: n.id, until: Date.now() + CONFIRM_MS }
      setTimeout(changed, CONFIRM_MS + 50)
      return changed()
    }
    armed = null
    notes.set(n.id, { text: 'Stopping…' })
    changed()
    const result = await stopper(n).catch(err => ({ ok: false, status: String(err.message ?? err) }))
    notes.set(n.id, { ok: result.ok, text: result.ok ? 'Asked Claude Code to stop this turn. You can tell it what to do next below.' : `Couldn’t stop it: ${result.status}` })
    return changed()
  }
  notes.set(n.id, { text: 'Sending…' })
  changed()
  const result = await transcript.say(n, PROMPTS[kind])
  notes.set(n.id, { ok: result.ok, text: result.ok ? `${kind === 'wrap' ? 'Asked it to wrap up' : 'Asked it to explain'}. ${n.kind === 'session' ? 'It reads this when it’s free.' : 'It goes straight to this agent.'}` : result.status })
  changed()
}

let isListening = false
export function listen() {
  if (isListening) return
  isListening = true
  document.addEventListener('click', e => {
    const b = e.target.closest?.('[data-act]')
    if (!b) return
    const n = nodes.get(b.dataset.node)
    if (n) void act(b.dataset.act, n)
  })
}
