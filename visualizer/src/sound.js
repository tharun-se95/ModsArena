// Small, quiet sounds for the office, synthesized with Web Audio so there
// are no files to load: keys clicking when a tool runs, a chime when a
// turn finishes, a soft bonk when a call fails, a pop when a helper
// arrives, a chirp when critters wave, a clink at the coffee corner and a
// hush when a session compacts, and a desk bell for a pull request or a
// finished thread. Browsers only allow sound after you've
// interacted with the page, so nothing plays until your first click or key.
//
// Sound you can live with for an hour of busy work:
//   Volume       0-100 in Settings, on a curve that follows the ear, applied
//                through one master gain
//   Quiet hours  the same model and wording as the Alerts panel (notify.js):
//                between two times you pick the office is silent, except,
//                if you leave it on, one soft chime when a thread starts
//                waiting on you
//   Pacing       each sound has a shortest gap and a budget per few seconds,
//                so twenty tools at once sound like a typist, not a hailstorm

import { inQuiet } from './notify.js'
import { load, save } from './prefs.js'

const KEY = 'agent-office-muted'
let ctx = null
let master = null
let muted = false
try { muted = localStorage.getItem(KEY) === '1' } catch {}

// ---------------------------------------------------------------------------
// Pure parts (tested)

// The loudest the master gain goes, at 100.
const MAX_GAIN = 0.6
export const DEFAULT_VOLUME = 80

// The slider's 0-100 to a gain. Loudness is heard roughly logarithmically,
// so a straight line would do all its work in the bottom quarter; a square
// curve makes each step of the slider sound like about the same change.
export function volumeGain(volume) {
  const v = Math.min(100, Math.max(0, Number.isFinite(Number(volume)) ? Number(volume) : DEFAULT_VOLUME)) / 100
  return MAX_GAIN * v * v
}

// Whether a sound may play: never when muted; in quiet hours only the
// "waiting on you" chime, and only if you've kept it.
export function audible(name, { muted = false, quiet, now = new Date() } = {}) {
  if (muted) return false
  if (!inQuiet(now, quiet)) return name !== 'nudge'
  return name === 'nudge' && quiet.chime !== false
}

// A rate limiter for one kind of sound: at most one per `gap` seconds and
// at most `burst` in any `window` seconds. `allow(now)` says yes (and
// counts it) or no.
export function limiter({ gap = 0, burst = Infinity, window = 1 } = {}) {
  let times = []
  return {
    allow(now) {
      if (times.length && now - times[times.length - 1] < gap) return false
      times = times.filter(t => now - t < window)
      if (times.length >= burst) return false
      times.push(now)
      return true
    },
  }
}

// Each sound's pacing. Keys are the busy one: a few taps a second at most
// however many tools run. Bonks come in cascades when one thing breaks, so
// three is plenty to hear that something did.
const PACE = {
  keys: { gap: 0.14, burst: 6, window: 3 },
  chime: { gap: 0.6, burst: 3, window: 8 },
  bonk: { gap: 0.6, burst: 3, window: 10 },
  pop: { gap: 0.25, burst: 4, window: 4 },
  hello: { gap: 0.8, burst: 3, window: 10 },
  clink: { gap: 0.5, burst: 2, window: 6 },
  bell: { gap: 1.5, burst: 3, window: 20 },
  hush: { gap: 1.5, burst: 2, window: 10 },
  nudge: { gap: 4, burst: 3, window: 60 },
}
const limits = new Map(Object.entries(PACE).map(([name, pace]) => [name, limiter(pace)]))

// ---------------------------------------------------------------------------
// Settings

const QUIET = { on: false, from: '22:00', to: '08:00', chime: true }
let volume = load('sound-volume', DEFAULT_VOLUME)
let quiet = { ...QUIET, ...load('sound-quiet', {}) }

export const isMuted = () => muted
export const getVolume = () => volume
export const getQuiet = () => ({ ...quiet })
export const quietNow = () => inQuiet(new Date(), quiet)

function applyGain() {
  if (master) master.gain.setTargetAtTime(muted ? 0 : volumeGain(volume), ctx.currentTime, 0.02)
}

export function setMuted(value) {
  muted = value
  try { localStorage.setItem(KEY, value ? '1' : '0') } catch {}
  applyGain()
}

export function setVolume(value) {
  volume = Math.round(Math.min(100, Math.max(0, Number(value) || 0)))
  save('sound-volume', volume)
  applyGain()
}

export function setQuiet(change) {
  quiet = { ...quiet, ...change }
  save('sound-quiet', quiet)
}

// Called on the first click or key press.
export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : volumeGain(volume)
  master.connect(ctx.destination)
}

