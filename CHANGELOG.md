# Changelog

Versions of the Agent Office plugin (`agent-office@modsarena`). Each one is a
git tag (`v0.2.1`) with a GitHub Release, and the same version is in
`agent-office/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`
and both `package.json` files. `claude plugin marketplace update modsarena`
picks up a new one.

## Unreleased

- **The office follows how Claude organizes work.** Projects hold threads
  (your sessions), each thread has its lead and the agents it spawned,
  nested. The directory shows every thread's state (Working, Waiting on
  you, Needs a look) and its live team as a tree.
- **Waiting on you.** Threads whose next move is yours collect as letters
  with what they last said, and you reply right there.
- **A clipboard with a trail.** Project › thread › agent, each a way back
  up, and three tabs: Conversation (now first), Team, Details.
- **Messages between agents.** The lead to its agents, agents to each
  other, and a claude.ai project's coordinator to a thread running on your
  machine show in Activity (filter to Messages) and on the Team tab.
- **Real agent status.** A subagent holding background work stays in the
  office instead of being shown as finished, and one that stopped early
  says so.
- **Keys:** j/k walk threads and agents, 1-3 switch tabs, r replies, Esc
  goes up a level.

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
