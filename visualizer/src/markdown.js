// Claude's replies are markdown; this draws them: headings, paragraphs,
// bullet and numbered lists, bold, italic, inline code, code blocks,
// tables, quotes, rules and links. Safe by construction: every bit of text
// is HTML-escaped before any markup is added, and links go only to http(s)
// addresses, opening in a new tab. Pure: a string in, an HTML string out.

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Inline marks within one line. Code spans, links and bare URLs are taken
// from the raw text first and set aside as placeholders; the rest is
// escaped and marked; then each placeholder becomes its HTML, built from
// its own escaped parts. No pattern ever runs over HTML made here, so text
// can't reshape a tag (a link inside a link, a quote breaking out of href).
const TOKEN = /`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s()<>"']+)\)|(^|[\s(])(https?:\/\/[^\s<>"'()]*[^\s<>"'().,;:!?])/g
const link = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`

const marks = s => s
  .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+?)__/g, '<strong>$1</strong>')
  .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>').replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, '$1<em>$2</em>')
  .replace(/~~([^~]+)~~/g, '<del>$1</del>')

export function inline(text) {
  const parts = []
  const hold = html => `\u0000${parts.push(html) - 1}\u0000`
  const src = String(text ?? '').replace(/\u0000/g, '')
  const held = src.replace(TOKEN, (_, code, label, url, pre, bare) => {
    if (code !== undefined) return hold(`<code>${esc(code)}</code>`)
    if (label !== undefined) return hold(link(url, marks(esc(label))))
    return pre + hold(link(bare, esc(bare)))
  })
  return marks(esc(held)).replace(/\u0000(\d+)\u0000/g, (_, i) => parts[i])
}

const isRow = l => /^\s*\|.*\|\s*$/.test(l)
const isRule = l => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l)
const cells = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())
const bullet = /^(\s*)[-*+]\s+(.*)$/
const numbered = /^(\s*)(\d+)[.)]\s+(.*)$/

export function markdown(src) {
  const lines = String(src ?? '').replace(/\r\n?/g, '\n').split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // A fenced code block, kept exactly.
    const fence = line.match(/^\s*(```|~~~)\s*([\w+-]*)\s*$/)
    if (fence) {
      const body = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i++])
      i++
      out.push(`<pre class="md-code"><code>${esc(body.join('\n'))}</code></pre>`)
      continue
    }
    if (!line.trim()) { i++; continue }
    const h = line.match(/^\s*(#{1,6})\s+(.*?)\s*#*\s*$/)
    if (h) {
      const level = Math.min(6, h[1].length + 2) // h3 at most: it sits in a small panel
      out.push(`<h${level} class="md-h">${inline(h[2])}</h${level}>`)
      i++
      continue
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push('<hr>'); i++; continue }
    // A table: a header row, its rule, then rows.
    if (isRow(line) && i + 1 < lines.length && isRule(lines[i + 1])) {
      const head = cells(line)
      const rows = []
      i += 2
      while (i < lines.length && isRow(lines[i])) rows.push(cells(lines[i++]))
      out.push(`<div class="md-table"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${head.map((_, k) => `<td>${inline(r[k] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)
      continue
    }
    if (/^\s*>/.test(line)) {
      const body = []
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ''))
      out.push(`<blockquote>${markdown(body.join('\n'))}</blockquote>`)
      continue
    }
    // A list (bullets or numbers); deeper-indented items nest.
    if (bullet.test(line) || numbered.test(line)) {
      const items = []
      while (i < lines.length && (bullet.test(lines[i]) || numbered.test(lines[i]) || (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length))) {
        const b = lines[i].match(bullet), n = lines[i].match(numbered)
        if (b || n) items.push({ depth: Math.floor((b ? b[1] : n[1]).replace(/\t/g, '  ').length / 2), ordered: !b, start: n ? Number(n[2]) : 1, text: b ? b[2] : n[3] })
        else items[items.length - 1].text += ` ${lines[i].trim()}`
        i++
      }
      out.push(list(items, 0))
      continue
    }
    // A paragraph: lines until a blank line or another block starts.
    const para = [line]
    i++
    while (i < lines.length && lines[i].trim() && !/^\s*(#{1,6}\s|```|~~~|>)/.test(lines[i]) && !bullet.test(lines[i]) && !numbered.test(lines[i]) && !(isRow(lines[i]) && i + 1 < lines.length && isRule(lines[i + 1]))) para.push(lines[i++])
    out.push(`<p>${para.map(inline).join('<br>')}</p>`)
  }
  return out.join('')
}

function list(items, depth) {
  if (!items.length) return ''
  const ordered = items[0].ordered
  const start = ordered && items[0].start !== 1 ? ` start="${items[0].start}"` : ''
  let html = `<${ordered ? 'ol' : 'ul'}${start}>`
  for (let k = 0; k < items.length; k++) {
    if (items[k].depth > depth) continue
    const kids = []
    for (let j = k + 1; j < items.length && items[j].depth > depth; j++) kids.push(items[j])
    html += `<li>${inline(items[k].text)}${kids.length ? list(kids, depth + 1) : ''}</li>`
  }
  return html + `</${ordered ? 'ol' : 'ul'}>`
}

// The same reply as plain words, for one-line previews (a card, the feed,
// a notification): marks dropped, list items and table rows run together.
export function plain(src) {
  return String(src ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .split('\n')
    .filter(l => !isRule(l) && !/^\s*([-*_])(\s*\1){2,}\s*$/.test(l))
    .map(l => (isRow(l) ? cells(l).join(' · ') : l))
    .map(l => l.replace(/^\s*(#{1,6}|>|[-*+]|\d+[.)])\s+/, ''))
    .join(' ')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
    .replace(/\*\*([^*]+?)\*\*|__([^_]+?)__/g, '$1$2')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
