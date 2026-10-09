// node --test agent-office/server/*.test.mjs
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { track, answer, wait, isOpen, reset } from './asks.mjs'

const question = { header: 'Backoff', question: 'Back off on 429s?', options: [{ label: 'Yes' }, { label: 'No' }] }
const openAsk = (fields = {}) => track({ kind: 'ask.open', session: 's1', id: 'toolu_1', type: 'question', questions: [question], answerable: true, ...fields })

beforeEach(reset)

test('only an ask its session can take an answer for is open here', () => {
  openAsk({ answerable: undefined })
  assert.equal(isOpen('s1', 'toolu_1'), false)
  assert.equal(answer({ session: 's1', id: 'toolu_1', answers: { 'Back off on 429s?': 'Yes' } }).status, 404)
  openAsk()
  assert.equal(isOpen('s1', 'toolu_1'), true)
  track({ kind: 'ask.close', session: 's1', id: 'toolu_1' })
  assert.equal(isOpen('s1', 'toolu_1'), false)
})

test('a wait gives the ask a moment to arrive', async () => {
  const waiting = wait('s1', 'toolu_1', 1000, 1000)
  openAsk()
  answer({ session: 's1', id: 'toolu_1', answers: { 'Back off on 429s?': 'No' } })
  assert.deepEqual((await waiting).answer, { answers: { 'Back off on 429s?': 'No' } })
})

test('an answer reaches the waiting session once, checked against its questions', async () => {
  openAsk()
  const waiting = wait('s1', 'toolu_1', 1000)
  assert.equal(answer({ session: 's1', id: 'toolu_1', answers: { 'Something else?': 'Yes' } }).status, 400, 'not one of its questions')
  assert.equal(answer({ session: '../x', id: 'toolu_1' }).status, 400)
  const ok = answer({ session: 's1', id: 'toolu_1', answers: { 'Back off on 429s?': ' Yes ' }, note: 'and log it' })
  assert.equal(ok.status, 200)
  assert.deepEqual((await waiting).answer, { answers: { 'Back off on 429s?': 'Yes' }, note: 'and log it' })
  assert.equal(answer({ session: 's1', id: 'toolu_1', answers: { 'Back off on 429s?': 'No' } }).status, 409, 'answered already')
  // Asking again before the ask closes still gets it.
  assert.deepEqual((await wait('s1', 'toolu_1', 10)).answer.answers, { 'Back off on 429s?': 'Yes' })
})

test('a wait ends empty on its timeout, and as closed when answered in the terminal', async () => {
  openAsk()
  assert.deepEqual(await wait('s1', 'toolu_1', 10), {})
  const waiting = wait('s1', 'toolu_1', 1000)
  track({ kind: 'ask.close', session: 's1', id: 'toolu_1' })
  assert.deepEqual(await waiting, { closed: true })
  assert.deepEqual(await wait('s1', 'nope', 10, 0), { closed: true })
})

test('a plan can only be sent back from the office, with a note', () => {
  track({ kind: 'ask.open', session: 's1', id: 'toolu_2', type: 'plan', plan: '# Plan', answerable: true })
  assert.equal(answer({ session: 's1', id: 'toolu_2', choice: 'approve' }).status, 400)
  assert.deepEqual(answer({ session: 's1', id: 'toolu_2', choice: 'keep', note: 'Smaller steps' }).answer, { choice: 'keep', note: 'Smaller steps' })
})
