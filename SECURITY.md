# Security

Agent Office runs on your own computer: a small Node bridge on 127.0.0.1
reads your Claude Code transcripts and can, at your request from its page,
message your sessions, start background jobs and delete transcripts. We take
anything that could let someone else do those things seriously.

## Reporting a vulnerability

Please report it privately, not in a public issue:

- **GitHub:** [Report a vulnerability](https://github.com/tharun-se95/ModsArena/security/advisories/new)
  (Security → Advisories → Report a vulnerability).

Include the version (`/office status` shows it), your OS and browser, and the
steps or a proof of concept. You'll get an answer within a week. Once a fix
ships, the advisory is published with credit to you, unless you'd rather not.

## Supported versions

Only the latest release gets fixes. Agent Office updates through its Claude
Code marketplace, so `/office auto-update` (or `claude plugin update
agent-office@modsarena`) is how you get them.

## What the office protects

- It listens on this computer only (127.0.0.1, ::1 or localhost), and refuses
  any other address.
- Every request must be addressed to the bridge itself (no DNS rebinding),
  and anything that changes something needs the page's per-run token and its
  own origin.
- The page runs only its own script (a Content-Security-Policy), can't be
  framed, and reaches only the bridge.
- Jobs start Claude Code without a shell and without any permission flags:
  anything a job needs your OK for still waits for you.
- Deletes only ever remove Claude Code's transcripts under
  `~/.claude/projects`, never project files.

Nothing is sent anywhere else by the bridge. The page loads its fonts from
Google Fonts, for now.
