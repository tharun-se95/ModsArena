// Friendly names: a project called acme/payments-api is "Payments API" with
// a credit card on its sign; a thread is titled by what you asked it, tidied
// up; and how full a context window is reads as energy, from Fresh to Needs
// a break. You can rename a project and pick its icon; that's kept in this
// browser (prefs.js). Pure apart from that, so the node tests can read it.

import { load, save } from './prefs.js'

// ---------------------------------------------------------------------------
// Projects

const ACRONYMS = new Set(['api', 'apis', 'ui', 'ux', 'cli', 'sdk', 'db', 'ios', 'css', 'html', 'js', 'ts', 'ai', 'ml', 'url', 'http', 'aws', 'gcp', 'pr', 'ci', 'id', 'mcp', 'llm', 'sql', 'json', 'xml', 'seo', 'crm', 'cms', 'gpu', 'vm', 'os', 'qa', 'hq', 'k8s', 'tv'])
const SMALL = new Set(['a', 'an', 'and', 'of', 'the', 'for', 'to', 'in', 'on', 'or', 'at', 'by'])

// "acme/payments-api" -> "Payments API"; "ModsArena" -> "Mods Arena".
export function prettyProject(name) {
  const last = String(name ?? '').split(/[\\/]/).filter(Boolean).pop()?.replace(/\.git$/i, '') ?? ''
  const words = last.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[-_.\s]+/).filter(Boolean)
  if (!words.length) return String(name ?? '') || 'Elsewhere'
  return words.map((w, i) => {
    const lower = w.toLowerCase()
    if (ACRONYMS.has(lower)) return lower === 'apis' ? 'APIs' : lower === 'ios' ? 'iOS' : lower === 'k8s' ? 'K8s' : lower.toUpperCase()
    if (i > 0 && SMALL.has(lower)) return lower
    return w.charAt(0).toUpperCase() + w.slice(1)
  }).join(' ')
}

// An icon that fits the name, or one picked from it so it stays the same.
const ICON_HINTS = [
  [/pay|bill|checkout|invoice|stripe|wallet|money|finance|bank/, '💳'],
  [/dash|chart|metric|analytic|report|stats/, '📊'],
  [/auth|login|secur|password|vault|key/, '🔐'],
  [/doc|wiki|blog|book|write|notes?\b/, '📚'],
  [/test|qa|spec/, '🧪'],
  [/mobile|ios|android|app$/, '📱'],
  [/game|play/, '🎮'],
  [/design|ui|style|theme|brand/, '🎨'],
  [/shop|store|cart|commerce/, '🛍️'],
  [/bot|agent|ai|llm|ml|model/, '🤖'],
  [/data|db|sql|warehouse|etl/, '🗄️'],
  [/mail|chat|message|notif/, '💬'],
  [/web|site|www|front/, '🌐'],
  [/api|server|backend|service/, '🔌'],
  [/infra|deploy|ops|cloud|k8s|docker|terraform/, '☁️'],
  [/cli|tool|script|util/, '🧰'],
  [/mod|plugin|extension/, '🧩'],
]
export const ICONS = ['🪴', '🦊', '🐙', '🚀', '🍋', '🧭', '🎈', '🐝', '🌻', '⛵', '🦉', '🍄', '🐢', '🌈', '🔭', '🎒']
// What the picker offers: the hints' icons, then the friendly ones.
export const PICKS = [...new Set([...ICON_HINTS.map(([, i]) => i), ...ICONS])].slice(0, 32)

const hash = s => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export function defaultIcon(name) {
  const last = String(name ?? '').split(/[\\/]/).filter(Boolean).pop()?.toLowerCase() ?? ''
  return ICON_HINTS.find(([re]) => re.test(last))?.[1] ?? ICONS[hash(last) % ICONS.length]
}

// What you've changed, by project id (its path): { name?, icon? }.
let custom = load('projects', {}) ?? {}

export function projectName(id, raw) {
  return custom[id]?.name || prettyProject(raw ?? id)
}

