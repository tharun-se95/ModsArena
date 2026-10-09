// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'

// A storage that remembers, like a browser's.
const store = new Map()
globalThis.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) }
store.set('agent-office:room-looks', JSON.stringify({ old: { wall: 'zz', decor: 'robots' } }))

const { roomLook, setRoomLook, critterColor, setCritterColor } = await import('./looks.js')

test('a room keeps its wall and decor, and only known ones', () => {
  assert.deepEqual(roomLook('/work/app'), {})
  setRoomLook('/work/app', { wall: 'c', decor: 'plants' })
  assert.deepEqual(roomLook('/work/app'), { wall: 'c', decor: 'plants' })
  assert.deepEqual(JSON.parse(store.get('agent-office:room-looks'))['/work/app'], { wall: 'c', decor: 'plants' })
  setRoomLook('/work/app', { wall: 'c', decor: 'disco' })
  assert.deepEqual(roomLook('/work/app'), { wall: 'c' })
  setRoomLook('/work/app', {})
  assert.deepEqual(roomLook('/work/app'), {})
  assert.ok(!('/work/app' in JSON.parse(store.get('agent-office:room-looks'))))
  // What was stored before with names that no longer exist is ignored.
  assert.deepEqual(roomLook('old'), {})
  assert.deepEqual(roomLook('__proto__'), {})
})

test('a thread keeps its critter color', () => {
  assert.equal(critterColor('s1'), null)
  setCritterColor('s1', 'berry')
  assert.equal(critterColor('s1'), 'berry')
  setCritterColor('s1', 'plaid')
  assert.equal(critterColor('s1'), null)
  assert.equal(critterColor('constructor'), null)
})

test('storage that refuses is fine', async () => {
  globalThis.localStorage = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
  setCritterColor('s2', 'teal')
  assert.equal(critterColor('s2'), 'teal')
})
