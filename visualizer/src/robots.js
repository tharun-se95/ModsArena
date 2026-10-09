// Robot crabs: the same team as little robot crabs with screen faces, a
// choice in Settings ("Critters"), remembered in this browser. This file
// holds the pure parts: which style is on, which robot each kind of helper
// is, which accessory it wears, and which face its screen shows. No DOM
// (beyond an optional event) and no Three.js; robot-character.js builds
// the meshes.
//
// Five robots, one per kind of helper (the owner's picks from the studio):
//   session          Bot     the lead, with its gem
//   general-purpose  Mini    small and round; also any type we don't know
//   Explore          Sleek   a glossy pebble with a light strip, magnifier
//   Plan             Retro   cream panels, a porthole screen, planner cap
//   test-runner      Tank    wide and armoured, one big claw, antennae
//   code-reviewer    Bot     wearing reading glasses on its screen

import { load, save } from './prefs.js'

export const STYLES = ['classic', 'robot']
export const STYLE_LABELS = { classic: 'Classic', robot: 'Robot crabs' }
export const DEFAULT_STYLE = 'classic'

export const styleOf = value => (STYLES.includes(value) ? value : DEFAULT_STYLE)

let style = styleOf(load('critters', DEFAULT_STYLE))

export const critterStyle = () => style

// Returns true when the style actually changed (so the office rebuilds).
export function setCritterStyle(next) {
  const value = styleOf(next)
  if (value === style) return false
  style = value
  save('critters', value)
  globalThis.document?.dispatchEvent(new CustomEvent('office:critters', { detail: value }))
  return true
}

export const VARIANTS = ['bot', 'mini', 'tank', 'retro', 'sleek']

const ROBOTS = {
  session: { variant: 'bot', accessory: 'lead' },
  'general-purpose': { variant: 'mini', accessory: null },
  Explore: { variant: 'sleek', accessory: 'research' },
  Plan: { variant: 'retro', accessory: 'plan' },
  'test-runner': { variant: 'tank', accessory: 'test' },
  'code-reviewer': { variant: 'bot', accessory: 'review' },
}
const FALLBACK = ROBOTS['general-purpose']

// Which robot a build (a helper type, or 'session') is, and what it wears.
export const robotFor = build => (Object.hasOwn(ROBOTS, build) ? ROBOTS[build] : FALLBACK)

// What a robot is doing, from what the office already tells a critter:
// the pose options (busy, walk, asking, asleep) and its mood (moods.js).
// The first that applies wins.
export function stateOf({ asleep = false, walk = false, asking = false, busy = 0, mood = null } = {}) {
  const kind = mood?.kind
  if (asleep) return 'asleep'
  if (kind === 'cheer') return 'celebrate'
  if (kind === 'sulk') return 'sulk'
  if (kind === 'perk') return 'perk'
  if (asking) return 'waiting'
  if (walk) return 'walking'
  if (kind === 'think') return 'thinking'
  if (kind === 'yawn') return 'yawn'
  if (busy > 0.5) return 'working'
  return 'idle'
}

// The screen's glyphs, as the studio drew them: `glyph` names the shape
// and (ox, oy) nudges both eyes, in glyph units (-y is up).
//   happy ^ ^   work + +   blink − −   wow o o   cheer > <   look · ·
export const FACES = {
  happy: { glyph: 'happy', ox: 0, oy: 0 },
  blink: { glyph: 'blink', ox: 0, oy: 0 },
  work: { glyph: 'work', ox: 0, oy: 0 },
  wow: { glyph: 'wow', ox: 0, oy: 0 },
  cheer: { glyph: 'cheer', ox: 0, oy: 0 },
  'look-up-left': { glyph: 'look', ox: -16, oy: -18 },
  'look-up-right': { glyph: 'look', ox: 8, oy: -18 },
  'look-down': { glyph: 'look', ox: 0, oy: 14 },
}

// The face for a state at time `t` (seconds). `blinking` is the critter's
// own blink, which idle and walking faces show as − −.
export function faceFor(state, t = 0, blinking = false) {
  switch (state) {
    case 'asleep':
    case 'yawn':
      return 'blink'
    case 'working':
      return 'work'
    case 'thinking':
      // Looking up, glancing from one side to the other now and then.
      return Math.floor(t / 1.6) % 3 === 2 ? 'look-up-right' : 'look-up-left'
    case 'waiting':
    case 'perk':
      return blinking ? 'blink' : 'wow'
    case 'celebrate':
      return 'cheer'
    case 'sulk':
      return 'look-down'
    default:
      return blinking ? 'blink' : 'happy'
  }
}

// What the claws and legs do in each state (robot-character.js poses it).
export const MOVES = {
  idle: 'idle', walking: 'walk', working: 'work', thinking: 'think', celebrate: 'cheer',
  waiting: 'wait', perk: 'idle', sulk: 'sulk', yawn: 'idle', asleep: 'rest',
}
export const moveOf = state => MOVES[state] ?? 'idle'
