// Small choices the page remembers for you, in this browser only. Storage
// can be missing or refuse (a private window, blocked site data), so every
// read and write is guarded and the page works the same without it.

const KEY = 'agent-office:'

export function load(name, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(KEY + name)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(name, value) {
  try {
    globalThis.localStorage?.setItem(KEY + name, JSON.stringify(value))
  } catch {}
}

// Developer view: the raw tool lines (commands, paths, percentages) instead
// of plain words. Off unless you turn it on.
let dev = load('dev-view', false) === true

export const devView = () => dev

export function setDevView(on) {
  dev = Boolean(on)
  save('dev-view', dev)
  globalThis.document?.dispatchEvent(new CustomEvent('office:dev-view', { detail: dev }))
}
