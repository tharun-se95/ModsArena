# Changelog

Versions of the Agent Office plugin (`agent-office@modsarena`). Each one is a
git tag (`v0.2.1`) with a GitHub Release, and the same version is in
`agent-office/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`
and both `package.json` files. `claude plugin marketplace update modsarena`
picks up a new one.

## Unreleased

- **Chat reads cleanly.** A message you send from the office shows as you
  wrote it, without the framing Claude Code adds, and its "Queued" or
  "Sent" placeholder goes once it lands. Messages to a subagent now show
  in its transcript too.
- **Finished subagents can be picked.** A session's clipboard lists the
  subagents that have finished, so you can open one's transcript and ask
  it something.
- **No phantom helpers.** An agent seen only through its tool calls, like
  Claude Code's own helpers, no longer stays "helping" forever.
- **No "unknown" session.** A context reading the engine makes before the
  session has started no longer shows up as a session of its own.
- **What you asked is what you asked.** A background task reporting in no
  longer shows up as a prompt, and a session the page first read from
  history doesn't list its first prompt twice.

## 0.3.1

- **Agent Office has a logo.** A floor plan of the office, a room per
  project with a critter in each, set as the plugin's `icon`. The
  ModsArena marketplace has a market-stall logo in the README.

## 0.3.0

- **Talk to your agents.** A critter's clipboard has a Transcript tab: its
  conversation, live, read from the transcript Claude Code keeps (past
  sessions and subagents too). A box at the bottom sends a message: to a
  session as its next prompt, to a subagent directly.
- **The bridge is locked down.** Every request must be addressed to the
  bridge itself (no DNS rebinding). Browser requests that change anything
  must come from the office page. Sending a message needs a token made
  fresh each run and given only to the office page.

## 0.2.1

- The README opens with a demo GIF: the office at work, a glide into a room,
  and a hover bubble.
- Fixed the hosted demo corrupting its own code: the site build inlined the
  page's script with a string replacement, where `$$` collapses to `$`, so
  costs in the hover bubble lost their "$". The build now inserts the script
  verbatim and refuses to write a page whose script doesn't match.

## 0.2.0

- Install from this repository's marketplace:
  `/plugin marketplace add tharun-se95/ModsArena`, then
  `/plugin install agent-office@modsarena`.
- Renamed from `agent-cluster-3d` to `agent-office`, and `/cluster3d` to
  `/office`.
- `/office` checks for Node 18+, starts the bridge, waits for it and opens the
  office in one go; `/office status` says what's running. A one-time toast
  tells new users about `/office`.
- `npx github:tharun-se95/ModsArena` starts the bridge without cloning, with
  `demo`, `status`, and `install-hooks` / `uninstall-hooks` for Claude Code
  builds without mods.
- A hosted demo on GitHub Pages, CI on every pull request, a quick-start
  README with troubleshooting, and the MIT license.

## 0.1.0

- The first version, as Agent Cluster 3D: a Claude Code mod, a
  dependency-free Node bridge and a Three.js page showing every project,
  session, subagent and tool call as a living office, with context rings,
  hover bubbles, coffee breaks, floating panels, light and dark themes, and
  sounds with a mute button.
