// Small, quiet sounds for the office, synthesized with Web Audio so there
// are no files to load: keys clicking when a tool runs, a chime when a
// turn finishes, a soft bonk when a call fails, a pop when a helper
// arrives, a chirp when critters wave, a clink at the coffee corner and a
// hush when a session compacts. Browsers only allow sound after you've
// interacted with the page, so nothing plays until your first click or key.

const KEY = 'agent-office-muted'
let ctx = null
let master = null
let muted = false
try { muted = localStorage.getItem(KEY) === '1' } catch {}
const lastAt = new Map()

export const isMuted = () => muted

export function setMuted(value) {
  muted = value
  try { localStorage.setItem(KEY, value ? '1' : '0') } catch {}
  if (master) master.gain.value = muted ? 0 : 0.5
}

// Called on the first click or key press.
export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.5
  master.connect(ctx.destination)
}

// At most one of each sound per `gap` seconds, and none while the page is
// hidden or muted.
function ready(name, gap) {
  if (!ctx || muted || document.hidden) return false
  const now = ctx.currentTime
  if (now - (lastAt.get(name) ?? -1) < gap) return false
  lastAt.set(name, now)
  return true
}

function tone({ freq, to, type = 'sine', dur = 0.15, gain = 0.1, at = 0, attack = 0.005 }) {
  const t = ctx.currentTime + at
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(gain, t + attack)
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(env).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

let noiseBuffer = null
function noise({ dur = 0.03, gain = 0.05, freq = 3000, q = 1.5, type = 'bandpass', to, at = 0 }) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  const t = ctx.currentTime + at
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  const filter = ctx.createBiquadFilter()
  filter.type = type
  filter.frequency.setValueAtTime(freq, t)
  if (to) filter.frequency.exponentialRampToValueAtTime(to, t + dur)
  filter.Q.value = q
  const env = ctx.createGain()
  env.gain.setValueAtTime(gain, t)
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter).connect(env).connect(master)
  src.start(t, Math.random() * 0.4)
  src.stop(t + dur + 0.02)
}

export const sound = {
  // A couple of key taps.
  keys() {
    if (!ready('keys', 0.09)) return
    noise({ dur: 0.025, gain: 0.05, freq: 2600 + Math.random() * 1400, q: 2 })
    noise({ dur: 0.02, gain: 0.03, freq: 3200 + Math.random() * 1200, q: 2, at: 0.06 + Math.random() * 0.04 })
  },
  // Two soft bell notes going up.
  chime() {
    if (!ready('chime', 0.4)) return
    tone({ freq: 1046.5, dur: 0.7, gain: 0.05 })
    tone({ freq: 1318.5, dur: 0.9, gain: 0.045, at: 0.09 })
  },
  bonk() {
    if (!ready('bonk', 0.3)) return
    tone({ freq: 240, to: 150, type: 'triangle', dur: 0.22, gain: 0.08 })
  },
  pop() {
    if (!ready('pop', 0.15)) return
    tone({ freq: 520, to: 980, dur: 0.09, gain: 0.06 })
  },
  // "Hi!": a quick two-note chirp.
  hello() {
    if (!ready('hello', 0.5)) return
    tone({ freq: 880, to: 1046, type: 'triangle', dur: 0.08, gain: 0.04 })
    tone({ freq: 1175, to: 1397, type: 'triangle', dur: 0.1, gain: 0.035, at: 0.1 })
  },
  // A mug set down on the counter.
  clink() {
    if (!ready('clink', 0.3)) return
    tone({ freq: 2637, dur: 0.18, gain: 0.025 })
    tone({ freq: 3520, dur: 0.14, gain: 0.018, at: 0.02 })
  },
  hush() {
    if (!ready('hush', 1)) return
    noise({ dur: 0.6, gain: 0.05, freq: 400, to: 3000, q: 0.7 })
  },
}
