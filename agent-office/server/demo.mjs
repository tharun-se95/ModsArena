// Synthetic Claude Code activity for `server.mjs --demo` and the hosted
// preview: two projects, three live sessions that prompt, spawn subagents
// (some nested), message them, run tools, fill their context and compact,
// then answer and wait on you a while. One is a thread a claude.ai
// project's coordinator hands work to. Plus a few past sessions for the
// history view. Only timers, so it runs in a browser too.

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
const ANSWERS = [
  'Done. The retry wrapper is in, with tests. Should it also back off on 429s?',
  'Found it: the build reads a stale cache key. I fixed it locally; want me to open a PR?',
  'I added six tests for refunds. Partial refunds aren’t covered yet. Shall I add them?',
  'The chart tokens are migrated. Two charts still hard-code colors; fix those too?',
  'Review done: one race in session.ts and two nits. I left them as comments.',
]
// What you ask a thread next, once its first job is done.
const FOLLOWUPS = {
  'Now add tests for it': ['Find the untested paths', 'Write the tests', 'Run the suite'],
  'Open a PR with that': ['Write the PR description', 'Push the branch', 'Open the PR'],
  'Screenshot it in dark mode too': ['Switch to dark mode', 'Screenshot every chart', 'Compare with light'],
}
const NUDGES = ['Also check the error path', 'Keep it to the auth module', 'Skip the snapshots', 'Note anything flaky']
const AGENTS = [
  ['Explore', 'Map the auth module'], ['Plan', 'Design token rotation'],
  ['general-purpose', 'Write regression tests'], ['code-reviewer', 'Review session.ts'],
]
const WINDOW = 200000
const FIXED = [
  ['System prompt', 3100], ['System tools', 17800], ['MCP tools', 9400],
  ['Custom agents', 1200], ['Memory files', 2600], ['Skills', 1900],
]

// What each prompt's checklist looks like (TodoWrite in Claude Code).
const PLANS = {
  'Harden the session handling': ['Map how sessions are issued', 'Compare tokens with timingSafeEqual', 'Rotate the token on login', 'Add regression tests', 'Run the suite'],
  'Add retries to the webhook worker': ['Find where deliveries fail', 'Wrap sends in a retry helper', 'Back off between tries', 'Test the retry path'],
  'Why is the build flaky?': ['Reproduce the failure', 'Bisect the cache keys', 'Fix the stale key', 'Rerun CI three times'],
  'Write tests for the refund flow': ['List the refund cases', 'Write full-refund tests', 'Write partial-refund tests', 'Run the suite'],
  'Migrate charts to the new tokens': ['Inventory hard-coded colors', 'Swap to the new tokens', 'Screenshot every chart', 'Check dark mode'],
  'Review the open PR': ['Read the diff', 'Run it locally', 'Write up findings'],
}
// AskUserQuestion, as Claude Code's dialog draws it.
const QUESTIONS = [
  { header: 'Backoff', question: 'Should retries also back off on 429s?', multiSelect: false, options: [
    { label: 'Exponential', description: 'Waits 1s, 2s, 4s… up to 30s. Recommended.' },
    { label: 'Fixed delay', description: 'Simpler: 5s between tries.' },
    { label: 'Only 5xx', description: 'Leave 429s alone.' }] },
  { header: 'Chart style', question: 'Which look should the revenue chart take?', multiSelect: false, options: [
    { label: 'Bars', description: 'Monthly bars, easy to compare.', preview: 'bars' },
    { label: 'Area', description: 'A smooth trend line, filled.', preview: 'area' },
    { label: 'Both', description: 'Bars with the trend over them.', preview: 'combo' }] },
  { header: 'Scope', question: 'Open a PR now, or keep going on partial refunds first?', multiSelect: false, options: [
    { label: 'Open the PR', description: 'Ship what passes; partial refunds next.' },
    { label: 'Keep going', description: 'One PR with everything.' }] },
]
const PERMISSIONS = [['Bash', 'npm publish --dry-run'], ['Bash', 'git push origin fix/stale-cache'], ['mcp__github__create_pull_request', 'acme/payments-api']]
const PLAN_TEXT = `# Rotate session tokens\n\n1. Issue a fresh token on every login and privilege change\n2. Keep the old one valid for 30s so in-flight requests finish\n3. Compare tokens with timingSafeEqual\n4. Add tests for reuse and expiry\n\nTouches src/auth/session.ts and src/auth/login.ts.`
const FILES = ['src/auth/session.ts', 'src/webhooks/worker.ts', 'src/refunds/refund.test.ts', 'src/charts/tokens.ts', 'ci/cache.yml', 'docs/ARCHITECTURE.md']
const SHOTS = [
  ['dashboard', 'Dashboard with the new tokens'], ['chart', 'Revenue chart, dark mode'],
  ['diagram', 'How a session token flows'], ['tests', 'Test run: 42 passed'],
]
const DELIVERABLES = [
  ['pr', 'Retry webhook sends with backoff', 'https://github.com/acme/payments-api/pull/'],
  ['artifact', 'Flaky build: what broke and why', 'https://claude.ai/artifact/demo-'],
  ['pr', 'Fix the stale CI cache key', 'https://github.com/acme/web-dashboard/pull/'],
  ['artifact', 'Refund flow test report', 'https://claude.ai/artifact/demo-'],
]

