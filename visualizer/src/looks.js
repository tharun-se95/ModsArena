// What you've made yours, kept in this browser (prefs.js guards storage):
// a room's wall color and decor, by project id, and a thread's critter
// color, by session id. Only names from themes.js are kept, so a stale or
// hand-edited entry falls back to the office's own pick.

import { load, save } from './prefs.js'
import { isWall, isDecor, isCritter } from './themes.js'

let rooms = load('room-looks', {}) ?? {}
let critters = load('critter-colors', {}) ?? {}
if (typeof rooms !== 'object' || Array.isArray(rooms)) rooms = {}
if (typeof critters !== 'object' || Array.isArray(critters)) critters = {}

const tell = () => globalThis.document?.dispatchEvent(new CustomEvent('office:looks'))

// { wall?, decor? } for a project, with anything unknown left out.
export function roomLook(id) {
  const r = Object.hasOwn(rooms, id) ? rooms[id] : null
  return { ...(isWall(r?.wall) && { wall: r.wall }), ...(isDecor(r?.decor) && { decor: r.decor }) }
}

export function setRoomLook(id, { wall, decor } = {}) {
  const entry = { ...(isWall(wall) && { wall }), ...(isDecor(decor) && { decor }) }
  const next = { ...rooms }
  if (Object.keys(entry).length) next[id] = entry
  else delete next[id]
  rooms = next
  save('room-looks', rooms)
  tell()
}

export function critterColor(session) {
  const c = Object.hasOwn(critters, session) ? critters[session] : null
  return isCritter(c) ? c : null
}

export function setCritterColor(session, color) {
  const next = { ...critters }
  if (isCritter(color)) next[session] = color
  else delete next[session]
  critters = next
  save('critter-colors', critters)
  tell()
}
