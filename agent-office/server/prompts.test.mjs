// node --test agent-office/server/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { unwrapPrompt, isEngineNote } from './prompts.mjs'

test('a plugin prompt and a message to a subagent unwrap to what was sent', () => {
  // As Claude Code 2.1.291 writes them.
  assert.deepEqual(
    unwrapPrompt('The agent-office plugin sent a message:\nReply with exactly: OK\n\nThis is how Claude Code surfaces a prompt a plugin submits between turns — it starts this turn in the user\'s place. Address the message above.'),
    { text: 'Reply with exactly: OK', from: 'agent-office' })
  assert.deepEqual(
    unwrapPrompt('The coordinator sent a message while you were working:\nWhich file?\n\nAddress this before completing your current task.', 'agent-office'),
    { text: 'Which file?', from: 'agent-office' })
  // The live event's one-line summary, cut short mid-trailer.
  assert.deepEqual(
    unwrapPrompt('The agent-office plugin sent a message: Reply with exactly: OK This is how Claude Code surfaces a pro...'),
    { text: 'Reply with exactly: OK', from: 'agent-office' })
  assert.deepEqual(
    unwrapPrompt('The agent-office plugin sent a message: Reply with exactly: OK This is how ...'),
    { text: 'Reply with exactly: OK', from: 'agent-office' })
  // A message that happens to say "This is how" keeps it.
  assert.deepEqual(
    unwrapPrompt('The agent-office plugin sent a message:\nThis is how we deploy, right?\n\nThis is how Claude Code surfaces a prompt a plugin submits between turns.'),
    { text: 'This is how we deploy, right?', from: 'agent-office' })
  // Anything else is left alone.
  assert.deepEqual(unwrapPrompt('Why is the build flaky?'), { text: 'Why is the build flaky?' })
})

test('engine notes are told apart from prompts', () => {
  assert.equal(isEngineNote('<task-notification> <task-id>a1</task-id>'), true)
  assert.equal(isEngineNote('Fix the <div> layout'), false)
  assert.equal(isEngineNote(undefined), false)
})