// A small picture for the demo's images: an SVG drawn from a few shapes.
export function demoShot(kind, hue = 18) {
  const c = `hsl(${hue} 62% 58%)`
  const bars = Array.from({ length: 7 }, (_, i) => {
    const h = 30 + ((i * 37 + hue) % 70)
    return `<rect x="${30 + i * 36}" y="${150 - h}" width="22" height="${h}" rx="3" fill="${i === 5 ? c : '#cfc6b8'}"/>`
  }).join('')
  const body = {
    dashboard: `<rect width="320" height="200" fill="#f6f2ea"/><rect width="320" height="22" fill="#2b2a2e"/><circle cx="12" cy="11" r="4" fill="#e66"/><circle cx="24" cy="11" r="4" fill="#eb4"/><circle cx="36" cy="11" r="4" fill="#5b5"/><rect x="12" y="34" width="90" height="154" rx="6" fill="#fff"/><rect x="22" y="46" width="60" height="7" rx="3" fill="${c}"/><rect x="22" y="62" width="50" height="6" rx="3" fill="#ddd"/><rect x="22" y="76" width="66" height="6" rx="3" fill="#ddd"/><rect x="112" y="34" width="196" height="70" rx="6" fill="#fff"/><path d="M122 92 L160 70 L196 80 L232 52 L270 62 L298 44" stroke="${c}" stroke-width="4" fill="none"/><rect x="112" y="114" width="94" height="74" rx="6" fill="#fff"/><rect x="214" y="114" width="94" height="74" rx="6" fill="${c}" opacity=".85"/><text x="226" y="160" font-family="sans-serif" font-size="22" font-weight="700" fill="#fff">$48k</text>`,
    chart: `<rect width="320" height="200" fill="#1f2433"/><text x="20" y="28" font-family="sans-serif" font-size="13" fill="#e8e2d6">Revenue by month</text>${bars.replaceAll('#cfc6b8', '#3c4560')}<path d="M40 120 L76 104 L112 110 L148 80 L184 86 L220 52 L256 64" stroke="#f2c14e" stroke-width="3" fill="none"/>`,
    diagram: `<rect width="320" height="200" fill="#fbf8f2"/><g font-family="sans-serif" font-size="11" fill="#2b2a2e"><rect x="16" y="78" width="74" height="40" rx="8" fill="#fff" stroke="${c}" stroke-width="2"/><text x="32" y="102">Login</text><rect x="124" y="30" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="138" y="54">Issue</text><rect x="124" y="126" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="134" y="150">Rotate</text><rect x="232" y="78" width="74" height="40" rx="8" fill="${c}"/><text x="246" y="102" fill="#fff">Verify</text></g><path d="M90 92 L124 54 M90 104 L124 140 M198 50 L232 90 M198 146 L232 106" stroke="#8a8378" stroke-width="2"/>`,
    tests: `<rect width="320" height="200" fill="#16181d"/><g font-family="monospace" font-size="11">${Array.from({ length: 9 }, (_, i) => `<text x="16" y="${30 + i * 17}" fill="${i === 8 ? '#a7e3a1' : '#9aa3b5'}">${i === 8 ? '✓ 42 passed, 0 failed (3.1s)' : `✓ refund ${['full', 'partial', 'twice', 'expired', 'currency', 'zero', 'webhook', 'audit'][i]} case`}</text>`).join('')}</g>`,
    bars: `<rect width="320" height="200" fill="#fbf8f2"/>${bars}`,
    area: `<rect width="320" height="200" fill="#fbf8f2"/><path d="M30 150 L30 110 L80 96 L130 104 L180 70 L230 78 L290 46 L290 150 Z" fill="${c}" opacity=".35"/><path d="M30 110 L80 96 L130 104 L180 70 L230 78 L290 46" stroke="${c}" stroke-width="4" fill="none"/>`,
    combo: `<rect width="320" height="200" fill="#fbf8f2"/>${bars}<path d="M41 120 L77 104 L113 110 L149 80 L185 86 L221 52 L257 64" stroke="#2b2a2e" stroke-width="3" fill="none"/>`,
  }[kind]
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">${body}</svg>`)}`
}

