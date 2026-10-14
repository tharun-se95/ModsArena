// Making and clearing things from the office: the ⋯ menu on a project, a
// thread or an agent, and the small sheets it opens.
//
//   New thread here      the front desk, with this project picked (desk.js)
//   Bring in a helper    asks a thread to start a subagent for a task
//   New agent type       writes a custom agent (.claude/agents/<name>.md)
//   Remove from office   puts it away; Undo, or bring it back from Settings
//   Delete for good…     after a confirmation, deletes its conversation
//                        (Claude Code's transcripts), never project files
//
// Removing is the default and can always be undone; deleting can't, so it
// says exactly what goes and asks once more.

import { nodes, sid } from './model.js'
import { escapeHtml } from './words.js'
import { projectName } from './names.js'
import * as transcript from './transcript.js'
import { toast } from './toast.js'

const token = document.querySelector('meta[name="agent-office-token"]')?.content || ''
let opts = null
let dialog = null
// The menu that's open, so the panel's redraws keep it open.
let openMenu = null

// The built-in kinds of helper a thread can bring in.
export const HELPERS = [
  { id: 'Explore', name: 'Explorer', blurb: 'Looks around and reports back, changes nothing' },
  { id: 'Plan', name: 'Planner', blurb: 'Thinks a job through into steps' },
  { id: 'general-purpose', name: 'All-rounder', blurb: 'Does the task, whatever it takes' },
]

// The message that asks a thread for a helper.
export function helperPrompt(type, task) {
  const who = type === 'general-purpose' ? 'a general-purpose subagent' : `a ${type} subagent`
  return `Please bring in a helper for this: start ${who} (the Agent tool, subagent_type "${type}") with the task below, then tell me in a few plain sentences what it found or did.\n\nTask: ${task.trim()}`
}

// ---------------------------------------------------------------------------
// The ⋯ menu

// What the menu offers for a node: a project (`{ kind: 'project', id, name }`),
// a thread or an agent.
export function choices(target, { canMessage = transcript.canMessage(), live = false } = {}) {
  const list = []
  if (target.kind === 'project') list.push('thread', 'agenttype')
  if (target.kind === 'session' && canMessage) list.push('helper', 'thread')
  if (target.kind === 'session' && !canMessage) list.push('thread')
  list.push('remove', 'delete')
  if (target.kind === 'agent' && live) return ['remove']
  return list
}

const LABELS = {
  thread: 'New thread here',
  helper: 'Bring in a helper',
  agenttype: 'New agent type',
  remove: 'Remove from office',
  delete: 'Delete for good…',
}
const HINTS = {
  thread: 'Start a new Claude Code session in this project',
  helper: 'Ask this thread to start a subagent for a task',
  agenttype: 'Describe a kind of agent Claude can bring in',
  remove: 'Hide it here. Undo, or bring it back from Settings',
  delete: 'Delete its conversation from your computer. Can’t be undone',
}

const targetAttrs = t => [
  `data-mkind="${t.kind}"`,
  t.project ? `data-mproject="${escapeHtml(t.project)}"` : '',
  t.session ? `data-msession="${escapeHtml(t.session)}"` : '',
  t.agent ? `data-magent="${escapeHtml(t.agent)}"` : '',
  `data-mlabel="${escapeHtml(t.label ?? '')}"`,
].filter(Boolean).join(' ')

// The menu's HTML. `target`: { kind, project?, session?, agent?, label }.
export function menu(target, options = {}) {
  const list = choices(target, options)
  const what = target.kind === 'project' ? 'project' : target.kind === 'agent' ? 'agent' : 'thread'
  const key = `${target.kind}|${target.project ?? ''}|${target.session ?? ''}|${target.agent ?? ''}`
  return `<details class="more" data-more="${escapeHtml(key)}" ${openMenu === key ? 'open' : ''}>
    <summary title="More for this ${what}" aria-label="More for this ${what}"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="15" cy="10" r="1.6"/></svg></summary>
    <div class="more-pop paper" role="menu">
      ${list.map(c => `<button type="button" role="menuitem" class="more-${c}" data-manage="${c}" ${targetAttrs(target)} title="${escapeHtml(HINTS[c])}">${LABELS[c]}</button>`).join('')}
    </div>
  </details>`
}

