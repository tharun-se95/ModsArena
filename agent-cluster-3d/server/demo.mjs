// Synthetic Claude Code activity for `server.mjs --demo`: a lead session that
// keeps prompting, spawns subagents (some nested), and runs tools in each.

const TOOLS = [
  ['Read', 'src/auth/session.ts'], ['Grep', 'timingSafeEqual'], ['Glob', '**/*.test.ts'],
  ['Bash', 'npm test -- --watch=false'], ['Edit', 'src/auth/session.ts'],
  ['Write', 'docs/ARCHITECTURE.md'], ['WebFetch', 'https://nodejs.org/api/crypto.html'],
  ['Bash', 'git diff --stat'], ['mcp__github__list_pull_requests', 'open PRs'],
]
const AGENTS = [
  ['Explore', 'Map the auth module'], ['Plan', 'Design token rotation'],
  ['general-purpose', 'Write regression tests'], ['code-reviewer', 'Review session.ts'],
]

const pick = list => list[Math.floor(Math.random() * list.length)]
const sleep = ms => new Promise(r => setTimeout(r, ms))

export function startDemo(publish) {
  const session = 'demo-session'
  let seq = 0
  const emit = ev => publish([{ t: Date.now(), session, ...ev }])

  async function runTool(agent) {
    const [tool, summary] = pick(TOOLS)
    const id = `demo-tool-${++seq}`
    emit({ kind: 'tool.start', agent, id, tool, summary })
    await sleep(400 + Math.random() * 2600)
    emit({ kind: 'tool.end', agent, id, tool, ok: Math.random() > 0.12 })
  }

  async function runAgent(parent, depth) {
    const [type, description] = pick(AGENTS)
    const agent = `demo-agent-${++seq}`
    emit({ kind: 'agent.spawn', agent, parent, type, description, model: 'demo', background: Math.random() > 0.5 })
    const steps = 3 + Math.floor(Math.random() * 6)
    for (let i = 0; i < steps; i++) {
      if (depth < 1 && Math.random() < 0.15) void runAgent(agent, depth + 1)
      await runTool(agent)
    }
    const window = 200000
    const tokens = Math.floor(window * (0.1 + Math.random() * 0.6))
    emit({ kind: 'turn.complete', agent, reason: 'answer', context: { tokens, window, percent: Math.round((tokens / window) * 100) } })
    emit({ kind: 'agent.end', agent })
  }

  async function loop() {
    emit({ kind: 'session.start', cwd: '/workspace/demo', model: 'demo' })
    let tokens = 12000
    for (;;) {
      const turnId = `demo-turn-${++seq}`
      emit({ kind: 'turn.start', turnId, text: 'Harden the session handling' })
      const work = []
      for (let i = 0; i < 1 + Math.floor(Math.random() * 3); i++) work.push(runAgent(undefined, 0))
      for (let i = 0; i < 2; i++) await runTool(undefined)
      await Promise.all(work)
      tokens = Math.min(195000, tokens + 9000 + Math.floor(Math.random() * 15000))
      emit({ kind: 'turn.complete', turnId, reason: 'answer', durationMs: 9000, context: { tokens, window: 200000, percent: Math.round(tokens / 2000) } })
      if (tokens > 180000) tokens = 30000
      await sleep(1500)
    }
  }

  void loop()
}
