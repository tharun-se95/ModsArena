#!/usr/bin/env node
// One version everywhere: the plugin manifest, the marketplace (its own and
// the plugin's entry), and both package.json files, with a CHANGELOG.md
// section for it. The release workflow uses this to check a tag and to take
// the release notes.
//
//   node scripts/version.mjs check [v0.2.1]   every manifest agrees (and with the tag)
//   node scripts/version.mjs notes 0.2.1      that version's CHANGELOG.md section

import { readFileSync } from 'node:fs'
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
    '.claude-plugin/marketplace.json (agent-office)': market.plugins.find(p => p.name === 'agent-office')?.version,
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
  if (unique.length !== 1) out.push(`versions disagree: ${Object.entries(found).map(([file, v]) => `${file}=${v}`).join(', ')}`)
  const version = unique[0]
  if (tag && tag.replace(/^v/, '') !== version) out.push(`tag ${tag} doesn't match the version ${version}`)
  if (!notes(version)) out.push(`CHANGELOG.md has no "## ${version}" section`)
  return out
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
  } else {
    console.error('Usage: node scripts/version.mjs check [tag] | notes <version>')
    process.exit(1)
  }
}
