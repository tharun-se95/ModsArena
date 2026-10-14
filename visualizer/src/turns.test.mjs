import { test } from 'node:test'
import assert from 'node:assert/strict'
import { turnsOf, isLong } from './turns.js'

const you = text => ({ kind: 'you', text })
const say = text => ({ kind: 'say', text })
const tool = id => ({ kind: 'tool', id, name: 'Read' })

test('each prompt starts a turn: notes and tool calls fold, the answer stands', () => {
  const entries = [
    { kind: 'note', text: 'Ran /office' },
    you('Fill the env'),
    say("I'll look first."), tool('a'), tool('b'),
    say('Copying now.'), tool('c'),
    { kind: 'output', output: {} },
    say('Done: 38 of 65.'),
    you('Load the 13'),
    say('Loading.'), tool('d'),
    say('Done.'),
  ]
  const results = new Map([['a', {}], ['b', {}], ['c', {}], ['d', {}]])
  const turns = turnsOf(entries, results)
  assert.equal(turns.length, 3)
  // Before any prompt: just the note.
  assert.equal(turns[0].prompt, null)
  assert.deepEqual(turns[0].extras.map(e => e.kind), ['note'])
  assert.equal(turns[1].prompt.text, 'Fill the env')
  assert.deepEqual(turns[1].work.map(e => e.text ?? e.id), ["I'll look first.", 'a', 'b', 'Copying now.', 'c'])
  assert.deepEqual(turns[1].extras.map(e => e.kind), ['output'])
  assert.equal(turns[1].reply.text, 'Done: 38 of 65.')
  assert.equal(turns[2].reply.text, 'Done.')
  assert.equal(turns[2].running, false)
})

test('a turn still working has no answer yet, and says so', () => {
  const turns = turnsOf([you('Go'), say('Looking.'), tool('a'), tool('b')], new Map([['a', {}]]))
  assert.equal(turns[0].reply, null)
  assert.equal(turns[0].running, true)
  assert.equal(turns[0].work.length, 3)
})

test('words before a tool call are a note, not the answer', () => {
  const turns = turnsOf([you('Go'), say('First I will check.'), tool('a')], new Map([['a', {}]]))
  assert.equal(turns[0].reply, null)
  assert.equal(turns[0].running, false)
})

test('a long answer folds when it is not the latest', () => {
  assert.equal(isLong({ text: 'x'.repeat(701) }), true)
  assert.equal(isLong({ text: 'short' }), false)
  assert.equal(isLong(null), false)
})
