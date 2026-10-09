// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { STYLES, STYLE_LABELS, styleOf, critterStyle, setCritterStyle, VARIANTS, robotFor, stateOf, faceFor, FACES, moveOf } from './robots.js'

test('the style is classic or robot, classic by default, and anything else falls back', () => {
  assert.deepEqual(STYLES, ['classic', 'robot'])
  for (const s of STYLES) assert.ok(STYLE_LABELS[s])
  assert.equal(styleOf('robot'), 'robot')
  assert.equal(styleOf('crab'), 'classic')
  assert.equal(styleOf(undefined), 'classic')
  assert.equal(critterStyle(), 'classic') // no storage here: the default
})

test('choosing a style is remembered, says so once, and works without storage', () => {
  const store = new Map()
  const heard = []
  globalThis.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }
  globalThis.document = { dispatchEvent: e => heard.push(e.detail) }
  try {
    assert.equal(setCritterStyle('robot'), true)
    assert.equal(critterStyle(), 'robot')
    assert.equal(store.get('agent-office:critters'), '"robot"')
    assert.deepEqual(heard, ['robot'])
    assert.equal(setCritterStyle('robot'), false) // no change, no rebuild
    assert.deepEqual(heard, ['robot'])
    globalThis.localStorage = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
    assert.equal(setCritterStyle('nonsense'), true)
    assert.equal(critterStyle(), 'classic')
  } finally {
    delete globalThis.localStorage
    delete globalThis.document
  }
})

test('a saved choice is read back when the page loads', async () => {
  globalThis.localStorage = { getItem: k => (k === 'agent-office:critters' ? '"robot"' : null), setItem() {} }
  try {
    const fresh = await import(`./robots.js?reload=${Date.now()}`)
    assert.equal(fresh.critterStyle(), 'robot')
  } finally {
    delete globalThis.localStorage
  }
})

test('each kind of helper is its own robot, and anything unknown is a Mini', () => {
  assert.deepEqual(VARIANTS, ['bot', 'mini', 'tank', 'retro', 'sleek'])
  assert.deepEqual(robotFor('session'), { variant: 'bot', accessory: 'lead' })
  assert.deepEqual(robotFor('general-purpose'), { variant: 'mini', accessory: null })
  assert.deepEqual(robotFor('Explore'), { variant: 'sleek', accessory: 'research' })
  assert.deepEqual(robotFor('Plan'), { variant: 'retro', accessory: 'plan' })
  assert.deepEqual(robotFor('test-runner'), { variant: 'tank', accessory: 'test' })
  assert.deepEqual(robotFor('code-reviewer'), { variant: 'bot', accessory: 'review' })
  for (const odd of ['my-custom-agent', undefined, '', '__proto__', 'toString']) assert.deepEqual(robotFor(odd), robotFor('general-purpose'), String(odd))
  // All five designs are in use.
  const used = new Set(['session', 'general-purpose', 'Explore', 'Plan', 'test-runner', 'code-reviewer'].map(b => robotFor(b).variant))
  assert.deepEqual([...used].sort(), [...VARIANTS].sort())
})

test('what a robot is doing comes from its pose and mood, first match wins', () => {
  assert.equal(stateOf(), 'idle')
  assert.equal(stateOf({ busy: 1 }), 'working')
  assert.equal(stateOf({ busy: 0.3 }), 'idle')
  assert.equal(stateOf({ walk: true, busy: 1 }), 'walking')
  assert.equal(stateOf({ asking: true, busy: 1 }), 'waiting')
  assert.equal(stateOf({ mood: { kind: 'think', k: 0.2 } }), 'thinking')
  assert.equal(stateOf({ mood: { kind: 'cheer', k: 0.5 }, asking: true }), 'celebrate')
  assert.equal(stateOf({ mood: { kind: 'sulk', k: 0.5 } }), 'sulk')
  assert.equal(stateOf({ mood: { kind: 'yawn', k: 0.5 } }), 'yawn')
  assert.equal(stateOf({ asleep: true, busy: 1, mood: { kind: 'cheer' } }), 'asleep')
})

test('the screen face follows the state', () => {
  assert.equal(faceFor('idle'), 'happy')
  assert.equal(faceFor('idle', 0, true), 'blink')
  assert.equal(faceFor('walking'), 'happy')
  assert.equal(faceFor('working'), 'work')
  assert.equal(faceFor('working', 0, true), 'work') // no blinking mid-clack
  assert.equal(faceFor('waiting'), 'wow')
  assert.equal(faceFor('celebrate'), 'cheer')
  assert.equal(faceFor('asleep'), 'blink')
  assert.equal(faceFor('sulk'), 'look-down')
  // Thinking looks up, glancing aside now and then.
  const looks = new Set([0, 1, 2, 3.5, 4].map(t => faceFor('thinking', t)))
  assert.deepEqual([...looks].sort(), ['look-up-left', 'look-up-right'])
  for (const k of looks) assert.ok(FACES[k].oy < 0, `${k} looks up`)
  assert.equal(faceFor('something-else'), 'happy')
  // Every face it can show has glyphs.
  for (const s of ['idle', 'walking', 'working', 'thinking', 'waiting', 'perk', 'celebrate', 'sulk', 'yawn', 'asleep']) {
    for (const t of [0, 3.3]) for (const b of [false, true]) assert.ok(FACES[faceFor(s, t, b)], `${s} face`)
  }
})

test('every state has a move, and unknown ones idle', () => {
  for (const s of ['idle', 'walking', 'working', 'thinking', 'waiting', 'celebrate', 'asleep']) assert.ok(moveOf(s))
  assert.equal(moveOf('walking'), 'walk')
  assert.equal(moveOf('working'), 'work')
  assert.equal(moveOf('celebrate'), 'cheer')
  assert.equal(moveOf('waiting'), 'wait')
  assert.equal(moveOf('nope'), 'idle')
})
