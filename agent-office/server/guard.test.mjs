// node --test agent-office/server/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isOwnHost, isOwnOrigin, tokenMatches, refusal, newToken } from './guard.mjs'
import { send, take, settle, reset } from './chat.mjs'

const req = (method, headers) => ({ method, headers })

test('only requests addressed to the bridge itself get through', () => {
  assert.ok(isOwnHost('127.0.0.1:7337', 7337))
  assert.ok(isOwnHost('localhost:7337', 7337))
  assert.ok(!isOwnHost('evil.example:7337', 7337), 'a rebound hostname')
  assert.ok(!isOwnHost('127.0.0.1:8000', 7337))
  assert.ok(!isOwnHost(undefined, 7337))
  assert.equal(refusal(req('GET', { host: 'attacker.test:7337' }), 7337), 'unexpected Host')
  assert.equal(refusal(req('GET', { host: '127.0.0.1:7337', origin: 'https://evil.example' }), 7337), undefined, 'reads are fine: the browser hides the answer')
})

test('a browser may only change things from the office page itself', () => {
  assert.ok(isOwnOrigin('http://127.0.0.1:7337', 7337))
  assert.ok(!isOwnOrigin('https://evil.example', 7337))
  assert.equal(refusal(req('POST', { host: '127.0.0.1:7337', origin: 'https://evil.example' }), 7337), 'unexpected Origin')
  assert.equal(refusal(req('POST', { host: '127.0.0.1:7337', origin: 'http://127.0.0.1:7337' }), 7337), undefined)
  assert.equal(refusal(req('POST', { host: '127.0.0.1:7337' }), 7337), undefined, 'hooks and the mod send no Origin')
})

test('the token must match exactly', () => {
  const token = newToken()
  assert.ok(tokenMatches(token, token))
  assert.ok(!tokenMatches(token.slice(1), token))
  assert.ok(!tokenMatches(undefined, token))
  assert.notEqual(newToken(), token)
})

test('chat messages queue for their session, are taken once, then settle', () => {
  reset()
  assert.ok(send({ session: '../etc', text: 'hi' }).error)
  assert.ok(send({ session: 's1', text: '   ' }).error)
  assert.ok(send({ session: 's1', text: 'x'.repeat(5000) }).error)
  const a = send({ session: 's1', text: ' run the tests ' }).message
  const b = send({ session: 's1', agent: 'agent-7', text: 'stop after this file' }).message
  send({ session: 's2', text: 'not yours' })
  assert.equal(a.text, 'run the tests')
  assert.deepEqual(take('s1').map(m => m.id), [a.id, b.id])
  assert.deepEqual(take('s1'), [], 'taken only once')
  assert.equal(take('s1').length, 0)
  assert.equal(settle(b.id, true).status, 'delivered')
  assert.equal(take('s2').length, 1)
})
