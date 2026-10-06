// A scripted demo: an agent team building a real system, start to finish.
// Where demo.mjs plays random sample activity, this plays one believable
// story: a claude.ai project's coordinator hands a thread "build live order
// tracking" for a food delivery app; its lead maps the code, plans, fans the
// work out to builders who test, fail, fix and message each other, load-tests,
// gets a review and opens a PR. Meanwhile a second team builds the customer's
// tracking page against the first team's stream, and a third writes the
// runbook and alerts. Each lead then waits on you; reply from the inbox (or
// let it wait) and it carries on. Only timers, so it runs in a browser too.
//
//   const story = startStory(publish)
//   story.reply(session, text)   your reply becomes that lead's next prompt

const API = { id: '/work/dispatch-api', name: 'fleetfood/dispatch-api', remote: 'git@github.com:fleetfood/dispatch-api.git' }
const WEB = { id: '/work/customer-web', name: 'fleetfood/customer-web', remote: 'git@github.com:fleetfood/customer-web.git' }
const WINDOW = 200000
const FIXED = [
  ['System prompt', 3100], ['System tools', 17800], ['MCP tools', 9400],
  ['Custom agents', 1200], ['Memory files', 2600], ['Skills', 1900],
]
const LEAD = 'claude-opus-5-5'
const BUILDER = 'claude-sonnet-5-5'
const SCOUT = 'claude-haiku-4-5'

