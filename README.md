# ModsArena

Claude Code mods and the tools around them.

## Agent Cluster 3D

A live office of everything Claude Code is doing on your machine. Each project gets its own cozy room on the office floor. Your chat sessions are colorful critters, each on its own rug in front of a desk whose monitor scrolls code while it works, live ones awake and recent ones resting. Each subagent is a smaller critter standing behind the session that started it, and every tool call makes its caller hop. Around the floor, plain sentences tell you what's happening, what needs a look, and what each session has been working on.

![Agent Cluster](docs/agent-cluster-3d.png)

| In the office | What it is |
| --- | --- |
| The office | Carpet tiles, outer walls with tall windows, plants that sway, a water cooler and a robot vacuum doing laps of the open floor, all around the rooms. The windows follow your local time (dawn, day, golden hour, dusk, night), the lamps glow brighter after dark, and the wall clock shows the time. The floor arranges itself to fill your window. |
| Coffee corner | A shared kitchenette: a counter with a steaming coffee machine and a row of mugs, a fridge, and a round table with stools. Finished subagents walk here along the aisles, pick up a mug, take a few sips, and then head off. |
| Room | A project: a git repository (worktrees included) or a folder outside one. Each room has a wooden floor, walls in its own color, and furniture (a bookshelf, a window, plants, a lamp, sometimes a couch). What a room holds and its wall color come from the project's name, so it always looks the same. Its sessions sit in a small grid. Click the sign over the back wall to zoom in, and press Esc to see every room again. |
| Critter on a rug, with a gold gem | A live chat session, named by its first prompt. Each session gets its own color. Its desk's monitor scrolls code while it works, dims while it waits, and is off for past sessions. Its legs patter while it works, and the gem glows and spins faster. It hops on each prompt and each tool call, and it turns toward the subagent that acted last. |
| Ring on the rug around it | How full that context window is: green, then amber past 60%, then red past 85%. A pulsing red ring, and both arms up, mean it's past 80% and will compact soon. |
| Smaller critters behind its desk | Subagents, standing in a row behind the desk (then a second row, then either side), so they never overlap. Each type has its own color and build: **Explore** is sky blue, low and wide, with a periscope; **Plan** is lilac and tall on two legs, with a cap; **code-reviewer** is pink and wears glasses; **test-runner** is mustard with six legs and antennae; and **general-purpose** is the plain green critter. Your own agent types get a color from their name. They drop in when started (the session waves hello), and when finished they wave goodbye and walk to the coffee corner. |
| Grey critter with closed eyes | A past session from the last 14 days, read from its transcript. Each room shows the three most recent, and its sign counts the rest. Untick **Past sessions** to hide them. |
| Bead rising off a critter | A tool call, colored by what it does: reads sky blue, edits coral, searches green, web lookups lilac, shell commands mustard, handoffs teal. A red bead means the call failed. |
| Ripple across the rug | The session just compacted its context. |
| A session walking in | A session that starts while you watch walks in from the front of the office to its desk. |
| Confetti | The session just finished a turn. |
| Red "!" and a wobble | A tool call just failed. |
| "zzz" | A session that's been idle for two minutes has dozed off, and past sessions are asleep. |
| Steam over a desk mug | That session is working right now. |
| A wave | Two critters passing each other on the way in or to coffee say hi. |

**Sounds:** soft key taps when a tool runs, a two-note chime when a turn finishes, a bonk when a call fails, a pop when a helper arrives, a chirp when critters wave, a clink at the coffee corner and a hush on compaction. They're synthesized in the browser (no audio files), start after your first click or key press, and the **Sound** button in the header mutes them (it remembers your choice).

Hover any critter for a bubble with what it is and what it's doing: its status, the tool it's running, its context use, model and tool calls, and who it works for. Session names and room signs stay small and quiet, and a name that would collide with another steps aside. Click a session to open its details:

- its context use and what fills it (the `/context` breakdown);
- turns, tool calls, errors, cost, model and rate limits;
- who is helping now, the files it has read and edited, its recent actions in plain words, and what you asked it.

The left column says what's going on in a sentence or two, lists what **needs a look** (anything past 80% and recent failures; click one to open it), and keeps a log of moments: subagents starting and finishing, failures, compactions.

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
- **`visualizer/`** is the page's source, in plain Three.js: `model.js` turns events into projects, sessions, agents and tools; `words.js` turns the same events into sentences; `table.js` lays out the office and animates the critters (`office.js` builds the rooms, desks, coffee corner and office shell; `character.js` builds each critter); and `panels.js` writes the columns around it. Colors come from CSS tokens on the page, so it follows your light or dark setting. It's built into `agent-cluster-3d/server/public/app.js`, which is committed, so running it needs only Node.

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

Bridge options: `--port 7337` and `--history-days 14`.

### Develop

```sh
cd visualizer && npm install && npm run build   # or: npm run watch
claude plugin validate agent-cluster-3d          # what the engine will load
claude plugin test agent-cluster-3d              # mod tests (hooks/register.test.ts)
node --test agent-cluster-3d/server/*.test.mjs   # bridge: schema, history, projects
```

The bridge's event schema is documented at the top of `agent-cluster-3d/server/normalize.mjs`. Any other producer, such as an OpenTelemetry receiver, can `POST` the same shapes.
