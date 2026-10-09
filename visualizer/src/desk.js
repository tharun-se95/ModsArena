// The front desk: start new work from the office. The "New job" button in
// the top bar (or the reception counter by the front door) opens a sheet
// of job cards with friendly templates; you pick the room it goes to, and
// the bridge starts it as a Claude Code background session there (see
// agent-office/server/jobs.mjs). Its critter walks in from the front door,
// past the desk, to a desk of its own.
//
// Jobs run in the background under your own permission settings, so the
// sheet says plainly where to approve what one needs and how to stop it.

import { nodes } from './model.js'
import { escapeHtml, ago } from './words.js'
import { roomKey } from './table.js'
import { demoJob } from '../../agent-office/server/demo.mjs'
import { KINDS, titleOf, matchJob } from './jobcards.js'
import { projectName, projectIcon } from './names.js'

const token = document.querySelector('meta[name="agent-office-token"]')?.content || ''

// Line icons, drawn in currentColor.
const ICON = {
  write: '<path d="M4 16l1-4 8-8 3 3-8 8-4 1zM11 6l3 3"/>',
  research: '<circle cx="8.5" cy="8.5" r="4.5"/><path d="M12 12l4.5 4.5"/>',
  fix: '<path d="M12.5 3.5a3.5 3.5 0 0 0-3.3 4.6L3.5 13.8a1.4 1.4 0 0 0 2 2l5.7-5.7a3.5 3.5 0 0 0 4.6-3.3l-2 .8-1.6-1.6.8-2z"/>',
  review: '<path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.3"/>',
  plan: '<path d="M3 5l4-1.5 6 2L17 4v11l-4 1.5-6-2L3 16zM7 3.5v11M13 5.5v11"/>',
  other: '<path d="M10 3v3M10 14v3M3 10h3M14 10h3M5 5l2 2M13 13l2 2M15 5l-2 2M7 13l-2 2"/>',
  bell: '<path d="M5 14h10l-1.4-2V8.5a3.6 3.6 0 0 0-7.2 0V12zM8.5 16.5a1.6 1.6 0 0 0 3 0M10 3.6v1.3"/>',
}
const icon = name => `<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`

const STATE = {
  starting: ['Ringing the bell…', 'working'],
  working: ['Working', 'working'],
  blocked: ['Waiting for your OK', 'asking'],
  done: ['Done', 'done'],
  stopped: ['Stopped', 'failed'],
  failed: ['Didn’t start', 'failed'],
}
const LIVE = new Set(['starting', 'working', 'blocked'])

// Every job started from the front desk this run, newest first.
export const jobs = new Map() // job id -> { id, t, dir, title, kind, prompt, state, short?, session?, error?, waitingFor? }

// `quiet` while replaying what happened before the page opened: no toasts.
export function onEvent(ev, quiet = false) {
  if (ev.kind === 'job.start') {
    jobs.set(ev.job, { id: ev.job, t: ev.t, dir: ev.dir, title: ev.title, type: ev.type, prompt: ev.prompt, state: 'starting', demo: ev.demo })
  }
  const job = jobs.get(ev.job)
  if (!job) return
  if (ev.kind === 'job.update') {
    const was = job.state
    for (const k of ['state', 'short', 'session', 'error', 'waitingFor']) if (ev[k] !== undefined) job[k] = ev[k]
    if (job.state === 'blocked' && was !== 'blocked' && !quiet) toast(`“${job.title}” needs your OK before it goes on.`, job)
    if (job.state === 'failed' && was !== 'failed' && !quiet) toast(job.error ?? 'That job didn’t start.', job, true)
  }
  changed()
}

export const reset = () => jobs.clear()

// The job a session is doing, if the front desk started it.
export const jobFor = n => matchJob(jobs.values(), n)

// ---------------------------------------------------------------------------
// The sheet

let dialog, opts
let kind = 'write'
let dir = null
let sending = false
let note = ''
let pointing = false

const rooms = () => {
  const out = new Map()
  for (const n of nodes.values()) {
    if (n.kind !== 'session' || !n.project || n.project === 'unknown') continue
    const raw = n.projectName ?? n.project
    const room = out.get(n.project) ?? { dir: n.project, raw, name: projectName(n.project, raw), icon: projectIcon(n.project, raw), live: 0, last: 0 }
    if (!n.past && n.status !== 'done') room.live++
    room.last = Math.max(room.last, n.lastAt ?? n.startedAt ?? n.endedAt ?? 0)
    out.set(n.project, room)
  }
  return [...out.values()].sort((a, b) => b.live - a.live || b.last - a.last)
}