export function startStory(publish, { speed = 1 } = {}) {
  let seq = 0
  const sleep = s => new Promise(r => setTimeout(r, s * 1000 * speed))
  const waiting = new Map()
  const signals = new Map()
  // One team can wait on news from another.
  const signal = name => {
    if (!signals.has(name)) { let open; const p = new Promise(r => { open = r }); p.open = open; signals.set(name, p) }
    return signals.get(name)
  }

  function team(session, project) {
    const emit = ev => publish([{ t: Date.now(), session, ...ev }])
    let messages = 6000
    let cost = 0
    const fixed = FIXED.reduce((n, [, t]) => n + t, 0)
    const used = () => fixed + messages
    const tokens = new Map()

    function measure() {
      const total = used()
      cost += total / 1e6 * 3 * 0.12 + 0.012
      emit({
        kind: 'context.measure',
        context: { tokens: total, window: WINDOW, percent: Math.round(total / WINDOW * 100) },
        costUsd: Number(cost.toFixed(4)),
        rateLimits: [{ kind: 'five_hour', percentUsed: Math.min(95, Math.round(cost * 3)) }],
      })
    }
    function breakdown() {
      const buffer = 33000
      emit({
        kind: 'context.breakdown', window: WINDOW, used: used(),
        categories: [
          ...FIXED.map(([name, t]) => ({ name, tokens: t, kind: 'used' })),
          { name: 'Messages', tokens: messages, kind: 'used' },
          { name: 'Autocompact buffer', tokens: buffer, kind: 'buffer' },
          { name: 'Free space', tokens: Math.max(0, WINDOW - used() - buffer), kind: 'free' },
        ],
      })
    }
    function grow(agent, n) {
      if (!agent) {
        messages += n
        if (used() > WINDOW - 36000) {
          const before = used()
          messages = 14000
          emit({ kind: 'context.compact', trigger: 'auto', before, after: used() })
        }
        measure()
        return
      }
      const t = (tokens.get(agent) ?? 9000) + n
      tokens.set(agent, t)
      emit({ kind: 'agent.context', agent, tokens: t, window: WINDOW })
    }

    // One tool call by the lead (agent undefined) or one of its agents.
    async function tool(agent, name, summary, secs, ok = true, size = 2500) {
      const id = `story-tool-${++seq}`
      emit({ kind: 'tool.start', agent, id, tool: name, summary })
      await sleep(secs)
      emit({ kind: 'tool.end', agent, id, tool: name, ok })
      grow(agent, size)
    }

    // A subagent: spawned, does its work (body), answers and ends.
    async function spawn(parent, spec, body) {
      const agent = `story-agent-${++seq}`
      emit({
        kind: 'agent.spawn', agent, parent, name: spec.name, type: spec.type ?? 'general-purpose',
        description: spec.description, model: spec.model ?? BUILDER, background: Boolean(spec.background),
      })
      tokens.set(agent, 11000)
      grow(agent, 0)
      const me = handle(agent)
      await sleep(0.6)
      await body(me)
      await sleep(0.4)
      emit({ kind: 'turn.complete', agent, reason: 'answer', answer: spec.answer })
      emit({ kind: 'agent.end', agent, status: 'completed' })
      grow(parent, 1800)
      return me
    }

    // Messages within the team: from/to an agent id, or undefined for the lead.
    const message = (from, to, text) => emit({ kind: 'agent.message', from, to, via: 'model', text })

    const handle = agent => ({
      id: agent,
      tool: (...a) => tool(agent, ...a),
      spawn: (spec, body) => spawn(agent, spec, body),
      tell: (to, text) => message(agent, to?.id, text),
    })

    // A turn of the lead: its prompt, its work, its answer; then it waits on
    // you and returns what you said (or the scripted reply after a while).
    async function turn({ prompt, coordinator = false }, body, answer, next) {
      if (coordinator) {
        emit({ kind: 'session.thread' })
        emit({ kind: 'agent.message', via: 'projects-relay', text: prompt })
      }
      emit({ kind: 'turn.start', turnId: `story-turn-${++seq}`, text: prompt })
      grow(undefined, 1200)
      await body()
      grow(undefined, 3000)
      emit({ kind: 'turn.complete', reason: 'answer', answer, durationMs: 60000 })
      breakdown()
      if (!next) return new Promise(r => waiting.set(session, r))
      return Promise.race([
        new Promise(r => waiting.set(session, r)),
        sleep(next.after).then(() => next.prompt),
      ]).finally(() => waiting.delete(session))
    }

    function start(model = LEAD) {
      emit({ kind: 'session.start', cwd: project.id, model, project })
      measure()
      breakdown()
    }

    return { start, turn, tool: (...a) => tool(undefined, ...a), spawn: (spec, body) => spawn(undefined, spec, body), message, emit, lead: { id: undefined } }
  }

  // After the script, a lead still answers what you ask, briefly.
  async function afterwards(t, reply) {
    for (;;) {
      reply = await t.turn({ prompt: reply }, async () => {
        await t.tool('Read', 'docs/design/tracking.md', 1.2)
        await t.tool('Grep', reply.split(' ').slice(0, 2).join(' '), 1)
      }, `On it. (This is the scripted demo, so the team stops here, but in your own office the lead takes "${reply}" as its next prompt and gets back to work.)`)
    }
  }

  // ---------------------------------------------------------------------------
  // Team 1: the backend, a thread the project's coordinator hands work to.

  async function backend() {
    const t = team('story-tracking', API)
    t.start()
    await sleep(1)
    let reply = await t.turn({
      coordinator: true,
      prompt: 'Build live order tracking: couriers stream GPS, customers see the courier and a live ETA. Spec: docs/specs/live-tracking.md',
    }, async () => {
      await t.tool('Read', 'docs/specs/live-tracking.md', 1.6, true, 4200)
      await t.tool('TodoWrite', '6 tasks', 0.8)
      await Promise.all([
        t.spawn({ name: 'Explore', type: 'Explore', model: SCOUT, description: 'Map the order, courier and event-bus code',
          answer: 'Orders emit order.* events on src/events/bus.ts. Couriers have no position store yet. Redis is wired (infra/redis.ts) and Postgres has PostGIS.' },
        async a => {
          await a.tool('Glob', 'src/**/*.ts', 1)
          await a.tool('Grep', 'courierId', 1.3, true, 6000)
          await a.tool('Read', 'src/orders/order.service.ts', 1.4, true, 7000)
          await a.tool('Read', 'src/couriers/courier.repo.ts', 1.1)
          await a.tool('Read', 'src/events/bus.ts', 1)
        }),
        t.spawn({ name: 'Plan', type: 'Plan', description: 'Design the tracking pipeline',
          answer: 'Ingest → Redis GEO for live positions, Postgres for history → ETA worker → one SSE stream per order. Event: courier.location.v1. Written to docs/design/tracking.md.' },
        async a => {
          await a.tool('Read', 'docs/specs/live-tracking.md', 1.2)
          await a.tool('Read', 'infra/redis.ts', 1)
          await a.tool('WebFetch', 'https://redis.io/docs/latest/develop/data-types/geospatial/', 2.2, true, 9000)
          await a.tool('Read', 'src/events/bus.ts', 0.9)
          await a.tool('Write', 'docs/design/tracking.md', 2.4)
        }),
      ])
      await t.tool('Read', 'docs/design/tracking.md', 1.2, true, 3800)
      await t.tool('TodoWrite', '3 builders, then load test and review', 0.7)

      // Three builders at once.
      await Promise.all([
        t.spawn({ name: 'db-migrations', description: 'Add courier_positions with a PostGIS index', background: true,
          answer: 'Migration 0042 adds courier_positions (geom, recorded_at) with a GiST index. Applied locally; rollback tested.' },
        async a => {
          await a.tool('Read', 'migrations/0041_order_events.sql', 1)
          await a.tool('Write', 'migrations/0042_courier_positions.sql', 1.8)
          await a.tool('Bash', 'npm run db:migrate -- --dry-run', 2)
          await a.tool('Bash', 'npm run db:migrate', 1.6)
          await a.tool('Bash', 'npm run db:rollback && npm run db:migrate', 2.2)
          a.tell(t.lead, 'Migration 0042 is applied. courier_positions has a GiST index on geom.')
        }),
        (async () => {
          await sleep(0.8)
          return t.spawn({ name: 'ingest-api', description: 'POST /couriers/:id/location into Redis GEO',
            answer: 'Ingest is in: POST /couriers/:id/location validates fixes, drops stale ones, writes Redis GEO and publishes courier.location.v1. 14 tests pass.' },
          async a => {
            t.message(undefined, a.id, 'Validate lat/lng and drop fixes older than 30 s; publish courier.location.v1 on the bus.')
            await a.tool('Read', 'src/couriers/courier.controller.ts', 1)
            await a.tool('Write', 'src/tracking/ingest.controller.ts', 2)
            await a.tool('Write', 'src/tracking/position.store.ts', 1.8)
            await a.tool('Edit', 'src/app.module.ts', 1)
            await a.tool('Write', 'src/tracking/ingest.test.ts', 1.6)
            await a.tool('Bash', 'npm test -- tracking/ingest', 2.6, false, 5200)
            await a.tool('Read', 'src/tracking/position.store.ts', 0.8)
            await a.tool('Edit', 'src/tracking/position.store.ts', 1.2)
            await a.tool('Bash', 'npm test -- tracking/ingest', 2.2)
            signal('stream').open()
          })
        })(),
        (async () => {
          await sleep(1.6)
          return t.spawn({ name: 'eta-engine', description: 'ETA from live position, route and prep time, streamed over SSE',
            answer: 'ETA engine and GET /orders/:id/track (SSE) are in. ETA blends route distance, live speed and kitchen prep; it never goes below 0. 21 tests pass.' },
          async a => {
            await a.tool('Read', 'src/orders/order.service.ts', 1)
            await a.tool('Write', 'src/tracking/eta.ts', 2.4)
            await a.spawn({ name: 'test-writer', model: SCOUT, description: 'Edge-case tests for the ETA',
              answer: '9 edge-case tests: courier past drop-off, GPS jumps, stale fix, unknown order. All pass now.' },
            async w => {
              await w.tool('Read', 'src/tracking/eta.ts', 1)
              await w.tool('Write', 'src/tracking/eta.test.ts', 2)
              await w.tool('Bash', 'npm test -- tracking/eta', 2.4, false, 4800)
              w.tell(a, 'Two cases fail: the ETA goes negative once the courier is past the drop-off.')
              await sleep(0.6)
              await a.tool('Edit', 'src/tracking/eta.ts', 1.4)
              await w.tool('Bash', 'npm test -- tracking/eta', 2)
            })
            await a.tool('Write', 'src/tracking/track.sse.ts', 2)
            await a.tool('Bash', 'npm test -- tracking', 2.4)
          })
        })(),
      ])

      // Tell the web team what to build against.
      t.emit({ kind: 'agent.message', via: 'model', toName: 'customer-web lead', text: 'The stream is live: GET /orders/:id/track (SSE) sends courier.location.v1 { lat, lng, etaSec }.' })
      await t.tool('Bash', 'npm test', 3, true, 6000)

      await Promise.all([
        t.spawn({ name: 'load-test', description: 'k6: 2,000 couriers sending a fix every second',
          answer: 'At 2,100 updates/s: ingest p95 18 ms, p99 41 ms, 0 errors. Redis CPU peaked at 31%.' },
        async a => {
          await a.tool('Write', 'k6/tracking.js', 1.8)
          await a.tool('Bash', 'docker compose up -d redis postgres', 1.6)
          await a.tool('Bash', 'k6 run k6/tracking.js --vus 2000 --duration 60s', 5, true, 7000)
        }),
        t.spawn({ name: 'code-reviewer', type: 'code-reviewer', description: 'Review the tracking diff',
          answer: 'One issue: no per-courier rate limit on ingest, so one buggy phone could flood Redis. Otherwise it looks good.' },
        async a => {
          await a.tool('Bash', 'git diff --stat main', 1)
          await a.tool('Read', 'src/tracking/ingest.controller.ts', 1.2)
          await a.tool('Read', 'src/tracking/eta.ts', 1.2)
          await a.tool('Read', 'src/tracking/track.sse.ts', 1)
          a.tell(t.lead, 'Add a per-courier rate limit (5 fixes/s) to ingest; otherwise LGTM.')
        }),
      ])
      await t.tool('Edit', 'src/tracking/ingest.controller.ts', 1.4)
      await t.tool('Bash', 'npm test', 2.6, true, 5000)
      await t.tool('Bash', 'git push -u origin feat/live-tracking', 1.4)
      await t.tool('mcp__github__create_pull_request', 'Live order tracking (#214)', 1.6)
    },
    'Live tracking is built and PR #214 is open: GPS ingest into Redis GEO, an ETA engine, and one SSE stream per order. 47 tests pass, and the load test held p95 18 ms at 2,100 updates/s. Roll it out behind the tracking_v2 flag to 5% of orders in staging?',
    { after: 25, prompt: 'Yes, 5% in staging' })

    reply = await t.turn({ prompt: reply }, async () => {
      await t.tool('Edit', 'config/flags/staging.yaml', 1.2)
      await t.tool('Bash', 'npm run deploy -- --env staging', 4, true, 4000)
      await t.tool('mcp__datadog__query_metrics', 'tracking.ingest.latency p95, staging', 2.2)
    }, 'tracking_v2 is on for 5% of staging orders. With live traffic, ingest p95 is 21 ms and there are no errors. I\'ll hold there until you say go.')
    await afterwards(t, reply)
  }

  // ---------------------------------------------------------------------------
  // Team 2: the customer's tracking page, built against team 1's stream.

  async function web() {
    const t = team('story-web', WEB)
    t.start(BUILDER)
    await sleep(1)
    let reply = await t.turn({ prompt: 'Build the customer\'s live tracking page: a map with the courier, and an ETA that counts down.' }, async () => {
      await t.tool('Read', 'package.json', 0.8)
      await t.tool('Glob', 'src/pages/**/*.tsx', 0.9)
      await t.spawn({ name: 'Explore', type: 'Explore', model: SCOUT, description: 'Find the map and design-system pieces',
        answer: 'There\'s a Mapbox wrapper in src/components/Map.tsx and an EtaBadge in the design system. No live-data hook yet.' },
      async a => {
        await a.tool('Grep', 'mapbox-gl', 1.2)
        await a.tool('Read', 'src/components/Map.tsx', 1.2)
        await a.tool('Read', 'src/design/EtaBadge.tsx', 1)
      })
      // Team 1's lead says where the stream is once it's up.
      void signal('stream').then(() => t.emit({ kind: 'agent.message', via: 'peer', fromName: 'dispatch-api lead', text: 'The stream is live: GET /orders/:id/track (SSE) sends courier.location.v1 { lat, lng, etaSec }.' }))
      let ui
      await Promise.all([
        t.spawn({ name: 'ui-builder', description: 'The /track/:orderId page, live map and countdown',
          answer: 'The page renders the courier pin with smooth movement, the route and a countdown; useOrderTrack reconnects with backoff. Typecheck passes.' },
        async a => {
          ui = a
          await a.tool('Write', 'src/pages/track/[orderId].tsx', 2.2)
          await a.tool('Write', 'src/components/LiveMap.tsx', 2.4)
          await a.tool('Edit', 'src/design/EtaBadge.tsx', 1.2)
          await signal('stream')
          await sleep(1.5)
          await a.tool('Write', 'src/hooks/useOrderTrack.ts', 2)
          await a.tool('Bash', 'npm run typecheck', 2)
          await signal('e2e-red')
          await a.tool('Edit', 'src/hooks/useOrderTrack.ts', 1.6)
          await a.tool('Bash', 'npm run typecheck', 1.4)
          signal('fixed').open()
        }),
        (async () => {
          await sleep(3)
          return t.spawn({ name: 'e2e-tests', model: BUILDER, description: 'Playwright: the pin moves and the ETA counts down',
            answer: 'Playwright passes on Chromium and WebKit: the pin moves, the ETA counts down, and the page survives the stream dropping.' },
          async a => {
            await a.tool('Write', 'e2e/fixtures/track-stream.ts', 1.8)
            await a.tool('Write', 'e2e/tracking.spec.ts', 2)
            await signal('stream')
            await sleep(6)
            await a.tool('Bash', 'npx playwright test e2e/tracking.spec.ts', 4, false, 6000)
            a.tell(ui, 'The pin freezes when the stream drops: useOrderTrack never reconnects.')
            signal('e2e-red').open()
            await signal('fixed')
            await a.tool('Bash', 'npx playwright test e2e/tracking.spec.ts', 3.6)
          })
        })(),
      ])
      await t.tool('Bash', 'npm run build', 2.4, true, 4000)
      await t.tool('mcp__github__create_pull_request', 'Customer live tracking page (#88)', 1.4)
    },
    'The tracking page is ready in PR #88: a live map with the courier pin, an ETA countdown, and reconnects when the stream drops. Playwright passes on Chromium and WebKit. Should the ETA show a range (12–15 min) instead of one number?',
    { after: 45, prompt: 'One number is fine. Merge it behind tracking_v2.' })

    reply = await t.turn({ prompt: reply }, async () => {
      await t.tool('Edit', 'src/pages/track/[orderId].tsx', 1.2)
      await t.tool('mcp__github__merge_pull_request', '#88 (squash)', 1.6)
    }, 'Merged #88. The page is behind tracking_v2, so it goes live with the backend rollout.')
    await afterwards(t, reply)
  }

  // ---------------------------------------------------------------------------
  // Team 3: operations, a smaller job in the backend's repo.

  async function ops() {
    const t = team('story-ops', API)
    t.start(BUILDER)
    await sleep(1)
    const reply = await t.turn({ prompt: 'Write the on-call runbook and alerts for live tracking.' }, async () => {
      await t.tool('Read', 'docs/runbooks/README.md', 1)
      await t.tool('Read', 'infra/alerts/orders.yaml', 1)
      await t.spawn({ name: 'sre', description: 'Alerts for ingest latency, ETA lag and SSE errors',
        answer: 'Three alerts: ingest p95 over 100 ms, ETA worker lag over 30 s, SSE error rate over 2%, each linked to the runbook.' },
      async a => {
        await a.tool('mcp__datadog__list_monitors', 'service:dispatch-api', 1.8)
        await a.tool('Write', 'infra/alerts/tracking.yaml', 2)
        await a.tool('Bash', 'terraform plan -target=module.alerts', 3.4)
      })
      await t.tool('Write', 'docs/runbooks/live-tracking.md', 2.6)
    },
    'The runbook and three alerts are ready (ingest p95, ETA worker lag, SSE errors). terraform plan shows 3 to add. Apply them?')
    await afterwards(t, reply)
  }

  void backend()
  setTimeout(() => void web(), 6000 * speed)
  setTimeout(() => void ops(), 70000 * speed)

  return {
    // Your reply to a lead waiting on you. False if that lead isn't waiting.
    reply(session, text) {
      const resolve = waiting.get(session)
      if (!resolve) return false
      waiting.delete(session)
      resolve(text)
      return true
    },
  }
}

