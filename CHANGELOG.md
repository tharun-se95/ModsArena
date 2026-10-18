# Changelog

Versions of the Agent Office plugin (`agent-office@modsarena`). Each one is a
git tag (`v0.2.1`) with a GitHub Release, and the same version is in
`agent-office/.claude-plugin/plugin.json`, the marketplace's
`metadata.version` and both `package.json` files. With auto-update on for
modsarena (`/plugin` → Marketplaces), a new one arrives on its own;
otherwise `claude plugin update agent-office@modsarena` fetches it.

## 0.15.0

The release candidate for 1.0: nothing new to learn, fewer ways to lose
what you were doing.

- **Updates keep your jobs and messages.** When a new version's bridge
  takes over, it now also takes the jobs the old one was following (their
  cards keep updating, and **Stop** still works) and any message you sent
  that a session hadn't picked up yet. Before, those were lost in the swap.
- **A swap can't be cut short.** If a session started its own bridge on the
  port in the moment between the old one stepping down and the new one
  starting, the new one now asks that one to step down too, instead of
  giving up and losing what it was handed.
- **Settings hooks checked on Windows.** CI now runs the settings hooks'
  exact command through bash against a real bridge on Linux, macOS and
  Windows (Git Bash, which Claude Code runs hooks with there), with and
  without your secret.

## 0.14.0

Ready for people who've never seen it. Agent Office now needs **Node 20 or
newer** (Node 18 is past its end of life).

- **The demo never shows your sessions.** `npx github:tharun-se95/ModsArena
  demo` opens without signing in, but it also listed your own past sessions
  (their titles and projects) next to the sample ones. It now shows sample
  activity only.
- **`doctor`.** `npx github:tharun-se95/ModsArena doctor` checks what Agent
  Office needs, one line each: Node, Claude Code, the bridge (and that it's
  yours), your secret, and the hooks. It says what to fix, and prints a
  report to paste into a bug report.
- **Easier on your laptop.** The office draws at most 60 frames a second.
  When nothing has happened for 30 seconds, or you're in another window, it
  idles at 15. **Save battery** turns itself on while a laptop runs on
  battery (in Chrome and Edge), until you choose in Settings.
- **Windows.** `/office` can now find and restart an old bridge on Windows
  too.
- **A new README.** It covers what the office is, what it needs, how to
  install it (with what you should see at each step), and what you can do
  with it. It adds what it reads and what it never sends anywhere,
  updating, troubleshooting, and how to uninstall, with what's left
  behind. The full tour moved to [docs/guide.md](docs/guide.md), which now
  covers running work and deleting conversations.
- **[Compatibility and stability](docs/compatibility.md):** what Agent
  Office runs on, and what won't change without a major version.
- **For contributors:**
  - [CONTRIBUTING.md](CONTRIBUTING.md) and issue templates (a bug report
    asks for doctor's output).
  - Every pull request now runs:
    - the office end to end in a real browser;
    - the bridge tests on Linux, macOS and Windows, and on Node 20, 22
      and 24;
    - lint;
    - a check that changes users install bump the version.
  - The demo site publishes only after CI passes.
  - Actions are pinned to commits, with Dependabot keeping them current.
  - A daily canary checks the plugin against the newest Claude Code.

## 0.13.0

Trust and stability. After updating, run `/office` once: it restarts the
office and opens it signed in.

- **The office is yours alone.** On a shared computer every account can
  reach 127.0.0.1, so the bridge now keeps a secret in
  `~/.claude/agent-office/` that only your account can read. Your sessions
  send it with everything they report, and they send nothing until the
  bridge on the port has proved it knows it, so another account's program
  there gets nothing. The page opens with a key made from it (`/office` and
  the CLI put it in the address) and the browser then stays signed in; any
  other browser gets a page saying how to open it.
- **The office no longer resets when a session ends.** The bridge used to
  stop with whichever session happened to start it. It now runs on its
  own, keeps a log (`~/.claude/agent-office/bridge.log`), and stops by
  itself after 30 minutes with nobody watching and nothing reporting.
- **An open office survives a restart.** After the bridge restarts, the page
  picks up the new connection and keeps sending; after an update it reloads
  to match the new version.
- **No WebGL, no problem.** Where the browser can't draw 3D (switched off,
  a VM, remote desktop), the office says so and everything else works: the
  inbox, your projects and threads, every conversation.
- **Everything that reaches the page is checked.** The bridge keeps only
  plain, well-formed fields from each event (web links only, ids that are
  ids, capped lengths), and the page escapes every one it shows.
