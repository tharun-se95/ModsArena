// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { prettyProject, defaultIcon, projectName, projectIcon, setProject, goalTitle, energy, PICKS } from './names.js'

test('projects get a display name and an icon', () => {
  assert.equal(prettyProject('acme/payments-api'), 'Payments API')
  assert.equal(prettyProject('acme/web-dashboard'), 'Web Dashboard')
  assert.equal(prettyProject('ModsArena'), 'Mods Arena')
  assert.equal(prettyProject('/home/me/state-of-the-art.git'), 'State of the Art')
  assert.equal(defaultIcon('acme/payments-api'), '💳')
  assert.equal(defaultIcon('zzqx'), defaultIcon('zzqx'), 'the same name always gets the same icon')
  assert.ok(PICKS.length % 8 === 0)
})

test('a name or icon you choose wins, and resetting goes back', () => {
  setProject('/w/pay', { name: 'Money', icon: '🦊' })
  assert.equal(projectName('/w/pay', 'acme/payments-api'), 'Money')
  assert.equal(projectIcon('/w/pay', 'acme/payments-api'), '🦊')
  setProject('/w/pay', {})
  assert.equal(projectName('/w/pay', 'acme/payments-api'), 'Payments API')
})

test('threads are titled by their goal', () => {
  assert.equal(goalTitle('Why is the build flaky?'), 'Why is the build flaky')
  assert.equal(goalTitle('/fix-issue 123'), 'Fix issue 123')
  assert.equal(goalTitle('can you please fix the `parseDate` bug in utils.ts? It breaks on Safari.'), 'Fix the parseDate bug in utils.ts')
  assert.equal(goalTitle('Hey Claude, I want you to add retries to the webhook worker. Also check logs.'), 'Add retries to the webhook worker')
  assert.equal(goalTitle('```js\nfoo()\n```\nwhat does this do?'), 'What does this do')
  assert.equal(goalTitle('please migrate every chart in the dashboard to the new design tokens', 26), 'Migrate every chart in…')
  assert.equal(goalTitle(''), '')
})

test('context reads as energy', () => {
  assert.deepEqual([0, 0.4, 0.7, 0.9].map(f => energy(f).word), ['Fresh', 'Busy', 'Getting full', 'Needs a break'])
})
