// node --test agent-office/server/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { addHooks, removeHooks, hasHooks, fallbackHooks, MARK } from './settings-hooks.mjs'

const yours = {
  model: 'sonnet',
  hooks: {
    PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'my-guard.sh' }] }],
    Notification: [{ hooks: [{ type: 'command', command: 'say done' }] }],
  },
}

test('addHooks keeps your own hooks and settings', () => {
  const next = addHooks(yours, 7337)
  assert.equal(next.model, 'sonnet')
  assert.equal(next.hooks.PreToolUse[0].hooks[0].command, 'my-guard.sh')
  assert.equal(next.hooks.Notification[0].hooks[0].command, 'say done')
  assert.ok(next.hooks.PreToolUse[1].hooks[0].command.includes(MARK))
  assert.equal(next.hooks.PreToolUse[1].matcher, '*')
  assert.ok(next.hooks.SessionStart[0].hooks[0].command.includes('127.0.0.1:7337/event'))
  assert.ok(hasHooks(next))
  assert.ok(!hasHooks(yours))
})

test('adding twice, or with a new port, leaves one set', () => {
  const twice = addHooks(addHooks(yours, 7337), 7400)
  assert.equal(twice.hooks.PreToolUse.length, 2)
  assert.ok(twice.hooks.PreToolUse[1].hooks[0].command.includes(':7400/'))
  assert.equal(twice.hooks.SessionStart.length, 1)
})

test('removeHooks takes out exactly what addHooks put in', () => {
  assert.deepEqual(removeHooks(addHooks(yours, 7337)), yours)
  assert.deepEqual(removeHooks(addHooks({}, 7337)), {})
  assert.deepEqual(removeHooks({ theme: 'dark' }), { theme: 'dark' })
})

test('fallback/settings.json is what install-hooks would add', () => {
  const file = JSON.parse(readFileSync(new URL('../fallback/settings.json', import.meta.url), 'utf8'))
  assert.deepEqual(file, fallbackHooks(7337))
})
