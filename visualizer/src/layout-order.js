// A steady office: rooms keep their places. Each project gets a slot the
// first time the office shows it and keeps it, remembered in this browser,
// so a new project takes the next free place instead of shuffling the
// others, a project that wakes up or goes quiet stays put, and a refresh
// draws the same office. The grid keeps its number of columns unless
// another fits the space clearly better. Pure: no DOM, no Three.js.

export const KEEP_SLOTS = 300 // projects remembered
export const STICKY = 0.85 // keep the columns unless they'd make the office this much smaller

// Rooms in slot order. `saved` is the remembered order of project ids;
// projects it doesn't know yet go after it, in the order given (the
// caller's first-time order). Returns the rooms in order and the order to
// remember.
export function orderRooms(rooms, saved = []) {
  const known = Array.isArray(saved) ? saved.filter(id => typeof id === 'string') : []
  const slot = new Map(known.map((id, i) => [id, i]))
  const order = [...known]
  for (const r of rooms) {
    if (!slot.has(r.id)) {
      slot.set(r.id, order.length)
      order.push(r.id)
    }
  }
  const sorted = [...rooms].sort((a, b) => slot.get(a.id) - slot.get(b.id))
  // Forget the oldest beyond the cap, but never one that's showing.
  const showing = new Set(rooms.map(r => r.id))
  while (order.length > KEEP_SLOTS) {
    const i = order.findIndex(id => !showing.has(id))
    if (i === -1) break
    order.splice(i, 1)
  }
  return { rooms: sorted, order }
}

// The column count to use: the best for the space, unless the current one
// still fits nearly as well (within STICKY), so adding a room or a desk
// doesn't reflow the whole office. `scaleFor(cols)` says how big the
// office draws with that many columns.
export function pickCols(count, previous, scaleFor) {
  let best = 1
  let bestScale = -Infinity
  for (let cols = 1; cols <= count; cols++) {
    const s = scaleFor(cols)
    if (s > bestScale) { best = cols; bestScale = s }
  }
  if (previous && previous <= count && scaleFor(previous) >= bestScale * STICKY) return previous
  return best
}

// Desks in a room, by when each thread started, so a thread keeps its desk
// when another finishes or a new one arrives after it.
export const byStart = (a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0) || String(a.id).localeCompare(String(b.id))
