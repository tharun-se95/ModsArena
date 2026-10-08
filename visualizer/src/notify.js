// Never miss a question: when a thread starts waiting on you, the tab says
// so ("(2) Agent Office" and a dot on its icon), and, if you've turned them
// on, your computer shows an alert that opens the thread when clicked.
//
//   Alerts      asked for from the top bar's Alerts panel, never on load;
//               only while the office isn't the window you're looking at
//   Quiet hours no alerts between two times you pick (22:00-08:00 by
//               default, off until you tick it); the tab still counts
//   Mute        per project: a muted project neither alerts nor counts
//
// Settings live in this browser's localStorage. Alerts are made by the
// browser on this computer; nothing is sent anywhere.

import { nodes, threadState } from './model.js'

const KEY = 'agent-office-alerts'
const YOURS = new Set(['asking', 'waiting', 'stuck'])

// ---------------------------------------------------------------------------
// Pure parts (tested)

const minutes = hhmm => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm ?? '')
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

// Whether `date` falls in quiet hours. A span that wraps past midnight
// (22:00-08:00) is quiet late at night and early in the morning.
export function inQuiet(date, quiet) {
  if (!quiet?.on) return false
  const from = minutes(quiet.from), to = minutes(quiet.to)
  if (from === null || to === null || from === to) return false
  const now = date.getHours() * 60 + date.getMinutes()
  return from < to ? now >= from && now < to : now >= from || now < to
}

export const titleFor = (count, base = 'Agent Office') => (count > 0 ? `(${count}) ${base}` : base)

// Threads that have just become yours: they were seen before in another
// state and now ask, wait or need a look. A thread seen for the first time
// doesn't ping (the page just opened, or the stream replayed).
export function arrivals(before, now) {
  return now.filter(t => YOURS.has(t.state) && before.has(t.id) && before.get(t.id) !== t.state &&
    // Moving between your own states (waiting to asking) pings only for a question.
    (!YOURS.has(before.get(t.id)) || t.state === 'asking'))
}

// What the alert says.
export function alertFor(n, state) {
  const name = n.prompts?.[0]?.text ?? n.label ?? 'A thread'
  const where = n.projectName ? ` · ${n.projectName}` : ''
  if (state === 'asking') {
    const ask = (n.asks ?? [])[0]
    const q = ask?.questions?.[0]?.question ?? (ask?.type === 'plan' ? 'It has a plan for you to approve.' : ask?.type === 'permission' ? 'It needs your OK to go on.' : 'It has a question for you.')
    return { title: `A question from “${clip(name, 40)}”`, body: `${clip(q, 140)}${where}` }
  }
  if (state === 'stuck') return { title: `“${clip(name, 40)}” needs a look`, body: `Its last turn didn’t finish.${where}` }
  return { title: `“${clip(name, 40)}” is waiting on you`, body: `${n.answer?.text ? clip(n.answer.text, 140) : 'Done with your last request.'}${where}` }
}

const clip = (s, n) => {
  const line = String(s).replace(/\s+/g, ' ').trim()
  return line.length > n ? `${line.slice(0, n - 1).trimEnd()}…` : line
}

// ---------------------------------------------------------------------------
// Settings

const DEFAULTS = { alerts: false, quiet: { on: false, from: '22:00', to: '08:00' }, muted: [] }
let prefs = load()

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return { ...DEFAULTS, ...saved, quiet: { ...DEFAULTS.quiet, ...saved.quiet }, muted: Array.isArray(saved.muted) ? saved.muted : [] }
  } catch {
    return structuredClone(DEFAULTS)
  }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch {}
}

const supported = () => typeof Notification !== 'undefined'
const permission = () => (supported() ? Notification.permission : 'unsupported')
const isMuted = n => prefs.muted.includes(n.projectName ?? 'Elsewhere')

// ---------------------------------------------------------------------------
// The tab: title and icon

let baseTitle = 'Agent Office'
let iconLink = null
let iconKey = ''

// The office's mark, drawn for the tab, with a dot when something waits.
function drawIcon(dot) {
  const key = `${dot}`
  if (key === iconKey) return
  iconKey = key
  const css = getComputedStyle(document.documentElement)
  const color = name => css.getPropertyValue(`--${name}`).trim()
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  g.beginPath(); g.arc(32, 32, 24, 0, Math.PI * 2); g.lineWidth = 5; g.strokeStyle = '#d8cfc2'; g.stroke()
  g.beginPath(); g.arc(32, 32, 12, 0, Math.PI * 2); g.fillStyle = color('accent') || '#b85c3c'; g.fill()
  g.beginPath(); g.arc(52, 18, 6, 0, Math.PI * 2); g.fillStyle = '#1f1d1a'; g.fill()
  if (dot) {
    g.beginPath(); g.arc(48, 48, 15, 0, Math.PI * 2); g.fillStyle = '#ffffff'; g.fill()
    g.beginPath(); g.arc(48, 48, 11.5, 0, Math.PI * 2); g.fillStyle = color('crit') || '#b4483a'; g.fill()
  }
  if (!iconLink) {
    iconLink = document.querySelector('link[rel="icon"]') ?? document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }))
  }
  iconLink.href = c.toDataURL('image/png')
}

// ---------------------------------------------------------------------------
// Watching the threads

let before = new Map()
let pick = () => {}
const shown = new Map() // thread id -> Notification

function alert(n, state) {
  if (!prefs.alerts || permission() !== 'granted' || isMuted(n) || inQuiet(new Date(), prefs.quiet)) return
  // You're looking at the office already: the inbox has it.
  if (document.visibilityState === 'visible' && document.hasFocus()) return
  const { title, body } = alertFor(n, state)
  try {
    shown.get(n.id)?.close()
    const note = new Notification(title, { body, tag: n.id, icon: iconLink?.href })
    note.onclick = () => {
      window.focus()
      pick(n.id)
      note.close()
    }
    shown.set(n.id, note)
  } catch {
    // Some browsers only allow alerts from a service worker; the tab still counts.
  }
}

