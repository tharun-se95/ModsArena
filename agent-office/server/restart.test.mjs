import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isOurBridge, parsePids, parseNetstat } from './restart.mjs'

test('only an Agent Office bridge counts as one to stop', () => {
  // A plugin copy, a clone, npx.
  assert.ok(isOurBridge('node /Users/t/.claude/plugins/cache/modsarena/agent-office/0.9.0/server/server.mjs --port 7337 --managed'))
  assert.ok(isOurBridge('/usr/local/bin/node /Users/t/ModsArena/agent-office/server/cli.mjs'))
  assert.ok(isOurBridge('node /Users/t/.npm/_npx/1a2b/node_modules/agent-office/agent-office/server/cli.mjs'))
  assert.ok(isOurBridge('C:\\Program Files\\nodejs\\node.exe C:\\Users\\t\\agent-office\\server\\server.mjs'))
  // Anything else on the port is left alone.
  assert.equal(isOurBridge('node /Users/t/my-app/server.mjs'), false)
  assert.equal(isOurBridge('python3 -m http.server 7337'), false)
  assert.equal(isOurBridge('/usr/sbin/httpd -D FOREGROUND'), false)
  assert.equal(isOurBridge(''), false)
})

test('lsof output becomes pids', () => {
  assert.deepEqual(parsePids('68412\n'), [68412])
  assert.deepEqual(parsePids('68412\n70001\n'), [68412, 70001])
  assert.deepEqual(parsePids(''), [])
})

test('netstat output (Windows) gives the pid listening on the port', () => {
  const out = [
    '',
    'Active Connections',
    '',
    '  Proto  Local Address          Foreign Address        State           PID',
    '  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1012',
    '  TCP    127.0.0.1:7337         0.0.0.0:0              LISTENING       4242',
    '  TCP    127.0.0.1:7337         127.0.0.1:51000        ESTABLISHED     4242',
    '  TCP    127.0.0.1:51000        127.0.0.1:7337         ESTABLISHED     900',
  ].join('\r\n')
  assert.equal(parseNetstat(out, 7337), 4242)
  assert.equal(parseNetstat(out, 7338), undefined)
  assert.equal(parseNetstat('', 7337), undefined)
})