// The + beside a project's name: a new thread there.
export const newThreadButton = (project, label) =>
  `<button type="button" class="room-new" data-manage="thread" ${targetAttrs({ kind: 'project', project, label })} title="New thread in ${escapeHtml(label)}" aria-label="New thread in ${escapeHtml(label)}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4.5v11M4.5 10h11"/></svg></button>`

const targetOf = b => ({
  kind: b.dataset.mkind, project: b.dataset.mproject, session: b.dataset.msession, agent: b.dataset.magent, label: b.dataset.mlabel,
})

function closeMenus(except) {
  for (const d of document.querySelectorAll('details.more[open]')) if (d !== except) d.open = false
  if (!except) openMenu = null
}

// ---------------------------------------------------------------------------
// Sheets

function show(html, focus) {
  dialog.innerHTML = `<form method="dialog" class="mform">${html}</form>`
  if (!dialog.open) dialog.showModal()
  for (const b of dialog.querySelectorAll('[data-mclose]')) b.onclick = () => dialog.close()
  ;(focus ? dialog.querySelector(focus) : dialog.querySelector('input, textarea, button.mgo'))?.focus()
  return dialog.querySelector('form')
}

const head = (title, sub, cls = '') => `
  <header class="mhead ${cls}">
    <div><h2 id="manage-title">${escapeHtml(title)}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
    <button type="button" class="lib-close" data-mclose aria-label="Close">×</button>
  </header>`

const setNote = (form, text, bad = true) => {
  const el = form.querySelector('.mnote')
  el.textContent = text
  el.classList.toggle('bad', bad)
}

// Bring in a helper: what kind, and the task.
async function helperSheet(t) {
  const n = nodes.get(sid(t.session))
  if (!n) return
  const custom = await agentTypes(n.project ?? n.cwd)
  const kinds = [...HELPERS, ...custom.map(a => ({ id: a.name, name: a.name, blurb: a.description || (a.scope === 'user' ? 'Yours, for every project' : 'This project’s own'), custom: true }))]
  const ended = transcript.hasEnded(n)
  const form = show(`
    ${head('Bring in a helper', `${escapeHtml(t.label || 'This thread')} starts a subagent for the task and tells you what it found.`)}
    <fieldset class="mkinds"><legend>What kind of helper?</legend>
      ${kinds.map((k, i) => `<label class="mkind"><input type="radio" name="mhelper" value="${escapeHtml(k.id)}" ${i === 0 ? 'checked' : ''}><b>${escapeHtml(k.name)}${k.custom ? ' <small class="badge">custom</small>' : ''}</b><small>${escapeHtml(k.blurb)}</small></label>`).join('')}
    </fieldset>
    <label class="mfield"><span>The task</span><textarea id="mtask" rows="3" placeholder="Find every place we read the config file, and list them"></textarea></label>
    ${ended ? '<p class="mhint">This thread has ended: asking picks it up again in the background, which uses tokens.</p>' : '<p class="mhint">It reads this as its next prompt, marked as from Agent Office.</p>'}
    <footer class="mfoot"><span class="mnote" role="status"></span><button type="button" class="jcancel" data-mclose>Not now</button><button type="submit" class="mgo">Ask for the helper</button></footer>`, '#mtask')
  form.onsubmit = async e => {
    e.preventDefault()
    const task = form.querySelector('#mtask').value
    if (!task.trim()) return setNote(form, 'Say what the helper should do.')
    const type = form.querySelector('input[name="mhelper"]:checked')?.value ?? 'general-purpose'
    setNote(form, 'Sending…', false)
    const result = await transcript.talk(n, helperPrompt(type, task))
    if (!result.ok) return setNote(form, result.status)
    dialog.close()
    toast({ icon: '✦', title: 'Helper on the way.', text: `${t.label || 'The thread'} will start one and report back.` })
  }
}

// The custom agent types a project can use (the bridge reads them).
async function agentTypes(dir) {
  if (!token || !dir) return []
  try {
    const res = await fetch(`/agent-types?${new URLSearchParams({ dir })}`)
    return res.ok ? (await res.json()).types ?? [] : []
  } catch {
    return []
  }
}

