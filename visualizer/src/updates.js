// "Updates: automatic" in the Settings menu: lets new versions of Agent
// Office arrive on their own. The bridge reads and writes the switch in your
// Claude Code settings (agent-office/server/autoupdate.mjs); /healthz says
// where it stands and POST /auto-update changes it, with the page's token
// like chat. No bridge (the demo site), no row.

import * as settings from './settings.js'

const token = typeof document === 'undefined' ? '' : document.querySelector('meta[name="agent-office-token"]')?.content || ''

// The row's words for where things stand: { state, pending } from the
// bridge, plus `failed` when the last change didn't go through.
export function hintFor({ state, pending, failed } = {}) {
  if (failed) return 'Couldn’t change it here. Type /office auto-update in Claude Code instead.'
  if (state === 'missing') return 'Only when Agent Office was added as a Claude Code plugin'
  if (state === 'on' && !pending) return 'New versions arrive on their own.'
  if (state === 'off' && pending) return 'Off from next time Claude Code starts. You can update from /plugin.'
  return 'New versions arrive on their own. Takes effect next time Claude Code starts.'
}

let now = null

function show() {
  settings.add({
    id: 'auto-update', type: 'toggle', label: 'Updates: automatic',
    hint: () => hintFor(now),
    get: () => now?.state === 'on',
    disabled: () => now?.state === 'missing',
    set: on => void change(on),
  })
}

async function change(on) {
  const before = now
  // Shown at once; the bridge's answer settles it.
  now = { state: on ? 'on' : 'off', pending: true }
  try {
    const res = await fetch('/auto-update', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-agent-office-token': token },
      body: JSON.stringify({ on }),
    })
    const answer = await res.json()
    now = answer.autoUpdate ? { ...answer.autoUpdate, failed: !res.ok } : { ...before, failed: true }
  } catch {
    now = { ...before, failed: true }
  }
  show()
  // Redrawn rows lose focus; hand it back to the switch you pressed.
  if (document.activeElement === document.body) document.querySelector('#settings:not([hidden]) [data-setting="auto-update"]')?.focus()
}

export async function mount() {
  try {
    const health = await (await fetch('/healthz')).json()
    if (!health.autoUpdate) return
    now = health.autoUpdate
    show()
  } catch {}
}
