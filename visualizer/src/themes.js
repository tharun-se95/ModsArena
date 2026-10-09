// Make it yours: the office comes in three looks, picked in Settings.
//
//   Cozy           warm wood, soft walls, the sky outside (the page's own
//                  colors in index.html, so it needs no tokens here)
//   Studio         white oak and concrete, bright gallery light
//   Space station  hull panels, round portholes full of stars, glowing
//                  trim, and a galley where the coffee corner was
//
// A theme is pure data: the page tokens it overrides, in light and dark
// (the panels match the scene), and a `look` the 3D office reads for what
// tokens can't say: which floor pattern, what's outside the windows, how
// bright the lights are. apply() puts the tokens on <html> as inline
// custom properties, so getComputedStyle() and table.js's readPalette()
// see them like any other token; onChange() hears a new theme or a new
// light/dark mode, once the tokens are already in place.
//
// Also here: the colors you can give a thread's critter, the wall colors
// and the decor a room can have (looks.js keeps your picks).

import { load, save } from './prefs.js'

// Every token a theme sets, in light and in dark. contrast.test.mjs holds
// the UI ones to WCAG AA; themes.test.mjs checks every theme against it.
export const UI_KEYS = ['bg', 'paper', 'ink', 'muted', 'line', 'accent', 'accent-ink', 'on-accent', 'focus']
export const SCENE_KEYS = [
  'scene', 'floor', 'thread', 'clay', 'wood', 'wood-dark', 'trim', 'glow', 'window', 'gem',
  'room-a', 'room-b', 'room-c', 'room-d', 'room-e', 'room-f',
  'night', 'dawn', 'dusk', 'carpet', 'outer-wall', 'desk', 'tile', 'counter', 'fridge',
]
export const TOKEN_KEYS = [...UI_KEYS, ...SCENE_KEYS]
// What every theme's look says.
export const LOOK_KEYS = ['roomFloor', 'walls', 'officeFloor', 'coffeeFloor', 'windows', 'trimGlow', 'galley', 'coffeeName', 'light', 'swatch']

const COZY_LIGHT = { sky: 1, sun: 1, env: 1, sunColor: '#fffaf2' }

