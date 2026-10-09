// One line per thread, in plain words, saying what it's doing and why:
// "Writing tests for the refund flow (step 3 of 5), after reading the
// payment code." It sits under the thread's title in the directory, on the
// clipboard and in the hover bubble.
//
// Rule-based and free: it's made from what the page already knows (the
// goal, the checklist, the last thing done, where the thread stands and
// what it made), never by asking Claude, so it spends no tokens.
//
//   summarize(facts)   pure, tested: facts in, one sentence out
//   summaryOf(n)       the page's side: gathers a thread's facts
//
// LATER (not built): an opt-in, Claude-written summary would plug in at
// summaryOf(), returning its sentence when it has a fresh one and falling
// back to summarize() otherwise; the three places that show the line
// wouldn't change.

import { describe, fileTopic } from './plain.js'
import { clip, goalTitle } from './names.js'
import { nodes, outputs, openAsks, threadState } from './model.js'
import { activity } from './words.js'
import { devView } from './prefs.js'

export const MAX = 90

const lower = s => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s)
const upper = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
// "Couldn’t check the tests" -> "check the tests".
const base = d => d.fail.replace(/^Couldn’t /, '')
const tidy = s => String(s ?? '').replace(/\s+/g, ' ').replace(/[\s.!?,;:…]+$/, '').trim()

