// Spend in plain terms: "About $1.20 today", for the whole office (a chip
// in the top bar) and for each project (in the directory), with the exact
// figures in the tooltip. You can set a daily limit; the office gives a
// gentle heads-up at 80% of it and again once it's passed. It can't stop a
// session, so it only ever nudges.
//
// The numbers are what Claude Code reports for each session (the
// session.measure gauge, or the cost row of a past session's transcript),
// already in the page. A session's figure is its whole cost so far, so a
// session that began yesterday and is still going counts in full today.

import { nodes } from './model.js'

const KEY = 'agent-office-spend'
export const NEAR = 0.8

// ---------------------------------------------------------------------------
// Pure parts (tested)

export function startOfDay(now) {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// When a session last did anything.
const lastActive = s => Math.max(s.lastAt ?? 0, s.answeredAt ?? 0, s.turnAt ?? 0, s.endedAt ?? 0, s.startedAt ?? 0)

// Today's spend from sessions shaped like model nodes or /history rows:
// { session, costUsd, projectName | project.name, live, lastAt, endedAt ... }.
// A session counts once (a live one wins over its history row) when it was
// active since midnight.
export function today(sessions, now = Date.now()) {
  const since = startOfDay(now)
  const seen = new Set()
  const byProject = new Map()
  let total = 0
  let count = 0
  for (const s of sessions) {
    if (seen.has(s.session)) continue
    seen.add(s.session)
    if (!(s.costUsd > 0) || lastActive(s) < since) continue
    const project = s.projectName ?? s.project?.name ?? 'Elsewhere'
    byProject.set(project, (byProject.get(project) ?? 0) + s.costUsd)
    total += s.costUsd
    count++
  }
  return { total, byProject, count }
}

// "About $1.20", "About $48", "Less than a cent". Exact figures go in tooltips.
export function plain(usd) {
  if (!(usd >= 0.005)) return usd > 0 ? 'Less than a cent' : 'Nothing yet'
  return usd < 10 ? `About $${usd.toFixed(2)}` : `About $${Math.round(usd)}`
}

export const exact = usd => `$${(usd ?? 0).toFixed(4)}`

// Where today stands against your limit: none, ok, near (80% or more) or over.
export function standing(total, limit) {
  if (!(limit > 0)) return 'none'
  if (total >= limit) return 'over'
  return total >= limit * NEAR ? 'near' : 'ok'
}

// The heads-up, in words.
export function headsUp(total, limit) {
  const state = standing(total, limit)
  const cap = `$${limit % 1 ? limit.toFixed(2) : limit}`
  if (state === 'near') return `Heads up: ${plain(total).toLowerCase()} of your ${cap} for today so far.`
  if (state === 'over') return `You’ve passed today’s ${cap} limit, at ${plain(total).toLowerCase()}. Sessions keep going; this is only a nudge.`
  return ''
}

// ---------------------------------------------------------------------------
// Settings: the limit, and which heads-up you've already had today

let prefs = load()
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return { limit: Number(saved.limit) > 0 ? Number(saved.limit) : 0, warned: saved.warned ?? null }
  } catch {
    return { limit: 0, warned: null }
  }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch {}
}

// ---------------------------------------------------------------------------
// The chip, its panel and the heads-up

let chip = null
let panel = null
let toast = null
let toastTimer = 0
let current = { total: 0, byProject: new Map(), count: 0 }

const $ = sel => document.querySelector(sel)
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// The directory's line under a project: "About $1.20 today", or nothing.
export function projectNote(name) {
  const usd = current.byProject.get(name)
  if (!(usd > 0)) return ''
  return `<p class="room-spend" title="${esc(`${exact(usd)} today in ${name}`)}">${esc(plain(usd))} today</p>`
}

function drawChip() {
  const { total, count } = current
  const state = standing(total, prefs.limit)
  const words = total > 0 ? `${plain(total)} today` : 'Nothing spent today'
  chip.querySelector('.spend-words').textContent = words
  chip.querySelector('.spend-short').textContent = total > 0 ? `$${total < 10 ? total.toFixed(2) : Math.round(total)}` : '$0'
  chip.dataset.state = state
  chip.title = `${exact(total)} across ${count} session${count === 1 ? '' : 's'} active today${prefs.limit ? `, of a $${prefs.limit} daily limit` : ''}`
  chip.setAttribute('aria-label', `${words}. ${chip.title}`)
}

