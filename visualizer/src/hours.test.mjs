// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { homeTime, lateness, swell } from './hours.js'

test('evening runs from 8pm to 7am', () => {
  assert.equal(homeTime(19.99), false)
  assert.equal(homeTime(20), true)
  assert.equal(homeTime(23.5), true)
  assert.equal(homeTime(3), true)
  assert.equal(homeTime(7), false)
  assert.equal(homeTime(12), false)
})

test('the lights dim gradually around 8pm and come back around 7am', () => {
  assert.equal(lateness(14), 0)
  assert.equal(lateness(19.5), 0)
  assert.equal(lateness(20), 0.5)
  assert.equal(lateness(21), 1)
  assert.equal(lateness(3), 1)
  assert.equal(lateness(7), 0.5)
  assert.equal(lateness(8), 0)
})

test('a moment swells in, holds and fades', () => {
  assert.equal(swell(0), 0)
  assert.equal(swell(0.1), 0.5)
  assert.equal(swell(0.5), 1)
  assert.equal(swell(1), 0)
})
