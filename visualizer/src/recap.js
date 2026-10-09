// Today in the office, as a card you can share: the Today button in the
// top bar opens it, and once the day's work winds down it offers itself
// (once a day). "Copy as text" puts it on your clipboard; "Save as image"
// draws the same card on a canvas and saves it as a PNG. Nothing leaves
// the page: the words come from today.js, over what the page already has.

import { nodes, outputs, helpers, threadState } from './model.js'
import { escapeHtml } from './words.js'
import { todayRecap, headline, shippedWords, helperWords, effortWords, recapText, windingDown, dateWords } from './today.js'
import { KINDS, copyText } from './deliverables.js'

const $ = sel => document.querySelector(sel)
const SHOW_SHIPPED = 8
const OFFER_KEY = 'agent-office:recap-offered'
// Demo-only: the sample threads never all stop, so the demo offers its
// recap a little while after it starts instead of waiting for quiet.
const DEMO_OFFER_MS = 45000

let pick = () => {}
let demoSince = 0
let lastBusyAt = Date.now()
let offered = null
let status = ''

const store = {
  get() { try { return Number(localStorage.getItem(OFFER_KEY)) || null } catch { return null } },
  set(v) { try { localStorage.setItem(OFFER_KEY, String(v)) } catch {} },
}

const current = (running = new Set()) => todayRecap({ nodes: nodes.values(), outputs, helpers, stateOf: n => threadState(n, running) })

// ---------------------------------------------------------------------------
// The card, as HTML

const KIND_TINT = { pr: 'leaf', artifact: 'lilac', plan: 'sky', link: 'teal', image: 'mustard' }

function tile(n, label, cls = '') {
  return `<div class="rc-tile ${cls}"><b>${n}</b><span>${label}</span></div>`
}

function cardHtml(r) {
  const things = r.shipped.filter(o => o.type !== 'image')
  return `
    <header class="rc-head">
      <p class="eyebrow">Today in the office</p>
      <h2 id="recap-title">${escapeHtml(dateWords(r.day))}</h2>
      <p class="rc-headline">${escapeHtml(headline(r))}</p>
      <button type="button" class="lib-close rc-close" data-recap="close" aria-label="Close">×</button>
    </header>
    <div class="rc-tiles">
      ${tile(r.shipped.length, 'shipped', 'ok')}${tile(r.finished.length, 'wrapped up')}${tile(r.waiting.length, 'waiting on you', r.waiting.length ? 'warn' : '')}${tile(r.helpers.reduce((s, h) => s + h.count, 0), 'helpers')}
    </div>
    <section class="rc-sec">
      <h3>What shipped</h3>
      <p class="rc-line">${escapeHtml(shippedWords(r))}</p>
      ${things.length ? `<ul class="rc-list">${things.slice(0, SHOW_SHIPPED).map(o => `
        <li><i class="rc-kind ${KIND_TINT[o.type] ?? ''}">${KINDS[o.type]?.icon ?? '•'}</i>${o.url ? `<a href="${escapeHtml(o.url)}" target="_blank" rel="noopener">${escapeHtml(o.title)}</a>` : `<span>${escapeHtml(o.title)}</span>`}<small>${escapeHtml(o.thread)}</small></li>`).join('')}</ul>
      ${things.length > SHOW_SHIPPED ? `<p class="rc-more">and ${things.length - SHOW_SHIPPED} more in the Library</p>` : ''}` : ''}
    </section>
    ${r.finished.length ? `<section class="rc-sec"><h3>Wrapped up</h3><ul class="rc-list plain">${r.finished.map(f => `<li><i class="rc-check">✓</i><button type="button" data-recap-pick="${escapeHtml(f.id)}">${escapeHtml(f.title)}</button></li>`).join('')}</ul></section>` : ''}
    <section class="rc-sec">
      <h3>Waiting on you</h3>
      ${r.waiting.length ? `<ul class="rc-list plain">${r.waiting.map(w => `<li><i class="rc-dot ${w.state}"></i><button type="button" data-recap-pick="${escapeHtml(w.id)}">${escapeHtml(w.title)}</button><small>${escapeHtml(w.words)}</small></li>`).join('')}</ul>` : '<p class="rc-line">Nothing. You’re all caught up.</p>'}
    </section>
    <section class="rc-sec"><h3>Who helped</h3><p class="rc-line">${escapeHtml(helperWords(r))}</p></section>
    <section class="rc-sec"><h3>The work</h3><p class="rc-line">${escapeHtml(effortWords(r))}</p></section>
    <footer class="rc-foot">
      <button type="button" class="dv-btn primary" data-recap="copy">Copy as text</button>
      <button type="button" class="dv-btn" data-recap="image">Save as image</button>
      <span class="rc-status" role="status">${escapeHtml(status)}</span>
    </footer>`
}

