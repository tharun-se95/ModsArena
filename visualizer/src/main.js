// Agent Cluster: your Claude Code sessions as colorful critters in a cozy
// office, one room per project, with their subagents around them. Fed by
// the bridge's Server-Sent Events and /history; words.js turns the same
// events into plain sentences.

import { startDemo, demoHistory } from '../../agent-cluster-3d/server/demo.mjs'
import * as model from './model.js'
import * as words from './words.js'
import * as table from './table.js'
import * as panels from './panels.js'

const HISTORY_REFRESH_MS = 60000
const PANEL_REFRESH_MS = 700
const params = new URLSearchParams(location.search)
const isDemo = Boolean(window.CLUSTER_DEMO) || params.get('demo') === '1'

let showPast = true
let history = []
let selected = null

table.mount(document.getElementById('stage'), { pick })

function pick(id) {
  // Clicking a room or the floor clears the selection.
  const n = id && model.nodes.get(id)
  selected = n && (n.kind === 'session' || n.kind === 'agent') ? id : null
  table.setSelected(selected)
  refreshPanels()
}

addEventListener('keydown', e => {
  if (e.key !== 'Escape') return
  pick(null)
  table.focusProject(null)
})

const pastToggle = document.getElementById('show-past')
pastToggle.addEventListener('change', () => {
  showPast = pastToggle.checked
  model.applyHistory(history, showPast)
})

// ---------------------------------------------------------------------------
// Loop

function running() {
  const owners = new Set()
  for (const n of model.nodes.values()) if (n.kind === 'tool' && n.status === 'active') owners.add(n.owner)
  return owners
}

function refreshPanels() {
  if (selected && !model.nodes.has(selected)) selected = null
  panels.render({ running: running(), selected, pick })
}

function frame() {
  model.sweep(Date.now())
  table.sync(showPast)
  table.animate()
  requestAnimationFrame(frame)
}

setInterval(refreshPanels, PANEL_REFRESH_MS)

// ---------------------------------------------------------------------------
// Sources

function ingest(ev) {
  model.apply(ev)
  words.ingest(ev)
  table.pulse(ev)
}

async function loadHistory() {
  try {
    history = isDemo ? demoHistory() : (await (await fetch('/history')).json()).sessions ?? []
  } catch {
    history = []
  }
  model.applyHistory(history, showPast)
}

function setStatus(text, state) {
  const el = document.getElementById('conn')
  el.querySelector('span').textContent = text
  el.className = `status ${state}`
}

function connect() {
  const source = new EventSource('/stream')
  source.addEventListener('open', () => setStatus('Live', 'live'))
  source.addEventListener('replay', msg => {
    // A fresh replay: start over so a reconnect never doubles anything.
    model.reset()
    words.reset()
    for (const ev of JSON.parse(msg.data)) {
      model.apply(ev)
      words.ingest(ev)
    }
    model.applyHistory(history, showPast)
    refreshPanels()
  })
  source.addEventListener('message', msg => ingest(JSON.parse(msg.data)))
  source.addEventListener('error', () => setStatus('Reconnecting…', 'down'))
}

// A page with no bridge behind it (the hosted preview) plays the same
// synthetic activity as `server.mjs --demo`.
function playDemo() {
  setStatus('Sample activity', 'live')
  startDemo(events => events.forEach(ingest))
}

await loadHistory()
setInterval(loadHistory, HISTORY_REFRESH_MS)
if (isDemo) playDemo()
else connect()
refreshPanels()
requestAnimationFrame(frame)
// ?debug exposes the model to the console.
if (params.has('debug')) window.cluster = { model, words, table }
