// What Claude Code wraps around a message that didn't come from the
// keyboard. A plugin's prompt (the office's chat to a session) arrives as
//
//   The agent-office plugin sent a message:
//   <the message>
//
//   This is how Claude Code surfaces a prompt a plugin submits between turns — ...
//
// and a message to a subagent as "The coordinator sent a message while you
// were working:\n<the message>\n\nAddress this before completing your
// current task." unwrapPrompt() gives back the message and who sent it, so
// the office shows what you wrote. Shared by the bridge and the page.

const PLUGIN = /^The (\S+) plugin sent a message:\s*/
const COORDINATOR = /^The coordinator sent a message while you were working:\s*/
// The closing lines, which a one-line summary may have cut short ("This is how ...").
const TRAILERS = [
  'This is how Claude Code surfaces a prompt a plugin submits between turns',
  'Address this before completing your current task.',
]
const squash = s => s.replace(/\s+/g, ' ').trim()

function dropTrailer(body) {
  for (const at of body.matchAll(/\s+(?=This is how\b|Address this\b)/g)) {
    const tail = squash(body.slice(at.index)).replace(/(\.\.\.|…)$/, '').trim()
    if (TRAILERS.some(t => t.startsWith(tail) || tail.startsWith(t))) return body.slice(0, at.index)
  }
  return body
}

// { text, from } where `from` is the sending plugin, or undefined for text
// that isn't wrapped (returned as is).
export function unwrapPrompt(text, plugin) {
  if (typeof text !== 'string') return { text }
  const head = PLUGIN.exec(text) ?? COORDINATOR.exec(text)
  if (!head) return { text }
  return { text: dropTrailer(text.slice(head[0].length)).trim(), from: head[1] ?? plugin ?? 'a plugin' }
}

// Turn text that isn't anything anyone asked: a background task reporting
// in, slash-command markup and other engine notes.
export const isEngineNote = text => typeof text === 'string' && text.trimStart().startsWith('<')