// A new agent type: its name, when to use it, what it does, and its tools.
function agentTypeSheet(t) {
  const dir = t.project
  const name = projectName(dir, t.label)
  const form = show(`
    ${head('New agent type', 'Describe a kind of agent once; Claude brings it in when the job fits, or when you ask for it by name.')}
    <label class="mfield"><span>Name</span><input id="aname" type="text" maxlength="41" placeholder="test-writer" spellcheck="false" autocomplete="off"></label>
    <label class="mfield"><span>When should Claude use it?</span><input id="adesc" type="text" maxlength="300" placeholder="Writes and fixes tests after code changes"></label>
    <label class="mfield"><span>Its instructions</span><textarea id="abody" rows="5" placeholder="You write small, readable tests. Run them before you finish, and say what you covered."></textarea></label>
    <label class="mfield"><span>Tools it may use <small>(optional; leave empty for all of them)</small></span><input id="atools" type="text" placeholder="Read, Grep, Glob, Bash" spellcheck="false" autocomplete="off"></label>
    <fieldset class="mscope"><legend>For</legend>
      <label><input type="radio" name="ascope" value="project" checked> ${escapeHtml(name)} only <small>saved in its .claude/agents folder</small></label>
      <label><input type="radio" name="ascope" value="user"> All my projects <small>saved in ~/.claude/agents</small></label>
    </fieldset>
    <footer class="mfoot"><span class="mnote" role="status"></span><button type="button" class="jcancel" data-mclose>Not now</button><button type="submit" class="mgo">Save the agent type</button></footer>`, '#aname')
  form.onsubmit = async e => {
    e.preventDefault()
    const body = {
      dir, scope: form.querySelector('input[name="ascope"]:checked').value,
      name: form.querySelector('#aname').value, description: form.querySelector('#adesc').value,
      instructions: form.querySelector('#abody').value, tools: form.querySelector('#atools').value,
    }
    if (!token) return setNote(form, transcript.isDemo() ? 'The demo can’t save files. In your own office this writes the agent’s file.' : 'Saving needs the office opened from its bridge (run /office).')
    setNote(form, 'Saving…', false)
    try {
      const res = await fetch('/agent-types', { method: 'POST', headers: { 'content-type': 'application/json', 'x-agent-office-token': token }, body: JSON.stringify(body) })
      const got = await res.json().catch(() => ({}))
      if (!res.ok) return setNote(form, `Couldn’t save it: ${got.error ?? res.status}`)
      dialog.close()
      toast({ icon: '✦', title: `Saved ${got.name ?? 'it'}.`, text: 'New threads can bring it in. Pick it under “Bring in a helper”, or ask for it by name.' })
    } catch {
      setNote(form, 'Couldn’t reach the bridge. Is it still running?')
    }
  }
}

// Delete for good: what goes, said plainly, then once more to be sure.
function deleteSheet(t) {
  const n = t.kind === 'project' ? null : nodes.get(t.kind === 'agent' ? `a:${t.session}:${t.agent}` : sid(t.session))
  const threads = t.kind === 'project' ? [...nodes.values()].filter(x => x.kind === 'session' && x.project === t.project) : []
  const live = threads.filter(x => !x.past && x.status !== 'done').length
  const what = t.kind === 'project'
    ? `<p>This deletes Claude Code’s saved conversations for <b>${escapeHtml(projectName(t.project, t.label))}</b>: every thread’s transcript and its agents’. They’re gone from the office and from <code>claude --resume</code>.</p>
       <p class="msafe">Your project folder and its files stay exactly as they are.</p>
       ${live ? `<p class="mhint">${live === 1 ? 'One thread is' : `${live} threads are`} still open; open ones are left alone. End them in Claude Code first to delete them too.</p>` : ''}`
    : t.kind === 'agent'
      ? `<p>This deletes <b>${escapeHtml(t.label || 'this agent')}</b>’s conversation (its transcript) from your computer.</p><p class="msafe">The thread it worked for, and your project’s files, aren’t touched.</p>`
      : `<p>This deletes <b>${escapeHtml(t.label || 'this thread')}</b>’s conversation from your computer: its transcript and its agents’. It’s gone from the office and from <code>claude --resume</code>.</p>
         ${n && !n.past && n.status !== 'done' ? '<p class="mhint">If the front desk is running it in the background, it’s stopped first. One still open in a terminal is left alone: end it there first.</p>' : ''}
         <p class="msafe">Your project’s files aren’t touched.</p>`
  const form = show(`
    ${head('Delete for good?', '', 'danger')}
    <div class="mbody">${what}<p class="mwarn">This can’t be undone. To just tidy up, use <b>Remove from office</b> instead.</p></div>
    <footer class="mfoot"><span class="mnote" role="status"></span><button type="button" class="jcancel" data-mclose>Keep it</button><button type="button" class="mremove">Remove from office instead</button><button type="submit" class="mgo danger">Delete for good</button></footer>`, '.jcancel')
  form.querySelector('.mremove').onclick = () => { dialog.close(); opts.remove(t) }
  form.onsubmit = async e => {
    e.preventDefault()
    setNote(form, 'Deleting…', false)
    const result = await erase(t)
    if (!result.ok) return setNote(form, result.status)
    dialog.close()
    toast({ icon: '✕', title: 'Deleted.', text: result.status })
  }
}

