// The office before anyone's in, and when it loses its bridge.
//
//   greeter     with no sessions at all, a critter waits at the front door
//               with a speech bubble: what will appear, the first command to
//               copy, and a way into the tour
//   connection  when the stream drops, a calm card instead of a frozen
//               page: it says what happened, counts down to the next try
//               and retries on its own, with a button to try now
//
// Preview flags, so both can be seen (and screenshotted) on purpose:
// ?empty=1 keeps the office empty (main.js ignores every event), and
// ?offline=1 shows the connection card without dropping anything.

const $ = sel => document.querySelector(sel)

// The first command, copied from the greeter's bubble.
export const FIRST_COMMAND = 'claude'

// Seconds to wait before the nth try (n from 1): quick at first, then
// settling at half a minute so a stopped bridge isn't hammered.
export function backoff(n) {
  return Math.min(30, [2, 4, 8, 15][n - 1] ?? 30)
}

// How long the stream may be down before the card shows, so a blink (a
// laptop waking, a bridge swapping for a new version) never flashes it.
export const CALM_MS = 2500

// What the greeter says: a first visit, or an office whose past sessions
// are tucked away (Past sessions unticked).
export function greeting({ hasPast = false } = {}) {
  return hasPast
    ? { title: 'Nobody’s in right now', body: 'Your past sessions are hidden. Tick Past sessions to see them, or start a new one and it walks in through this door.' }
    : { title: 'Hi! The office is ready for you', body: 'Start a Claude Code session and it walks in through this door, takes a desk in its project’s room, and you can follow along and talk to it from here.' }
}

const critter = `
  <svg class="greeter-critter" viewBox="0 0 96 104" aria-hidden="true">
    <ellipse cx="48" cy="98" rx="30" ry="5" fill="currentColor" opacity=".12"/>
    <rect x="24" y="84" width="10" height="12" rx="4" fill="var(--coral)"/>
    <rect x="62" y="84" width="10" height="12" rx="4" fill="var(--coral)"/>
    <rect x="16" y="30" width="64" height="60" rx="26" fill="var(--coral)"/>
    <rect x="16" y="30" width="64" height="60" rx="26" fill="url(#greeter-shine)"/>
    <g class="greeter-arm"><rect x="72" y="44" width="22" height="9" rx="4.5" fill="var(--coral)" transform="rotate(-38 74 48)"/></g>
    <rect x="2" y="56" width="18" height="9" rx="4.5" fill="var(--coral)" transform="rotate(18 18 60)"/>
    <g class="greeter-eyes">
      <ellipse cx="38" cy="56" rx="5" ry="6.5" fill="#1f1d1a"/><ellipse cx="58" cy="56" rx="5" ry="6.5" fill="#1f1d1a"/>
      <circle cx="39.6" cy="53.6" r="1.8" fill="#fff"/><circle cx="59.6" cy="53.6" r="1.8" fill="#fff"/>
    </g>
    <path d="M41 68 q7 6 14 0" fill="none" stroke="#1f1d1a" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="30" cy="66" rx="5" ry="3" fill="#fff" opacity=".3"/><ellipse cx="66" cy="66" rx="5" ry="3" fill="#fff" opacity=".3"/>
    <g class="greeter-gem"><path d="M48 10 l8 9 -8 10 -8 -10z" fill="var(--gem)"/><path d="M48 10 l8 9 -8 3z" fill="#fff" opacity=".45"/></g>
    <defs><linearGradient id="greeter-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  </svg>`

let greeter = null

