# ModsArena

Claude Code mods and the tools around them.

## Agent Cluster 3D

A live 3D view of everything Claude Code is doing on your machine. Each project is an area of the map. Inside it sit your chat sessions, live and recent. Sessions run subagents, agents run tools, and every session and agent wears a gauge that shows how full its context window is. Glance at it beside your terminal to see what is in trouble, what is working, and where to look.

![Agent Cluster 3D](docs/agent-cluster-3d.png)

| On the map | What it is |
| --- | --- |
| Outlined area with a heading | A project: a git repository (worktrees included) or a folder outside one. The heading shows live sessions, working agents and the fullest window, with a red dot when something needs attention. |
| Large core with a label | A chat session, named by its first prompt. It glows while working and pulses on each prompt. |
| Small grey core | A past session from the last 14 days, read from its transcript. |
| Ring around a core | How full that context window is: green, amber past 60%, red past 85%. |
| Red halo | Over 80%. It is also listed under **Needs attention**. |
| Small colored cores | Subagents (`Explore`, `Plan`, your own agent types, teammates), on a fixed ring around the session that started them. Finished ones fade after 20 seconds. |
| Diamonds | Tool calls, right beside whoever runs them. Green when they worked, red when they failed. |
| A ring bursting outward | The context was just compacted. |

**Using it**

- **Top bar:** one chip per project with its live session count, and a red dot when it needs attention. The page opens on the project you last chose, or the busiest one. **All projects** shows everything.
- **Stat strip:** live sessions, agents working, tools running, and how many need attention, all for the project in view.
- **Click** a node or its label to select it. It is highlighted, everything else steps back, and its details open on the right. The camera stays put. **Double-click**, **F**, or **Focus** glides to it.
- **Drag** to tilt (it stays within about 50° of head-on, so nothing turns edge-on), **scroll** to zoom toward the mouse, **right-drag** to pan, and **R** or **Reset view** to frame everything again. **Esc** clears the selection.
- **Needs attention** lists anything over 80% first, fullest on top, then compactions from the last minute. Click a row to select it.
- **Activity** follows the project in view. Each line names its session and agent, and lines arrive twice a second. Hover to pause it, and use **Problems** to see only failures and compactions.
- **Details** for a session: its context gauge and what fills it (`/context` categories), turns, tool calls, errors, cost, model, branch, rate limits, working and finished subagents, compactions, and every prompt. For an agent: its gauge, task, model, tools done and who started it. For a project: every session with its fill and last activity.
- **Phones:** project chips scroll sideways, and the side column becomes a bottom sheet that starts folded.

### How each thing is measured

| What | Mod (live) | Settings hooks (fallback) | Past sessions |
| --- | --- | --- | --- |
| Project | `$.session.repo()` root, named by the bridge from `origin` | git root of `cwd` | git root of the transcript's `cwd` |
| Session context | `session.measure` (live), `turn.step` (every request) | transcript tail on each `Stop` | last main-loop request in the transcript |
| What fills it | `$.session.usage({ breakdown })` after each turn | no | no |
| Subagent context | `turn.step` inside the agent's loop | no | `subagents/*.jsonl` |
| Compactions | `session.compact`, with tokens before and after | `PreCompact` | `compact_boundary` rows |
| Cost and rate limits | `session.measure` | no | the transcript's `cost-state` row |

A request's context is what it was answered over: uncached input plus cache reads plus cache writes. The transcripts don't record the window size, so the bridge reads 1M for models with `[1m]` in their id or for any reading past 200k, and 200k otherwise.

### How it works

```
Claude Code ──(mod hooks / settings hooks)──► bridge :7337 ──(SSE)──► browser (Three.js)
~/.claude/projects/*/*.jsonl ─────────────────►   └─ GET /history
```

- **`agent-cluster-3d/`** is the Claude Code mod. It hooks `session.start`, `session.measure`, `session.compact`, `turn.step`, `turn.start`, `turn.complete`, `agent.spawn` and `tool.call`. Every tool call is attributed to the agent loop that made it (`agentId`), and every subagent to its parent (`parentAgentId`). Hooks run in a sandbox without Node, so events are queued in memory and flushed to the bridge every 250 ms with `$.http.fetch`. Context readings are coalesced so only the newest is sent, and a tool call never waits on the visualizer. On session start the mod also starts the bridge (`$.process.spawn`) if none is running.
- **`agent-cluster-3d/server/`** is the bridge. It uses only Node built-ins and has no dependencies. It accepts events on `POST /event` and keeps the last 8,000, plus the newest context reading per session and agent. It streams them to browsers over Server-Sent Events and replays the backlog when a browser connects. `GET /history` summarizes recent transcripts, cached by file modification time. One bridge serves every session on the machine. It strips any credentials from remote URLs before showing them.
- **`visualizer/`** is the page's source: [3d-force-graph](https://github.com/vasturiano/3d-force-graph), Three.js and bloom, split into `model.js` (state), `layout.js` (fixed positions), `scene.js` (how nodes look) and `hud.js` (panels). The redesign plan is in `docs/ui-revamp-plan.md`. It's built into `agent-cluster-3d/server/public/app.js`, which is committed, so running it needs only Node.

### Run it

**As a mod (recommended).** This needs a Claude Code build with mods (function-hook plugins).

```sh
claude --plugin-dir ./agent-cluster-3d
```

Then type `/cluster3d` in the session to open the visualizer (http://127.0.0.1:7337). The status line shows `◉ cluster N agents · M tools` while work is in flight. Start more sessions the same way, in any project, and they all join the same view.

The mod has two options under `pluginConfigs` in settings, which you can also change from the config menu:

| Option | Default | |
| --- | --- | --- |
| `port` | `7337` | The port the bridge listens on |
| `autoStart` | `true` | Start the bundled bridge when none answers |

**With plain settings hooks (any Claude Code version).** Start the bridge yourself:

```sh
node agent-cluster-3d/server/server.mjs
```

Then merge `agent-cluster-3d/fallback/settings.json` into `~/.claude/settings.json`. It pipes each hook's stdin to the bridge with `curl`, waiting at most one second, and it never blocks or fails a tool call. Subagents come from `SubagentStart`/`SubagentStop`, tool calls are attributed through the hooks' `agent_id`, and session context is read from the transcript after each turn. The breakdown, per-agent context, cost and rate limits need the mod.

**Demo, no Claude Code needed:**

```sh
node agent-cluster-3d/server/server.mjs --demo
# open http://127.0.0.1:7337
```

Bridge options: `--port 7337` and `--history-days 14`. Add `?bloom=0` to the page URL to turn off the glow on slower GPUs.

### Develop

```sh
cd visualizer && npm install && npm run build   # or: npm run watch
claude plugin validate agent-cluster-3d          # what the engine will load
claude plugin test agent-cluster-3d              # mod tests (hooks/register.test.ts)
node --test agent-cluster-3d/server/*.test.mjs   # bridge: schema, history, projects
```

The bridge's event schema is documented at the top of `agent-cluster-3d/server/normalize.mjs`. Any other producer, such as an OpenTelemetry receiver, can `POST` the same shapes.