// Through the bridge; the demo only pretends, in this page.
async function erase(t) {
  const body = t.kind === 'project' ? { project: t.project } : { session: t.session, ...(t.agent && { agent: t.agent }) }
  if (!token) {
    if (!transcript.isDemo()) return { ok: false, status: 'Deleting needs the office opened from its bridge (run /office).' }
    const sessions = t.kind === 'project' ? [...nodes.values()].filter(x => x.kind === 'session' && x.project === t.project).map(x => x.session) : [t.session]
    for (const session of sessions) opts.ingest({ t: Date.now(), kind: t.agent ? 'agent.removed' : 'session.removed', session, agent: t.agent })
    return { ok: true, status: 'It was only the demo, so nothing was on disk.' }
  }
  try {
    const res = await fetch('/delete', { method: 'POST', headers: { 'content-type': 'application/json', 'x-agent-office-token': token }, body: JSON.stringify(body) })
    const got = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, status: `Couldn’t delete it: ${got.error ?? res.status}` }
    opts.forget(t)
    if (t.kind === 'project') {
      return { ok: true, status: got.kept ? `${got.sessions} conversation${got.sessions === 1 ? '' : 's'} deleted; ${got.kept} still open, left alone.` : `${got.sessions} conversation${got.sessions === 1 ? '' : 's'} deleted. The project’s files are untouched.` }
    }
    return { ok: true, status: 'Its conversation is gone from your computer.' }
  } catch {
    return { ok: false, status: 'Couldn’t reach the bridge. Is it still running?' }
  }
}

// ---------------------------------------------------------------------------
// The Removed list, in Settings

export function removedList(items) {
  if (!items.length) return ''
  const what = it => it.kind === 'project' ? 'project' : it.kind === 'agent' ? 'agent' : 'thread'
  return `<details class="set-removed"><summary><b>Removed from the office</b> <small>${items.length}</small></summary>
    <ul>${items.map(it => `<li><span><b>${escapeHtml(it.label || it.key)}</b><small>${what(it)}</small></span><button type="button" data-restore="${escapeHtml(it.key)}">Bring back</button></li>`).join('')}</ul>
  </details>`
}

// ---------------------------------------------------------------------------

function run(action, t) {
  closeMenus()
  if (action === 'thread') {
    const room = t.project ?? nodes.get(sid(t.session))?.project
    document.dispatchEvent(new CustomEvent('office:frontdesk', { detail: { room } }))
  } else if (action === 'helper') void helperSheet(t)
  else if (action === 'agenttype') agentTypeSheet(t)
  else if (action === 'remove') opts.remove(t)
  else if (action === 'delete') deleteSheet(t)
}

// `remove(target)` puts something away (main.js), `forget(target)` drops it
// from the Removed list once it's deleted, `ingest` feeds the demo's events.
export function mount(options) {
  opts = options
  dialog = document.getElementById('manage')
  document.addEventListener('click', e => {
    const b = e.target.closest?.('[data-manage]')
    if (b) {
      e.preventDefault()
      e.stopPropagation()
      return run(b.dataset.manage, targetOf(b))
    }
    // One menu open at a time; a click elsewhere closes it.
    const open = e.target.closest?.('details.more')
    closeMenus(open)
  }, true)
  document.addEventListener('toggle', e => {
    const d = e.target
    if (!d.matches?.('details.more')) return
    if (d.open) openMenu = d.dataset.more
    else if (openMenu === d.dataset.more) openMenu = null
  }, true)
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenus() })
  if (dialog && !('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return
      const r = dialog.getBoundingClientRect()
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close()
    })
  }
}
