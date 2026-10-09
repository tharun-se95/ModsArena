// What a thread hands you, as things you can pick up: each pull request,
// doc, plan, picture or file lands as a card of paper with Open and Copy
// link on it, in the clipboard's Outputs tab and in the Library, where
// each thread's cards sit together in a folder of their own.
//
// The pure parts (what Open does, what Copy copies, the grouping) are
// tested in deliverables.test.mjs; the card is plain HTML for panels.js.

import { escapeHtml, ago } from './words.js'

export const KINDS = {
  pr: { name: 'Pull request', icon: '⇡' },
  artifact: { name: 'Doc', icon: '◈' },
  link: { name: 'Link', icon: '↗' },
  plan: { name: 'Plan', icon: '✎' },
  image: { name: 'Picture', icon: '▣' },
  file: { name: 'File', icon: '▤' },
}

// The things worth a card of their own; a changed file is a line.
export const isDeliverable = o => ['pr', 'artifact', 'link', 'plan'].includes(o.type)

const keyOf = o => `${o.session}|${o.id}`

export const hostOf = url => { try { return new URL(url).host.replace(/^www\./, '') } catch { return '' } }

// What Open does: follow its link, or show it full size here.
export function openOf(o) {
  if (o.url) return { href: o.url }
  if (o.type === 'image' || (o.type === 'plan' && o.text)) return { zoom: keyOf(o) }
  return null
}

// What Copy puts on your clipboard, and what the button says.
export function copyOf(o) {
  if (o.url) return { text: o.url, label: 'Copy link' }
  if (o.path) return { text: o.path, label: 'Copy path' }
  if (o.text) return { text: o.text, label: 'Copy text' }
  return null
}

// Outputs by thread, the thread that made something last first; within
// a thread, newest first (the order `outputs` keeps).
export function byThread(list) {
  const groups = new Map()
  for (const o of list) {
    if (!groups.has(o.session)) groups.set(o.session, [])
    groups.get(o.session).push(o)
  }
  return [...groups].map(([session, items]) => ({ session, items }))
}

// Just arrived: the card slides in like a sheet into a tray.
const FRESH_MS = 4000

// A card. `where` names the thread or agent that made it, when that
// isn't obvious from where the card sits.
export function card(o, { where = '', now = Date.now(), copied = null } = {}) {
  const kind = KINDS[o.type] ?? { name: 'Output', icon: '•' }
  const open = openOf(o)
  const copy = copyOf(o)
  const sub = [o.url ? hostOf(o.url) : o.path, where, ago(o.t)].filter(Boolean).join(' · ')
  const diff = o.meta?.additions !== undefined ? `<span class="diff"><ins>+${o.meta.additions}</ins> <del>−${o.meta.deletions ?? 0}</del></span>` : ''
  const isCopied = copied === keyOf(o)
  const openBtn = !open ? ''
    : open.href ? `<a class="dv-btn primary" href="${escapeHtml(open.href)}" target="_blank" rel="noopener">Open<span aria-hidden="true"> ↗</span></a>`
      : `<button type="button" class="dv-btn primary" data-zoom="${escapeHtml(open.zoom)}">Open</button>`
  const copyBtn = copy ? `<button type="button" class="dv-btn ${isCopied ? 'done' : ''}" data-copy="${escapeHtml(keyOf(o))}" aria-label="${escapeHtml(`${copy.label}: ${o.title}`)}">${isCopied ? 'Copied ✓' : copy.label}</button>` : ''
  return `
    <article class="dv ${escapeHtml(o.type)} ${now - o.t < FRESH_MS ? 'fresh' : ''}" data-dv="${escapeHtml(keyOf(o))}">
      <p class="dv-kind"><i>${kind.icon}</i>${kind.name}${o.meta?.state ? ` · ${escapeHtml(o.meta.state)}` : ''}${diff}</p>
      <h4 class="dv-title">${escapeHtml(o.title ?? kind.name)}</h4>
      ${sub ? `<p class="dv-sub">${escapeHtml(sub)}</p>` : ''}
      ${openBtn || copyBtn ? `<p class="dv-acts">${openBtn}${copyBtn}</p>` : ''}
    </article>`
}

// ---------------------------------------------------------------------------
// Copying, with a moment of "Copied ✓" on the button.

let copied = null // { key, until }
export const copiedKey = (now = Date.now()) => (copied && now < copied.until ? copied.key : null)

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Without the clipboard API (an http page on another host): the old way.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.append(area)
    area.select()
    let ok = false
    try { ok = document.execCommand('copy') } catch {}
    area.remove()
    return ok
  }
}

// Wire the Copy buttons under `root`. `find` turns a card's key into its
// output; `redraw` re-renders the panels.
export function bind(root, { find, redraw }) {
  for (const b of root.querySelectorAll('[data-copy]')) {
    b.onclick = async e => {
      e.preventDefault()
      e.stopPropagation()
      const o = find(b.dataset.copy)
      const what = o && copyOf(o)
      if (!what || !(await copyText(what.text))) return
      copied = { key: b.dataset.copy, until: Date.now() + 1600 }
      redraw()
      setTimeout(redraw, 1700)
    }
  }
}