function cards() {
  return KINDS.map(k => `
    <label class="jcard ${kind === k.id ? 'on' : ''}">
      <input type="radio" name="jkind" value="${k.id}" ${kind === k.id ? 'checked' : ''}>
      <span class="jicon k-${k.id}">${icon(k.id)}</span>
      <b>${escapeHtml(k.name)}</b>
      <small>${escapeHtml(k.blurb)}</small>
    </label>`).join('')
}

function templates() {
  const k = KINDS.find(x => x.id === kind)
  if (!k.templates.length) return '<p class="jhint">No template: just say what you’d like done, the way you’d ask a colleague.</p>'
  return k.templates.map(([name], i) => `<button type="button" class="jchip" data-template="${i}">${escapeHtml(name)}</button>`).join('')
}

function roomPicker() {
  const list = rooms()
  if (!list.length) return '<p class="jhint">No rooms yet. Open Claude Code in a project once and its room appears here.</p>'
  if (!list.some(r => r.dir === dir)) dir = list[0].dir
  return list.map(r => `
    <label class="jroom ${r.dir === dir ? 'on' : ''}" title="${escapeHtml(r.dir)}">
      <input type="radio" name="jroom" value="${escapeHtml(r.dir)}" ${r.dir === dir ? 'checked' : ''}>
      <i class="room-${roomKey(r.raw, r.dir)}" aria-hidden="true">${r.icon}</i><span>${escapeHtml(r.name)}</span>
      <small>${r.live ? `${r.live} working here` : 'quiet'}</small>
    </label>`).join('')
}

function ticket(job) {
  const [words, pill] = STATE[job.state] ?? STATE.working
  const room = rooms().find(r => r.dir === job.dir)?.name ?? job.dir.split(/[\\/]/).pop()
  const live = LIVE.has(job.state)
  const attach = job.short ? `claude attach ${job.short}` : ''
  const help = job.state === 'blocked'
    ? `<p class="jhelp">It stopped to ask for your OK. To see what and answer, open a terminal and run <code>${escapeHtml(attach)}</code><button type="button" class="jcopy" data-copy="${escapeHtml(attach)}">Copy</button></p>`
    : job.state === 'failed' && job.error ? `<p class="jhelp bad">${escapeHtml(job.error)}</p>`
      : live && attach ? `<p class="jhelp muted">Running in the background. To watch it or step in: <code>${escapeHtml(attach)}</code></p>`
        : job.state === 'done' && attach ? `<p class="jhelp muted">To read its answer or ask for more: <code>${escapeHtml(attach)}</code></p>` : ''
  const session = job.session && nodes.get(`s:${job.session}`) ? `s:${job.session}` : [...nodes.values()].find(n => n.kind === 'session' && jobFor(n) === job)?.id
  return `
    <li class="jticket ${job.state}">
      <span class="jicon k-${escapeHtml(job.type ?? 'other')}">${icon(KINDS.some(k => k.id === job.type) ? job.type : 'other')}</span>
      <div><b>${escapeHtml(job.title)}</b><small>${escapeHtml(room)} · ${ago(job.t)}</small></div>
      <span class="pill ${pill}">${words}</span>
      ${help}
      <span class="jacts">
        ${session ? `<button type="button" data-jfind="${escapeHtml(session)}">Find it</button>` : ''}
        ${live ? `<button type="button" class="jstop" data-jstop="${escapeHtml(job.id)}">Stop</button>` : ''}
      </span>
    </li>`
}

