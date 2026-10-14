import { test } from 'node:test'
import assert from 'node:assert/strict'
import { KITS, kitFor } from './crab-kits.js'
import { roleOf } from './critters.js'

test('each kind of helper wears its own kit', () => {
  const types = ['session', 'general-purpose', 'Explore', 'Plan', 'code-reviewer', 'test-runner']
  const kits = types.map(kitFor)
  for (const k of kits) assert.ok(KITS.includes(k))
  assert.equal(new Set(kits).size, types.length, 'no two roles share a kit')
  assert.equal(kitFor('session'), 'gem')
})

test('a helper type we do not know is a plain crab', () => {
  assert.equal(kitFor('some-custom-agent'), 'none')
  assert.equal(kitFor(undefined), 'none')
  assert.equal(roleOf('some-custom-agent'), 'Helper')
})
