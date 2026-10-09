// Less motion, for anyone who asks for it: the system's "reduce motion"
// setting, or the office's own toggle in Settings. Either one turns off the
// camera's glides, hops, confetti, swaying, bobbing and every CSS animation;
// the office still shows every state, it just stops moving to say so.
//
// The page reads it as `<html data-motion="reduce">` (index.html stops CSS
// animations and transitions under it); the scene asks reduced() each frame.

const KEY = 'agent-office:reduce-motion'
const media = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false, addEventListener() {} }

function load() {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}

let chosen = load()

// The system's wish wins: turning the toggle off can't bring motion back
// while the system asks for less.
export const decide = ({ system, chosen }) => Boolean(system || chosen)

export const reduced = () => decide({ system: media.matches, chosen })
export const bySystem = () => media.matches
export const chosenByYou = () => chosen

function apply() {
  if (typeof document === 'undefined') return
  if (reduced()) document.documentElement.dataset.motion = 'reduce'
  else delete document.documentElement.dataset.motion
}

export function setReduced(on) {
  chosen = Boolean(on)
  try { localStorage.setItem(KEY, chosen ? '1' : '0') } catch {}
  apply()
}

media.addEventListener?.('change', apply)
apply()
