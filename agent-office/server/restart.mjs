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
  execFile(cmd, args, { timeout: 5000, windowsHide: true }, (err, stdout) => resolve(err ? '' : stdout))
})

// The pid listening on 127.0.0.1:port in `netstat -ano` output (Windows).
export function parseNetstat(text, port) {
  for (const line of String(text ?? '').split(/\r?\n/)) {
    const cols = line.trim().split(/\s+/)
    if (cols[0] !== 'TCP' || !/LISTEN/i.test(cols[3] ?? '')) continue
    if (cols[1] === `127.0.0.1:${port}` || cols[1] === `0.0.0.0:${port}` || cols[1] === `[::1]:${port}`) {
      const pid = Number(cols[4])
      if (Number.isInteger(pid) && pid > 0) return pid
    }
  }
  return undefined
}

// Which process listens on the port: lsof on macOS and Linux, netstat on
// Windows.
export async function listenerPid(port) {
  if (process.platform === 'win32') {
    const pid = parseNetstat(await run('netstat', ['-ano', '-p', 'TCP']), port)
    return pid === process.pid ? undefined : pid
  }
  const pids = parsePids(await run('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']))
  return pids.find(p => p !== process.pid)
}

export async function commandOf(pid) {
  if (process.platform === 'win32') {
    const query = `(Get-CimInstance Win32_Process -Filter "ProcessId=${Number(pid)}").CommandLine`
    return (await run('powershell', ['-NoProfile', '-NonInteractive', '-Command', query])).trim()
  }
  return (await run('ps', ['-o', 'command=', '-p', String(pid)])).trim()
}

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
