# Compatibility and stability

## What Agent Office runs on

| | Supported | How we know |
| --- | --- | --- |
| **Claude Code** | Builds with mods (plugins with hooks). Older builds: the [settings hooks](../README.md#settings-hooks) fallback. | CI validates and tests the plugin against a pinned Claude Code on every change, and a daily canary does the same against the newest release, so a change on Claude Code's side shows up within a day. |
| **Node** | 20, 22 and 24 (current LTS lines). Older ones are refused with a message saying what to install. | The bridge tests run on each in CI. |
| **Operating system** | macOS, Linux and Windows. | The bridge tests run on all three in CI, including the settings hooks' command run through bash against a real bridge: on Windows that's Git Bash, the shell Claude Code runs hooks with there. The plugin itself needs no shell. |
| **Browser** | Current Chrome, Edge, Firefox and Safari. Without WebGL the rooms don't draw; everything else works. | The office is tested end to end in Chromium in CI, with and without WebGL. |

Agent Office runs on the computer whose sessions it shows. Sessions running in the cloud never touch your computer, so it can't see them.

Only the latest release gets fixes, including security fixes. Agent Office updates through its Claude Code marketplace: turn on `/office auto-update` to always have it.

## Stability

From 1.0, Agent Office follows [semantic versioning](https://semver.org). The things below are its public surface: they don't change in a way that breaks you without a new major version, and anything going away is marked deprecated in the [CHANGELOG](../CHANGELOG.md) at least one minor release before.

- **The event schema** a producer sends to `POST /event`, documented at the top of [`agent-office/server/normalize.mjs`](../agent-office/server/normalize.mjs): its kinds and their fields. New kinds and new optional fields can arrive in any minor release; a producer should ignore what it doesn't know.
- **Talking to the bridge as a producer:** `POST /event` with the `x-agent-office-secret` header, the secret in `~/.claude/agent-office/secret` (or under `$CLAUDE_CONFIG_DIR`), and `GET /healthz?nonce=` answering `{ name: "agent-office", version, proof }` with `proof = sha256("<secret>:<nonce>")` in hex.
- **The plugin's options:** `port` and `autoStart`.
- **The commands:** `/office` and its subcommands (`status`, `auto-update`, `auto-update off`), and the CLI: `npx github:tharun-se95/ModsArena [open | demo | status | doctor | auto-update | install-hooks | uninstall-hooks]` with `--port`, `--project` and `--no-open`.
- **Where it keeps things:** `~/.claude/agent-office/` (the secret, the `headers` file the settings hooks read, `bridge.log`).
- **What it touches:** it reads Claude Code's transcripts; it writes only what you ask for on the page (messages, jobs, agent types under `.claude/agents/`, and deleting transcripts you choose), plus the settings changes `install-hooks` and `auto-update` make, always after a backup.

Not part of it, free to change in any release: how the office looks and what it draws, the page's own requests to the bridge (`/stream`, `/history`, `/transcript`, `/chat` and the rest), the bridge's internals and log format, and the hosted demo.
