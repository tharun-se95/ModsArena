// Making and clearing things from the office: a new project folder, a custom
// agent type, and deleting a session's transcripts for good.
//
// New project: a folder you pick (or one the office makes under your home
// folder). Claude Code only works in a folder you've trusted, and the office
// never trusts one for you: it reads whether you have (Claude Code's own
// ~/.claude.json, read only) and, if not, says how (open Claude Code there
// once and say yes).
//
// Custom agent type: a subagent definition, the way Claude Code reads them:
// <project>/.claude/agents/<name>.md for one project, ~/.claude/agents/<name>.md
// for all of them. Never overwrites one that's there.
//
// Delete for good: a session's transcript (<session>.jsonl) and its folder of
// subagent transcripts, only ever under ~/.claude/projects. Never a project's
// own files.

import { existsSync, readFileSync } from 'node:fs'
import { mkdir, readdir, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { projectsDir } from './history.mjs'

const configDir = () => process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude')

// Where Claude Code keeps which folders you've trusted.
export function globalConfigPath() {
  if (process.env.CLAUDE_CONFIG_DIR) return join(process.env.CLAUDE_CONFIG_DIR, '.claude.json')
  return join(homedir(), '.claude.json')
}

function readConfig(path = globalConfigPath()) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {}
  } catch {
    return {}
  }
}

// Whether you've trusted `dir` in Claude Code: it, or a folder it's in.
export function isTrusted(dir, config = readConfig()) {
  const projects = config?.projects ?? {}
  let at = resolve(dir)
  for (;;) {
    for (const key of [at, at.replace(/\\/g, '/')]) if (projects[key]?.hasTrustDialogAccepted === true) return true
    const up = dirname(at)
    if (up === at) return false
    at = up
  }
}

const inside = (parent, child) => {
  const rel = relative(parent, child)
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))
}

// A folder path you typed, checked: absolute, or starting with ~. Returns
// { dir } (resolved), or { error }.
export function checkFolder(path, home = homedir()) {
  if (typeof path !== 'string' || !path.trim()) return { error: 'say which folder' }
  let p = path.trim()
  if (p.length > 1000) return { error: 'that path is too long' }
  if (p === '~' || p.startsWith('~/') || p.startsWith('~\\')) p = join(home, p.slice(1))
  if (!isAbsolute(p)) return { error: 'give the full path, like ~/code/my-app' }
  if (/[\0\n\r]/.test(p)) return { error: 'that path has characters a folder can’t' }
  return { dir: resolve(p) }
}

// Open (or make) a project folder. `create`: make it if it isn't there, only
// inside your home folder. Returns { dir, created, trusted } or { status, error }.
export async function openProject({ path, create = false } = {}, { home = homedir(), config } = {}) {
  const checked = checkFolder(path, home)
  if (checked.error) return { status: 400, error: checked.error }
  let dir = checked.dir
  let created = false
  const info = await stat(dir).catch(() => null)
  if (info && !info.isDirectory()) return { status: 400, error: 'that’s a file, not a folder' }
  if (!info) {
    if (!create) return { status: 404, error: 'there’s no folder there. Tick “Make it” to create it' }
    if (!inside(resolve(home), dir) || resolve(home) === dir) return { status: 403, error: 'the office only makes new folders inside your home folder' }
    await mkdir(dir, { recursive: true })
    created = true
  }
  // Trusted under either spelling: the one you gave, or where it really is
  // (a symlinked folder, macOS's /var → /private/var, Windows' short names).
  const settings = config ?? readConfig()
  const real = await realpath(dir)
  return { dir: real, created, trusted: isTrusted(real, settings) || isTrusted(dir, settings) }
}

// ---------------------------------------------------------------------------
// Custom agent types

export const AGENT_NAME = /^[a-z][a-z0-9-]{1,40}$/
const TOOL = /^[A-Za-z_][\w-]*(\([^()\n]{0,200}\))?$/
const MAX_INSTRUCTIONS = 8000