function mountGreeter() {
  greeter = document.createElement('section')
  greeter.id = 'greeter'
  greeter.className = 'hud'
  greeter.setAttribute('aria-label', 'Getting started')
  greeter.hidden = true
  greeter.innerHTML = `
    <div class="greeter-bubble paper" role="note">
      <b class="greeter-title"></b>
      <p class="greeter-body"></p>
      <ol class="greeter-steps">
        <li><span>Open a terminal and start Claude Code</span>
          <span class="greeter-cmd"><code>${FIRST_COMMAND}</code><button type="button" class="greeter-copy" aria-label="Copy the command ${FIRST_COMMAND}">Copy</button></span></li>
        <li><span>Say hello. Anything works, like <q>What’s in this folder?</q></span></li>
      </ol>
      <p class="greeter-foot"><button type="button" class="greeter-tour" hidden>Take the 1-minute tour</button><span class="greeter-wait"><i></i>Waiting for your first session</span></p>
    </div>
    <div class="greeter-door" aria-hidden="true">${critter}<span class="greeter-mat"></span></div>`
  $('.stage-wrap').append(greeter)
  const copy = greeter.querySelector('.greeter-copy')
  copy.addEventListener('click', async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(FIRST_COMMAND)
      ok = true
    } catch {
      // No clipboard (an insecure page, or permission refused): select the
      // command so Ctrl+C takes it.
      const range = document.createRange()
      range.selectNodeContents(greeter.querySelector('.greeter-cmd code'))
      getSelection().removeAllRanges()
      getSelection().addRange(range)
    }
    copy.textContent = ok ? 'Copied' : 'Press Ctrl+C'
    copy.classList.toggle('done', ok)
    setTimeout(() => { copy.textContent = 'Copy'; copy.classList.remove('done') }, 1800)
  })
  // The tour lives in its own module (tour.js) behind the top bar's Tour
  // button; the greeter offers it only when that button is there.
  greeter.querySelector('.greeter-tour').addEventListener('click', () => $('#tour-open')?.click())
}

// Show the greeter while the office has no sessions at all.
export function showEmpty(empty, { hasPast = false } = {}) {
  if (!greeter) mountGreeter()
  // While the bridge is away the office only looks empty: the card speaks.
  if (card && !card.hidden) empty = false
  if (greeter.hidden === !empty) return
  greeter.hidden = !empty
  if (!empty) return
  const { title, body } = greeting({ hasPast })
  greeter.querySelector('.greeter-title').textContent = title
  greeter.querySelector('.greeter-body').textContent = body
  greeter.querySelector('.greeter-tour').hidden = !$('#tour-open')
}

// ---------------------------------------------------------------------------
// Lost connection

let card = null
let tries = 0
let since = 0
let showTimer = 0
let tickTimer = 0
let retryAt = 0
let retryFn = null
let counting = false

function mountCard() {
  card = document.createElement('section')
  card.id = 'offline'
  card.className = 'hud paper'
  card.setAttribute('role', 'status')
  card.hidden = true
  card.innerHTML = `
    <p class="eyebrow">Connection</p>
    <b class="offline-title">The office lost touch with its bridge</b>
    <p class="offline-body">The bridge is the small helper on your computer that tells this page what Claude is doing. It may have stopped, or your computer may have slept. Nothing is lost: your sessions keep working without it.</p>
    <p class="offline-try"><i></i><span class="offline-count">Trying again…</span><button type="button" class="offline-now">Try now</button></p>
    <p class="offline-help">Still stuck? Type <code>/office</code> in Claude Code to start it again.</p>`
  $('.stage-wrap').append(card)
  card.querySelector('.offline-now').addEventListener('click', () => retry())
}

function tick() {
  const left = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000))
  card.querySelector('.offline-count').textContent = left ? `Trying again in ${left}s` : 'Trying again…'
  card.querySelector('.offline-title').textContent = Date.now() - since > 60000 ? 'The bridge seems to have stopped' : 'The office lost touch with its bridge'
}

function retry() {
  clearTimeout(tickTimer)
  counting = false
  const fn = retryFn
  retryFn = null
  tries++
  if (card) card.querySelector('.offline-count').textContent = 'Trying again…'
  if (fn) fn()
  else lost()
}

// The stream dropped. `again` reconnects (main.js closes the old stream and
// opens a new one); it runs after a backoff unless the stream comes back on
// its own first. A preview (?offline=1) passes no `again` and stays down.
export function lost(again) {
  if (!card) mountCard()
  if (!since) {
    since = Date.now()
    tries = 0
    showTimer = setTimeout(() => { card.hidden = false; tick() }, CALM_MS)
  }
  retryFn = again ?? null
  // The browser's own retries report in too; they don't restart the count.
  if (counting) return
  counting = true
  retryAt = Date.now() + backoff(tries + 1) * 1000
  const loop = () => {
    if (!card.hidden) tick()
    if (Date.now() >= retryAt) {
      counting = false
      if (retryFn) return retry()
      counting = true
      tries++
      retryAt = Date.now() + backoff(tries + 1) * 1000
    }
    tickTimer = setTimeout(loop, 500)
  }
  tickTimer = setTimeout(loop, 500)
}

// The stream is back.
export function found() {
  since = 0
  tries = 0
  retryFn = null
  counting = false
  clearTimeout(showTimer)
  clearTimeout(tickTimer)
  if (card) card.hidden = true
}
