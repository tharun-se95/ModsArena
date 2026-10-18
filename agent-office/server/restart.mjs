// Restarting the office: /office (or `agent-office` run again) replaces
// the bridge already on the port with this copy, whichever version it is
// and however it was started. A bridge that knows how steps down when
// asked (POST /shutdown) and hands over its live events; an older one is
// found by the port it holds, checked to be an Agent Office bridge, and
// stopped. Nothing else is ever stopped.

import { execFile } from 'node:child_process'

export const RESTART_HEADER = 'x-agent-office-restart'

// Whether a process's command line is an Agent Office bridge: node running
// this package's server.mjs or cli.mjs (a plugin copy, a clone or npx).
export function isOurBridge(command) {
  const cmd = String(command ?? '')
  if (!/\bnode(\.exe)?\b/i.test(cmd)) return false
  return /agent-office[\\/]server[\\/](server|cli)\.mjs/i.test(cmd)
    || /ModsArena/i.test(cmd) && /(server|cli)\.mjs/i.test(cmd)
    || /_npx[\\/].*(server|cli)\.mjs/i.test(cmd)
}

// The first pid in lsof's terse output.
export const parsePids = text => String(text ?? '').split(/\s+/).map(Number).filter(n => Number.isInteger(n) && n > 0)

const run = (cmd, args) => new Promise(resolve => {
  execFile(cmd, args, { timeout: 3000 }, (err, stdout) => resolve(err ? '' : stdout))
})

// Which process listens on the port (macOS and Linux; Windows has no lsof).
export async function listenerPid(port) {
  if (process.platform === 'win32') return undefined
  const pids = parsePids(await run('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']))
  return pids.find(p => p !== process.pid)
}

export const commandOf = async pid => (await run('ps', ['-o', 'command=', '-p', String(pid)])).trim()

// Stop the bridge holding the port, if it is ours. `pid` is what its
// /healthz said, when it says; else the port's listener. Returns the pid
// it stopped, or undefined.
export async function stopOldBridge(port, pid) {
  const listener = await listenerPid(port)
  const target = pid ?? listener
  if (!target || target === process.pid) return undefined
  // Only the process that holds the port, whatever /healthz claimed, and
  // only when it's an Agent Office bridge.
  if (listener !== undefined && listener !== target) return undefined
  if (!isOurBridge(await commandOf(target))) return undefined
  try {
    process.kill(target, 'SIGTERM')
    return target
  } catch {
    return undefined
  }
}