// None while the page is hidden, muted or quiet, and each at its own pace.
function ready(name) {
  if (!ctx || document.hidden || !audible(name, { muted, quiet })) return false
  return limits.get(name)?.allow(ctx.currentTime) ?? true
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
  // A couple of key taps: low and short enough to sit under a busy hour.
  keys() {
    if (!ready('keys')) return
    noise({ dur: 0.022, gain: 0.035, freq: 1900 + Math.random() * 900, q: 2 })
    noise({ dur: 0.018, gain: 0.022, freq: 2300 + Math.random() * 900, q: 2, at: 0.06 + Math.random() * 0.04 })
  },
  // Two soft bell notes going up.
  chime() {
    if (!ready('chime')) return
    tone({ freq: 1046.5, dur: 0.7, gain: 0.05 })
    tone({ freq: 1318.5, dur: 0.9, gain: 0.045, at: 0.09 })
  },
  // A soft, round "oops": a sine with a gentle start, not a buzzer.
  bonk() {
    if (!ready('bonk')) return
    tone({ freq: 220, to: 160, dur: 0.2, gain: 0.05, attack: 0.012 })
  },
  pop() {
    if (!ready('pop')) return
    tone({ freq: 520, to: 980, dur: 0.09, gain: 0.045 })
  },
  // "Hi!": a quick two-note chirp.
  hello() {
    if (!ready('hello')) return
    tone({ freq: 880, to: 1046, type: 'triangle', dur: 0.08, gain: 0.04 })
    tone({ freq: 1175, to: 1397, type: 'triangle', dur: 0.1, gain: 0.035, at: 0.1 })
  },
  // A mug set down on the counter.
  clink() {
    if (!ready('clink')) return
    tone({ freq: 2637, dur: 0.18, gain: 0.025 })
    tone({ freq: 3520, dur: 0.14, gain: 0.018, at: 0.02 })
  },
  // A little desk bell: a bright strike with a long, soft ring.
  bell() {
    if (!ready('bell')) return
    tone({ freq: 1568, dur: 1.4, gain: 0.05, attack: 0.002 })
    tone({ freq: 3951, dur: 0.6, gain: 0.018, attack: 0.002 })
    tone({ freq: 1568, dur: 1.2, gain: 0.03, at: 0.22, attack: 0.002 })
  },
  hush() {
    if (!ready('hush')) return
    noise({ dur: 0.6, gain: 0.035, freq: 400, to: 2200, q: 0.7 })
  },
  // A thread has started waiting on you. In the day the turn's own chime
  // says so; this is the one sound quiet hours keep: low, slow and soft
  // enough not to startle at night.
  nudge() {
    if (!ready('nudge')) return
    tone({ freq: 784, dur: 1.2, gain: 0.03, attack: 0.03 })
    tone({ freq: 1046.5, dur: 1.4, gain: 0.022, at: 0.28, attack: 0.03 })
  },
  // How loud the office is now, for the volume slider: one chime, past the
  // pacing and quiet hours, since you asked to hear it.
  sample() {
    if (!ctx || muted) return
    tone({ freq: 1046.5, dur: 0.6, gain: 0.05 })
    tone({ freq: 1318.5, dur: 0.8, gain: 0.045, at: 0.09 })
  },
}

// ---------------------------------------------------------------------------
// The Sound rows in the Settings menu, under the Sound on/off button:
// volume, quiet hours and the one chime they keep.

export function mountControls() {
  const box = document.getElementById('sound-set')
  const toggle = document.getElementById('sound')
  if (!box) return
  const draw = () => {
    const off = muted ? 'disabled' : ''
    box.classList.toggle('off', muted)
    box.innerHTML = `
      <label class="sound-vol"><span>Volume</span>
        <input type="range" min="0" max="100" step="5" value="${volume}" data-sq="volume" aria-valuetext="${volume} percent" ${off}>
        <output>${volume}</output></label>
      <label class="alerts-row"><input type="checkbox" data-sq="on" ${quiet.on ? 'checked' : ''} ${off}> <span>Hush sounds during quiet hours</span></label>
      <p class="alerts-times"${quiet.on ? '' : ' hidden'}><span><span>From</span> <input type="time" data-sq="from" value="${quiet.from}" aria-label="Sound quiet hours start" ${off}></span>
        <span><span>to</span> <input type="time" data-sq="to" value="${quiet.to}" aria-label="Sound quiet hours end" ${off}></span></p>
      <label class="alerts-row sound-sub"${quiet.on ? '' : ' hidden'}><input type="checkbox" data-sq="chime" ${quiet.chime ? 'checked' : ''} ${off}> <span>Keep one soft chime when a thread waits on you</span></label>
      <p class="alerts-note">${muted ? 'Sound is off. Turn it on to set these.' : quietNow() ? `Quiet now, until ${quiet.to}.` : 'Busy hours stay gentle: keys and bonks are spaced out.'}</p>`
  }
  box.addEventListener('input', e => {
    if (e.target.dataset.sq !== 'volume') return
    setVolume(e.target.value)
    e.target.setAttribute('aria-valuetext', `${volume} percent`)
    box.querySelector('output').textContent = volume
  })
  box.addEventListener('change', e => {
    const el = e.target
    const key = el.dataset.sq
    if (key === 'volume') return sound.sample()
    if (key === 'on' || key === 'chime') setQuiet({ [key]: el.checked })
    else if ((key === 'from' || key === 'to') && el.value) setQuiet({ [key]: el.value })
    else return
    // Redraw for the times and note, keeping focus on what you just used.
    draw()
    box.querySelector(`[data-sq="${key}"]`)?.focus()
  })
  toggle?.addEventListener('click', draw)
  document.getElementById('settings-open')?.addEventListener('click', draw)
  draw()
}
