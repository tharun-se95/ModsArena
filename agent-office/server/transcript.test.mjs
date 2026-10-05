// node --test agent-office/server/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, appendFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { entriesOf, findTranscript, readTranscript } from './transcript.mjs'

const at = '2026-10-05T10:00:00.000Z'
// Rows shaped as Claude Code writes them.
const rows = [
  { type: 'queue-operation', operation: 'enqueue' },
  { type: 'user', origin: { kind: 'human' }, timestamp: at, message: { role: 'user', content: 'Why is the build flaky?' } },
  { type: 'assistant', timestamp: at, message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'hmm' }] } },
  { type: 'assistant', timestamp: at, message: { role: 'assistant', content: [{ type: 'text', text: 'Let me look at the CI config.' }] } },
  { type: 'assistant', timestamp: at, message: { role: 'assistant', content: [{ type: 'tool_use', id: 'tu1', name: 'Read', input: { file_path: '/w/ci.yml' } }] } },
  { type: 'user', timestamp: at, message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'tu1', content: 'jobs: ...' }] } },
  { type: 'user', isMeta: true, timestamp: at, message: { role: 'user', content: [{ type: 'text', text: 'meta' }] } },
  { type: 'user', origin: { kind: 'plugin', name: 'agent-office' }, timestamp: at, message: { role: 'user', content: 'Also check the retries.' } },
  { type: 'user', origin: { kind: 'human' }, timestamp: at, message: { role: 'user', content: '<command-name>/office</command-name><command-args></command-args>' } },
  { type: 'system', subtype: 'compact_boundary', timestamp: at },
  { type: 'user', isCompactSummary: true, timestamp: at, message: { role: 'user', content: 'Summary of the conversation...' } },
  { type: 'user', timestamp: at, message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'tu2', is_error: true, content: [{ type: 'text', text: 'ENOENT' }] }] } },
]

test('rows become the entries the transcript tab draws', () => {
  const entries = rows.flatMap(entriesOf)
  assert.deepEqual(entries.map(e => e.kind), ['you', 'say', 'tool', 'result', 'chat', 'note', 'note', 'result'])
  assert.equal(entries[0].text, 'Why is the build flaky?')
  assert.equal(entries[2].name, 'Read')
  assert.equal(entries[2].summary, '/w/ci.yml')
  assert.equal(entries[3].id, 'tu1')
  assert.equal(entries[3].ok, true)
  assert.equal(entries[4].from, 'agent-office')
  assert.equal(entries[5].text, 'Ran /office')
  assert.equal(entries[6].text, 'Context compacted')
  assert.equal(entries[7].ok, false)
})

test('a transcript is found by session id, its subagents beside it, and nothing outside', async () => {
  const root = await mkdtemp(join(tmpdir(), 'office-'))
  await mkdir(join(root, '-w-app', 'sess-1', 'subagents'), { recursive: true })
  await writeFile(join(root, '-w-app', 'sess-1.jsonl'), '')
  await writeFile(join(root, '-w-app', 'sess-1', 'subagents', 'agent-a7.jsonl'), '')
  assert.equal(await findTranscript('sess-1', undefined, root), join(root, '-w-app', 'sess-1.jsonl'))
  assert.equal(await findTranscript('sess-1', 'a7', root), join(root, '-w-app', 'sess-1', 'subagents', 'agent-a7.jsonl'))
  assert.equal(await findTranscript('sess-1', 'nope', root), null)
  assert.equal(await findTranscript('../../etc/passwd', undefined, root), null)
  assert.equal(await findTranscript('sess-1', '../x', root), null)
})

test('reading picks up where it left off, and waits out a half-written line', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'office-'))
  const path = join(dir, 's.jsonl')
  await writeFile(path, rows.slice(0, 4).map(r => JSON.stringify(r)).join('\n') + '\n')
  const first = await readTranscript(path)
  assert.deepEqual(first.entries.map(e => e.kind), ['you', 'say'])
  const half = JSON.stringify(rows[4])
  await appendFile(path, half.slice(0, 20))
  const second = await readTranscript(path, first.next)
  assert.deepEqual(second.entries, [])
  assert.equal(second.next, first.next)
  await appendFile(path, half.slice(20) + '\n')
  const third = await readTranscript(path, second.next)
  assert.deepEqual(third.entries.map(e => e.kind), ['tool'])
})