function sheet() {
  const list = [...jobs.values()].reverse()
  const canStart = token || opts.isDemo() || opts.bridgeDemo()
  return `
    <form method="dialog" class="jform">
      <header class="jhead">
        <span class="jbell">${icon('bell')}</span>
        <div><h2 id="desk-title">Front desk</h2><p>Hand Claude a new job. A new teammate walks in to take it.</p></div>
        <button type="button" class="lib-close" data-jclose aria-label="Close">×</button>
      </header>
      <fieldset class="jkinds"><legend>What kind of job?</legend>${cards()}</fieldset>
      <div class="jstep">
        <p class="jlabel" id="jprompt-label">The job</p>
        <div class="jchips">${templates()}</div>
        <textarea id="jprompt" rows="4" aria-labelledby="jprompt-label" placeholder="Say what you’d like done…"></textarea>
      </div>
      <fieldset class="jrooms"><legend>Which room does it go to?</legend>${roomPicker()}</fieldset>
      <ul class="jhow" aria-label="How office jobs run">
        <li><b>It runs in the background.</b> You can close this page; the job keeps going and its critter keeps you posted.</li>
        <li><b>If it needs your OK</b> to run a command or change a file, it waits for you. Its ticket below says how: run <code>claude attach</code> with its id in a terminal and answer there.</li>
        <li><b>Changed your mind?</b> Press Stop on its ticket.</li>
      </ul>
      ${canStart ? '' : '<p class="jhelp bad">Starting jobs needs the office opened from its bridge (run /office in Claude Code).</p>'}
      <footer class="jfoot">
        <span class="jnote" role="status">${escapeHtml(note)}</span>
        <button type="button" class="jcancel" data-jclose>Not now</button>
        <button type="submit" class="jgo" ${!canStart || sending || !rooms().length ? 'disabled' : ''}>${sending ? 'Ringing the bell…' : 'Start the job'}</button>
      </footer>
      ${list.length ? `<section class="jtickets"><p class="jlabel">Started from the front desk</p><ul>${list.map(ticket).join('')}</ul></section>` : ''}
    </form>`
}

// Re-draw, keeping what you've typed and where focus is.
function draw() {
  if (!dialog?.open) return
  const field = dialog.querySelector('#jprompt')
  const text = field?.value
  const focusSel = document.activeElement && dialog.contains(document.activeElement) ? selectorOf(document.activeElement) : null
  const scroll = dialog.scrollTop
  dialog.innerHTML = sheet()
  if (text !== undefined) dialog.querySelector('#jprompt').value = text
  if (focusSel) dialog.querySelector(focusSel)?.focus()
  dialog.scrollTop = scroll
  bind()
}

function selectorOf(el) {
  if (el.id) return `#${el.id}`
  if (el.name && el.value) return `input[name="${el.name}"][value="${CSS.escape(el.value)}"]`
  for (const a of ['data-template', 'data-jstop', 'data-jfind', 'data-copy']) if (el.hasAttribute(a)) return `[${a}="${CSS.escape(el.getAttribute(a))}"]`
  if (el.classList.contains('jgo')) return '.jgo'
  return null
}

function fill(i) {
  const k = KINDS.find(x => x.id === kind)
  const text = k.templates[i]?.[1]
  if (!text) return
  const field = dialog.querySelector('#jprompt')
  field.value = text
  field.focus()
  const at = text.indexOf('[')
  if (at >= 0) field.setSelectionRange(at, text.indexOf(']', at) + 1)
  else field.setSelectionRange(text.length, text.length)
}

function bind() {
  for (const r of dialog.querySelectorAll('input[name="jkind"]')) r.onchange = () => {
    const before = KINDS.find(x => x.id === kind)
    const field = dialog.querySelector('#jprompt')
    // Swap the template too, unless you've written your own.
    const mine = field.value.trim() && !before.templates.some(([, t]) => t === field.value)
    kind = r.value
    draw()
    if (!mine) {
      dialog.querySelector('#jprompt').value = ''
      fill(0)
      // Arrowing through the cards keeps you on them; a click goes on to
      // the words, the part to fill in already selected.
      if (!pointing) dialog.querySelector(`input[name="jkind"][value="${kind}"]`)?.focus()
    }
  }
  for (const r of dialog.querySelectorAll('input[name="jroom"]')) r.onchange = () => { dir = r.value; draw() }
  for (const b of dialog.querySelectorAll('[data-template]')) b.onclick = () => fill(Number(b.dataset.template))
  for (const b of dialog.querySelectorAll('[data-jclose]')) b.onclick = () => dialog.close()
  for (const b of dialog.querySelectorAll('[data-jstop]')) b.onclick = () => stop(b.dataset.jstop)
  for (const b of dialog.querySelectorAll('[data-jfind]')) b.onclick = () => { dialog.close(); opts.pick(b.dataset.jfind) }
  for (const b of dialog.querySelectorAll('[data-copy]')) b.onclick = async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied' } catch { b.textContent = 'Select and copy it' }
  }
  const prompt = dialog.querySelector('#jprompt')
  prompt.onkeydown = e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); dialog.querySelector('form').requestSubmit() } }
  dialog.querySelector('form').onsubmit = e => { e.preventDefault(); submit() }
}