export function projectIcon(id, raw) {
  return custom[id]?.icon || defaultIcon(raw ?? id)
}

export const isCustom = id => Boolean(custom[id]?.name || custom[id]?.icon)

export function setProject(id, { name, icon } = {}) {
  const next = { ...custom }
  const entry = { ...(name?.trim() && { name: name.trim().slice(0, 40) }), ...(icon && { icon }) }
  if (Object.keys(entry).length) next[id] = entry
  else delete next[id]
  custom = next
  save('projects', custom)
}

// ---------------------------------------------------------------------------
// Threads: titled by their goal, the first prompt tidied up.

const LEAD_INS = /^(?:(?:hey|hi|hello|ok|okay)(?:\s+claude)?[\s,!.:-]+|please\s+|pls\s+|(?:can|could|would|will)\s+(?:you|u)\s+(?:please\s+)?|i\s+(?:want|need|would like|'d like)\s+(?:you\s+)?to\s+|help\s+me\s+(?:to\s+)?|let'?s\s+|go\s+ahead\s+and\s+)/i

const humanize = cmd => cmd.split(':').pop().replace(/[-_]+/g, ' ')

// Cut at a word, with an ellipsis, so a title never ends mid-word.
export function clip(text, max) {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.5 ? cut.slice(0, space) : cut).replace(/[\s,;:.-]+$/, '')}…`
}

export function goalTitle(text, max = 64) {
  let s = String(text ?? '')
    .replace(/```[\s\S]*?(```|$)/g, ' ') // code blocks
    .replace(/<[^>]{1,200}>/g, ' ') // markup
  const cmd = /^\s*\/([\w:-]+)\b\s*/.exec(s)
  if (cmd) s = s.slice(cmd[0].length)
  s = s
    .replace(/`([^`\n]{1,32})`/g, '$1') // short code reads as a word
    .replace(/`[^`]*`/g, ' ') // long code doesn't
    .replace(/https?:\/\/(?:www\.)?([^/\s]+)\S*/g, '$1')
  // The first line that says something, and its first sentence.
  s = s.split('\n').map(l => l.replace(/^[\s>*#-]+/, '').trim()).find(Boolean) ?? ''
  s = s.split(/(?<=[.!?])\s+(?=[A-Z])/)[0]
  for (let i = 0; i < 3; i++) s = s.replace(LEAD_INS, '')
  s = s.replace(/\s+/g, ' ').replace(/[\s.!?,;:…]+$/, '').replace(/\s+please$/i, '').trim()
  // A slash command names the job: "/fix-issue 123" is "Fix issue 123".
  if (cmd) s = `${humanize(cmd[1])}${s ? ` ${s}` : ''}`
  if (!s) return ''
  s = s.charAt(0).toUpperCase() + s.slice(1)
  return clip(s, max)
}

// ---------------------------------------------------------------------------
// Energy: how much room a context window has left, in words. The exact
// percentage stays in the tooltip and in Developer view.

export const ENERGY = [
  { key: 'fresh', word: 'Fresh', below: 0.35 },
  { key: 'busy', word: 'Busy', below: 0.6 },
  { key: 'full', word: 'Getting full', below: 0.8 },
  { key: 'tired', word: 'Needs a break', below: Infinity },
]

export const energy = f => ENERGY.find(e => (f ?? 0) < e.below)

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// A small battery that drains as the window fills, with its word.
// `bare` leaves the word out (the critter's name tag).
export function energyMeter(f, { bare = false, title } = {}) {
  const e = energy(f)
  const tip = title ?? `${Math.round(f * 100)}% of its context window in use`
  return `<span class="energy ${e.key}" title="${esc(tip)}" ${bare ? `role="img" aria-label="${esc(`${e.word}: ${tip}`)}"` : ''}><i aria-hidden="true"><b style="width:${Math.max(8, Math.round((1 - f) * 100))}%"></b></i>${bare ? '' : `<span>${e.word}</span>`}</span>`
}
