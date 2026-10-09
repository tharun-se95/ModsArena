// Share your office: a framed picture of it as it is right now, saved as a
// PNG on your computer. Drawn entirely in the page (nothing is uploaded):
// the scene as rendered, cropped to the part the panels leave free, with
// the room signs and names laid back on top, in a paper frame with a
// caption.

export const caption = (date = new Date()) =>
  `My Agent Office · ${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`

const pad2 = n => String(n).padStart(2, '0')
export const fileName = (date = new Date()) =>
  `agent-office-${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}-${pad2(date.getHours())}${pad2(date.getMinutes())}.png`

// Where to crop the stage: inside the panels, unless that leaves too little
// (a phone), then all of it. In canvas pixels.
export function cropOf(width, height, insets, ratio) {
  const x0 = Math.round(insets.left * ratio), x1 = Math.round(width - insets.right * ratio)
  const y0 = Math.round(insets.top * ratio), y1 = Math.round(height - insets.bottom * ratio)
  if (x1 - x0 < width * 0.45 || y1 - y0 < height * 0.45) return { x: 0, y: 0, w: width, h: height }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

// `shot` is a canvas holding the rendered office; `tags` [{ x, y, text,
// kind }] in its pixels; `colors` the page's tokens; `ratio` its pixel
// ratio. Returns the framed canvas.
export function frame({ shot, tags, colors, ratio, date = new Date(), detail = '' }) {
  const s = ratio
  const pad = Math.round(28 * s)
  const foot = Math.round(64 * s)
  const out = document.createElement('canvas')
  out.width = shot.width + pad * 2
  out.height = shot.height + pad + foot
  const g = out.getContext('2d')
  g.fillStyle = colors.paper
  g.fillRect(0, 0, out.width, out.height)

  // The office, with rounded corners and a soft shadow.
  g.save()
  g.shadowColor = 'rgba(40, 30, 20, 0.18)'
  g.shadowBlur = 18 * s
  g.shadowOffsetY = 4 * s
  roundRect(g, pad, pad, shot.width, shot.height, 14 * s)
  g.fillStyle = colors.scene
  g.fill()
  g.restore()
  g.save()
  roundRect(g, pad, pad, shot.width, shot.height, 14 * s)
  g.clip()
  g.drawImage(shot, pad, pad)

  // Room signs and names, as the page shows them.
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  for (const t of tags) {
    const room = t.kind === 'room'
    g.font = room ? `600 ${12 * s}px Georgia, serif` : `500 ${10.5 * s}px system-ui, sans-serif`
    const w = g.measureText(t.text).width + (room ? 16 : 12) * s
    const h = (room ? 20 : 17) * s
    const x = pad + t.x, y = pad + t.y
    g.globalAlpha = 0.86
    g.fillStyle = colors.paper
    roundRect(g, x - w / 2, y - h / 2, w, h, room ? 6 * s : h / 2)
    g.fill()
    g.globalAlpha = 1
    g.fillStyle = colors.ink
    g.fillText(t.text, x, y + 0.5 * s)
  }
  g.restore()

  // The caption: the office's mark, then what this is and when.
  const cy = shot.height + pad + foot / 2
  const mx = pad + 12 * s
  g.fillStyle = colors.accent
  g.beginPath(); g.arc(mx, cy, 5 * s, 0, Math.PI * 2); g.fill()
  g.strokeStyle = colors.line
  g.lineWidth = 1.8 * s
  g.beginPath(); g.arc(mx, cy, 10 * s, 0, Math.PI * 2); g.stroke()
  g.fillStyle = colors.ink
  g.beginPath(); g.arc(mx + 8.3 * s, cy - 5.3 * s, 2.3 * s, 0, Math.PI * 2); g.fill()
  g.textAlign = 'left'
  g.textBaseline = 'middle'
  g.font = `600 ${17 * s}px Georgia, serif`
  g.fillText(caption(date), mx + 22 * s, cy)
  if (detail) {
    g.textAlign = 'right'
    g.fillStyle = colors.muted
    g.font = `500 ${12 * s}px system-ui, sans-serif`
    g.fillText(detail, out.width - pad, cy)
  }
  return out
}

// Hand the picture to the browser to save; no network involved.
export function save(canvas, name = fileName()) {
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      if (!blob) return resolve(false)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      document.body.append(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      resolve(true)
    }, 'image/png')
  })
}
