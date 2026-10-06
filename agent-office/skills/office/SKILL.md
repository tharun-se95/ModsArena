---
name: office
description: Open Agent Office, the live view of your Claude Code sessions and subagents, in the browser. Use when the person asks to open, show or check the office, or types /office where that command isn't listed.
---

# Open Agent Office

Agent Office is a page served by a small local bridge at http://127.0.0.1:7337 (another port if the person set the plugin's `port` option). In a Claude Code session where the plugin's hooks run, the `/office` command does all of this by itself; this skill is the way in from anywhere the command isn't listed.

1. If the person said `status`, run `node "${CLAUDE_PLUGIN_ROOT}/server/cli.mjs" status` and report what it prints. Stop there.
2. Otherwise start the bridge and open the page with `node "${CLAUDE_PLUGIN_ROOT}/server/cli.mjs"`. Run it in the background: when no bridge is running it starts one in that process, which has to keep running for the office to stay up. When one is already running it opens the page and exits.
3. Wait for the line that starts "Agent Office is" and pass it on: either "Agent Office is open at …" or "Agent Office is already running at …". Give the address as a link in case no browser opened.

If `node` is missing or older than 18, say so and point to https://nodejs.org. If the command can't run here at all, or this shell isn't on the person's own computer (a cloud or sandboxed session, where 127.0.0.1 is not their machine), don't start anything: tell them to run `npx github:tharun-se95/ModsArena` in a terminal on their computer, which starts the bridge and opens the office.
