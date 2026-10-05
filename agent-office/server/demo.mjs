// Synthetic Claude Code activity for `server.mjs --demo` and the hosted
// preview: two projects, three live sessions that prompt, spawn subagents
// (some nested), run tools, fill their context and compact, plus a few past
// sessions for the history view. Only timers, so it runs in a browser too.

const PROJECTS = [
  { id: '/work/payments-api', name: 'acme/payments-api', remote: 'git@github.com:acme/payments-api.git' },
  { id: '/work/web-dashboard', name: 'acme/web-dashboard', remote: 'git@github.com:acme/web-dashboard.git' },
]
const PROMPTS = [
  'Harden the session handling', 'Add retries to the webhook worker', 'Why is the build flaky?',
  'Write tests for the refund flow', 'Migrate charts to the new tokens', 'Review the open PR',
]
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
const WINDOW = 200000
const FIXED = [
  ['System prompt', 3100], ['System tools', 17800], ['MCP tools', 9400],
  ['Custom agents', 1200], ['Memory files', 2600], ['Skills', 1900],
]

const pick = list => list[Math.floor(Math.random() * list.length)]
const sleep = ms => new Promise(r => setTimeout(r, ms))
const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo))

export function startDemo(publish) {
  let seq = 0

  function runSession(session, project, pace) {
    const emit = ev => publish([{ t: Date.now(), session, ...ev }])
    let messages = rand(8000, 40000)
    let cost = 0

    const fixedTokens = FIXED.reduce((n, [, t]) => n + t, 0)
    const used = () => fixedTokens + messages

    function measure() {
      const tokens = used()
      cost += tokens / 1e6 * 3 * 0.15 + 0.01
      emit({
        kind: 'context.measure',
        context: { tokens, window: WINDOW, percent: Math.round((tokens / WINDOW) * 100) },
        costUsd: Number(cost.toFixed(4)),
        rateLimits: [{ kind: 'five_hour', percentUsed: Math.min(99, Math.round(cost * 4)) }],
      })
      emit({ kind: 'agent.context', tokens })
    }

    function breakdown() {
      const buffer = 33000
      emit({
        kind: 'context.breakdown',
        window: WINDOW,
        used: used(),
        categories: [
          ...FIXED.map(([name, tokens]) => ({ name, tokens, kind: 'used' })),
          { name: 'Messages', tokens: messages, kind: 'used' },
          { name: 'Autocompact buffer', tokens: buffer, kind: 'buffer' },
          { name: 'Free space', tokens: Math.max(0, WINDOW - used() - buffer), kind: 'free' },
        ],
      })
    }

    async function runTool(agent) {
      const [tool, summary] = pick(TOOLS)
      const id = `demo-tool-${++seq}`
      emit({ kind: 'tool.start', agent, id, tool, summary })
      await sleep(rand(400, 3000) * pace)
      emit({ kind: 'tool.end', agent, id, tool, ok: Math.random() > 0.12 })
    }

    async function runAgent(parent, depth) {
      const [type, description] = pick(AGENTS)
      const agent = `demo-agent-${++seq}`
      emit({ kind: 'agent.spawn', agent, parent, type, description, model: 'claude-haiku-4-5', background: Math.random() > 0.5 })
      let tokens = rand(9000, 20000)
      const steps = rand(3, 9)
      for (let i = 0; i < steps; i++) {
        if (depth < 1 && Math.random() < 0.15) void runAgent(agent, depth + 1)
        await runTool(agent)
        tokens += rand(4000, 26000)
        emit({ kind: 'agent.context', agent, tokens, window: WINDOW, model: 'claude-haiku-4-5' })
      }
      emit({ kind: 'turn.complete', agent, reason: 'answer' })
      emit({ kind: 'agent.end', agent })
    }

    async function loop() {
      emit({ kind: 'session.start', cwd: project.id, model: 'claude-sonnet-5-5', project })
      measure()
      breakdown()
      for (;;) {
        const turnId = `demo-turn-${++seq}`
        emit({ kind: 'turn.start', turnId, text: pick(PROMPTS) })
        const work = []
        for (let i = 0; i < rand(0, 3); i++) work.push(runAgent(undefined, 0))
        for (let i = 0; i < rand(1, 4); i++) {
          await runTool(undefined)
          messages += rand(3000, 12000)
          measure()
        }
        await Promise.all(work)
        messages += rand(4000, 14000)
        if (used() > WINDOW - 33000) {
          const before = used()
          messages = rand(9000, 16000)
          emit({ kind: 'context.compact', trigger: 'auto', before, after: used() })
        }
        measure()
        emit({ kind: 'turn.complete', turnId, reason: 'answer', durationMs: 9000 })
        breakdown()
        await sleep(rand(1500, 5000) * pace)
      }
    }

    void loop()
  }

  runSession('demo-payments-1', PROJECTS[0], 1)
  setTimeout(() => runSession('demo-payments-2', PROJECTS[0], 1.6), 2500)
  setTimeout(() => runSession('demo-dashboard-1', PROJECTS[1], 1.3), 5000)
}

// Past sessions in the shape GET /history answers.
export function demoHistory() {
  const now = Date.now()
  const hour = 3600000
  return [
    [PROJECTS[0], 'demo-past-1', 3, 'Fix the double-charge race', 142000, 1, 4.12],
    [PROJECTS[0], 'demo-past-2', 26, 'Add idempotency keys', 61000, 0, 1.37],
    [PROJECTS[1], 'demo-past-3', 5, 'Dark mode for the charts', 188000, 2, 6.5],
    [PROJECTS[1], 'demo-past-4', 50, 'Upgrade to React 19', 97000, 0, 2.05],
  ].map(([project, session, hoursAgo, prompt, context, compactions, costUsd]) => ({
    session, project, cwd: project.id, gitBranch: 'main', model: 'claude-sonnet-5-5',
    startedAt: now - hoursAgo * hour - 2 * hour, endedAt: now - hoursAgo * hour,
    prompts: [{ t: now - hoursAgo * hour - 2 * hour, text: prompt }, { t: now - hoursAgo * hour - hour, text: 'Now add tests for it' }],
    turns: 2 + compactions * 6, toolCalls: rand(30, 160), errors: rand(0, 6), tools: { Read: 40, Edit: 12, Bash: 20 },
    agents: [{ type: 'Explore', description: 'Map the code', context: 41000, tools: 18 }],
    compactions: Array.from({ length: compactions }, () => ({ trigger: 'auto', before: 167000 })),
    context, window: WINDOW, costUsd,
  }))
}