// Words in a checklist step or goal that only a developer reads: `code`,
// paths and file names become what they're about ("src/pay/refund.ts" is
// "the refund code"); in Developer view they stay as written.
export function plainWords(text, dev = false) {
  let s = tidy(text)
  if (dev) return s
  s = s.replace(/`([^`]+)`/g, '$1')
  s = s.replace(/(?:^|(?<=\s))(?:the\s+)?([\w.@~-]*[\\/][\w./\\@~-]+|[\w-]+\.(?:[cm]?[jt]sx?|py|rb|go|rs|java|kt|swift|php|cs|cpp|c|h|vue|svelte|md|json|ya?ml|toml|css|scss|html|sql|sh))\b/gi, (_, p) => fileTopic(p))
  return s
}

// Most goals start with what to do ("Fix the stale cache"), so they read
// as the "why" after "to"; anything else is quoted.
const DOING = /^(add|answer|build|change|check|clean|compare|create|debug|deploy|design|draft|explain|figure|find|finish|fix|get|harden|help|implement|improve|investigate|look|make|migrate|move|plan|polish|port|prepare|refactor|remove|rename|research|review|rewrite|run|set|ship|show|speed|split|summari[sz]e|support|switch|test|tidy|track|turn|update|upgrade|write)\b/i

// A checklist item written as an order ("Run the suite") as what it's
// doing ("Running the suite"), when it starts with a verb we know.
const DOUBLE = new Set(['run', 'set', 'get', 'put', 'plan', 'ship', 'stop', 'split', 'cut', 'dig', 'map', 'swap', 'trim', 'drop', 'tag', 'log', 'chat', 'scan', 'pin', 'wrap'])
export function gerund(text) {
  const m = /^([A-Za-z]+)\b(.*)$/s.exec(text ?? '')
  if (!m || /ing$/i.test(m[1]) || !(DOING.test(m[1]) || DOUBLE.has(m[1].toLowerCase()))) return text
  const w = m[1].toLowerCase()
  const ing = DOUBLE.has(w) ? `${w}${w.at(-1)}ing` : /[^aeiouy]e$/.test(w) ? `${w.slice(0, -1)}ing` : `${w}ing`
  return `${upper(ing)}${m[2]}`
}

export function why(goal) {
  const g = tidy(goal)
  if (!g) return ''
  return DOING.test(g) ? `to ${lower(g)}` : `on “${clip(g, 40)}”`
}

const MADE = { pr: 'a pull request', image: 'a picture', artifact: 'a page', link: 'a link', plan: 'a plan' }

// The tool lines, in plain words or as the raw call in Developer view.
const now = (a, dev) => (dev ? `${a.tool}${a.summary ? ` ${a.summary}` : ''}` : describe(a.tool, a.summary).now)
const did = (a, dev) => {
  if (dev) return `${a.tool}${a.summary ? ` ${a.summary}` : ''}${a.ok === false ? ' (failed)' : ''}`
  const d = describe(a.tool, a.summary)
  return a.ok === false ? d.fail : d.done
}

// The first of `options` (each a list of parts, joined) that fits in `max`;
// past that, the shortest one, cut at a word.
function fit(options, max) {
  const lines = options.map(parts => parts.filter(Boolean).join('').trim()).filter(Boolean).map(s => `${upper(s)}.`.replace(/([.!?…])\.$/, '$1'))
  return lines.find(s => s.length <= max) ?? clip(lines.at(-1) ?? '', max)
}

// facts: {
//   state     'working' | 'asking' | 'stuck' | 'waiting' | 'ended'
//   goal      the thread's title ("Harden the session handling")
//   step      the checklist item in progress, as it says it now
//   done, total   the checklist's progress (total 0 when there's none)
//   doing     the running tool: { tool, summary }
//   last      the last finished tool: { tool, summary, ok }
//   ask       the first open ask: { type, question, tool, summary }
//   made      recent outputs, newest first: [{ type, title }]
//   helpers   agents at work for it
//   dev       Developer view: raw tool lines, words as written
// }
export function summarize(facts = {}, max = MAX) {
  const f = facts
  const dev = Boolean(f.dev)
  // Raw tool lines keep their case; words join the sentence lower-case.
  const lc = t => (dev ? t : lower(t))
  const goal = plainWords(f.goal, dev)
  const step = gerund(plainWords(f.step, dev))
  const total = f.total ?? 0
  const done = f.done ?? 0
  const of = total && done < total ? `step ${done + 1} of ${total}` : ''
  const after = f.last ? `after ${lc(dev ? did(f.last, dev) : now(f.last, dev))}` : ''
  const made = f.made?.[0]
  const madeWords = made ? `${MADE[made.type] ?? 'something'}${made.title ? ` (“${clip(tidy(made.title), 32)}”)` : ''}` : ''
  const madeShort = made ? MADE[made.type] ?? 'something' : ''

  switch (f.state) {
    case 'asking': {
      const a = f.ask ?? {}
      const where = of ? ` at ${of}` : ''
      if (a.type === 'permission') {
        const what = a.tool ? (dev ? `${a.tool}${a.summary ? ` ${a.summary}` : ''}` : base(describe(a.tool, a.summary))) : 'go on'
        return fit([[`Waiting for your OK to ${what}`, where], [`Waiting for your OK to ${what}`], ['Waiting for your OK to go on']], max)
      }
      if (a.type === 'plan') return fit([why(goal).startsWith('to ') ? ['Has a plan for you to approve, ', why(goal)] : [], ['Has a plan for you to approve']], max)
      const q = tidy(a.question)
      return fit([[q && `Asks you: ${q}?`], ['Has a question for you', where]], max)
    }
    case 'stuck':
      return fit([
        [f.last?.ok === false ? `Stopped: ${lc(did(f.last, dev))}` : `Stopped ${after || 'before finishing'}`, '; needs a look'],
        ['Stopped before finishing; needs a look'],
      ], max)
    case 'waiting':
      if (total && done >= total) return fit([[`All ${total} steps done`, madeShort ? ` and made ${madeWords}` : '', '; over to you'], [`All ${total} steps done`, madeShort ? ` and made ${madeShort}` : '', '; over to you'], [`All ${total} steps done; over to you`]], max)
      if (made) return fit([[`Made ${madeWords}; over to you`], [`Made ${madeShort}; over to you`]], max)
      if (of) return fit([[`Paused at ${of}`, after ? ` ${after}` : '', '; over to you'], [`Paused at ${of}; over to you`]], max)
      if (f.last) return fit([[did(f.last, dev), ' ', why(goal), '; over to you'], [did(f.last, dev), '; over to you'], ['Ready for you']], max)
      return 'Ready for you.'
    case 'ended':
      if (total && done >= total) return fit([[`Finished all ${total} steps`, madeShort ? ` and made ${madeWords}` : ''], [`Finished all ${total} steps`]], max)
      if (made) return fit([[`Finished after making ${madeWords}`], [`Finished after making ${madeShort}`]], max)
      if (f.last) return fit([['Ended ', after], ['Ended']], max)
      return 'Ended.'
    default: {
      // Working. What it's on, where that is in the checklist, and what
      // came just before (or why, when there's no checklist).
      const doing = f.doing ? now(f.doing, dev) : ''
      const helpers = f.helpers ? `with ${f.helpers === 1 ? 'a helper' : `${f.helpers} helpers`}` : ''
      if (step) {
        const was = doing && lower(doing) !== lower(step) ? `, now ${lc(doing)}` : after ? `, ${after}` : ''
        return fit([[step, of && ` (${of})`, was], [step, of && ` (${of})`], [step]], max)
      }
      if (doing) return fit([[doing, ' ', why(goal)], [doing, of && ` (${of})`], [doing]], max)
      if (helpers) return fit([['Working ', helpers, ' ', why(goal)], ['Working ', helpers]], max)
      if (after) return fit([['Thinking it over ', after], ['Thinking it over']], max)
      return fit([[why(goal).startsWith('to ') ? `Getting ready ${why(goal)}` : `Getting started ${why(goal)}`], ['Getting started']], max)
    }
  }
}

// ---------------------------------------------------------------------------
// The page's side

// A thread's facts, from the model and the activity feed.
export function factsOf(n, running = new Set()) {
  const todos = n.todos ?? []
  const step = todos.find(i => i.status === 'in_progress')
  let doing = null, helpers = 0
  for (const x of nodes.values()) {
    if (x.kind === 'tool' && x.status === 'active' && x.owner === n.id) doing ??= { tool: x.tool, summary: x.summary }
    if (x.kind === 'agent' && x.session === n.session && x.status !== 'done') helpers++
  }
  // Its own last move, not one of its helpers'.
  const last = activity.get(n.id)?.actions.find(a => !a.agent)
  const ask = openAsks(n)[0]
  return {
    state: threadState(n, running),
    goal: goalTitle(n.prompts?.[0]?.text) || '',
    step: step ? step.active ?? step.text : '',
    done: todos.filter(i => i.status === 'completed').length,
    total: todos.length,
    doing,
    last: last && { tool: last.tool, summary: last.summary, ok: last.ok },
    ask: ask && { type: ask.type, question: ask.questions?.[0]?.question, tool: ask.tool, summary: ask.summary },
    made: outputs.filter(o => o.session === n.session && MADE[o.type]).slice(0, 3).map(o => ({ type: o.type, title: o.title })),
    helpers,
    dev: devView(),
  }
}

// The line for a thread. (An opt-in Claude-written summary would be
// returned from here first; see the note at the top.)
export const summaryOf = (n, running) => summarize(factsOf(n, running))
