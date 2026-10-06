// Who may talk to the bridge. It listens on 127.0.0.1 only, but any web page
// you visit can still send requests to 127.0.0.1, and a page can point its
// own hostname at 127.0.0.1 to read the answers (DNS rebinding). Chat lets
// the bridge type into Claude Code, so:
//
//   - every request must name the bridge itself in its Host header, which a
//     rebound page can't fake (it carries the page's own hostname);
//   - a request from a browser (it has an Origin) must come from the office
//     page's own origin to change anything;
//   - sending a chat message needs this run's token, which only the office
//     page receives (in its HTML, unreadable to other origins), sent as a
//     custom header that a cross-origin page can't attach without a CORS
//     preflight the bridge never grants.

import { randomBytes, timingSafeEqual } from 'node:crypto'

export const TOKEN_HEADER = 'x-agent-office-token'
export const INBOX_HEADER = 'x-agent-office-inbox'
export const CONTROL_HEADER = 'x-agent-office-control'

export const newToken = () => randomBytes(24).toString('hex')

const LOCAL_NAMES = ['127.0.0.1', 'localhost', '[::1]']

export function isOwnHost(host, port) {
  if (typeof host !== 'string') return false
  return LOCAL_NAMES.some(name => host === `${name}:${port}`)
}

export function isOwnOrigin(origin, port) {
  return LOCAL_NAMES.some(name => origin === `http://${name}:${port}`)
}

export function tokenMatches(given, token) {
  if (typeof given !== 'string' || given.length !== token.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(token))
}

// Why a request is refused, or undefined to let it through.
export function refusal(req, port) {
  if (!isOwnHost(req.headers.host, port)) return 'unexpected Host'
  const origin = req.headers.origin
  if (req.method !== 'GET' && req.method !== 'HEAD' && origin !== undefined && !isOwnOrigin(origin, port)) return 'unexpected Origin'
  return undefined
}
