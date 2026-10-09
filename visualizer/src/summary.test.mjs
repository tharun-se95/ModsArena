// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { summarize, plainWords, why, gerund, MAX } from './summary.js'

const read = path => ({ tool: 'Read', summary: path, ok: true })
const bash = (cmd, ok = true) => ({ tool: 'Bash', summary: cmd, ok })

test('working on a checklist step: the step, where it is, and what came before', () => {
  assert.equal(
    summarize({ state: 'working', goal: 'Add refunds to checkout', step: 'Writing tests for the refund flow', done: 2, total: 5, last: read('src/payments/charge.ts') }),
    'Writing tests for the refund flow (step 3 of 5), after reading the payment code.')
  // A running tool says what it's doing now instead.
  assert.equal(
    summarize({ state: 'working', step: 'Writing tests for the refund flow', done: 2, total: 5, doing: bash('npm test') }),
    'Writing tests for the refund flow (step 3 of 5), now checking the tests.')
})

test('working without a checklist: what it is doing and why', () => {
  assert.equal(summarize({ state: 'working', goal: 'Fix the stale cache key', doing: { tool: 'Edit', summary: 'src/cache/key.ts' } }),
    'Changing the caching code to fix the stale cache key.')
  assert.equal(summarize({ state: 'working', goal: 'Harden the session handling', helpers: 2 }),
    'Working with 2 helpers to harden the session handling.')
  assert.equal(summarize({ state: 'working', goal: 'Harden the session handling', helpers: 1 }),
    'Working with a helper to harden the session handling.')
  assert.equal(summarize({ state: 'working', last: read('README.md') }), 'Thinking it over after reading the readme.')
  assert.equal(summarize({ state: 'working', goal: 'Tidy the docs' }), 'Getting ready to tidy the docs.')
  assert.equal(summarize({ state: 'working', goal: 'Why is CI red' }), 'Getting started on “Why is CI red”.')
  assert.equal(summarize({ state: 'working' }), 'Getting started.')
})

test('a goal that is not something to do is quoted, not bent into "to"', () => {
  assert.equal(why('Fix the build'), 'to fix the build')
  assert.equal(why('Why is the build flaky'), 'on “Why is the build flaky”')
  assert.equal(why(''), '')
})

test('waiting on you: a question, an OK or a plan', () => {
  assert.equal(summarize({ state: 'asking', ask: { type: 'question', question: 'Should retries also back off on 429s?' } }),
    'Asks you: Should retries also back off on 429s?')
  assert.equal(summarize({ state: 'asking', ask: { type: 'permission', tool: 'Bash', summary: 'git push origin main' } }),
    'Waiting for your OK to send the changes up.')
  assert.equal(summarize({ state: 'asking', goal: 'Migrate charts to the new tokens', ask: { type: 'plan' } }),
    'Has a plan for you to approve, to migrate charts to the new tokens.')
  // A question too long for the line falls back to saying there is one.
  const long = summarize({ state: 'asking', ask: { type: 'question', question: 'x '.repeat(80) }, done: 1, total: 4 })
  assert.equal(long, 'Has a question for you at step 2 of 4.')
})

test('blocked: what stopped it', () => {
  assert.equal(summarize({ state: 'stuck', last: bash('npm test', false) }), 'Stopped: couldn’t check the tests; needs a look.')
  assert.equal(summarize({ state: 'stuck', last: read('README.md') }), 'Stopped after reading the readme; needs a look.')
  assert.equal(summarize({ state: 'stuck' }), 'Stopped before finishing; needs a look.')
})

test('done for now and finished: what it made', () => {
  assert.equal(summarize({ state: 'waiting', total: 5, done: 5, made: [{ type: 'pr', title: 'Fix stale cache key' }] }),
    'All 5 steps done and made a pull request (“Fix stale cache key”); over to you.')
  assert.equal(summarize({ state: 'waiting', made: [{ type: 'artifact', title: 'Refund flow test report' }] }),
    'Made a page (“Refund flow test report”); over to you.')
  assert.equal(summarize({ state: 'waiting', done: 2, total: 5, last: bash('npm test') }),
    'Paused at step 3 of 5 after checking the tests; over to you.')
  assert.equal(summarize({ state: 'waiting' }), 'Ready for you.')
  assert.equal(summarize({ state: 'ended', total: 3, done: 3 }), 'Finished all 3 steps.')
  assert.equal(summarize({ state: 'ended', last: bash('npm test') }), 'Ended after checking the tests.')
  assert.equal(summarize({ state: 'ended' }), 'Ended.')
})

test('no jargon in plain words; Developer view keeps it', () => {
  assert.equal(plainWords('Update `src/auth/session.ts` to rotate tokens'), 'Update the sign-in code to rotate tokens')
  assert.equal(plainWords('Fix the typo in README.md.'), 'Fix the typo in the readme')
  assert.equal(plainWords('Update `src/auth/session.ts`', true), 'Update `src/auth/session.ts`')
  const plain = summarize({ state: 'working', step: 'Update `src/auth/session.ts` to rotate tokens', done: 1, total: 3, doing: { tool: 'Edit', summary: 'src/auth/session.ts' } })
  assert.doesNotMatch(plain, /[`/]|\.ts\b/)
  const dev = summarize({ state: 'working', dev: true, step: 'Rotate tokens', done: 1, total: 3, doing: { tool: 'Edit', summary: 'src/auth/session.ts' } })
  assert.equal(dev, 'Rotate tokens (step 2 of 3), now Edit src/auth/session.ts.')
})

test('every line stays short, whatever it is given', () => {
  const big = 'Refactor the whole payment reconciliation pipeline so that every ledger entry is double checked against the bank export'
  const states = ['working', 'asking', 'stuck', 'waiting', 'ended']
  for (const state of states) {
    for (const dev of [false, true]) {
      const s = summarize({
        state, dev, goal: big, step: big, done: 3, total: 9, helpers: 4,
        doing: { tool: 'Bash', summary: `npm run build -- --filter ${big}` }, last: read(`src/${'deep/'.repeat(12)}ledger.ts`),
        ask: { type: 'question', question: big }, made: [{ type: 'pr', title: big }],
      })
      assert.ok(s.length <= MAX, `${state}${dev ? ' (dev)' : ''}: ${s.length} ${s}`)
      assert.match(s, /^[A-Z“]/)
      assert.match(s, /[.?…]$/)
    }
  }
})

test('a checklist item written as an order reads as what it is doing', () => {
  assert.equal(gerund('Run the suite'), 'Running the suite')
  assert.equal(gerund('Write tests for refunds'), 'Writing tests for refunds')
  assert.equal(gerund('Fix the cache key'), 'Fixing the cache key')
  assert.equal(gerund('Update the docs'), 'Updating the docs')
  assert.equal(gerund('Plan the migration'), 'Planning the migration')
  assert.equal(gerund('Writing tests'), 'Writing tests')
  assert.equal(gerund('Payment edge cases'), 'Payment edge cases')
  assert.equal(summarize({ state: 'working', step: 'Run the suite', done: 2, total: 3 }), 'Running the suite (step 3 of 3).')
  assert.equal(summarize({ state: 'asking', goal: 'Why is CI red', ask: { type: 'plan' } }), 'Has a plan for you to approve.')
})