export const THEMES = {
  cozy: {
    name: 'Cozy',
    hint: 'Warm wood, soft walls and the sky outside',
    // The page's own tokens (index.html): nothing to override.
    light: {},
    dark: {},
    look: {
      roomFloor: 'planks', walls: 'plain', officeFloor: 'carpet', coffeeFloor: 'checker', windows: 'sky',
      trimGlow: 0, galley: false, coffeeName: 'Coffee corner', light: COZY_LIGHT,
      swatch: ['#e6cfae', '#f6d8c6', '#b85c3c'],
    },
  },
  studio: {
    name: 'Studio',
    hint: 'Bright and simple: white oak, concrete, gallery light',
    light: {
      bg: '#f2f2ef', paper: '#ffffff', ink: '#1b1b1a', muted: '#5c5c58', line: '#e2e2dd',
      accent: '#2d5bd1', 'accent-ink': '#2a54c2', 'on-accent': '#ffffff', focus: '#2d5bd1',
      scene: '#eceae5', floor: '#e3e1db', thread: '#85837d', clay: '#2d5bd1',
      wood: '#e8dbc4', 'wood-dark': '#4a453e', trim: '#fafaf8', glow: '#fff2dc', window: '#cde4f4', gem: '#f2c14e',
      'room-a': '#f3ebe4', 'room-b': '#e6efea', 'room-c': '#e8e9f3', 'room-d': '#f2eddb', 'room-e': '#f2e6ea', 'room-f': '#e4edf3',
      night: '#27324d', dawn: '#f3d4b8', dusk: '#d8afba',
      carpet: '#cdcbc6', 'outer-wall': '#f7f7f4', desk: '#f0e8d9', tile: '#dddbd6', counter: '#f4f4f1', fridge: '#efefec',
    },
    dark: {
      bg: '#161718', paper: '#202123', ink: '#ededeb', muted: '#a4a4a0', line: '#36373a',
      accent: '#7ea2ff', 'accent-ink': '#8eaeff', 'on-accent': '#121314', focus: '#8eaeff',
      scene: '#18191b', floor: '#212225', thread: '#8b8b88', clay: '#7ea2ff',
      wood: '#8c7f6c', 'wood-dark': '#2e2c29', trim: '#5c5d60', glow: '#ffe6c0', window: '#3a5f80', gem: '#f5c95a',
      'room-a': '#433e3a', 'room-b': '#363f3b', 'room-c': '#3a3b47', 'room-d': '#423e31', 'room-e': '#43383b', 'room-f': '#353e46',
      night: '#10141f', dawn: '#8a6a5a', dusk: '#6a5060',
      carpet: '#3b3b3b', 'outer-wall': '#2b2c2e', desk: '#6f6250', tile: '#3d3d3d', counter: '#4b4c4f', fridge: '#b8b8b5',
    },
    look: {
      roomFloor: 'planks', walls: 'plain', officeFloor: 'concrete', coffeeFloor: 'concrete', windows: 'sky',
      trimGlow: 0, galley: false, coffeeName: 'Coffee bar',
      // Gallery light: brighter and whiter, with a little less bounce.
      light: { sky: 1.12, sun: 1.12, env: 0.9, sunColor: '#ffffff' },
      swatch: ['#e8dbc4', '#cdcbc6', '#2d5bd1'],
    },
  },
  space: {
    name: 'Space station',
    hint: 'Hull panels, portholes full of stars, a galley for coffee',
    // Out in space it's always night: the void around the station stays
    // dark in both modes, and the hull is lighter by day.
    light: {
      bg: '#e9edf3', paper: '#f8fafd', ink: '#121925', muted: '#525d6f', line: '#d6dce6',
      accent: '#0d7891', 'accent-ink': '#0b6a80', 'on-accent': '#ffffff', focus: '#0d7891',
      scene: '#0d1220', floor: '#121a2a', thread: '#7c8696', clay: '#18a8c8',
      wood: '#aab4c2', 'wood-dark': '#3d4757', trim: '#d9e0e9', glow: '#78e6ff', window: '#0b1020', gem: '#7ef0ff',
      'room-a': '#c9d1dc', 'room-b': '#c3d3d2', 'room-c': '#cccbdc', 'room-d': '#d3cfc2', 'room-e': '#d5c8d0', 'room-f': '#c2cfdd',
      night: '#0b1020', dawn: '#0b1020', dusk: '#0b1020',
      carpet: '#8f9aa9', 'outer-wall': '#b6c0cd', desk: '#dfe5ec', tile: '#a3adba', counter: '#7d8a9b', fridge: '#e9eef4',
    },
    dark: {
      bg: '#0c1018', paper: '#141a24', ink: '#e6edf7', muted: '#94a1b5', line: '#263041',
      accent: '#3fd0ea', 'accent-ink': '#5fd8ee', 'on-accent': '#071016', focus: '#5fd8ee',
      scene: '#070a12', floor: '#0d121c', thread: '#7d8aa0', clay: '#3fd0ea',
      wood: '#323c4b', 'wood-dark': '#1b212b', trim: '#3d4a5d', glow: '#59e1ff', window: '#0b1020', gem: '#7ef0ff',
      'room-a': '#283243', 'room-b': '#22373b', 'room-c': '#2d2b45', 'room-d': '#38352c', 'room-e': '#382a3e', 'room-f': '#223146',
      night: '#05070d', dawn: '#05070d', dusk: '#05070d',
      carpet: '#1c2430', 'outer-wall': '#1f2836', desk: '#3b4658', tile: '#242c39', counter: '#2f3b4d', fridge: '#8e9aab',
    },
    look: {
      roomFloor: 'deck', walls: 'panels', officeFloor: 'deck', coffeeFloor: 'deck', windows: 'stars',
      // The trim along every wall glows in the theme's lamp color.
      trimGlow: 0.4, galley: true, coffeeName: 'Galley',
      light: { sky: 0.92, sun: 0.9, env: 1.1, sunColor: '#e6f2ff' },
      swatch: ['#323c4b', '#78e6ff', '#0d7891'],
    },
  },
}

