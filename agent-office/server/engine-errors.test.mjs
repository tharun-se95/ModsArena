// node --test agent-office/server/engine-errors.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { engineError } from './engine-errors.mjs'
import { entriesOf } from './transcript.mjs'

test('Claude Code’s own error lines are problems with a fix', () => {
  assert.equal(engineError('Login expired · Please run /login').kind, 'login')
  assert.match(engineError('Login expired · Please run /login').fix, /\/login/)
  assert.equal(engineError('OAuth token revoked · Please run /login').kind, 'login')
  assert.equal(engineError('Could not refresh your login because another Claude Code process is refreshing it (or exited mid-refresh) · Try again in a minute').kind, 'busy-login')
  assert.equal(engineError('API Error: 529 {"type":"overloaded_error"}').kind, 'api')
})

test('what Claude says stays Claude talking, even about logins or limits', () => {
  assert.equal(engineError('Added rate limiting to the API.'), null)
  assert.equal(engineError('You need to run /login first, then retry.'), null)
  assert.equal(engineError('Fixed. Users whose login expired are now sent to /login.'), null)
  assert.equal(engineError(''), null)
})

test('marked as an error, any line is one', () => {
  assert.equal(engineError('Something odd', { isError: true }).kind, 'api')
})

test('the transcript shows Claude Code’s error as a problem, not a reply', () => {
  const row = { type: 'assistant', isApiErrorMessage: true, timestamp: '2026-10-14T10:00:00Z', message: { model: '<synthetic>', content: [{ type: 'text', text: 'Login expired · Please run /login' }] } }
  const [e] = entriesOf(row)
  assert.equal(e.kind, 'problem')
  assert.equal(e.title, 'Claude Code’s sign-in has expired')
  const quiet = entriesOf({ type: 'assistant', message: { model: '<synthetic>', content: [{ type: 'text', text: 'No response requested.' }] } })
  assert.equal(quiet[0].kind, 'note')
  const said = entriesOf({ type: 'assistant', message: { model: 'claude-sonnet-5-5', content: [{ type: 'text', text: 'Done.' }] } })
  assert.equal(said[0].kind, 'say')
})
