import { test } from 'node:test'
import assert from 'node:assert/strict'
import { STYLES, STYLE_LABELS, DEFAULT_STYLE, styleOf, critterStyle, setCritterStyle } from './critter-style.js'

test('crabs are the default, and anything unknown falls back to them', () => {
  assert.equal(DEFAULT_STYLE, 'crab')
  assert.equal(styleOf('block'), 'block')
  assert.equal(styleOf('robot'), 'crab')
  assert.equal(styleOf(undefined), 'crab')
  for (const s of STYLES) assert.ok(STYLE_LABELS[s])
})

test('setting a style reports whether it changed', () => {
  const was = critterStyle()
  const other = was === 'crab' ? 'block' : 'crab'
  assert.equal(setCritterStyle(other), true)
  assert.equal(critterStyle(), other)
  assert.equal(setCritterStyle(other), false)
  setCritterStyle(was)
})
