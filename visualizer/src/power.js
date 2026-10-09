// How hard the office works your computer. Normally it draws every frame
// the screen offers, as sharp as the screen (up to 2x), with soft shadows
// redrawn every third frame. "Save battery" in Settings draws 30 frames a
// second at 1x with a smaller shadow map redrawn every sixth frame; a tab
// you can't see draws nothing at all (main.js pauses the loop).

const KEY = 'agent-office:low-power'

export const NORMAL = { fps: 0, pixelRatio: 2, shadowSize: 2048, shadowEvery: 3 }
export const SAVING = { fps: 30, pixelRatio: 1, shadowSize: 1024, shadowEvery: 6 }

let saving = false
try { saving = localStorage.getItem(KEY) === '1' } catch {}

export const budget = () => (saving ? SAVING : NORMAL)
export const isSaving = () => saving

const listeners = new Set()
export const onChange = fn => listeners.add(fn)

export function setSaving(on) {
  saving = Boolean(on)
  try { localStorage.setItem(KEY, saving ? '1' : '0') } catch {}
  for (const fn of listeners) fn(budget())
}

// Whether a frame at `t` (ms) is due, given the last one drawn at `last`.
// A frame cap of 0 means every frame; otherwise frames come no closer than
// the cap allows, with a little slack so a 60 Hz screen lands on every
// second frame rather than drifting.
export function due(t, last, fps) {
  if (!fps) return true
  return t - last >= 1000 / fps - 4
}
