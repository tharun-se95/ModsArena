// Speech and thought bubbles over the critters: the office's way of
// talking. Short lines you notice from across the room; reading in full and
// answering stay on the paperwork (panels.js).
//
//   💬 speech   something said to someone: a question for you, an answer,
//               a message to another agent, a picture it wants you to see
//   💭 thought  what it's working on right now (its checklist item)
//
// Kinds, each its own look:
//   ask      a question, a plan to approve or a command to allow; stays
//            until answered, outranks everything, click opens the thread
//   answer   a thread finishing a turn: the first words of its answer
//   mail     one loop messaging another; a small envelope flies across
//   relay    work arriving from outside (a project's coordinator, a peer)
//   you      a message you sent from the office, dropping in
//   made     a picture (with its thumbnail) or a delivery
//   think    the item in hand, as a cloud
//
// Bubbles live in one screen-space layer over the canvas, placed every
// frame at their critter's head. One bubble per critter at a time (the
// highest-ranked one alive), a cap on how many show at once, and when two
// would overlap the lower-ranked one shrinks to its badge. The thread
// you've selected always speaks in full.

import { escapeHtml } from './words.js'

const RANK = { ask: 0, you: 1, relay: 2, mail: 3, made: 4, answer: 5, think: 6 }
const TTL = { answer: 6, mail: 4, relay: 5, you: 4, made: 5 }
const MAX_SHOWN = 9
const SHORT = 30 // characters, for a critter you haven't selected
const LONG = 90
const FLY_S = 1.1

const clip = (text, n) => {
  const line = (text ?? '').replace(/\s+/g, ' ').trim()
  return line.length > n ? `${line.slice(0, n - 1).trimEnd()}…` : line
}

// The open floor between the panels, in stage pixels.
function lane(stage) {
  const r = stage.getBoundingClientRect()
  const left = document.querySelector('.hud.left')?.getBoundingClientRect()
  const side = document.querySelector('#side')?.getBoundingClientRect()
  return {
    l: left?.width ? left.right - r.left : 0,
    r: side?.width ? side.left - r.left : r.width,
  }
}