- **Steadier under load.** One `claude agents` check at a time, jobs Claude
  Code no longer lists are marked lost instead of polled forever, history
  scans are shared between pages and capped at a year, huge transcripts are
  read in 2 MB steps, and a page that stops reading is let go.
- **Nothing loads from elsewhere.** The fonts ship with the office.
- **Easier to diagnose.** `/office status` reports errors and where the log
  is; `AGENT_OFFICE_DEBUG=1` logs every request.
- Smaller hardening: resumed session ids and job titles can never be read as
  options, a symlinked `.claude/agents` can't redirect a new agent file,
  and a restart stops only the process that actually holds the port.

## 0.12.2

A safety patch. Please update.

- **Claude's replies can't run code in the office any more.** A link in a
  reply crafted a certain way (text Claude read in a repo or on a web page
  could carry one) could add script to the conversation view. Links are now
  built from the raw text in one pass, so nothing a reply says can reshape
  the page, and a test runs a set of hostile replies on every change.
- **The page runs only its own script.** It now carries a strict
  Content-Security-Policy and can't be framed by another page, so a mistake
  like the one above can't run, and a page elsewhere can't trick a click.
- **One bad request can't stop the office.** A malformed request (which a
  page on another local port could send) used to crash the bridge for every
  session. It's now answered with an error, and the bridge keeps serving.
- **The office only listens on this computer.** `--host` refuses any
  address other than 127.0.0.1, ::1 or localhost.
- **Releases wait for CI.** A release now runs every CI check on its commit
  first, one release at a time.
- **SECURITY.md** says how to report a vulnerability privately.

## 0.12.1

- **A message box like Claude Code's.** A chip on top says who it goes to
  (the critter's colour, its name, the thread, and whether it's live or
  will be picked up again), the words go in a rounded box with the send
  key inside it that grows as you write, and a quiet line of hints sits
  under it.
- **"Login expired" is shown as a problem, not an answer.** When Claude
  Code can't answer (its sign-in expired, it's busy renewing it in another
  window, a usage limit, an API error), it writes its own error line where
  Claude's reply would go. The office used to show that line as Claude's
  answer. Now the conversation and the inbox card say what went wrong and
  what to do: for an expired sign-in, run `claude` in a terminal, type
  `/login`, then send your message again.

## 0.12.0

- **Talk to a session that has ended.** Its message box stays open: what
  you send picks the same session up again in the background, in its own
  folder (`claude --bg --resume`), and its critter comes back to its desk
  to answer in the same conversation.
- **New projects.** On the front desk, **New project** starts a job in a
  folder the office hasn't seen yet, or makes one inside your home folder.
  Claude Code only works in folders you've trusted, and the office never
  trusts one for you: if it isn't yet, the desk shows the one command to
  run once (`cd <folder> && claude`, then say yes), and the job starts when
  you press Start again.
- **New threads and helpers.** A **+** beside each project starts a new
  thread there. A thread's **⋯** menu can **bring in a helper**: pick an
  Explorer, a Planner, an All-rounder or one of your own agent types, say
  the task, and the thread starts a subagent for it.
- **Your own agent types.** **New agent type** on a project's **⋯** menu
  describes a kind of agent once (name, when to use it, instructions, and
  optionally its tools) for that project or all of them. It's saved where
  Claude Code reads agents (`.claude/agents/<name>.md`), never over one
  that's there.
