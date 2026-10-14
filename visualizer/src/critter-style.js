// Which critters fill the office: the robot crabs (crab.js) or the Claude
// bots, the classic blocky design (character.js). A choice in Settings, remembered in this browser.
// Pure apart from prefs: no DOM, no Three.js.

import { load, save } from './prefs.js'

export const STYLES = ['crab', 'block']
export const STYLE_LABELS = { crab: 'Crabs', block: 'Claude bots' }
export const DEFAULT_STYLE = 'crab'

export const styleOf = value => (STYLES.includes(value) ? value : DEFAULT_STYLE)

let style = styleOf(load('critters', DEFAULT_STYLE))

export const critterStyle = () => style

// Returns true when the style actually changed.
export function setCritterStyle(next) {
  const value = styleOf(next)
  if (value === style) return false
  style = value
  save('critters', value)
  return true
}
