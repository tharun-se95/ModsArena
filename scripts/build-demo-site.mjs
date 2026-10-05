#!/usr/bin/env node
// Builds the hosted demo: the office page as one self-contained file that
// plays sample activity, with no bridge behind it. GitHub Pages serves it
// (.github/workflows/pages.yml).
//
//   node scripts/build-demo-site.mjs [out dir, default: site]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = process.argv[2] ?? join(root, 'site')
const pub = join(root, 'agent-office', 'server', 'public')

const html = readFileSync(join(pub, 'index.html'), 'utf8')
const app = readFileSync(join(pub, 'app.js'), 'utf8').replaceAll('</script', '<\\/script')
const tag = '<script type="module" src="/app.js"></script>'
if (!html.includes(tag)) throw new Error(`index.html no longer loads ${tag}; update this script`)

// A function, not a string: in a replacement string `$$`, `$&` and `$'` are
// patterns, and the bundle is full of `$`.
const page = html.replace(tag, () => `<script>window.AGENT_OFFICE_DEMO = true</script>\n<script type="module">\n${app}\n</script>`)
if (!page.includes(app)) throw new Error('the bundle did not land in the page verbatim')
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'index.html'), page)
writeFileSync(join(out, '.nojekyll'), '')
console.log(`Wrote ${join(out, 'index.html')} (${Math.round(page.length / 1024)} kB)`)
