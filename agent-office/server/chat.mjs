// Messages from the office to a session or one of its subagents. The page
// posts them here (POST /chat); the session's mod picks up its own on its
// next poll (GET /inbox) and delivers them: to the session as its next
// prompt, to a subagent as a message. Each one's progress travels back as
// events (chat.sent, chat.delivered), so every open office page sees it.

import { randomUUID } from 'node:crypto'

const MAX_TEXT = 4000
const KEEP = 200
const ID = /^[\w-]{1,100}$/

const messages = new Map() // id -> { id, session, agent?, text, t, status }

// A new message, or a reason it can't be sent. `action: 'stop'` asks the
// session's mod to stop the turn it's running instead (no text).
export function send({ session, agent, text, action }) {
  if (typeof session !== 'string' || !ID.test(session)) return { error: 'session must be a session id' }
  if (agent !== undefined && (typeof agent !== 'string' || !ID.test(agent))) return { error: 'agent must be an agent id' }
  if (action !== undefined) {
    if (action !== 'stop' || agent !== undefined) return { error: 'only a session\'s turn can be stopped' }
    const message = { id: randomUUID(), session, action, text: '', t: Date.now(), status: 'queued' }
    messages.set(message.id, message)
    if (messages.size > KEEP) messages.delete(messages.keys().next().value)
    return { message }
  }
  if (typeof text !== 'string' || !text.trim()) return { error: 'text is empty' }
  if (text.length > MAX_TEXT) return { error: `text is longer than ${MAX_TEXT} characters` }
  const message = { id: randomUUID(), session, ...(agent ? { agent } : {}), text: text.trim(), t: Date.now(), status: 'queued' }
  messages.set(message.id, message)
  if (messages.size > KEEP) messages.delete(messages.keys().next().value)
  return { message }
}

// The session's queued messages, now marked as picked up.
export function take(session) {
  const out = []
  for (const m of messages.values()) {
    if (m.session === session && m.status === 'queued') {
      m.status = 'taken'
      out.push({ id: m.id, ...(m.agent ? { agent: m.agent } : {}), ...(m.action ? { action: m.action } : {}), text: m.text })
    }
  }
  return out
}

export function settle(id, ok) {
  const m = messages.get(id)
  if (m) m.status = ok ? 'delivered' : 'failed'
  return m
}

export const reset = () => messages.clear()
