// node --test visualizer/src/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NAMES, nameFor, roleOf, who } from './critters.js'

test('names are unique, short and pronounceable', () => {
  assert.equal(new Set(NAMES).size, NAMES.length)
  for (const name of NAMES) assert.match(name, /^[A-Z][a-z]{1,6}$/)
})

test('the same id always gets the same name, and ids spread across the list', () => {
  assert.equal(nameFor('session-abc'), nameFor('session-abc'))
  const seen = new Set(Array.from({ length: 200 }, (_, i) => nameFor(`id-${i}`)))
  assert.ok(seen.size > NAMES.length * 0.7)
})

test('roles follow the agent type, sessions lead', () => {
  assert.equal(roleOf('Explore'), 'Researcher')
  assert.equal(roleOf('Plan'), 'Planner')
  assert.equal(roleOf('code-reviewer'), 'Reviewer')
  assert.equal(roleOf('test-runner'), 'Tester')
  assert.equal(roleOf('general-purpose'), 'Builder')
  assert.equal(roleOf('my-custom-agent'), 'Helper')
  assert.equal(who({ kind: 'session', session: 's1' }).role, 'Lead')
  assert.match(who({ kind: 'session', session: 's1' }).title, /^[A-Z][a-z]+ the Lead$/)
})

test('a thread never has two of the same name, and a name its lead gave stays', () => {
  for (let s = 0; s < 5; s++) {
    const names = [nameFor(`s${s}`)]
    for (let i = 0; i < 40; i++) {
      const a = who({ kind: 'agent', session: `s${s}`, agent: `a${i}`, type: 'Explore' })
      assert.equal(a.title, `${a.name} the Researcher`)
      names.push(a.name)
    }
    assert.equal(new Set(names).size, names.length)
    // Asking again gives the same answer.
    assert.equal(who({ kind: 'agent', session: `s${s}`, agent: 'a3', type: 'Explore' }).name, names[4])
  }
  assert.equal(who({ kind: 'agent', session: 's', agent: 'a', type: 'Plan', name: 'scout' }).title, 'scout the Planner')
})
