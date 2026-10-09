// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hintFor } from './updates.js'

test('the auto-update row says plainly where things stand', () => {
  assert.equal(hintFor({ state: 'on', pending: false }), 'New versions arrive on their own.')
  assert.equal(hintFor({ state: 'on', pending: true }), 'New versions arrive on their own. Takes effect next time Claude Code starts.')
  assert.equal(hintFor({ state: 'off', pending: false }), 'New versions arrive on their own. Takes effect next time Claude Code starts.')
  assert.match(hintFor({ state: 'off', pending: true }), /^Off from next time Claude Code starts/)
  assert.match(hintFor({ state: 'missing' }), /added as a Claude Code plugin/)
  assert.match(hintFor({ state: 'on', failed: true }), /\/office auto-update/)
  for (const s of [{ state: 'on' }, { state: 'off' }, { state: 'missing' }]) assert.doesNotMatch(hintFor(s), /settings\.json|marketplace/)
})
