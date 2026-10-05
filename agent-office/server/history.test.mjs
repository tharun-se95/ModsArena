// node --test agent-office/server/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { summarizeTranscript, tailContext, windowFor } from './history.mjs'
import { findProject, repoName } from './projects.mjs'

const at = s => `2026-10-05T10:00:${String(s).padStart(2, '0')}.000Z`
const usage = cached => ({ input_tokens: 4, cache_read_input_tokens: cached, cache_creation_input_tokens: 1000, output_tokens: 50 })

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'cluster-history-'))
  mkdirSync(join(dir, 'repo', '.git'), { recursive: true })
  writeFileSync(join(dir, 'repo', '.git', 'config'), '[remote "origin"]\n\turl = https://user:secret@github.com/acme/app.git\n')
  const cwd = join(dir, 'repo')
  const rows = [
    { type: 'user', timestamp: at(1), cwd, gitBranch: 'main', origin: { kind: 'human' }, message: { role: 'user', content: 'Fix the login bug' } },
    { type: 'assistant', timestamp: at(2), cwd, message: { model: 'claude-sonnet-5-5', usage: usage(40000), content: [
      { type: 'tool_use', name: 'Read', input: {} },
      { type: 'tool_use', name: 'Agent', input: { subagent_type: 'Explore', description: 'Map auth' } },
    ] } },
    { type: 'user', timestamp: at(3), cwd, message: { role: 'user', content: [{ type: 'tool_result', is_error: true }] } },
    { type: 'user', timestamp: at(4), cwd, isMeta: true, message: { role: 'user', content: 'meta, not a prompt' } },
    { type: 'system', subtype: 'compact_boundary', timestamp: at(5), compactMetadata: { trigger: 'auto', preTokens: 170000 } },
    { type: 'user', timestamp: at(6), cwd, origin: { kind: 'human' }, message: { role: 'user', content: [{ type: 'text', text: 'Now add a test' }] } },
    { type: 'assistant', timestamp: at(7), cwd, message: { model: 'claude-sonnet-5-5', usage: usage(52000), content: [] } },
    { type: 'cost-state', totalCostUSD: 0.42 },
  ]
  const file = join(dir, 'sess-1.jsonl')
  writeFileSync(file, rows.map(r => JSON.stringify(r)).join('\n') + '\n{"half-written')
  return { file, cwd }
}

test('a transcript summarizes into prompts, tools, agents, compactions and context', async () => {
  const { file, cwd } = fixture()
  const s = await summarizeTranscript(file)
  assert.equal(s.session, 'sess-1')
  assert.deepEqual(s.prompts.map(p => p.text), ['Fix the login bug', 'Now add a test'])
  assert.equal(s.turns, 2)
  assert.equal(s.toolCalls, 1)
  assert.equal(s.errors, 1)
  assert.deepEqual(s.agents.map(a => a.type), ['Explore'])
  assert.deepEqual(s.compactions.map(c => c.before), [170000])
  assert.equal(s.context, 53004)
  assert.equal(s.window, 200000)
  assert.equal(s.costUsd, 0.42)
  assert.equal(s.gitBranch, 'main')
  assert.deepEqual(s.project, { id: cwd, name: 'acme/app', remote: 'https://github.com/acme/app.git' })
})

test('the newest main-loop reading is read from the tail', async () => {
  const { file } = fixture()
  assert.deepEqual(await tailContext(file), { tokens: 53004, window: 200000, model: 'claude-sonnet-5-5' })
})

test('projects resolve to the repository root and drop credentials', () => {
  const { cwd } = fixture()
  mkdirSync(join(cwd, 'src', 'deep'), { recursive: true })
  assert.equal(findProject(join(cwd, 'src', 'deep')).id, cwd)
  assert.equal(repoName('git@github.com:acme/app.git'), 'acme/app')
  assert.equal(windowFor('claude-opus-5-5[1m]', 1000), 1000000)
  assert.equal(windowFor('claude-opus-5-5', 250000), 1000000)
})
