// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { describe, stepSummary, fileTopic, appName } from './plain.js'

const now = (tool, summary) => describe(tool, summary).now

test('tool calls read the way a person says them', () => {
  assert.equal(now('Bash', 'npm test -- --watch=false'), 'Checking the tests')
  assert.equal(now('Bash', 'cd visualizer && npm run build'), 'Building the project')
  assert.equal(now('Bash', 'git diff --stat'), 'Looking over the changes')
  assert.equal(now('Bash', 'some-unknown-tool --flag'), 'Running a command')
  assert.equal(now('Read', 'src/auth/session.ts'), 'Reading the sign-in code')
  assert.equal(now('Edit', 'src/charts/tokens.ts'), 'Changing the chart code')
  assert.equal(now('Glob', '**/*.test.ts'), 'Looking for test files')
  assert.equal(now('Grep', 'timingSafeEqual'), 'Searching the code for “timingSafeEqual”')
  assert.equal(now('Grep', 'foo\\(.*\\)'), 'Searching through the code')
  assert.equal(now('WebFetch', 'https://www.nodejs.org/api/crypto.html'), 'Reading a page on nodejs.org')
  assert.equal(now('mcp__github__list_pull_requests'), 'Looking at pull requests on GitHub')
  assert.equal(now('mcp__github__create_pull_request'), 'Creating a pull request on GitHub')
  assert.equal(describe('Bash', 'npm test').done, 'Checked the tests')
  assert.equal(describe('Write', 'docs/ARCHITECTURE.md').fail, 'Couldn’t write the docs')
})

test('files are named by what they hold', () => {
  assert.equal(fileTopic('README.md'), 'the readme')
  assert.equal(fileTopic('package.json'), 'the project settings')
  assert.equal(fileTopic('.github/workflows/ci.yml'), 'the build setup')
  assert.equal(fileTopic('src/refunds/refund.test.ts'), 'the refund tests')
  assert.equal(fileTopic('src/sessionHandler.ts'), 'the sign-in code')
  assert.equal(fileTopic('src/widgetry/frobnicate.ts'), 'the frobnicate code')
  assert.equal(appName('plugin_engineering_slack'), 'Slack')
})

test('a run of calls becomes one step', () => {
  const calls = [
    ...['a.ts', 'b.ts', 'c.ts', 'd.ts', 'e.ts', 'f.ts'].map(f => ({ tool: 'Read', summary: f, ok: true })),
    { tool: 'Read', summary: 'a.ts', ok: true },
    { tool: 'Bash', summary: 'npm test', ok: true },
  ]
  assert.equal(stepSummary(calls), 'Looked through 6 files and ran the tests')
  assert.equal(stepSummary([{ tool: 'Bash', summary: 'npm test', ok: false }]), 'Couldn’t check the tests')
  assert.equal(stepSummary([{ tool: 'Bash', summary: 'npm test' }]), 'Checking the tests')
  assert.equal(stepSummary([
    { tool: 'Grep', summary: 'x', ok: true }, { tool: 'Grep', summary: 'y', ok: true },
    { tool: 'Edit', summary: 'src/a.ts', ok: true }, { tool: 'Bash', summary: 'git commit -m x', ok: true },
  ]), 'Searched the code twice, changed a file and saved a checkpoint')
})
