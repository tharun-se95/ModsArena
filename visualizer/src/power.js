// How hard the office works your computer. Normally it draws up to 60
// frames a second, as sharp as the screen (up to 2x), with soft shadows
// redrawn every third frame. "Save battery" in Settings draws 30 frames a
// second at 1x with a smaller shadow map redrawn every sixth frame, and it
// turns itself on while a laptop runs on battery unless you've chosen. When
// nothing has happened for a while (no events, no pointer or keys), or the
// window isn't the one you're using, the office idles at 15 frames a second;
// a tab you can't see draws nothing at all (main.js pauses the loop).

const KEY = 'agent-office:low-power'

export const NORMAL = { fps: 60, pixelRatio: 2, shadowSize: 2048, shadowEvery: 3 }
export const SAVING = { fps: 30, pixelRatio: 1, shadowSize: 1024, shadowEvery: 6 }
export const IDLE_FPS = 15
export const IDLE_AFTER_MS = 30_000

let chosen = null // '1' or '0' once you've picked in Settings
try { chosen = localStorage.getItem(KEY) } catch {}
let saving = chosen === '1'

export const budget = () => (saving ? SAVING : NORMAL)
export const isSaving = () => saving

const listeners = new Set()
export const onChange = fn => listeners.add(fn)

function apply(on) {
  if (saving === Boolean(on)) return
  saving = Boolean(on)
  for (const fn of listeners) fn(budget())
}

export function setSaving(on) {
  chosen = on ? '1' : '0'
  try { localStorage.setItem(KEY, chosen) } catch {}
  apply(on)
}

// Follow the battery (where the browser tells us: Chrome and Edge) until
// you choose in Settings.
export function followBattery(battery) {
  const follow = () => { if (chosen === null) apply(!battery.charging) }
  follow()
  battery.addEventListener?.('chargingchange', follow)
}

// The frame cap right now: the budget's, or the idle one when nothing has
// happened for IDLE_AFTER_MS or the window isn't focused.
export function fpsNow({ now, lastActive, focused }) {
  const cap = budget().fps
  return !focused || now - lastActive > IDLE_AFTER_MS ? Math.min(cap || IDLE_FPS, IDLE_FPS) : cap
}

// Whether a frame at `t` (ms) is due, given the last one drawn at `last`.
// A frame cap of 0 means every frame; otherwise frames come no closer than
// the cap allows, with a little slack so a 60 Hz screen lands on every
// second frame rather than drifting.
export function due(t, last, fps) {
  if (!fps) return true
  return t - last >= 1000 / fps - 4
}