async function submit() {
  const prompt = dialog.querySelector('#jprompt').value.trim()
  if (!prompt) { note = 'Say what the job is first.'; draw(); dialog.querySelector('#jprompt').focus(); return }
  if (!dir) return
  const title = titleOf(prompt)
  sending = true
  note = ''
  draw()
  let ok = false
  try {
    if (opts.isDemo()) ok = startLocalDemo({ dir, prompt, title, kind })
    else {
      const res = await fetch('/jobs', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-agent-office-token': token },
        body: JSON.stringify({ dir, prompt, title, kind }),
      })
      const body = await res.json().catch(() => ({}))
      ok = res.ok
      if (!ok) note = body.error ? `Couldn’t start it: ${body.error}` : 'Couldn’t start it.'
    }
  } catch {
    note = 'Couldn’t reach the bridge. Is it still running?'
  }
  sending = false
  if (ok) {
    note = ''
    dialog.querySelector('#jprompt').value = ''
    dialog.close()
    toast(`Ding! A new teammate is on the way to “${title}”.`)
  } else draw()
}

async function stop(id) {
  const job = jobs.get(id)
  if (!job) return
  // Demo only: the hosted preview has no session to stop; the ticket says so.
  if (opts.isDemo()) { job.state = 'stopped'; changed(); return }
  try {
    const res = await fetch('/jobs/stop', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-agent-office-token': token },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) toast(`Couldn’t stop it: ${(await res.json().catch(() => ({}))).error ?? 'the bridge said no'}`, job, true)
  } catch {
    toast('Couldn’t reach the bridge to stop it.', job, true)
  }
}

// Demo only: the hosted preview has no bridge, so the page plays the job
// itself with a sample session, sending the same events the bridge would.
let localSeq = 0
const runDemoJob = demoJob()
function startLocalDemo({ dir: where, prompt, title, kind: type }) {
  const id = `demo-job-${++localSeq}`
  const emit = ev => opts.ingest({ t: Date.now(), job: id, ...ev })
  emit({ kind: 'job.start', dir: where, title, type, prompt, demo: true })
  const job = jobs.get(id)
  runDemoJob({ id, dir: where }, prompt, update => emit({ kind: 'job.update', ...update }))
  return Boolean(job)
}

// ---------------------------------------------------------------------------
// Toasts and the top bar's button

let toastEl
function toast(text, job, bad = false) {
  if (!toastEl) return
  const el = document.createElement('div')
  el.className = `jtoast paper ${bad ? 'bad' : ''}`
  el.innerHTML = `<span>${icon('bell')}</span><p>${escapeHtml(text)}</p>${job ? '<button type="button">Open the desk</button>' : ''}`
  el.querySelector('button')?.addEventListener('click', () => { open(); el.remove() })
  toastEl.append(el)
  setTimeout(() => el.remove(), bad || job?.state === 'blocked' ? 14000 : 6000)
}

function changed() {
  const waiting = [...jobs.values()].filter(j => j.state === 'blocked').length
  const live = [...jobs.values()].filter(j => LIVE.has(j.state)).length
  const count = document.getElementById('newjob-count')
  if (count) {
    count.textContent = waiting ? String(waiting) : live ? String(live) : ''
    count.classList.toggle('asking', waiting > 0)
    count.title = waiting ? `${waiting} waiting for your OK` : live ? `${live} running` : ''
  }
  draw()
}

export function open(kindId) {
  if (!dialog) return
  if (kindId) kind = kindId
  note = ''
  if (!dialog.open) dialog.showModal()
  draw()
  const field = dialog.querySelector('#jprompt')
  if (!field.value) fill(0)
  dialog.querySelector(`input[name="jkind"][value="${kind}"]`)?.focus()
}

// `ingest` feeds the page's own events (the hosted demo), `pick` finds a
// critter, `isDemo` says there's no bridge, `bridgeDemo` that the bridge
// plays sample sessions.
export function mount(options) {
  opts = options
  dialog = document.getElementById('desk')
  dialog.addEventListener('pointerdown', () => { pointing = true })
  dialog.addEventListener('keydown', () => { pointing = false })
  toastEl = document.getElementById('toasts')
  document.getElementById('newjob')?.addEventListener('click', () => open())
  document.addEventListener('office:frontdesk', () => open())
  // Safari has no closedby yet: a click on the backdrop closes it there too.
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return
      const r = dialog.getBoundingClientRect()
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close()
    })
  }
  addEventListener('keydown', e => {
    if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName) && !dialog.open) {
      e.preventDefault()
      open()
    }
  })
  // Ages on the tickets.
  setInterval(() => { if (dialog.open && !dialog.contains(document.activeElement)) draw() }, 15000)
}
