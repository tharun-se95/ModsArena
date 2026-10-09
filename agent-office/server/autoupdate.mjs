#!/usr/bin/env node
// Auto-update for the modsarena marketplace, so new versions of Agent Office
// arrive on their own. Claude Code has no command for it; it keeps the
// switch in your user settings, on the marketplace's entry:
//
//   "extraKnownMarketplaces": { "modsarena": { "source": {...}, "autoUpdate": true } }
//
// and copies it into plugins/known_marketplaces.json when a session starts
// (which is what Claude Code goes by). The /plugin menu writes only that
// second file, so both are read to say whether it's on.
//
// Setting it backs up settings.json first (like install-hooks), changes that
// one key and nothing else, and never adds a marketplace entry that isn't
// there. Node built-ins only. As a script, for the mod:
//
//   node autoupdate.mjs [status | on | off] [--json]

import { existsSync, readFileSync, writeFileSync, copyFileSync, renameSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const NAME = 'modsarena'
export const REPO = 'tharun-se95/ModsArena'
export const BACKUP = '.agent-office.bak'

export const configDir = (env = process.env) => env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude')

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value)

// Whether a marketplace entry is this repository's, whatever it was named:
// a github source for the repo, or a git URL pointing at it.
export function isOurs(name, entry) {
  if (name === NAME) return true
  const source = isObject(entry?.source) ? entry.source : {}
  const repo = String(source.repo ?? '').replace(/\.git$/, '').toLowerCase()
  if (repo === REPO.toLowerCase()) return true
  const url = String(source.url ?? '').replace(/\.git$/, '').toLowerCase()
  return url.includes(`github.com/${REPO.toLowerCase()}`) || url.includes(`github.com:${REPO.toLowerCase()}`)
}

// The name modsarena goes by in a settings object, or undefined.
export function findName(settings) {
  const known = isObject(settings?.extraKnownMarketplaces) ? settings.extraKnownMarketplaces : {}
  if (isObject(known[NAME])) return NAME
  return Object.keys(known).find(name => isObject(known[name]) && isOurs(name, known[name]))
}

// A copy of `settings` with only `autoUpdate` on `name`'s entry changed.
export function withAutoUpdate(settings, name, on) {
  const next = structuredClone(settings)
  next.extraKnownMarketplaces[name] = { ...next.extraKnownMarketplaces[name], autoUpdate: on }
  return next
}

function readJson(file) {
  if (!existsSync(file)) return undefined
  return JSON.parse(readFileSync(file, 'utf8'))
}

const projectFiles = cwd => [join(cwd, '.claude', 'settings.json'), join(cwd, '.claude', 'settings.local.json')]

// Where things stand:
//   state    'on' | 'off' | 'missing' (no modsarena marketplace in your user settings)
//   pending  set in settings but not yet picked up: it takes effect next time
//            Claude Code starts
//   name     the marketplace's name, file the user settings
//   project  when missing: a project settings file that has it instead
//   error    settings.json isn't valid JSON (nothing is written then)
export function read({ dir = configDir(), cwd = process.cwd() } = {}) {
  const file = join(dir, 'settings.json')
  let settings
  try {
    settings = readJson(file) ?? {}
  } catch (err) {
    return { state: 'missing', file, error: `${file} isn't valid JSON (${err.message})` }
  }
  const name = findName(settings)
  if (!name) {
    let project
    for (const other of projectFiles(resolve(cwd))) {
      try {
        if (findName(readJson(other))) project = other
      } catch {}
      if (project) break
    }
    return { state: 'missing', file, ...(project && { project }) }
  }
  const set = settings.extraKnownMarketplaces[name].autoUpdate
  let known
  try {
    known = readJson(join(dir, 'plugins', 'known_marketplaces.json'))?.[name]?.autoUpdate
  } catch {}
  // Settings win when they say; otherwise whatever the /plugin menu set.
  const isOn = typeof set === 'boolean' ? set : known === true
  const pending = typeof set === 'boolean' && set !== (known === true)
  return { state: isOn ? 'on' : 'off', pending, name, file }
}

// Turn it on or off. Writes only when something changes; the backup is of
// your settings before Agent Office first touched them, so it's never
// overwritten by a later run.
export function set(on, { dir = configDir(), cwd = process.cwd() } = {}) {
  const now = read({ dir, cwd })
  if (now.state === 'missing') return { ...now, changed: false }
  if (now.state === (on ? 'on' : 'off')) return { ...now, changed: false }
  const settings = readJson(now.file)
  const backup = `${now.file}${BACKUP}`
  const isFirstBackup = !existsSync(backup)
  if (isFirstBackup) copyFileSync(now.file, backup)
  const temp = `${now.file}.agent-office.tmp`
  writeFileSync(temp, `${JSON.stringify(withAutoUpdate(settings, now.name, on), null, 2)}\n`)
  renameSync(temp, now.file)
  return { ...read({ dir, cwd }), changed: true, ...(isFirstBackup && { backup }) }
}

const ADD = `claude plugin marketplace add ${REPO}`

// One plain sentence or two for a result of read() or set().
export function describe(result) {
  if (result.error) return `Couldn't read your Claude Code settings: ${result.error}. Fix it or move it aside, then try again.`
  if (result.state === 'missing') {
    return result.project
      ? `Agent Office was added for this project only (${result.project}), so auto-update isn't set up here. Turn it on from /plugin → Marketplaces → ${NAME}.`
      : `Agent Office's marketplace isn't in your Claude Code settings here (${result.file}), so there's no auto-update to switch. Add it first: ${ADD}`
  }
  const later = result.pending ? ' Takes effect next time Claude Code starts.' : ''
  if (result.state === 'on') return `${result.changed === false ? 'Auto-update is already on' : 'Auto-update is on'}: new versions of Agent Office arrive on their own.${later}`
  return `Auto-update is off${result.changed === false ? ' already' : ''}.${later} To update by hand: claude plugin update agent-office@${NAME}`
}

// Short, for status lines.
export function summary(result) {
  if (result.error) return 'Updates: can\'t tell (settings.json isn\'t valid JSON).'
  if (result.state === 'missing') return 'Updates: not set up here (Agent Office wasn\'t added from its marketplace in your user settings).'
  if (result.state === 'on') return `Updates: automatic${result.pending ? ' (from next time Claude Code starts)' : ''}.`
  return `Updates: by hand${result.pending ? ' (from next time Claude Code starts)' : ''}. /office auto-update turns them on.`
}

// The bridge's view: no file paths, just where things stand.
export const brief = result => ({ state: result.state, pending: Boolean(result.pending), ...(result.error && { error: true }) })

// As a script: `node autoupdate.mjs [status | on | off] [--json]`.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const verb = args.find(a => !a.startsWith('-')) ?? 'status'
  if (!['status', 'on', 'off'].includes(verb)) {
    console.error('Usage: node autoupdate.mjs [status | on | off] [--json]')
    process.exit(2)
  }
  const result = verb === 'status' ? read() : set(verb === 'on')
  if (args.includes('--json')) console.log(JSON.stringify({ ...result, text: describe(result), summary: summary(result) }))
  else console.log(verb === 'status' ? summary(result) : describe(result))
  if (result.error) process.exit(1)
}