export function createBubbles({ stage, headAt, onPick }) {
  const layer = document.createElement('div')
  layer.className = 'bubbles'
  stage.append(layer)
  const spoken = new Map() // critter id -> { kind: bubble } (transient and lasting)
  const views = new Map() // `${critter}|${kind}` -> element
  const flights = []

  function element(key, kind, critter) {
    let el = views.get(key)
    if (el) return el
    el = document.createElement('div')
    el.className = `bub ${kind === 'think' ? 'thought' : 'speech'} ${kind}`
    el.addEventListener('click', () => onPick(el.dataset.pick || critter))
    layer.append(el)
    views.set(key, el)
    // Next frame, so it pops in.
    requestAnimationFrame(() => el.classList.add('on'))
    return el
  }

  // Say something. `ttl` in seconds (none for one that lasts until cleared).
  function say(critter, kind, fields, now) {
    if (!spoken.has(critter)) spoken.set(critter, {})
    spoken.get(critter)[kind] = { ...fields, kind, at: now, until: fields.ttl === null ? Infinity : now + (fields.ttl ?? TTL[kind] ?? 4) }
  }

  // A bubble that lasts: set it, or clear it with `null`.
  function hold(critter, kind, fields, now) {
    const had = spoken.get(critter)?.[kind]
    if (!fields) {
      if (had) delete spoken.get(critter)[kind]
      return
    }
    // Same words: keep its age, so it doesn't pop in again.
    if (had && had.key === fields.key) return
    say(critter, kind, { ...fields, ttl: null }, had?.at ?? now)
  }

  // An envelope flying from one critter to another.
  function fly(from, to, tint, now) {
    const el = document.createElement('div')
    el.className = 'bub-fly'
    el.style.setProperty('--tint', `var(--${tint})`)
    el.innerHTML = '<i></i>'
    layer.append(el)
    flights.push({ el, from, to, at: now })
  }

  function body(b, full) {
    const n = full ? LONG : SHORT
    switch (b.kind) {
      case 'ask': {
        const said = `<i class="badge ${b.type}">${b.type === 'permission' ? '&gt;_' : b.type === 'plan' ? '✎' : '?'}</i><span>${escapeHtml(full && b.long ? clip(b.long, LONG) : b.text)}</span>`
        // The selected thread's question, answerable right here (answer.js).
        if (!full || !b.options) return said
        return `${said}<div class="bub-opts" role="group" aria-label="Answer">${b.options.map(label => `<button type="button" data-ans="pick" data-key="${escapeHtml(b.answerKey)}" data-q="0" data-label="${escapeHtml(label)}">${escapeHtml(clip(label, 24))}</button>`).join('')}</div>`
      }
      case 'made':
        return `${b.src ? `<img alt="" src="${escapeHtml(b.src)}">` : `<i class="badge ${b.type}">${b.icon ?? '•'}</i>`}<span>${escapeHtml(clip(b.text, n))}</span>`
      case 'mail':
      case 'relay':
      case 'you':
        return `<b>${escapeHtml(b.who)}</b><span>${escapeHtml(clip(b.text, n))}</span>`
      case 'think':
        return `<span>${escapeHtml(clip(b.text, full ? 60 : 26))}</span>`
      default:
        return `<span>${escapeHtml(clip(b.text, n))}</span>`
    }
  }

  // Every frame: place what's alive, best first, and shrink what collides.
  function tick(now, { selected }) {
    const want = []
    for (const [critter, kinds] of spoken) {
      for (const [kind, b] of Object.entries(kinds)) if (now > b.until) delete kinds[kind]
      const best = Object.values(kinds).sort((a, b) => RANK[a.kind] - RANK[b.kind] || b.at - a.at)[0]
      if (!best) { spoken.delete(critter); continue }
      const head = headAt(critter)
      if (!head) continue
      want.push({ critter, b: best, head, mine: selected && (critter === selected || best.thread === selected) })
    }
    want.sort((x, y) => Number(y.mine) - Number(x.mine) || RANK[x.b.kind] - RANK[y.b.kind] || y.b.at - x.b.at)
    const placed = []
    const live = new Set()
    const open = lane(stage)
    want.forEach(({ critter, b, head, mine }, i) => {
      const key = `${critter}|${b.kind}`
      live.add(key)
      const el = element(key, b.kind, critter)
      el.dataset.pick = b.thread ?? ''
      const html = body(b, mine)
      if (el.dataset.html !== html) { el.innerHTML = html; el.dataset.html = html }
      el.classList.toggle('mine', Boolean(mine))
      // Behind a panel: a question still peeks out at the panel's edge, the
      // rest wait until the critter walks back into view.
      const hidden = head.x < open.l - 10 || head.x > open.r + 10
      el.classList.toggle('far', (i >= MAX_SHOWN && !mine) || (hidden && b.kind !== 'ask'))
      const w = el.offsetWidth
      const x = Math.min(Math.max(head.x, open.l + w / 2 + 8), open.r - w / 2 - 8)
      // The tail still points at the critter.
      el.style.setProperty('--tx', `${Math.max(-w / 2 + 14, Math.min(w / 2 - 14, head.x - x))}px`)
      el.style.left = `${x}px`
      el.style.top = `${head.y}px`
      // Collisions: the lower-ranked bubble shrinks to its badge.
      const r = { left: x - w / 2, right: x + w / 2, top: head.y - el.offsetHeight, bottom: head.y }
      const hit = placed.some(p => r.left < p.right && r.right > p.left && r.top < p.bottom && r.bottom > p.top)
      // Helpers' thoughts shrink even on the selected thread, or they pile up.
      el.classList.toggle('dot', hit && b.kind !== 'ask' && (!mine || b.kind === 'think'))
      if (!el.classList.contains('dot') && !el.classList.contains('far')) placed.push(r)
      el.style.zIndex = String(100 - i)
    })
    for (const [key, el] of views) {
      if (live.has(key)) continue
      views.delete(key)
      el.classList.remove('on')
      el.classList.add('gone')
      setTimeout(() => el.remove(), 300)
    }
    for (let i = flights.length - 1; i >= 0; i--) {
      const f = flights[i]
      const k = (now - f.at) / FLY_S
      const a = headAt(f.from)
      const z = headAt(f.to)
      if (k >= 1 || !a || !z) { f.el.remove(); flights.splice(i, 1); continue }
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      const lift = Math.sin(Math.PI * e) * Math.min(90, 30 + Math.hypot(z.x - a.x, z.y - a.y) * 0.35)
      f.el.style.left = `${a.x + (z.x - a.x) * e}px`
      f.el.style.top = `${a.y + (z.y - a.y) * e - lift}px`
      f.el.style.opacity = String(Math.min(1, (1 - k) * 4))
    }
  }

  return { say, hold, fly, tick, layer }
}
