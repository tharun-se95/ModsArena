// The page's colors, read from index.html's tokens, and the WCAG 2.1 AA
// checks they're held to: text 4.5:1 on the panels' paper and the page,
// text on the clay accent 4.5:1, focus rings 3:1. contrast.test.mjs runs
// them on the page's own tokens, themes.test.mjs on every office theme.
import { readFileSync } from 'node:fs'

export const css = readFileSync(new URL('../../agent-office/server/public/index.html', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

const hex = h => { h = h.slice(1); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) }
const lum = rgb => { const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
export const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// Every `selector { --token: value; ... }` block, in order.
export function tokens(selector) {
  const out = {}
  const re = /([^{}]+)\{([^{}]*)\}/g
  for (const [, sel, body] of css.matchAll(re)) {
    if (sel.trim().split('\n').pop().trim() !== selector) continue
    for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) out[name] = value.trim()
  }
  return out
}
export const light = tokens(':root')
export const dark = { ...light, ...tokens(':root[data-theme="dark"]') }
export const resolve = (theme, v) => (v.startsWith('var(') ? resolve(theme, theme[v.slice(6, -1)]) : v)

export const TEXT = ['ink', 'muted', 'accent-ink', 'ok-ink', 'warn-ink', 'crit-ink', 'teal-ink', 'lilac-ink']

// What fails in a set of tokens, as messages; empty when it all passes.
export function failures(theme) {
  const c = k => resolve(theme, theme[k])
  const out = []
  for (const k of TEXT) {
    for (const bg of ['paper', 'bg']) if (ratio(c(k), c(bg)) < 4.5) out.push(`${k} on ${bg}: ${ratio(c(k), c(bg)).toFixed(2)}`)
  }
  if (ratio(c('on-accent'), c('accent')) < 4.5) out.push(`on-accent on accent: ${ratio(c('on-accent'), c('accent')).toFixed(2)}`)
  for (const bg of ['paper', 'bg']) if (ratio(c('focus'), c(bg)) < 3) out.push(`focus on ${bg}: ${ratio(c('focus'), c(bg)).toFixed(2)}`)
  return out
}
