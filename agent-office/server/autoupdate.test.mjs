// node --test agent-office/server/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { read, set, isOurs, findName, describe, summary, brief, configDir } from './autoupdate.mjs'

const github = { source: { source: 'github', repo: 'tharun-se95/ModsArena' } }
const yours = {
  model: 'sonnet',
  permissions: { allow: ['Bash(npm test)'] },
  extraKnownMarketplaces: { other: { source: { source: 'github', repo: 'someone/else' } }, modsarena: github },
  enabledPlugins: { 'agent-office@modsarena': true },
}

function fixture(settings, known) {
  const dir = mkdtempSync(join(tmpdir(), 'ao-autoupdate-'))
  const cwd = mkdtempSync(join(tmpdir(), 'ao-project-'))
  if (settings !== undefined) writeFileSync(join(dir, 'settings.json'), typeof settings === 'string' ? settings : JSON.stringify(settings, null, 2))
  if (known) {
    mkdirSync(join(dir, 'plugins'))
    writeFileSync(join(dir, 'plugins', 'known_marketplaces.json'), JSON.stringify(known))
  }
  return { dir, cwd }
}
const settingsOf = dir => JSON.parse(readFileSync(join(dir, 'settings.json'), 'utf8'))

test('isOurs and findName know the marketplace by name or by its repository', () => {
  assert.ok(isOurs('modsarena', {}))
  assert.ok(isOurs('mine', { source: { source: 'github', repo: 'Tharun-SE95/modsarena' } }))
  assert.ok(isOurs('mine', { source: { source: 'git', url: 'https://github.com/tharun-se95/ModsArena.git' } }))
  assert.ok(!isOurs('other', { source: { source: 'github', repo: 'someone/else' } }))
  assert.equal(findName(yours), 'modsarena')
  assert.equal(findName({ extraKnownMarketplaces: { mine: github } }), 'mine')
  assert.equal(findName({ extraKnownMarketplaces: { other: yours.extraKnownMarketplaces.other } }), undefined)
  assert.equal(findName({}), undefined)
  assert.equal(findName(null), undefined)
})

test('configDir follows CLAUDE_CONFIG_DIR', () => {
  assert.equal(configDir({ CLAUDE_CONFIG_DIR: '/x/cfg' }), '/x/cfg')
  assert.ok(configDir({}).endsWith('.claude'))
})

test('turning it on backs up, changes that one key and nothing else', () => {
  const at = fixture(yours)
  const before = readFileSync(join(at.dir, 'settings.json'), 'utf8')
  assert.equal(read(at).state, 'off')
  const result = set(true, at)
  assert.equal(result.state, 'on')
  assert.equal(result.pending, true) // Claude Code picks it up next start
  assert.equal(result.changed, true)
  assert.equal(readFileSync(result.backup, 'utf8'), before)
  const after = settingsOf(at.dir)
  assert.deepEqual(after, { ...yours, extraKnownMarketplaces: { ...yours.extraKnownMarketplaces, modsarena: { ...github, autoUpdate: true } } })
  assert.deepEqual(Object.keys(after), Object.keys(yours)) // key order kept
  assert.ok(!readdirSync(at.dir).some(f => f.endsWith('.tmp')))
})

test('a second change keeps the first backup', () => {
  const at = fixture(yours)
  const before = readFileSync(join(at.dir, 'settings.json'), 'utf8')
  set(true, at)
  const off = set(false, at)
  assert.equal(off.state, 'off')
  assert.equal(off.backup, undefined)
  assert.equal(readFileSync(join(at.dir, `settings.json.agent-office.bak`), 'utf8'), before)
  assert.equal(settingsOf(at.dir).extraKnownMarketplaces.modsarena.autoUpdate, false)
})

test('nothing is written when it is already as asked', () => {
  const at = fixture({ extraKnownMarketplaces: { modsarena: { ...github, autoUpdate: true } } }, { modsarena: { ...github, autoUpdate: true } })
  const result = set(true, at)
  assert.deepEqual([result.state, result.pending, result.changed], ['on', false, false])
  assert.ok(!existsSync(join(at.dir, 'settings.json.agent-office.bak')))
  assert.match(describe(result), /already on/)
})

test('turned on from the /plugin menu counts as on', () => {
  const at = fixture(yours, { modsarena: { ...github, autoUpdate: true } })
  assert.deepEqual([read(at).state, read(at).pending], ['on', false])
})

test('a marketplace added under another name is found by its repository', () => {
  const at = fixture({ extraKnownMarketplaces: { 'my-mods': github } })
  assert.equal(set(true, at).name, 'my-mods')
  assert.equal(settingsOf(at.dir).extraKnownMarketplaces['my-mods'].autoUpdate, true)
})

test('no entry: says so and invents none', () => {
  for (const settings of [undefined, {}, { extraKnownMarketplaces: { other: yours.extraKnownMarketplaces.other } }]) {
    const at = fixture(settings)
    const result = set(true, at)
    assert.equal(result.state, 'missing')
    assert.equal(result.changed, false)
    assert.match(describe(result), /isn't in your Claude Code settings here/)
    assert.match(summary(result), /not set up here/)
    if (settings === undefined) assert.ok(!existsSync(join(at.dir, 'settings.json')))
    else assert.deepEqual(settingsOf(at.dir), settings)
  }
})

test('added for one project only: points there and changes nothing', () => {
  const at = fixture({})
  mkdirSync(join(at.cwd, '.claude'))
  writeFileSync(join(at.cwd, '.claude', 'settings.json'), JSON.stringify({ extraKnownMarketplaces: { modsarena: github } }))
  const result = set(true, at)
  assert.equal(result.state, 'missing')
  assert.equal(result.project, join(at.cwd, '.claude', 'settings.json'))
  assert.match(describe(result), /this project only/)
  assert.deepEqual(settingsOf(at.dir), {})
})

test('settings that are not JSON are left alone', () => {
  const at = fixture('{ "model": ')
  const result = set(true, at)
  assert.ok(result.error)
  assert.equal(readFileSync(join(at.dir, 'settings.json'), 'utf8'), '{ "model": ')
  assert.match(describe(result), /Couldn't read your Claude Code settings/)
  assert.deepEqual(brief(result), { state: 'missing', pending: false, error: true })
})

test('the words', () => {
  assert.equal(summary({ state: 'on', pending: false }), 'Updates: automatic.')
  assert.equal(summary({ state: 'on', pending: true }), 'Updates: automatic (from next time Claude Code starts).')
  assert.match(summary({ state: 'off' }), /by hand.*\/office auto-update/)
  assert.match(describe({ state: 'on', pending: true, changed: true }), /^Auto-update is on: .*Takes effect next time Claude Code starts\.$/)
  assert.match(describe({ state: 'off', changed: true }), /claude plugin update agent-office@modsarena/)
  assert.deepEqual(brief({ state: 'on', pending: true, file: '/secret/path' }), { state: 'on', pending: true })
})

test('as a script: status, on and off, with --json for the mod', () => {
  const at = fixture(yours)
  const script = fileURLToPath(new URL('./autoupdate.mjs', import.meta.url))
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { cwd: at.cwd, env: { ...process.env, CLAUDE_CONFIG_DIR: at.dir }, encoding: 'utf8' })
  assert.match(run().stdout, /^Updates: by hand/)
  const on = JSON.parse(run('on', '--json').stdout)
  assert.equal(on.state, 'on')
  assert.match(on.text, /Auto-update is on/)
  assert.equal(settingsOf(at.dir).extraKnownMarketplaces.modsarena.autoUpdate, true)
  assert.equal(run('sideways').status, 2)
})
