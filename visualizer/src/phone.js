// The office on a phone: built for a quick look. Three views under a tab
// bar at the bottom of the screen:
//
//   Inbox     what's waiting on you first, as big cards you can answer with
//             a thumb, then what was made today, then a small live office
//             you tap to open full screen
//   Office    the live office, full screen
//   Projects  the directory, and the clipboard for a thread you pick
//
// It's the same page, rearranged: index.html lays each view out from
// `<html data-phone="inbox|office|projects">`, and this module moves the
// office's canvas into the Inbox's little window and back.

import { outputs, sid, nodes } from './model.js'
import { outputCard } from './assets.js'

const PHONE = '(max-width: 600px)'
const TODAY_KEEP = 6
const media = typeof matchMedia === 'function' ? matchMedia(PHONE) : { matches: false, addEventListener() {} }
let view = 'inbox'
let onChange = () => {}

export const isPhone = () => media.matches
export const current = () => (media.matches ? view : null)
// Whether the office is on screen at all: hidden behind Projects on a phone.
export const sceneShown = () => !media.matches || view !== 'projects'
// Whether the office is the small window in the Inbox.
export const isMini = () => media.matches && view === 'inbox'

// What was made since midnight, newest first: pictures and deliveries (the
// files it changed are a count, not cards).
export function today(list, now = Date.now()) {
  const midnight = new Date(now)
  midnight.setHours(0, 0, 0, 0)
  const made = list.filter(o => o.t >= midnight.getTime())
  return {
    pictures: made.filter(o => o.type === 'image'),
    delivered: made.filter(o => o.type !== 'image' && o.type !== 'file'),
    files: made.filter(o => o.type === 'file').length,
  }
}

function place() {
  const stage = document.getElementById('stage')
  const slot = document.getElementById('mini-slot')
  const wrap = document.querySelector('.stage-wrap')
  if (!stage || !slot || !wrap) return
  if (isMini()) {
    if (stage.parentElement !== slot) slot.prepend(stage)
  } else if (stage.parentElement !== wrap) {
    wrap.prepend(stage)
  }
}

function apply() {
  const root = document.documentElement
  if (media.matches) root.dataset.phone = view
  else delete root.dataset.phone
  place()
  for (const b of document.querySelectorAll('[data-phone-tab]')) {
    if (b.dataset.phoneTab === view) b.setAttribute('aria-current', 'page')
    else b.removeAttribute('aria-current')
  }
  onChange()
}

export function show(next) {
  if (!['inbox', 'office', 'projects'].includes(next)) return
  const was = view
  view = next
  apply()
  // A new view starts at its top.
  if (was !== next) document.querySelector(next === 'projects' ? '#side' : '.hud.left')?.scrollTo?.(0, 0)
}

export function mount({ changed = () => {} } = {}) {
  onChange = changed
  for (const b of document.querySelectorAll('[data-phone-tab]')) b.addEventListener('click', () => show(b.dataset.phoneTab))
  document.getElementById('mini-open')?.addEventListener('click', () => show('office'))
  media.addEventListener?.('change', apply)
  apply()
}

// The Inbox's "Made today" list and the tab bar's count. Cheap enough to
// run with every panel refresh; it only writes when the words change.
let todayHtml = ''
export function render() {
  if (!media.matches) return
  const { pictures, delivered, files } = today(outputs)
  const where = o => nodes.get(sid(o.session))
  const html = pictures.length || delivered.length || files
    ? `${pictures.length ? `<div class="gallery">${pictures.slice(0, 3).map(o => outputCard(o, { withThread: true })).join('')}</div>` : ''}
      ${delivered.length ? `<div class="outs">${delivered.slice(0, TODAY_KEEP).map(o => outputCard(o, { withThread: Boolean(where(o)) })).join('')}</div>` : ''}
      ${files ? `<p class="today-files">${files} ${files === 1 ? 'file' : 'files'} changed today</p>` : ''}`
    : '<p class="muted">Nothing made yet today. Pictures, pull requests and artifacts land here as they happen.</p>'
  if (html !== todayHtml) {
    todayHtml = html
    const el = document.getElementById('today-list')
    if (el) el.innerHTML = html
  }
  const count = document.getElementById('inbox-count')?.textContent ?? ''
  const badge = document.getElementById('phone-inbox-count')
  if (badge && badge.textContent !== count) {
    badge.textContent = count
    badge.closest('button')?.setAttribute('aria-label', count ? `Inbox, ${count} waiting on you` : 'Inbox')
  }
}