function drawPanel() {
  const { total, byProject } = current
  const rows = [...byProject].sort((a, b) => b[1] - a[1])
  const state = standing(total, prefs.limit)
  const pctUsed = prefs.limit ? Math.min(100, (total / prefs.limit) * 100) : 0
  const html = `
    <p class="eyebrow">Spend today</p>
    <p class="spend-big" title="${esc(exact(total))}">${esc(plain(total))}</p>
    ${prefs.limit ? `<span class="spend-meter ${state}" title="${Math.round(pctUsed)}% of your daily limit"><span style="width:${pctUsed.toFixed(1)}%"></span></span>` : ''}
    ${headsUp(total, prefs.limit) ? `<p class="spend-warn ${state}">${esc(headsUp(total, prefs.limit))}</p>` : ''}
    ${rows.length ? `<ul class="spend-rows">${rows.map(([name, usd]) => `<li title="${esc(exact(usd))}"><span>${esc(name)}</span><b>${esc(plain(usd))}</b></li>`).join('')}</ul>` : '<p class="spend-note">Nothing yet today.</p>'}
    <h3>Daily limit</h3>
    <form class="spend-limit"><label><span>$</span><input type="number" min="0" step="1" inputmode="decimal" placeholder="none" value="${prefs.limit || ''}" aria-label="Daily limit in dollars"></label><span class="spend-note">a day</span><button type="submit">Save</button></form>
    <p class="spend-note">You’ll get a heads-up at 80% of it. Sessions never stop on their own because of it.</p>
    <p class="spend-note">From the cost Claude Code reports for each session active since midnight; a session that started earlier counts in full.</p>`
  if (panel.dataset.html === html || panel.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return
  panel.dataset.html = html
  panel.innerHTML = html
}

function warn() {
  const state = standing(current.total, prefs.limit)
  if (state !== 'near' && state !== 'over') return
  const day = new Date(startOfDay(Date.now())).toDateString()
  if (prefs.warned?.day === day && (prefs.warned.state === state || prefs.warned.state === 'over')) return
  prefs.warned = { day, state }
  save()
  toast.querySelector('p').textContent = headsUp(current.total, prefs.limit)
  toast.dataset.state = state
  toast.hidden = false
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.hidden = true }, 15000)
}

// Called with every panel refresh, with /history's past sessions.
export function update(history = []) {
  const live = [...nodes.values()].filter(n => n.kind === 'session' && !n.past)
  current = today([...live, ...history], Date.now())
  if (!chip) return
  drawChip()
  if (!panel.hidden) drawPanel()
  warn()
}

function openPanel(open) {
  panel.hidden = !open
  chip.setAttribute('aria-expanded', String(open))
  if (open) {
    panel.dataset.html = ''
    drawPanel()
    panel.querySelector('input')?.focus()
  }
}

export function mount() {
  chip = $('#spend-open')
  panel = $('#spend')
  if (!chip || !panel) return
  toast = document.createElement('div')
  toast.id = 'spend-toast'
  toast.className = 'hud paper'
  toast.setAttribute('role', 'status')
  toast.hidden = true
  toast.innerHTML = '<p></p><button type="button">OK</button>'
  toast.querySelector('button').onclick = () => { toast.hidden = true }
  $('.stage-wrap').append(toast)
  chip.addEventListener('click', () => openPanel(panel.hidden))
  panel.addEventListener('submit', e => {
    e.preventDefault()
    const value = Number(panel.querySelector('input').value)
    prefs.limit = value > 0 ? Math.round(value * 100) / 100 : 0
    prefs.warned = null
    save()
    panel.querySelector('input').blur()
    panel.dataset.html = ''
    drawPanel()
    drawChip()
    warn()
  })
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) {
      openPanel(false)
      chip.focus()
    }
  })
  addEventListener('pointerdown', e => {
    if (!panel.hidden && !panel.contains(e.target) && !chip.contains(e.target)) openPanel(false)
  })
  drawChip()
}