// ---------------------------------------------------------------------------
// The card, as a picture: the same parts drawn on a canvas, in the page's
// own colors, at twice the size for a crisp share.

function tokens() {
  const css = getComputedStyle(document.documentElement)
  const v = name => css.getPropertyValue(name).trim()
  return { paper: v('--paper'), bg: v('--bg'), ink: v('--ink'), muted: v('--muted'), line: v('--line'), accent: v('--accent'), ok: v('--ok'), warn: v('--warn'), leaf: v('--leaf'), lilac: v('--lilac'), sky: v('--sky'), teal: v('--teal'), mustard: v('--mustard'), serif: v('--serif'), sans: v('--sans'), mono: v('--mono') }
}

// Words wrapped to `width`; returns the lines.
function wrap(ctx, text, width) {
  const lines = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > width && line) { lines.push(line); line = word } else line = next
  }
  if (line) lines.push(line)
  return lines
}

function clip(ctx, text, width) {
  if (ctx.measureText(text).width <= width) return text
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}…`).width > width) t = t.slice(0, -1)
  return `${t.trimEnd()}…`
}

// Draws the card; with `paint` false it only measures. Returns the height.
function drawCard(ctx, r, c, paint) {
  const W = 600
  const P = 36
  const inner = W - P * 2
  let y = P
  const text = (str, x, yy, font, color, align = 'left') => {
    if (!paint) return
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.fillText(str, x, yy)
  }
  const para = (str, font, color, lh) => {
    ctx.font = font
    for (const l of wrap(ctx, str, inner)) { y += lh; text(l, P, y, font, color) }
  }
  const heading = str => { y += 26; text(str.toUpperCase(), P, y, `500 10.5px ${c.mono}`, c.muted) }

  text('TODAY IN THE OFFICE', P, y + 10, `500 11px ${c.mono}`, c.accent)
  y += 10
  y += 36
  text(dateWords(r.day), P, y, `600 28px ${c.serif}`, c.ink)
  y += 4
  para(headline(r), `400 16px ${c.serif}`, c.muted, 23)

  // Four tiles.
  y += 18
  const tiles = [[r.shipped.length, 'shipped', c.ok], [r.finished.length, 'wrapped up', c.ink], [r.waiting.length, 'waiting on you', r.waiting.length ? c.accent : c.ink], [r.helpers.reduce((s, h) => s + h.count, 0), 'helpers', c.ink]]
  const tw = (inner - 3 * 10) / 4
  tiles.forEach(([n, label, color], i) => {
    const x = P + i * (tw + 10)
    if (paint) {
      ctx.fillStyle = c.bg
      ctx.beginPath(); ctx.roundRect(x, y, tw, 66, 10); ctx.fill()
    }
    text(String(n), x + 12, y + 34, `600 26px ${c.serif}`, color)
    text(label, x + 12, y + 54, `500 11.5px ${c.sans}`, c.muted)
  })
  y += 66

  heading('What shipped')
  para(shippedWords(r), `400 13.5px ${c.sans}`, c.ink, 20)
  const things = r.shipped.filter(o => o.type !== 'image').slice(0, SHOW_SHIPPED)
  for (const o of things) {
    y += 26
    if (paint) {
      ctx.fillStyle = c[KIND_TINT[o.type]] || c.muted
      ctx.beginPath(); ctx.roundRect(P, y - 14, 18, 18, 4); ctx.fill()
    }
    text(KINDS[o.type]?.icon ?? '•', P + 9, y, `700 11px ${c.sans}`, '#fff', 'center')
    ctx.font = `500 13.5px ${c.sans}`
    text(clip(ctx, o.title ?? '', inner * 0.6), P + 28, y, `500 13.5px ${c.sans}`, c.ink)
    ctx.font = `400 11.5px ${c.sans}`
    text(clip(ctx, o.thread ?? '', inner * 0.34), W - P, y, `400 11.5px ${c.sans}`, c.muted, 'right')
  }
  if (r.finished.length) {
    heading('Wrapped up')
    para(r.finished.map(f => f.title).join(' · '), `400 13.5px ${c.sans}`, c.ink, 20)
  }
  heading('Waiting on you')
  para(r.waiting.length ? r.waiting.map(w => `${w.title} ${w.words}`).join(' · ') : 'Nothing. You’re all caught up.', `400 13.5px ${c.sans}`, c.ink, 20)
  heading('Who helped')
  para(helperWords(r), `400 13.5px ${c.sans}`, c.ink, 20)
  heading('The work')
  para(effortWords(r), `400 13.5px ${c.sans}`, c.ink, 20)
  y += 30
  if (paint) {
    ctx.strokeStyle = c.line
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(P, y - 14); ctx.lineTo(W - P, y - 14); ctx.stroke()
    ctx.setLineDash([])
  }
  text('Agent Office', P, y + 4, `600 13px ${c.serif}`, c.ink)
  text('made on your own computer', W - P, y + 4, `400 11px ${c.sans}`, c.muted, 'right')
  return y + P
}

export function recapImage(r) {
  const c = tokens()
  const scale = 2
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `400 13px ${c.sans}`
  const H = drawCard(ctx, r, c, false)
  canvas.width = 600 * scale
  canvas.height = Math.ceil(H * scale)
  ctx.scale(scale, scale)
  ctx.fillStyle = c.paper
  ctx.fillRect(0, 0, 600, H)
  ctx.fillStyle = c.accent
  ctx.fillRect(0, 0, 600, 5)
  ctx.textBaseline = 'alphabetic'
  drawCard(ctx, r, c, true)
  return canvas
}

function save(r) {
  const canvas = recapImage(r)
  canvas.toBlob(blob => {
    if (!blob) return say('Couldn’t make the picture.')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    const d = new Date(r.day)
    a.download = `agent-office-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.png`
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    say('Saved as a picture.')
  }, 'image/png')
}

// ---------------------------------------------------------------------------
// Open, close, offer

function say(text) {
  status = text
  draw()
  setTimeout(() => { if (status === text) { status = ''; draw() } }, 2400)
}

// Redrawn when it changes, at most every few seconds while it's open, so
// it doesn't jump under your pointer; focus stays on the same button.
let drawnAt = 0
let drawn = ''
function draw(force = true) {
  const dialog = $('#recap')
  if (!dialog?.open || (!force && Date.now() - drawnAt < 5000)) return
  const html = cardHtml(current())
  if (html === drawn) return
  const body = dialog.querySelector('.rc-body')
  const a = document.activeElement
  const keep = body.contains(a) && (a.dataset.recap ? `[data-recap="${a.dataset.recap}"]` : a.dataset.recapPick ? `[data-recap-pick="${CSS.escape(a.dataset.recapPick)}"]` : null)
  body.innerHTML = html
  drawn = html
  drawnAt = Date.now()
  if (keep) body.querySelector(keep)?.focus()
}

export function open() {
  const dialog = $('#recap')
  hideOffer()
  if (!dialog.open) dialog.showModal()
  status = ''
  draw()
  dialog.querySelector('[data-recap="copy"]')?.focus()
}

function close() {
  $('#recap')?.close()
}

function hideOffer() {
  const el = $('#recap-offer')
  if (el) el.hidden = true
}

function offer(day) {
  offered = day
  if (!demoSince) store.set(day)
  const el = $('#recap-offer')
  if (el) el.hidden = false
}

// Demo-only: sample activity offers the recap on a timer (see DEMO_OFFER_MS).
export function setDemo() {
  demoSince ||= Date.now()
  offered = null
}

export function mount({ onPick, demo = false }) {
  pick = onPick
  offered = store.get()
  if (demo) setDemo()
  $('#recap-open').addEventListener('click', open)
  const dialog = $('#recap')
  // Esc closes the card and stops there, rather than also leaving the thread.
  dialog.addEventListener('keydown', e => { if (e.key === 'Escape') e.stopPropagation() })
  dialog.addEventListener('click', async e => {
    if (e.target === dialog) return close() // the backdrop
    const what = e.target.closest('[data-recap]')?.dataset.recap
    const to = e.target.closest('[data-recap-pick]')?.dataset.recapPick
    if (what === 'close') close()
    else if (what === 'copy') say(await copyText(recapText(current())) ? 'Copied. Paste it anywhere.' : 'Couldn’t copy here.')
    else if (what === 'image') save(current())
    else if (to) { close(); pick(to) }
  })
  $('#recap-offer').addEventListener('click', e => {
    const what = e.target.closest('[data-offer]')?.dataset.offer
    if (what === 'open') open()
    else if (what === 'later') hideOffer()
  })
}

// Each panel refresh: keep the open card current, and offer it when the
// day's work winds down.
export function tick(running) {
  const now = Date.now()
  const live = [...nodes.values()].filter(n => n.kind === 'session' && !n.past && n.status !== 'done')
  if (live.some(n => threadState(n, running) === 'working')) lastBusyAt = now
  if ($('#recap')?.open) return draw(false)
  const r = current(running)
  if (offered === r.day) return
  if (demoSince ? now - demoSince > DEMO_OFFER_MS && r.shipped.length : windingDown(r, { now, lastBusyAt, offeredDay: offered })) offer(r.day)
}
