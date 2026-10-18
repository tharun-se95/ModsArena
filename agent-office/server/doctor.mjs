// `npx github:tharun-se95/ModsArena doctor`: what Agent Office needs, checked
// one by one, as a report to paste into a bug report. It reads; it changes
// nothing. diagnose() is pure (tested); gather() looks at this computer.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'
import { join } from 'node:path'
import { officeDir } from './secret.mjs'

export const MIN_NODE = 20

// Each check: { ok: true | false | null (not applicable), label, detail, fix? }
export function diagnose(f) {
  const checks = []
  const add = (ok, label, detail, fix) => checks.push({ ok, label, detail, ...(fix && ok === false && { fix }) })
  const nodeMajor = Number(String(f.node).replace(/^v/, '').split('.')[0])
  add(nodeMajor >= MIN_NODE, 'Node', f.node, `Install Node ${MIN_NODE} or newer (the LTS) from https://nodejs.org.`)
  add(Boolean(f.claude), 'Claude Code', f.claude ?? 'not found on PATH', 'Install Claude Code, and check `claude --version` works in a new terminal.')
  if (!f.bridge) {
    add(null, 'Bridge', `nothing answers on port ${f.port}`, null)
  } else if (f.bridge.name !== 'agent-office') {
    add(false, 'Bridge', `something else answers on port ${f.port}`, 'Stop that program, or give Agent Office another port (plugin option `port`, or --port).')
  } else {
    add(f.bridge.isYours, 'Bridge', `Agent Office ${f.bridge.version ?? '(old)'} on port ${f.port}, pid ${f.bridge.pid ?? '?'}, ${f.bridge.events ?? 0} events, ${f.bridge.errors ?? 0} errors, up ${f.bridge.uptimeS ?? '?'} s`,
      f.bridge.proof ? 'It isn’t your account’s bridge (it can’t prove it knows your secret). Give yours another port.' : 'It’s older than 0.13: run /office (or this CLI) to restart it.')
  }
  add(f.secret === 'ok' ? true : f.secret === 'missing' ? null : false, 'Your secret', f.secret === 'ok' ? `${f.officeDir}/secret, yours alone` : f.secret === 'missing' ? 'not made yet (the bridge makes it when it first starts)' : `${f.officeDir}/secret is ${f.secret}`,
    'Delete the file and restart the bridge; it makes a new one readable by you alone.')
  add(f.curl === null ? null : Boolean(f.curl), 'curl', f.curl ?? 'not needed (settings hooks not installed)', 'The settings hooks send events with curl: install it.')
  add(null, 'Settings hooks', f.hooks.length ? f.hooks.join(', ') : 'not installed (the plugin doesn’t need them)', null)
  add(null, 'This computer', `${f.platform} ${f.arch}`, null)
  return checks
}

export function report(checks, version) {
  const mark = ok => (ok === true ? 'ok  ' : ok === false ? 'FIX ' : '·   ')
  const lines = [`Agent Office ${version ?? ''} doctor`, '']
  for (const c of checks) {
    lines.push(`${mark(c.ok)}${c.label}: ${c.detail}`)
    if (c.fix) lines.push(`      ${c.fix}`)
  }
  const broken = checks.filter(c => c.ok === false).length
  lines.push('', broken ? `${broken} thing${broken === 1 ? '' : 's'} to fix above.` : 'Everything Agent Office needs is in place.')
  lines.push('Reporting a bug? Paste this into https://github.com/tharun-se95/ModsArena/issues/new/choose')
  return lines.join('\n')
}

const run = (cmd, args) => {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true }).trim()
  } catch {
    return undefined
  }
}

export async function gather({ port, settingsFiles, hasHooks }) {
  const dir = officeDir()
  let secret = 'missing'
  const file = join(dir, 'secret')
  if (existsSync(file)) {
    const text = readFileSync(file, 'utf8').trim()
    const mode = statSync(file).mode & 0o777
    secret = !/^[0-9a-f]{64}$/.test(text) ? 'not a secret the bridge made'
      : process.platform !== 'win32' && mode & 0o077 ? `readable by others (mode ${mode.toString(8)})` : 'ok'
  }
  let bridge = null
  try {
    const nonce = randomBytes(8).toString('hex')
    const res = await fetch(`http://127.0.0.1:${port}/healthz?nonce=${nonce}`, { signal: AbortSignal.timeout(2000) })
    bridge = res.ok ? await res.json().catch(() => ({})) : {}
    if (secret === 'ok' && bridge.proof) {
      const mine = readFileSync(file, 'utf8').trim()
      bridge.isYours = bridge.proof === createHash('sha256').update(`${mine}:${nonce}`).digest('hex')
    } else bridge.isYours = false
  } catch {}
  const hooks = settingsFiles().filter(([, f]) => existsSync(f) && hasHooks(JSON.parse(readFileSync(f, 'utf8') || '{}'))).map(([where]) => `in your ${where} settings`)
  return {
    node: process.version, platform: process.platform, arch: process.arch, port, officeDir: dir, secret, bridge,
    claude: run(process.platform === 'win32' ? 'claude.cmd' : 'claude', ['--version']) ?? run('claude', ['--version']),
    curl: hooks.length ? (run('curl', ['--version'])?.split('\n')[0] ?? false) : null,
    hooks,
  }
}
