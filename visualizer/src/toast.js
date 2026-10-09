// Little notes that pop up at the bottom of the office for a moment: a
// milestone reached, a snapshot saved. Read out politely to screen readers;
// one click on a note does what it offers, and it goes away on its own.

const SHOW_MS = 6000
const MAX = 3
let host = null

function ensureHost() {
  if (host) return host
  host = document.createElement('div')
  host.className = 'toasts'
  host.setAttribute('role', 'status')
  host.setAttribute('aria-live', 'polite')
  document.querySelector('.stage-wrap')?.append(host) ?? document.body.append(host)
  return host
}

// `icon` is a short glyph; `onClick` makes the whole note a button.
export function toast({ icon = '★', title, text = '', onClick }) {
  const el = document.createElement(onClick ? 'button' : 'div')
  el.className = 'toast paper'
  if (onClick) el.type = 'button'
  const glyph = document.createElement('i')
  glyph.textContent = icon
  glyph.setAttribute('aria-hidden', 'true')
  const words = document.createElement('span')
  const b = document.createElement('b')
  b.textContent = title
  words.append(b)
  if (text) words.append(` ${text}`)
  el.append(glyph, words)
  const box = ensureHost()
  box.append(el)
  while (box.children.length > MAX) box.firstChild.remove()
  requestAnimationFrame(() => el.classList.add('on'))
  const close = () => {
    el.classList.remove('on')
    setTimeout(() => el.remove(), 300)
  }
  if (onClick) el.addEventListener('click', () => { onClick(); close() })
  setTimeout(close, SHOW_MS)
  return el
}
