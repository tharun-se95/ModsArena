// Wiring Claude Code's settings hooks to the bridge, for Claude Code builds
// without mods. Each hook pipes its input to the bridge with curl, waits at
// most a second, and never blocks or fails what Claude Code is doing.
//
// Every command this adds ends in MARK, so removing them later touches
// nothing else in your settings.

export const MARK = '# agent-office'

// The hook events the bridge understands (normalize.mjs), and which of them
// take a tool matcher.
export const EVENTS = [
  ['SessionStart', false], ['SessionEnd', false], ['UserPromptSubmit', false], ['Stop', false],
  ['SubagentStart', false], ['SubagentStop', false], ['PreToolUse', true], ['PostToolUse', true],
  ['PostToolUseFailure', true], ['PreCompact', false],
]

export const hookCommand = port =>
  `curl -s --max-time 1 -X POST http://127.0.0.1:${port}/event -H 'content-type: application/json' --data-binary @- >/dev/null 2>&1 || true ${MARK}`

// The hooks block on its own, as fallback/settings.json holds it.
export function fallbackHooks(port = 7337) {
  const hooks = {}
  for (const [event, matched] of EVENTS) {
    hooks[event] = [{ ...(matched ? { matcher: '*' } : {}), hooks: [{ type: 'command', command: hookCommand(port) }] }]
  }
  return { hooks }
}

const ours = hook => typeof hook?.command === 'string' && hook.command.includes(MARK)

// A copy of `settings` without any hook this tool added, dropping groups and
// events left empty. Everything else is kept as it was.
export function removeHooks(settings) {
  const next = structuredClone(settings ?? {})
  if (!next.hooks || typeof next.hooks !== 'object') return next
  for (const [event, groups] of Object.entries(next.hooks)) {
    if (!Array.isArray(groups)) continue
    const kept = groups
      .map(group => ({ ...group, hooks: (group.hooks ?? []).filter(hook => !ours(hook)) }))
      .filter(group => group.hooks.length > 0)
    if (kept.length) next.hooks[event] = kept
    else delete next.hooks[event]
  }
  if (Object.keys(next.hooks).length === 0) delete next.hooks
  return next
}

// A copy of `settings` with this tool's hooks for `port`, replacing any it
// added before (so running it twice, or with a new port, leaves one set).
export function addHooks(settings, port = 7337) {
  const next = removeHooks(settings)
  next.hooks ??= {}
  for (const [event, groups] of Object.entries(fallbackHooks(port).hooks)) {
    next.hooks[event] = [...(next.hooks[event] ?? []), ...groups]
  }
  return next
}

export const hasHooks = settings =>
  Object.values(settings?.hooks ?? {}).some(groups => Array.isArray(groups) && groups.some(group => (group.hooks ?? []).some(ours)))
