#!/usr/bin/env node
// agent-office: start the office's bridge and open it, try it with sample
// activity, check on it, or wire Claude Code's settings hooks to it (for
// Claude Code builds without mods). Node built-ins only.
//
//   npx github:tharun-se95/ModsArena            start the bridge and open the office
//   npx github:tharun-se95/ModsArena demo       the same with sample activity
//   npx github:tharun-se95/ModsArena status     is a bridge running, and what has it seen
//   npx github:tharun-se95/ModsArena install-hooks [--project]
//   npx github:tharun-se95/ModsArena uninstall-hooks [--project]
//   npx github:tharun-se95/ModsArena auto-update [on|off]   new versions arrive on their own
//
//   --port N    the bridge's port (7337; the demo uses 7338 so it never mixes
//               with your real sessions)
//   --no-open   don't open a browser

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addHooks, removeHooks, hasHooks } from './settings-hooks.mjs'
import * as autoUpdate from './autoupdate.mjs'

// Node 18 or newer, said plainly (older ones fail with a cryptic error).
if (Number(process.versions.node.split('.')[0]) < 18) {
  console.error(`Agent Office needs Node 18 or newer, a free program it runs on; this computer has an older one (v${process.versions.node}). Install the LTS version from https://nodejs.org, then try again.`)
  process.exit(1)
}

const args = process.argv.slice(2)
const command = args.find(a => !a.startsWith('-')) ?? 'open'
const flag = name => args.includes(`--${name}`)
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const isDemo = command === 'demo'
const port = Number(option('port', process.env.AGENT_OFFICE_PORT ?? (isDemo ? 7338 : 7337)))
const url = `http://127.0.0.1:${port}`
const here = dirname(fileURLToPath(import.meta.url))

async function health() {
  try {
    const res = await fetch(`${url}/healthz`, { signal: AbortSignal.timeout(1500) })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

function openBrowser(target) {
  if (flag('no-open')) return
  const [cmd, ...rest] = process.platform === 'darwin' ? ['open', target]
    : process.platform === 'win32' ? ['cmd', '/c', 'start', '""', target]
      : ['xdg-open', target]
  try {
    spawn(cmd, rest, { stdio: 'ignore', detached: true }).on('error', () => {}).unref()
  } catch {}
}

// Run the bridge in this process (Ctrl+C stops it), then open the page.
async function serve() {
  const running = await health()
  if (running) {
    if (isDemo && !running.demo) {
      console.log(`A bridge is already running on ${url}. Pick another port for the demo: --port ${port + 1}`)
      process.exit(1)
    }
    console.log(`Agent Office is already running at ${url}`)
    openBrowser(url)
    return
  }
  process.argv = [process.argv[0], join(here, 'server.mjs'), '--port', String(port), ...(isDemo ? ['--demo'] : [])]
  await import('./server.mjs')
  for (let i = 0; i < 40 && !(await health()); i++) await new Promise(r => setTimeout(r, 100))
  console.log(isDemo
    ? `Playing sample activity at ${url} (Ctrl+C to stop)`
    : `Agent Office is open at ${url}. Leave this running; Ctrl+C stops it.`)
  openBrowser(url)
}

async function status() {
  const running = await health()
  if (running) console.log(`Bridge: running on ${url}, ${running.events} events so far, ${running.viewers} page${running.viewers === 1 ? '' : 's'} open.`)
  else console.log(`Bridge: not running on ${url}. Start it with: npx github:tharun-se95/ModsArena`)
  for (const [where, file] of settingsFiles()) {
    if (!existsSync(file)) continue
    const settings = readSettings(file)
    if (hasHooks(settings)) console.log(`Settings hooks: installed in your ${where} settings (${file}).`)
  }
  console.log(autoUpdate.summary(autoUpdate.read()))
}

// Auto-update for the plugin's marketplace (autoupdate.mjs): on unless you
// say off.
function setAutoUpdate() {
  const word = args.filter(a => !a.startsWith('-'))[1] ?? 'on'
  if (word !== 'on' && word !== 'off') {
    console.error('Usage: agent-office auto-update [on | off]')
    process.exit(1)
  }
  const result = autoUpdate.set(word === 'on')
  if (result.backup) console.log(`Backed up ${result.file} to ${result.backup}`)
  console.log(autoUpdate.describe(result))
  if (result.state === 'missing') process.exit(1)
}

// ---------------------------------------------------------------------------
// Settings hooks

function settingsFiles() {
  const userDir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude')
  return [['user', join(userDir, 'settings.json')], ['project', resolve('.claude', 'settings.json')]]
}

function readSettings(file) {
  if (!existsSync(file)) return {}
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (err) {
    console.error(`Couldn't read ${file} as JSON (${err.message}). Fix it or move it aside, then try again.`)
    process.exit(1)
  }
}

// The backup is of your settings as they were before this tool first
// touched them, so it's never overwritten by a later run.
function writeSettings(file, settings) {
  if (existsSync(file)) {
    if (!hasHooks(readSettings(file))) {
      copyFileSync(file, `${file}.agent-office.bak`)
      console.log(`Backed up ${file} to ${file}.agent-office.bak`)
    }
  } else {
    mkdirSync(dirname(file), { recursive: true })
  }
  writeFileSync(file, `${JSON.stringify(settings, null, 2)}\n`)
}

function hooksTarget() {
  return settingsFiles()[flag('project') ? 1 : 0]
}

function installHooks() {
  const [where, file] = hooksTarget()
  if (spawnSync('curl', ['--version'], { stdio: 'ignore' }).status !== 0) {
    console.error('The settings hooks send events with curl, which wasn\'t found. Install curl and try again.')
    process.exit(1)
  }
  writeSettings(file, addHooks(readSettings(file), port))
  console.log(`Added Agent Office's hooks to your ${where} settings (${file}), sending to ${url}.`)
  console.log('Start the bridge with: npx github:tharun-se95/ModsArena  (new Claude Code sessions report to it)')
}

function uninstallHooks() {
  const [where, file] = hooksTarget()
  const settings = readSettings(file)
  if (!hasHooks(settings)) {
    console.log(`No Agent Office hooks in your ${where} settings (${file}).`)
    return
  }
  writeSettings(file, removeHooks(settings))
  console.log(`Removed Agent Office's hooks from your ${where} settings (${file}). Nothing else changed.`)
}

function usage() {
  console.log(`Usage: agent-office [open | demo | status | auto-update | install-hooks | uninstall-hooks] [--port N] [--project] [--no-open]

  open             start the bridge (if it isn't running) and open the office
  demo             the same with sample activity, no Claude Code needed (port 7338)
  status           is a bridge running, are the settings hooks installed, and
                   does the plugin update on its own
  auto-update [on | off]
                   let new versions of the plugin arrive on their own (on
                   unless you say off; takes effect next time Claude Code starts)
  install-hooks    send Claude Code's settings hooks to the bridge (for builds
                   without mods; with mods, install the plugin instead)
  uninstall-hooks  remove exactly the hooks install-hooks added

  --project        install-hooks / uninstall-hooks in ./.claude/settings.json
                   instead of your user settings`)
}

const commands = { open: serve, demo: serve, status, 'auto-update': setAutoUpdate, 'install-hooks': installHooks, 'uninstall-hooks': uninstallHooks, help: usage }
if (flag('help') || flag('h')) usage()
else if (commands[command]) await commands[command]()
else { usage(); process.exit(1) }