- **Remove or delete.** Every project, thread and agent has **Remove from
  office**: it's put away, with Undo, and Settings lists what's removed to
  bring back. **Delete for good…** asks once more, then deletes its saved
  conversation (Claude Code's transcripts). A project's files are never
  touched, and a session still open in a terminal is left alone.

## 0.11.3

- **A conversation you can read.** The Conversation tab goes turn by
  turn: what you said, Claude's work folded to one line ("Looked through
  3 files, searched the code… · 8 steps"), then its answer in full across
  the panel. Older long answers fold to their opening lines with Show
  all; the work opens to every note and step, and stays open while it
  runs.
- **A steady office.** Rooms keep their places: a new project takes the
  next spot instead of reshuffling the others, and a refresh draws the
  same office. Threads keep their desks.
- **No more flicker.** Name labels and the hover bubble stay put while
  you point at them, and crowded labels no longer swap back and forth.

## 0.11.2

- **`/office` restarts the office.** Run it while the office is up and it
  restarts with your current copy: the running bridge hands over what it
  shows (so nothing resets) and steps down, whichever version it is and
  however it was started. An older bridge that can't step down is found by
  the port it holds, checked to be an Agent Office bridge, and stopped;
  nothing else ever is.
- **Replies read like replies.** Claude's answers in the conversation are
  drawn from their markdown: headings, lists, bold, code, tables, quotes
  and links, instead of raw `**` and `|`.
- **A quieter panel in your critter's colour.** The clip tab and heavy
  border are gone; an open thread or agent tints the panel's border, top
  and active tab in its critter's colour.

## 0.11.1

- **One right-hand panel.** The Projects list and a thread's clipboard
  share one frame: full height, half as wide again as before, and only
  what's on it swaps as you pick a thread or agent. Drag its left edge to
  resize it (it remembers); the office holds still while you drag and
  settles once you let go, and a wide panel no longer pushes it down.
- **A clearer tree.** Projects head their sections, threads hang off a
  line from their project, each thread's team hangs off the thread, and
  ended threads under Earlier are dimmed.
- **Crabs or Claude bots.** Settings → Critters names the earlier blocky
  design "Claude bots".

## 0.11.0

- **Robot crabs.** The critters are now little robot crabs, after the
  Claude Bot mascot: a cream shell, a glossy visor whose glowing eyes are
  their face, big pincers and six jointed legs. Each wears its thread's
  colour on its claws, legs and paint chips.
- **One for every job.** Each kind of helper has its own kit: the lead
  carries its gem, researchers a backpack, planners a beret, reviewers
  round glasses and testers headphones; builders are plain crabs.
- **Faces that show how it's going.** Happy while working, a thinking
  look between tools, laughing when it cheers, sad when it sulks,
  surprised when its context is nearly full and sleepy when it rests.
- **Prefer the blocks?** Settings → Critters switches back to the classic
  block critters.

## 0.10.0

- **Make it yours.** Pick an office theme in Settings: Cozy (today's look),
  Studio or Space station. Give each room a wall colour and decor (plants,
  books, art or lamps) from its sign, and give any critter its own colour
  from the dot by its thread's name.
- **A bigger clipboard.** It opens larger, you can drag its edge to resize
  it (it remembers the size), and on narrow screens it becomes a sheet
  along the bottom.
- **Quieter scrollbars** that follow the theme.
- **Sound you can live with.** A volume slider and quiet hours.
- **One-line summaries.** Each thread gets a short summary of what it's
  doing, built from its events, with no extra tokens.

## 0.9.0

The v1.0 candidate, for review before 1.0.

- **Show the work.** Questions, checklists, pictures and outputs appear in
  the office as bubbles and cards; every thread shows "3 of 7 done"; a
  Today recap says what got done, to copy or save as a picture.
- **Plain words.** Work is described the way a person would say it, with a
  Developer view switch for the raw lines. Projects get friendly names and
  icons, threads are titled by their goal, and the feed leads with
  outcomes.
- **Run the office.** Start new jobs from the front desk, answer Claude's
  questions from the office, drag a letter onto a critter to pass it on,
  and Wrap up, Explain or Stop a thread.
- **A team with personality.** Critters have names, roles and moods;
  milestones decorate each room; a finished thread rings a bell; snapshot
  the office to share it.
- **For everyone.** A guided first run, a friendly empty office, alerts
  when something waits on you, spend in plain terms, a phone check-in
  view, an accessibility pass and a battery saver.
- **Setup in one step.** Install, then type `/office`. The first time,
  Agent Office offers `/office auto-update`, one command that turns on
  auto-update so new versions arrive on their own (no hunting through
  `/plugin` menus). The same switch is **Updates: automatic** in the
  office's Settings menu and `npx github:tharun-se95/ModsArena auto-update`
  in a terminal. It backs up your Claude Code settings first and changes
  only that one switch. `/office status` and the bridge's `/healthz` say
  whether updates are automatic, and a missing or old Node is explained in
  plain words.

## 0.5.0

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

## 0.4.0

- **Updates that take.** After an update, the next session swaps the
  running bridge for the new one (or `/office` does, if the office is
  open), so you see the new page. `/office status` shows the bridge's
  version. Bridges you start yourself are never touched.
- The README, the release notes and the first-run toast say how to turn on
  auto-update, which Claude Code leaves off for this marketplace.
- The plugin's version lives in `plugin.json` only, not in its marketplace
  entry, where Claude Code would ignore it.
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
- **Smooth, steady camera.** Moving and zooming around the office glides
  instead of jumping, the view stays at one fixed angle, and walls and
  trim no longer flicker as you move.
- **A finished look.** Hardwood floors, carpet and tile with real texture,
  wood-grain furniture, glazed, metal and satin finishes, and a soft studio
  light that glass and metal reflect.
- **An `office` skill.** `/office` only exists once the plugin's hooks run in
  a session, so the Claude app's menu didn't list it. The `agent-office:office`
  skill is always listed and starts the bridge and opens the office the same
  way.

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
