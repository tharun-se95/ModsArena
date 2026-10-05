// node --test scripts/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { versions, notes, problems } from './version.mjs'

test('every manifest carries the same version, with a changelog entry', () => {
  assert.deepEqual(problems(), [])
  assert.equal(new Set(Object.values(versions())).size, 1)
})

test('a tag must match the version', () => {
  const version = Object.values(versions())[0]
  assert.deepEqual(problems(`v${version}`), [])
  assert.match(problems('v9.9.9').join(), /doesn't match/)
})

test('notes takes one section of the changelog', () => {
  const log = '# Changelog\n\n## 1.1.0\n\n- new\n\n## 1.0.0\n\n- first\n'
  assert.equal(notes('1.1.0', log), '- new')
  assert.equal(notes('1.0.0', log), '- first')
  assert.equal(notes('2.0.0', log), null)
})
