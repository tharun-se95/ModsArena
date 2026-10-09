// Office hours, from your clock: when it's evening (the lights dim and
// critters with nothing to do go home) and how far into the dimming it is.
// Pure, so it's tested on its own.

export const EVENING = 20 // 8pm
export const MORNING = 7 // 7am

// `h` is the hour of the day, with minutes as a fraction (21.5 is 9:30pm).
export const homeTime = h => h >= EVENING || h < MORNING

// 0 by day, 1 after hours, easing over half an hour either side of the
// evening and the morning.
export const lateness = h => Math.min(1, Math.max(0, h >= 12 ? h - (EVENING - 0.5) : MORNING + 0.5 - h))

// How much of a one-off moment is under way: in, hold, out (0..1).
export const swell = k => (k <= 0 || k >= 1 ? 0 : Math.min(1, k / 0.2, (1 - k) / 0.3))
