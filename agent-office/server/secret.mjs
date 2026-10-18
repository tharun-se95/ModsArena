// Who may use the bridge. The bridge listens on this computer only, but on
// a shared computer every account can reach 127.0.0.1. So the bridge keeps a
// secret in your own Claude Code folder, readable by you alone:
//
//   ~/.claude/agent-office/secret    32 random bytes, hex (0600)
//   ~/.claude/agent-office/headers   the same as a curl header line, for
//                                    the settings hooks (curl -H @file)
//
// From it come three things, none of which gives the secret away:
//
//   - the mod and the hooks send it as a header when they report events
//     and pick up messages, so only your own sessions can feed or read the
//     office's inbox;
//   - the bridge proves it knows it, answering a nonce with
//     sha256(secret:nonce), so your sessions never report to another
//     account's program squatting the port;
//   - the office page opens with a key (sha256(secret:open)) that the mod
//     and the CLI put in the URL; the bridge swaps it for a cookie only it
//     can read, so a browser without it gets a page saying how to open it.

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

export const SECRET_HEADER = 'x-agent-office-secret'
export const COOKIE = 'agent_office'

export const officeDir = (env = process.env) => join(env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude'), 'agent-office')

// The secret, made the first time (readable by this account only).
export function loadSecret(dir = officeDir()) {
  const file = join(dir, 'secret')
  try {
    const text = readFileSync(file, 'utf8').trim()
    if (/^[0-9a-f]{64}$/.test(text)) return text
  } catch {}
  const secret = randomBytes(32).toString('hex')
  mkdirSync(dir, { recursive: true, mode: 0o700 })
  writeFileSync(file, `${secret}\n`, { mode: 0o600 })
  writeFileSync(join(dir, 'headers'), `${SECRET_HEADER}: ${secret}\n`, { mode: 0o600 })
  // An existing folder keeps its mode; make sure the files are ours alone.
  try { chmodSync(file, 0o600); chmodSync(join(dir, 'headers'), 0o600) } catch {}
  return secret
}

export const proof = (secret, nonce) => createHash('sha256').update(`${secret}:${nonce}`).digest('hex')

// The key that opens the office page, and the cookie it becomes.
export const openKey = secret => proof(secret, 'open')
export const cookieValue = secret => proof(secret, 'cookie')

export function same(given, expected) {
  if (typeof given !== 'string' || typeof expected !== 'string') return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function cookieOf(header) {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([0-9a-f]{64})`).exec(String(header ?? ''))
  return m?.[1]
}