// Earlier sessions on the same projects, in the shape GET /history answers.
export function storyHistory() {
  const now = Date.now()
  const hour = 3600000
  return [
    [API, 'story-past-1', 4, 'Design the dispatch data model', 121000, 1, 3.4],
    [API, 'story-past-2', 27, 'Courier auth with device tokens', 64000, 0, 1.2],
    [WEB, 'story-past-3', 6, 'Checkout: Apple Pay and Google Pay', 152000, 1, 4.9],
  ].map(([project, session, hoursAgo, prompt, context, compactions, costUsd]) => ({
    session, project, cwd: project.id, gitBranch: 'main', model: LEAD,
    startedAt: now - hoursAgo * hour - 2 * hour, endedAt: now - hoursAgo * hour,
    prompts: [{ t: now - hoursAgo * hour - 2 * hour, text: prompt }, { t: now - hoursAgo * hour - hour, text: 'Add tests and open a PR' }],
    turns: 3 + compactions * 5, toolCalls: 60 + hoursAgo, errors: 1, tools: { Read: 30, Edit: 14, Bash: 18 },
    agents: [{ type: 'Explore', description: 'Map the code', context: 38000, tools: 16 }, { type: 'code-reviewer', description: 'Review the diff', context: 29000, tools: 9 }],
    compactions: Array.from({ length: compactions }, () => ({ trigger: 'auto', before: 166000 })),
    context, window: WINDOW, costUsd,
  }))
}
