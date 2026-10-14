import { test } from 'node:test'
import assert from 'node:assert/strict'
import { orderRooms, pickCols, byStart, KEEP_SLOTS } from './layout-order.js'

const r = id => ({ id })

test('rooms keep their slots: a new project goes last, not alphabetically', () => {
  const first = orderRooms([r('b'), r('d')], [])
  assert.deepEqual(first.rooms.map(x => x.id), ['b', 'd'])
  // "a" arrives: it sorts first by name, but takes the next slot.
  const next = orderRooms([r('a'), r('b'), r('d')], first.order)
  assert.deepEqual(next.rooms.map(x => x.id), ['b', 'd', 'a'])
  // A room that goes away and comes back keeps its place.
  const without = orderRooms([r('a'), r('d')], next.order)
  assert.deepEqual(without.rooms.map(x => x.id), ['d', 'a'])
  const back = orderRooms([r('a'), r('b'), r('d')], without.order)
  assert.deepEqual(back.rooms.map(x => x.id), ['b', 'd', 'a'])
})

test('the remembered order is capped, but never forgets a room on show', () => {
  const saved = Array.from({ length: KEEP_SLOTS }, (_, i) => `p${i}`)
  const { order } = orderRooms([r('p0'), r('new')], saved)
  assert.equal(order.length, KEEP_SLOTS)
  assert.ok(order.includes('p0') && order.includes('new'))
  assert.ok(!order.includes('p1'))
  // Junk in storage is ignored.
  assert.deepEqual(orderRooms([r('x')], 'junk').order, ['x'])
})

test('the grid keeps its columns unless another fits clearly better', () => {
  const scales = { 1: 0.5, 2: 0.9, 3: 1.0, 4: 0.7 }
  const scaleFor = c => scales[c]
  assert.equal(pickCols(4, undefined, scaleFor), 3) // first time: the best
  assert.equal(pickCols(4, 2, scaleFor), 2) // 0.9 is within 15% of 1.0: stay
  assert.equal(pickCols(4, 4, scaleFor), 3) // 0.7 is not: move
  assert.equal(pickCols(2, 3, c => ({ 1: 0.6, 2: 1 })[c]), 2) // more columns than rooms: recompute
})

test('desks go by when each thread started', () => {
  const list = [{ id: 'c', startedAt: 3 }, { id: 'a', startedAt: 1 }, { id: 'b', startedAt: 1 }]
  assert.deepEqual(list.sort(byStart).map(x => x.id), ['a', 'b', 'c'])
})
