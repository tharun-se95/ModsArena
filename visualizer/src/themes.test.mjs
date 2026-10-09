// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { light, dark, failures, ratio, resolve } from './contrast.mjs'
import { THEMES, IDS, DEFAULT, TOKEN_KEYS, LOOK_KEYS, CRITTERS, WALLS, DECOR, tokensFor, lookOf, valid } from './themes.js'

const page = { light, dark }

test('there are three themes and Cozy is the default', () => {
  assert.deepEqual(IDS, ['cozy', 'studio', 'space'])
  assert.equal(DEFAULT, 'cozy')
  assert.ok(!valid('nope') && !valid('__proto__') && !valid('toString'))
  assert.equal(tokensFor('nope', 'light'), THEMES.cozy.light)
  assert.equal(lookOf(undefined), THEMES.cozy.look)
})

test('every theme defines every look key', () => {
  for (const id of IDS) {
    const look = THEMES[id].look
    for (const k of LOOK_KEYS) assert.ok(look[k] !== undefined, `${id}: look.${k}`)
    for (const k of ['sky', 'sun', 'env', 'sunColor']) assert.ok(look.light[k] !== undefined, `${id}: look.light.${k}`)
    assert.ok(['planks', 'deck'].includes(look.roomFloor), `${id}: roomFloor`)
    assert.ok(['plain', 'panels'].includes(look.walls), `${id}: walls`)
    assert.ok(['carpet', 'concrete', 'deck'].includes(look.officeFloor), `${id}: officeFloor`)
    assert.ok(['checker', 'concrete', 'deck'].includes(look.coffeeFloor), `${id}: coffeeFloor`)
    assert.ok(['sky', 'stars'].includes(look.windows), `${id}: windows`)
    assert.equal(look.swatch.length, 3, `${id}: three swatch colors`)
    assert.ok(THEMES[id].name && THEMES[id].hint, `${id}: name and hint`)
  }
})

test('every theme sets every token in light and dark (Cozy through the page)', () => {
  for (const id of IDS) {
    for (const mode of ['light', 'dark']) {
      const own = tokensFor(id, mode)
      if (id === 'cozy') {
        assert.deepEqual(own, {}, 'Cozy is the page as it is')
        for (const k of TOKEN_KEYS) assert.ok(page[mode][k], `index.html ${mode}: --${k}`)
        continue
      }
      for (const k of TOKEN_KEYS) assert.match(own[k] ?? '', /^#[0-9a-f]{6}$/, `${id} ${mode}: --${k}`)
      for (const k of Object.keys(own)) assert.ok(TOKEN_KEYS.includes(k), `${id} ${mode}: unknown --${k}`)
    }
  }
})

test('every theme passes the page contrast checks, light and dark', () => {
  for (const id of IDS) {
    for (const mode of ['light', 'dark']) {
      const merged = { ...page[mode], ...tokensFor(id, mode) }
      assert.deepEqual(failures(merged), [], `${id} ${mode}`)
    }
  }
})

test('every critter color is a page token and stands out on every theme', () => {
  assert.ok(CRITTERS.length >= 8 && CRITTERS.length <= 12)
  assert.equal(new Set(CRITTERS.map(c => c.id)).size, CRITTERS.length)
  for (const mode of ['light', 'dark']) {
    for (const c of CRITTERS) assert.match(page[mode][c.id] ?? '', /^#[0-9a-f]{6}$/, `index.html ${mode}: --${c.id}`)
    for (const id of IDS) {
      const merged = { ...page[mode], ...tokensFor(id, mode) }
      const col = k => resolve(merged, merged[k])
      for (const c of CRITTERS) {
        // A critter is drawn on its room's floor and its rug: it should
        // never melt into the floor.
        assert.ok(ratio(col(c.id), col('wood')) >= 1.25 || hueGap(col(c.id), col('wood')) > 40, `${c.id} on ${id} ${mode} floor`)
      }
    }
  }
})

test('walls and decor have names', () => {
  assert.deepEqual(WALLS.map(w => w.id), ['a', 'b', 'c', 'd', 'e', 'f'])
  assert.deepEqual(DECOR.map(d => d.id), ['plants', 'books', 'art', 'lamps'])
  for (const x of [...WALLS, ...DECOR, ...CRITTERS]) assert.ok(x.name)
})

function hue(h) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  if (!d) return 0
  const x = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return (x * 60 + 360) % 360
}

const hueGap = (a, b) => { const d = Math.abs(hue(a) - hue(b)) % 360; return Math.min(d, 360 - d) }