export const slugOf = name => String(name ?? '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 41)

// A custom agent type checked and written out as Claude Code reads it.
// Returns { name, text } or { error }.
export function agentFile({ name, description, instructions, tools } = {}) {
  const slug = slugOf(name)
  if (!AGENT_NAME.test(slug)) return { error: 'give it a name of a few letters, like test-writer' }
  const about = String(description ?? '').replace(/\s+/g, ' ').trim()
  if (!about) return { error: 'say when Claude should use it' }
  if (about.length > 300) return { error: 'keep “when to use it” under 300 characters' }
  const body = String(instructions ?? '').replace(/\r\n?/g, '\n').trim()
  if (!body) return { error: 'write its instructions' }
  if (body.length > MAX_INSTRUCTIONS) return { error: `keep the instructions under ${MAX_INSTRUCTIONS} characters` }
  const list = (Array.isArray(tools) ? tools : String(tools ?? '').split(',')).map(t => String(t).trim()).filter(Boolean)
  const bad = list.find(t => !TOOL.test(t))
  if (bad) return { error: `“${bad.slice(0, 40)}” isn’t a tool name` }
  // JSON strings are valid YAML, so nothing you type can break out of a field.
  const head = ['---', `name: ${slug}`, `description: ${JSON.stringify(about)}`, ...(list.length ? [`tools: ${JSON.stringify(list.join(', '))}`] : []), '---']
  return { name: slug, text: `${head.join('\n')}\n\n${body}\n` }
}

// Where a custom agent type goes: one project's, or yours for all of them.
export const agentsDir = (scope, dir) => (scope === 'user' ? join(configDir(), 'agents') : join(dir, '.claude', 'agents'))

export async function writeAgent(body, { dir } = {}) {
  const made = agentFile(body)
  if (made.error) return { status: 400, error: made.error }
  const scope = body?.scope === 'user' ? 'user' : 'project'
  if (scope === 'project' && !dir) return { status: 400, error: 'pick a project' }
  const folder = agentsDir(scope, dir)
  await mkdir(folder, { recursive: true })
  // A symlinked .claude/agents (a cloned repo can carry one) must not send
  // the file somewhere else: the real folder has to be where it says.
  const base = await realpath(scope === 'user' ? configDir() : dir)
  const real = await realpath(folder)
  if (!inside(base, real)) return { status: 400, error: 'that agents folder points somewhere outside the project' }
  const path = join(real, `${made.name}.md`)
  try {
    await writeFile(path, made.text, { flag: 'wx' })
  } catch (err) {
    if (err.code === 'EEXIST') return { status: 409, error: `there’s already an agent called ${made.name} there` }
    throw err
  }
  return { status: 200, name: made.name, path, scope }
}

// The custom agent types a project can use: its own, then yours.
export async function listAgents(dir) {
  const read = async (scope, folder) => {
    const files = await readdir(folder).catch(() => [])
    return Promise.all(files.filter(f => f.endsWith('.md')).sort().map(async f => {
      const text = await readFile(join(folder, f), 'utf8').catch(() => '')
      const head = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? ''
      const field = k => new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(head)?.[1]?.trim().replace(/^"(.*)"$/, '$1')
      return { name: field('name') || f.slice(0, -3), description: (field('description') ?? '').slice(0, 300), scope }
    }))
  }
  const mine = dir ? await read('project', agentsDir('project', dir)) : []
  const yours = await read('user', agentsDir('user'))
  return [...mine, ...yours.filter(a => !mine.some(m => m.name === a.name))]
}

// ---------------------------------------------------------------------------
// Delete for good

// Remove a transcript file (a session's, or a subagent's) and, for a
// session, its folder of subagent transcripts beside it. Only paths under
// Claude Code's projects folder. Returns what it removed.
export async function removeTranscript(path, { session = true, root = projectsDir() } = {}) {
  const base = await realpath(root).catch(() => resolve(root))
  const real = await realpath(path).catch(() => null)
  if (!real || !real.endsWith('.jsonl') || !inside(base, real) || real === base) return []
  const removed = [real]
  await rm(real, { force: true })
  if (session) {
    const folder = real.slice(0, -'.jsonl'.length)
    if (inside(base, folder) && folder.split(sep).length > base.split(sep).length && await stat(folder).then(s => s.isDirectory(), () => false)) {
      await rm(folder, { recursive: true, force: true })
      removed.push(folder)
    }
  }
  return removed
}
