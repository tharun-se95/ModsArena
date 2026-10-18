// For tests: the credentials of the account a test bridge runs as (its
// CLAUDE_CONFIG_DIR), read once the bridge has made them (secret.mjs).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cookieValue, SECRET_HEADER } from './secret.mjs'

export function credentials(configDir) {
  const secret = () => readFileSync(join(configDir, 'agent-office', 'secret'), 'utf8').trim()
  return {
    secret,
    // What your sessions send, and what a signed-in office page sends.
    session: () => ({ [SECRET_HEADER]: secret() }),
    page: () => ({ cookie: `agent_office=${cookieValue(secret())}` }),
    both: () => ({ [SECRET_HEADER]: secret(), cookie: `agent_office=${cookieValue(secret())}` }),
  }
}