// The demo's open questions, answered from the office's buttons.
const waiting = new Map() // `${session}|${id}` -> resolve(answer)
export function answerDemo(session, id, answer) {
  const resolve = waiting.get(`${session}|${id}`)
  if (!resolve) return false
  waiting.delete(`${session}|${id}`)
  resolve(answer)
  return true
}

const pick = list => list[Math.floor(Math.random() * list.length)]
const sleep = ms => new Promise(r => setTimeout(r, ms))
const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo))

// The demo's sessions, for a front-desk job to start one (see demoJob).
let runSession = null

export function startDemo(publish) {
  let seq = 0

  // `job`, for a session the front desk started: it stops once for your OK
  // (job.onAsk says when), and ends after its first turn.
  runSession = function (session, project, pace, asThread = false, first = pick(PROMPTS), job = null) {
    const emit = ev => publish([{ t: Date.now(), session, ...ev }])
    let messages = rand(8000, 40000)
    let turns = 0
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
      const work = []
      for (let i = 0; i < steps; i++) {
        if (depth < 2 && Math.random() < (depth ? 0.08 : 0.2)) work.push(runAgent(agent, depth + 1))
        // Now and then its parent sends it a note while it works.
        if (i === 1 && Math.random() < 0.4) emit({ kind: 'agent.message', from: parent, to: agent, via: 'model', text: pick(NUDGES) })
        await runTool(agent)
        tokens += rand(4000, 26000)
        emit({ kind: 'agent.context', agent, tokens, window: WINDOW, model: 'claude-haiku-4-5' })
      }
      await Promise.all(work)
      emit({ kind: 'turn.complete', agent, reason: 'answer', answer: `${description}: done.` })
      emit({ kind: 'agent.end', agent, status: 'completed' })
    }

    // Claude Code holding the turn for you, until you answer (from the
    // office, in the demo) or the demo answers itself.
    async function ask(fields, auto) {
      const id = `demo-ask-${++seq}`
      emit({ kind: 'ask.open', id, ...fields })
      job?.onAsk(true)
      const answer = await new Promise(resolve => {
        waiting.set(`${session}|${id}`, resolve)
        setTimeout(() => answerDemo(session, id, auto), rand(10000, 20000) * pace)
      })
      emit({ kind: 'ask.close', id, answer })
      job?.onAsk(false)
      return answer
    }

    function checklist(items, done, active) {
      emit({
        kind: 'todo.update',
        items: items.map((text, i) => ({ text, status: i < done ? 'completed' : i === done && active ? 'in_progress' : 'pending' })),
      })
    }

    async function loop() {
      emit({ kind: 'session.start', cwd: project.id, model: 'claude-sonnet-5-5', project })
      measure()
      breakdown()
      for (;;) {
        const turnId = `demo-turn-${++seq}`
        const text = turns++ === 0 ? first : pick(Object.keys(FOLLOWUPS))
        if (asThread) {
          emit({ kind: 'session.thread' })
          emit({ kind: 'agent.message', via: 'projects-relay', text })
        }
        emit({ kind: 'turn.start', turnId, text })
        const items = PLANS[text] ?? FOLLOWUPS[text] ?? ['Look around', 'Make the change', 'Test it']
        checklist(items, 0, true)
        const work = []
        for (let i = 0; i < rand(0, 3); i++) work.push(runAgent(undefined, 0))
        const hue = rand(0, 360)
        for (let step = 0; step < items.length; step++) {
          checklist(items, step, true)
          await runTool(undefined)
          messages += rand(3000, 12000)
          measure()
          if (Math.random() < 0.45) {
            const path = pick(FILES)
            emit({ kind: 'asset.add', id: `file-${path}`, type: 'file', title: path.split('/').pop(), path, meta: { additions: rand(4, 120), deletions: rand(0, 40) } })
          }
          if (Math.random() < 0.3) {
            const [shot, title] = pick(SHOTS)
            emit({ kind: 'asset.add', id: `img-${++seq}`, type: 'image', title, path: `screenshots/${shot}.png`, src: demoShot(shot, hue) })
          }
          // Now and then it stops to ask you something.
          if (step === 1 && (job || Math.random() < 0.4)) {
            const roll = job ? 0.7 : Math.random()
            if (roll < 0.6) {
              const q = pick(QUESTIONS)
              const questions = [{ ...q, options: q.options.map(o => ({ ...o, ...(o.preview && { preview: demoShot(o.preview, hue) }) })) }]
              await ask({ type: 'question', questions }, q.options[0].label)
            } else if (roll < 0.85) {
              const [tool, summary] = pick(PERMISSIONS)
              await ask({ type: 'permission', tool, summary }, 'Allowed')
            } else {
              await ask({ type: 'plan', plan: PLAN_TEXT }, 'Approved')
            }
          }
        }
        checklist(items, items.length, false)
        await Promise.all(work)
        if (Math.random() < 0.6) {
          const [type, title, url] = pick(DELIVERABLES)
          const n = rand(12, 240)
          emit({ kind: 'asset.add', id: `${type}-${n}`, type, title, url: `${url}${n}`, ...(type === 'pr' && { meta: { state: 'open', additions: rand(20, 300), deletions: rand(2, 80) } }) })
        }
        messages += rand(4000, 14000)
        if (used() > WINDOW - 33000) {
          const before = used()
          messages = rand(9000, 16000)
          emit({ kind: 'context.compact', trigger: 'auto', before, after: used() })
        }
        measure()
        const reason = Math.random() < 0.08 ? 'error' : 'answer'
        emit({ kind: 'turn.complete', turnId, reason, durationMs: 9000, ...(reason === 'answer' && { answer: pick(ANSWERS) }) })
        breakdown()
        if (job) {
          job.onDone()
          return
        }
        // Then it waits on you: sometimes briefly, sometimes a while.
        await sleep((Math.random() < 0.5 ? rand(1500, 5000) : rand(9000, 20000)) * pace)
      }
    }

    void loop()
  }

  runSession('demo-payments-1', PROJECTS[0], 1, false, 'Harden the session handling')
  setTimeout(() => runSession('demo-payments-2', PROJECTS[0], 1.6, false, 'Why is the build flaky?'), 2500)
  setTimeout(() => runSession('demo-dashboard-1', PROJECTS[1], 1.3, true, 'Migrate charts to the new tokens'), 5000)
}

// Demo only: a front-desk job taken by a sample session instead of a real
// `claude --bg` (see jobs.mjs). `update` reports where the job is, the way
// the bridge does from `claude agents --json`.
let jobSeq = 0
export function demoJob() {
  return (job, prompt, update) => {
    const n = ++jobSeq
    const short = `d${String(Date.now() % 1e7).padStart(7, '0')}`.slice(0, 8)
    const project = PROJECTS.find(p => p.id === job.dir) ?? PROJECTS[0]
    setTimeout(() => {
      update({ state: 'working', short, session: `${short}-demo-job-${n}` })
      runSession?.(`${short}-demo-job-${n}`, project, 0.7, false, prompt, {
        onAsk: open => update({ state: open ? 'blocked' : 'working', ...(open && { waitingFor: 'permission prompt' }) }),
        onDone: () => update({ state: 'done' }),
      })
    }, 1200)
  }
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