// Called on every panel refresh with the set of loops running a tool.
export function update(running) {
  const threads = [...nodes.values()]
    .filter(n => n.kind === 'session' && !n.past && n.status !== 'done')
    .map(n => ({ id: n.id, n, state: threadState(n, running) }))
  for (const t of arrivals(before, threads)) alert(t.n, t.state)
  before = new Map(threads.map(t => [t.id, t.state]))
  const count = threads.filter(t => YOURS.has(t.state) && !isMuted(t.n)).length
  const title = titleFor(count, baseTitle)
  if (document.title !== title) document.title = title
  drawIcon(count > 0)
  // A thread you've answered takes its alert back.
  for (const [id, note] of shown) if (!YOURS.has(before.get(id))) { note.close(); shown.delete(id) }
  if (panel && !panel.hidden) drawProjects()
}

// ---------------------------------------------------------------------------
// The Alerts panel

let panel = null
let button = null

function permissionLine() {
  const p = permission()
  if (p === 'unsupported') return '<p class="alerts-note">This browser can’t show alerts. The tab title still counts what’s waiting.</p>'
  if (p === 'denied') return '<p class="alerts-note">Your browser has blocked alerts for this page. You can allow them again in the site settings (the icon left of the address).</p>'
  if (p !== 'granted') return '<button type="button" class="alerts-ask">Turn on desktop alerts</button><p class="alerts-note">Your browser will ask once. Alerts only show while you’re in another window or tab.</p>'
  return `<label class="alerts-row"><input type="checkbox" data-pref="alerts" ${prefs.alerts ? 'checked' : ''}> <span>Show desktop alerts</span></label><p class="alerts-note">Only while you’re in another window or tab. Click one to open its thread.</p>`
}

function projectNames() {
  const names = new Set(prefs.muted)
  for (const n of nodes.values()) if (n.kind === 'session' && !n.past) names.add(n.projectName ?? 'Elsewhere')
  return [...names].sort((a, b) => a.localeCompare(b))
}

function drawProjects() {
  const list = panel.querySelector('.alerts-projects')
  const names = projectNames()
  const html = names.length
    ? names.map(name => `<label class="alerts-row"><input type="checkbox" data-mute="${escapeAttr(name)}" ${prefs.muted.includes(name) ? 'checked' : ''}> <span>Mute <b>${escapeAttr(name)}</b></span></label>`).join('')
    : '<p class="alerts-note">Projects with live threads show up here.</p>'
  if (list.dataset.html !== html && !list.contains(document.activeElement)) {
    list.dataset.html = html
    list.innerHTML = html
  }
}

const escapeAttr = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function drawPanel() {
  panel.innerHTML = `
    <p class="eyebrow">Alerts</p>
    <p class="alerts-lede">When a thread is waiting on you, the tab shows how many, like <b>(2) Agent Office</b>.</p>
    <div class="alerts-perm">${permissionLine()}</div>
    <h3>Quiet hours</h3>
    <label class="alerts-row"><input type="checkbox" data-quiet="on" ${prefs.quiet.on ? 'checked' : ''}> <span>Hold alerts during quiet hours</span></label>
    <p class="alerts-times"><span>From</span><input type="time" data-quiet="from" value="${prefs.quiet.from}" aria-label="Quiet hours start">
      <span>to</span><input type="time" data-quiet="to" value="${prefs.quiet.to}" aria-label="Quiet hours end"></p>
    <h3>Projects</h3>
    <div class="alerts-projects"></div>
    <p class="alerts-note">A muted project doesn’t alert or count in the tab.</p>`
  drawProjects()
  showButton()
}

function showButton() {
  const on = prefs.alerts && permission() === 'granted'
  button.classList.toggle('on', on)
  button.title = on ? (inQuiet(new Date(), prefs.quiet) ? 'Alerts: on, quiet hours now' : 'Alerts: on') : 'Alerts: off'
}

function openPanel(open) {
  panel.hidden = !open
  button.setAttribute('aria-expanded', String(open))
  if (open) {
    drawPanel()
    panel.querySelector('button, input')?.focus()
  }
}

export function mount(opts) {
  pick = opts.pick
  baseTitle = document.title || baseTitle
  button = document.getElementById('alerts-open')
  panel = document.getElementById('alerts')
  if (!button || !panel) return
  button.addEventListener('click', () => openPanel(panel.hidden))
  panel.addEventListener('click', async e => {
    if (!e.target.closest('.alerts-ask')) return
    // Asked for here, from your click, never on load.
    const answer = await Notification.requestPermission()
    if (answer === 'granted') {
      prefs.alerts = true
      save()
    }
    drawPanel()
    panel.querySelector('input, button')?.focus()
  })
  panel.addEventListener('change', e => {
    const el = e.target
    if (el.dataset.pref === 'alerts') prefs.alerts = el.checked
    else if (el.dataset.quiet === 'on') prefs.quiet.on = el.checked
    else if (el.dataset.quiet && el.value) prefs.quiet[el.dataset.quiet] = el.value
    else if (el.dataset.mute !== undefined) {
      prefs.muted = prefs.muted.filter(m => m !== el.dataset.mute)
      if (el.checked) prefs.muted.push(el.dataset.mute)
    }
    save()
    showButton()
  })
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) {
      openPanel(false)
      button.focus()
    }
  })
  addEventListener('pointerdown', e => {
    if (!panel.hidden && !panel.contains(e.target) && !button.contains(e.target)) openPanel(false)
  })
  showButton()
  drawIcon(false)
}
