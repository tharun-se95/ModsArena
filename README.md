# ModsArena

Claude Code mods and the tools around them.

## Agent Cluster 3D

A live 3D view of what Claude Code is doing. Each session is a glowing core. Subagents orbit it as satellites, joined by curved links that carry particles while they work. Tool calls flash in and out as small crystals around whichever agent ran them. Watch your agents fan out while you work in the terminal.

![Agent Cluster 3D](docs/agent-cluster-3d.png)

| On screen | What it is |
| --- | --- |
| Cyan core with a wireframe shell | A Claude Code session (the lead agent). It pulses on each prompt. |
| Arc around the core | Context window usage: cyan, then amber past 60%, then red past 85%. |
| Colored satellites | Subagents (`Explore`, `Plan`, your own agent types). Each type gets its own color, and finished ones dim. |
| Ring around a satellite | That agent's history. It grows with every tool call the agent finishes. |
| Small crystals | Tool calls in flight, colored by family. They flash green or red when done, then fold away. |
| Particles on links | Work in progress, flowing from the parent to whatever is busy. |

Click a node to fly to it and see its details. Drag to orbit and scroll to zoom. The panel on the right is a live activity feed.

### How it works

```
Claude Code ──(mod hooks / settings hooks)──► bridge :7337 ──(SSE)──► browser (Three.js)
```

- **`agent-cluster-3d/`** is the Claude Code mod. It hooks `session.start`, `turn.start`, `turn.complete`, `agent.spawn` and `tool.call`, so every tool call is attributed to the agent loop that made it (`agentId`) and every subagent to its parent (`parentAgentId`). Hooks run in a sandbox without Node, so events are queued in memory and flushed to the bridge every 250 ms with `$.http.fetch`. A tool call never waits on the visualizer. On session start, the mod also starts the bridge (`$.process.spawn`) if none is running.
- **`agent-cluster-3d/server/`** is the bridge. It's a single Node file with no dependencies. It accepts events on `POST /event`, keeps the last 5,000, and streams them to browsers over Server-Sent Events, replaying the backlog when a new browser connects. One bridge serves every session on the machine.
- **`visualizer/`** is the page's source: [3d-force-graph](https://github.com/vasturiano/3d-force-graph), Three.js and bloom. It's built into `agent-cluster-3d/server/public/app.js`, which is committed, so running it needs only Node.

### Run it

**As a mod (recommended).** This needs a Claude Code build with mods (function-hook plugins).

```sh
claude --plugin-dir ./agent-cluster-3d
```

Then type `/cluster3d` in the session to open the visualizer (http://127.0.0.1:7337). The status line shows `◉ cluster N agents · M tools` while work is in flight.

The mod has two options under `pluginConfigs` in settings, which you can also change from the config menu:

| Option | Default | |
| --- | --- | --- |
| `port` | `7337` | The port the bridge listens on |
| `autoStart` | `true` | Start the bundled bridge when none answers |

**With plain settings hooks (any Claude Code version).** Start the bridge yourself:

```sh
node agent-cluster-3d/server/server.mjs
```

Then merge `agent-cluster-3d/fallback/settings.json` into `~/.claude/settings.json` or `.claude/settings.json`. It pipes each hook's stdin to the bridge with `curl`, waiting at most one second, and it never blocks or fails a tool call. Subagents come from `SubagentStart`/`SubagentStop`, and tool calls are attributed through the hooks' `agent_id`. The context ring needs the mod.

**Demo, no Claude Code needed:**

```sh
node agent-cluster-3d/server/server.mjs --demo
# open http://127.0.0.1:7337
```

Add `?bloom=0` to the URL to turn off the glow on slower GPUs.

### Develop

```sh
cd visualizer && npm install && npm run build   # or: npm run watch
claude plugin validate agent-cluster-3d          # what the engine will load
claude plugin test agent-cluster-3d              # mod tests (hooks/register.test.ts)
node --test agent-cluster-3d/server/normalize.test.mjs
```

The bridge's event schema is documented at the top of `agent-cluster-3d/server/normalize.mjs`. Any other producer, such as an OpenTelemetry receiver or a transcript tailer, can `POST` the same shapes.
