#!/usr/bin/env node
// One version everywhere: the plugin manifest, the marketplace's own, and
// both package.json files, with a CHANGELOG.md section for it. The plugin's
// marketplace entry carries no version: Claude Code reads plugin.json first
// and silently ignores the entry's when they differ, so it lives there only. The release workflow uses this to check a tag and to take
// the release notes.
//
//   node scripts/version.mjs check [v0.2.1]   every manifest agrees (and with the tag)
//   node scripts/version.mjs notes 0.2.1      that version's CHANGELOG.md section
//   node scripts/version.mjs bumped <base>     a change to what users install
//                                               bumps the version past <base>'s
//   node scripts/version.mjs set 0.2.1        write it into every manifest and lockfile

import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = file => readFileSync(join(root, file), 'utf8')
const json = file => JSON.parse(read(file))

export function versions() {
  const market = json('.claude-plugin/marketplace.json')
  return {
    'agent-office/.claude-plugin/plugin.json': json('agent-office/.claude-plugin/plugin.json').version,
    '.claude-plugin/marketplace.json (metadata)': market.metadata?.version,
    'package.json': json('package.json').version,
    'visualizer/package.json': json('visualizer/package.json').version,
  }
}

// The text under "## <version>" up to the next "## ", trimmed.
export function notes(version, changelog = read('CHANGELOG.md')) {
  const lines = changelog.split('\n')
  const start = lines.findIndex(line => line.trim() === `## ${version}`)
  if (start < 0) return null
  const end = lines.findIndex((line, i) => i > start && line.startsWith('## '))
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n').trim()
}

// Problems with the versions as they stand, or with `tag` against them.
export function problems(tag) {
  const found = versions()
  const unique = [...new Set(Object.values(found))]
  const out = []
  const entry = json('.claude-plugin/marketplace.json').plugins.find(p => p.name === 'agent-office')
  if (entry?.version !== undefined) out.push('.claude-plugin/marketplace.json: the agent-office entry sets "version"; keep it in plugin.json only')
  if (unique.length !== 1) out.push(`versions disagree: ${Object.entries(found).map(([file, v]) => `${file}=${v}`).join(', ')}`)
  const version = unique[0]
  if (tag && tag.replace(/^v/, '') !== version) out.push(`tag ${tag} doesn't match the version ${version}`)
  if (!notes(version)) out.push(`CHANGELOG.md has no "## ${version}" section`)
  return out
}

// Every place the version is written, and how many "version" keys from the
// top of it are ours (a lockfile's root and its root package). Only those
// strings change, so each file keeps its own formatting.
const PLACES = [
  ['agent-office/.claude-plugin/plugin.json', 1],
  ['.claude-plugin/marketplace.json', 1],
  ['package.json', 1],
  ['visualizer/package.json', 1],
  ['visualizer/package-lock.json', 2],
]

export function setVersion(version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`${version} isn't a version like 1.2.3`)
  for (const [file, count] of PLACES) {
    let left = count
    const text = read(file).replace(/"version": "[^"]*"/g, found => left-- > 0 ? `"version": "${version}"` : found)
    writeFileSync(join(root, file), text)
  }
  return PLACES.map(([file]) => file)
}

// Whether version `a` is newer than `b` (x.y.z).
export function isNewer(a, b) {
  const [pa, pb] = [a, b].map(v => String(v).split('.').map(Number))
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0)
  return false
}

// What users install: the plugin (the marketplace serves it from main, so
// a merge is a release to anyone with auto-update on) and the page's source.
export const SHIPPED = ['agent-office', 'visualizer/src', '.claude-plugin']

// Why this change needs a higher version than `base`'s, or null when fine.
export function bumpProblem(base, git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' })) {
  const changed = git(['diff', '--name-only', `${base}...HEAD`, '--', ...SHIPPED]).trim()
  if (!changed) return null
  const before = JSON.parse(git(['show', `${base}:agent-office/.claude-plugin/plugin.json`])).version
  const now = json('agent-office/.claude-plugin/plugin.json').version
  if (isNewer(now, before)) return null
  return `This changes what users install (${changed.split('\n').slice(0, 3).join(', ')}${changed.split('\n').length > 3 ? ', …' : ''}) but the version is still ${now}. Bump it past ${before} in every manifest, with a CHANGELOG.md section, or users with auto-update never get it.`
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, arg] = process.argv.slice(2)
  if (command === 'check') {
    const found = problems(arg)
    if (found.length) { for (const p of found) console.error(p); process.exit(1) }
    console.log(Object.values(versions())[0])
  } else if (command === 'notes' && arg) {
    const text = notes(arg.replace(/^v/, ''))
    if (!text) { console.error(`CHANGELOG.md has no "## ${arg}" section`); process.exit(1) }
    console.log(text)
  } else if (command === 'bumped' && arg) {
    const problem = bumpProblem(arg)
    if (problem) { console.error(problem); process.exit(1) }
    console.log('Version is fine for this change.')
  } else if (command === 'set' && arg) {
    for (const file of setVersion(arg.replace(/^v/, ''))) console.log(`${file}: ${arg}`)
    if (!notes(arg.replace(/^v/, ''))) console.log(`Now add a "## ${arg.replace(/^v/, '')}" section to CHANGELOG.md.`)
  } else {
    console.error('Usage: node scripts/version.mjs check [tag] | notes <version> | bumped <base> | set <version>')
    process.exit(1)
  }
}
