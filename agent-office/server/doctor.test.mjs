// node --test agent-office/server/doctor.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diagnose, report } from './doctor.mjs'

const healthy = {
  node: 'v22.3.0', platform: 'darwin', arch: 'arm64', port: 7337, officeDir: '/Users/a/.claude/agent-office', secret: 'ok',
  claude: '2.1.302 (Claude Code)', curl: null, hooks: [],
  bridge: { name: 'agent-office', version: '0.14.0', pid: 42, events: 10, errors: 0, uptimeS: 60, proof: 'x', isYours: true },
}

test('a healthy setup has nothing to fix', () => {
  const checks = diagnose(healthy)
  assert.equal(checks.filter(c => c.ok === false).length, 0)
  assert.match(report(checks, '0.14.0'), /Everything Agent Office needs is in place/)
})

test('each problem says what to do', () => {
  const checks = diagnose({
    ...healthy, node: 'v18.19.0', claude: undefined, secret: 'readable by others (mode 644)',
    bridge: { name: 'agent-office', version: '0.14.0', proof: 'wrong', isYours: false },
    hooks: ['in your user settings'], curl: false,
  })
  const fixes = checks.filter(c => c.ok === false)
  assert.deepEqual(fixes.map(c => c.label), ['Node', 'Claude Code', 'Bridge', 'Your secret', 'curl'])
  assert.ok(fixes.every(c => c.fix))
  assert.match(fixes.find(c => c.label === 'Bridge').fix, /another port/)
})

test('something else on the port, and an older bridge, are told apart', () => {
  assert.match(diagnose({ ...healthy, bridge: { name: 'nginx' } }).find(c => c.label === 'Bridge').detail, /something else/)
  assert.match(diagnose({ ...healthy, bridge: { name: 'agent-office', version: '0.12.2', isYours: false } }).find(c => c.label === 'Bridge').fix, /older than 0.13/)
})
