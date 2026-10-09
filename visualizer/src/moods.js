// Moods: what a critter's face and arms say, besides working. Small and
// brief, so a busy office stays calm to look at.
//
//   perk    you just replied or answered it: it looks up, eyes wide
//   sulk    its turn ended badly or it stopped short: a slump, eyes low
//   cheer   it finished a turn well: arms up, a little bounce
//   think   mid-turn between tools: three thought dots over its head
//   yawn    it's been waiting on you a while: a stretch every so often
//
// Pure: the scene asks moodOf() each frame and draws the answer
// (character.js emote()). Times are in seconds.

export const PERK_S = 1.4
export const SULK_S = 3
export const CHEER_S = 1.6
export const YAWN_S = 2.4
export const YAWN_EVERY = 28 // a yawn about this often while it waits
export const YAWN_AFTER = 20 // and only once it's waited this long

const within = (now, at, span) => at !== undefined && at !== null && now >= at && now - at < span

// Fills `out` ({ kind, k }) and returns it: `k` runs 0..1 through the mood.
// One object reused per critter, so nothing is allocated per frame.
export function moodOf(now, s, out = { kind: null, k: 0 }) {
  out.kind = null
  out.k = 0
  if (s.asleep) return out
  if (within(now, s.perkAt, PERK_S)) return set(out, 'perk', (now - s.perkAt) / PERK_S)
  if (within(now, s.sulkAt, SULK_S)) return set(out, 'sulk', (now - s.sulkAt) / SULK_S)
  if (within(now, s.cheerAt, CHEER_S)) return set(out, 'cheer', (now - s.cheerAt) / CHEER_S)
  if (s.thinking) return set(out, 'think', (now % 1.2) / 1.2)
  if (s.idleFor >= YAWN_AFTER) {
    // Each critter on its own beat, so they don't yawn in chorus.
    const phase = (now + (s.seed ?? 0) * 7) % YAWN_EVERY
    if (phase < YAWN_S) return set(out, 'yawn', phase / YAWN_S)
  }
  return out
}

function set(out, kind, k) {
  out.kind = kind
  out.k = k
  return out
}

// In, hold, out: 0 at either end of a mood, 1 through its middle.
export function envelope(k, rise = 0.15, fall = 0.3) {
  if (k <= 0 || k >= 1) return 0
  const x = k < rise ? k / rise : k > 1 - fall ? (1 - k) / fall : 1
  return x * x * (3 - 2 * x)
}