export const IDS = Object.keys(THEMES)
export const DEFAULT = 'cozy'
export const valid = id => Object.hasOwn(THEMES, id)

// The tokens a theme sets in a mode ('light' or 'dark').
export const tokensFor = (id, mode) => (THEMES[valid(id) ? id : DEFAULT][mode === 'dark' ? 'dark' : 'light'])
export const lookOf = id => THEMES[valid(id) ? id : DEFAULT].look

// ---------------------------------------------------------------------------
// Critters, walls and decor you can pick (looks.js keeps them).

// Ten critter colors that read on every theme's floors, light and dark:
// the seven the office already uses and three more. Each is a page token
// (index.html), so dots, rugs and critters all agree.
export const CRITTERS = [
  { id: 'coral', name: 'Coral' }, { id: 'tangerine', name: 'Tangerine' }, { id: 'mustard', name: 'Mustard' },
  { id: 'leaf', name: 'Leaf' }, { id: 'teal', name: 'Teal' }, { id: 'sky', name: 'Sky' },
  { id: 'lilac', name: 'Lilac' }, { id: 'pink', name: 'Pink' }, { id: 'berry', name: 'Berry' }, { id: 'slate', name: 'Slate' },
]
export const isCritter = id => CRITTERS.some(c => c.id === id)

// A room's walls: one of the six room colors, which every theme defines.
export const WALLS = [
  { id: 'a', name: 'Peach' }, { id: 'b', name: 'Mint' }, { id: 'c', name: 'Lavender' },
  { id: 'd', name: 'Butter' }, { id: 'e', name: 'Rose' }, { id: 'f', name: 'Sky' },
]
export const isWall = id => WALLS.some(w => w.id === id)

// What a room can be dressed with, on top of what it already has.
export const DECOR = [
  { id: 'plants', name: 'Plants', icon: '🪴' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'art', name: 'Art', icon: '🖼️' },
  { id: 'lamps', name: 'Cosy lamps', icon: '🛋️' },
]
export const isDecor = id => DECOR.some(d => d.id === id)

// ---------------------------------------------------------------------------
// The theme in use: remembered in this browser, applied to <html>.

const saved = load('office-theme', DEFAULT)
let current = valid(saved) ? saved : DEFAULT
const listeners = new Set()
let applied = [] // the inline properties apply() set last

export const theme = () => current
export const look = () => lookOf(current)

// Light or dark, the way index.html decides it: an explicit data-theme
// wins, else the system's preference.
export function mode(doc = globalThis.document) {
  const set = doc?.documentElement?.dataset?.theme
  if (set === 'dark' || set === 'light') return set
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function apply(doc = globalThis.document) {
  const root = doc?.documentElement
  if (!root) return
  for (const k of applied) root.style.removeProperty(`--${k}`)
  const tokens = tokensFor(current, mode(doc))
  for (const [k, v] of Object.entries(tokens)) root.style.setProperty(`--${k}`, v)
  applied = Object.keys(tokens)
  root.dataset.officeTheme = current
}

export const onChange = fn => listeners.add(fn)
const tell = () => { for (const fn of listeners) fn(current) }

export function setTheme(id) {
  if (!valid(id) || id === current) return
  current = id
  save('office-theme', id)
  apply()
  tell()
}

// A new light/dark mode re-applies the theme's tokens first, then tells
// whoever listens (the scene repaints from the tokens).
if (globalThis.document?.documentElement) {
  apply()
  const again = () => { apply(); tell() }
  if (typeof matchMedia === 'function') matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', again)
  if (typeof MutationObserver === 'function') new MutationObserver(again).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}
