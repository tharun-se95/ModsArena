---
name: office
description: Open Agent Office, the live view of your Claude Code sessions and subagents, in the browser. Use when the person asks to open, show or check the office, to turn its auto-update on or off, or types /office where that command isn't listed.
---

# Open Agent Office

Agent Office is a page served by a small local bridge at http://127.0.0.1:7337 (another port if the person set the plugin's `port` option). In a Claude Code session where the plugin's hooks run, the `/office` command does all of this by itself; this skill is the way in from anywhere the command isn't listed.

1. Check Node first with `node --version`. If `node` is missing or older than 18, don't go on: say Agent Office needs Node 18 or newer, a free program it runs on, and that they can install the LTS version from https://nodejs.org, then restart Claude Code and ask again.
2. If the person said `status`, run `node "${CLAUDE_PLUGIN_ROOT}/server/cli.mjs" status` and report what it prints. Stop there.
3. If the person asked for auto-update (new versions arriving on their own), run `node "${CLAUDE_PLUGIN_ROOT}/server/cli.mjs" auto-update` (add `off` if they want it off) and pass on what it prints. Stop there.
4. Otherwise start the bridge and open the page with `node "${CLAUDE_PLUGIN_ROOT}/server/cli.mjs"`. Run it in the background: when no bridge is running it starts one in that process, which has to keep running for the office to stay up. When one is already running it opens the page and exits.
5. Wait for the line that starts "Agent Office is" and pass it on: either "Agent Office is open at …" or "Agent Office is already running at …". Give the address as a link in case no browser opened.

If the command can't run here at all, or this shell isn't on the person's own computer (a cloud or sandboxed session, where 127.0.0.1 is not their machine), don't start anything: tell them to run `npx github:tharun-se95/ModsArena` in a terminal on their computer, which starts the bridge and opens the office.
