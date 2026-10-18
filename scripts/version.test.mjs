// node --test scripts/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { versions, notes, problems } from './version.mjs'
import { readFileSync } from 'node:fs'

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

test('a change to what users install must bump the version', async () => {
  const { bumpProblem, isNewer } = await import('./version.mjs')
  assert.equal(isNewer('0.13.0', '0.12.2'), true)
  assert.equal(isNewer('0.12.10', '0.12.9'), true)
  assert.equal(isNewer('0.13.0', '0.13.0'), false)
  const current = JSON.parse(readFileSync(new URL('../agent-office/.claude-plugin/plugin.json', import.meta.url), 'utf8')).version
  const git = (changed, before) => args => args[0] === 'diff' ? changed : JSON.stringify({ version: before })
  assert.equal(bumpProblem('base', git('', current)), null, 'nothing shipped changed')
  assert.match(bumpProblem('base', git('agent-office/server/server.mjs\n', current)), /still/)
  assert.equal(bumpProblem('base', git('agent-office/server/server.mjs\n', '0.0.1')), null)
})
