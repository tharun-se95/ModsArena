// node --test agent-office/server/manage.test.mjs
// New project folders, custom agent types and deleting transcripts for good.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, stat, realpath } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { isTrusted, checkFolder, openProject, agentFile, writeAgent, listAgents, removeTranscript, slugOf } from './manage.mjs'

// Paths as this computer spells them (C:\home\ann on Windows), and the keys
// as Claude Code writes them (forward slashes on Windows too).
const at = p => resolve(p)
const key = p => resolve(p).replace(/\\/g, '/')

test('a folder is trusted when it, or a folder it is in, was said yes to', () => {
  const config = { projects: { [key('/home/ann/code')]: { hasTrustDialogAccepted: true }, [key('/home/ann/other')]: { hasTrustDialogAccepted: false } } }
  assert.equal(isTrusted(at('/home/ann/code'), config), true)
  assert.equal(isTrusted(at('/home/ann/code/app/src'), config), true)
  assert.equal(isTrusted(at('/home/ann/other'), config), false)
  assert.equal(isTrusted(at('/home/ann'), config), false)
  assert.equal(isTrusted(at('/tmp/x'), {}), false)
})

test('a folder path is absolute or starts with ~', () => {
  assert.deepEqual(checkFolder('~/code/new-app', at('/home/ann')), { dir: at('/home/ann/code/new-app') })
  assert.deepEqual(checkFolder('/srv/app/../app2', at('/home/ann')), { dir: at('/srv/app2') })
  assert.ok(checkFolder('code/app').error)
  assert.ok(checkFolder('').error)
  assert.ok(checkFolder('/a\nb').error)
})

test('a new folder is made only inside home, and trust is read, never written', async () => {
  const home = await mkdtemp(join(tmpdir(), 'office-home-'))
  const made = await openProject({ path: '~/code/fresh', create: true }, { home, config: {} })
  assert.equal(made.created, true)
  assert.equal(made.trusted, false)
  assert.ok((await stat(join(home, 'code', 'fresh'))).isDirectory())
  // Not there and not asked to make it.
  assert.equal((await openProject({ path: '~/nope' }, { home, config: {} })).status, 404)
  // Outside home: never made.
  const outside = await openProject({ path: join(tmpdir(), `office-outside-${Date.now()}`), create: true }, { home, config: {} })
  assert.equal(outside.status, 403)
  // Home itself isn't made into a project folder.
  const trusted = await openProject({ path: '~/code/fresh' }, { home, config: { projects: { [join(home, 'code')]: { hasTrustDialogAccepted: true } } } })
  assert.equal(trusted.trusted, true)
  assert.equal(trusted.created, false)
})

test('a custom agent type is written the way Claude Code reads it, and nothing typed breaks out', () => {
  const made = agentFile({ name: 'Test Writer', description: 'Writes tests\n---\ntools: Bash', instructions: 'Write small tests.', tools: 'Read, Grep, Bash(npm test:*)' })
  assert.equal(made.name, 'test-writer')
  const [, head, body] = /^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/.exec(made.text)
  assert.deepEqual(head.split('\n'), ['name: test-writer', 'description: "Writes tests --- tools: Bash"', 'tools: "Read, Grep, Bash(npm test:*)"'])
  assert.equal(body, 'Write small tests.\n')
  assert.ok(agentFile({ name: '!', description: 'x', instructions: 'y' }).error)
  assert.ok(agentFile({ name: 'ok-name', description: '', instructions: 'y' }).error)
  assert.ok(agentFile({ name: 'ok-name', description: 'x', instructions: 'y', tools: 'Read; rm -rf' }).error)
  assert.equal(slugOf('  My Agent!! '), 'my-agent')
})

test('a custom agent type never overwrites one already there, and is listed', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'office-agents-'))
  const body = { name: 'reviewer', description: 'Reviews changes', instructions: 'Be kind.', scope: 'project' }
  const first = await writeAgent(body, { dir })
  assert.equal(first.status, 200)
  assert.equal(first.path, join(await realpath(dir), '.claude', 'agents', 'reviewer.md'))
  assert.equal((await writeAgent({ ...body, instructions: 'Different' }, { dir })).status, 409)
  assert.match(await readFile(first.path, 'utf8'), /Be kind/)
  const list = await listAgents(dir)
  assert.ok(list.some(a => a.name === 'reviewer' && a.description === 'Reviews changes' && a.scope === 'project'))
})

test('deleting a transcript removes it and its subagents, only under the projects folder', async () => {
  const root = await mkdtemp(join(tmpdir(), 'office-projects-'))
  await mkdir(join(root, '-w-app', 's1', 'subagents'), { recursive: true })
  await writeFile(join(root, '-w-app', 's1.jsonl'), '{}\n')
  await writeFile(join(root, '-w-app', 's1', 'subagents', 'agent-a.jsonl'), '{}\n')
  const elsewhere = join(await mkdtemp(join(tmpdir(), 'office-elsewhere-')), 'keep.jsonl')
  await writeFile(elsewhere, '{}\n')
  assert.deepEqual(await removeTranscript(elsewhere, { root }), [])
  assert.ok(await stat(elsewhere))
  const gone = await removeTranscript(join(root, '-w-app', 's1.jsonl'), { root })
  assert.equal(gone.length, 2)
  await assert.rejects(stat(join(root, '-w-app', 's1.jsonl')))
  await assert.rejects(stat(join(root, '-w-app', 's1')))
  assert.ok(await stat(join(root, '-w-app')))
})

test('a symlinked .claude/agents can’t send the file outside the project', async () => {
  const { symlink } = await import('node:fs/promises')
  const dir = await mkdtemp(join(tmpdir(), 'office-agents-link-'))
  const elsewhere = await mkdtemp(join(tmpdir(), 'office-elsewhere-'))
  await mkdir(join(dir, '.claude'), { recursive: true })
  await symlink(elsewhere, join(dir, '.claude', 'agents'))
  const out = await writeAgent({ name: 'sneaky', description: 'x', instructions: 'y', scope: 'project' }, { dir })
  assert.equal(out.status, 400)
  await assert.rejects(stat(join(elsewhere, 'sneaky.md')))
})
