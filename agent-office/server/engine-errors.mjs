// When Claude Code can't get an answer (its sign-in expired, the service is
// busy, a limit was reached), it writes its own error line into the
// conversation where Claude's reply would go: "Login expired · Please run
// /login". The office shows those as a problem with what to do about it,
// never as something Claude said. Pure, shared by the bridge and the page.
//
//   engineError(text) -> { kind, title, fix, line } | null

const RULES = [
  {
    kind: 'busy-login',
    test: /another Claude Code process is refreshing/i,
    title: 'Claude Code couldn’t renew its sign-in',
    fix: 'Another Claude Code window was renewing it at the same moment. Send your message again in a minute.',
  },
  {
    kind: 'login',
    test: /please run \/login|login expired|oauth token (has )?(expired|revoked)|not logged in|invalid api key|sign in again|re-?authenticate/i,
    title: 'Claude Code’s sign-in has expired',
    fix: 'Open a terminal, run claude, type /login and sign in. Then send your message again; this session picks it up from there.',
  },
  {
    kind: 'limit',
    test: /usage limit|limit reached|rate.?limit|quota/i,
    title: 'Claude Code hit a usage limit',
    fix: 'It can answer again once the limit resets. Send your message again then.',
  },
  {
    kind: 'api',
    test: /^api error\b|overloaded|internal server error|connection error|request timed out/i,
    title: 'Claude Code couldn’t reach Claude',
    fix: 'Usually a passing hiccup. Send your message again in a moment.',
  },
]

export function engineError(text, { isError = false } = {}) {
  const line = String(text ?? '').trim()
  if (!line) return null
  // Not marked as an error (a turn's last words): only Claude Code's own
  // short lines, "Login expired · Please run /login" or "API Error: …", so
  // a reply that mentions a login or a rate limit stays Claude talking.
  if (!isError && (line.length > 300 || !/^[^\n]{1,120} \u00b7 [^\n]+$|^API Error\b/.test(line))) return null
  const rule = RULES.find(r => r.test.test(line))
  if (rule) return { kind: rule.kind, title: rule.title, fix: rule.fix, line: line.slice(0, 300) }
  return isError ? { kind: 'api', title: 'Claude Code couldn’t get an answer', fix: 'Send your message again in a moment. If it keeps happening, open the session in Claude Code to see why.', line: line.slice(0, 300) } : null
}
